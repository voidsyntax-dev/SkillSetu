import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { getMasteryStore } from "@/lib/insights";
import SubjectPicker from "@/components/SubjectPicker";
import { PageHeader } from "@/components/ui";
import { TEST_LENGTH, TEST_MINUTES } from "@/lib/practice-config";

export const metadata: Metadata = { title: "Mock Tests" };

export default async function TestsPage() {
  const user = await getCurrentUser();
  const store = await getMasteryStore(user?.id ?? null);
  return (
    <div className="page">
      <PageHeader eyebrow="Practice" title="Mock tests"
        subtitle={`Timed, exam-style tests across a whole subject: ${TEST_LENGTH} questions in ${TEST_MINUTES} minutes, no hints until the end, then a full answer review.`} />
      <SubjectPicker
        store={store}
        branchId={user?.branchId ?? null}
        href={(s) => `/test/${s.id}`}
        meta={(s) => `${TEST_LENGTH} questions · ${TEST_MINUTES} min · covers ${s.subskills.length} topics`}
        cta="Test yourself"
      />
    </div>
  );
}
