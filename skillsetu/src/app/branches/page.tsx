import type { Metadata } from "next";
import { getBranchCareers, getBranches } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/session";
import { branchProgress, getMasteryStore } from "@/lib/insights";
import { BranchCard } from "@/components/cards";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Engineering Branches" };

export default async function BranchesPage() {
  const store = await getMasteryStore(await getSessionUserId());
  return (
    <div className="page">
      <PageHeader title="Engineering branches" subtitle="Pick your branch to see its subject roadmap, the careers it leads to, and your progress." />
      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {getBranches().map((b) => (
          <BranchCard key={b.id} branch={b} careerCount={getBranchCareers(b.id).length} progress={branchProgress(store, b.id)} />
        ))}
      </div>
    </div>
  );
}
