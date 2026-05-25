import type { RecommendedAction } from "@/lib/types";

const styles: Record<RecommendedAction, string> = {
  "Resolve in Support": "bg-[#def1e9] text-[#155b4e] border-[#badbce]",
  "Request More Information": "bg-[#efe7d4] text-[#80601e] border-[#ddcd9f]",
  "Escalate to Engineering": "bg-[#f6e1d9] text-[#8c3624] border-[#efc0b2]",
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
      <div className="border-b bg-[#f0ece3] px-6 py-4">
        <p className="eyebrow">Decision gate</p>
      </div>
      <div className="p-6">
        <div className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${styles[action]}`}>{action}</div>
        {action === "Escalate to Engineering" && reason ? <p className="mt-4 max-w-xl text-sm leading-7 text-[#59645f]">{reason}</p> : null}
      </div>
    </section>
  );
}
