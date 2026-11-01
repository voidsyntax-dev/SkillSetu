import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBranch, getCareer, getCareerSkills } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/session";
import { careerFit, getMasteryStore, skillScore } from "@/lib/insights";
import { SkillCard } from "@/components/cards";
import { Breadcrumbs, MasteryRing, ProgressBar } from "@/components/ui";
import SkillGraph from "@/components/SkillGraph";
import TargetCareerButton from "@/components/TargetCareerButton";
import MentorBox from "@/components/MentorBox";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const career = getCareer((await params).id);
  return { title: career ? `${career.name} roadmap` : "Career", description: career?.description };
}

const WEIGHT_LABEL = { 1: "Useful", 2: "Important", 3: "Critical" } as const;

export default async function CareerPage({ params }: Props) {
  const career = getCareer((await params).id);
  if (!career) notFound();

  const user = await getCurrentUser();
  const store = await getMasteryStore(user?.id ?? null);
  const fit = careerFit(store, career);
  const branch = getBranch(career.branchId);
  const roadmap = getCareerSkills(career.id);
  const weights = new Map(career.skills.map((s) => [s.id, s.weight]));
  const mastery = Object.fromEntries(roadmap.map((s) => [s.id, skillScore(store, s)]));

  return (
    <div className="page">
      <Breadcrumbs items={[{ label: "Careers", href: "/careers" }, ...(branch ? [{ label: branch.short, href: `/branches/${branch.id}` }] : []), { label: career.name }]} />

      <section className="card mb-8 p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <h1 className="h1">{career.name}</h1>
            <p className="mt-3 text-muted">{career.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[["Difficulty", career.difficulty], ["Salary", career.salary], ["Time to job-ready", career.learningTime], ["Branch", branch?.short ?? "—"]].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">{k}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-sm text-muted"><span className="font-medium text-ink">Outlook:</span> {career.outlook}</p>
            <p className="mt-1 text-sm text-muted"><span className="font-medium text-ink">Typical employers:</span> {career.employers.join(", ")}</p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-3">
            <MasteryRing value={fit.fit} size={104} label="career fit" />
            <TargetCareerButton careerId={career.id} isTarget={user?.targetCareerId === career.id} />
          </div>
        </div>
      </section>

      <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="h2 mb-4">Skill readiness</h2>
          <ul className="space-y-4">
            {fit.skills.sort((a, b) => b.weight - a.weight).map(({ skill, score, weight }) => (
              <li key={skill.id}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <Link href={`/skills/${skill.id}`} className="font-medium text-ink hover:text-brand">{skill.name}</Link>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-muted">{WEIGHT_LABEL[weight as 1 | 2 | 3]}</span>
                    <span className="w-10 text-right font-semibold">{score}%</span>
                  </span>
                </div>
                <ProgressBar value={score} />
              </li>
            ))}
          </ul>
        </section>
        <MentorBox
          title="Gap analysis"
          description="Get a focused two-week plan for your biggest gaps toward this role, based on your current mastery."
          buttonLabel="Analyse my gaps"
          request={{ mode: "gaps", careerId: career.id }}
        />
      </div>

      <section className="mb-10">
        <h2 className="h2 mb-1">Learning roadmap</h2>
        <p className="mb-4 text-sm text-muted">Includes prerequisite subjects. Work left to right.</p>
        <div className="card p-4"><SkillGraph skills={roadmap} mastery={mastery} /></div>
      </section>

      <section>
        <h2 className="h2 mb-4">Skills in order</h2>
        <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roadmap.map((s) => <SkillCard key={s.id} skill={s} mastery={mastery[s.id]} weight={weights.get(s.id)} />)}
        </div>
      </section>
    </div>
  );
}
