import { Disclaimer } from "@/components/disclaimer";
import { getMetrics } from "@/lib/db";
import { getRuntimeBindings } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const bindings = await getRuntimeBindings();
  const metrics = await getMetrics(bindings.DB);
  const maximum = Math.max(...metrics.categories.map((item) => item.count), 1);
  const cards = [
    ["Tickets analyzed", metrics.ticketsAnalyzed],
    ["Suggested escalations", metrics.suggestedEscalations],
    ["Approved drafts", metrics.approvedDrafts],
    ["Edited drafts", metrics.editedDrafts],
    ["Incorrect suggestions", metrics.incorrectSuggestions],
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#305b9d]">Demo analytics</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Human Review Dashboard</h1>
          <p className="mt-2 text-slate-600">Usage statistics saved from demonstration analyses and feedback actions.</p>
        </div>
        <div className="md:max-w-md"><Disclaimer /></div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(([label, value]) => (
          <div className="card p-5" key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-4 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <section className="card mt-6 p-6">
        <h2 className="text-lg font-semibold">Analyzed Ticket Categories</h2>
        {metrics.categories.length ? (
          <div className="mt-6 space-y-4">
            {metrics.categories.map((item) => (
              <div key={item.category}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{item.category}</span><span className="text-slate-500">{item.count}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div className="h-2.5 rounded-full bg-[#305b9d]" style={{ width: `${(item.count / maximum) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            No persisted demo analyses yet. Analyze a fictional ticket with D1 connected to populate these statistics.
          </div>
        )}
      </section>
    </main>
  );
}
