"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { completeOnboarding } from "@/lib/actions";

interface BranchOpt { id: string; name: string; icon: string; description: string }
interface CareerOpt { id: string; name: string; branchId: string; description: string; salary: string; difficulty: string }

const GOALS = [
  { value: 5, label: "Casual", desc: "5 questions · ~5 min/day" },
  { value: 10, label: "Regular", desc: "10 questions · ~10 min/day" },
  { value: 20, label: "Serious", desc: "20 questions · ~20 min/day" },
  { value: 40, label: "Intense", desc: "40 questions · ~40 min/day" },
];

export default function OnboardingWizard({ branches, careers, initial }: {
  branches: BranchOpt[];
  careers: CareerOpt[];
  initial: { branchId: string; careerId: string; dailyGoal: number };
}) {
  const [step, setStep] = useState(0);
  const [branchId, setBranchId] = useState(initial.branchId);
  const [careerId, setCareerId] = useState(initial.careerId);
  const [goal, setGoal] = useState(initial.dailyGoal);
  const [pending, start] = useTransition();
  const branchCareers = careers.filter((c) => c.branchId === branchId);

  const steps = ["Your branch", "Your goal career", "Daily commitment"];
  const canNext = step === 0 ? !!branchId : step === 1 ? true : true;

  const finish = () => start(() => completeOnboarding({ branchId, targetCareerId: careerId, dailyGoal: goal }));

  return (
    <div className="mx-auto w-full max-w-3xl">
      <ol className="mb-8 flex items-center gap-3">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-3">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300 ${i < step ? "bg-brand text-white" : i === step ? "bg-brand-soft text-brand ring-2 ring-brand" : "bg-surface-2 text-subtle"}`}>
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={`hidden text-sm font-medium sm:block ${i === step ? "text-ink" : "text-subtle"}`}>{label}</span>
            {i < steps.length - 1 && <span className={`h-px flex-1 transition-colors duration-300 ${i < step ? "bg-brand" : "bg-line"}`} />}
          </li>
        ))}
      </ol>

      <div key={step} className="animate-fade-up">
        {step === 0 && (
          <>
            <h1 className="h1">Which branch are you in?</h1>
            <p className="mt-2 text-muted">We&apos;ll build your roadmap from its subjects. You can change this any time.</p>
            <div className="stagger mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {branches.map((b) => (
                <button key={b.id} onClick={() => { setBranchId(b.id); if (careers.find((c) => c.id === careerId)?.branchId !== b.id) setCareerId(""); }}
                  className={`card card-hover flex items-start gap-3 p-4 text-left ${branchId === b.id ? "border-brand ring-2 ring-brand/30" : ""}`}>
                  <span className="text-2xl" aria-hidden>{b.icon}</span>
                  <span className="min-w-0">
                    <span className="block font-medium text-ink">{b.name}</span>
                    <span className="line-clamp-2 block text-xs text-muted">{b.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="h1">What do you want to become?</h1>
            <p className="mt-2 text-muted">Your target career sets your daily plan and gap analysis. Not sure yet? Skip — the AI mentor can help later.</p>
            <div className="stagger mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {branchCareers.map((c) => (
                <button key={c.id} onClick={() => setCareerId(c.id === careerId ? "" : c.id)}
                  className={`card card-hover p-4 text-left ${careerId === c.id ? "border-brand ring-2 ring-brand/30" : ""}`}>
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium text-ink">{c.name}</span>
                    <span className="chip">{c.difficulty}</span>
                  </span>
                  <span className="mt-1 line-clamp-2 block text-xs text-muted">{c.description}</span>
                  <span className="mt-2 block text-xs font-medium text-good">{c.salary}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="h1">How much time can you give daily?</h1>
            <p className="mt-2 text-muted">Small daily sessions beat cramming — mastery decays without revision.</p>
            <div className="stagger mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {GOALS.map((g) => (
                <button key={g.value} onClick={() => setGoal(g.value)}
                  className={`card card-hover p-4 text-left ${goal === g.value ? "border-brand ring-2 ring-brand/30" : ""}`}>
                  <span className="block font-medium text-ink">{g.label}</span>
                  <span className="block text-xs text-muted">{g.desc}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0 || pending}>
          <ArrowLeft className="h-4 w-4" />Back
        </button>
        {step < 2 ? (
          <button className="btn-primary" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            {step === 1 && !careerId ? "Skip for now" : "Continue"}<ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button className="btn-primary" onClick={finish} disabled={pending}>
            {pending ? "Setting up…" : "Build my plan"}<ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
