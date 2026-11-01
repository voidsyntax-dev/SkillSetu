"use client";
// Light / dark / system theme. The preference lives in localStorage; the
// resolved theme is applied as <html data-theme> (also set by an inline
// script in the layout before paint, so there is no flash).

import { useSyncExternalStore } from "react";
import { THEME_KEY } from "./theme-script";

export type ThemePref = "light" | "dark" | "system";

const listeners = new Set<() => void>();

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(pref: ThemePref) {
  const dark = pref === "dark" || (pref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function setThemePref(pref: ThemePref) {
  try {
    if (pref === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch {}
  applyTheme(pref);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const mq = matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => {
    if (readPref() === "system") applyTheme("system");
  };
  mq.addEventListener("change", onSystem);
  return () => {
    listeners.delete(listener);
    mq.removeEventListener("change", onSystem);
  };
}

export function useThemePref(): ThemePref {
  return useSyncExternalStore(subscribe, readPref, () => "system");
}
