import type { RecommendedAction } from "@/lib/types";

const styles: Record<RecommendedAction, string> = {
  "Resolve in Support": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Request More Information": "bg-amber-50 text-amber-700 border-amber-100",
  "Escalate to Engineering": "bg-red-50 text-red-700 border-red-100",
};

export function DecisionCard({
  action,
  reason,
}: {
  action: RecommendedAction;
  reason: string;
}) {
  return (
    <section className="card overflow-hidden" aria-label="Escalation decision">
      <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
        <p className="text-sm font-medium text-slate-700">Recommended action</p>
      </div>
      <div className="p-6">
        <div className={`inline-flex rounded-lg border px-3 py-2 text-sm font-medium ${styles[action]}`}>{action}</div>
        {action === "Escalate to Engineering" && reason ? <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">{reason}</p> : null}
      </div>
    </section>
  );
}
