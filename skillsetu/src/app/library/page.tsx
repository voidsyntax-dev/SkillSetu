import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookMarked, GalleryVerticalEnd, NotebookPen } from "lucide-react";
import { getSkill, getSubskill } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getMasteryStore, subskillScore } from "@/lib/insights";
import { EmptyState, PageHeader, ProgressBar, SectionTitle } from "@/components/ui";

export const metadata: Metadata = { title: "My Library" };

export default async function LibraryPage() {
  const userId = await getSessionUserId();
  const [bookmarks, notes, store] = userId
    ? await Promise.all([
        prisma.bookmark.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
        prisma.note.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
        getMasteryStore(userId),
      ])
    : [[], [], {}];

  const saved = bookmarks.map((b) => ({ ...b, skill: getSkill(b.skillId), sub: getSubskill(b.skillId, b.subskillId) })).filter((b) => b.skill && b.sub);
  const noteRows = notes.map((n) => ({ ...n, skill: getSkill(n.skillId), sub: getSubskill(n.skillId, n.subskillId) })).filter((n) => n.skill && n.sub);

  return (
    <div className="page">
      <PageHeader eyebrow="You" title="My library" subtitle="Topics you saved and the notes you've written, all in one place." />

      {!saved.length && !noteRows.length ? (
        <EmptyState icon={<BookMarked className="h-6 w-6" />} title="Your library is empty" action={<Link href="/skills" className="btn-primary">Browse subjects</Link>}>
          Open any subskill and use “Save topic” or write notes — they&apos;ll show up here.
        </EmptyState>
      ) : (
        <div className="space-y-12">
          <section>
            <SectionTitle title="Saved topics" subtitle={`${saved.length} topic${saved.length === 1 ? "" : "s"}`} />
            {saved.length ? (
              <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {saved.map(({ id, skill, sub }) => {
                  const score = subskillScore(store, skill!.id, sub!.id);
                  return (
                    <div key={id} className="card card-hover flex flex-col p-5">
                      <Link href={`/subskills/${skill!.id}/${sub!.id}`} className="group">
                        <div className="text-xs text-muted">{skill!.name}</div>
                        <h3 className="mt-0.5 flex items-center justify-between font-medium text-ink group-hover:text-brand">
                          {sub!.name}<ArrowRight className="h-4 w-4 text-subtle transition-transform group-hover:translate-x-0.5" />
                        </h3>
                      </Link>
                      <div className="my-4 flex items-center gap-3"><ProgressBar value={score} size="sm" /><span className="text-xs tabular-nums text-muted">{score}%</span></div>
                      <div className="mt-auto flex gap-2">
                        <Link href={`/practice/${skill!.id}/${sub!.id}`} className="btn-secondary btn-sm flex-1">Practise</Link>
                        <Link href={`/flashcards/${skill!.id}?sub=${sub!.id}`} className="btn-ghost btn-sm"><GalleryVerticalEnd className="h-3.5 w-3.5" />Cards</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-sm text-muted">No saved topics yet.</p>}
          </section>

          <section>
            <SectionTitle title="Notes" subtitle={`${noteRows.length} note${noteRows.length === 1 ? "" : "s"}`} />
            {noteRows.length ? (
              <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2">
                {noteRows.map(({ id, skill, sub, body, updatedAt }) => (
                  <Link key={id} href={`/subskills/${skill!.id}/${sub!.id}#notes`} className="card card-hover group block p-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-xs text-muted">{skill!.name}</div>
                        <h3 className="truncate font-medium text-ink group-hover:text-brand">{sub!.name}</h3>
                      </div>
                      <NotebookPen className="h-4 w-4 shrink-0 text-subtle" />
                    </div>
                    <p className="line-clamp-4 whitespace-pre-line text-sm text-muted">{body}</p>
                    <p className="mt-3 text-xs text-subtle">Edited {updatedAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </Link>
                ))}
              </div>
            ) : <p className="text-sm text-muted">No notes yet.</p>}
          </section>
        </div>
      )}
    </div>
  );
}
