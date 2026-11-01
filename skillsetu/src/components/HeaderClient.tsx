"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  Award, BookMarked, Briefcase, Building2, CalendarDays, Calculator, ChevronDown, CircleAlert, ClipboardCheck,
  FileText, Flame, FolderKanban, GalleryVerticalEnd, GraduationCap, Languages, Layers, LayoutDashboard, LineChart,
  LogOut, Menu, Repeat, Scale, Search, Settings, Sigma, Sparkles, Swords, Timer, Users, X, Zap,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import CommandPalette, { openCommandPalette } from "./CommandPalette";
import { setLang, useLang, useT } from "@/lib/i18n";

type Icon = ComponentType<{ className?: string }>;
interface Item { href: string; label: string; desc: string; icon: Icon }

const EXPLORE: Item[] = [
  { href: "/branches", label: "Branches", desc: "10 engineering branches and roadmaps", icon: Building2 },
  { href: "/careers", label: "Careers", desc: "36 career paths mapped to skills", icon: Briefcase },
  { href: "/skills", label: "Skills & subjects", desc: "75 subjects, 262 subskills", icon: Layers },
  { href: "/compare", label: "Compare careers", desc: "Side-by-side skills, pay and fit", icon: Scale },
  { href: "/formulas", label: "Formula sheets", desc: "Printable formulas with worked examples", icon: Sigma },
  { href: "/internships", label: "Internships", desc: "Match your mastery to openings", icon: GraduationCap },
];
const PRACTICE: Item[] = [
  { href: "/review", label: "Daily review", desc: "Revise what's due and what's fading", icon: Repeat },
  { href: "/numericals", label: "Numerical problems", desc: "Fresh calculations with worked solutions", icon: Calculator },
  { href: "/flashcards", label: "Flashcards", desc: "Flip through key concepts", icon: GalleryVerticalEnd },
  { href: "/test", label: "Mock tests", desc: "Timed exam-style tests per subject", icon: Timer },
  { href: "/gate", label: "GATE mode", desc: "Negative marking, numericals, 60 minutes", icon: Zap },
  { href: "/challenges", label: "Challenges", desc: "Race a friend on the same questions", icon: Swords },
  { href: "/mistakes", label: "Mistake book", desc: "Retry questions you got wrong", icon: CircleAlert },
  { href: "/placement", label: "Placement prep", desc: "Aptitude drills and interview questions", icon: ClipboardCheck },
];
const YOU: Item[] = [
  { href: "/planner", label: "Exam planner", desc: "Plan daily targets until your exam", icon: CalendarDays },
  { href: "/analytics", label: "Analytics", desc: "Accuracy, speed and decay trends", icon: LineChart },
  { href: "/groups", label: "Groups", desc: "Class leaderboards and assignments", icon: Users },
  { href: "/projects", label: "Projects", desc: "Build something and add it to your vault", icon: FolderKanban },
  { href: "/resume", label: "Resume", desc: "Printable resume from your proofs", icon: FileText },
  { href: "/library", label: "My library", desc: "Saved topics and notes", icon: BookMarked },
  { href: "/proofs", label: "Proof vault", desc: "Your verified mastery", icon: Award },
  { href: "/settings", label: "Settings", desc: "Goals, career and AI mentor", icon: Settings },
];

type Account = { kind: "user"; name: string; email: string; streak: number } | { kind: "guest"; streak: number };

export default function HeaderClient({ account, signOutAction }: { account: Account; signOutAction: () => Promise<void> }) {
  const pathname = usePathname();
  const t = useT();
  const lang = useLang();
  const [menu, setMenu] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Close menus on navigation (adjusting state during render, per React docs).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenu(null);
    setDrawer(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const groupActive = (items: Item[]) => items.some((i) => active(i.href));
  const initials = account.kind === "user" ? account.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "";

  const navLink = (href: string, label: string, Ic: Icon) => (
    <Link href={href} className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${active(href) ? "bg-surface-2 text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"}`}>
      <Ic className="h-4 w-4" />{label}
    </Link>
  );

  const dropdown = (id: string, label: string, items: Item[], align: "left" | "right" = "left", trigger?: React.ReactNode) => (
    <div className="relative">
      <button
        onClick={() => setMenu(menu === id ? null : id)}
        aria-expanded={menu === id}
        aria-haspopup="menu"
        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${menu === id || groupActive(items) ? "bg-surface-2 text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"}`}
      >
        {trigger ?? label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${menu === id ? "rotate-180" : ""}`} />
      </button>
      {menu === id && (
        <div role="menu" className={`animate-scale-in absolute top-full mt-2 max-h-[72vh] w-80 overflow-y-auto rounded-2xl border border-line bg-surface p-2 shadow-pop ${align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"}`}>
          {items.map(({ href, label: itemLabel, desc, icon: Ic }) => (
            <Link key={href} href={href} role="menuitem"
              className={`group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-2 ${active(href) ? "bg-surface-2" : ""}`}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors group-hover:border-brand/30 group-hover:text-brand">
                <Ic className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">{itemLabel}</span>
                <span className="block text-xs text-muted">{desc}</span>
              </span>
            </Link>
          ))}
          {id === "you" && (
            <form action={signOutAction} className="mt-1 border-t border-line pt-1">
              <button className="flex w-full items-center gap-3 rounded-xl p-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-bad">
                <span className="flex h-9 w-9 items-center justify-center"><LogOut className="h-4 w-4" /></span>Sign out
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );

  const langToggle = (
    <button onClick={() => setLang(lang === "en" ? "hi" : "en")} className="btn-ghost h-9 px-2 text-xs font-semibold" title="Interface language" aria-label="Switch language">
      <Languages className="h-4 w-4" />{lang === "en" ? "हि" : "EN"}
    </button>
  );

  return (
    <header className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-200 ${scrolled ? "border-line bg-surface/80 shadow-sm backdrop-blur-xl" : "border-transparent bg-bg/60 backdrop-blur"}`}>
      <div ref={navRef} className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link href="/" className="mr-3 flex items-center gap-2 font-semibold tracking-tight text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent text-sm font-bold text-white shadow-sm">S</span>
          <span className="hidden sm:inline">SkillSetu</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {navLink("/dashboard", t("nav.dashboard"), LayoutDashboard)}
          {dropdown("explore", t("nav.explore"), EXPLORE)}
          {dropdown("practice", t("nav.practice"), PRACTICE)}
          {navLink("/mentor", t("nav.mentor"), Sparkles)}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={openCommandPalette} className="hidden h-9 items-center gap-2 rounded-xl border border-line bg-surface pl-3 pr-1.5 text-sm text-subtle shadow-sm transition-colors hover:border-line-strong hover:text-muted md:flex">
            <Search className="h-4 w-4" />
            <span className="w-28 text-left lg:w-36">{t("nav.search")}</span>
            <span className="kbd">Ctrl K</span>
          </button>
          <button onClick={openCommandPalette} className="btn-ghost h-9 w-9 p-0 md:hidden" aria-label="Search"><Search className="h-4 w-4" /></button>

          {account.streak > 0 && (
            <span className="hidden h-9 items-center gap-1 rounded-xl px-2.5 text-sm font-semibold text-warn sm:flex" title={`${account.streak}-day streak`}>
              <Flame className="h-4 w-4" />{account.streak}
            </span>
          )}
          <div className="hidden lg:block">{langToggle}</div>
          <ThemeToggle />

          <div className="hidden lg:block">
            {account.kind === "user" ? (
              dropdown("you", "Account", YOU, "right",
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">{initials || "U"}</span>)
            ) : (
              <div className="flex items-center gap-1.5 pl-1">
                <Link href="/login" className="btn-ghost h-9">{t("auth.login")}</Link>
                <Link href="/signup" className="btn-primary h-9">{t("auth.start")}</Link>
              </div>
            )}
          </div>

          <button className="btn-ghost h-9 w-9 p-0 lg:hidden" aria-label={t("nav.menu")} aria-expanded={drawer} onClick={() => setDrawer((d) => !d)}>
            {drawer ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {drawer && (
        <div className="animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-surface lg:hidden">
          <div className="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              {langToggle}
            </div>
            {([
              ["", [{ href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard }, { href: "/mentor", label: t("nav.mentor"), icon: Sparkles }]],
              [t("nav.explore"), EXPLORE], [t("nav.practice"), PRACTICE], ["Account", YOU],
            ] as const).map(([title, items]) => (
              <div key={title || "main"}>
                {title && <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-subtle">{title}</div>}
                <div className="grid grid-cols-2 gap-1">
                  {items.map(({ href, label, icon: Ic }) => (
                    <Link key={href} href={href} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium ${active(href) ? "bg-surface-2 text-ink" : "text-muted hover:bg-surface-2"}`}>
                      <Ic className="h-4 w-4" />{label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-2 border-t border-line pt-4">
              {account.kind === "user" ? (
                <form action={signOutAction} className="w-full"><button className="btn-secondary w-full"><LogOut className="h-4 w-4" />Sign out</button></form>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary flex-1">{t("auth.login")}</Link>
                  <Link href="/signup" className="btn-primary flex-1">{t("auth.start")}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <CommandPalette />
    </header>
  );
}
