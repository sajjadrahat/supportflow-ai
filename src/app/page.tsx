import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";

const steps = [
  ["01", "Ticket triage", "Analyze the issue, urgency and missing details."],
  ["02", "Grounded retrieval", "Find matching fictional knowledge articles."],
  ["03", "Human-reviewed action", "Edit a draft reply or prepare an escalation."],
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#305b9d]">AI-assisted support workflow</p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Grounded support triage with a human in control.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            SupportFlow AI analyzes fictional tickets, retrieves relevant help content, drafts customer replies and identifies issues that merit engineering escalation.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/demo" className="rounded-lg bg-[#142c54] px-5 py-3 font-medium text-white hover:bg-[#203e70]">Try Demo</Link>
            <a href="#workflow" className="rounded-lg border bg-white px-5 py-3 font-medium text-slate-800 hover:border-slate-400">View Workflow</a>
          </div>
          <p className="mt-8 text-sm text-slate-500">Built by Sajjad M. Rahat for a technical portfolio demonstration.</p>
        </div>
        <div className="card p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Selected ticket</p>
              <p className="mt-1 font-medium">Suspicious training email link</p>
            </div>
            <span className="pill bg-amber-50 text-amber-700">High urgency</span>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">AI TRIAGE SUGGESTION</p>
              <p className="mt-2 text-sm font-medium">Security / Phishing Report</p>
              <p className="mt-1 text-sm text-slate-600">Escalate to Engineering</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-xs font-semibold text-slate-500">RETRIEVED DOCUMENT</p>
              <p className="mt-2 text-sm font-medium">Report a Suspected SecureDesk Impersonation Email</p>
              <p className="mt-2 text-xs text-slate-500">Source cited in drafted response and handoff</p>
            </div>
            <div className="rounded-lg bg-[#142c54] px-4 py-3 text-sm text-white">
              AI draft - review before sending
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="border-y bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-slate-950">From incoming ticket to reviewed response</h2>
            <p className="mt-3 text-slate-600">A focused workflow showing retrieval-grounded assistance, without automatic sending or unverified procedures.</p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {steps.map(([number, title, description]) => (
              <div key={number} className="card p-6">
                <p className="text-sm font-semibold text-[#305b9d]">{number}</p>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <Disclaimer />
      </section>
    </main>
  );
}
