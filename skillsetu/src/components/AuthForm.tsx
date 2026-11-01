"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp } from "@/lib/actions";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, action, pending] = useActionState(mode === "login" ? signIn : signUp, null);
  const isSignup = mode === "signup";

  return (
    <form action={action} className="card space-y-4 p-6 sm:p-8">
      <h1 className="h2 text-center">{isSignup ? "Create your account" : "Welcome back"}</h1>
      <p className="text-center text-sm text-muted">
        {isSignup ? "Your guest progress will be saved to the new account." : "Log in to continue where you left off."}
      </p>
      {isSignup && (
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" name="name" className="input" required autoComplete="name" />
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="input" required autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="input" required minLength={isSignup ? 8 : undefined}
          autoComplete={isSignup ? "new-password" : "current-password"} />
        {isSignup && <p className="mt-1 text-xs text-muted">At least 8 characters.</p>}
      </div>
      {state?.error && <p className="rounded-lg bg-bad-soft p-3 text-sm text-bad" role="alert">{state.error}</p>}
      <button className="btn-primary w-full py-2.5" disabled={pending}>
        {pending ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
      </button>
      <p className="text-center text-sm text-muted">
        {isSignup ? <>Already have an account? <Link href="/login" className="font-semibold text-brand">Log in</Link></>
          : <>New here? <Link href="/signup" className="font-semibold text-brand">Create an account</Link></>}
      </p>
    </form>
  );
}
