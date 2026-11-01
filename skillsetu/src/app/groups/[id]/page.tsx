import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { addAssignmentAction } from "@/lib/actions";
import { getSkills, getSkill } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getMasteryStore, skillScore, subskillStatuses } from "@/lib/insights";
import { groupXP } from "@/lib/planning";
import { formatDay } from "@/lib/mastery";
import { Breadcrumbs, PageHeader, ProgressBar, SectionTitle } from "@/components/ui";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = await prisma.group.findUnique({ where: { id: (await params).id }, select: { name: true } });
  return { title: g?.name ?? "Group" };
}

export default async function GroupPage({ params }: Props) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) notFound();
  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      members: { include: { user: { select: { id: true, name: true } } } },
      assignments: { orderBy: { dueDay: "asc" } },
    },
  });
  const me = group?.members.find((m) => m.userId === userId);
  if (!group || !me) notFound();

  const isOwner = me.role === "owner";
  const xp = await groupXP(group.members.map((m) => m.userId));

  // Per-member mastery and weakest subject (teacher view).
  const rows = await Promise.all(
    group.members.map(async (m) => {
      const store = await getMasteryStore(m.userId);
      const statuses = subskillStatuses(store);
      const avg = statuses.length ? Math.round(statuses.reduce((n, s) => n + s.effective, 0) / statuses.length) : 0;
      const practised = [...new Set(statuses.map((s) => s.skillId))].map((sid) => getSkill(sid)).filter((s): s is NonNullable<typeof s> => !!s);
      const weakest = practised.sort((a, b) => skillScore(store, a) - skillScore(store, b))[0];
      return {
        id: m.userId, name: m.user.name, role: m.role, xp: xp.get(m.userId) ?? 0, avg,
        weakest: weakest?.name ?? "—",
      };
    }),
  );
  rows.sort((a, b) => b.xp - a.xp);
  const today = formatDay(new Date());

  return (
    <div className="page">
      <Breadcrumbs items={[{ label: "Groups", href: "/groups" }, { label: group.name }]} />
      <PageHeader eyebrow="Group" title={group.name}
        subtitle={<>Share code <span className="font-mono font-semibold tracking-widest text-ink">{group.code}</span> to invite members. XP is correct answers in the last 7 days.</>} />

      <section className="mb-10">
        <SectionTitle title="Leaderboard" subtitle={`${rows.length} member${rows.length === 1 ? "" : "s"}`} />
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[32rem] text-sm">
            <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">XP (7d)</th>
                <th className="px-4 py-3 font-medium">Avg mastery</th>
                <th className="px-4 py-3 font-medium">Weakest subject</th>
              </tr>
            </thead>
            <tbody className="stagger divide-y divide-line">
              {rows.map((r, i) => (
                <tr key={r.id} className={r.id === userId ? "bg-brand-soft/50" : ""}>
                  <td className="px-4 py-3 text-subtle">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-ink">{r.name}{r.role === "owner" && <span className="chip ml-2">Owner</span>}</td>
                  <td className="px-4 py-3 tabular-nums">{r.xp}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-24"><ProgressBar value={r.avg} size="sm" /></div><span className="tabular-nums">{r.avg}%</span></div></td>
                  <td className="px-4 py-3 text-muted">{r.weakest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionTitle title="Assignments" subtitle="Subjects the owner has asked the group to practise." />
          {group.assignments.length ? (
            <ul className="stagger space-y-2">
              {group.assignments.map((a) => (
                <li key={a.id} className="card flex items-center justify-between gap-4 p-4">
                  <div>
                    <div className="font-medium text-ink">{a.title}</div>
                    <div className="text-xs text-muted">{getSkill(a.skillId)?.name} · due {a.dueDay}</div>
                  </div>
                  <span className={`chip ${a.dueDay < today ? "text-bad" : ""}`}>{a.dueDay < today ? "Overdue" : "Open"}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted">No assignments yet.</p>}
        </div>

        {isOwner && (
          <form action={addAssignmentAction} className="card space-y-3 p-6 lg:col-span-2">
            <h2 className="h2">Assign a subject</h2>
            <input type="hidden" name="groupId" value={group.id} />
            <input name="title" className="input" placeholder="e.g. Finish heat transfer quiz" maxLength={100} required aria-label="Title" />
            <select name="skillId" className="input" required defaultValue="" aria-label="Subject">
              <option value="" disabled>Subject…</option>
              {getSkills().map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input name="dueDay" type="date" className="input" required aria-label="Due date" min={today} />
            <button className="btn-primary w-full">Add assignment</button>
          </form>
        )}
      </section>
    </div>
  );
}
