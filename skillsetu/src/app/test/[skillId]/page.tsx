import { randomInt } from "node:crypto";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSkill } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/session";
import { getMasteryStore, subskillScore } from "@/lib/insights";
import { practiceQuestions } from "@/lib/practice";
import { TEST_LENGTH, TEST_MINUTES } from "@/lib/practice-config";
import { Breadcrumbs } from "@/components/ui";
import PracticeEngine from "@/components/PracticeEngine";

type Props = { params: Promise<{ skillId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Mock test · ${getSkill((await params).skillId)?.name ?? "Subject"}` };
}

export default async function MockTestPage({ params }: Props) {
  const skill = getSkill((await params).skillId);
  if (!skill) notFound();
  const store = await getMasteryStore(await getSessionUserId());
  const questions = skill.subskills.flatMap((ss) => practiceQuestions(skill.id, ss.id));
  const initial = Object.fromEntries(skill.subskills.map((ss) => [`${skill.id}:${ss.id}`, subskillScore(store, skill.id, ss.id)]));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Mock tests", href: "/test" }, { label: skill.name }]} />
      <PracticeEngine
        mode="exam"
        questions={questions}
        initialMastery={initial}
        seed={randomInt(2 ** 31)}
        length={TEST_LENGTH}
        timeLimitSec={TEST_MINUTES * 60}
        title={`${skill.name} — mock test`}
        backHref="/test"
        backLabel="All tests"
        showTopic
      />
    </div>
  );
}
