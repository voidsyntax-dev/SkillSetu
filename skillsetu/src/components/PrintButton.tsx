"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button className="btn-secondary print:hidden" onClick={() => window.print()}>
      <Printer className="h-4 w-4" />{label}
    </button>
  );
}
