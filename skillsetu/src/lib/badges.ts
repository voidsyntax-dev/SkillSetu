// Achievement definitions. Evaluated after every answer.

export interface BadgeStats {
  answered: number;
  correct: number;
  longestStreak: number;
  bestRun: number; // best consecutive-correct streak on any subskill
  subskillsMastered: number;
  skillsMastered: number;
  skillsPracticed: number;
  branchesTouched: number;
}

export interface BadgeDef {
  code: string;
  name: string;
  icon: string;
  description: string;
  earned: (s: BadgeStats) => boolean;
}

export const BADGES: BadgeDef[] = [
  { code: "first_step", name: "First Step", icon: "👣", description: "Answer your first question correctly.", earned: (s) => s.correct >= 1 },
  { code: "warmed_up", name: "Warmed Up", icon: "🔥", description: "Answer 25 questions.", earned: (s) => s.answered >= 25 },
  { code: "century", name: "Century", icon: "💯", description: "Answer 100 questions.", earned: (s) => s.answered >= 100 },
  { code: "marathon", name: "Marathon", icon: "🏃", description: "Answer 500 questions.", earned: (s) => s.answered >= 500 },
  { code: "sharpshooter", name: "Sharpshooter", icon: "🎯", description: "Get 10 answers in a row correct on one subskill.", earned: (s) => s.bestRun >= 10 },
  { code: "streak_3", name: "On a Roll", icon: "📅", description: "Practise 3 days in a row.", earned: (s) => s.longestStreak >= 3 },
  { code: "streak_7", name: "Week Warrior", icon: "🗓️", description: "Practise 7 days in a row.", earned: (s) => s.longestStreak >= 7 },
  { code: "streak_30", name: "Unstoppable", icon: "🏆", description: "Practise 30 days in a row.", earned: (s) => s.longestStreak >= 30 },
  { code: "first_mastery", name: "First Mastery", icon: "⭐", description: "Reach 80% mastery on a subskill.", earned: (s) => s.subskillsMastered >= 1 },
  { code: "ten_masteries", name: "Deep Diver", icon: "🤿", description: "Master 10 subskills.", earned: (s) => s.subskillsMastered >= 10 },
  { code: "skill_master", name: "Skill Master", icon: "🎓", description: "Master every subskill of a skill.", earned: (s) => s.skillsMastered >= 1 },
  { code: "explorer", name: "Explorer", icon: "🧭", description: "Practise 5 different skills.", earned: (s) => s.skillsPracticed >= 5 },
  // Shared subjects (e.g. thermodynamics) appear in several branches, so require real breadth too.
  { code: "polymath", name: "Polymath", icon: "🌐", description: "Practise 8 different subjects spanning 3+ branches.", earned: (s) => s.skillsPracticed >= 8 && s.branchesTouched >= 3 },
];

export const badgeByCode = new Map(BADGES.map((b) => [b.code, b]));
