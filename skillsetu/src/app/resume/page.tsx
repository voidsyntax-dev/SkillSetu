import type { Metadata } from "next";
import Link from "next/link";
import { getBranch, getCareer, getSkill } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getMasteryStore, skillScore, subskillStatuses } from "@/lib/insights";
import { MASTERY_THRESHOLD } from "@/lib/mastery";
import PrintButton from "@/components/PrintButton";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Resume" };

export default async function ResumePage() {
  const user = await getCurrentUser();
  if (!user || user.isGuest) {
    return (
      <div className="page">
        <PageHeader title="Resume" subtitle="Create an account to generate a resume from your verified proofs." />
        <Link href="/signup" className="btn-primary">Create account</Link>
      </div>
    );
  }
  const store = await getMasteryStore(user.id);
  const [proofs, badges] = await Promise.all([
    prisma.proof.findMany({ where: { userId: user.id }, orderBy: { earnedAt: "desc" }, take: 12 }),
    prisma.badge.count({ where: { userId: user.id } }),
  ]);
  const branch = user.branchId ? getBranch(user.branchId) : undefined;
  const career = user.targetCareerId ? getCareer(user.targetCareerId) : undefined;
  const practised = [...new Set(subskillStatuses(store).map((s) => s.skillId))]
    .map((id) => getSkill(id))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .map((s) => ({ name: s.name, score: skillScore(store, s) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
  const mastered = subskillStatuses(store).filter((s) => s.effective >= MASTERY_THRESHOLD).length;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 print:max-w-none print:p-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <PageHeader title="Resume" subtitle="Generated from your SkillSetu record. Print or save as PDF." />
        <PrintButton label="Print / save PDF" />
      </div>

      <article className="card space-y-6 p-8 print:border-0 print:p-0 print:shadow-none">
        <header className="border-b border-line pb-5">
          <h2 className="text-2xl font-semibold tracking-tight text-ink print:text-black">{user.name}</h2>
          <p className="mt-1 text-sm text-muted print:text-black">
            {[branch?.name, career && `Target: ${career.name}`].filter(Boolean).join(" · ")}
          </p>
        </header>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle print:text-black">Verified skills</h3>
          <ul className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {practised.map((s) => (
              <li key={s.name} className="flex justify-between text-ink print:text-black"><span>{s.name}</span><span className="tabular-nums text-muted">{s.score}%</span></li>
            ))}
          </ul>
          {practised.length === 0 && <p className="text-sm text-muted">Practise a subject to list it here.</p>}
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle print:text-black">Achievements</h3>
          <p className="text-sm text-ink print:text-black">
            {mastered} subtopic{mastered === 1 ? "" : "s"} mastered (≥ {MASTERY_THRESHOLD}%) · {proofs.length} proof{proofs.length === 1 ? "" : "s"} · {badges} badge{badges === 1 ? "" : "s"} · longest streak {user.longestStreak} days
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {proofs.map((p) => (
              <li key={p.id} className="text-ink print:text-black">
                <span className="font-medium">{p.title}</span>
                <span className="text-muted print:text-black"> — {p.description}</span>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
