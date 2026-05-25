import type { RecommendedAction } from "@/lib/types";

const styles: Record<RecommendedAction, string> = {
  "Resolve in Support": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Request More Information": "bg-amber-50 text-amber-800 border-amber-100",
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
    <section className="card p-5" aria-label="Escalation decision">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recommended decision</p>
      <div className={`mt-3 inline-flex rounded-lg border px-3 py-2 text-sm font-semibold ${styles[action]}`}>{action}</div>
      {action === "Escalate to Engineering" && reason ? <p className="mt-3 text-sm leading-6 text-slate-600">{reason}</p> : null}
    </section>
  );
}
