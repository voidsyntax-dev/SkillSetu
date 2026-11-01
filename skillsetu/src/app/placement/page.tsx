import { randomInt } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { APTITUDE_TEMPLATES, numericSet } from "@/lib/numerics";
import { getBranch } from "@/lib/catalog";
import { GENERIC_INTERVIEW, INTERVIEW_BY_BRANCH } from "@/data/placement";
import NumericDrill from "@/components/NumericDrill";
import { PageHeader, SectionTitle, inline } from "@/components/ui";

export const metadata: Metadata = { title: "Placement prep" };

export default async function PlacementPage({ searchParams }: { searchParams: Promise<{ seed?: string }> }) {
  const seed = Number((await searchParams).seed) || randomInt(1, 2 ** 31 - 1);
  const user = await getCurrentUser();
  const branchId = user?.branchId ?? null;
  const interview = [...(branchId ? INTERVIEW_BY_BRANCH[branchId] ?? [] : []), ...GENERIC_INTERVIEW];
  const branch = branchId ? getBranch(branchId) : undefined;

  return (
    <div className="page">
      <PageHeader eyebrow="Careers" title="Placement prep"
        subtitle="Quick aptitude drills for online tests, and the questions interviewers ask most in your field." />

      <section className="mb-12 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SectionTitle title="Aptitude drill" subtitle="Percentages, work and time, and averages. Check each answer and read the working." />
          <Link href={`/placement?seed=${randomInt(1, 2 ** 31 - 1)}`} className="btn-ghost btn-sm mb-4">New drill</Link>
          <p className="text-xs text-subtle">{APTITUDE_TEMPLATES.length} problem types</p>
        </div>
        <div className="lg:col-span-3">
          <NumericDrill items={numericSet(seed, 8, APTITUDE_TEMPLATES)} feed="/placement" />
        </div>
      </section>

      <section>
        <SectionTitle title="Interview questions" subtitle={branch ? `Tailored to ${branch.name}, then general HR questions.` : "General questions. Set your branch in Settings for field-specific ones."} />
        <div className="space-y-3">
          {interview.map((item) => (
            <details key={item.q} className="card group p-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <span className="font-medium text-ink">{inline(item.q)}</span>
                <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-subtle transition-transform group-open:rotate-180" />
              </summary>
              <p className="animate-fade-in mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
