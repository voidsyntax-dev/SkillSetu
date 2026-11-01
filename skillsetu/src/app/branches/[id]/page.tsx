import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBranch, getBranchCareers, getBranchSkills } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/session";
import { allCareerFits, branchProgress, getMasteryStore, skillScore } from "@/lib/insights";
import { CareerCard, SkillCard } from "@/components/cards";
import { Breadcrumbs, MasteryRing } from "@/components/ui";
import SkillGraph from "@/components/SkillGraph";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const branch = getBranch((await params).id);
  return { title: branch?.name ?? "Branch", description: branch?.description };
}

const YEAR_LABEL = ["", "Year 1 · Foundations", "Year 2 · Core", "Year 3 · Advanced core", "Year 4 · Specialisation"];

export default async function BranchPage({ params }: Props) {
  const branch = getBranch((await params).id);
  if (!branch) notFound();

  const store = await getMasteryStore(await getSessionUserId());
  const skills = getBranchSkills(branch.id);
  const careers = getBranchCareers(branch.id);
  const fits = new Map(allCareerFits(store).map((f) => [f.career.id, f.fit]));
  const mastery = Object.fromEntries(skills.map((s) => [s.id, skillScore(store, s)]));
  const byYear = [1, 2, 3, 4].map((y) => skills.filter((s) => s.level === y)).map((list, i) => [i + 1, list] as const);

  return (
    <div className="page">
      <Breadcrumbs items={[{ label: "Branches", href: "/branches" }, { label: branch.name }]} />
      <section className="card mb-10 flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-4xl" aria-hidden>{branch.icon}</span>
        <div className="flex-1">
          <h1 className="h1">{branch.name}</h1>
          <p className="mt-2 text-muted">{branch.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="chip">{skills.length} subjects</span>
            <span className="chip">{skills.reduce((n, s) => n + s.subskills.length, 0)} subskills</span>
            <span className="chip">{careers.length} career paths</span>
          </div>
        </div>
        <MasteryRing value={branchProgress(store, branch.id)} size={88} label="overall" />
      </section>

      <section className="mb-12">
        <h2 className="h2 mb-4">Career paths</h2>
        <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {careers.map((c) => <CareerCard key={c.id} career={c} fit={fits.get(c.id)} />)}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="h2 mb-1">Subject roadmap</h2>
        <p className="mb-4 text-sm text-muted">Arrows point from a prerequisite to the subjects that build on it. Click any subject to open it.</p>
        <div className="card p-4"><SkillGraph skills={skills} mastery={mastery} /></div>
      </section>

      {byYear.filter(([, list]) => list.length).map(([year, list]) => (
        <section key={year} className="mb-10">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{YEAR_LABEL[year]}</h3>
          <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => <SkillCard key={s.id} skill={s} mastery={mastery[s.id]} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
