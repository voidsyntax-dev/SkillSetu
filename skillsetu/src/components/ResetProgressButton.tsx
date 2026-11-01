"use client";

import { useTransition } from "react";
import { resetProgress } from "@/lib/actions";

export default function ResetProgressButton() {
  const [pending, start] = useTransition();
  return (
    <button
      className="btn-ghost text-bad"
      disabled={pending}
      onClick={() => {
        if (window.confirm("Reset all mastery, activity, badges and proofs? This cannot be undone.")) start(() => resetProgress());
      }}
    >
      {pending ? "Resetting…" : "Reset progress"}
    </button>
  );
}
