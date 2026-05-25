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
        <header className="bg-[#10252b] text-[#f8f3e8]">
          <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-white/10 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#aebbb5] lg:px-8">
            <span>SecureDesk sample environment</span>
            <a className="hidden text-[#d6e8e1] hover:text-white sm:block" href="https://supportflow.sajjadrahat.com">supportflow.sajjadrahat.com</a>
          </div>
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8" aria-label="Primary navigation">
            <Link href="/" className="flex items-center gap-3 font-semibold">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#497167] text-xs font-bold tracking-widest text-[#a5dacb]">SF</span>
              <span><span className="block text-base">SupportFlow</span><span className="block text-[10px] font-medium uppercase tracking-[0.27em] text-[#8fa59f]">AI console</span></span>
            </Link>
            <div className="flex items-center gap-2 text-sm font-medium text-[#b9c6c1] sm:gap-7">
              <Link className="hidden hover:text-white sm:inline" href="/demo">Inbox</Link>
              <Link className="hidden hover:text-white sm:inline" href="/dashboard">Signals</Link>
              <Link className="hidden hover:text-white sm:inline" href="/about">System</Link>
              <Link className="rounded-full bg-[#e8eee8] px-4 py-2.5 text-[#10252b] hover:bg-white" href="/demo">Open console</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="mt-12 border-t bg-[#10252b] text-[#aebbb5]">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-9 text-sm sm:flex-row lg:px-8">
            <p><span className="text-[#f8f3e8]">SupportFlow AI</span> / Designed and built by Sajjad M. Rahat</p>
            <div className="flex gap-5">
              <a className="hover:text-white" href="https://supportflow.sajjadrahat.com">Live site</a>
              <a className="hover:text-white" href="https://github.com/sajjadrahat/supportflow-ai" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
