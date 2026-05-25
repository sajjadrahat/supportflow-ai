import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import { ConsoleShell } from "@/components/console-shell";

const stack = [
  "Next.js and TypeScript",
  "Tailwind CSS",
  "Cloudflare Workers and D1",
  "OpenAI structured responses",
];

const controls = [
  "Only seeded fictional tickets can be analyzed.",
  "API keys are stored as Cloudflare secrets and never exposed to the browser.",
  "Saved analyses are reused instead of repeatedly calling the model.",
  "Cloudflare rate limits protect public analysis and feedback requests.",
];

export default function AboutPage() {
  return (
    <ConsoleShell
      title="Architecture and safety"
      description="How the portfolio demo uses grounded AI assistance responsibly."
      action={<div className="max-w-md"><Disclaimer /></div>}
    >

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card p-7 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-950">The problem this demonstrates</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Support specialists turn incomplete issue reports into categories, troubleshooting steps and actionable handoffs. This application demonstrates how AI can prepare those decisions from fictional SecureDesk documentation without automatically sending or resolving anything.
          </p>
        </section>

        <section className="card p-7">
          <h2 className="text-lg font-semibold text-slate-950">Technology stack</h2>
          <ul className="mt-5 space-y-3">
            {stack.map((item) => (
              <li className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700" key={item}>
                <span className="h-2 w-2 rounded-full bg-[#2193f8]" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-7">
          <h2 className="text-lg font-semibold text-slate-950">Safety and cost controls</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            {controls.map((control) => (
              <li className="flex gap-3" key={control}>
                <svg className="mt-1 h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {control}
              </li>
            ))}
          </ul>
        </section>

        <section className="card flex flex-col justify-between gap-6 p-7 lg:col-span-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Privacy statement</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              All tickets, people, companies and knowledge content shown in this application are fictional sample data created for demonstration.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/demo" className="btn-primary">Open demo</Link>
            <a href="https://github.com/sajjadrahat/supportflow-ai" rel="noreferrer" target="_blank" className="btn-secondary">GitHub</a>
          </div>
        </section>
      </div>
    </ConsoleShell>
  );
}
