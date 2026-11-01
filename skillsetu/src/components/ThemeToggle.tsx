"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { setThemePref, useThemePref, type ThemePref } from "@/lib/theme";

const NEXT: Record<ThemePref, ThemePref> = { system: "light", light: "dark", dark: "system" };
const LABEL: Record<ThemePref, string> = { system: "System theme", light: "Light theme", dark: "Dark theme" };

export default function ThemeToggle() {
  const pref = useThemePref();
  const Icon = pref === "light" ? Sun : pref === "dark" ? Moon : Monitor;
  return (
    <button
      className="btn-ghost h-9 w-9 p-0"
      onClick={() => setThemePref(NEXT[pref])}
      aria-label={`${LABEL[pref]} — click to change`}
      title={`${LABEL[pref]} (click to change)`}
    >
      <Icon key={pref} className="animate-scale-in h-4 w-4" />
    </button>
  );
}
