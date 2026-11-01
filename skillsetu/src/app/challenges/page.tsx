import type { Metadata } from "next";
import Link from "next/link";
import { Swords } from "lucide-react";
import { createChallengeAction } from "@/lib/actions";
import { getSkills } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";
import { EmptyState, PageHeader, SectionTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Challenges" };

export default async function ChallengesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const userId = await getSessionUserId();
  const [created, results] = userId
    ? await Promise.all([
        prisma.challenge.findMany({ where: { creatorId: userId }, orderBy: { createdAt: "desc" }, take: 10, include: { _count: { select: { results: true } } } }),
        prisma.challengeResult.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10, include: { challenge: { select: { code: true } } } }),
      ])
    : [[], []];
  const error = (await searchParams).error;

  return (
    <div className="page">
      <PageHeader eyebrow="Practice" title="Head-to-head challenges"
        subtitle="Create a five-question challenge on any subject and send the link. Everyone who takes it appears on the leaderboard." />

      <div className="grid gap-8 lg:grid-cols-5">
        <form action={createChallengeAction} className="card space-y-4 p-6 lg:col-span-2">
          <h2 className="h2">New challenge</h2>
          <div>
            <label className="label" htmlFor="skillId">Subject</label>
            <select id="skillId" name="skillId" className="input" required defaultValue="">
              <option value="" disabled>Choose a subject…</option>
              {getSkills().map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          {error && <p className="text-sm text-bad">Please choose a subject.</p>}
          <button className="btn-primary w-full"><Swords className="h-4 w-4" />Create challenge</button>
        </form>

        <div className="space-y-8 lg:col-span-3">
          <section>
            <SectionTitle title="Your challenges" />
            {created.length ? (
              <ul className="stagger space-y-2">
                {created.map((c) => (
                  <li key={c.id}>
                    <Link href={`/challenge/${c.code}`} className="card card-hover flex items-center justify-between p-4">
                      <span className="font-medium text-ink">Code {c.code}</span>
                      <span className="text-xs text-muted">{c._count.results} played</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">You haven&apos;t created any challenges yet.</p>}
          </section>
          <section>
            <SectionTitle title="Your results" />
            {results.length ? (
              <ul className="stagger space-y-2">
                {results.map((r) => (
                  <li key={r.id}>
                    <Link href={`/challenge/${r.challenge.code}`} className="card card-hover flex items-center justify-between p-4">
                      <span className="text-sm text-ink">Challenge {r.challenge.code}</span>
                      <span className="font-semibold tabular-nums text-ink">{r.score}/{r.total}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">No results yet.</p>}
          </section>
          {!created.length && !results.length && (
            <EmptyState icon={<Swords className="h-6 w-6" />} title="Nothing here yet">Create a challenge or open a link a friend sent you.</EmptyState>
          )}
        </div>
      </div>
    </div>
  );
}
