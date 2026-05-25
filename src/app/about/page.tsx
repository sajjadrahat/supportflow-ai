import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";

const stack = ["Next.js + React + TypeScript", "Tailwind CSS", "Cloudflare Workers with OpenNext", "Cloudflare D1", "OpenAI Responses API with structured output"];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
      <p className="eyebrow">System notes</p>
      <h1 className="display mt-5 text-6xl">Built for careful support.</h1>
      <p className="mt-7 max-w-3xl text-lg leading-8 text-[#59645f]">
        A public portfolio demonstration built by <strong className="font-semibold text-slate-900">Sajjad M. Rahat</strong> to explore how support teams can prepare reliable responses faster while keeping decisions with people.
      </p>
      <div className="mt-8"><Disclaimer /></div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <section className="card p-7 md:col-span-2">
          <p className="eyebrow">Why it exists</p>
          <h2 className="display mt-3 text-3xl">The support problem</h2>
          <p className="mt-4 max-w-3xl leading-7 text-[#59645f]">
            Support specialists regularly translate incomplete customer reports into categories, troubleshooting steps and actionable engineering handoffs. This demo shows a constrained workflow for doing that with fictional SecureDesk tickets.
          </p>
        </section>
        <section className="panel-dark rounded-[1.35rem] p-7 md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#88aaa1]">Responsible AI</p>
          <h2 className="display mt-3 text-3xl">Assist, cite, hand back control.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-[#c2cec9]">
            The model receives only a selected seeded ticket and retrieved knowledge articles. Prompts direct it not to invent procedures outside that supplied documentation. Drafts and escalation recommendations are clearly labeled suggestions, editable by a support specialist and never sent automatically.
          </p>
        </section>
          <div className="card p-7">
            <p className="eyebrow">Foundation</p>
            <h2 className="display mt-3 text-3xl">Technology</h2>
            <ul className="mt-5 space-y-3 text-sm text-[#44514c]">
              {stack.map((item) => <li key={item} className="rounded-xl bg-[#f0ece3] px-4 py-3">{item}</li>)}
            </ul>
          </div>
          <div className="card p-7">
            <p className="eyebrow">Controls</p>
            <h2 className="display mt-3 text-3xl">Safety choices</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-[#59645f]">
              <li>Only seeded fictional tickets can be analyzed.</li>
              <li>API keys remain in server-side Cloudflare secrets.</li>
              <li>Each ticket reuses its stored analysis instead of generating repeatedly.</li>
              <li>Cloudflare rate limits protect analysis and feedback endpoints.</li>
            </ul>
          </div>
        <section className="card p-7 md:col-span-2">
          <p className="eyebrow">Privacy</p>
          <h2 className="display mt-3 text-3xl">Fictional by design</h2>
          <p className="mt-4 leading-7 text-[#59645f]">
            All names, companies, support messages and knowledge articles in this project are fictional and created specifically for demonstration. The application does not contain or request real customer support data.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/demo" className="btn-primary">Explore console</Link>
            <a href="https://github.com/sajjadrahat/supportflow-ai" rel="noreferrer" target="_blank" className="btn-secondary">GitHub repository</a>
            <a href="https://supportflow.sajjadrahat.com" className="btn-secondary">Live deployment</a>
          </div>
        </section>
      </div>
    </main>
  );
}
