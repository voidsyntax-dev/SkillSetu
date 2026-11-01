import type { Metadata } from "next";
import { getBranches, getCareers } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/session";
import OnboardingWizard from "@/components/OnboardingWizard";

export const metadata: Metadata = { title: "Get started" };

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  return (
    <div className="px-4 py-10 sm:px-6 sm:py-14">
      <OnboardingWizard
        branches={getBranches().map((b) => ({ id: b.id, name: b.name, icon: b.icon, description: b.description }))}
        careers={getCareers().map((c) => ({ id: c.id, name: c.name, branchId: c.branchId, description: c.description, salary: c.salary, difficulty: c.difficulty }))}
        initial={{ branchId: user?.branchId ?? "", careerId: user?.targetCareerId ?? "", dailyGoal: user?.dailyGoal ?? 10 }}
      />
    </div>
  );
}
