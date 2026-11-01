"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, NotebookPen } from "lucide-react";
import { saveNote } from "@/lib/actions";

/** Personal notes for a subskill, autosaved shortly after typing stops. */
export default function NotesPanel({ skillId, subskillId, initial }: { skillId: string; subskillId: string; initial: string }) {
  const [text, setText] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saved = useRef(initial);

  useEffect(() => {
    if (text === saved.current) return;
    const t = setTimeout(async () => {
      setStatus("saving");
      try {
        await saveNote(skillId, subskillId, text);
        saved.current = text;
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, 800);
    return () => clearTimeout(t);
  }, [text, skillId, subskillId]);

  return (
    <section className="card p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="h2 flex items-center gap-2"><NotebookPen className="h-4 w-4 text-brand" />My notes</h2>
        <span className="flex items-center gap-1 text-xs text-subtle" aria-live="polite">
          {status === "saving" && <><Loader2 className="h-3 w-3 animate-spin" />Saving…</>}
          {status === "saved" && <><Check className="h-3 w-3 text-good" />Saved</>}
          {status === "error" && <span className="text-bad">Couldn&apos;t save</span>}
        </span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write formulas, mnemonics or anything you want to remember. Notes save automatically and appear in your library."
        className="input min-h-36 resize-y leading-relaxed"
        maxLength={20000}
        aria-label="My notes"
      />
    </section>
  );
}
