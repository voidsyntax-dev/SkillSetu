import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert, CircleCheck, RotateCcw } from "lucide-react";
import { getQuestion, getSkill } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/session";
import { getOpenMistakes } from "@/lib/insights";
import { EmptyState, PageHeader, inline } from "@/components/ui";

export const metadata: Metadata = { title: "Mistake Book" };

export default async function MistakesPage() {
  const mistakes = (await getOpenMistakes(await getSessionUserId()))
    .map((m) => ({ ...m, q: getQuestion(m.questionId) }))
    .filter((m) => m.q);

  // Group by subject so revision is focused.
  const groups = new Map<string, typeof mistakes>();
  for (const m of mistakes) groups.set(m.q!.skillId, [...(groups.get(m.q!.skillId) ?? []), m]);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Practice"
        title="Mistake book"
        subtitle="Every question whose latest attempt was wrong. Answer it correctly in a retry session and it leaves the book."
        actions={mistakes.length > 0 && <Link href="/mistakes/retry" className="btn-primary"><RotateCcw className="h-4 w-4" />Retry {Math.min(mistakes.length, 15)} mistakes</Link>}
      />
      {mistakes.length === 0 ? (
        <EmptyState icon={<CircleCheck className="h-6 w-6" />} title="No open mistakes"
          action={<Link href="/review" className="btn-primary">Start a review</Link>}>
          Questions you get wrong are collected here automatically, with the correct answer and explanation.
        </EmptyState>
      ) : (
        <div className="space-y-10">
          {[...groups.entries()].map(([skillId, items]) => (
            <section key={skillId}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="h2">{getSkill(skillId)?.name}</h2>
                <span className="chip">{items.length} open</span>
              </div>
              <ul className="stagger space-y-3">
                {items.map(({ q, wrongCount, questionId }) => (
                  <li key={questionId} className="card p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="chip">{getSkill(q!.skillId)?.subskills.find((s) => s.id === q!.subskillId)?.name}</span>
                      {wrongCount > 1 && <span className="inline-flex items-center gap-1 rounded-full bg-bad-soft px-2 py-0.5 text-xs font-medium text-bad"><CircleAlert className="h-3 w-3" />Missed {wrongCount}×</span>}
                    </div>
                    <p className="font-medium text-ink">{inline(q!.question)}</p>
                    <details className="group mt-3">
                      <summary className="cursor-pointer list-none text-sm font-medium text-brand hover:underline">
                        <span className="group-open:hidden">Show answer</span><span className="hidden group-open:inline">Hide answer</span>
                      </summary>
                      <div className="animate-fade-in mt-3 rounded-xl bg-good-soft p-3 text-sm">
                        <p className="font-medium text-good">{q!.answer}</p>
                        <p className="mt-1 text-ink">{q!.explanation}</p>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
