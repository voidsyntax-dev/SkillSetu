import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Award, CircleAlert, Flame, GalleryVerticalEnd, Gauge, Medal, Play, Repeat, Rocket, Sparkles, Target, Timer,
} from "lucide-react";
import { getCareer, getSkill } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { allCareerFits, careerFit, dailyPlan, getActivity, getMasteryStore, getOpenMistakes, skillScore, subskillStatuses } from "@/lib/insights";
import { BADGES } from "@/lib/badges";
import { dailyQuestionId, dueSubskills, resolveQuestion, weeklyReport } from "@/lib/planning";
import { prisma as db } from "@/lib/db";
import DailyQuestionCard from "@/components/DailyQuestionCard";
import { DueCard, WeeklyCard } from "@/components/Planning";
import { MASTERY_THRESHOLD, formatDay } from "@/lib/mastery";
import { ActivityBars, ActivityCalendar, RadarChart } from "@/components/charts";
import { DecayPill, EmptyState, MasteryRing, ProgressBar, SectionTitle, Stat } from "@/components/ui";
import ResetProgressButton from "@/components/ResetProgressButton";

export const metadata: Metadata = { title: "Dashboard" };

const KIND_STYLE = {
  revise: ["bg-bad-soft text-bad", "Revise"],
  strengthen: ["bg-warn-soft text-warn", "Strengthen"],
  learn: ["bg-brand-soft text-brand", "Learn"],
} as const;

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const store = await getMasteryStore(user?.id ?? null);
  const statuses = subskillStatuses(store);
  const plan = dailyPlan(store, { targetCareerId: user?.targetCareerId, branchId: user?.branchId });
  const target = user?.targetCareerId ? getCareer(user.targetCareerId) : undefined;
  const targetFit = target ? careerFit(store, target) : null;
  const firstName = user && !user.isGuest ? user.name.split(" ")[0] : null;

  const onboardingBanner = !user?.onboarded && (
    <div className="card animate-fade-up mb-8 flex flex-col gap-4 overflow-hidden border-brand/30 bg-gradient-to-r from-brand-soft to-surface p-5 sm:flex-row sm:items-center">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white"><Rocket className="h-5 w-5" /></span>
      <div className="flex-1">
        <h2 className="font-semibold text-ink">Personalise your roadmap</h2>
        <p className="text-sm text-muted">Tell us your branch, goal career and daily target — it takes under a minute.</p>
      </div>
      <Link href="/onboarding" className="btn-primary">Set up<ArrowRight className="h-4 w-4" /></Link>
    </div>
  );

  if (!statuses.length) {
    return (
      <div className="page">
        <header className="mb-8">
          <p className="text-sm text-muted">{greeting()}{firstName ? `, ${firstName}` : ""}</p>
          <h1 className="h1">Your dashboard</h1>
        </header>
        {onboardingBanner}
        <EmptyState icon={<Rocket className="h-6 w-6" />} title="Start your first practice session"
          action={
            <div className="flex flex-wrap justify-center gap-3">
              {plan[0] && <Link href={`/practice/${plan[0].skillId}/${plan[0].subskillId}`} className="btn-primary"><Play className="h-4 w-4" />Start with {plan[0].subskillName}</Link>}
              <Link href="/branches" className="btn-secondary">Browse branches</Link>
            </div>
          }>
          Your stats, charts, decay alerts and career fit appear here as you practise.
        </EmptyState>
        {plan.length > 0 && <div className="mt-8"><PlanCard plan={plan} /></div>}
      </div>
    );
  }

  const [activity14, activity126, badgeRows, proofCount, mistakes] = await Promise.all([
    getActivity(user!.id, 14),
    getActivity(user!.id, 126),
    prisma.badge.findMany({ where: { userId: user!.id } }),
    prisma.proof.count({ where: { userId: user!.id } }),
    getOpenMistakes(user!.id),
  ]);
  const today = activity14.find((a) => a.day === formatDay(new Date()));
  const todayCount = today?.answered ?? 0;
  const practicedSkills = [...new Set(statuses.map((s) => s.skillId))].map((id) => getSkill(id)!).filter(Boolean);
  const skillRows = practicedSkills.map((s) => ({ skill: s, score: skillScore(store, s) })).sort((a, b) => b.score - a.score);
  const avg = Math.round(statuses.reduce((n, s) => n + s.effective, 0) / statuses.length);
  const mastered = statuses.filter((s) => s.effective >= MASTERY_THRESHOLD).length;
  const alerts = statuses.filter((s) => s.risk !== "stable").sort((a, b) => a.effective - b.effective).slice(0, 8);
  const topFits = allCareerFits(store).slice(0, 4);
  const earned = new Set(badgeRows.map((b) => b.code));
  const weakest = skillRows[skillRows.length - 1]?.skill;

  const due = dueSubskills(store);
  const report = await weeklyReport(user!.id);
  const dayKey = formatDay(new Date());
  const dq = await resolveQuestion(dailyQuestionId(dayKey, user!.branchId));
  const dAnswer = await db.dailyAnswer.findUnique({ where: { day_userId: { day: dayKey, userId: user!.id } } });
  const dTotal = await db.dailyAnswer.count({ where: { day: dayKey, questionId: dq?.id ?? "" } });
  const dRight = await db.dailyAnswer.count({ where: { day: dayKey, questionId: dq?.id ?? "", correct: true } });
  const dailyPublic = dq ? { id: dq.id, question: dq.question, options: dq.options } : null;
  const dailyDone = dAnswer && dq
    ? { selected: dAnswer.selected, correct: dAnswer.correct, answer: dq.answer, explanation: dq.explanation, percent: dTotal ? Math.round((dRight / dTotal) * 100) : 0, total: dTotal }
    : null;

  const QUICK = [
    { href: "/review", icon: Repeat, title: "Daily review", text: `${alerts.length} topics need attention`, tone: "bg-brand-soft text-brand" },
    { href: weakest ? `/flashcards/${weakest.id}` : "/flashcards", icon: GalleryVerticalEnd, title: "Flashcards", text: weakest ? weakest.name : "Quick concept recall", tone: "bg-good-soft text-good" },
    { href: weakest ? `/test/${weakest.id}` : "/test", icon: Timer, title: "Mock test", text: "15 questions · 15 min", tone: "bg-warn-soft text-warn" },
    { href: "/mistakes", icon: CircleAlert, title: "Mistake book", text: `${mistakes.length} open mistake${mistakes.length === 1 ? "" : "s"}`, tone: "bg-bad-soft text-bad" },
  ];

  return (
    <div className="page">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted">{greeting()}{firstName ? `, ${firstName}` : ""}</p>
          <h1 className="h1">Your dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            {target ? <>Working toward <Link href={`/career/${target.id}`} className="font-medium text-brand hover:underline">{target.name}</Link></> : <>Set a <Link href="/onboarding" className="font-medium text-brand hover:underline">target career</Link> for a personalised plan.</>}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/review" className="btn-primary"><Play className="h-4 w-4" />Start daily review</Link>
          <ResetProgressButton />
        </div>
      </header>

      {onboardingBanner}

      <section className="stagger mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="Streak" value={`${user!.currentStreak} day${user!.currentStreak === 1 ? "" : "s"}`} hint={`Best: ${user!.longestStreak}`} icon={<Flame className="h-4 w-4" />} tone="warn" />
        <div className="card p-4">
          <div className="flex items-center justify-between"><span className="text-xs font-medium text-muted">Today</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><Target className="h-4 w-4" /></span></div>
          <div className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-ink">{todayCount}<span className="text-base text-subtle">/{user!.dailyGoal}</span></div>
          <div className="mt-2"><ProgressBar value={(todayCount / user!.dailyGoal) * 100} size="sm" tone={todayCount >= user!.dailyGoal ? "good" : "brand"} /></div>
        </div>
        <Stat label="Avg mastery" value={`${avg}%`} hint={`${statuses.length} subskills practised`} icon={<Gauge className="h-4 w-4" />} />
        <Stat label="Mastered" value={mastered} hint={`subskills ≥ ${MASTERY_THRESHOLD}%`} icon={<Medal className="h-4 w-4" />} tone="good" />
        <Stat label="Proofs" value={<Link href="/proofs" className="hover:text-brand">{proofCount}</Link>} hint={`${earned.size} of ${BADGES.length} badges`} icon={<Award className="h-4 w-4" />} tone="accent" />
      </section>

      <section className="stagger mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK.map(({ href, icon: Icon, title, text, tone }) => (
          <Link key={title} href={href} className="card card-hover group flex items-center gap-3 p-4">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-ink">{title}</span>
              <span className="block truncate text-xs text-muted">{text}</span>
            </span>
            <ArrowRight className="h-4 w-4 text-subtle transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DueCard due={due} />
        <WeeklyCard report={report} freezes={user!.streakFreezes} />
        <DailyQuestionCard question={dailyPublic} answered={dailyDone} />
      </section>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><PlanCard plan={plan} /></div>
        <section className="card flex flex-col p-6">
          <SectionTitle title="Career fit" />
          {targetFit ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <MasteryRing value={targetFit.fit} size={120} label="fit" />
              <Link href={`/career/${target!.id}`} className="mt-4 font-medium text-ink hover:text-brand">{target!.name}</Link>
              {targetFit.gaps[0] && <p className="mt-1 text-sm text-muted">Biggest gap: <span className="text-ink">{targetFit.gaps[0].skill.name}</span> ({targetFit.gaps[0].score}%)</p>}
              <Link href="/mentor" className="btn-ghost btn-sm mt-3"><Sparkles className="h-3.5 w-3.5" />Get a gap plan</Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted">Your strongest matches right now:</p>
              {topFits.map((f) => (
                <Link key={f.career.id} href={`/career/${f.career.id}`} className="group block">
                  <div className="mb-1 flex justify-between text-sm"><span className="text-ink group-hover:text-brand">{f.career.name}</span><span className="font-medium tabular-nums">{f.fit}%</span></div>
                  <ProgressBar value={f.fit} size="sm" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <SectionTitle title="Last 14 days" subtitle="Solid = correct, light = attempted" />
          <ActivityBars data={activity14} />
        </section>
        <section className="card p-6">
          <SectionTitle title="Skill radar" />
          {skillRows.length >= 3 ? (
            <RadarChart data={skillRows.slice(0, 8).map((r) => ({ label: r.skill.name, value: r.score }))} />
          ) : (
            <div className="space-y-4">
              {skillRows.map((r) => (
                <div key={r.skill.id}>
                  <div className="mb-1 flex justify-between text-sm"><span>{r.skill.name}</span><span className="font-medium tabular-nums">{r.score}%</span></div>
                  <ProgressBar value={r.score} />
                </div>
              ))}
              <p className="text-xs text-subtle">Practise 3+ subjects to unlock the radar view.</p>
            </div>
          )}
        </section>
      </div>

      {alerts.length > 0 && (
        <section className="mb-8">
          <SectionTitle title="Decay alerts" subtitle="Mastery fades without practice. Revise these before they slip further." />
          <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {alerts.map((a) => (
              <div key={`${a.skillId}:${a.subskillId}`} className="card flex flex-col p-4">
                <div className="mb-3 flex items-center justify-between"><DecayPill risk={a.risk} /><span className="text-sm font-semibold tabular-nums">{a.effective}%</span></div>
                <div className="font-medium text-ink">{a.subskillName}</div>
                <div className="mb-3 text-xs text-muted">{a.skillName}{a.stored > a.effective && ` · −${a.stored - a.effective}%`}</div>
                <Link href={`/practice/${a.skillId}/${a.subskillId}`} className="btn-secondary btn-sm mt-auto"><Repeat className="h-3.5 w-3.5" />Revise</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <SectionTitle title="Subject breakdown" />
          <ul className="stagger space-y-4">
            {skillRows.map((r) => (
              <li key={r.skill.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <Link href={`/skills/${r.skill.id}`} className="font-medium text-ink hover:text-brand">{r.skill.name}</Link>
                  <span className="font-medium tabular-nums">{r.score}%</span>
                </div>
                <ProgressBar value={r.score} />
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-6">
          <SectionTitle title="Practice calendar" subtitle="Last 18 weeks" />
          <ActivityCalendar data={activity126} />
          <div className="mt-8">
            <SectionTitle title="Achievements" subtitle={`${earned.size} of ${BADGES.length} unlocked`} />
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {BADGES.map((b) => {
                const has = earned.has(b.code);
                return (
                  <div key={b.code} title={b.description}
                    className={`flex flex-col items-center rounded-xl border p-3 text-center transition-transform hover:-translate-y-0.5 ${has ? "border-line bg-surface" : "border-dashed border-line bg-surface-2/50 opacity-50 grayscale"}`}>
                    <span className="text-2xl" aria-hidden>{b.icon}</span>
                    <span className="mt-1 text-[11px] font-medium leading-tight text-ink">{b.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: ReturnType<typeof dailyPlan> }) {
  return (
    <section className="card h-full p-6">
      <SectionTitle title="Today's plan" subtitle="Revision first, then weak spots, then what's next on your roadmap." />
      <ul className="stagger divide-y divide-line">
        {plan.map((p) => {
          const [cls, label] = KIND_STYLE[p.kind];
          return (
            <li key={`${p.skillId}:${p.subskillId}`} className="flex items-center gap-3 py-3">
              <span className={`w-20 shrink-0 rounded-full px-2 py-0.5 text-center text-[11px] font-medium ${cls}`}>{label}</span>
              <div className="min-w-0 flex-1">
                <Link href={`/subskills/${p.skillId}/${p.subskillId}`} className="text-sm font-medium text-ink hover:text-brand">{p.subskillName}</Link>
                <div className="truncate text-xs text-muted">{p.skillName} · {p.reason}</div>
              </div>
              <Link href={`/practice/${p.skillId}/${p.subskillId}`} className="btn-secondary btn-sm"><Play className="h-3 w-3" />Start</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
