"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  ArrowRight, BookMarked, Briefcase, Building2, CircleAlert, CornerDownLeft, GalleryVerticalEnd, Layers,
  LayoutDashboard, Repeat, Search, Settings, Sparkles, Timer, Hash,
} from "lucide-react";
import { searchAction } from "@/lib/actions";
import type { SearchHit } from "@/lib/catalog";

const OPEN_EVENT = "skillsetu:open-palette";
export const openCommandPalette = () => window.dispatchEvent(new Event(OPEN_EVENT));

const QUICK = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Start daily review", href: "/review", icon: Repeat },
  { title: "Flashcards", href: "/flashcards", icon: GalleryVerticalEnd },
  { title: "Take a mock test", href: "/test", icon: Timer },
  { title: "Mistake book", href: "/mistakes", icon: CircleAlert },
  { title: "My library", href: "/library", icon: BookMarked },
  { title: "Ask the AI mentor", href: "/mentor", icon: Sparkles },
  { title: "Browse branches", href: "/branches", icon: Building2 },
  { title: "Settings", href: "/settings", icon: Settings },
];

const TYPE_ICON = { branch: Building2, career: Briefcase, skill: Layers, subskill: Hash } as const;

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ q: string; hits: SearchHit[] }>({ q: "", hits: [] });
  const [index, setIndex] = useState(0);
  const [pending, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Debounced server search.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const t = setTimeout(() => start(async () => setResult({ q, hits: await searchAction(q) })), 150);
    return () => clearTimeout(t);
  }, [query]);

  const searching = query.trim().length >= 2;
  const hits = result.q === query.trim() ? result.hits : [];
  const settled = result.q === query.trim() && !pending;
  const quick = QUICK.filter((a) => a.title.toLowerCase().includes(query.trim().toLowerCase()));
  const items = searching
    ? [...hits.map((h) => ({ title: h.title, subtitle: h.subtitle, href: h.href, icon: TYPE_ICON[h.type] })), ...quick.map((a) => ({ ...a, subtitle: "Go to" }))]
    : QUICK.map((a) => ({ ...a, subtitle: "" }));

  const close = () => {
    setOpen(false);
    setQuery("");
    setResult({ q: "", hits: [] });
    setIndex(0);
  };
  const go = (href: string) => {
    close();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && items[index]) {
      e.preventDefault();
      go(items[index].href);
    }
  };

  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="animate-fade-in absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
      <div className="animate-scale-in relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-pop" onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className={`h-4 w-4 shrink-0 ${pending ? "animate-pulse text-brand" : "text-subtle"}`} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Search topics, subjects, careers… e.g. entropy, SQL, CRISPR"
            className="h-14 w-full bg-transparent text-sm text-ink outline-none placeholder:text-subtle"
            aria-label="Search"
          />
          <span className="kbd">Esc</span>
        </div>
        <ul ref={listRef} className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {!searching && <li className="px-2 pb-1 pt-2 text-xs font-medium text-subtle">Quick actions</li>}
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <li key={it.href + it.title} data-idx={i} role="option" aria-selected={i === index}>
                <button
                  onMouseMove={() => setIndex(i)}
                  onClick={() => go(it.href)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${i === index ? "bg-surface-2" : ""}`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${i === index ? "text-brand" : "text-subtle"}`} />
                  <span className="min-w-0 flex-1 truncate font-medium text-ink">{it.title}</span>
                  {it.subtitle && <span className="truncate text-xs text-subtle">{it.subtitle}</span>}
                  {i === index && <ArrowRight className="h-3.5 w-3.5 text-subtle" />}
                </button>
              </li>
            );
          })}
          {searching && settled && items.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-muted">No results for “{query}”.</li>
          )}
        </ul>
        <div className="flex items-center gap-4 border-t border-line bg-surface-2 px-4 py-2 text-xs text-subtle">
          <span className="flex items-center gap-1"><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
          <span className="flex items-center gap-1"><span className="kbd"><CornerDownLeft className="h-3 w-3" /></span> open</span>
        </div>
      </div>
    </div>
  );
}
