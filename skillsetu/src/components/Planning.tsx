// Server-safe dashboard cards for spaced repetition and the weekly report.

import Link from "next/link";
import { ArrowUpRight, CalendarClock, Flame } from "lucide-react";
import { ProgressBar, SectionTitle } from "./ui";

export function DueCard({ due }: { due: { skillId: string; subskillId: string; subskillName: string; skillName: string; idle: number; interval: number }[] }) {
  return (
    <section className="card flex flex-col p-6">
      <SectionTitle title="Due today" subtitle={`${due.length} topic${due.length === 1 ? "" : "s"} past their review date`} />
      {due.length === 0 ? (
        <p className="text-sm text-muted">Nothing due. Your schedule is clear.</p>
      ) : (
        <ul className="stagger divide-y divide-line">
          {due.slice(0, 5).map((d) => (
            <li key={`${d.skillId}:${d.subskillId}`} className="flex items-center gap-3 py-2.5">
              <CalendarClock className="h-4 w-4 shrink-0 text-subtle" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-ink">{d.subskillName}</div>
                <div className="text-xs text-muted">{d.skillName} · last seen {d.idle} days ago</div>
              </div>
              <Link href={`/practice/${d.skillId}/${d.subskillId}`} className="btn-secondary btn-sm">Review</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function WeeklyCard({ report, freezes }: { report: { answered: number; accuracy: number; gained: number; answeredChange: number }; freezes: number }) {
  const up = report.answeredChange >= 0;
  return (
    <section className="card flex flex-col p-6">
      <SectionTitle title="This week" subtitle="Last 7 days compared with the 7 before" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted">Answered</div>
          <div className="text-2xl font-semibold tabular-nums text-ink">{report.answered}</div>
          <div className={`text-xs font-medium ${up ? "text-good" : "text-bad"}`}>{up ? "+" : ""}{report.answeredChange} vs last week</div>
        </div>
        <div>
          <div className="text-xs text-muted">Accuracy</div>
          <div className="text-2xl font-semibold tabular-nums text-ink">{report.accuracy}%</div>
          <div className="text-xs text-muted">+{report.gained} mastery points</div>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <ProgressBar value={Math.min(100, (report.answered / 70) * 100)} size="sm" />
        <p className="flex items-center gap-1.5 text-xs text-muted"><Flame className="h-3.5 w-3.5 text-warn" />{freezes} streak freeze{freezes === 1 ? "" : "s"} available</p>
      </div>
      <Link href="/analytics" className="mt-auto pt-5 flex items-center gap-1 text-sm font-medium text-brand hover:underline">
        Full analytics<ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}
