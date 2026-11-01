import type { Metadata } from "next";
import Link from "next/link";
import { Building, Check, MapPin } from "lucide-react";
import { getBranch } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/session";
import { getMasteryStore, matchInternships } from "@/lib/insights";
import { PageHeader, ProgressBar } from "@/components/ui";

export const metadata: Metadata = { title: "Internship Matching" };

export default async function InternshipsPage({ searchParams }: { searchParams: Promise<{ branch?: string }> }) {
  const { branch } = await searchParams;
  const user = await getCurrentUser();
  const store = await getMasteryStore(user?.id ?? null);
  const filter = branch ?? user?.branchId ?? undefined;
  const matches = matchInternships(store).filter((m) => !filter || m.internship.branchId === filter);
  const eligible = matches.filter((m) => m.eligible).length;

  return (
    <div className="page">
      <PageHeader
        title="Internship matching"
        subtitle="Each listing states the skill mastery it expects. Your readiness updates live as you practise. Listings are illustrative samples."
        actions={filter ? <Link href="/internships?branch=" className="btn-secondary">Show all branches</Link> : undefined}
      />
      <p className="mb-6 text-sm text-muted">
        {filter && <>Showing <b className="text-ink">{getBranch(filter)?.name}</b> · </>}
        <b className="text-ink">{eligible}</b> of {matches.length} internships unlocked
      </p>
      <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matches.map(({ internship: it, readiness, eligible, requirements }) => (
          <article key={it.id} className={`card card-hover flex flex-col p-5 ${eligible ? "border-good/50" : ""}`}>
            <div className="mb-1 flex items-start justify-between gap-2">
              <h3 className="font-semibold text-ink">{it.title}</h3>
              {eligible ? <span className="rounded-full bg-good-soft px-2 py-0.5 text-xs font-semibold text-good">Ready</span>
                : <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-muted">{readiness}%</span>}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted"><Building className="h-3.5 w-3.5" />{it.company}</div>
            <div className="mb-3 mt-1 flex flex-wrap gap-2 text-xs">
              <span className="chip"><MapPin className="h-3 w-3" />{it.location}</span><span className="chip">{it.mode}</span>
              <span className="chip">{it.stipend}</span><span className="chip">{it.duration}</span>
            </div>
            <p className="mb-4 flex-1 text-sm text-muted">{it.description}</p>
            <ul className="space-y-2">
              {requirements.map((r) => (
                <li key={r.skill.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <Link href={`/skills/${r.skill.id}`} className="text-ink hover:text-brand"><span className="inline-flex items-center gap-1">{r.met && <Check className="h-3 w-3 text-good" />}{r.skill.name}</span></Link>
                    <span className={r.met ? "font-semibold text-good" : "text-muted"}>{r.current}% / {r.required}%</span>
                  </div>
                  <ProgressBar size="sm" value={Math.min(100, (r.current / r.required) * 100)} tone={r.met ? "good" : "brand"} />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
