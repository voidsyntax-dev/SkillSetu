import type { Metadata } from "next";
import { Clock, FolderKanban } from "lucide-react";
import { submitProjectAction } from "@/lib/actions";
import { getCareer, getSkill } from "@/lib/catalog";
import { getCurrentUser, getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";
import { PROJECTS } from "@/data/projects";
import { PageHeader, SectionTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  const userId = await getSessionUserId();
  const submitted = new Set(
    userId
      ? (await prisma.proof.findMany({ where: { userId, kind: "PROJECT" }, select: { subskillId: true } })).map((p) => p.subskillId)
      : [],
  );
  const ordered = [...PROJECTS].sort((a) => (a.careerId === user?.targetCareerId ? -1 : 1));

  return (
    <div className="page">
      <PageHeader eyebrow="Build" title="Projects"
        subtitle="Real deliverables for each career. Finish one, mark it submitted and it's added to your proof vault as evidence for recruiters." />
      <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2">
        {ordered.map((p) => {
          const career = getCareer(p.careerId);
          const done = submitted.has(p.id);
          return (
            <article key={p.id} className="card card-hover flex flex-col p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="chip">{career?.name}</span>
                <span className="flex items-center gap-1 text-xs text-muted"><Clock className="h-3.5 w-3.5" />{p.weeks} wk{p.weeks > 1 ? "s" : ""}</span>
              </div>
              <h3 className="flex items-center gap-2 font-semibold text-ink"><FolderKanban className="h-4 w-4 text-brand" />{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.brief}</p>
              <p className="mt-3 text-xs text-subtle">Evidence for: {getSkill(p.skillId)?.name}</p>
              <div className="mt-5">
                {done ? (
                  <span className="chip text-good">Added to proof vault</span>
                ) : (
                  <form action={submitProjectAction}>
                    <input type="hidden" name="projectId" value={p.id} />
                    <button className="btn-secondary btn-sm">Mark as submitted</button>
                  </form>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {!PROJECTS.length && <SectionTitle title="No projects yet" />}
    </div>
  );
}
