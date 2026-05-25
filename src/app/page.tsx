import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";

const features = [
  { title: "Grounded retrieval", text: "Responses cite matching SecureDesk knowledge content." },
  { title: "Human approval", text: "No suggestion is sent or escalated automatically." },
  { title: "Cost controlled", text: "Stored analyses are safely reused in the public demo." },
];

export default function Home() {
  return (
    <main>
      <section className="rule-grid border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 text-center lg:px-8 lg:pb-24 lg:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d5ebff] bg-white px-3.5 py-2 text-xs font-medium text-[#0574d4] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#2193f8]" />
            Portfolio demonstration using fictional data
          </span>
          <h1 className="display mx-auto mt-7 max-w-4xl text-4xl leading-[1.08] text-slate-950 sm:text-6xl">
            Support triage, grounded by documentation.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            SupportFlow AI helps a support specialist review sample tickets, retrieve relevant guidance, draft a response and prepare escalations with a human in control.
          </p>
          <div className="mt-9 flex justify-center gap-3">
            <Link href="/demo" className="btn-primary">Try the demo</Link>
            <Link href="/about" className="btn-secondary">View architecture</Link>
          </div>

          <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50 sm:p-3">
            <div className="grid min-h-[430px] overflow-hidden rounded-xl border border-slate-100 bg-slate-50 text-left md:grid-cols-[196px_1fr]">
              <aside className="hidden border-r border-slate-200 bg-white p-4 md:block">
                <div className="flex items-center gap-2 px-2 text-sm font-semibold text-slate-900">
                  <span className="h-7 w-7 rounded-lg bg-[#2193f8]" />
                  SecureDesk
                </div>
                {["Tickets", "Analytics", "Knowledge", "Safety"].map((item, index) => (
                  <div key={item} className={`mt-5 rounded-lg px-3 py-2 text-sm ${index === 0 ? "bg-[#eaf5ff] font-medium text-[#0574d4]" : "text-slate-500"}`}>{item}</div>
                ))}
              </aside>
              <div className="p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-400">SD-1068 / SECURITY REPORT</p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900">Suspicious training email link</h2>
                  </div>
                  <span className="pill bg-red-50 text-red-700">High urgency</span>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Recommended action</p>
                    <p className="mt-3 font-semibold text-slate-900">Escalate to Engineering</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Possible phishing exposure reported by multiple employees.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Retrieved source</p>
                    <p className="mt-3 text-sm font-semibold text-[#0574d4]">Report a Suspected Impersonation Email</p>
                    <p className="mt-2 text-sm text-slate-500">99% match / cited in reply</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">Draft response</p>
                    <span className="pill bg-amber-50 text-amber-700">Review before sending</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <span className="block h-2.5 w-11/12 rounded bg-slate-100" />
                    <span className="block h-2.5 w-full rounded bg-slate-100" />
                    <span className="block h-2.5 w-3/4 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article className="card p-6" key={feature.title}>
              <span className="mb-5 block h-9 w-9 rounded-lg bg-[#eaf5ff] ring-1 ring-[#d5ebff]" />
              <h2 className="font-semibold text-slate-900">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{feature.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Disclaimer />
        </div>
      </section>
    </main>
  );
}
