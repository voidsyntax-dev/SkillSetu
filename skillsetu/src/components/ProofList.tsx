import Link from "next/link";
import { Award, GraduationCap, ShieldCheck, Wrench } from "lucide-react";
import { getSkill } from "@/lib/catalog";

export interface ProofView {
  id: string;
  kind: string;
  skillId: string;
  subskillId: string | null;
  title: string;
  description: string;
  score: number;
  accuracy: number;
  attempts: number;
  hash: string;
  earnedAt: Date;
}

export default function ProofList({ proofs }: { proofs: ProofView[] }) {
  return (
    <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {proofs.map((p) => {
        const isProject = p.kind === "PROJECT";
        return (
          <article key={p.id} className={`card card-hover flex flex-col p-5 ${p.kind === "SKILL" ? "border-brand/40" : ""}`}>
            <div className="mb-3 flex items-center justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${p.kind === "SKILL" ? "bg-gradient-to-br from-brand to-accent text-white" : isProject ? "bg-warn-soft text-warn" : "bg-good-soft text-good"}`} aria-hidden>
                {p.kind === "SKILL" ? <GraduationCap className="h-5 w-5" /> : isProject ? <Wrench className="h-5 w-5" /> : <Award className="h-5 w-5" />}
              </span>
              <span className="chip">{p.kind === "SKILL" ? "Skill certificate" : isProject ? "Project" : "Subskill mastery"}</span>
            </div>
            <h3 className="font-semibold text-ink">{p.title}</h3>
            <Link href={`/skills/${p.skillId}`} className="text-sm text-brand hover:underline">{getSkill(p.skillId)?.name}</Link>
            <p className="mt-2 flex-1 text-sm text-muted">{p.description}</p>
            {!isProject && (
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[["Mastery", `${p.score}%`], ["Accuracy", `${p.accuracy}%`], ["Attempts", p.attempts]].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-surface-2 p-2"><dt className="text-[10px] uppercase text-muted">{k}</dt><dd className="font-bold text-ink">{v}</dd></div>
                ))}
              </dl>
            )}
            <p className="mt-3 flex items-center gap-1 font-mono text-[11px] text-subtle">
              <ShieldCheck className="h-3 w-3" />
              #{p.hash} · {p.earnedAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </article>
        );
      })}
    </div>
  );
}
