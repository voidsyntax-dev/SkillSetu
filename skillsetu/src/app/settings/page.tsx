import type { Metadata } from "next";
import Link from "next/link";
import { getBranches, getCareers } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/session";
import SettingsForm from "@/components/SettingsForm";
import ResetProgressButton from "@/components/ResetProgressButton";
import MentorSettings from "@/components/MentorSettings";
import { serverKeyConfigured } from "@/lib/ai";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <PageHeader title="Settings" subtitle="Personalise your roadmap and goals." />
      {(!user || user.isGuest) && (
        <div className="card mb-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">You&apos;re learning as a guest. Create an account to keep your progress on any device.</p>
          <Link href="/signup" className="btn-primary shrink-0">Create account</Link>
        </div>
      )}
      <SettingsForm
        initial={{ name: user?.name ?? "", branchId: user?.branchId ?? "", targetCareerId: user?.targetCareerId ?? "", dailyGoal: user?.dailyGoal ?? 10 }}
        branches={getBranches().map((b) => ({ id: b.id, name: b.name }))}
        careers={getCareers().map((c) => ({ id: c.id, name: c.name, branchId: c.branchId }))}
      />
      <MentorSettings serverKey={serverKeyConfigured()} />
      {user && (
        <div className="card mt-6 flex items-center justify-between p-5">
          <div>
            <h3 className="font-semibold text-ink">Danger zone</h3>
            <p className="text-sm text-muted">Clear all mastery, activity, badges and proofs.</p>
          </div>
          <ResetProgressButton />
        </div>
      )}
    </div>
  );
}
