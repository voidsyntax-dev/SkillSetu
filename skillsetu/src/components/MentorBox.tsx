"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { askMentor } from "@/lib/actions";
import { useMentorPrefs } from "@/lib/mentorSettings";
import type { MentorReply } from "@/lib/ai";
import { RichText } from "./ui";

type Request = Parameters<typeof askMentor>[0];

/**
 * Mentor panel. `request` builds the action payload; when `inputLabel` is set
 * the user types free text (a doubt or interests) that is passed to it.
 */
export default function MentorBox({
  title, description, buttonLabel, request, inputLabel, inputPlaceholder, requireInput,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  request: Request;
  inputLabel?: string;
  inputPlaceholder?: string;
  requireInput?: boolean;
}) {
  const [text, setText] = useState("");
  const [reply, setReply] = useState<MentorReply | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const prefs = useMentorPrefs();

  const run = () => {
    setError(null);
    start(async () => {
      try {
        const payload =
          request.mode === "explain" ? { ...request, doubt: text } :
          request.mode === "careers" ? { ...request, interests: text } : request;
        setReply(await askMentor(payload, prefs));
      } catch {
        setError("The mentor could not answer right now. Please try again.");
      }
    });
  };

  return (
    <div className="card p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-accent text-white" aria-hidden><Sparkles className="h-3.5 w-3.5" /></span>
        <h3 className="font-semibold text-ink">{title}</h3>
      </div>
      <p className="mb-4 mt-1 text-sm text-muted">{description}</p>
      {inputLabel && (
        <div className="mb-3">
          <label className="label" htmlFor={`mentor-${title}`}>{inputLabel}</label>
          <textarea id={`mentor-${title}`} className="input min-h-20" placeholder={inputPlaceholder} value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} />
        </div>
      )}
      <button className="btn-primary" onClick={run} disabled={pending || (requireInput && !text.trim())}>
        {pending ? <><Loader2 className="h-4 w-4 animate-spin" />Thinking…</> : buttonLabel}
      </button>
      {error && <p className="mt-3 text-sm text-bad">{error}</p>}
      {pending && !reply && (
        <div className="mt-5 space-y-2 rounded-xl bg-surface-2 p-4" aria-hidden>
          <div className="skeleton h-3 w-11/12" /><div className="skeleton h-3 w-9/12" /><div className="skeleton h-3 w-10/12" />
        </div>
      )}
      {reply && (
        <div key={reply.text.length} className="animate-fade-up mt-5 rounded-xl bg-surface-2 p-4">
          {reply.notice && <p className="mb-3 rounded-lg bg-warn-soft p-2 text-xs text-warn" role="status">{reply.notice}</p>}
          <RichText text={reply.text} />
          <p className="mt-2 text-xs text-muted">
            {reply.source === "claude" ? "Answered by Claude" : "Offline mentor"} ·{" "}
            <Link href="/settings" className="hover:text-brand">change in Settings</Link>
          </p>
        </div>
      )}
    </div>
  );
}
