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
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Primary navigation">
            <Link href="/" className="flex items-center gap-3 font-semibold text-slate-950">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#142c54] text-sm font-bold text-white">SF</span>
              SupportFlow AI
            </Link>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 sm:gap-6">
              <Link className="hidden hover:text-slate-950 sm:inline" href="/demo">Demo</Link>
              <Link className="hidden hover:text-slate-950 sm:inline" href="/dashboard">Dashboard</Link>
              <Link className="hidden hover:text-slate-950 sm:inline" href="/about">About</Link>
              <Link className="rounded-lg bg-[#142c54] px-4 py-2 text-white hover:bg-[#203e70]" href="/demo">Try Demo</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="border-t bg-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
            <p>SupportFlow AI is a portfolio demonstration built by Sajjad M. Rahat.</p>
            <p>All tickets, customers and documentation are fictional sample data.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
