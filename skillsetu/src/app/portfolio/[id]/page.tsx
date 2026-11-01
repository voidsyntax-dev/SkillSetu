import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getBranch, getCareer } from "@/lib/catalog";
import ProofList from "@/components/ProofList";
import { EmptyState } from "@/components/ui";
import { Sprout } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Skill Portfolio" };

// Public, read-only portfolio for registered users.
export default async function PortfolioPage({ params }: Props) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id }, include: { proofs: { orderBy: { earnedAt: "desc" } } } });
  if (!user || user.isGuest) notFound();
  const branch = user.branchId ? getBranch(user.branchId) : undefined;
  const career = user.targetCareerId ? getCareer(user.targetCareerId) : undefined;

  return (
    <div className="page">
      <header className="card mb-8 p-6 sm:p-8">
        <p className="text-sm font-semibold text-brand">SkillSetu verified portfolio</p>
        <h1 className="h1 mt-1">{user.name}</h1>
        <p className="mt-2 text-muted">
          {[branch?.name, career && `aiming for ${career.name}`].filter(Boolean).join(" · ") || "Engineering learner"}
        </p>
        <p className="mt-3 text-sm text-muted">{user.proofs.length} proofs of mastery · longest practice streak {user.longestStreak} days</p>
      </header>
      {user.proofs.length ? <ProofList proofs={user.proofs} /> : <EmptyState icon={<Sprout className="h-6 w-6" />} title="No proofs yet">This learner is just getting started.</EmptyState>}
    </div>
  );
}
