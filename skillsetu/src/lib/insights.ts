import "server-only";
// Server-side reads and analytics over a user's mastery state.

import { prisma } from "./db";
import {
  getBranch, getBranchSkills, getCareer, getCareers, getInternships, getSkill, getSkills,
  topoSort, getBranchesForSkill,
} from "./catalog";
import { MASTERY_THRESHOLD, decayRisk, effectiveScore, formatDay } from "./mastery";
import type { Career, DecayRisk, Internship, MasteryStore, Skill } from "@/types";

const key = (skillId: string, subskillId: string) => `${skillId}:${subskillId}`;

export async function getMasteryStore(userId: string | null): Promise<MasteryStore> {
  if (!userId) return {};
  const rows = await prisma.subskillState.findMany({ where: { userId } });
  const store: MasteryStore = {};
  for (const r of rows) {
    store[key(r.skillId, r.subskillId)] = {
      skillId: r.skillId, subskillId: r.subskillId, score: r.score,
      lastPracticedAt: r.lastPracticedAt.toISOString(), attemptCount: r.attemptCount,
      correctCount: r.correctCount, streak: r.streak,
    };
  }
  return store;
}

export function subskillScore(store: MasteryStore, skillId: string, subskillId: string): number {
  const m = store[key(skillId, subskillId)];
  return m ? effectiveScore(m) : 0;
}

/** Average effective mastery across all subskills of a skill (unpractised = 0). */
export function skillScore(store: MasteryStore, skill: Skill): number {
  if (skill.subskills.length === 0) return 0;
  const total = skill.subskills.reduce((n, ss) => n + subskillScore(store, skill.id, ss.id), 0);
  return Math.round(total / skill.subskills.length);
}

export function isSkillPracticed(store: MasteryStore, skillId: string) {
  return Object.values(store).some((m) => m.skillId === skillId);
}

// ─── Career fit ─────────────────────────────────────────────────────────────

export interface CareerFit {
  career: Career;
  fit: number;
  skills: { skill: Skill; score: number; weight: number }[];
  gaps: { skill: Skill; score: number; weight: number }[];
}

export function careerFit(store: MasteryStore, career: Career): CareerFit {
  const rows = career.skills
    .map((cs) => ({ skill: getSkill(cs.id)!, weight: cs.weight }))
    .filter((r) => r.skill)
    .map((r) => ({ ...r, score: skillScore(store, r.skill) }));
  const totalWeight = rows.reduce((n, r) => n + r.weight, 0) || 1;
  const fit = Math.round(rows.reduce((n, r) => n + r.score * r.weight, 0) / totalWeight);
  const gaps = rows
    .filter((r) => r.score < 70)
    .sort((a, b) => b.weight * (100 - b.score) - a.weight * (100 - a.score));
  return { career, fit, skills: rows, gaps };
}

export function allCareerFits(store: MasteryStore): CareerFit[] {
  return getCareers().map((c) => careerFit(store, c)).sort((a, b) => b.fit - a.fit);
}

// ─── Decay alerts & daily plan ──────────────────────────────────────────────

export interface SubskillStatus {
  skillId: string;
  subskillId: string;
  skillName: string;
  subskillName: string;
  stored: number;
  effective: number;
  risk: DecayRisk;
  accuracy: number;
  lastPracticedAt: string;
}

export function subskillStatuses(store: MasteryStore): SubskillStatus[] {
  const out: SubskillStatus[] = [];
  for (const m of Object.values(store)) {
    const skill = getSkill(m.skillId);
    const sub = skill?.subskills.find((s) => s.id === m.subskillId);
    if (!skill || !sub) continue;
    const effective = effectiveScore(m);
    out.push({
      skillId: skill.id, subskillId: sub.id, skillName: skill.name, subskillName: sub.name,
      stored: Math.round(m.score), effective, risk: decayRisk(effective, m.score),
      accuracy: m.attemptCount ? Math.round((m.correctCount / m.attemptCount) * 100) : 0,
      lastPracticedAt: m.lastPracticedAt,
    });
  }
  return out;
}

export interface PlanItem {
  skillId: string;
  subskillId: string;
  skillName: string;
  subskillName: string;
  reason: string;
  kind: "revise" | "strengthen" | "learn";
  score: number;
}

/**
 * Recommends what to study today: first revise decaying subskills, then
 * strengthen weak ones, then start the next unlearned subskill on the
 * user's roadmap (target career, else branch curriculum).
 */
export function dailyPlan(store: MasteryStore, opts: { targetCareerId?: string | null; branchId?: string | null }, size = 5): PlanItem[] {
  const plan: PlanItem[] = [];
  const statuses = subskillStatuses(store);

  const decaying = statuses
    .filter((s) => s.stored - s.effective >= 5 && s.effective < MASTERY_THRESHOLD + 10)
    .sort((a, b) => b.stored - b.effective - (a.stored - a.effective));
  for (const s of decaying.slice(0, 2)) {
    plan.push({ ...pick(s), kind: "revise", score: s.effective, reason: `Dropped ${s.stored - s.effective}% since last practice` });
  }

  const weak = statuses
    .filter((s) => s.effective < 60 && !plan.some((p) => p.skillId === s.skillId && p.subskillId === s.subskillId))
    .sort((a, b) => a.effective - b.effective);
  for (const s of weak.slice(0, 2)) {
    plan.push({ ...pick(s), kind: "strengthen", score: s.effective, reason: `Only ${s.effective}% mastery, ${s.accuracy}% accuracy` });
  }

  const roadmap = roadmapSkillIds(opts);
  outer: for (const skillId of roadmap) {
    const skill = getSkill(skillId);
    if (!skill) continue;
    // Respect prerequisites: only suggest skills whose prerequisites are started.
    const prereqsStarted = skill.dependsOn.every((d) => !roadmap.includes(d) || isSkillPracticed(store, d));
    if (!prereqsStarted) continue;
    for (const ss of skill.subskills) {
      if (plan.length >= size) break outer;
      if (store[key(skill.id, ss.id)]) continue;
      plan.push({
        skillId: skill.id, subskillId: ss.id, skillName: skill.name, subskillName: ss.name,
        kind: "learn", score: 0, reason: "Next on your roadmap",
      });
      break; // one new subskill per skill keeps the plan varied
    }
  }

  return plan.slice(0, size);
}

function pick(s: SubskillStatus) {
  return { skillId: s.skillId, subskillId: s.subskillId, skillName: s.skillName, subskillName: s.subskillName };
}

function roadmapSkillIds(opts: { targetCareerId?: string | null; branchId?: string | null }): string[] {
  const career = opts.targetCareerId ? getCareer(opts.targetCareerId) : undefined;
  if (career) return topoSort(career.skills.map((s) => s.id));
  if (opts.branchId && getBranch(opts.branchId)) return getBranchSkills(opts.branchId).map((s) => s.id);
  return topoSort(getSkills().filter((s) => s.category === "foundation").map((s) => s.id));
}

// ─── Activity ───────────────────────────────────────────────────────────────

export interface DayActivity {
  day: string;
  answered: number;
  correct: number;
  gained: number;
}

export async function getActivity(userId: string | null, days: number): Promise<DayActivity[]> {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  const rows = userId
    ? await prisma.dailyActivity.findMany({ where: { userId, day: { gte: formatDay(since) } } })
    : [];
  const byDay = new Map(rows.map((r) => [r.day, r]));
  const out: DayActivity[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const day = formatDay(d);
    const r = byDay.get(day);
    out.push({ day, answered: r?.questionsAnswered ?? 0, correct: r?.correctAnswers ?? 0, gained: Math.round((r?.masteryGained ?? 0) * 10) / 10 });
  }
  return out;
}

// ─── Mistake book ───────────────────────────────────────────────────────────

/**
 * Questions whose most recent attempt was wrong — i.e. mistakes not yet
 * corrected — newest first.
 */
export async function getOpenMistakes(userId: string | null, limit = 60) {
  if (!userId) return [];
  const attempts = await prisma.attempt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 2000,
    select: { questionId: true, isCorrect: true, createdAt: true },
  });
  const latest = new Map<string, { isCorrect: boolean; createdAt: Date; wrongCount: number }>();
  for (const a of attempts) {
    const seen = latest.get(a.questionId);
    if (!seen) latest.set(a.questionId, { isCorrect: a.isCorrect, createdAt: a.createdAt, wrongCount: a.isCorrect ? 0 : 1 });
    else if (!a.isCorrect) seen.wrongCount++;
  }
  return [...latest.entries()]
    .filter(([, v]) => !v.isCorrect)
    .slice(0, limit)
    .map(([questionId, v]) => ({ questionId, lastWrongAt: v.createdAt, wrongCount: v.wrongCount }));
}

// ─── Branch progress ────────────────────────────────────────────────────────

export function branchProgress(store: MasteryStore, branchId: string): number {
  const skills = getBranchSkills(branchId);
  if (!skills.length) return 0;
  return Math.round(skills.reduce((n, s) => n + skillScore(store, s), 0) / skills.length);
}

export function branchesTouched(store: MasteryStore): number {
  const touched = new Set<string>();
  for (const m of Object.values(store)) {
    const skill = getSkill(m.skillId);
    if (!skill || skill.category === "foundation") continue;
    for (const b of getBranchesForSkill(m.skillId)) touched.add(b.id);
  }
  return touched.size;
}

// ─── Internship matching ────────────────────────────────────────────────────

export interface InternshipMatch {
  internship: Internship;
  readiness: number;
  eligible: boolean;
  requirements: { skill: Skill; required: number; current: number; met: boolean }[];
}

export function matchInternships(store: MasteryStore): InternshipMatch[] {
  return getInternships()
    .map((internship) => {
      const requirements = internship.requirements
        .map((r) => {
          const skill = getSkill(r.skillId);
          if (!skill) return null;
          const current = skillScore(store, skill);
          return { skill, required: r.minMastery, current, met: current >= r.minMastery };
        })
        .filter((r): r is NonNullable<typeof r> => !!r);
      const readiness = Math.round(
        (requirements.reduce((n, r) => n + Math.min(1, r.current / r.required), 0) / (requirements.length || 1)) * 100,
      );
      return { internship, readiness, eligible: requirements.every((r) => r.met), requirements };
    })
    .sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.readiness - a.readiness);
}
