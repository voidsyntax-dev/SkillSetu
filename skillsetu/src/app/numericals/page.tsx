import { randomInt } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { ENGINEERING_TEMPLATES, numericSet } from "@/lib/numerics";
import { PageHeader } from "@/components/ui";
import NumericDrill from "@/components/NumericDrill";

export const metadata: Metadata = { title: "Numerical problems" };

const newSeed = () => randomInt(1, 2 ** 31 - 1);

export default async function NumericalsPage({ searchParams }: { searchParams: Promise<{ seed?: string }> }) {
  const seed = Number((await searchParams).seed) || newSeed();
  const items = numericSet(seed, 8, ENGINEERING_TEMPLATES);
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader
        eyebrow="Practice"
        title="Numerical problems"
        subtitle="Engineering calculations with fresh numbers every time. Enter your answer, then see the full worked solution. Correct answers count toward mastery."
        actions={<Link href={`/numericals?seed=${newSeed()}`} className="btn-secondary">New set</Link>}
      />
      <NumericDrill items={items} />
    </div>
  );
}
