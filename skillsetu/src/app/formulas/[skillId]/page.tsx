import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSkill } from "@/lib/catalog";
import { ENGINEERING_TEMPLATES, sampleSolution } from "@/lib/numerics";
import { Breadcrumbs, inline } from "@/components/ui";
import PrintButton from "@/components/PrintButton";

type Props = { params: Promise<{ skillId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Formulas · ${getSkill((await params).skillId)?.name ?? ""}` };
}

export default async function FormulaSheetPage({ params }: Props) {
  const { skillId } = await params;
  const skill = getSkill(skillId);
  const templates = ENGINEERING_TEMPLATES.filter((t) => t.skillId === skillId);
  if (!skill || templates.length === 0) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 print:max-w-none print:p-0">
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Formula sheets", href: "/formulas" }, { label: skill.name }]} />
      </div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="h1">{skill.name}</h1>
          <p className="mt-1 text-sm text-muted print:text-black">Formula sheet · SkillSetu</p>
        </div>
        <PrintButton label="Print sheet" />
      </div>

      <div className="space-y-5">
        {templates.map((t) => {
          const ex = sampleSolution(t);
          return (
            <section key={t.id} className="card break-inside-avoid p-5 print:border-black print:shadow-none">
              <h2 className="h2 print:text-black">{t.title}</h2>
              <p className="mt-2 font-mono text-base text-brand print:text-black">{t.formula}</p>
              <details className="group mt-4 print:[&>div]:block" open>
                <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wide text-subtle print:hidden">
                  <span className="group-open:hidden">Show worked example</span><span className="hidden group-open:inline">Hide worked example</span>
                </summary>
                <div className="mt-3 rounded-xl bg-surface-2 p-4 text-sm print:bg-transparent">
                  <p className="text-ink">{inline(ex.prompt)}</p>
                  <ol className="mt-3 space-y-1 font-mono text-xs text-muted print:text-black">
                    {ex.steps.map((s, i) => <li key={i}>{i + 1}. {s}</li>)}
                  </ol>
                </div>
              </details>
            </section>
          );
        })}
      </div>
    </div>
  );
}
