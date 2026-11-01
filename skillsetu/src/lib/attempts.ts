import "server-only";
// Records one answered question: mastery, streak (with streak freezes), daily
// activity, proofs and badges. Shared by practice, numericals, and daily question.

import { createHash } from "node:crypto";
import { prisma } from "./db";
import { getSkill } from "./catalog";
import { BADGES, type BadgeStats } from "./badges";
import { branchesTouched, getMasteryStore, skillScore } from "./insights";
import { applyAnswer, effectiveScore, formatDay, MASTERY_THRESHOLD } from "./mastery";

export function shiftDay(day: string, n: number) {
  const d = new Date(day + "T00:00:00");
  d.setDate(d.getDate() + n);
  return formatDay(d);
}

export interface AttemptInput {
  userId: string;
  questionId: string;
  skillId: string;
  subskillId: string;
  correct: boolean;
  difficulty: 1 | 2 | 3;
  timeTakenMs: number;
}

export interface AttemptOutcome {
  previousScore: number;
  newScore: number;
  delta: number;
  newBadges: { code: string; name: string; icon: string }[];
  newProof: string | null;
  dailyCount: number;
  dailyGoal: number;
}

export async function recordAttempt(input: AttemptInput): Promise<AttemptOutcome> {
  const { userId, skillId, subskillId, correct, difficulty, timeTakenMs } = input;
  const now = new Date();
  const key = { userId_skillId_subskillId: { userId, skillId, subskillId } };

  const existing = await prisma.subskillState.findUnique({ where: key });
  const previousScore = existing
    ? effectiveScore({ score: existing.score, lastPracticedAt: existing.lastPracticedAt.toISOString() })
    : 0;
  const { score, delta } = applyAnswer({ current: previousScore, streak: existing?.streak ?? 0, correct, difficulty, timeTakenMs });

  const state = await prisma.subskillState.upsert({
    where: key,
    create: { userId, skillId, subskillId, score, lastPracticedAt: now, attemptCount: 1, correctCount: correct ? 1 : 0, streak: correct ? 1 : 0 },
    update: {
      score, lastPracticedAt: now, attemptCount: { increment: 1 },
      correctCount: { increment: correct ? 1 : 0 }, streak: correct ? { increment: 1 } : 0,
    },
  });

  await prisma.attempt.create({
    data: { userId, questionId: input.questionId, skillId, subskillId, isCorrect: correct, timeTakenMs: Math.max(0, Math.min(timeTakenMs | 0, 1800000)), gain: delta },
  });

  const day = formatDay(now);
  const activity = await prisma.dailyActivity.upsert({
    where: { userId_day: { userId, day } },
    create: { userId, day, questionsAnswered: 1, correctAnswers: correct ? 1 : 0, masteryGained: Math.max(0, delta) },
    update: { questionsAnswered: { increment: 1 }, correctAnswers: { increment: correct ? 1 : 0 }, masteryGained: { increment: Math.max(0, delta) } },
  });

  const user = await updateStreak(userId, day);
  const newProof = await maybeIssueProofs(userId, skillId, subskillId, state);
  const newBadges = await awardBadges(userId, user.longestStreak);

  return {
    previousScore, newScore: Math.round(score), delta, newBadges, newProof,
    dailyCount: activity.questionsAnswered, dailyGoal: user.dailyGoal,
  };
}

/** Consecutive-day streak. One missed day is covered by a freeze (earned every 7 days, max 2). */
async function updateStreak(userId: string, today: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.lastActiveDay === today) return user;
  const yesterday = shiftDay(today, -1);
  const dayBefore = shiftDay(today, -2);
  let current = 1;
  let freezes = user.streakFreezes;
  if (user.lastActiveDay === yesterday) current = user.currentStreak + 1;
  else if (user.lastActiveDay === dayBefore && freezes > 0) {
    current = user.currentStreak + 1;
    freezes -= 1;
  }
  if (current % 7 === 0 && freezes < 2) freezes += 1;
  return prisma.user.update({
    where: { id: userId },
    data: { currentStreak: current, longestStreak: Math.max(user.longestStreak, current), lastActiveDay: today, streakFreezes: freezes },
  });
}

function proofHash(parts: (string | number)[]) {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}

async function maybeIssueProofs(
  userId: string, skillId: string, subskillId: string,
  state: { score: number; attemptCount: number; correctCount: number },
): Promise<string | null> {
  const skill = getSkill(skillId);
  const sub = skill?.subskills.find((s) => s.id === subskillId);
  if (!skill || !sub) return null;
  const accuracy = Math.round((state.correctCount / state.attemptCount) * 100);
  if (state.score < MASTERY_THRESHOLD || state.attemptCount < 5 || accuracy < 70) return null;

  let issued: string | null = null;
  const subProof = await prisma.proof.findFirst({ where: { userId, kind: "SUBSKILL", skillId, subskillId } });
  if (!subProof) {
    const now = new Date();
    await prisma.proof.create({
      data: {
        userId, kind: "SUBSKILL", skillId, subskillId,
        title: `${sub.name} — Mastery`,
        description: `Reached ${Math.round(state.score)}% mastery in ${sub.name} (${skill.name}) with ${accuracy}% accuracy over ${state.attemptCount} attempts.`,
        score: Math.round(state.score), accuracy, attempts: state.attemptCount,
        hash: proofHash([userId, skillId, subskillId, state.score, now.toISOString()]),
      },
    });
    issued = `${sub.name} mastery`;
  }

  const store = await getMasteryStore(userId);
  const allMastered = skill.subskills.every((ss) => {
    const m = store[`${skillId}:${ss.id}`];
    return m ? effectiveScore(m) >= MASTERY_THRESHOLD : false;
  });
  if (allMastered && !(await prisma.proof.findFirst({ where: { userId, kind: "SKILL", skillId } }))) {
    const states = skill.subskills.map((ss) => store[`${skillId}:${ss.id}`]);
    const attempts = states.reduce((n, s) => n + s.attemptCount, 0);
    const correctN = states.reduce((n, s) => n + s.correctCount, 0);
    await prisma.proof.create({
      data: {
        userId, kind: "SKILL", skillId, subskillId: "",
        title: `${skill.name} — Skill Certificate`,
        description: `Mastered all ${skill.subskills.length} subskills of ${skill.name}.`,
        score: Math.round(skillScore(store, skill)), accuracy: Math.round((correctN / attempts) * 100), attempts,
        hash: proofHash([userId, skillId, "SKILL", attempts, new Date().toISOString()]),
      },
    });
    issued = `${skill.name} skill certificate`;
  }
  return issued;
}

async function awardBadges(userId: string, longestStreak: number) {
  const [answered, correct, store, owned] = await Promise.all([
    prisma.attempt.count({ where: { userId } }),
    prisma.attempt.count({ where: { userId, isCorrect: true } }),
    getMasteryStore(userId),
    prisma.badge.findMany({ where: { userId }, select: { code: true } }),
  ]);
  const states = Object.values(store);
  const skillsPracticed = new Set(states.map((s) => s.skillId));
  const stats: BadgeStats = {
    answered, correct, longestStreak,
    bestRun: Math.max(0, ...states.map((s) => s.streak)),
    subskillsMastered: states.filter((s) => effectiveScore(s) >= MASTERY_THRESHOLD).length,
    skillsMastered: [...skillsPracticed].filter((id) => {
      const skill = getSkill(id);
      return !!skill && skill.subskills.every((ss) => {
        const m = store[`${id}:${ss.id}`];
        return !!m && effectiveScore(m) >= MASTERY_THRESHOLD;
      });
    }).length,
    skillsPracticed: skillsPracticed.size,
    branchesTouched: branchesTouched(store),
  };
  const have = new Set(owned.map((b) => b.code));
  const fresh = BADGES.filter((b) => !have.has(b.code) && b.earned(stats));
  if (fresh.length) await prisma.badge.createMany({ data: fresh.map((b) => ({ userId, code: b.code })) });
  return fresh.map((b) => ({ code: b.code, name: b.name, icon: b.icon }));
}
