"use client";

// Client-side filter for long card lists (careers, skills). Items arrive
// pre-rendered from the server; this only handles search and filters.

import { useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";

export interface ExplorerItem {
  id: string;
  text: string; // searchable text
  branches: string[];
  group?: string; // e.g. difficulty or level, for the secondary filter
  node: ReactNode;
}

export default function Explorer({
  items, branches, groups, groupLabel, placeholder,
}: {
  items: ExplorerItem[];
  branches: { id: string; short: string }[];
  groups?: string[];
  groupLabel?: string;
  placeholder: string;
}) {
  const [q, setQ] = useState("");
  const [branch, setBranch] = useState("all");
  const [group, setGroup] = useState("all");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (it) =>
        (branch === "all" || it.branches.includes(branch)) &&
        (group === "all" || it.group === group) &&
        (!needle || it.text.toLowerCase().includes(needle)),
    );
  }, [items, q, branch, group]);

  const filtered = q || branch !== "all" || group !== "all";

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-sm sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input className="input pl-9" placeholder={placeholder} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        </div>
        {groups && (
          <div className="inline-flex rounded-xl border border-line bg-surface p-1 shadow-sm" role="group" aria-label={groupLabel}>
            {["all", ...groups].map((g) => (
              <button key={g} onClick={() => setGroup(g)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${group === g ? "bg-surface-3 text-ink" : "text-muted hover:text-ink"}`}>
                {g === "all" ? "All" : g}
              </button>
            ))}
          </div>
        )}
        {filtered && (
          <button className="btn-ghost btn-sm" onClick={() => { setQ(""); setBranch("all"); setGroup("all"); }}><X className="h-3.5 w-3.5" />Clear</button>
        )}
      </div>
      <div className="-mx-1 mb-6 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {[{ id: "all", short: "All branches" }, ...branches].map((b) => (
          <button key={b.id} onClick={() => setBranch(b.id)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 ${branch === b.id ? "border-ink bg-ink text-bg" : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink"}`}>
            {b.short}
          </button>
        ))}
      </div>
      <p className="mb-4 text-sm text-subtle">{shown.length} result{shown.length === 1 ? "" : "s"}</p>
      {shown.length ? (
        <div key={`${branch}-${group}`} className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((it) => <div key={it.id} className="flex [&>*]:flex-1">{it.node}</div>)}
        </div>
      ) : (
        <p className="card animate-fade-in p-10 text-center text-sm text-muted">Nothing matches those filters.</p>
      )}
    </div>
  );
}
