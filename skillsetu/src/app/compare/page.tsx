import type { Metadata } from "next";
import { getCareer, getCareers, getBranch, getSkill } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/session";
import { careerFit, getMasteryStore } from "@/lib/insights";
import { PageHeader, SectionTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Compare careers" };

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ a?: string; b?: string; c?: string }> }) {
  const sp = await searchParams;
  const all = getCareers();
  const picked = [sp.a, sp.b, sp.c].filter((x): x is string => !!x && !!getCareer(x)).map((id) => getCareer(id)!);
  const user = await getCurrentUser();
  const store = await getMasteryStore(user?.id ?? null);

  const sets = picked.map((c) => new Set(c.skills.map((s) => s.id)));
  const shared = sets.length > 1 ? [...sets[0]].filter((id) => sets.every((s) => s.has(id))) : [];

  const selectors = [["a", sp.a], ["b", sp.b], ["c", sp.c]] as const;

  return (
    <div className="page">
      <PageHeader eyebrow="Explore" title="Compare careers" subtitle="Pick up to three careers to see how their skills overlap, what they pay, and how ready you are for each." />

      <form className="mb-8 grid gap-3 sm:grid-cols-3" action="/compare">
        {selectors.map(([key, value], i) => (
          <select key={key} name={key} defaultValue={value ?? ""} className="input" aria-label={`Career ${i + 1}`}>
            <option value="">{i === 0 ? "Choose a career…" : "(optional)"}</option>
            {all.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        ))}
        <button className="btn-primary sm:col-span-3 sm:justify-self-start">Compare</button>
      </form>

      {picked.length >= 2 ? (
        <div className="space-y-8">
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[32rem] text-sm">
              <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-subtle">
                <tr>
                  <th className="px-4 py-3 font-medium" />
                  {picked.map((c) => <th key={c.id} className="px-4 py-3 font-medium text-ink normal-case tracking-normal text-sm">{c.name}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[
                  ["Branch", (c: typeof picked[number]) => getBranch(c.branchId)?.name ?? "—"],
                  ["Salary (typical)", (c: typeof picked[number]) => c.salary],
                  ["Time to job-ready", (c: typeof picked[number]) => c.learningTime],
                  ["Difficulty", (c: typeof picked[number]) => c.difficulty],
                  ["Skills required", (c: typeof picked[number]) => String(c.skills.length)],
                  ["Your career fit", (c: typeof picked[number]) => `${careerFit(store, c).fit}%`],
                ].map(([label, fn]) => (
                  <tr key={String(label)}>
                    <td className="px-4 py-3 font-medium text-muted">{String(label)}</td>
                    {picked.map((c) => <td key={c.id} className="px-4 py-3 text-ink">{(fn as (c: typeof picked[number]) => string)(c)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section>
            <SectionTitle title={`Shared skills (${shared.length})`} subtitle="Learn these once and they count for every career you compare." />
            <div className="flex flex-wrap gap-2">
              {shared.map((id) => <span key={id} className="chip">{getSkill(id)?.name}</span>)}
              {shared.length === 0 && <p className="text-sm text-muted">These careers share no required subjects.</p>}
            </div>
          </section>

          <section>
            <SectionTitle title="Unique to each" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {picked.map((c, i) => (
                <div key={c.id} className="card p-5">
                  <div className="mb-3 font-medium text-ink">{c.name}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.skills.filter((s) => sets.every((set, j) => j === i || !set.has(s.id)) && !shared.includes(s.id)).map((s) => (
                      <span key={s.id} className="chip">{getSkill(s.id)?.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <p className="card p-8 text-center text-sm text-muted">Choose at least two careers to compare.</p>
      )}
    </div>
  );
}
