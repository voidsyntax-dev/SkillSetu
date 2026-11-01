"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ArrowRight, Check, CircleAlert, Clock, RotateCcw, Sparkles, Trophy, X } from "lucide-react";
import { explainWrong, submitAnswer, type AnswerResult } from "@/lib/actions";
import { useMentorPrefs } from "@/lib/mentorSettings";
import { inline, MasteryRing, ProgressBar, RichText } from "./ui";

export interface PracticeQuestion {
  id: string;
  skillId: string;
  subskillId: string;
  skillName: string;
  subskillName: string;
  question: string;
  options: string[];
  difficulty: 1 | 2 | 3;
  kind: string;
}

const DIFF_LABEL = ["", "Basic", "Intermediate", "Advanced"];

function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Picks a session: easier questions first when mastery is low, harder ones as
 * it grows. Seeded so server and client render the same order.
 */
function buildSession(questions: PracticeQuestion[], mastery: number, seed: number, length: number, adaptive: boolean): PracticeQuestion[] {
  const rand = seededRandom(seed);
  const shuffled = questions.map((q) => ({ q, r: rand() })).sort((a, b) => a.r - b.r).map((x) => x.q);
  if (!adaptive) return shuffled.slice(0, length);
  const target = mastery < 35 ? 1 : mastery < 70 ? 2 : 3;
  return shuffled
    .sort((a, b) => Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target))
    .slice(0, length)
    .sort((a, b) => a.difficulty - b.difficulty);
}

const average = (m: Record<string, number>) => {
  const vals = Object.values(m);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
};

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, "0")}`;

interface LogEntry {
  question: PracticeQuestion;
  selected: string | null;
  result: AnswerResult | null; // null = unanswered (time ran out)
}

export default function PracticeEngine({
  questions, initialMastery, seed, title, backHref, backLabel, showTopic,
  mode = "practice", length = 10, timeLimitSec,
}: {
  questions: PracticeQuestion[];
  initialMastery: Record<string, number>; // keyed by skill:subskill
  seed: number;
  title: string;
  backHref: string;
  backLabel: string;
  showTopic?: boolean;
  mode?: "practice" | "exam";
  length?: number;
  timeLimitSec?: number;
}) {
  const exam = mode === "exam";
  const [session, setSession] = useState(() => buildSession(questions, average(initialMastery), seed, length, !exam));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [mastery, setMastery] = useState(initialMastery);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimitSec ?? 0);
  const [timeUp, setTimeUp] = useState(false);
  const [pending, start] = useTransition();
  const [why, setWhy] = useState<string | null>(null);
  const [whyPending, startWhy] = useTransition();
  const prefs = useMentorPrefs();
  const startedAt = useRef(0);
  const toastId = useRef(0);

  const q = session[index];
  const done = index >= session.length || timeUp;
  const key = q ? `${q.skillId}:${q.subskillId}` : "";

  useEffect(() => {
    startedAt.current = Date.now();
  }, [q?.id]);

  // Exam countdown.
  useEffect(() => {
    if (!exam || !timeLimitSec || done) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setTimeUp(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [exam, timeLimitSec, done]);

  const pushToasts = useCallback((texts: string[]) => {
    const items = texts.map((text) => ({ id: ++toastId.current, text }));
    setToasts((t) => [...t, ...items]);
    for (const it of items) setTimeout(() => setToasts((t) => t.filter((x) => x.id !== it.id)), 5000);
  }, []);

  const submit = () => {
    if (!q || !selected || result || pending) return;
    setError(null);
    const current = q;
    const choice = selected;
    start(async () => {
      try {
        const r = await submitAnswer({ questionId: current.id, selected: choice, timeTakenMs: Date.now() - startedAt.current });
        setMastery((m) => ({ ...m, [`${current.skillId}:${current.subskillId}`]: r.newScore }));
        setLog((l) => [...l, { question: current, selected: choice, result: r }]);
        pushToasts([
          ...r.newBadges.map((b) => `${b.icon} Badge earned: ${b.name}`),
          ...(r.newProof ? [`🏅 Added to your proof vault: ${r.newProof}`] : []),
          ...(r.dailyCount === r.dailyGoal ? [`🎯 Daily goal reached — ${r.dailyGoal} questions`] : []),
        ]);
        if (exam) {
          setSelected(null);
          setIndex((i) => i + 1);
        } else {
          setResult(r);
        }
      } catch {
        setError("Could not submit your answer. Check your connection and try again.");
      }
    });
  };

  const next = () => {
    setSelected(null);
    setResult(null);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setSession(buildSession(questions, average(mastery), Math.floor(Math.random() * 2 ** 31), length, !exam));
    setIndex(0);
    setLog([]);
    setSelected(null);
    setResult(null);
    setTimeUp(false);
    setTimeLeft(timeLimitSec ?? 0);
  };

  // Keyboard: 1-4 choose, Enter submit / next.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || !q || (e.target as HTMLElement)?.closest("input, textarea")) return;
      const n = Number(e.key);
      if (!result && n >= 1 && n <= q.options.length) setSelected(q.options[n - 1]);
      else if (e.key === "Enter") {
        e.preventDefault();
        if (result) next();
        else submit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const toastStack = (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="animate-slide-in pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-surface p-3 text-sm shadow-pop">
          <span className="flex-1 text-ink">{t.text}</span>
          <button onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))} className="text-subtle hover:text-ink" aria-label="Dismiss"><X className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );

  if (!session.length) {
    return <div className="card p-10 text-center text-muted">No questions available yet.</div>;
  }

  // ─── Results ──────────────────────────────────────────────────────────────
  if (done) {
    const answered = log.filter((l) => l.result);
    const correct = answered.filter((l) => l.result!.correct).length;
    const total = exam ? session.length : log.length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const gained = answered.reduce((n, l) => n + l.result!.delta, 0);
    const bySub = new Map<string, { name: string; right: number; total: number }>();
    for (const qq of session.slice(0, exam ? session.length : log.length)) {
      const entry = log.find((l) => l.question.id === qq.id);
      const row = bySub.get(qq.subskillId) ?? { name: qq.subskillName, right: 0, total: 0 };
      row.total++;
      if (entry?.result?.correct) row.right++;
      bySub.set(qq.subskillId, row);
    }
    const unanswered = exam ? session.slice(log.length) : [];
    const Icon = pct >= 80 ? Trophy : pct >= 50 ? Sparkles : CircleAlert;

    return (
      <div className="space-y-6">
        {toastStack}
        <div className="card animate-scale-in p-8 text-center">
          <span className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${pct >= 80 ? "bg-good-soft text-good" : pct >= 50 ? "bg-brand-soft text-brand" : "bg-warn-soft text-warn"}`}>
            <Icon className="h-7 w-7" />
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">{timeUp ? "Time's up!" : exam ? "Test complete" : "Session complete"}</h2>
          <p className="mt-1 text-muted">You scored {correct} / {total} ({pct}%){exam && timeLimitSec ? ` in ${formatTime(timeLimitSec - timeLeft)}` : ""}.</p>
          <div className="my-6 flex justify-center"><MasteryRing value={exam ? pct : average(mastery)} size={120} label={exam ? "score" : "mastery"} /></div>
          <p className={`mb-6 text-sm font-medium ${gained >= 0 ? "text-good" : "text-bad"}`}>
            {gained >= 0 ? "+" : ""}{gained.toFixed(1)} mastery points
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={restart} className="btn-primary"><RotateCcw className="h-4 w-4" />{exam ? "Retake test" : "Practise again"}</button>
            <Link href={backHref} className="btn-secondary">{backLabel}</Link>
          </div>
        </div>

        {bySub.size > 1 && (
          <div className="card p-6">
            <h3 className="h2 mb-4">By topic</h3>
            <ul className="stagger space-y-3">
              {[...bySub.values()].map((r) => (
                <li key={r.name}>
                  <div className="mb-1 flex justify-between text-sm"><span className="text-ink">{r.name}</span><span className="font-medium">{r.right}/{r.total}</span></div>
                  <ProgressBar value={(r.right / r.total) * 100} tone={r.right / r.total >= 0.7 ? "good" : r.right / r.total >= 0.4 ? "brand" : "warn"} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {exam && (
          <div className="card p-6">
            <h3 className="h2 mb-4">Review answers</h3>
            <ol className="space-y-4">
              {[...log, ...unanswered.map((u) => ({ question: u, selected: null, result: null }))].map((l, i) => (
                <li key={l.question.id} className="rounded-xl border border-line p-4">
                  <div className="mb-2 flex items-start gap-3">
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${l.result?.correct ? "bg-good-soft text-good" : "bg-bad-soft text-bad"}`}>
                      {l.result?.correct ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </span>
                    <p className="text-sm font-medium text-ink">{i + 1}. {inline(l.question.question)}</p>
                  </div>
                  <div className="ml-8 space-y-1 text-sm">
                    {l.result ? (
                      <>
                        {!l.result.correct && <p className="text-bad">Your answer: {l.selected}</p>}
                        <p className="text-good">Correct: {l.result.answer}</p>
                        <p className="text-muted">{l.result.explanation}</p>
                      </>
                    ) : <p className="text-subtle">Not answered</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  }

  // ─── Question ─────────────────────────────────────────────────────────────
  const lowTime = exam && timeLimitSec && timeLeft <= 60;
  return (
    <div>
      {toastStack}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-ink">{title}</h1>
          <p className="text-sm text-muted">Question {index + 1} of {session.length}</p>
        </div>
        {exam && timeLimitSec ? (
          <div className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-sm font-semibold tabular-nums ${lowTime ? "animate-pulse border-bad text-bad" : "border-line text-ink"}`}>
            <Clock className="h-4 w-4" />{formatTime(timeLeft)}
          </div>
        ) : (
          <div className="w-40 text-right">
            <div className="mb-1 text-xs text-muted">Mastery <b className="text-ink">{Math.round(mastery[key] ?? 0)}%</b></div>
            <ProgressBar value={mastery[key] ?? 0} />
          </div>
        )}
      </div>

      <div className="mb-6 flex gap-1">
        {session.map((s, i) => {
          const entry = log[i];
          const color = entry
            ? exam ? "bg-brand" : entry.result?.correct ? "bg-good" : "bg-bad"
            : i === index ? "bg-brand/50" : "bg-surface-3";
          return <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${color}`} />;
        })}
      </div>

      <div key={q.id} className="card animate-fade-up p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="chip">{DIFF_LABEL[q.difficulty]}</span>
          {showTopic && <span className="chip">{q.skillName} · {q.subskillName}</span>}
        </div>
        <h2 className="mb-6 text-lg font-medium leading-relaxed text-ink">{inline(q.question)}</h2>

        <div className="space-y-2.5" role="radiogroup">
          {q.options.map((opt, i) => {
            const isSel = selected === opt;
            const isAnswer = result && opt === result.answer;
            const isWrongPick = result && isSel && !result.correct;
            return (
              <button key={opt} role="radio" aria-checked={isSel} disabled={!!result || pending} onClick={() => setSelected(opt)}
                className={`group flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm transition-all duration-150 ${
                  isAnswer ? "animate-pop border-good bg-good-soft" : isWrongPick ? "animate-shake border-bad bg-bad-soft" : isSel ? "border-brand bg-brand-soft" : "border-line hover:border-line-strong hover:bg-surface-2"
                }`}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  isAnswer ? "bg-good text-white" : isWrongPick ? "bg-bad text-white" : isSel ? "bg-brand text-white" : "border border-line bg-surface text-muted group-hover:text-ink"
                }`}>
                  {isAnswer ? <Check className="h-3.5 w-3.5" /> : isWrongPick ? <X className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="pt-0.5 text-ink">{opt}</span>
              </button>
            );
          })}
        </div>

        {error && <p className="mt-4 text-sm text-bad">{error}</p>}

        {result && (
          <div className={`animate-fade-up mt-6 rounded-xl border p-4 ${result.correct ? "border-good/30 bg-good-soft" : "border-bad/30 bg-bad-soft"}`}>
            <div className="mb-1 flex items-center justify-between">
              <span className={`flex items-center gap-1.5 font-semibold ${result.correct ? "text-good" : "text-bad"}`}>
                {result.correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}{result.correct ? "Correct" : "Not quite"}
              </span>
              <span className={`text-sm font-semibold tabular-nums ${result.delta >= 0 ? "text-good" : "text-bad"}`}>
                {result.delta >= 0 ? "+" : ""}{result.delta} mastery
              </span>
            </div>
            <p className="text-sm text-ink">{result.explanation}</p>
            {!result.correct && (
              <div className="mt-3">
                {why ? (
                  <div className="animate-fade-up rounded-lg bg-surface p-3 text-sm"><RichText text={why} /></div>
                ) : (
                  <button className="btn-secondary btn-sm" disabled={whyPending}
                    onClick={() => startWhy(async () => {
                      const r = await explainWrong(q.id, selected ?? "", prefs);
                      setWhy(r.text);
                    })}>
                    {whyPending ? "Thinking…" : "Why was I wrong?"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="hidden text-xs text-subtle sm:block">
            Press <span className="kbd">1</span>–<span className="kbd">{q.options.length}</span> to choose, <span className="kbd">Enter</span> to {result ? "continue" : "submit"}
          </span>
          {result ? (
            <button className="btn-primary ml-auto" onClick={next}>{index + 1 === session.length ? "See results" : "Next question"}<ArrowRight className="h-4 w-4" /></button>
          ) : (
            <button className="btn-primary ml-auto" onClick={submit} disabled={!selected || pending}>{pending ? "Checking…" : exam ? "Save & next" : "Check answer"}</button>
          )}
        </div>
      </div>
    </div>
  );
}
