import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";

const steps = [
  ["01", "Read the signal", "Categorize urgency and surface the details still needed."],
  ["02", "Ground the reply", "Match the case to approved SecureDesk sample guidance."],
  ["03", "Decide with context", "Review a reply or create a clear engineering brief."],
];

export default function Home() {
  return (
    <main>
      <section className="rule-grid border-b">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.04fr_0.96fr] lg:px-8 lg:py-24">
        <div>
          <p className="eyebrow mb-6">Support operations / portfolio demonstration</p>
          <h1 className="display max-w-2xl text-[3.2rem] leading-[1.02] text-[#152329] sm:text-[4.8rem]">
            Turn support signals into reviewed action.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#5e6964]">
            A grounded triage console for fictional SecureDesk cases: retrieve documented guidance, prepare a response, and hand off risk with a human still at the controls.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/demo" className="btn-primary">Enter ticket console</Link>
            <a href="#workflow" className="btn-secondary">How it works</a>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-[#d9d3c5] pt-7 text-sm">
            <div><p className="eyebrow">Dataset</p><p className="mt-2 font-medium">8 fictional cases</p></div>
            <div><p className="eyebrow">Grounding</p><p className="mt-2 font-medium">12 knowledge articles</p></div>
            <div><p className="eyebrow">Control</p><p className="mt-2 font-medium">Human approval</p></div>
          </div>
        </div>
        <div className="panel-dark overflow-hidden rounded-[1.75rem] shadow-2xl shadow-[#10252b]/15">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.18em] text-[#9cb1aa]">
            <span>Case intelligence</span><span className="rounded-full bg-[#193c39] px-3 py-1 text-[#8ad1bd]">Review required</span>
          </div>
          <div className="p-6 sm:p-8">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#829993]">SD-1068 / Incoming</p>
              <p className="mt-3 text-xl leading-snug text-[#fbf6eb]">Suspicious training email link received by employees</p>
            </div>
            <span className="pill bg-[#513029] text-[#ffb9a2]">High</span>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/[0.06] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#88aaa1]">Suggested path</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-lg">Security / Phishing</p>
                <p className="text-sm text-[#ffb9a2]">Escalate</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#88aaa1]">Grounded source / 99% match</p>
              <p className="mt-3 text-sm leading-6 text-[#e5e1d7]">Report a Suspected SecureDesk Impersonation Email</p>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#e5efe8] px-5 py-4 text-sm font-medium text-[#16352f]">
              <span>Draft prepared for review</span><span aria-hidden="true">&rarr;</span>
            </div>
          </div>
        </div>
        </div>
        </div>
      </section>

      <section id="workflow" className="bg-[#fffdf8]">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="max-w-sm">
            <p className="eyebrow">Workflow</p>
            <h2 className="display mt-4 text-4xl leading-tight">Evidence before response.</h2>
            <p className="mt-5 leading-7 text-[#68716c]">The assistant does not send anything. It prepares an answer with visible sources for a specialist to accept, change or reject.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(([number, title, description]) => (
              <div key={number} className="border-l border-[#d8d2c4] px-5 py-3">
                <p className="eyebrow">{number}</p>
                <h3 className="mt-8 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#68716c]">{description}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <Disclaimer />
      </section>
    </main>
  );
}
