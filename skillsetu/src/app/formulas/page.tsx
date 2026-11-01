import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sigma } from "lucide-react";
import { getSkill } from "@/lib/catalog";
import { ENGINEERING_TEMPLATES } from "@/lib/numerics";
import { EmptyState, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Formula sheets" };

export default function FormulasPage() {
  const skillIds = [...new Set(ENGINEERING_TEMPLATES.map((t) => t.skillId))];
  return (
    <div className="page">
      <PageHeader eyebrow="Study" title="Formula sheets"
        subtitle="The key formulas for each subject, each with a worked example. Print a sheet and keep it beside you during revision." />
      {skillIds.length === 0 ? (
        <EmptyState icon={<Sigma className="h-6 w-6" />} title="No sheets yet">Formula sheets will appear here.</EmptyState>
      ) : (
        <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillIds.map((id) => {
            const count = ENGINEERING_TEMPLATES.filter((t) => t.skillId === id).length;
            return (
              <Link key={id} href={`/formulas/${id}`} className="card card-hover group flex flex-col p-5">
                <Sigma className="mb-4 h-5 w-5 text-brand" />
                <h3 className="font-medium text-ink group-hover:text-brand">{getSkill(id)?.name ?? id}</h3>
                <p className="mt-1 text-xs text-muted">{count} formula{count === 1 ? "" : "s"} with worked examples</p>
                <span className="mt-4 flex items-center gap-1 text-sm font-medium text-brand">Open sheet<ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
