import "server-only";
import { getQuestions, getSkill } from "./catalog";
import { prisma } from "./db";
import { customToQuestion } from "./planning";
import type { PracticeQuestion } from "@/components/PracticeEngine";

/** Built-in questions for a subskill, without answers or explanations. */
export function practiceQuestions(skillId: string, subskillId: string): PracticeQuestion[] {
  const skill = getSkill(skillId);
  const sub = skill?.subskills.find((s) => s.id === subskillId);
  if (!skill || !sub) return [];
  return getQuestions(skillId, subskillId).map((q) => ({
    id: q.id, skillId, subskillId, skillName: skill.name, subskillName: sub.name,
    question: q.question, options: q.options, difficulty: q.difficulty, kind: q.kind,
  }));
}

/** Built-in plus admin-authored questions. */
export async function loadPracticeQuestions(skillId: string, subskillId: string): Promise<PracticeQuestion[]> {
  const base = practiceQuestions(skillId, subskillId);
  const skill = getSkill(skillId);
  const sub = skill?.subskills.find((s) => s.id === subskillId);
  if (!skill || !sub) return base;
  const rows = await prisma.customQuestion.findMany({ where: { skillId, subskillId } });
  const extra = rows.map((row) => {
    const q = customToQuestion(row);
    return {
      id: q.id, skillId, subskillId, skillName: skill.name, subskillName: sub.name,
      question: q.question, options: q.options, difficulty: q.difficulty, kind: q.kind,
    };
  });
  return [...base, ...extra];
}
