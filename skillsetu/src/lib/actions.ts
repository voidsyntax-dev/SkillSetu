"use server";
// All mutations go through these server actions. Answers are graded on the
// server, so the browser never receives a correct answer before submitting.

import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "./db";
import { clearSession, ensureUserId, getCurrentUser, getSessionUserId, setSession } from "./session";
import { getBranch, getCareer, getQuestions, getResource, getSkill, getSubskill, searchCatalog, type SearchHit } from "./catalog";
import { formatDay } from "./mastery";
import { getMasteryStore, skillScore } from "./insights";
import { analyseGaps, explainSubskill, explainWrongAnswer, suggestCareers, verifyApiKey, type MentorPrefs, type MentorReply } from "./ai";
import { recordAttempt, type AttemptOutcome } from "./attempts";
import { dailyQuestionId, gateSet, resolveQuestion } from "./planning";
import { checkNumeric, isNumericId, numericPublic, type NumericCheck } from "./numerics";
import { hashString, shuffle } from "./rand";
import { isAdminEmail } from "./admin";
import { getProject } from "@/data/projects";

const clampTime = (ms: number) => Math.max(0, Math.min(ms | 0, 30 * 60_000));
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function newCode(len = 6) {
  return Array.from(randomBytes(len), (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}
function safePrefs(prefs?: MentorPrefs): MentorPrefs {
  return {
    mode: prefs && ["offline", "apikey"].includes(prefs.mode) ? prefs.mode : "default",
    apiKey: typeof prefs?.apiKey === "string" ? prefs.apiKey.slice(0, 300) : undefined,
  };
}

// ─── Practice ───────────────────────────────────────────────────────────────

export interface AnswerResult extends AttemptOutcome {
  correct: boolean;
  answer: string;
  explanation: string;
}

export async function submitAnswer(input: { questionId: string; selected: string; timeTakenMs: number }): Promise<AnswerResult> {
  const question = await resolveQuestion(input.questionId);
  if (!question) throw new Error("Unknown question");
  const userId = await ensureUserId();
  const correct = input.selected === question.answer;
  const outcome = await recordAttempt({
    userId, questionId: question.id, skillId: question.skillId, subskillId: question.subskillId,
    correct, difficulty: question.difficulty, timeTakenMs: clampTime(input.timeTakenMs),
  });
  return { correct, answer: question.answer, explanation: question.explanation, ...outcome };
}

export async function explainWrong(questionId: string, selected: string, prefs?: MentorPrefs): Promise<MentorReply> {
  const q = await resolveQuestion(questionId);
  if (!q) return { text: "I couldn't find that question.", source: "offline" };
  return explainWrongAnswer(q, selected, safePrefs(prefs));
}

// ─── Numericals ─────────────────────────────────────────────────────────────

export interface NumericResult extends NumericCheck {
  progress: { delta: number; newScore: number } | null;
}

export async function submitNumeric(input: { id: string; input: number; timeTakenMs: number }): Promise<NumericResult> {
  if (!isNumericId(input.id)) throw new Error("Unknown problem");
  const check = checkNumeric(input.id, Number(input.input));
  const meta = numericPublic(input.id);
  if (!check || !meta) throw new Error("Unknown problem");
  const userId = await ensureUserId();
  let progress: { delta: number; newScore: number } | null = null;
  if (meta.subskillId) {
    const outcome = await recordAttempt({
      userId, questionId: input.id, skillId: meta.skillId, subskillId: meta.subskillId,
      correct: check.correct, difficulty: meta.difficulty, timeTakenMs: clampTime(input.timeTakenMs),
    });
    progress = { delta: outcome.delta, newScore: outcome.newScore };
  }
  return { ...check, progress };
}

// ─── Daily question ─────────────────────────────────────────────────────────

export async function submitDaily(questionId: string, selected: string) {
  const userId = await ensureUserId();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const day = formatDay(new Date());
  if (questionId !== dailyQuestionId(day, user.branchId)) throw new Error("That isn't today's question.");
  const q = await resolveQuestion(questionId);
  if (!q) throw new Error("Unknown question");
  const existing = await prisma.dailyAnswer.findUnique({ where: { day_userId: { day, userId } } });
  if (!existing) {
    await prisma.dailyAnswer.create({ data: { day, userId, questionId, selected, correct: selected === q.answer } });
  }
  const stored = await prisma.dailyAnswer.findUniqueOrThrow({ where: { day_userId: { day, userId } } });
  const total = await prisma.dailyAnswer.count({ where: { day, questionId } });
  const right = await prisma.dailyAnswer.count({ where: { day, questionId, correct: true } });
  return {
    selected: stored.selected, correct: stored.correct, answer: q.answer, explanation: q.explanation,
    percent: total ? Math.round((right / total) * 100) : 0, total,
  };
}

// ─── GATE mock & challenges (graded in one place) ──────────────────────────

export interface QuizSummary {
  score: number;
  max: number;
  correct: number;
  wrong: number;
  skipped: number;
  perItem: Record<string, { correct: boolean; answer: string; explanation: string }>;
}

export async function gradeQuiz(input: {
  kind: "GATE" | "CHALLENGE";
  branchId?: string;
  seed?: number;
  challengeCode?: string;
  answers: Record<string, string>;
  timeMs: number;
}): Promise<QuizSummary> {
  const userId = await ensureUserId();
  const negative = input.kind === "GATE" ? 1 / 3 : 0;
  let items: { id: string; kind: "mcq" | "nat" }[];
  let challengeId: string | null = null;

  if (input.kind === "CHALLENGE") {
    const ch = await prisma.challenge.findUnique({ where: { code: String(input.challengeCode ?? "").toUpperCase() } });
    if (!ch) throw new Error("Unknown challenge");
    challengeId = ch.id;
    items = (JSON.parse(ch.questionIds) as string[]).map((id) => ({ id, kind: "mcq" as const }));
  } else {
    items = gateSet(input.branchId ?? null, input.seed ?? 1);
  }

  let score = 0, max = 0, correct = 0, wrong = 0, skipped = 0;
  const perItem: QuizSummary["perItem"] = {};

  for (const it of items) {
    const answer = input.answers[it.id];
    const blank = answer === undefined || answer.trim() === "";
    if (it.kind === "mcq") {
      const q = await resolveQuestion(it.id);
      if (!q) continue;
      max += 1;
      perItem[it.id] = { correct: !blank && answer === q.answer, answer: q.answer, explanation: q.explanation };
      if (blank) skipped++;
      else if (answer === q.answer) { correct++; score += 1; }
      else { wrong++; score -= negative; }
    } else {
      const check = isNumericId(it.id) ? checkNumeric(it.id, Number(answer)) : null;
      if (!check) continue;
      max += 2;
      perItem[it.id] = { correct: !blank && check.correct, answer: `${check.value} ${check.unit}`.trim(), explanation: check.steps.join(" → ") };
      if (blank) skipped++;
      else if (check.correct) { correct++; score += 2; }
      else wrong++;
    }
  }

  score = Math.round(score * 100) / 100;
  if (input.kind === "GATE") {
    await prisma.testResult.create({
      data: { userId, kind: "GATE", scope: input.branchId ?? "all", marks: score, maxMarks: max, correct, wrong, skipped, timeMs: clampTime(input.timeMs) },
    });
  } else if (challengeId) {
    // First attempt counts; retakes don't overwrite the leaderboard.
    await prisma.challengeResult.upsert({
      where: { challengeId_userId: { challengeId, userId } },
      create: { challengeId, userId, score: correct, total: items.length, timeMs: clampTime(input.timeMs) },
      update: {},
    });
  }
  return { score, max, correct, wrong, skipped, perItem };
}

export async function createChallengeAction(formData: FormData) {
  const skillId = String(formData.get("skillId") ?? "");
  const skill = getSkill(skillId);
  if (!skill) redirect("/challenges?error=skill");
  const userId = await ensureUserId();
  const code = newCode();
  const pool = skill.subskills.flatMap((ss) => getQuestions(skill.id, ss.id).map((q) => q.id));
  const picked = shuffle(pool, hashString(code)).slice(0, 5);
  await prisma.challenge.create({ data: { code, creatorId: userId, skillId, questionIds: JSON.stringify(picked) } });
  redirect(`/challenge/${code}`);
}

// ─── Groups & teacher tools ─────────────────────────────────────────────────

export async function createGroupAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim().slice(0, 60);
  if (!name) redirect("/groups?error=name");
  const userId = await ensureUserId();
  const group = await prisma.group.create({
    data: { name, code: newCode(), ownerId: userId, members: { create: { userId, role: "owner" } } },
  });
  redirect(`/groups/${group.id}`);
}

export async function joinGroupAction(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const group = await prisma.group.findUnique({ where: { code } });
  if (!group) redirect("/groups?error=code");
  const userId = await ensureUserId();
  await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId: group.id, userId } },
    create: { groupId: group.id, userId, role: "member" },
    update: {},
  });
  redirect(`/groups/${group.id}`);
}

export async function addAssignmentAction(formData: FormData) {
  const userId = await ensureUserId();
  const groupId = String(formData.get("groupId") ?? "");
  const owner = await prisma.groupMember.findUnique({ where: { groupId_userId: { groupId, userId } } });
  if (owner?.role !== "owner") throw new Error("Only the group owner can add assignments.");
  const skillId = String(formData.get("skillId") ?? "");
  const title = String(formData.get("title") ?? "").trim().slice(0, 100);
  const dueDay = String(formData.get("dueDay") ?? "");
  if (!getSkill(skillId) || !title || !/^\d{4}-\d{2}-\d{2}$/.test(dueDay)) throw new Error("Please fill in all fields.");
  await prisma.assignment.create({ data: { groupId, skillId, title, dueDay } });
  revalidatePath(`/groups/${groupId}`);
}

// ─── Exam planner ───────────────────────────────────────────────────────────

export async function savePlanAction(formData: FormData) {
  const userId = await ensureUserId();
  const examName = String(formData.get("examName") ?? "").trim().slice(0, 80) || "My exam";
  const examDay = String(formData.get("examDay") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(examDay)) redirect("/planner?error=date");
  const skillIds = formData.getAll("skillId").map(String).filter((id) => !!getSkill(id)).slice(0, 12);
  const data = { examName, examDay, skillIds: JSON.stringify(skillIds) };
  await prisma.studyPlan.upsert({ where: { userId }, create: { userId, ...data }, update: data });
  revalidatePath("/planner");
}

// ─── Projects, admin content ────────────────────────────────────────────────

export async function submitProjectAction(formData: FormData) {
  const project = getProject(String(formData.get("projectId") ?? ""));
  if (!project) throw new Error("Unknown project");
  const userId = await ensureUserId();
  const exists = await prisma.proof.findFirst({ where: { userId, kind: "PROJECT", skillId: project.skillId, subskillId: project.id } });
  if (!exists) {
    await prisma.proof.create({
      data: {
        userId, kind: "PROJECT", skillId: project.skillId, subskillId: project.id,
        title: `Project: ${project.title}`, description: project.brief,
        score: 0, accuracy: 0, attempts: 0, hash: newCode(12),
      },
    });
  }
  revalidatePath("/projects");
  revalidatePath("/proofs");
}

export async function addCustomQuestionAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!isAdminEmail(user?.email)) throw new Error("Not allowed");
  const [skillId, subskillId] = String(formData.get("subskill") ?? "").split("|");
  if (!getSubskill(skillId, subskillId)) redirect("/admin?error=subskill");
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const explanation = String(formData.get("explanation") ?? "").trim();
  const wrong = [1, 2, 3].map((i) => String(formData.get(`wrong${i}`) ?? "").trim());
  const difficulty = Math.min(3, Math.max(1, Number(formData.get("difficulty")) || 2));
  const valid = question && answer && explanation && wrong.every(Boolean) && new Set([answer, ...wrong].map((s) => s.toLowerCase())).size === 4;
  if (!valid) redirect("/admin?error=fields");
  await prisma.customQuestion.create({
    data: { skillId, subskillId, question, answer, distractors: JSON.stringify(wrong), explanation, difficulty, authorId: user!.id },
  });
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}

// ─── Resources, bookmarks, notes ────────────────────────────────────────────

export async function setResourceProgress(resourceId: string, patch: { completed?: boolean; liked?: boolean | null }) {
  if (!getResource(resourceId)) throw new Error("Unknown resource");
  const userId = await ensureUserId();
  await prisma.resourceProgress.upsert({
    where: { userId_resourceId: { userId, resourceId } },
    create: { userId, resourceId, completed: patch.completed ?? false, liked: patch.liked ?? null },
    update: patch,
  });
}

export async function toggleBookmark(skillId: string, subskillId: string): Promise<boolean> {
  if (!getSubskill(skillId, subskillId)) throw new Error("Unknown subskill");
  const userId = await ensureUserId();
  const where = { userId_skillId_subskillId: { userId, skillId, subskillId } };
  const existing = await prisma.bookmark.findUnique({ where });
  if (existing) await prisma.bookmark.delete({ where });
  else await prisma.bookmark.create({ data: { userId, skillId, subskillId } });
  revalidatePath("/library");
  return !existing;
}

export async function saveNote(skillId: string, subskillId: string, body: string) {
  if (!getSubskill(skillId, subskillId)) throw new Error("Unknown subskill");
  const userId = await ensureUserId();
  const text = String(body).slice(0, 20_000);
  const where = { userId_skillId_subskillId: { userId, skillId, subskillId } };
  if (!text.trim()) await prisma.note.deleteMany({ where: { userId, skillId, subskillId } });
  else await prisma.note.upsert({ where, create: { userId, skillId, subskillId, body: text }, update: { body: text } });
  return { savedAt: new Date().toISOString() };
}

// ─── Account & preferences ──────────────────────────────────────────────────

export async function resetProgress() {
  const userId = await getSessionUserId();
  if (!userId) return;
  await prisma.$transaction([
    prisma.subskillState.deleteMany({ where: { userId } }),
    prisma.attempt.deleteMany({ where: { userId } }),
    prisma.dailyActivity.deleteMany({ where: { userId } }),
    prisma.badge.deleteMany({ where: { userId } }),
    prisma.proof.deleteMany({ where: { userId } }),
    prisma.resourceProgress.deleteMany({ where: { userId } }),
    prisma.dailyAnswer.deleteMany({ where: { userId } }),
    prisma.testResult.deleteMany({ where: { userId } }),
    prisma.user.update({ where: { id: userId }, data: { currentStreak: 0, longestStreak: 0, lastActiveDay: null, streakFreezes: 1 } }),
  ]);
  revalidatePath("/", "layout");
}

export interface PrefsState {
  ok: boolean;
  message: string;
}

export async function updatePreferences(_: PrefsState | null, form: FormData): Promise<PrefsState> {
  const userId = await ensureUserId();
  const name = String(form.get("name") ?? "").trim().slice(0, 60);
  const branchId = String(form.get("branchId") ?? "");
  const careerId = String(form.get("targetCareerId") ?? "");
  const dailyGoal = Math.min(100, Math.max(1, Number(form.get("dailyGoal")) || 10));
  await prisma.user.update({
    where: { id: userId },
    data: {
      name: name || "Learner",
      branchId: getBranch(branchId) ? branchId : null,
      targetCareerId: getCareer(careerId) ? careerId : null,
      dailyGoal,
    },
  });
  revalidatePath("/", "layout");
  return { ok: true, message: "Preferences saved." };
}

export async function setTargetCareer(careerId: string) {
  const career = getCareer(careerId);
  if (!career) return;
  const userId = await ensureUserId();
  await prisma.user.update({ where: { id: userId }, data: { targetCareerId: careerId, branchId: career.branchId } });
  revalidatePath("/", "layout");
}

export interface AuthState {
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signUp(_: AuthState | null, form: FormData): Promise<AuthState> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!name) return { error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (await prisma.user.findUnique({ where: { email } })) return { error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);
  const currentId = await getSessionUserId();
  const current = currentId ? await prisma.user.findUnique({ where: { id: currentId } }) : null;
  // Keep guest progress by upgrading the guest record in place.
  const user = current?.isGuest
    ? await prisma.user.update({ where: { id: current.id }, data: { name, email, passwordHash, isGuest: false } })
    : await prisma.user.create({ data: { name, email, passwordHash, isGuest: false } });
  await setSession(user.id);
  redirect("/dashboard");
}

export async function signIn(_: AuthState | null, form: FormData): Promise<AuthState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Incorrect email or password." };
  }
  await setSession(user.id);
  redirect("/dashboard");
}

export async function signOut() {
  await clearSession();
  redirect("/");
}

// ─── Onboarding, search, mentor ─────────────────────────────────────────────

export async function completeOnboarding(input: { branchId: string; targetCareerId: string; dailyGoal: number }) {
  const userId = await ensureUserId();
  await prisma.user.update({
    where: { id: userId },
    data: {
      branchId: getBranch(input.branchId) ? input.branchId : null,
      targetCareerId: getCareer(input.targetCareerId) ? input.targetCareerId : null,
      dailyGoal: Math.min(100, Math.max(1, Math.round(input.dailyGoal) || 10)),
      onboarded: true,
    },
  });
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function searchAction(query: string): Promise<SearchHit[]> {
  return searchCatalog(String(query).slice(0, 100), 12);
}

export async function askMentor(
  req:
    | { mode: "explain"; skillId: string; subskillId: string; doubt?: string }
    | { mode: "careers"; interests: string }
    | { mode: "gaps"; careerId: string },
  prefs: MentorPrefs = { mode: "default" },
): Promise<MentorReply> {
  // The learner's key arrives with this request only; it is never stored server-side.
  const sp = safePrefs(prefs);
  if (req.mode === "explain") return explainSubskill(req.skillId, req.subskillId, req.doubt?.slice(0, 1000), sp);
  if (req.mode === "careers") return suggestCareers(req.interests.slice(0, 1000), sp);
  const career = getCareer(req.careerId);
  if (!career) return { text: "Unknown career.", source: "offline" };
  const store = await getMasteryStore(await getSessionUserId());
  const skills = career.skills
    .map((cs) => ({ skill: getSkill(cs.id), weight: cs.weight }))
    .filter((r) => r.skill)
    .map((r) => ({ name: r.skill!.name, weight: r.weight, score: skillScore(store, r.skill!) }));
  return analyseGaps(career.name, skills, sp);
}

export async function testApiKey(apiKey: string) {
  return verifyApiKey(String(apiKey).slice(0, 300));
}
