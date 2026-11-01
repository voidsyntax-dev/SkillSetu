"use client";

import { useState, useTransition } from "react";
import { testApiKey } from "@/lib/actions";
import { clearMentorPrefs, maskKey, saveMentorPrefs, useMentorPrefs } from "@/lib/mentorSettings";

export default function MentorSettings({ serverKey }: { serverKey: boolean }) {
  const prefs = useMentorPrefs();
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, start] = useTransition();

  const mode = prefs.mode === "default" ? (serverKey ? "default" : "offline") : prefs.mode;
  const savedKey = prefs.apiKey;

  const choose = (m: "offline" | "apikey") => {
    setStatus(null);
    saveMentorPrefs({ mode: m, apiKey: savedKey });
  };

  const saveKey = () => {
    const key = draft.trim();
    start(async () => {
      const result = await testApiKey(key);
      setStatus(result);
      if (result.ok) {
        saveMentorPrefs({ mode: "apikey", apiKey: key });
        setDraft("");
      }
    });
  };

  const removeKey = () => {
    clearMentorPrefs();
    setDraft("");
    setStatus({ ok: true, message: "Key removed from this browser." });
  };

  const option = (value: "offline" | "apikey", title: string, text: string) => (
    <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${mode === value ? "border-brand bg-brand-soft" : "border-line hover:bg-surface-2"}`}>
      <input type="radio" name="mentor-mode" className="mt-1 accent-[var(--brand)]" checked={mode === value} onChange={() => choose(value)} />
      <span>
        <span className="block font-semibold text-ink">{title}</span>
        <span className="block text-sm text-muted">{text}</span>
      </span>
    </label>
  );

  return (
    <section className="card mt-6 space-y-4 p-6">
      <div>
        <h2 className="h2">AI mentor</h2>
        <p className="mt-1 text-sm text-muted">Choose how the mentor answers explanations, doubts, career suggestions and gap analysis.</p>
      </div>

      {mode === "default" && (
        <p className="rounded-lg bg-surface-2 p-3 text-sm text-muted">Currently using this server&apos;s Claude key. Pick an option below to override it.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {option("offline", "Offline mentor", "Free and instant. Answers come from SkillSetu's own concepts and roadmaps.")}
        {option("apikey", "My Anthropic API key", "Full Claude answers to any doubt. Uses your own key and credit.")}
      </div>

      {mode === "apikey" && (
        <div className="space-y-3 rounded-xl border border-line p-4">
          {savedKey ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm">
                <span className="text-muted">Saved key: </span>
                <code className="rounded bg-surface-2 px-1.5 py-0.5 text-ink">{maskKey(savedKey)}</code>
              </div>
              <button className="btn-ghost text-bad" onClick={removeKey}>Remove key</button>
            </div>
          ) : (
            <p className="text-sm text-warn">No key saved yet — the mentor will use offline answers until you add one.</p>
          )}
          <div>
            <label className="label" htmlFor="api-key">{savedKey ? "Replace key" : "API key"}</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input id="api-key" type="password" className="input font-mono" placeholder="sk-ant-..." value={draft}
                onChange={(e) => setDraft(e.target.value)} autoComplete="off" spellCheck={false} />
              <button className="btn-primary shrink-0" onClick={saveKey} disabled={pending || !draft.trim()}>
                {pending ? "Testing…" : "Test & save"}
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">
              Get a key at console.anthropic.com → API Keys. It is stored only in this browser and sent with each mentor
              request; SkillSetu never saves it on the server. Testing a key is free.
            </p>
          </div>
        </div>
      )}

      {status && <p className={`text-sm ${status.ok ? "text-good" : "text-bad"}`} role="status">{status.message}</p>}
    </section>
  );
}
