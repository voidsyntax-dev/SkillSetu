"use client";

import { useActionState, useState } from "react";
import { updatePreferences } from "@/lib/actions";

interface Option { id: string; name: string; branchId?: string }

export default function SettingsForm({
  initial, branches, careers,
}: {
  initial: { name: string; branchId: string; targetCareerId: string; dailyGoal: number };
  branches: Option[];
  careers: Option[];
}) {
  const [state, action, pending] = useActionState(updatePreferences, null);
  const [branchId, setBranchId] = useState(initial.branchId);
  const visibleCareers = branchId ? careers.filter((c) => c.branchId === branchId) : careers;

  return (
    <form action={action} className="card space-y-5 p-6">
      <div>
        <label className="label" htmlFor="name">Display name</label>
        <input id="name" name="name" className="input" defaultValue={initial.name} maxLength={60} />
      </div>
      <div>
        <label className="label" htmlFor="branchId">Engineering branch</label>
        <select id="branchId" name="branchId" className="input" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
          <option value="">Not set</option>
          {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="targetCareerId">Target career</label>
        <select id="targetCareerId" name="targetCareerId" className="input" defaultValue={initial.targetCareerId} key={branchId}>
          <option value="">Not set</option>
          {visibleCareers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <p className="mt-1 text-xs text-muted">Drives your daily plan, gap analysis and dashboard.</p>
      </div>
      <div>
        <label className="label" htmlFor="dailyGoal">Daily goal (questions)</label>
        <input id="dailyGoal" name="dailyGoal" type="number" min={1} max={100} className="input w-32" defaultValue={initial.dailyGoal} />
      </div>
      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={pending}>{pending ? "Saving…" : "Save preferences"}</button>
        {state?.message && <span className={`text-sm ${state.ok ? "text-good" : "text-bad"}`}>{state.message}</span>}
      </div>
    </form>
  );
}
