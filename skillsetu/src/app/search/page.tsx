import type { Metadata } from "next";
import Link from "next/link";
import { searchCatalog } from "@/lib/catalog";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Search" };

const TYPE_LABEL = { branch: "Branch", career: "Career", skill: "Skill", subskill: "Subskill" } as const;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").slice(0, 100);
  const hits = searchCatalog(q, 60);
  return (
    <div className="page">
      <PageHeader title="Search" subtitle={q ? `${hits.length} result${hits.length === 1 ? "" : "s"} for “${q}”` : "Search branches, careers, skills, subskills and concepts."} />
      <form className="mb-6 flex max-w-lg gap-2" action="/search">
        <input name="q" defaultValue={q} className="input" placeholder="e.g. entropy, CRISPR, load flow" aria-label="Search" />
        <button className="btn-primary">Search</button>
      </form>
      {hits.length > 0 ? (
        <ul className="card divide-y divide-line">
          {hits.map((h) => (
            <li key={h.href + h.title}>
              <Link href={h.href} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-2">
                <span className="chip w-20 justify-center">{TYPE_LABEL[h.type]}</span>
                <span className="font-medium text-ink">{h.title}</span>
                <span className="ml-auto text-sm text-muted">{h.subtitle}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : q.length >= 2 ? (
        <p className="text-muted">No matches. Try a broader term.</p>
      ) : null}
    </div>
  );
}
