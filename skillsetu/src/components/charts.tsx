// Dependency-free SVG charts (server-safe).

import type { DayActivity } from "@/lib/insights";

export function ActivityBars({ data }: { data: DayActivity[] }) {
  const max = Math.max(5, ...data.map((d) => d.answered));
  const W = 560, H = 160, pad = 24;
  const bw = (W - pad) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" role="img" aria-label="Questions answered per day">
      {[0.5, 1].map((f) => (
        <g key={f}>
          <line x1={pad} x2={W} y1={H - H * f * 0.9} y2={H - H * f * 0.9} stroke="var(--border)" strokeDasharray="3 3" />
          <text x={0} y={H - H * f * 0.9 + 4} fontSize={10} fill="var(--muted)">{Math.round(max * f)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const h = (d.answered / max) * H * 0.9;
        const ch = (d.correct / max) * H * 0.9;
        const x = pad + i * bw + bw * 0.15;
        const date = new Date(d.day + "T00:00:00");
        return (
          <g key={d.day}>
            <title>{`${d.day}: ${d.correct}/${d.answered} correct`}</title>
            <rect x={x} y={H - h} width={bw * 0.7} height={h} rx={3} fill="var(--brand-soft)" />
            <rect x={x} y={H - ch} width={bw * 0.7} height={ch} rx={3} fill="var(--brand)" />
            {(i % 2 === 0 || data.length <= 7) && (
              <text x={x + bw * 0.35} y={H + 14} fontSize={10} textAnchor="middle" fill="var(--muted)">
                {date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function ActivityCalendar({ data }: { data: DayActivity[] }) {
  // data is consecutive days ending today; lay out as weekly columns.
  const first = new Date(data[0].day + "T00:00:00");
  const lead = first.getDay();
  const cells = [...Array(lead).fill(null), ...data] as (DayActivity | null)[];
  const weeks = Math.ceil(cells.length / 7);
  const size = 12, gap = 3;
  const color = (n: number) => (n === 0 ? "var(--surface-2)" : n < 5 ? "color-mix(in srgb, var(--good) 35%, transparent)" : n < 15 ? "color-mix(in srgb, var(--good) 65%, transparent)" : "var(--good)");
  return (
    <div className="overflow-x-auto">
      <svg width={weeks * (size + gap)} height={7 * (size + gap)} role="img" aria-label="Practice calendar">
        {cells.map((c, i) =>
          c ? (
            <rect key={c.day} x={Math.floor(i / 7) * (size + gap)} y={(i % 7) * (size + gap)} width={size} height={size} rx={2} fill={color(c.answered)}>
              <title>{`${c.day}: ${c.answered} questions`}</title>
            </rect>
          ) : null,
        )}
      </svg>
    </div>
  );
}

export function RadarChart({ data }: { data: { label: string; value: number }[] }) {
  if (data.length < 3) return null;
  const S = 300, c = S / 2, r = S / 2 - 50;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    return [c + Math.cos(a) * r * (v / 100), c + Math.sin(a) * r * (v / 100)];
  };
  const poly = data.map((d, i) => pt(i, d.value).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="mx-auto w-full max-w-xs" role="img" aria-label="Skill mastery radar">
      {[25, 50, 75, 100].map((lvl) => (
        <polygon key={lvl} points={data.map((_, i) => pt(i, lvl).join(",")).join(" ")} fill="none" stroke="var(--border)" />
      ))}
      {data.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="var(--border)" />;
      })}
      <polygon points={poly} fill="color-mix(in srgb, var(--brand) 25%, transparent)" stroke="var(--brand)" strokeWidth={2} />
      {data.map((d, i) => {
        const [x, y] = pt(i, 118);
        const label = d.label.length > 16 ? d.label.slice(0, 15) + "…" : d.label;
        return (
          <text key={d.label} x={x} y={y} fontSize={10} textAnchor={x < c - 5 ? "end" : x > c + 5 ? "start" : "middle"} dominantBaseline="middle" fill="var(--muted)">
            {label} <tspan fill="var(--text)" fontWeight={600}>{d.value}%</tspan>
          </text>
        );
      })}
    </svg>
  );
}
