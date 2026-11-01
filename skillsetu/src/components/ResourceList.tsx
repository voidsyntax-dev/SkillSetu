"use client";

import { useState, useTransition } from "react";
import { BookOpen, Check, ExternalLink, FileText, GraduationCap, PenLine, PlayCircle, ThumbsUp } from "lucide-react";
import { setResourceProgress } from "@/lib/actions";
import type { Resource } from "@/types";

const TYPE_ICON = { video: PlayCircle, course: GraduationCap, article: FileText, book: BookOpen, practice: PenLine } as const;
const LEVEL = ["", "Intro", "Intermediate", "Advanced"];

export default function ResourceList({ resources, progress }: { resources: Resource[]; progress: Record<string, { completed: boolean; liked: boolean | null }> }) {
  const [state, setState] = useState(progress);
  const [, start] = useTransition();

  const update = (id: string, patch: { completed?: boolean; liked?: boolean | null }) => {
    setState((s) => ({ ...s, [id]: { ...(s[id] ?? { completed: false, liked: null }), ...patch } }));
    start(() => setResourceProgress(id, patch));
  };

  const done = resources.filter((r) => state[r.id]?.completed).length;

  return (
    <div>
      <p className="mb-2 text-xs text-subtle">{done} of {resources.length} completed</p>
      <ul className="divide-y divide-line">
        {resources.map((r) => {
          const p = state[r.id];
          const Icon = TYPE_ICON[r.type];
          return (
            <li key={r.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line transition-colors ${p?.completed ? "bg-good-soft text-good" : "bg-surface-2 text-muted"}`}>
                {p?.completed ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <a href={r.url} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand ${p?.completed ? "text-muted line-through" : "text-ink"}`}>
                  {r.title}<ExternalLink className="h-3 w-3 shrink-0 text-subtle" />
                </a>
                <div className="mt-0.5 text-xs text-subtle">{r.provider} · {r.duration} · {LEVEL[r.difficulty]}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => update(r.id, { liked: p?.liked ? null : true })} aria-pressed={!!p?.liked} aria-label="Mark as helpful" title="Helpful"
                  className={`btn-secondary btn-sm ${p?.liked ? "border-brand/40 text-brand" : ""}`}>
                  <ThumbsUp className={`h-3.5 w-3.5 ${p?.liked ? "animate-pop" : ""}`} />
                </button>
                <button onClick={() => update(r.id, { completed: !p?.completed })} aria-pressed={!!p?.completed}
                  className={`btn-secondary btn-sm min-w-24 ${p?.completed ? "border-good/40 text-good" : ""}`}>
                  {p?.completed ? <><Check className="h-3.5 w-3.5" />Done</> : "Mark done"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
