"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, RotateCcw, Shuffle, Undo2, X } from "lucide-react";

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  topic: string;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return items.map((x) => ({ x, r: rand() })).sort((p, q) => p.r - q.r).map((p) => p.x);
}

export default function FlashcardDeck({ cards, seed, backHref, practiceHref }: { cards: Flashcard[]; seed: number; backHref: string; practiceHref?: string }) {
  const [deck, setDeck] = useState(() => seededShuffle(cards, seed));
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<string[]>([]);
  const [learning, setLearning] = useState<string[]>([]);
  const [reverse, setReverse] = useState(false); // show definition first

  const card = deck[i];
  const done = i >= deck.length;

  const rate = (knewIt: boolean) => {
    if (!card) return;
    (knewIt ? setKnown : setLearning)((l) => [...l, card.id]);
    setFlipped(false);
    setI((n) => n + 1);
  };

  const undo = () => {
    if (i === 0) return;
    const prev = deck[i - 1];
    setKnown((l) => l.filter((id) => id !== prev.id));
    setLearning((l) => l.filter((id) => id !== prev.id));
    setFlipped(false);
    setI((n) => n - 1);
  };

  const restart = (onlyMissed: boolean) => {
    const pool = onlyMissed ? cards.filter((c) => learning.includes(c.id)) : cards;
    setDeck(seededShuffle(pool, Math.floor(Math.random() * 2 ** 31)));
    setI(0);
    setKnown([]);
    setLearning([]);
    setFlipped(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && (e.key === "ArrowRight" || e.key === "2")) rate(true);
      else if (flipped && (e.key === "ArrowLeft" || e.key === "1")) rate(false);
      else if (e.key === "Backspace") undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!cards.length) return <div className="card p-10 text-center text-muted">No cards in this deck.</div>;

  if (done) {
    const pct = Math.round((known.length / deck.length) * 100);
    return (
      <div className="card animate-scale-in p-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-good-soft text-good"><Check className="h-7 w-7" /></span>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Deck complete</h2>
        <p className="mt-1 text-muted">You knew {known.length} of {deck.length} cards ({pct}%).</p>
        <div className="mx-auto my-6 flex max-w-xs overflow-hidden rounded-full bg-surface-3">
          <div className="bar-grow h-2 bg-good" style={{ width: `${pct}%` }} />
          <div className="bar-grow h-2 bg-warn" style={{ width: `${100 - pct}%` }} />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {learning.length > 0 && <button className="btn-primary" onClick={() => restart(true)}><RotateCcw className="h-4 w-4" />Review {learning.length} missed</button>}
          <button className="btn-secondary" onClick={() => restart(false)}><Shuffle className="h-4 w-4" />Shuffle all</button>
          {practiceHref && <Link href={practiceHref} className="btn-secondary">Test yourself</Link>}
          <Link href={backHref} className="btn-ghost"><ArrowLeft className="h-4 w-4" />Back</Link>
        </div>
      </div>
    );
  }

  const front = reverse ? card.definition : card.term;
  const back = reverse ? card.term : card.definition;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3 text-sm">
        <span className="text-muted">Card <b className="tabular-nums text-ink">{i + 1}</b> of {deck.length}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-good"><Check className="h-3.5 w-3.5" />{known.length}</span>
          <span className="flex items-center gap-1 text-warn"><RotateCcw className="h-3.5 w-3.5" />{learning.length}</span>
          <button className="btn-ghost btn-sm" onClick={() => { setReverse((r) => !r); setFlipped(false); }}>
            {reverse ? "Definition first" : "Term first"}
          </button>
        </div>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-surface-3">
        <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${(i / deck.length) * 100}%` }} />
      </div>

      {/* The entrance animation lives on the wrapper: an animated transform on the card itself would override the flip. */}
      <div key={card.id} className="flip-scene animate-fade-up">
        <button
          onClick={() => setFlipped((f) => !f)}
          className={`flip-card relative block h-72 w-full sm:h-80 ${flipped ? "flipped" : ""}`}
          aria-label={flipped ? "Show front" : "Reveal answer"}
        >
          <span className="flip-face card absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <span className="chip absolute left-4 top-4">{card.topic}</span>
            <span className={`${reverse ? "text-lg" : "text-2xl sm:text-3xl"} font-semibold tracking-tight text-ink`}>{front}</span>
            <span className="absolute bottom-4 text-xs text-subtle">Click or press Space to flip</span>
          </span>
          <span className="flip-face flip-back card absolute inset-0 flex flex-col items-center justify-center border-brand/40 bg-brand-soft p-8 text-center">
            <span className="chip absolute left-4 top-4">{reverse ? "Term" : "Definition"}</span>
            <span className={`${reverse ? "text-2xl sm:text-3xl font-semibold" : "text-lg"} leading-relaxed text-ink`}>{back}</span>
          </span>
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button className="btn-ghost" onClick={undo} disabled={i === 0} aria-label="Undo"><Undo2 className="h-4 w-4" /></button>
        <button className="btn-secondary min-w-36 border-warn/40 text-warn" onClick={() => rate(false)} disabled={!flipped}>
          <X className="h-4 w-4" />Still learning
        </button>
        <button className="btn-secondary min-w-36 border-good/40 text-good" onClick={() => rate(true)} disabled={!flipped}>
          <Check className="h-4 w-4" />Got it
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-subtle">
        <span className="kbd">Space</span> flip · <span className="kbd">←</span> still learning · <span className="kbd">→</span> got it
      </p>
    </div>
  );
}
