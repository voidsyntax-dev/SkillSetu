"use client";
// Interface language (English / Hindi). Covers navigation and sign-in for now;
// concept content stays in English.

import { useSyncExternalStore } from "react";

export type Lang = "en" | "hi";
const KEY = "skillsetu.lang";

const DICT: Record<Lang, Record<string, string>> = {
  en: {
    "nav.dashboard": "Dashboard", "nav.explore": "Explore", "nav.practice": "Practice", "nav.mentor": "AI Mentor",
    "nav.search": "Search…", "auth.login": "Log in", "auth.start": "Get started", "nav.menu": "Menu",
  },
  hi: {
    "nav.dashboard": "डैशबोर्ड", "nav.explore": "खोजें", "nav.practice": "अभ्यास", "nav.mentor": "AI मेंटर",
    "nav.search": "खोजें…", "auth.login": "लॉग इन", "auth.start": "शुरू करें", "nav.menu": "मेनू",
  },
};

const listeners = new Set<() => void>();

function read(): Lang {
  try {
    return localStorage.getItem(KEY) === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

export function setLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, read, () => "en" as Lang);
}

export function useT() {
  const lang = useLang();
  return (key: string) => DICT[lang][key] ?? DICT.en[key] ?? key;
}
