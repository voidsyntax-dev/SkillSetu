"use client";

import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import { submitDaily } from "@/lib/actions";
import { inline } from "./ui";

export interface DailyQ {
  id: string;
  question: string;
  options: string[];
}

export interface DailyAnswered {
  selected: string;
  correct: boolean;
  answer: string;
  explanation: string;
  percent: number;
  total: number;
}

export default function DailyQuestionCard({ question, answered }: { question: DailyQ | null; answered: DailyAnswered | null }) {
  const [result, setResult] = useState<DailyAnswered | null>(answered);
  const [choice, setChoice] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <section className="card flex flex-col p-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="h2">Question of the day</h2>
        {result && <span className="text-xs text-subtle">{result.percent}% answered correctly</span>}
      </div>
      {!question ? (
        <p className="mt-3 text-sm text-muted">No question available today.</p>
      ) : (
        <>
          <p className="mt-3 text-sm font-medium leading-relaxed text-ink">{inline(question.question)}</p>
          <div className="mt-4 space-y-2">
            {question.options.map((opt, i) => {
              const picked = (result?.selected ?? choice) === opt;
              const isAnswer = result && opt === result.answer;
              const isWrong = result && picked && !result.correct;
              return (
                <button key={opt} disabled={!!result || pending} onClick={() => setChoice(opt)}
                  className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left text-sm transition-colors ${
                    isAnswer ? "border-good bg-good-soft" : isWrong ? "border-bad bg-bad-soft" : picked ? "border-brand bg-brand-soft" : "border-line hover:bg-surface-2"}`}>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface-2 text-[11px] font-semibold text-muted">
                    {isAnswer ? <Check className="h-3 w-3 text-good" /> : isWrong ? <X className="h-3 w-3 text-bad" /> : i + 1}
                  </span>
                  <span className="text-ink">{opt}</span>
                </button>
              );
            })}
          </div>
          {result ? (
            <p className="animate-fade-up mt-4 text-sm text-muted">{result.explanation}</p>
          ) : (
            <button className="btn-primary mt-4 self-start" disabled={!choice || pending}
              onClick={() => start(async () => {
                if (!choice) return;
                setResult(await submitDaily(question.id, choice));
              })}>
              {pending ? "Checking…" : "Submit"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
