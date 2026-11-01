import type { Metadata } from "next";
import { getBranch, getBranches, getCareers, getSkill } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/session";
import { allCareerFits, getMasteryStore } from "@/lib/insights";
import { CareerCard } from "@/components/cards";
import { PageHeader } from "@/components/ui";
import Explorer from "@/components/Explorer";

export const metadata: Metadata = { title: "Careers" };

export default async function CareersPage() {
  const store = await getMasteryStore(await getSessionUserId());
  const fits = new Map(allCareerFits(store).map((f) => [f.career.id, f.fit]));
  const items = getCareers().map((c) => ({
    id: c.id,
    text: `${c.name} ${c.description} ${c.skills.map((s) => getSkill(s.id)?.name).join(" ")}`,
    branches: [c.branchId],
    group: c.difficulty,
    node: <CareerCard career={c} branchName={getBranch(c.branchId)?.name} fit={fits.get(c.id)} />,
  }));

  return (
    <div className="page">
      <PageHeader title="Explore careers" subtitle={`${items.length} engineering career paths, each mapped to the exact skills it needs.`} />
      <Explorer items={items} branches={getBranches().map((b) => ({ id: b.id, short: b.short }))}
        groups={["Beginner", "Intermediate", "Advanced"]} groupLabel="Difficulties" placeholder="Search careers or skills…" />
    </div>
  );
}
