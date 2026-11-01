import type { Metadata } from "next";
import { getBranches, getBranchesForSkill, getSkills } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/session";
import { getMasteryStore, skillScore } from "@/lib/insights";
import { SkillCard } from "@/components/cards";
import { PageHeader } from "@/components/ui";
import Explorer from "@/components/Explorer";

export const metadata: Metadata = { title: "Skills & Subjects" };

export default async function SkillsPage() {
  const store = await getMasteryStore(await getSessionUserId());
  const items = getSkills().map((s) => ({
    id: s.id,
    text: `${s.name} ${s.description} ${s.subskills.map((ss) => `${ss.name} ${ss.concepts.map((c) => c.term).join(" ")}`).join(" ")}`,
    branches: getBranchesForSkill(s.id).map((b) => b.id),
    group: `Year ${s.level}`,
    node: <SkillCard skill={s} mastery={skillScore(store, s)} />,
  }));

  return (
    <div className="page">
      <PageHeader title="Skills & subjects" subtitle={`${items.length} subjects across all branches. Search by subject, subskill or concept.`} />
      <Explorer items={items} branches={getBranches().map((b) => ({ id: b.id, short: b.short }))}
        groups={["Year 1", "Year 2", "Year 3", "Year 4"]} groupLabel="Years" placeholder="Search e.g. “Reynolds number”, “SQL”…" />
    </div>
  );
}
