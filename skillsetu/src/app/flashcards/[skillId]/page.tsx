import { randomInt } from "node:crypto";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSkill } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/ui";
import FlashcardDeck from "@/components/FlashcardDeck";

type Props = { params: Promise<{ skillId: string }>; searchParams: Promise<{ sub?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const skill = getSkill((await params).skillId);
  const subId = (await searchParams).sub;
  const sub = skill?.subskills.find((s) => s.id === subId);
  return { title: `Flashcards · ${sub?.name ?? skill?.name ?? "Deck"}` };
}

export default async function FlashcardsDeckPage({ params, searchParams }: Props) {
  const skill = getSkill((await params).skillId);
  if (!skill) notFound();
  const subId = (await searchParams).sub;
  const sub = subId ? skill.subskills.find((s) => s.id === subId) : undefined;
  if (subId && !sub) notFound();

  const source = sub ? [sub] : skill.subskills;
  const cards = source.flatMap((ss) => ss.concepts.map((c, i) => ({ id: `${ss.id}:${i}`, term: c.term, definition: c.definition, topic: ss.name })));
  const backHref = sub ? `/subskills/${skill.id}/${sub.id}` : `/skills/${skill.id}`;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[
        { label: "Flashcards", href: "/flashcards" },
        { label: skill.name, href: sub ? `/flashcards/${skill.id}` : undefined },
        ...(sub ? [{ label: sub.name }] : []),
      ]} />
      <h1 className="h1 mb-1">{sub?.name ?? skill.name}</h1>
      <p className="mb-8 text-muted">{cards.length} cards · flip, then rate yourself honestly. Missed cards come back at the end.</p>
      <FlashcardDeck cards={cards} seed={randomInt(2 ** 31)} backHref={backHref}
        practiceHref={sub ? `/practice/${skill.id}/${sub.id}` : `/test/${skill.id}`} />
    </div>
  );
}
