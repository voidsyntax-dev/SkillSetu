import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { createGroupAction, joinGroupAction } from "@/lib/actions";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";
import { EmptyState, PageHeader, SectionTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Groups" };

const ERRORS: Record<string, string> = { name: "Please enter a group name.", code: "No group has that code." };

export default async function GroupsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const userId = await getSessionUserId();
  const memberships = userId
    ? await prisma.groupMember.findMany({
        where: { userId }, orderBy: { joinedAt: "desc" },
        include: { group: { include: { _count: { select: { members: true } } } } },
      })
    : [];
  const error = (await searchParams).error;

  return (
    <div className="page">
      <PageHeader eyebrow="Community" title="Study groups"
        subtitle="Create a group for your class or study circle. Share the code so members can join, track weekly progress on the leaderboard, and assign subjects to practise." />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <form action={createGroupAction} className="card space-y-3 p-6">
            <h2 className="h2">Create a group</h2>
            <input name="name" className="input" placeholder="e.g. Thermo — 4th sem" maxLength={60} required aria-label="Group name" />
            <button className="btn-primary w-full">Create group</button>
          </form>
          <form action={joinGroupAction} className="card space-y-3 p-6">
            <h2 className="h2">Join with a code</h2>
            <input name="code" className="input font-mono uppercase tracking-widest" placeholder="ABC123" maxLength={6} required aria-label="Group code" />
            <button className="btn-secondary w-full">Join group</button>
            {error && ERRORS[error] && <p className="text-sm text-bad">{ERRORS[error]}</p>}
          </form>
        </div>

        <div className="lg:col-span-3">
          <SectionTitle title="Your groups" />
          {memberships.length ? (
            <ul className="stagger space-y-3">
              {memberships.map((m) => (
                <li key={m.id}>
                  <Link href={`/groups/${m.group.id}`} className="card card-hover group flex items-center gap-4 p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand"><Users className="h-5 w-5" /></span>
                    <span className="flex-1">
                      <span className="block font-medium text-ink group-hover:text-brand">{m.group.name}</span>
                      <span className="text-xs text-muted">{m.group._count.members} members · code {m.group.code} · {m.role === "owner" ? "you own this group" : "member"}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-subtle transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={<Users className="h-6 w-6" />} title="No groups yet">Create one for your class, or join with a code from a classmate.</EmptyState>
          )}
        </div>
      </div>
    </div>
  );
}
