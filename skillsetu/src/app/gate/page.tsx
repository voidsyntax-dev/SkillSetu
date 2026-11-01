import { randomInt } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Target, Zap } from "lucide-react";
import { getBranches } from "@/lib/catalog";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "GATE mode" };

export default function GatePage() {
  return (
    <div className="page">
      <PageHeader eyebrow="Exam" title="GATE mode"
        subtitle="A GATE-style mock for your branch: multiple-choice questions with negative marking, plus numerical-answer questions with no negative marking." />
      <div className="card mb-8 grid gap-6 p-6 sm:grid-cols-3">
        {[
          [Clock, "60 minutes", "Timer runs in the header; submit any time"],
          [Target, "25 MCQ + 5 NAT", "MCQ: 1 mark, −⅓ if wrong · NAT: 2 marks"],
          [Zap, "Full review", "Every answer, the correct value and the working"],
        ].map(([Ic, title, text]) => {
          const I = Ic as typeof Clock;
          return (
            <div key={String(title)} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand"><I className="h-4 w-4" /></span>
              <div>
                <div className="text-sm font-semibold text-ink">{String(title)}</div>
                <div className="text-xs text-muted">{String(text)}</div>
              </div>
            </div>
          );
        })}
      </div>
      <h2 className="h2 mb-4">Choose your branch</h2>
      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {getBranches().map((b) => (
          <Link key={b.id} href={`/gate/${b.id}?seed=${randomInt(1, 2 ** 31 - 1)}`} className="card card-hover group flex items-center gap-4 p-5">
            <span className="text-2xl" aria-hidden>{b.icon}</span>
            <span className="flex-1 font-medium text-ink group-hover:text-brand">{b.name}</span>
            <ArrowRight className="h-4 w-4 text-subtle transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
