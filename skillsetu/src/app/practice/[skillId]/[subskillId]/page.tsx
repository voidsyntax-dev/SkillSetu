import { randomInt } from "node:crypto";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSkill, getSubskill } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/session";
import { getMasteryStore, subskillScore } from "@/lib/insights";
import { loadPracticeQuestions } from "@/lib/practice";
import { Breadcrumbs } from "@/components/ui";
import PracticeEngine from "@/components/PracticeEngine";

type Props = { params: Promise<{ skillId: string; subskillId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skillId, subskillId } = await params;
  return { title: `Practice: ${getSubskill(skillId, subskillId)?.name ?? "Subskill"}` };
}

export default async function PracticePage({ params }: Props) {
  const { skillId, subskillId } = await params;
  const skill = getSkill(skillId);
  const sub = getSubskill(skillId, subskillId);
  if (!skill || !sub) notFound();
  const store = await getMasteryStore(await getSessionUserId());

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[
        { label: skill.name, href: `/skills/${skill.id}` },
        { label: sub.name, href: `/subskills/${skill.id}/${sub.id}` },
        { label: "Practice" },
      ]} />
      <PracticeEngine
        questions={await loadPracticeQuestions(skillId, subskillId)}
        initialMastery={{ [`${skillId}:${subskillId}`]: subskillScore(store, skillId, subskillId) }}
        seed={randomInt(2 ** 31)}
        title={sub.name}
        backHref={`/subskills/${skill.id}/${sub.id}`}
        backLabel="Back to subskill"
      />
    </div>
  );
}
