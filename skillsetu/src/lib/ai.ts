import "server-only";
// AI mentor. Each request carries the learner's choice: the offline engine,
// or Claude with the learner's own API key (kept in their browser and used
// only for that request). Without a choice, the server's ANTHROPIC_API_KEY is
// used if configured, otherwise the offline engine — so the feature always works.

import Anthropic from "@anthropic-ai/sdk";
import { getCareers, getSkill, getSubskill, getBranch } from "./catalog";
import type { Question } from "@/types";

export interface MentorReply {
  text: string;
  source: "claude" | "offline";
  /** Shown to the learner when their chosen mode could not be used. */
  notice?: string;
}

export type MentorMode = "default" | "offline" | "apikey";

export interface MentorPrefs {
  mode: MentorMode;
  apiKey?: string;
}

const MODEL = "claude-opus-5-5";

const SYSTEM = `You are SkillSetu's mentor for engineering students in India.
Answer clearly and concretely, like a good teaching assistant. Prefer short paragraphs and bullet points.
Use plain text with simple markdown (bold, bullets). Keep answers under 250 words unless asked for more.
When you mention salaries, use Indian figures (LPA). Never invent course links.`;

export const looksLikeApiKey = (key: string) => /^sk-ant-[\w-]{20,}$/.test(key.trim());

function resolveKey(prefs: MentorPrefs): string | null {
  if (prefs.mode === "offline") return null;
  if (prefs.mode === "apikey") return prefs.apiKey?.trim() || null;
  return process.env.ANTHROPIC_API_KEY || null;
}

/** Explains an SDK error without ever echoing the key itself. */
function describeError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) return "Anthropic rejected this API key — check it was copied in full and hasn't been revoked.";
  if (error instanceof Anthropic.PermissionDeniedError) return "This API key doesn't have access to the model.";
  if (error instanceof Anthropic.RateLimitError) return "Claude is rate-limiting this key right now.";
  if (error instanceof Anthropic.APIError && error.status === 400) return "Claude rejected the request — the key's account may have no credit.";
  if (error instanceof Anthropic.APIError) return `Claude returned an error (${error.status}).`;
  return "Couldn't reach Claude.";
}

/** Runs the prompt on Claude when a key is available; otherwise (or on failure) uses the offline answer. */
async function respond(prompt: string, prefs: MentorPrefs, offline: () => string): Promise<MentorReply> {
  const apiKey = resolveKey(prefs);
  if (!apiKey) {
    const notice = prefs.mode === "apikey" ? "No API key saved — using the offline mentor. Add one in Settings." : undefined;
    return { text: offline(), source: "offline", notice };
  }
  try {
    const client = new Anthropic({ apiKey, maxRetries: 1 });
    // `fallbacks` is a beta request field that may be newer than the installed SDK's types.
    const params = {
      model: MODEL,
      max_tokens: 2000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: SYSTEM,
      messages: [{ role: "user", content: prompt }],
    } as unknown as Anthropic.Beta.MessageCreateParamsNonStreaming;
    const response = await client.beta.messages.create(params);
    const text = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    if (response.stop_reason === "refusal" || !text) {
      return { text: offline(), source: "offline", notice: "Claude declined this one — showing the offline answer." };
    }
    return { text, source: "claude" };
  } catch (error) {
    const notice = describeError(error);
    // Log only the category, never the request (it contains the key).
    console.error(`[mentor] ${notice}`);
    return { text: offline(), source: "offline", notice: `${notice} Showing the offline answer.` };
  }
}

/** Checks a key with a free metadata call (no tokens are billed). */
export async function verifyApiKey(apiKey: string): Promise<{ ok: boolean; message: string }> {
  if (!looksLikeApiKey(apiKey)) return { ok: false, message: "That doesn't look like an Anthropic key (it should start with sk-ant-)." };
  try {
    const client = new Anthropic({ apiKey: apiKey.trim(), maxRetries: 0 });
    await client.models.retrieve(MODEL);
    return { ok: true, message: "Key works — the mentor will use Claude." };
  } catch (error) {
    return { ok: false, message: describeError(error) };
  }
}

// ─── Explain a subskill / answer a doubt ────────────────────────────────────

export async function explainSubskill(skillId: string, subskillId: string, doubt: string | undefined, prefs: MentorPrefs): Promise<MentorReply> {
  const skill = getSkill(skillId);
  const sub = getSubskill(skillId, subskillId);
  if (!skill || !sub) return { text: "I couldn't find that topic.", source: "offline" };

  const concepts = sub.concepts.map((c) => `- ${c.term}: ${c.definition}`).join("\n");
  const prompt = doubt?.trim()
    ? `Topic: ${sub.name} (part of ${skill.name}).\nKey concepts:\n${concepts}\n\nStudent's doubt: ${doubt.trim()}\n\nAnswer the doubt directly, then give one real-world engineering example.`
    : `Explain "${sub.name}" from ${skill.name} to a second-year engineering student.\nKey concepts to cover:\n${concepts}\n\nUse an everyday analogy, then a real plant/industry example, then 2 common mistakes students make.`;

  return respond(prompt, prefs, () => {
    const lines = [
      `**${sub.name}** — ${sub.summary}`,
      "",
      "**Key ideas**",
      ...sub.concepts.map((c) => `- **${c.term}**: ${c.definition}.`),
      "",
      "**How to study it**",
      `1. Read the definitions above and try to explain each in your own words.`,
      `2. Work through one textbook chapter${skill.book ? ` (${skill.book})` : ""}.`,
      `3. Practise questions here until mastery passes 80%, then revisit in a week to beat decay.`,
    ];
    if (doubt?.trim()) {
      const match = matchConcept(sub.concepts, doubt);
      if (match) lines.unshift(`On your question — **${match.term}**: ${match.definition}.`, "");
    }
    return lines.join("\n");
  });
}

function matchConcept(concepts: { term: string; definition: string }[], text: string) {
  const words = tokenize(text);
  let best: { term: string; definition: string } | null = null;
  let bestScore = 0;
  for (const c of concepts) {
    const target = tokenize(`${c.term} ${c.definition}`);
    const score = words.filter((w) => target.includes(w)).length;
    if (score > bestScore) {
      best = c;
      bestScore = score;
    }
  }
  return best;
}

const STOP = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "is", "for", "on", "with", "what", "how", "why", "i", "me", "my", "it", "be", "are", "do", "does", "like", "want", "about", "that", "this"]);

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w));
}

// ─── Career navigator ───────────────────────────────────────────────────────

export async function suggestCareers(interests: string, prefs: MentorPrefs): Promise<MentorReply> {
  const careers = getCareers();
  const catalog = careers.map((c) => `- ${c.name} [${getBranch(c.branchId)?.short}] (${c.salary}): ${c.description}`).join("\n");
  const prompt = `A student describes their interests and strengths:\n"""${interests}"""\n\nFrom this list of careers on SkillSetu, recommend the 3 best fits. For each: why it fits, the first two skills to learn, and one honest caveat.\n\n${catalog}`;

  return respond(prompt, prefs, () => {
    const words = tokenize(interests);
    const scored = careers
      .map((c) => {
        const skillNames = c.skills.map((s) => getSkill(s.id)?.name ?? "").join(" ");
        const haystack = tokenize(`${c.name} ${c.description} ${skillNames} ${getBranch(c.branchId)?.name ?? ""}`);
        return { c, score: words.filter((w) => haystack.some((h) => h.startsWith(w) || w.startsWith(h))).length };
      })
      .sort((a, b) => b.score - a.score);
    const top = scored[0]?.score ? scored.slice(0, 3) : scored.filter((s) => s.c.difficulty === "Beginner").slice(0, 3);
    return [
      scored[0]?.score ? "Based on your interests, these paths look like strong fits:" : "I couldn't match specific keywords, so here are beginner-friendly paths to explore:",
      "",
      ...top.flatMap(({ c }) => {
        const first = c.skills.filter((s) => s.weight === 3).slice(0, 2).map((s) => getSkill(s.id)?.name).filter(Boolean);
        return [`**${c.name}** — ${getBranch(c.branchId)?.name} · ${c.salary}`, c.description, `Start with: ${first.join(", ")}.`, ""];
      }),
      "Tip: open a career and check its Fit Score after a few practice sessions.",
    ].join("\n");
  });
}

// ─── Gap analysis ───────────────────────────────────────────────────────────

export async function analyseGaps(careerName: string, skills: { name: string; score: number; weight: number }[], prefs: MentorPrefs): Promise<MentorReply> {
  const table = skills.map((s) => `- ${s.name}: ${s.score}% (importance ${s.weight}/3)`).join("\n");
  const prompt = `Target career: ${careerName}\nCurrent mastery:\n${table}\n\nGive a focused 2-week study plan: the 3 highest-impact gaps, what to do each week, and how to know it worked.`;

  return respond(prompt, prefs, () => {
    const gaps = [...skills].sort((a, b) => b.weight * (100 - b.score) - a.weight * (100 - a.score)).slice(0, 3);
    return [
      `**Your highest-impact gaps for ${careerName}:**`,
      ...gaps.map((g, i) => `${i + 1}. **${g.name}** — ${g.score}% now, importance ${g.weight}/3.`),
      "",
      "**Week 1:** practise the first gap daily (10–15 questions) and read one textbook chapter.",
      "**Week 2:** move to the next two gaps and revise anything that starts to decay.",
      "",
      "You'll know it's working when each gap passes 70% and your fit score rises.",
    ].join("\n");
  });
}

// ─── Why was my answer wrong? ───────────────────────────────────────────────

export async function explainWrongAnswer(q: Question, selected: string, prefs: MentorPrefs): Promise<MentorReply> {
  const sub = getSubskill(q.skillId, q.subskillId);
  const prompt = `Question: ${q.question}\nOptions: ${q.options.join(" | ")}\nCorrect answer: ${q.answer}\nStudent chose: ${selected}\nReference explanation: ${q.explanation}\n\nIn 3-4 sentences, explain why "${selected}" is wrong and which misconception leads students to choose it. Do not repeat the full reference explanation.`;
  return respond(prompt, prefs, () => {
    const concept = sub ? matchConcept(sub.concepts, selected) : null;
    return [
      `**Why “${selected}” isn't right:** ${concept ? `it mixes up the idea with **${concept.term}** — ${concept.definition}.` : "it doesn't match the principle this question tests."}`,
      "",
      `**Correct answer:** ${q.answer}. ${q.explanation}`,
    ].join("\n");
  });
}

/** Whether the server has its own key configured (used when the learner hasn't chosen a mode). */
export function serverKeyConfigured() {
  return !!process.env.ANTHROPIC_API_KEY;
}
