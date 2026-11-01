// Read-only access to the learning catalog: branches → careers → skills →
// subskills → concepts, plus generated practice questions and resources.

import { branches, careers, internships, skills } from "@/data/catalog";
import type { Branch, Career, Concept, Question, Resource, Skill, Subskill } from "@/types";

// ─── Indexes ────────────────────────────────────────────────────────────────

const skillById = new Map(skills.map((s) => [s.id, s]));
const branchById = new Map(branches.map((b) => [b.id, b]));
const careerById = new Map(careers.map((c) => [c.id, c]));

const branchesBySkill = new Map<string, Branch[]>();
for (const b of branches) {
  for (const sid of b.skills) {
    const list = branchesBySkill.get(sid) ?? [];
    list.push(b);
    branchesBySkill.set(sid, list);
  }
}

// ─── Lookups ────────────────────────────────────────────────────────────────

export const getBranches = (): Branch[] => branches;
export const getBranch = (id: string): Branch | undefined => branchById.get(id);
export const getSkills = (): Skill[] => skills;
export const getSkill = (id: string): Skill | undefined => skillById.get(id);
export const getCareers = (): Career[] => careers;
export const getCareer = (id: string): Career | undefined => careerById.get(id);
export const getInternships = () => internships;

export function getSubskill(skillId: string, subskillId: string): Subskill | undefined {
  return skillById.get(skillId)?.subskills.find((s) => s.id === subskillId);
}

export function getBranchSkills(branchId: string): Skill[] {
  return (branchById.get(branchId)?.skills ?? []).map((id) => skillById.get(id)).filter((s): s is Skill => !!s);
}

export function getBranchCareers(branchId: string): Career[] {
  return careers.filter((c) => c.branchId === branchId);
}

export function getBranchesForSkill(skillId: string): Branch[] {
  return branchesBySkill.get(skillId) ?? [];
}

export function getCareersForSkill(skillId: string): Career[] {
  return careers.filter((c) => c.skills.some((s) => s.id === skillId));
}

export function getCareerSkills(careerId: string): Skill[] {
  const career = careerById.get(careerId);
  if (!career) return [];
  const ids = new Set(career.skills.map((s) => s.id));
  // Include prerequisites that are not listed explicitly so the roadmap is complete.
  for (const id of [...ids]) for (const dep of prerequisiteChain(id)) ids.add(dep);
  return topoSort([...ids]).map((id) => skillById.get(id)!).filter(Boolean);
}

/** All transitive prerequisites of a skill. */
export function prerequisiteChain(skillId: string, seen = new Set<string>()): string[] {
  for (const dep of skillById.get(skillId)?.dependsOn ?? []) {
    if (!seen.has(dep) && skillById.has(dep)) {
      seen.add(dep);
      prerequisiteChain(dep, seen);
    }
  }
  return [...seen];
}

/** Orders skill ids so every prerequisite comes before the skills that need it. */
export function topoSort(ids: string[]): string[] {
  const wanted = new Set(ids);
  const out: string[] = [];
  const visited = new Set<string>();
  const visit = (id: string) => {
    if (visited.has(id)) return;
    visited.add(id);
    for (const dep of skillById.get(id)?.dependsOn ?? []) if (wanted.has(dep)) visit(dep);
    out.push(id);
  };
  [...ids]
    .sort((a, b) => (skillById.get(a)?.level ?? 0) - (skillById.get(b)?.level ?? 0))
    .forEach(visit);
  return out;
}

/** Skills that list this skill as a direct prerequisite. */
export function getDependentSkills(skillId: string): Skill[] {
  return skills.filter((s) => s.dependsOn.includes(skillId));
}

export function catalogStats() {
  const subskillCount = skills.reduce((n, s) => n + s.subskills.length, 0);
  const conceptCount = skills.reduce((n, s) => n + s.subskills.reduce((m, ss) => m + ss.concepts.length, 0), 0);
  const questionCount = skills.reduce(
    (n, s) => n + s.subskills.reduce((m, ss) => m + getQuestions(s.id, ss.id).length, 0),
    0,
  );
  return {
    branches: branches.length,
    careers: careers.length,
    skills: skills.length,
    subskills: subskillCount,
    concepts: conceptCount,
    questions: questionCount,
  };
}

// ─── Search ─────────────────────────────────────────────────────────────────

export interface SearchHit {
  type: "branch" | "career" | "skill" | "subskill";
  title: string;
  subtitle: string;
  href: string;
}

export function searchCatalog(query: string, limit = 30): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const b of branches) {
    if (b.name.toLowerCase().includes(q)) hits.push({ type: "branch", title: b.name, subtitle: "Branch", href: `/branches/${b.id}` });
  }
  for (const c of careers) {
    if (c.name.toLowerCase().includes(q)) hits.push({ type: "career", title: c.name, subtitle: branchById.get(c.branchId)?.name ?? "Career", href: `/career/${c.id}` });
  }
  for (const s of skills) {
    if (s.name.toLowerCase().includes(q)) hits.push({ type: "skill", title: s.name, subtitle: "Skill", href: `/skills/${s.id}` });
    for (const ss of s.subskills) {
      const conceptMatch = ss.concepts.some((c) => c.term.toLowerCase().includes(q));
      if (ss.name.toLowerCase().includes(q) || conceptMatch) {
        hits.push({ type: "subskill", title: ss.name, subtitle: s.name, href: `/subskills/${s.id}/${ss.id}` });
      }
    }
  }
  return hits.slice(0, limit);
}

// ─── Question generation ────────────────────────────────────────────────────
// Questions are derived deterministically from each subskill's concepts so the
// bank grows automatically as concepts are added, and IDs stay stable.

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed: string) {
  let a = hashString(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickDistinct(pool: string[], exclude: string, count: number, rand: () => number): string[] {
  const seen = new Set([exclude.toLowerCase()]);
  const out: string[] = [];
  for (const item of shuffle(pool, rand)) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length === count) break;
  }
  return out;
}

const allConcepts: { skillId: string; concept: Concept }[] = skills.flatMap((s) =>
  s.subskills.flatMap((ss) => ss.concepts.map((concept) => ({ skillId: s.id, concept }))),
);

/** Distractor pool: same subskill first, then the rest of the skill, then related skills. */
function distractorPool(skill: Skill, subskill: Subskill, self: Concept): Concept[] {
  const sameSub = subskill.concepts.filter((c) => c !== self);
  const sameSkill = skill.subskills.filter((ss) => ss !== subskill).flatMap((ss) => ss.concepts);
  const related = skill.dependsOn.flatMap((id) => skillById.get(id)?.subskills.flatMap((ss) => ss.concepts) ?? []);
  return [...sameSub, ...sameSkill, ...related];
}

const questionCache = new Map<string, Question[]>();

export function getQuestions(skillId: string, subskillId: string): Question[] {
  const key = `${skillId}:${subskillId}`;
  const cached = questionCache.get(key);
  if (cached) return cached;

  const skill = skillById.get(skillId);
  const subskill = skill?.subskills.find((s) => s.id === subskillId);
  if (!skill || !subskill) return [];

  const questions: Question[] = [];

  subskill.concepts.forEach((concept, idx) => {
    const pool = distractorPool(skill, subskill, concept);

    // 1. Concept → definition
    {
      const rand = seededRandom(`${key}:def:${idx}`);
      const wrong = pickDistinct(pool.map((c) => c.definition), concept.definition, 3, rand);
      if (wrong.length === 3) {
        questions.push({
          id: `${key}:def:${idx}`,
          skillId, subskillId, kind: "definition", difficulty: 1,
          question: `Which statement best describes **${concept.term}**?`,
          options: shuffle([concept.definition, ...wrong], rand),
          answer: concept.definition,
          explanation: `${concept.term}: ${concept.definition}.`,
        });
      }
    }

    // 2. Definition → concept
    {
      const rand = seededRandom(`${key}:term:${idx}`);
      const wrong = pickDistinct(pool.map((c) => c.term), concept.term, 3, rand);
      if (wrong.length === 3) {
        questions.push({
          id: `${key}:term:${idx}`,
          skillId, subskillId, kind: "term", difficulty: 2,
          question: `Which concept is described here: “${concept.definition}”?`,
          options: shuffle([concept.term, ...wrong], rand),
          answer: concept.term,
          explanation: `This describes ${concept.term}. The other options are related ideas from ${skill.name} with different meanings.`,
        });
      }
    }
  });

  // 3. Odd one out — three concepts from this subskill and one from an unrelated skill.
  if (subskill.concepts.length >= 3) {
    const rand = seededRandom(`${key}:odd`);
    const own = shuffle(subskill.concepts, rand).slice(0, 3).map((c) => c.term);
    const relatedIds = new Set([skillId, ...skill.dependsOn, ...getDependentSkills(skillId).map((s) => s.id)]);
    const outsiders = allConcepts.filter((c) => !relatedIds.has(c.skillId));
    const outsider = outsiders[Math.floor(rand() * outsiders.length)];
    if (outsider && !own.some((t) => t.toLowerCase() === outsider.concept.term.toLowerCase())) {
      const outsiderSkill = skillById.get(outsider.skillId)!;
      questions.push({
        id: `${key}:odd`,
        skillId, subskillId, kind: "odd-one-out", difficulty: 1,
        question: `Which of these does NOT belong to ${subskill.name}?`,
        options: shuffle([...own, outsider.concept.term], rand),
        answer: outsider.concept.term,
        explanation: `${outsider.concept.term} comes from ${outsiderSkill.name}. The others (${own.join(", ")}) are core ideas in ${subskill.name}.`,
      });
    }
  }

  // 4. Hand-written applied questions.
  subskill.questions.forEach((q, idx) => {
    const rand = seededRandom(`${key}:applied:${idx}`);
    questions.push({
      id: `${key}:applied:${idx}`,
      skillId, subskillId, kind: "applied", difficulty: q.difficulty ?? 2,
      question: q.question,
      options: shuffle([q.answer, ...q.distractors], rand),
      answer: q.answer,
      explanation: q.explanation,
    });
  });

  questionCache.set(key, questions);
  return questions;
}

export function getQuestion(questionId: string): Question | undefined {
  const [skillId, subskillId] = questionId.split(":");
  return getQuestions(skillId, subskillId).find((q) => q.id === questionId);
}

// ─── Resources ──────────────────────────────────────────────────────────────

const enc = encodeURIComponent;

export function getResources(skillId: string, subskillId: string): Resource[] {
  const skill = skillById.get(skillId);
  const subskill = skill?.subskills.find((s) => s.id === subskillId);
  if (!skill || !subskill) return [];

  const topic = `${subskill.name} ${skill.name}`;
  const id = (kind: string) => `${skillId}:${subskillId}:${kind}`;
  const isCS = getBranchesForSkill(skillId).some((b) => b.id === "computer");
  const isMath = skill.category === "foundation";

  const list: Resource[] = [
    {
      id: id("nptel"), type: "course", provider: "NPTEL",
      title: `NPTEL lectures: ${skill.name}`,
      url: `https://www.youtube.com/results?search_query=${enc(`NPTEL ${topic}`)}`,
      duration: "Self-paced", difficulty: 2,
    },
    {
      id: id("video"), type: "video", provider: "YouTube",
      title: `Video explanations: ${subskill.name}`,
      url: `https://www.youtube.com/results?search_query=${enc(`${topic} explained`)}`,
      duration: "15–45 min", difficulty: 1,
    },
    {
      id: id("ocw"), type: "course", provider: "MIT OpenCourseWare",
      title: `MIT OCW materials on ${subskill.name}`,
      url: `https://ocw.mit.edu/search/?q=${enc(subskill.name)}`,
      duration: "2–6 hours", difficulty: 3,
    },
    {
      id: id("wiki"), type: "article", provider: "Wikipedia",
      title: `Reference article: ${subskill.concepts[0]?.term ?? subskill.name}`,
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${enc(subskill.concepts[0]?.term ?? subskill.name)}`,
      duration: "10 min", difficulty: 1,
    },
  ];

  if (isMath) {
    list.push({
      id: id("khan"), type: "practice", provider: "Khan Academy",
      title: `Practice: ${subskill.name}`,
      url: `https://www.khanacademy.org/search?page_search_query=${enc(subskill.name)}`,
      duration: "30 min", difficulty: 1,
    });
  } else if (isCS) {
    list.push({
      id: id("gfg"), type: "practice", provider: "GeeksforGeeks",
      title: `Tutorials & problems: ${subskill.name}`,
      url: `https://www.google.com/search?q=${enc(`site:geeksforgeeks.org ${subskill.name}`)}`,
      duration: "30–60 min", difficulty: 2,
    });
  }

  if (skill.book) {
    list.push({
      id: id("book"), type: "book", provider: "Textbook",
      title: skill.book,
      url: `https://openlibrary.org/search?q=${enc(skill.book.split("—").pop()!.trim())}`,
      duration: "Chapter study", difficulty: 2,
    });
  }

  return list;
}

export function getResource(resourceId: string): Resource | undefined {
  const [skillId, subskillId] = resourceId.split(":");
  return getResources(skillId, subskillId).find((r) => r.id === resourceId);
}
