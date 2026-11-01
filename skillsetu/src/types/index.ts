// ─── Catalog ────────────────────────────────────────────────────────────────

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type SkillLevel = 1 | 2 | 3 | 4; // roughly the year of study it is usually taught
export type SkillCategory = "foundation" | "core" | "elective" | "tools";

export interface Branch {
  id: string;
  name: string;
  short: string;
  icon: string;
  description: string;
  /** Ordered list of skills (subjects) that make up this branch's curriculum. */
  skills: string[];
}

export interface Concept {
  term: string;
  definition: string;
}

/** A hand-written multiple choice question attached to a subskill. */
export interface AuthoredQuestion {
  question: string;
  answer: string;
  distractors: string[];
  explanation: string;
  difficulty?: 1 | 2 | 3;
}

export interface Subskill {
  id: string;
  name: string;
  summary: string;
  concepts: Concept[];
  questions: AuthoredQuestion[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: SkillLevel;
  category: SkillCategory;
  dependsOn: string[];
  book?: string;
  subskills: Subskill[];
}

export interface CareerSkill {
  id: string;
  /** 1 = useful, 2 = important, 3 = critical */
  weight: 1 | 2 | 3;
}

export interface Career {
  id: string;
  name: string;
  branchId: string;
  description: string;
  difficulty: Difficulty;
  salary: string;
  learningTime: string;
  outlook: string;
  employers: string[];
  skills: CareerSkill[];
}

export interface Internship {
  id: string;
  company: string;
  title: string;
  branchId: string;
  location: string;
  mode: "On-site" | "Hybrid" | "Remote";
  stipend: string;
  duration: string;
  description: string;
  requirements: { skillId: string; minMastery: number }[];
}

export type ResourceType = "video" | "course" | "article" | "book" | "practice";

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  provider: string;
  url: string;
  duration: string;
  difficulty: 1 | 2 | 3;
}

export interface Question {
  id: string;
  skillId: string;
  subskillId: string;
  kind: "term" | "definition" | "odd-one-out" | "applied";
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

// ─── User state ─────────────────────────────────────────────────────────────

export type DecayRisk = "stable" | "medium" | "high";

export interface SubskillMastery {
  skillId: string;
  subskillId: string;
  score: number; // stored score at lastPracticedAt
  lastPracticedAt: string; // ISO timestamp
  attemptCount: number;
  correctCount: number;
  streak: number;
}

/** Keyed by `${skillId}:${subskillId}` */
export type MasteryStore = Record<string, SubskillMastery>;

export interface SessionUser {
  id: string;
  name: string;
  email: string | null;
  isGuest: boolean;
  branchId: string | null;
  targetCareerId: string | null;
  dailyGoal: number;
  currentStreak: number;
  longestStreak: number;
  onboarded: boolean;
  streakFreezes: number;
}
