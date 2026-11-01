"use client";
// The learner's mentor preference lives only in this browser (localStorage).
// The API key is sent with each mentor request and never stored on the server.

import { useSyncExternalStore } from "react";
import type { MentorPrefs } from "./ai";

const STORAGE_KEY = "skillsetu.mentor";
const DEFAULT: MentorPrefs = { mode: "default" };
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedValue: MentorPrefs = DEFAULT;

function read(): MentorPrefs {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return DEFAULT; // storage blocked (private mode etc.)
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    cachedValue =
      parsed && (parsed.mode === "offline" || parsed.mode === "apikey")
        ? { mode: parsed.mode, apiKey: typeof parsed.apiKey === "string" ? parsed.apiKey : undefined }
        : DEFAULT;
  } catch {
    cachedValue = DEFAULT;
  }
  return cachedValue;
}

export function saveMentorPrefs(prefs: MentorPrefs) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore: the setting just won't persist in this browser.
  }
  listeners.forEach((l) => l());
}

export function clearMentorPrefs() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && listener();
  window.addEventListener("storage", onStorage); // sync across tabs
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useMentorPrefs(): MentorPrefs {
  return useSyncExternalStore(subscribe, read, () => DEFAULT);
}

export function maskKey(key: string) {
  return key.length > 14 ? `${key.slice(0, 10)}…${key.slice(-4)}` : "••••";
}
