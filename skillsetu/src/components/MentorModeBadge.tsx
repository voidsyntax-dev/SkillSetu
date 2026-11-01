"use client";

import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";
import { useMentorPrefs } from "@/lib/mentorSettings";

export default function MentorModeBadge({ serverKey }: { serverKey: boolean }) {
  const prefs = useMentorPrefs();
  const usingClaude =
    prefs.mode === "apikey" ? !!prefs.apiKey : prefs.mode === "default" && serverKey;
  return (
    <Link href="/settings" className="btn-secondary">
      {usingClaude ? <Sparkles className="h-4 w-4 text-brand" /> : <BookOpen className="h-4 w-4" />}
      {usingClaude ? "Using Claude" : "Offline mentor"}<span className="text-subtle">· Change</span>
    </Link>
  );
}
