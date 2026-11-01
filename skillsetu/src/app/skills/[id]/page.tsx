import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, GalleryVerticalEnd, Play, Timer } from "lucide-react";
import { notFound } from "next/navigation";
import { getBranchesForSkill, getCareersForSkill, getDependentSkills, getQuestions, getSkill } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/session";
import { getMasteryStore, skillScore } from "@/lib/insights";
import { decayRisk, effectiveScore } from "@/lib/mastery";
import { Breadcrumbs, DecayPill, MasteryRing, ProgressBar } from "@/components/ui";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const skill = getSkill((await params).id);
  return { title: skill?.name ?? "Skill", description: skill?.description };
}

export default async function SkillPage({ params }: Props) {
  const skill = getSkill((await params).id);
  if (!skill) notFound();

  const store = await getMasteryStore(await getSessionUserId());
  const prereqs = skill.dependsOn.map(getSkill).filter((s) => !!s);
  const unlocks = getDependentSkills(skill.id);
  const careers = getCareersForSkill(skill.id);
  const branches = getBranchesForSkill(skill.id);

  return (
    <div className="page">
      <Breadcrumbs items={[{ label: "Skills", href: "/skills" }, { label: skill.name }]} />

      <section className="card mb-8 flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="chip">Year {skill.level}</span>
            <span className="chip capitalize">{skill.category}</span>
            {branches.map((b) => <Link key={b.id} href={`/branches/${b.id}`} className="chip hover:text-brand">{b.icon} {b.short}</Link>)}
          </div>
          <h1 className="h1">{skill.name}</h1>
          <p className="mt-2 text-muted">{skill.description}</p>
          {skill.book && <p className="mt-3 flex items-center gap-1.5 text-sm text-muted"><BookOpen className="h-4 w-4 text-subtle" />Recommended text: <span className="text-ink">{skill.book}</span></p>}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href={`/subskills/${skill.id}/${skill.subskills[0].id}`} className="btn-primary"><Play className="h-4 w-4" />Start learning</Link>
            <Link href={`/flashcards/${skill.id}`} className="btn-secondary"><GalleryVerticalEnd className="h-4 w-4" />Flashcards</Link>
            <Link href={`/test/${skill.id}`} className="btn-secondary"><Timer className="h-4 w-4" />Mock test</Link>
          </div>
        </div>
        <MasteryRing value={skillScore(store, skill)} size={96} label="mastery" />
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="h2 mb-4">Subskills</h2>
          <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2">
            {skill.subskills.map((ss) => {
              const m = store[`${skill.id}:${ss.id}`];
              const eff = m ? effectiveScore(m) : 0;
              const risk = m ? decayRisk(eff, m.score) : null;
              return (
                <Link key={ss.id} href={`/subskills/${skill.id}/${ss.id}`} className="card card-hover group flex flex-col p-5">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-ink group-hover:text-brand">{ss.name}</h3>
                    {risk && <DecayPill risk={risk} />}
                  </div>
                  <p className="mb-3 flex-1 text-sm text-muted">{ss.summary}</p>
                  <div className="mb-3 text-xs text-muted">{ss.concepts.length} concepts · {getQuestions(skill.id, ss.id).length} questions</div>
                  <div className="mb-1 flex justify-between text-xs"><span className="text-muted">Mastery</span><span className="font-semibold">{eff}%</span></div>
                  <ProgressBar value={eff} tone={risk === "high" ? "bad" : risk === "medium" ? "warn" : undefined} />
                </Link>
              );
            })}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="card p-5">
            <h3 className="mb-3 font-semibold text-ink">Prerequisites</h3>
            {prereqs.length ? (
              <ul className="space-y-2 text-sm">
                {prereqs.map((p) => (
                  <li key={p.id} className="flex justify-between gap-2">
                    <Link href={`/skills/${p.id}`} className="text-brand hover:underline">{p.name}</Link>
                    <span className="text-muted">{skillScore(store, p)}%</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">None — a great place to start.</p>}
          </div>
          {unlocks.length > 0 && (
            <div className="card p-5">
              <h3 className="mb-3 font-semibold text-ink">Unlocks</h3>
              <div className="flex flex-wrap gap-2">
                {unlocks.map((u) => <Link key={u.id} href={`/skills/${u.id}`} className="chip hover:text-brand">{u.name}</Link>)}
              </div>
            </div>
          )}
          <div className="card p-5">
            <h3 className="mb-3 font-semibold text-ink">Careers that need it</h3>
            {careers.length ? (
              <ul className="space-y-2 text-sm">
                {careers.map((c) => <li key={c.id}><Link href={`/career/${c.id}`} className="text-brand hover:underline">{c.name}</Link></li>)}
              </ul>
            ) : <p className="text-sm text-muted">Supports other subjects as a prerequisite.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
