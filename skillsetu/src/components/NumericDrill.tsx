"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { submitNumeric, type NumericResult } from "@/lib/actions";
import type { NumericPublic } from "@/lib/numerics";
import { ProgressBar } from "./ui";

/** One problem at a time: enter a number, then see the solution with each step. */
export default function NumericDrill({ items, feed = "/numericals" }: { items: NumericPublic[]; feed?: string }) {
  const [i, setI] = useState(0);
  const [value, setValue] = useState("");
  const [res, setRes] = useState<NumericResult | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const [pending, start] = useTransition();
  const started = useRef<number | null>(null);
  const current = items[i];

  const submit = () => {
    if (!current || !value.trim() || res || pending) return;
    const timeTakenMs = started.current ? Date.now() - started.current : 0;
    start(async () => {
      const r = await submitNumeric({ id: current.id, input: Number(value), timeTakenMs });
      setRes(r);
      setScore((s) => ({ right: s.right + (r.correct ? 1 : 0), total: s.total + 1 }));
    });
  };

  const next = () => {
    setI((n) => n + 1);
    setValue("");
    setRes(null);
    started.current = Date.now();
  };

  if (!current) {
    return (
      <div className="card animate-scale-in p-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Set complete</h2>
        <p className="mt-1 text-muted">{score.right} of {score.total} correct.</p>
        <div className="mx-auto my-6 max-w-xs"><ProgressBar value={score.total ? (score.right / score.total) * 100 : 0} /></div>
        <div className="flex justify-center gap-3">
          <Link href={feed} className="btn-primary"><RotateCcw className="h-4 w-4" />New set</Link>
          <Link href="/dashboard" className="btn-secondary">Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-muted">Problem <b className="text-ink tabular-nums">{i + 1}</b> of {items.length}</span>
        <span className="chip">{current.title}</span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-surface-3">
        <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${(i / items.length) * 100}%` }} />
      </div>

      <div key={current.id} ref={(el) => { if (el && started.current === null) started.current = Date.now(); }} className="card animate-fade-up p-6 sm:p-8">
        <p className="text-lg leading-relaxed text-ink">{current.prompt}</p>

        {!res && (
          <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="mt-6 flex flex-wrap items-center gap-3">
            <input type="number" step="any" inputMode="decimal" className="input max-w-[14rem] font-mono text-lg" placeholder="Your answer"
              value={value} onChange={(e) => setValue(e.target.value)} aria-label="Your answer" autoFocus />
            <span className="text-sm text-muted">{current.unit}</span>
            <button className="btn-primary" disabled={!value.trim() || pending}>{pending ? "Checking…" : "Check answer"}</button>
          </form>
        )}

        {res && (
          <div className="animate-fade-up mt-6 space-y-4">
            <div className={`flex items-center justify-between rounded-xl border p-4 ${res.correct ? "border-good/30 bg-good-soft" : "border-bad/30 bg-bad-soft"}`}>
              <span className={`flex items-center gap-1.5 font-semibold ${res.correct ? "text-good" : "text-bad"}`}>
                {res.correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                {res.correct ? "Correct" : "Not quite"}
              </span>
              <span className="text-sm text-ink">
                Answer: <b className="tabular-nums">{res.value}</b> {res.unit}
              </span>
            </div>
            <div className="rounded-xl border border-line p-4">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-subtle">Worked solution</div>
              <p className="mb-3 font-mono text-sm text-brand">{res.formula}</p>
              <ol className="space-y-2">
                {res.steps.map((s, k) => (
                  <li key={k} className="flex gap-3 text-sm text-ink">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs text-muted">{k + 1}</span>
                    <span className="font-mono">{s}</span>
                  </li>
                ))}
              </ol>
              {res.progress && (
                <p className={`mt-3 text-xs font-medium ${res.progress.delta >= 0 ? "text-good" : "text-bad"}`}>
                  Mastery {res.progress.delta >= 0 ? "+" : ""}{res.progress.delta} → {res.progress.newScore}%
                </p>
              )}
            </div>
          </div>
        )}

        {res && (
          <div className="mt-6 flex justify-end">
            <button className="btn-primary" onClick={next}>{i + 1 === items.length ? "See results" : "Next problem"}<ArrowRight className="h-4 w-4" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
