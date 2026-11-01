import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarClock, GalleryVerticalEnd, Play, Target, TrendingDown } from "lucide-react";
import { getQuestions, getResources, getSkill, getSubskill } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/session";
import { getMasteryStore } from "@/lib/insights";
import { daysSince, daysUntilBelow, decayRisk, effectiveScore, masteryLabel } from "@/lib/mastery";
import { prisma } from "@/lib/db";
import { Breadcrumbs, DecayPill, MasteryRing } from "@/components/ui";
import ResourceList from "@/components/ResourceList";
import MentorBox from "@/components/MentorBox";
import BookmarkButton from "@/components/BookmarkButton";
import NotesPanel from "@/components/NotesPanel";

type Props = { params: Promise<{ skillId: string; subskillId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skillId, subskillId } = await params;
  const sub = getSubskill(skillId, subskillId);
  return { title: sub ? `${sub.name} · ${getSkill(skillId)?.name}` : "Subskill", description: sub?.summary };
}

export default async function SubskillPage({ params }: Props) {
  const { skillId, subskillId } = await params;
  const skill = getSkill(skillId);
  const sub = getSubskill(skillId, subskillId);
  if (!skill || !sub) notFound();

  const userId = await getSessionUserId();
  const store = await getMasteryStore(userId);
  const m = store[`${skillId}:${subskillId}`];
  const eff = m ? effectiveScore(m) : 0;
  const risk = m ? decayRisk(eff, m.score) : null;
  const resources = getResources(skillId, subskillId);
  const [progressRows, bookmark, note] = userId
    ? await Promise.all([
        prisma.resourceProgress.findMany({ where: { userId, resourceId: { in: resources.map((r) => r.id) } } }),
        prisma.bookmark.findUnique({ where: { userId_skillId_subskillId: { userId, skillId, subskillId } } }),
        prisma.note.findUnique({ where: { userId_skillId_subskillId: { userId, skillId, subskillId } } }),
      ])
    : [[], null, null];
  const progress = Object.fromEntries(progressRows.map((r) => [r.resourceId, { completed: r.completed, liked: r.liked }]));
  const questionCount = getQuestions(skillId, subskillId).length;
  const idx = skill.subskills.findIndex((s) => s.id === subskillId);
  const prev = skill.subskills[idx - 1];
  const next = skill.subskills[idx + 1];
  const reviewIn = m && eff >= 60 ? daysUntilBelow(eff, 60) : null;
  const days = m ? Math.floor(daysSince(m.lastPracticedAt)) : 0;

  return (
    <div className="page">
      <Breadcrumbs items={[{ label: "Skills", href: "/skills" }, { label: skill.name, href: `/skills/${skill.id}` }, { label: sub.name }]} />

      <section className="card mb-8 overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="chip">Topic {idx + 1} of {skill.subskills.length}</span>
              <span className="chip">{masteryLabel(eff)}</span>
              {risk && <DecayPill risk={risk} />}
            </div>
            <h1 className="h1">{sub.name}</h1>
            <p className="mt-2 max-w-2xl text-muted">{sub.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={`/practice/${skillId}/${subskillId}`} className="btn-primary">
                <Play className="h-4 w-4" />{risk === "high" ? "Revise now" : m ? "Continue practice" : "Start practice"}
              </Link>
              <Link href={`/flashcards/${skillId}?sub=${subskillId}`} className="btn-secondary"><GalleryVerticalEnd className="h-4 w-4" />Flashcards</Link>
              <BookmarkButton skillId={skillId} subskillId={subskillId} initial={!!bookmark} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MasteryRing value={eff} size={112} label="mastery" />
            <span className="mt-1 text-xs text-subtle">{questionCount} questions available</span>
          </div>
        </div>
        {m && (
          <div className="grid grid-cols-2 divide-x divide-line border-t border-line bg-surface-2/50 text-sm sm:grid-cols-4">
            {[
              [CalendarClock, "Last practised", days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`],
              [Target, "Accuracy", `${Math.round((m.correctCount / m.attemptCount) * 100)}% · ${m.attemptCount} tries`],
              [TrendingDown, "Decayed", Math.round(m.score) > eff ? `−${Math.round(m.score) - eff}%` : "None yet"],
              [CalendarClock, "Review by", reviewIn && reviewIn > 0 ? `${reviewIn} days` : eff < 60 ? "Now" : "—"],
            ].map(([Icon, label, value]) => {
              const I = Icon as typeof Target;
              return (
                <div key={String(label)} className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-subtle"><I className="h-3.5 w-3.5" />{String(label)}</div>
                  <div className="mt-0.5 font-medium text-ink">{String(value)}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-3">
          <section className="card p-6">
            <h2 className="h2 mb-5">Key concepts</h2>
            <dl className="stagger space-y-5">
              {sub.concepts.map((c, i) => (
                <div key={c.term} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-xs font-semibold text-brand">{i + 1}</span>
                  <div>
                    <dt className="font-medium text-ink">{c.term}</dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-muted">{c.definition}.</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>
          <section className="card p-6">
            <h2 className="h2 mb-1">Learning resources</h2>
            <p className="mb-2 text-sm text-muted">Trusted platforms plus the standard textbook. Mark them done as you go.</p>
            <ResourceList resources={resources} progress={progress} />
          </section>
          <div id="notes" className="scroll-mt-24">
            <NotesPanel skillId={skillId} subskillId={subskillId} initial={note?.body ?? ""} />
          </div>
        </div>
        <aside className="space-y-6 lg:col-span-2">
          <MentorBox
            title="Ask the mentor"
            description={`Ask a doubt about ${sub.name}, or leave it blank for a full explanation with an analogy and real-world example.`}
            buttonLabel="Explain"
            request={{ mode: "explain", skillId, subskillId }}
            inputLabel="Your doubt (optional)"
            inputPlaceholder={`e.g. Why does ${sub.concepts[0]?.term ?? sub.name} matter in industry?`}
          />
          <div className="grid grid-cols-2 gap-3">
            {prev ? (
              <Link href={`/subskills/${skillId}/${prev.id}`} className="card card-hover group p-4">
                <div className="flex items-center gap-1 text-xs text-subtle"><ArrowLeft className="h-3 w-3" />Previous</div>
                <div className="mt-1 line-clamp-2 text-sm font-medium text-ink group-hover:text-brand">{prev.name}</div>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/subskills/${skillId}/${next.id}`} className="card card-hover group p-4 text-right">
                <div className="flex items-center justify-end gap-1 text-xs text-subtle">Next<ArrowRight className="h-3 w-3" /></div>
                <div className="mt-1 line-clamp-2 text-sm font-medium text-ink group-hover:text-brand">{next.name}</div>
              </Link>
            ) : (
              <Link href={`/test/${skillId}`} className="card card-hover group p-4 text-right">
                <div className="flex items-center justify-end gap-1 text-xs text-subtle">Finished the subject?<ArrowRight className="h-3 w-3" /></div>
                <div className="mt-1 text-sm font-medium text-ink group-hover:text-brand">Take the mock test</div>
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
