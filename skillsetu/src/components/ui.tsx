// Small presentational building blocks. Server-safe (no hooks).

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import type { DecayRisk } from "@/types";

export function ProgressBar({ value, tone, size = "md" }: { value: number; tone?: "brand" | "good" | "warn" | "bad"; size?: "sm" | "md" }) {
  const t = tone ?? (value >= 80 ? "good" : value >= 40 ? "brand" : value > 0 ? "warn" : "brand");
  const color = { brand: "bg-brand", good: "bg-good", warn: "bg-warn", bad: "bg-bad" }[t];
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full overflow-hidden rounded-full bg-surface-3 ${size === "sm" ? "h-1.5" : "h-2"}`} role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`bar-grow h-full rounded-full ${color} transition-[width] duration-700 ease-out`} style={{ width: `${v}%` }} />
    </div>
  );
}

export function MasteryRing({ value, size = 64, label }: { value: number; size?: number; label?: string }) {
  const stroke = Math.max(4, size / 11);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.min(100, Math.max(0, value));
  const color = v >= 80 ? "var(--good)" : v >= 40 ? "var(--brand)" : v > 0 ? "var(--warn)" : "var(--border)";
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          className="ring-anim transition-[stroke-dashoffset] duration-700"
          style={{ "--ring-c": c, strokeDasharray: c, strokeDashoffset: c * (1 - v / 100) } as React.CSSProperties} />
      </svg>
      <span className="absolute text-center leading-none">
        <span className="font-semibold tabular-nums text-ink" style={{ fontSize: size / 4.4 }}>{Math.round(v)}%</span>
        {label && <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-subtle">{label}</span>}
      </span>
    </div>
  );
}

export function DecayPill({ risk }: { risk: DecayRisk }) {
  const map = {
    stable: ["bg-good-soft text-good", "Stable"],
    medium: ["bg-warn-soft text-warn", "Fading"],
    high: ["bg-bad-soft text-bad", "Decaying"],
  } as const;
  const [cls, text] = map[risk];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />{text}
    </span>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-subtle" aria-hidden />}
          {item.href ? <Link href={item.href} className="transition-colors hover:text-ink">{item.label}</Link> : <span className="font-medium text-ink">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h1 className="h1">{title}</h1>
        {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Stat({ label, value, hint, icon, tone = "brand" }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode; tone?: "brand" | "good" | "warn" | "accent" }) {
  const toneCls = { brand: "bg-brand-soft text-brand", good: "bg-good-soft text-good", warn: "bg-warn-soft text-warn", accent: "bg-brand-soft text-accent" }[tone];
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        {icon && <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${toneCls}`}>{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-ink">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-subtle">{hint}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, children, action }: { icon: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <div className="animate-float mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand" aria-hidden>{icon}</div>
      <h3 className="h2">{title}</h3>
      {children && <p className="mt-2 max-w-md text-sm text-muted">{children}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="h2">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Renders the small subset of markdown the mentor and questions use: **bold**, bullets and line breaks. */
export function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      blocks.push(<ul key={blocks.length} className="mb-2 list-disc space-y-1 pl-5 marker:text-subtle">{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>);
      list = [];
    }
  };
  for (const line of lines) {
    const bullet = line.match(/^\s*[-*•]\s+(.*)/);
    if (bullet) {
      list.push(bullet[1]);
      continue;
    }
    flush();
    if (line.trim()) blocks.push(<p key={blocks.length} className="mb-2">{inline(line.replace(/^#+\s*/, ""))}</p>);
  }
  flush();
  return <div className="text-sm leading-relaxed text-ink">{blocks}</div>;
}

export function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong> : part,
  );
}
