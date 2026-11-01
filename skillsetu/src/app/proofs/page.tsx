import type { Metadata } from "next";
import Link from "next/link";
import { Award } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { EmptyState, PageHeader } from "@/components/ui";
import ProofList from "@/components/ProofList";
import CopyLinkButton from "@/components/CopyLinkButton";

export const metadata: Metadata = { title: "Proof Vault" };

export default async function ProofsPage() {
  const user = await getCurrentUser();
  const proofs = user ? await prisma.proof.findMany({ where: { userId: user.id }, orderBy: { earnedAt: "desc" } }) : [];

  return (
    <div className="page">
      <PageHeader
        title="Proof vault"
        subtitle="Evidence of mastery, issued automatically when a subskill passes 80% with at least 70% accuracy over 5+ attempts."
        actions={user && proofs.length > 0 && (user.isGuest
          ? <Link href="/signup" className="btn-secondary">Sign up to share your portfolio</Link>
          : <><CopyLinkButton path={`/portfolio/${user.id}`} /><Link href={`/portfolio/${user.id}`} className="btn-ghost">Preview</Link></>)}
      />
      {proofs.length ? (
        <ProofList proofs={proofs} />
      ) : (
        <EmptyState icon={<Award className="h-6 w-6" />} title="Your vault is empty" action={<Link href="/review" className="btn-primary">Start practising</Link>}>
          Push any subskill past 80% mastery to earn your first proof.
        </EmptyState>
      )}
    </div>
  );
}
