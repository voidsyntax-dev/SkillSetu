// Pure mastery maths shared by server and client: forgetting-curve decay,
// risk classification and the per-answer score update.

import type { DecayRisk, SubskillMastery } from "@/types";

/** Daily decay rate λ in mastery = m·e^(−λt). λ = 0.035 gives a ~20 day half-life. */
export const DECAY_LAMBDA = 0.035;
/** Days after practice before decay starts. */
export const GRACE_DAYS = 1;
/** Mastery at which a subskill counts as mastered. */
export const MASTERY_THRESHOLD = 80;

const DAY_MS = 86_400_000;

export function daysSince(iso: string, now = Date.now()): number {
  return Math.max(0, (now - new Date(iso).getTime()) / DAY_MS);
}

export function effectiveScore(m: Pick<SubskillMastery, "score" | "lastPracticedAt">, now = Date.now()): number {
  const idle = Math.max(0, daysSince(m.lastPracticedAt, now) - GRACE_DAYS);
  return Math.round(m.score * Math.exp(-DECAY_LAMBDA * idle));
}

export function decayRisk(effective: number, stored: number): DecayRisk {
  const lost = stored - effective;
  if (effective < 40 || lost >= 20) return "high";
  if (effective < 70 || lost >= 8) return "medium";
  return "stable";
}

/** Days until an effective score decays below a threshold if not practised. */
export function daysUntilBelow(score: number, threshold: number): number | null {
  if (score <= threshold) return 0;
  return Math.ceil(Math.log(score / threshold) / DECAY_LAMBDA);
}

const DIFFICULTY_MULTIPLIER = { 1: 1, 2: 1.25, 3: 1.5 } as const;

/**
 * New mastery after one answer. Gains shrink as mastery approaches 100,
 * grow with difficulty and with a run of correct answers, and get a small
 * bonus for quick answers. Wrong answers cost more at high mastery.
 */
export function applyAnswer(params: {
  current: number;
  streak: number;
  correct: boolean;
  difficulty: 1 | 2 | 3;
  timeTakenMs: number;
}): { score: number; delta: number } {
  const { current, streak, correct, difficulty, timeTakenMs } = params;
  const mult = DIFFICULTY_MULTIPLIER[difficulty];
  let next: number;
  if (correct) {
    const streakBonus = 1 + 0.08 * Math.min(streak, 5);
    const speedBonus = timeTakenMs < 20_000 ? 1.1 : 1;
    const headroom = Math.pow(1 - current / 100, 0.7);
    next = Math.min(100, current + 12 * mult * streakBonus * speedBonus * headroom);
  } else {
    next = Math.max(0, current - (4 + current * 0.08) / mult);
  }
  const score = Math.round(next * 10) / 10;
  return { score, delta: Math.round((score - current) * 10) / 10 };
}

export function masteryLabel(score: number): string {
  if (score >= 90) return "Expert";
  if (score >= MASTERY_THRESHOLD) return "Mastered";
  if (score >= 60) return "Proficient";
  if (score >= 30) return "Developing";
  if (score > 0) return "Beginner";
  return "Not started";
}

export function formatDay(date: Date): string {
  // YYYY-MM-DD in the server's local time zone.
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
