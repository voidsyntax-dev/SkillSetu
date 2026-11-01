import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "./db";
import type { SessionUser } from "@/types";

// Lightweight signed-cookie sessions. Every visitor can practise as a guest;
// signing up attaches an email + password to the same user record.

const COOKIE = "skillsetu_session";
const MAX_AGE = 60 * 60 * 24 * 365;

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET must be set in production");
  return s || "skillsetu-dev-secret";
}

function sign(userId: string): string {
  const mac = createHmac("sha256", secret()).update(userId).digest("base64url");
  return `${userId}.${mac}`;
}

function verify(token: string | undefined): string | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const userId = token.slice(0, dot);
  const expected = Buffer.from(sign(userId));
  const actual = Buffer.from(token);
  return expected.length === actual.length && timingSafeEqual(expected, actual) ? userId : null;
}

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  return verify(store.get(COOKIE)?.value);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const id = await getSessionUserId();
  if (!id) return null;
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) return null;
  return {
    id: u.id, name: u.name, email: u.email, isGuest: u.isGuest,
    branchId: u.branchId, targetCareerId: u.targetCareerId, dailyGoal: u.dailyGoal,
    currentStreak: u.currentStreak, longestStreak: u.longestStreak, onboarded: u.onboarded, streakFreezes: u.streakFreezes,
  };
}

/** Writes the session cookie. Only callable from server actions / route handlers. */
export async function setSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE, sign(userId), { httpOnly: true, sameSite: "lax", path: "/", maxAge: MAX_AGE, secure: process.env.NODE_ENV === "production" });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Returns the current user id, creating a guest user if needed. Server actions only. */
export async function ensureUserId(): Promise<string> {
  const id = await getSessionUserId();
  if (id && (await prisma.user.findUnique({ where: { id }, select: { id: true } }))) return id;
  const user = await prisma.user.create({ data: {} });
  await setSession(user.id);
  return user.id;
}
