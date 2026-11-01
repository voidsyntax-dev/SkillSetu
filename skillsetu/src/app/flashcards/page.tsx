import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { getMasteryStore } from "@/lib/insights";
import SubjectPicker from "@/components/SubjectPicker";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Flashcards" };

export default async function FlashcardsPage() {
  const user = await getCurrentUser();
  const store = await getMasteryStore(user?.id ?? null);
  return (
    <div className="page">
      <PageHeader eyebrow="Practice" title="Flashcards"
        subtitle="Every subject's key concepts as flip cards. Great for quick revision before practice or exams — open any subskill for a focused deck." />
      <SubjectPicker
        store={store}
        branchId={user?.branchId ?? null}
        href={(s) => `/flashcards/${s.id}`}
        meta={(s) => `${s.subskills.reduce((n, ss) => n + ss.concepts.length, 0)} cards · ${s.subskills.length} topics`}
        cta="Revise"
      />
    </div>
  );
}
