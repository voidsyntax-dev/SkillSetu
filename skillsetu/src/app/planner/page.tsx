import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { savePlanAction } from "@/lib/actions";
import { getBranch, getSkills } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getMasteryStore } from "@/lib/insights";
import { examPlanView } from "@/lib/planning";
import { EmptyState, PageHeader, ProgressBar, SectionTitle, Stat } from "@/components/ui";

export const metadata: Metadata = { title: "Exam planner" };

const MAX_SUBJECTS = 12;

export default async function PlannerPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  const store = await getMasteryStore(user?.id ?? null);
  const plan = user ? await prisma.studyPlan.findUnique({ where: { userId: user.id } }) : null;
  const saved: string[] = plan ? JSON.parse(plan.skillIds) : [];
  const defaults = saved.length ? saved : user?.branchId ? (getBranch(user.branchId) ? getSkills().filter((s) => getBranch(user.branchId!)!.skills.includes(s.id)).slice(0, 6).map((s) => s.id) : []) : [];
  const view = plan ? examPlanView({ examName: plan.examName, examDay: plan.examDay, skillIds: saved }, store) : null;
  const error = (await searchParams).error;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="page">
      <PageHeader eyebrow="Plan" title="Exam planner"
        subtitle="Tell us the exam, its date and the subjects it covers. We work out how many questions you need per day to reach 80% mastery in time." />

      {view && (
        <>
          <section className="stagger mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label={plan!.examName} value={`${view.daysLeft} days`} hint={`exam on ${plan!.examDay}`} icon={<CalendarDays className="h-4 w-4" />} />
            <Stat label="Questions needed" value={view.questionsNeeded} hint="to reach 80% in every subject" />
            <Stat label="Per day" value={view.perDay} hint="questions daily" tone="good" />
            <Stat label="Subjects" value={view.rows.length} hint="in this plan" tone="accent" />
          </section>

          <div className="mb-10 grid gap-6 lg:grid-cols-5">
            <section className="card p-6 lg:col-span-3">
              <SectionTitle title="Subjects" subtitle="Weakest first" />
              <ul className="stagger space-y-4">
                {[...view.rows].sort((a, b) => a.score - b.score).map((r) => (
                  <li key={r.skill.id}>
                    <div className="mb-1 flex justify-between text-sm"><span className="text-ink">{r.skill.name}</span><span className="tabular-nums text-muted">{r.score}%</span></div>
                    <ProgressBar value={r.score} />
                  </li>
                ))}
              </ul>
            </section>
            <section className="card p-6 lg:col-span-2">
              <SectionTitle title="Next 7 days" subtitle="Focus rotates through your weakest subjects" />
              <ol className="space-y-2">
                {view.schedule.map((d) => (
                  <li key={d.day} className="flex items-center justify-between gap-3 rounded-lg bg-surface-2 px-3 py-2 text-sm">
                    <span className="text-muted">{new Date(d.day + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                    <span className="min-w-0 flex-1 truncate text-right text-ink">{d.focus} · {d.questions} q</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </>
      )}

      <form action={savePlanAction} className="card space-y-6 p-6">
        <SectionTitle title={plan ? "Edit your plan" : "Create your plan"} />
        {error && <p className="text-sm text-bad">Please pick a valid date.</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="examName">Exam name</label>
            <input id="examName" name="examName" className="input" defaultValue={plan?.examName ?? "GATE"} maxLength={80} />
          </div>
          <div>
            <label className="label" htmlFor="examDay">Exam date</label>
            <input id="examDay" name="examDay" type="date" className="input" min={today} defaultValue={plan?.examDay ?? ""} required />
          </div>
        </div>
        <fieldset>
          <legend className="label">Subjects (up to {MAX_SUBJECTS})</legend>
          <div className="grid max-h-80 grid-cols-1 gap-1.5 overflow-y-auto rounded-xl border border-line p-3 sm:grid-cols-2">
            {getSkills().map((s) => (
              <label key={s.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-2">
                <input type="checkbox" name="skillId" value={s.id} defaultChecked={defaults.includes(s.id)} className="h-4 w-4 accent-[var(--brand)]" />
                <span className="text-ink">{s.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex justify-end">
          <button className="btn-primary">{plan ? "Update plan" : "Save plan"}</button>
        </div>
        {!user && !plan && <EmptyState icon={<CalendarDays className="h-6 w-6" />} title="Tip">Your plan is saved to this browser&apos;s account. Create an account to keep it on any device.</EmptyState>}
      </form>
    </div>
  );
}
