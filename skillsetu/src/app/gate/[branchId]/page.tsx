import { randomInt } from "node:crypto";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBranch } from "@/lib/catalog";
import { gateSet, resolveQuestion } from "@/lib/planning";
import { numericPublic } from "@/lib/numerics";
import QuizRunner, { type QuizItem } from "@/components/QuizRunner";

type Props = { params: Promise<{ branchId: string }>; searchParams: Promise<{ seed?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `GATE mock · ${getBranch((await params).branchId)?.name ?? ""}` };
}

export default async function GateTestPage({ params, searchParams }: Props) {
  const { branchId } = await params;
  const branch = getBranch(branchId);
  if (!branch) notFound();
  const seed = Number((await searchParams).seed) || randomInt(1, 2 ** 31 - 1);

  const items: QuizItem[] = [];
  for (const it of gateSet(branchId, seed)) {
    if (it.kind === "mcq") {
      const q = await resolveQuestion(it.id);
      if (q) items.push({ id: q.id, kind: "mcq", prompt: q.question, options: q.options });
    } else {
      const p = numericPublic(it.id);
      if (p) items.push({ id: p.id, kind: "nat", prompt: p.prompt, unit: p.unit });
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <QuizRunner
        items={items}
        title={`GATE mock · ${branch.name}`}
        minutes={60}
        gradeParams={{ kind: "GATE", branchId, seed }}
        backHref="/gate"
      />
    </div>
  );
}
