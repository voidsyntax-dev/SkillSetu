import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { addCustomQuestionAction } from "@/lib/actions";
import { getSkills } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/session";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { PageHeader, SectionTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Content editor" };

const MESSAGES: Record<string, string> = {
  saved: "Question saved. It now appears in that subject's practice.",
  fields: "Please fill every field, and make sure the four options are different.",
  subskill: "That subject and subtopic don't match the catalog.",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const user = await getCurrentUser();
  if (!isAdminEmail(user?.email)) notFound();
  const sp = await searchParams;
  const count = await prisma.customQuestion.count();
  const message = sp.saved ? MESSAGES.saved : sp.error ? MESSAGES[sp.error] : null;

  return (
    <div className="page">
      <PageHeader eyebrow="Admin" title="Content editor"
        subtitle={`Add questions to any subtopic. ${count} custom question${count === 1 ? "" : "s"} so far. They appear in practice right away.`} />
      {message && <p className={`mb-6 rounded-xl border p-3 text-sm ${sp.saved ? "border-good/30 bg-good-soft text-good" : "border-bad/30 bg-bad-soft text-bad"}`}>{message}</p>}

      <form action={addCustomQuestionAction} className="card max-w-3xl space-y-5 p-6">
        <SectionTitle title="New question" />
        <div>
          <label className="label" htmlFor="subskill">Subtopic</label>
          <select id="subskill" name="subskill" className="input" required defaultValue="">
            <option value="" disabled>Choose a subtopic…</option>
            {getSkills().map((s) => (
              <optgroup key={s.id} label={s.name}>
                {s.subskills.map((ss) => <option key={ss.id} value={`${s.id}|${ss.id}`}>{ss.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="question">Question</label>
          <textarea id="question" name="question" className="input min-h-20" required maxLength={500} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="answer">Correct answer</label>
            <input id="answer" name="answer" className="input" required maxLength={200} />
          </div>
          <div>
            <label className="label" htmlFor="wrong1">Wrong option 1</label>
            <input id="wrong1" name="wrong1" className="input" required maxLength={200} />
          </div>
          <div>
            <label className="label" htmlFor="wrong2">Wrong option 2</label>
            <input id="wrong2" name="wrong2" className="input" required maxLength={200} />
          </div>
          <div>
            <label className="label" htmlFor="wrong3">Wrong option 3</label>
            <input id="wrong3" name="wrong3" className="input" required maxLength={200} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="explanation">Explanation shown after answering</label>
          <textarea id="explanation" name="explanation" className="input min-h-16" required maxLength={800} />
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="w-40">
            <label className="label" htmlFor="difficulty">Difficulty</label>
            <select id="difficulty" name="difficulty" className="input" defaultValue="2">
              <option value="1">Basic</option>
              <option value="2">Intermediate</option>
              <option value="3">Advanced</option>
            </select>
          </div>
          <button className="btn-primary">Save question</button>
        </div>
      </form>
    </div>
  );
}
