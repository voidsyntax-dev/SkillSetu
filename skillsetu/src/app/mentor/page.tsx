import type { Metadata } from "next";
import Link from "next/link";
import { serverKeyConfigured } from "@/lib/ai";
import MentorModeBadge from "@/components/MentorModeBadge";
import { getCurrentUser } from "@/lib/session";
import { getCareer } from "@/lib/catalog";
import MentorBox from "@/components/MentorBox";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "AI Mentor" };

export default async function MentorPage() {
  const user = await getCurrentUser();
  const target = user?.targetCareerId ? getCareer(user.targetCareerId) : undefined;

  return (
    <div className="page">
      <PageHeader
        title="AI mentor"
        subtitle="Ask about careers, find your gaps, or open any subskill to ask a doubt. Use the free offline mentor, or add your own Anthropic API key in Settings for full Claude answers."
        actions={<MentorModeBadge serverKey={serverKeyConfigured()} />}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MentorBox
          title="Career navigator"
          description="Describe what you enjoy, your strengths and what kind of work excites you. The mentor suggests matching careers."
          buttonLabel="Suggest careers"
          request={{ mode: "careers", interests: "" }}
          inputLabel="Your interests"
          inputPlaceholder="e.g. I like chemistry and coding, enjoy solving optimisation problems, and want to work on clean energy."
          requireInput
        />
        {target ? (
          <MentorBox
            title={`Gap analysis · ${target.name}`}
            description="A two-week plan for your highest-impact skill gaps, based on your current mastery."
            buttonLabel="Analyse my gaps"
            request={{ mode: "gaps", careerId: target.id }}
          />
        ) : (
          <div className="card p-6">
            <h3 className="font-semibold text-ink">Gap analysis</h3>
            <p className="mt-1 text-sm text-muted">Set a target career to get a personalised gap analysis.</p>
            <Link href="/careers" className="btn-secondary mt-4">Choose a career</Link>
          </div>
        )}
      </div>
      <p className="mt-6 text-sm text-muted">Tip: every subskill page has a mentor panel for doubts about that exact topic.</p>
    </div>
  );
}
