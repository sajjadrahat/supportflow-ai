"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { href: "/demo", label: "Tickets", icon: "M3 5.5h18M3 12h18M3 18.5h18" },
  { href: "/dashboard", label: "Analytics", icon: "M4 20V10m6 10V4m6 16v-7m5 7H3" },
  { href: "/about", label: "Architecture", icon: "M12 8v4m0 4h.01M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" },
];

function isActive(pathname: string, href: string) {
  if (href === "/demo") return pathname.startsWith("/demo");
  return pathname.startsWith(href);
}

export function ConsoleShell({
  children,
  title,
  description,
  action,
}: {
  children: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[236px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="px-3 pt-2 text-xs font-medium uppercase tracking-wider text-slate-400">Workspace</p>
            <nav className="mt-4 space-y-1" aria-label="Demo workspace">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive(pathname, item.href)
                      ? "bg-[#eaf5ff] text-[#0574d4]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-7 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Protected demo
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Sample tickets only. Stored analyses are reused to limit AI spend.
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <nav className="mb-5 flex gap-2 overflow-x-auto lg:hidden" aria-label="Demo workspace mobile">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium ${
                  isActive(pathname, item.href)
                    ? "border-[#d5ebff] bg-[#eaf5ff] text-[#0574d4]"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-[#2193f8]">SecureDesk demo</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
              <p className="mt-2 text-sm text-slate-500">{description}</p>
            </div>
            {action}
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
