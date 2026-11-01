"use client";

import { useTransition } from "react";
import { Target } from "lucide-react";
import { setTargetCareer } from "@/lib/actions";

export default function TargetCareerButton({ careerId, isTarget }: { careerId: string; isTarget: boolean }) {
  const [pending, start] = useTransition();
  if (isTarget) return <span className="btn-secondary cursor-default border-brand/40 text-brand"><Target className="h-4 w-4" />Your target career</span>;
  return (
    <button className="btn-primary" disabled={pending} onClick={() => start(() => setTargetCareer(careerId))}>
      {pending ? "Saving…" : "Set as my target"}
    </button>
  );
}
