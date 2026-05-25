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
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
        <div>
          <p className="eyebrow">Signals / demo usage</p>
          <h1 className="display mt-4 text-5xl">Review ledger</h1>
          <p className="mt-4 max-w-md leading-7 text-[#68716c]">Demonstration events from grounded analyses and human decisions.</p>
        </div>
        <Disclaimer />
      </div>

      <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(([label, value]) => (
          <div className="card p-6" key={label}>
            <p className="eyebrow">{label}</p>
            <p className="metric-value mt-7">{value}</p>
          </div>
        ))}
      </div>

      <section className="card mt-6 p-7">
        <p className="eyebrow">Distribution</p>
        <h2 className="display mt-3 text-3xl">Analyzed categories</h2>
        {metrics.categories.length ? (
          <div className="mt-6 space-y-4">
            {metrics.categories.map((item) => (
              <div key={item.category}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{item.category}</span><span className="text-[#68716c]">{item.count}</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#eee9de]">
                  <div className="h-2.5 rounded-full bg-[#15715f]" style={{ width: `${(item.count / maximum) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-[#f0ece3] p-8 text-center text-sm text-[#68716c]">
            No persisted demo analyses yet. Analyze a fictional ticket with D1 connected to populate these statistics.
          </div>
        )}
      </section>
    </main>
  );
}
