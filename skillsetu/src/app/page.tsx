import Link from "next/link";
import {
  ArrowRight, Award, BrainCircuit, CircleAlert, GalleryVerticalEnd, GitBranch, LineChart, Repeat, Sparkles, Target, Timer, TrendingDown,
} from "lucide-react";
import { catalogStats, getBranchCareers, getBranches, getCareers, getBranch } from "@/lib/catalog";
import { BranchCard, CareerCard } from "@/components/cards";
import { MasteryRing, ProgressBar } from "@/components/ui";

const FEATURES = [
  { icon: GitBranch, title: "Career-first roadmaps", text: "Every career is mapped to weighted subjects with a prerequisite graph, so you always know what to learn next." },
  { icon: Target, title: "Adaptive practice", text: "Questions adapt to your mastery. Difficulty, streaks and speed all shape your score." },
  { icon: TrendingDown, title: "Decay tracking", text: "A forgetting curve lowers mastery over time and schedules revision before topics slip." },
  { icon: GalleryVerticalEnd, title: "Flashcards", text: "Every concept becomes a flip card for fast, active-recall revision." },
  { icon: Timer, title: "Mock tests", text: "Timed, exam-style tests per subject with a full answer review at the end." },
  { icon: CircleAlert, title: "Mistake book", text: "Wrong answers are collected automatically and leave once you get them right." },
  { icon: Sparkles, title: "AI mentor", text: "Doubts, career guidance and gap analysis — offline, or with Claude using your key." },
  { icon: Award, title: "Proof vault", text: "Mastery earns verifiable proofs and a shareable portfolio for recruiters." },
];

export default function HomePage() {
  const stats = catalogStats();
  const featured = ["process_engineer", "software_engineer", "ev_powertrain_engineer", "bioprocess_engineer", "structural_engineer", "ml_engineer"]
    .map((id) => getCareers().find((c) => c.id === id)!)
    .filter(Boolean);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24 lg:pt-24">
          <div className="animate-fade-up">
            <Link href="/branches" className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted shadow-sm transition-colors hover:text-ink">
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand">New</span>
              Flashcards, mock tests & mistake book <ArrowRight className="h-3 w-3" />
            </Link>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Master the skills your <span className="text-gradient">engineering career</span> actually needs.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              SkillSetu maps careers to subjects and subskills, adapts practice to your level, and schedules revision before you forget —
              so you can see exactly how ready you are for the role you want.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/onboarding" className="btn-primary h-11 px-5 text-[15px]">Get started — it&apos;s free<ArrowRight className="h-4 w-4" /></Link>
              <Link href="/branches" className="btn-secondary h-11 px-5 text-[15px]">Explore branches</Link>
            </div>
            <p className="mt-4 text-xs text-subtle">No sign-up needed to start. Create an account any time to keep your progress.</p>
          </div>

          {/* Product preview card */}
          <div className="animate-fade-up relative [animation-delay:120ms]" aria-hidden>
            <div className="card animate-float relative p-5 shadow-pop">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted">Target career</div>
                  <div className="font-semibold text-ink">Process Engineer</div>
                </div>
                <MasteryRing value={68} size={64} label="fit" />
              </div>
              <div className="space-y-3">
                {[["Thermodynamics", 84], ["Heat Transfer", 72], ["Mass Transfer", 55], ["Reaction Engineering", 38]].map(([n, v]) => (
                  <div key={n}>
                    <div className="mb-1 flex justify-between text-xs"><span className="text-ink">{n}</span><span className="tabular-nums text-muted">{v}%</span></div>
                    <ProgressBar value={Number(v)} size="sm" />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-xl bg-warn-soft p-3 text-xs">
                <TrendingDown className="h-4 w-4 shrink-0 text-warn" />
                <span className="text-ink"><b>Entropy</b> dropped 9% since last practice — revise today.</span>
              </div>
            </div>
            <div className="card absolute -bottom-6 -left-6 hidden items-center gap-3 p-3 shadow-pop sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-good-soft text-good"><Award className="h-4 w-4" /></span>
              <div className="text-xs"><div className="font-semibold text-ink">Proof earned</div><div className="text-muted">Heat Exchangers · 86%</div></div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <dl className="stagger grid grid-cols-3 divide-x divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-sm sm:grid-cols-6">
            {[["Branches", stats.branches], ["Careers", stats.careers], ["Subjects", stats.skills], ["Subskills", stats.subskills], ["Concepts", stats.concepts], ["Questions", stats.questions]].map(([label, value]) => (
              <div key={label} className="px-4 py-5 text-center">
                <dd className="text-2xl font-semibold tabular-nums tracking-tight text-ink">{Number(value).toLocaleString("en-IN")}</dd>
                <dt className="mt-0.5 text-xs text-muted">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="eyebrow mb-3">How it works</div>
            <h2 className="text-3xl font-semibold tracking-tight text-ink">From “where do I start?” to job-ready</h2>
          </div>
          <ol className="stagger grid gap-6 md:grid-cols-4">
            {[
              [BrainCircuit, "Pick your path", "Choose your branch and a target career."],
              [LineChart, "Follow the roadmap", "Subjects in prerequisite order, broken into subskills."],
              [Repeat, "Practise daily", "Adaptive questions, flashcards and spaced revision."],
              [Award, "Prove it", "Earn proofs, raise your fit score, unlock internships."],
            ].map(([Icon, title, text], i) => {
              const I = Icon as typeof BrainCircuit;
              return (
                <li key={String(title)} className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-bg text-brand"><I className="h-5 w-5" /></span>
                    <span className="text-xs font-semibold text-subtle">0{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-ink">{String(title)}</h3>
                  <p className="mt-1 text-sm text-muted">{String(text)}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <div className="eyebrow mb-3">Everything in one place</div>
          <h2 className="text-3xl font-semibold tracking-tight text-ink">Built around how engineers actually learn</h2>
        </div>
        <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card card-hover p-5">
              <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand"><Icon className="h-4 w-4" /></span>
              <h3 className="font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Branches */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="eyebrow mb-2">Branches</div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Find your branch</h2>
          </div>
          <Link href="/branches" className="flex items-center gap-1 text-sm font-medium text-brand hover:underline">All branches<ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {getBranches().slice(0, 8).map((b) => <BranchCard key={b.id} branch={b} careerCount={getBranchCareers(b.id).length} />)}
        </div>
      </section>

      {/* Careers */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="eyebrow mb-2">Careers</div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Popular career paths</h2>
            <p className="mt-1 text-sm text-muted">Typical Indian fresher-to-mid salary ranges.</p>
          </div>
          <Link href="/careers" className="flex items-center gap-1 text-sm font-medium text-brand hover:underline">All careers<ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => <CareerCard key={c.id} career={c} branchName={getBranch(c.branchId)?.name} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-accent px-8 py-14 text-center text-white shadow-pop">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_40%),radial-gradient(circle_at_80%_80%,white_0,transparent_35%)]" aria-hidden />
          <h2 className="relative text-3xl font-semibold tracking-tight">Start building real mastery today</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/80">Two minutes to set up. Ten minutes a day to stay sharp.</p>
          <Link href="/onboarding" className="btn relative mt-8 h-11 bg-white px-6 text-[15px] text-brand-strong hover:bg-white/90">
            Build my roadmap<ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
