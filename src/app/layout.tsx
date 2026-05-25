import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupportFlow AI | Support triage demonstration",
  description: "An AI-assisted support triage and escalation portfolio demo using fictional SecureDesk data.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Primary navigation">
            <Link href="/" className="flex items-center gap-3 font-semibold text-slate-950">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white">SF</span>
              <span className="text-[15px] tracking-tight">SupportFlow <span className="font-normal text-slate-400">AI</span></span>
            </Link>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 sm:gap-7">
              <Link className="hidden hover:text-slate-950 sm:inline" href="/demo">Demo</Link>
              <Link className="hidden hover:text-slate-950 sm:inline" href="/dashboard">Analytics</Link>
              <Link className="hidden hover:text-slate-950 sm:inline" href="/about">About</Link>
              <Link className="btn-primary !py-2.5" href="/demo">Try demo</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="mt-16 border-t border-slate-200 bg-white text-slate-500">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-8 text-sm sm:flex-row lg:px-8">
            <p><span className="font-medium text-slate-800">SupportFlow AI</span> / Built by Sajjad M. Rahat</p>
            <div className="flex gap-5">
              <a className="hover:text-slate-950" href="https://supportflow.sajjadrahat.com">Live site</a>
              <a className="hover:text-slate-950" href="https://github.com/sajjadrahat/supportflow-ai" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
