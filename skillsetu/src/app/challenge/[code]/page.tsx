import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSkill } from "@/lib/catalog";
import { resolveQuestion } from "@/lib/planning";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Breadcrumbs, SectionTitle } from "@/components/ui";
import QuizRunner, { type QuizItem } from "@/components/QuizRunner";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Challenge ${(await params).code}` };
}

export default async function ChallengePage({ params }: Props) {
  const code = (await params).code.toUpperCase();
  const challenge = await prisma.challenge.findUnique({ where: { code }, include: { creator: { select: { name: true } } } });
  if (!challenge) notFound();

  const skill = getSkill(challenge.skillId);
  const ids: string[] = JSON.parse(challenge.questionIds);
  const questions = (await Promise.all(ids.map((id) => resolveQuestion(id)))).filter((q): q is NonNullable<typeof q> => !!q);
  const items: QuizItem[] = questions.map((q) => ({ id: q.id, kind: "mcq", prompt: q.question, options: q.options }));

  const userId = await getSessionUserId();
  const mine = userId
    ? await prisma.challengeResult.findUnique({ where: { challengeId_userId: { challengeId: challenge.id, userId } } })
    : null;
  const board = await prisma.challengeResult.findMany({
    where: { challengeId: challenge.id },
    orderBy: [{ score: "desc" }, { timeMs: "asc" }],
    take: 20,
    include: { user: { select: { name: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Challenges", href: "/challenges" }, { label: `Code ${code}` }]} />
      <p className="mb-6 text-sm text-muted">
        {challenge.creator.name} challenges you on <span className="font-medium text-ink">{skill?.name}</span>. {items.length} questions, 5 minutes.
      </p>

      {mine ? (
        <div className="card mb-8 p-6 text-center">
          <p className="text-sm text-muted">Your score</p>
          <p className="mt-1 text-4xl font-semibold tabular-nums text-ink">{mine.score}/{mine.total}</p>
        </div>
      ) : items.length ? (
        <QuizRunner items={items} title={`Challenge · ${skill?.name ?? ""}`} minutes={5}
          gradeParams={{ kind: "CHALLENGE", challengeCode: code }} backHref="/challenges" />
      ) : null}

      <section className="mt-10">
        <SectionTitle title="Leaderboard" subtitle="Highest score first, then fastest time." />
        {board.length ? (
          <ol className="card divide-y divide-line">
            {board.map((r, i) => (
              <li key={r.id} className="flex items-center gap-4 px-5 py-3">
                <span className="w-6 text-sm font-semibold text-subtle">{i + 1}</span>
                <span className="flex-1 truncate text-sm font-medium text-ink">{r.user.name}</span>
                <span className="text-xs text-subtle">{Math.round(r.timeMs / 1000)}s</span>
                <span className="w-14 text-right font-semibold tabular-nums text-ink">{r.score}/{r.total}</span>
              </li>
            ))}
          </ol>
        ) : <p className="text-sm text-muted">No one has taken this challenge yet.</p>}
      </section>
    </div>
  );
}
