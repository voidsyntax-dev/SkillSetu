import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUserId } from "@/lib/session";
import { getMasteryStore, subskillStatuses } from "@/lib/insights";
import { analytics, dueSubskills } from "@/lib/planning";
import { DecayPill, EmptyState, PageHeader, ProgressBar, SectionTitle, Stat } from "@/components/ui";
import { LineChart } from "lucide-react";

export const metadata: Metadata = { title: "Analytics" };

const LEVEL = ["", "Basic", "Intermediate", "Advanced"];

export default async function AnalyticsPage() {
  const userId = await getSessionUserId();
  const store = await getMasteryStore(userId);
  if (!userId || Object.keys(store).length === 0) {
    return (
      <div className="page">
        <PageHeader eyebrow="Insight" title="Analytics" />
        <EmptyState icon={<LineChart className="h-6 w-6" />} title="No data yet" action={<Link href="/review" className="btn-primary">Start practising</Link>}>
          Answer a few questions and your accuracy, speed and decay trends will appear here.
        </EmptyState>
      </div>
    );
  }
  const a = await analytics(userId);
  const decay = subskillStatuses(store)
    .map((s) => ({ ...s, lost: s.stored - s.effective }))
    .filter((s) => s.lost > 0)
    .sort((x, y) => y.lost - x.lost)
    .slice(0, 6);
  const due = dueSubskills(store).length;

  return (
    <div className="page">
      <PageHeader eyebrow="Insight" title="Analytics" subtitle="How accurate you are, where you're fastest, and what's fading fastest." />

      <section className="stagger mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Questions" value={a.total.toLocaleString("en-IN")} hint="last 3,000 answers" />
        <Stat label="Accuracy" value={`${a.accuracy}%`} tone="good" />
        <Stat label="Avg time" value={`${a.avgSeconds}s`} hint="per question" tone="warn" />
        <Stat label="Due for review" value={due} hint="spaced-repetition queue" tone="accent" />
      </section>

      <div className="mb-10 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <SectionTitle title="Accuracy by difficulty" />
          <div className="space-y-4">
            {(["1", "2", "3"] as const).map((d) => {
              const row = a.byDifficulty[d];
              const acc = row.total ? Math.round((row.correct / row.total) * 100) : 0;
              return (
                <div key={d}>
                  <div className="mb-1 flex justify-between text-sm"><span className="text-ink">{LEVEL[Number(d)]}</span><span className="tabular-nums text-muted">{acc}% · {row.total} q</span></div>
                  <ProgressBar value={acc} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="card p-6">
          <SectionTitle title="Fastest decay" subtitle="Mastery lost since your last practice" />
          {decay.length ? (
            <ul className="space-y-3">
              {decay.map((d) => (
                <li key={`${d.skillId}:${d.subskillId}`} className="flex items-center justify-between gap-3">
                  <Link href={`/practice/${d.skillId}/${d.subskillId}`} className="min-w-0 truncate text-sm text-ink hover:text-brand">{d.subskillName}</Link>
                  <span className="flex items-center gap-2"><DecayPill risk={d.risk} /><span className="w-12 text-right text-sm tabular-nums text-bad">−{d.lost}%</span></span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted">Nothing is decaying right now.</p>}
        </section>
      </div>

      <section className="card p-6">
        <SectionTitle title="Accuracy by subject" subtitle="Your ten most practised subjects" />
        {a.bySkill.length ? (
          <ul className="stagger space-y-4">
            {a.bySkill.map((s) => (
              <li key={s.name}>
                <div className="mb-1 flex justify-between text-sm"><span className="text-ink">{s.name}</span><span className="tabular-nums text-muted">{s.accuracy}% · {s.total} q</span></div>
                <ProgressBar value={s.accuracy} />
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">No subject data yet.</p>}
      </section>
    </div>
  );
}
