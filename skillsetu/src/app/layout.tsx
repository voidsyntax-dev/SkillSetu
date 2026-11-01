import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";
import SWRegister from "@/components/SWRegister";
import { THEME_BOOT_SCRIPT } from "@/lib/theme-script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "SkillSetu — Master the skills engineering careers need", template: "%s · SkillSetu" },
  description: "Career-first skill mastery for engineering students: branches, subjects, subskills, adaptive practice, flashcards, mock tests, decay tracking and career fit.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c11" },
  ],
};

const FOOTER = [
  ["Learn", [["Branches", "/branches"], ["Careers", "/careers"], ["Skills", "/skills"], ["Internships", "/internships"]]],
  ["Practice", [["Daily review", "/review"], ["Flashcards", "/flashcards"], ["Mock tests", "/test"], ["Mistake book", "/mistakes"]]],
  ["You", [["Dashboard", "/dashboard"], ["Library", "/library"], ["Proof vault", "/proofs"], ["Settings", "/settings"]]],
] as const;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <SWRegister />
        <footer className="mt-16 border-t border-line bg-surface">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-5">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">S</span>
                SkillSetu
              </Link>
              <p className="mt-3 max-w-xs text-sm text-muted">Career-first skill mastery for engineering students. Maps the path, masters the skill.</p>
            </div>
            {FOOTER.map(([title, links]) => (
              <div key={title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-subtle">{title}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {links.map(([label, href]) => (
                    <li key={href}><Link href={href} className="text-muted transition-colors hover:text-ink">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </footer>
      </body>
    </html>
  );
}
