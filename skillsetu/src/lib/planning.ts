import "server-only";
// Planning and analytics over a learner's data: question lookup (built-in and
// admin-authored), GATE sets, the daily question, due reviews, weekly report,
// analytics, exam plans and group leaderboards.

import { prisma } from "./db";
import { getBranch, getBranchSkills, getQuestion, getQuestions, getSkill, getSkills } from "./catalog";
import { daysSince, effectiveScore, formatDay } from "./mastery";
import { ENGINEERING_TEMPLATES, numericId } from "./numerics";
import { hashString, makeRand, shuffle } from "./rand";
import { shiftDay } from "./attempts";
import { skillScore } from "./insights";
import type { MasteryStore, Question, Skill } from "@/types";

// ─── Questions ──────────────────────────────────────────────────────────────

type CustomRow = {
  id: string; skillId: string; subskillId: string; question: string; answer: string;
  distractors: string; explanation: string; difficulty: number;
};

/** Admin-authored questions use ids "custom:<id>" and a stable option order. */
export function customToQuestion(row: CustomRow): Question {
  const id = `custom:${row.id}`;
  const wrong: string[] = JSON.parse(row.distractors);
  return {
    id, skillId: row.skillId, subskillId: row.subskillId, kind: "applied",
    question: row.question, options: shuffle([row.answer, ...wrong], hashString(id)),
    answer: row.answer, explanation: row.explanation, difficulty: row.difficulty as 1 | 2 | 3,
  };
}

export async function resolveQuestion(id: string): Promise<Question | undefined> {
  if (!id.startsWith("custom:")) return getQuestion(id);
  const row = await prisma.customQuestion.findUnique({ where: { id: id.slice(7) } });
  return row ? customToQuestion(row) : undefined;
}

// ─── GATE-style sets ────────────────────────────────────────────────────────

export function branchSkills(branchId: string | null): Skill[] {
  return branchId && getBranch(branchId) ? getBranchSkills(branchId) : getSkills();
}

export function mcqPool(branchId: string | null): string[] {
  return branchSkills(branchId).flatMap((s) => s.subskills.flatMap((ss) => getQuestions(s.id, ss.id).map((q) => q.id)));
}

/** 25 multiple-choice questions (1 mark, −1/3 if wrong) and 5 numericals (2 marks, no negative). */
export function gateSet(branchId: string | null, seed: number): { id: string; kind: "mcq" | "nat" }[] {
  const skills = branchSkills(branchId);
  const mcq = shuffle(mcqPool(branchId), seed).slice(0, 25);
  const own = ENGINEERING_TEMPLATES.filter((t) => skills.some((s) => s.id === t.skillId));
  const natPool = own.length ? own : ENGINEERING_TEMPLATES;
  const r = makeRand(seed + 1);
  const nat = Array.from({ length: 5 }, (_, i) => numericId(natPool[r(0, natPool.length - 1)].id, seed * 97 + i + 1));
  return [...mcq.map((id) => ({ id, kind: "mcq" as const })), ...nat.map((id) => ({ id, kind: "nat" as const }))];
}

// ─── Daily question ─────────────────────────────────────────────────────────

/** The same question for everyone in a branch on a given day. */
export function dailyQuestionId(day: string, branchId: string | null): string {
  const pool = mcqPool(branchId);
  return pool.length ? pool[hashString(day) % pool.length] : "";
}

// ─── Spaced repetition ──────────────────────────────────────────────────────

/** Days until a subskill should be revisited, based on how well it is known. */
export function intervalDays(score: number) {
  return score >= 90 ? 21 : score >= 80 ? 10 : score >= 60 ? 4 : score >= 40 ? 2 : 1;
}

export function dueSubskills(store: MasteryStore) {
  return Object.values(store)
    .map((m) => {
      const skill = getSkill(m.skillId);
      const sub = skill?.subskills.find((s) => s.id === m.subskillId);
      const idle = daysSince(m.lastPracticedAt);
      const interval = intervalDays(m.score);
      return {
        skillId: m.skillId, subskillId: m.subskillId,
        skillName: skill?.name ?? m.skillId, subskillName: sub?.name ?? m.subskillId,
        idle: Math.floor(idle), interval, overdue: idle - interval, effective: effectiveScore(m),
      };
    })
    .filter((x) => x.overdue >= 0 && x.effective < 95)
    .sort((a, b) => b.overdue - a.overdue);
}

// ─── Weekly report & analytics ──────────────────────────────────────────────

export async function weeklyReport(userId: string) {
  const today = formatDay(new Date());
  const from = shiftDay(today, -13);
  const rows = await prisma.dailyActivity.findMany({ where: { userId, day: { gte: from } } });
  const sum = (lo: string, hi: string) =>
    rows
      .filter((r) => r.day >= lo && r.day <= hi)
      .reduce((a, r) => ({ answered: a.answered + r.questionsAnswered, correct: a.correct + r.correctAnswers, gained: a.gained + r.masteryGained }), { answered: 0, correct: 0, gained: 0 });
  const thisWeek = sum(shiftDay(today, -6), today);
  const lastWeek = sum(from, shiftDay(today, -7));
  return {
    answered: thisWeek.answered,
    accuracy: thisWeek.answered ? Math.round((thisWeek.correct / thisWeek.answered) * 100) : 0,
    gained: Math.round(thisWeek.gained * 10) / 10,
    answeredChange: thisWeek.answered - lastWeek.answered,
  };
}

export async function analytics(userId: string) {
  const rows = await prisma.attempt.findMany({
    where: { userId }, orderBy: { createdAt: "desc" }, take: 3000,
    select: { questionId: true, skillId: true, isCorrect: true, timeTakenMs: true },
  });
  const total = rows.length;
  const correct = rows.filter((r) => r.isCorrect).length;
  const avgMs = total ? rows.reduce((n, r) => n + r.timeTakenMs, 0) / total : 0;
  const bySkill = new Map<string, { name: string; total: number; correct: number }>();
  const byDifficulty: Record<string, { total: number; correct: number }> = { "1": { total: 0, correct: 0 }, "2": { total: 0, correct: 0 }, "3": { total: 0, correct: 0 } };
  for (const r of rows) {
    const s = bySkill.get(r.skillId) ?? { name: getSkill(r.skillId)?.name ?? r.skillId, total: 0, correct: 0 };
    s.total++;
    if (r.isCorrect) s.correct++;
    bySkill.set(r.skillId, s);
    const d = getQuestion(r.questionId)?.difficulty;
    if (d) {
      byDifficulty[String(d)].total++;
      if (r.isCorrect) byDifficulty[String(d)].correct++;
    }
  }
  return {
    total,
    accuracy: total ? Math.round((correct / total) * 100) : 0,
    avgSeconds: Math.round((avgMs / 1000) * 10) / 10,
    bySkill: [...bySkill.values()]
      .map((s) => ({ ...s, accuracy: Math.round((s.correct / s.total) * 100) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10),
    byDifficulty,
  };
}

// ─── Exam planner ───────────────────────────────────────────────────────────

export function examPlanView(plan: { examName: string; examDay: string; skillIds: string[] }, store: MasteryStore) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(plan.examDay + "T00:00:00");
  const daysLeft = Math.max(0, Math.ceil((exam.getTime() - today.getTime()) / 86400000));
  const rows = plan.skillIds
    .map((id) => getSkill(id))
    .filter((s): s is Skill => !!s)
    .map((skill) => ({ skill, score: skillScore(store, skill) }));
  const gap = rows.reduce((n, r) => n + Math.max(0, 80 - r.score), 0);
  const questionsNeeded = Math.ceil(gap / 10); // roughly 10 mastery points per question
  const perDay = daysLeft ? Math.ceil(questionsNeeded / daysLeft) : questionsNeeded;
  const weakFirst = [...rows].sort((a, b) => a.score - b.score);
  const days = Math.min(7, Math.max(daysLeft, 1));
  const schedule = Array.from({ length: days }, (_, d) => {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    return { day: formatDay(date), focus: weakFirst.length ? weakFirst[d % weakFirst.length].skill.name : "—", questions: perDay };
  });
  return { daysLeft, questionsNeeded, perDay, rows, schedule };
}

// ─── Groups ─────────────────────────────────────────────────────────────────

/** Correct answers in the last 7 days, per user. */
export async function groupXP(userIds: string[]): Promise<Map<string, number>> {
  if (!userIds.length) return new Map();
  const since = new Date(Date.now() - 7 * 86400000);
  const rows = await prisma.attempt.groupBy({
    by: ["userId"],
    where: { userId: { in: userIds }, isCorrect: true, createdAt: { gte: since } },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.userId, r._count._all]));
}
