import { randomInt } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { dailyPlan, getMasteryStore, subskillScore, subskillStatuses } from "@/lib/insights";
import { practiceQuestions } from "@/lib/practice";
import PracticeEngine from "@/components/PracticeEngine";
import { EmptyState, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Daily Review" };

export default async function ReviewPage() {
  const user = await getCurrentUser();
  const store = await getMasteryStore(user?.id ?? null);

  // Review the most at-risk practised subskills; fall back to the daily plan.
  const statuses = subskillStatuses(store)
    .filter((s) => s.effective < 85)
    .sort((a, b) => (a.effective - (a.stored - a.effective) * 2) - (b.effective - (b.stored - b.effective) * 2))
    .slice(0, 4);
  const targets = statuses.length
    ? statuses.map((s) => ({ skillId: s.skillId, subskillId: s.subskillId }))
    : dailyPlan(store, { targetCareerId: user?.targetCareerId, branchId: user?.branchId }, 3);

  if (!targets.length) {
    return (
      <div className="page">
        <PageHeader title="Daily review" />
        <EmptyState icon={<PartyPopper className="h-6 w-6" />} title="Nothing to review" action={<Link href="/skills" className="btn-primary">Explore skills</Link>}>
          Everything you&apos;ve practised is above 85%. Learn something new!
        </EmptyState>
      </div>
    );
  }

  const questions = targets.flatMap((t) => practiceQuestions(t.skillId, t.subskillId));
  const initial = Object.fromEntries(targets.map((t) => [`${t.skillId}:${t.subskillId}`, subskillScore(store, t.skillId, t.subskillId)]));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <p className="mb-6 text-sm text-muted">
        {statuses.length ? "Mixed revision of your weakest and most-decayed subskills." : "You haven't practised yet — here's a starter set from your roadmap."}{" "}
        Topics: {[...new Set(questions.map((q) => q.subskillName))].join(", ")}.
      </p>
      <PracticeEngine questions={questions} initialMastery={initial} seed={randomInt(2 ** 31)} title="Daily review" backHref="/dashboard" backLabel="Dashboard" showTopic />
    </div>
  );
}
