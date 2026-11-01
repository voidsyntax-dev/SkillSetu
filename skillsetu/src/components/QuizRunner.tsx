"use client";

// Timed multi-question test. Answers are collected in the browser and graded on
// the server in one call when the learner submits.

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Check, Clock, Send, X } from "lucide-react";
import { gradeQuiz, type QuizSummary } from "@/lib/actions";
import { inline } from "./ui";

export interface QuizItem {
  id: string;
  kind: "mcq" | "nat";
  prompt: string;
  options?: string[];
  unit?: string;
}

export interface GradeParams {
  kind: "GATE" | "CHALLENGE";
  branchId?: string;
  seed?: number;
  challengeCode?: string;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function QuizRunner({
  items, title, minutes, gradeParams, backHref,
}: {
  items: QuizItem[];
  title: string;
  minutes: number;
  gradeParams: GradeParams;
  backHref: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [active, setActive] = useState(0);
  const [left, setLeft] = useState(minutes * 60);
  const [result, setResult] = useState<QuizSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (result || left <= 0) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [result, left]);

  const locked = left <= 0;
  const answered = Object.values(answers).filter((v) => v.trim() !== "").length;
  const submit = () =>
    start(async () => {
      setError(null);
      try {
        setResult(await gradeQuiz({ ...gradeParams, answers, timeMs: (minutes * 60 - left) * 1000 }));
      } catch {
        setError("Couldn't submit the test. Check your connection and try again.");
      }
    });

  if (result) {
    const pct = result.max ? Math.round((result.score / result.max) * 100) : 0;
    return (
      <div className="space-y-6">
        <div className="card animate-scale-in p-8 text-center">
          <p className="text-sm text-muted">{title}</p>
          <div className="mt-2 text-4xl font-semibold tabular-nums tracking-tight text-ink">
            {Math.round(result.score * 100) / 100} <span className="text-lg text-subtle">/ {result.max}</span>
          </div>
          <p className="mt-2 text-sm text-muted">
            {pct}% · {result.correct} correct · {result.wrong} wrong · {result.skipped} skipped
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href={backHref} className="btn-secondary">Back</Link>
          </div>
        </div>
        <ol className="stagger space-y-3">
          {items.map((it, i) => {
            const r = result.perItem[it.id];
            if (!r) return null;
            return (
              <li key={it.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${r.correct ? "bg-good-soft text-good" : "bg-bad-soft text-bad"}`}>
                    {r.correct ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{i + 1}. {inline(it.prompt)}</p>
                    <p className="mt-2 text-sm text-good">Answer: {r.answer}</p>
                    <p className="mt-1 whitespace-pre-line text-xs text-muted">{r.explanation}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  const item = items[active];
  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div>
          <h1 className="text-base font-semibold text-ink">{title}</h1>
          <p className="text-xs text-muted">{answered} of {items.length} answered</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-sm font-semibold tabular-nums ${left <= 60 ? "animate-pulse border-bad text-bad" : "border-line text-ink"}`}>
            <Clock className="h-4 w-4" />{locked ? "Time up" : fmt(left)}
          </span>
          <button className="btn-primary" onClick={submit} disabled={pending}>
            <Send className="h-4 w-4" />{pending ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>
      {error && <p className="mb-4 text-sm text-bad">{error}</p>}

      <div className="mb-4 flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <button key={it.id} onClick={() => setActive(i)}
            className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${i === active ? "bg-brand text-white" : answers[it.id]?.trim() ? "bg-good-soft text-good" : "bg-surface-2 text-muted hover:text-ink"}`}>
            {i + 1}
          </button>
        ))}
      </div>

      {item && (
        <div key={item.id} className="card animate-fade-up p-6 sm:p-8">
          <span className="chip mb-4">{item.kind === "mcq" ? "Multiple choice" : "Numerical answer"}</span>
          <h2 className="mb-6 text-lg leading-relaxed text-ink">{inline(item.prompt)}</h2>
          {item.kind === "mcq" ? (
            <div className="space-y-2.5" role="radiogroup">
              {item.options?.map((opt, i) => {
                const sel = answers[item.id] === opt;
                return (
                  <button key={opt} role="radio" aria-checked={sel} disabled={locked}
                    onClick={() => setAnswers((a) => ({ ...a, [item.id]: opt }))}
                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm transition-colors ${sel ? "border-brand bg-brand-soft" : "border-line hover:border-line-strong hover:bg-surface-2"}`}>
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${sel ? "bg-brand text-white" : "border border-line bg-surface text-muted"}`}>{i + 1}</span>
                    <span className="pt-0.5 text-ink">{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input type="number" step="any" inputMode="decimal" className="input max-w-xs font-mono text-lg" disabled={locked}
                placeholder="Your answer" value={answers[item.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [item.id]: e.target.value }))} aria-label="Numerical answer" />
              {item.unit && <span className="text-sm text-muted">{item.unit}</span>}
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <button className="btn-ghost" disabled={active === 0} onClick={() => setActive((a) => a - 1)}>Previous</button>
            <button className="btn-secondary" disabled={active === items.length - 1} onClick={() => setActive((a) => a + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
