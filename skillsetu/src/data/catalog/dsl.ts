// Compact authoring helpers for the catalog. Content files describe skills as
// plain tuples so thousands of concepts stay readable and easy to extend.

import type { AuthoredQuestion, Skill, SkillCategory, SkillLevel, Subskill } from "@/types";

/** [term, definition] */
export type ConceptTuple = [string, string];
/** [question, answer, distractors, explanation, difficulty?] */
export type QuestionTuple = [string, string, string[], string, (1 | 2 | 3)?];

export function sub(
  id: string,
  name: string,
  summary: string,
  concepts: ConceptTuple[],
  questions: QuestionTuple[] = [],
): Subskill {
  return {
    id,
    name,
    summary,
    concepts: concepts.map(([term, definition]) => ({ term, definition })),
    questions: questions.map(
      ([question, answer, distractors, explanation, difficulty]): AuthoredQuestion => ({
        question,
        answer,
        distractors,
        explanation,
        difficulty: difficulty ?? 2,
      }),
    ),
  };
}

interface SkillMeta {
  level: SkillLevel;
  category?: SkillCategory;
  deps?: string[];
  book?: string;
}

export function skill(
  id: string,
  name: string,
  description: string,
  meta: SkillMeta,
  subskills: Subskill[],
): Skill {
  return {
    id,
    name,
    description,
    level: meta.level,
    category: meta.category ?? "core",
    dependsOn: meta.deps ?? [],
    book: meta.book,
    subskills,
  };
}
