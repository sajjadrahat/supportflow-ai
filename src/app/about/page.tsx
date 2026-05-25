import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";

const stack = ["Next.js + React + TypeScript", "Tailwind CSS", "Cloudflare Workers with OpenNext", "Cloudflare D1", "OpenAI Responses API with structured output"];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#305b9d]">About the project</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">SupportFlow AI</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
        A public portfolio demonstration built by <strong className="font-semibold text-slate-900">Sajjad M. Rahat</strong> to explore how support teams can prepare reliable responses faster while keeping decisions with people.
      </p>
      <div className="mt-8"><Disclaimer /></div>

      <div className="mt-10 space-y-8">
        <section className="card p-6">
          <h2 className="text-xl font-semibold">The Support Problem</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Support specialists regularly translate incomplete customer reports into categories, troubleshooting steps and actionable engineering handoffs. This demo shows a constrained workflow for doing that with fictional SecureDesk tickets.
          </p>
        </section>
        <section className="card p-6">
          <h2 className="text-xl font-semibold">Responsible AI and Human Review</h2>
          <p className="mt-3 leading-7 text-slate-600">
            The model receives only a selected seeded ticket and retrieved knowledge articles. Prompts direct it not to invent procedures outside that supplied documentation. Drafts and escalation recommendations are clearly labeled suggestions, editable by a support specialist and never sent automatically.
          </p>
        </section>
        <section className="grid gap-5 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Technology Stack</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {stack.map((item) => <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">{item}</li>)}
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Safety Choices</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>Only seeded fictional tickets can be analyzed.</li>
              <li>API keys remain in server-side Cloudflare secrets.</li>
              <li>D1 stores demo analysis and feedback events.</li>
              <li>Requests receive basic rate protection.</li>
            </ul>
          </div>
        </section>
        <section className="card p-6">
          <h2 className="text-xl font-semibold">Privacy Statement</h2>
          <p className="mt-3 leading-7 text-slate-600">
            All names, companies, support messages and knowledge articles in this project are fictional and created specifically for demonstration. The application does not contain or request real customer support data.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/demo" className="rounded-lg bg-[#142c54] px-4 py-2.5 text-sm font-medium text-white">Explore demo</Link>
            <a href="https://github.com/srahat/supportflow-ai" rel="noreferrer" target="_blank" className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-slate-50">GitHub repository</a>
          </div>
        </section>
      </div>
    </main>
  );
}
