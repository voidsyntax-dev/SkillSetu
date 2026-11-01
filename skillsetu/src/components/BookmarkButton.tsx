"use client";

import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleBookmark } from "@/lib/actions";

export default function BookmarkButton({ skillId, subskillId, initial }: { skillId: string; subskillId: string; initial: boolean }) {
  const [saved, setSaved] = useState(initial);
  const [, start] = useTransition();
  return (
    <button
      className={`btn-secondary ${saved ? "border-brand/40 text-brand" : ""}`}
      aria-pressed={saved}
      onClick={() => {
        setSaved((s) => !s);
        start(async () => setSaved(await toggleBookmark(skillId, subskillId)));
      }}
    >
      {saved ? <BookmarkCheck key="on" className="animate-pop h-4 w-4" /> : <Bookmark key="off" className="h-4 w-4" />}
      {saved ? "Saved" : "Save topic"}
    </button>
  );
}
