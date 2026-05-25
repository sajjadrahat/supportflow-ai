import { Disclaimer } from "@/components/disclaimer";
import { getMetrics } from "@/lib/db";
import { getRuntimeBindings } from "@/lib/runtime";
import { ConsoleShell } from "@/components/console-shell";

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
    <ConsoleShell
      title="Demo analytics"
      description="Stored usage statistics from generated analyses and human feedback."
      action={<div className="max-w-md"><Disclaimer /></div>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value]) => (
          <div className="card p-6" key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="metric-value mt-4 text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <section className="card mt-6 p-7">
        <h2 className="text-lg font-semibold text-slate-950">Ticket categories</h2>
        <p className="mt-1 text-sm text-slate-500">Distribution of persisted demo analyses.</p>
        {metrics.categories.length ? (
          <div className="mt-6 space-y-4">
            {metrics.categories.map((item) => (
              <div key={item.category}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.category}</span><span className="text-slate-500">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-[#2193f8]" style={{ width: `${(item.count / maximum) * 100}%` }} />
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
    </ConsoleShell>
  );
}
