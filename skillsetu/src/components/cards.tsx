import Link from "next/link";
import { ArrowUpRight, Briefcase, Clock, IndianRupee, Layers } from "lucide-react";
import type { Branch, Career, Skill } from "@/types";
import { ProgressBar } from "./ui";

export function BranchCard({ branch, careerCount, progress }: { branch: Branch; careerCount: number; progress?: number }) {
  return (
    <Link href={`/branches/${branch.id}`} className="card card-hover group flex flex-col p-5">
      <div className="mb-4 flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-2 text-2xl transition-transform duration-300 group-hover:scale-110" aria-hidden>{branch.icon}</span>
        <ArrowUpRight className="h-4 w-4 text-subtle opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-brand" />
      </div>
      <h3 className="font-semibold leading-snug text-ink">{branch.name}</h3>
      <p className="mt-1 mb-4 line-clamp-2 flex-1 text-sm text-muted">{branch.description}</p>
      <div className="flex gap-3 text-xs text-subtle">
        <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" />{branch.skills.length} subjects</span>
        <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{careerCount} careers</span>
      </div>
      {progress !== undefined && progress > 0 && (
        <div className="mt-4 border-t border-line pt-4">
          <div className="mb-1.5 flex justify-between text-xs"><span className="text-muted">Your progress</span><span className="font-medium tabular-nums text-ink">{progress}%</span></div>
          <ProgressBar value={progress} size="sm" />
        </div>
      )}
    </Link>
  );
}

const difficultyTone = {
  Beginner: "bg-good-soft text-good",
  Intermediate: "bg-warn-soft text-warn",
  Advanced: "bg-bad-soft text-bad",
} as const;

export function CareerCard({ career, branchName, fit }: { career: Career; branchName?: string; fit?: number }) {
  return (
    <Link href={`/career/${career.id}`} className="card card-hover group flex flex-col p-5">
      <div className="mb-1 flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug text-ink group-hover:text-brand">{career.name}</h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${difficultyTone[career.difficulty]}`}>{career.difficulty}</span>
      </div>
      {branchName && <div className="mb-2 text-xs text-subtle">{branchName}</div>}
      <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted">{career.description}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5 text-subtle" />{career.salary.replace("₹", "")}</span>
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-subtle" />{career.learningTime}</span>
        <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5 text-subtle" />{career.skills.length} skills</span>
      </div>
      {fit !== undefined && fit > 0 && (
        <div className="mt-4 border-t border-line pt-4">
          <div className="mb-1.5 flex justify-between text-xs"><span className="text-muted">Career fit</span><span className="font-medium tabular-nums text-ink">{fit}%</span></div>
          <ProgressBar value={fit} size="sm" />
        </div>
      )}
    </Link>
  );
}

export function SkillCard({ skill, mastery, weight }: { skill: Skill; mastery?: number; weight?: number }) {
  const conceptCount = skill.subskills.reduce((n, s) => n + s.concepts.length, 0);
  return (
    <Link href={`/skills/${skill.id}`} className="card card-hover group flex flex-col p-5">
      <div className="mb-1 flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug text-ink group-hover:text-brand">{skill.name}</h3>
        {weight === 3 && <span className="shrink-0 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand">Critical</span>}
      </div>
      <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted">{skill.description}</p>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-subtle">
        <span>Year {skill.level}</span><span>·</span><span>{skill.subskills.length} subskills</span><span>·</span><span>{conceptCount} concepts</span>
      </div>
      {mastery !== undefined && (
        <div className="mt-4 border-t border-line pt-4">
          <div className="mb-1.5 flex justify-between text-xs"><span className="text-muted">Mastery</span><span className="font-medium tabular-nums text-ink">{mastery}%</span></div>
          <ProgressBar value={mastery} size="sm" />
        </div>
      )}
    </Link>
  );
}
