import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/data/seed";
import { ConsoleShell } from "@/components/console-shell";

export default async function KnowledgePage({ params }: { params: Promise<{ id: string }> }) {
  const article = getArticle((await params).id);
  if (!article) notFound();

  return (
    <ConsoleShell
      title="Knowledge article"
      description="Documentation content supplied as retrieval context for AI suggestions."
      action={<Link href="/demo" className="btn-secondary">&larr; Tickets</Link>}
    >
      <article className="card max-w-3xl overflow-hidden">
        <div className="border-b border-slate-200 p-7 sm:p-9">
        <div className="flex flex-wrap justify-between gap-3">
          <span className="pill bg-[#eaf5ff] text-[#0574d4]">{article.category}</span>
          <span className="text-sm text-slate-500">Updated {article.lastUpdated}</span>
        </div>
        <h2 className="mt-7 text-2xl font-semibold tracking-tight text-slate-950">{article.title}</h2>
        </div>
        <div className="p-7 sm:p-10">
        <p className="leading-7 text-slate-600">{article.content}</p>
        <h3 className="mt-9 text-lg font-semibold text-slate-950">Troubleshooting steps</h3>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-600">
          {article.troubleshootingSteps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <h3 className="mt-9 text-lg font-semibold text-slate-950">Escalation criteria</h3>
        <p className="mt-4 rounded-xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">{article.escalationCriteria}</p>
        <p className="mt-9 border-t pt-5 text-xs text-slate-500">Fictional SecureDesk knowledge-base content created for this portfolio demonstration.</p>
        </div>
      </article>
    </ConsoleShell>
  );
}
