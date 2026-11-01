// Prerequisite graph rendered as a layered DAG in plain SVG (server component).
// Columns are dependency depth; edges point from prerequisite to dependent.

import Link from "next/link";
import type { Skill } from "@/types";

const NODE_W = 176;
const NODE_H = 52;
const COL_GAP = 64;
const ROW_GAP = 18;

export default function SkillGraph({ skills, mastery }: { skills: Skill[]; mastery: Record<string, number> }) {
  const ids = new Set(skills.map((s) => s.id));
  const depth = new Map<string, number>();
  const byId = new Map(skills.map((s) => [s.id, s]));
  const getDepth = (id: string, seen = new Set<string>()): number => {
    if (depth.has(id)) return depth.get(id)!;
    if (seen.has(id)) return 0;
    seen.add(id);
    const deps = (byId.get(id)?.dependsOn ?? []).filter((d) => ids.has(d));
    const d = deps.length ? Math.max(...deps.map((x) => getDepth(x, seen))) + 1 : 0;
    depth.set(id, d);
    return d;
  };
  skills.forEach((s) => getDepth(s.id));

  const columns: Skill[][] = [];
  for (const s of skills) (columns[depth.get(s.id)!] ??= []).push(s);

  const pos = new Map<string, { x: number; y: number }>();
  const maxRows = Math.max(...columns.map((c) => c.length));
  const height = maxRows * (NODE_H + ROW_GAP) - ROW_GAP + 8;
  columns.forEach((col, ci) => {
    const offset = (height - (col.length * (NODE_H + ROW_GAP) - ROW_GAP)) / 2;
    col.forEach((s, ri) => pos.set(s.id, { x: ci * (NODE_W + COL_GAP) + 4, y: offset + ri * (NODE_H + ROW_GAP) }));
  });
  const width = columns.length * (NODE_W + COL_GAP) - COL_GAP + 8;

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Skill prerequisite graph" className="min-w-full">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
          </marker>
        </defs>
        {skills.flatMap((s) =>
          s.dependsOn.filter((d) => ids.has(d)).map((d) => {
            const a = pos.get(d)!;
            const b = pos.get(s.id)!;
            const x1 = a.x + NODE_W, y1 = a.y + NODE_H / 2, x2 = b.x - 2, y2 = b.y + NODE_H / 2;
            const mx = (x1 + x2) / 2;
            return <path key={`${d}-${s.id}`} d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`} fill="none" stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#arrow)" />;
          }),
        )}
        {skills.map((s) => {
          const p = pos.get(s.id)!;
          const m = mastery[s.id] ?? 0;
          const fill = m >= 80 ? "var(--good)" : m > 0 ? "var(--brand)" : "var(--border)";
          return (
            <Link key={s.id} href={`/skills/${s.id}`}>
              <g className="cursor-pointer [&:hover>rect:first-child]:stroke-[var(--brand)]">
                <rect x={p.x} y={p.y} width={NODE_W} height={NODE_H} rx={10} fill="var(--surface)" stroke="var(--border)" strokeWidth={1.5} />
                <rect x={p.x} y={p.y + NODE_H - 4} width={(NODE_W * m) / 100} height={4} rx={2} fill={fill} />
                <text x={p.x + 10} y={p.y + 22} fontSize={12} fontWeight={600} fill="var(--text)">
                  {s.name.length > 24 ? s.name.slice(0, 23) + "…" : s.name}
                </text>
                <text x={p.x + 10} y={p.y + 38} fontSize={11} fill="var(--muted)">
                  {m > 0 ? `${m}% mastery` : `${s.subskills.length} subskills`}
                </text>
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}
