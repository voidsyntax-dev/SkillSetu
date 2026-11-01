import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { getBranches, getBranchesForSkill, getBranchSkills, getSkills } from "@/lib/catalog";
import { skillScore } from "@/lib/insights";
import type { MasteryStore, Skill } from "@/types";
import Explorer from "./Explorer";
import { ProgressBar, SectionTitle } from "./ui";

/** Lists subjects as entry points (flashcard decks, mock tests): continue → your branch → everything. */
export default function SubjectPicker({
  store, branchId, href, meta, cta,
}: {
  store: MasteryStore;
  branchId: string | null;
  href: (skill: Skill) => string;
  meta: (skill: Skill) => ReactNode;
  cta: string;
}) {
  const practiced = getSkills()
    .filter((s) => Object.values(store).some((m) => m.skillId === s.id))
    .sort((a, b) => skillScore(store, a) - skillScore(store, b))
    .slice(0, 6);
  const branchSkills = branchId ? getBranchSkills(branchId).filter((s) => !practiced.includes(s)) : [];

  const tile = (s: Skill) => {
    const score = skillScore(store, s);
    return (
      <Link href={href(s)} className="card card-hover group flex flex-col p-5">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className="font-medium text-ink">{s.name}</h3>
          <ArrowRight className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
        </div>
        <p className="mb-4 flex-1 text-xs text-muted">{meta(s)}</p>
        <div className="flex items-center gap-3">
          <ProgressBar value={score} size="sm" />
          <span className="w-9 text-right text-xs font-medium tabular-nums text-muted">{score}%</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-12">
      {practiced.length > 0 && (
        <section>
          <SectionTitle title="Continue where you left off" subtitle={`Your practised subjects, weakest first — ${cta.toLowerCase()} to lock them in.`} />
          <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{practiced.map((s) => <div key={s.id} className="flex [&>*]:flex-1">{tile(s)}</div>)}</div>
        </section>
      )}
      {branchSkills.length > 0 && (
        <section>
          <SectionTitle title="From your branch" />
          <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{branchSkills.slice(0, 9).map((s) => <div key={s.id} className="flex [&>*]:flex-1">{tile(s)}</div>)}</div>
        </section>
      )}
      <section>
        <SectionTitle title="All subjects" />
        <Explorer
          items={getSkills().map((s) => ({
            id: s.id,
            text: `${s.name} ${s.subskills.map((ss) => ss.name).join(" ")}`,
            branches: getBranchesForSkill(s.id).map((b) => b.id),
            group: `Year ${s.level}`,
            node: tile(s),
          }))}
          branches={getBranches().map((b) => ({ id: b.id, short: b.short }))}
          groups={["Year 1", "Year 2", "Year 3", "Year 4"]}
          groupLabel="Years"
          placeholder="Search subjects…"
        />
      </section>
    </div>
  );
}
