import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="animate-float flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand" aria-hidden><Compass className="h-8 w-8" /></div>
      <h1 className="h1 mt-4">Page not found</h1>
      <p className="mt-2 text-muted">That path isn&apos;t on the map. Try exploring from a branch or searching for a topic.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/branches" className="btn-primary">Browse branches</Link>
        <Link href="/search" className="btn-secondary">Search</Link>
      </div>
    </div>
  );
}
