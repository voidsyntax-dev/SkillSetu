import { randomInt } from "node:crypto";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { getMasteryStore, getOpenMistakes, subskillScore } from "@/lib/insights";
import { practiceQuestions } from "@/lib/practice";
import { Breadcrumbs } from "@/components/ui";
import PracticeEngine from "@/components/PracticeEngine";

export const metadata: Metadata = { title: "Retry mistakes" };

export default async function RetryMistakesPage() {
  const userId = await getSessionUserId();
  const ids = new Set((await getOpenMistakes(userId)).map((m) => m.questionId));
  if (!ids.size) redirect("/mistakes");

  const subskills = new Set([...ids].map((id) => id.split(":").slice(0, 2).join(":")));
  const questions = [...subskills].flatMap((k) => {
    const [skillId, subskillId] = k.split(":");
    return practiceQuestions(skillId, subskillId).filter((q) => ids.has(q.id));
  });
  const store = await getMasteryStore(userId);
  const initial = Object.fromEntries([...subskills].map((k) => {
    const [skillId, subskillId] = k.split(":");
    return [k, subskillScore(store, skillId, subskillId)];
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Mistake book", href: "/mistakes" }, { label: "Retry" }]} />
      <PracticeEngine questions={questions} initialMastery={initial} seed={randomInt(2 ** 31)} length={15}
        title="Retry your mistakes" backHref="/mistakes" backLabel="Mistake book" showTopic />
    </div>
  );
}
