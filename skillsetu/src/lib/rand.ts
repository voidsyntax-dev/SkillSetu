// Seeded randomness shared by server and client. The same seed always gives the
// same sequence, so the server can rebuild a problem or quiz later without storing it.

export type Rand = (lo: number, hi: number, step?: number) => number;

export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function makeRand(seed: number): Rand {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return (lo, hi, step = 1) => lo + step * Math.floor(next() * ((hi - lo) / step + 1));
}

export function shuffle<T>(items: T[], seed: number): T[] {
  const r = makeRand(seed);
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = r(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
