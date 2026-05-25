import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/data/seed";

export default async function KnowledgePage({ params }: { params: Promise<{ id: string }> }) {
  const article = getArticle((await params).id);
  if (!article) notFound();

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
      <Link href="/demo" className="text-sm font-medium text-[#305b9d] hover:underline">&larr; Demo inbox</Link>
      <article className="card mt-6 p-6 sm:p-9">
        <div className="flex flex-wrap justify-between gap-3">
          <span className="pill bg-blue-50 text-blue-700">{article.category}</span>
          <span className="text-sm text-slate-500">Updated {article.lastUpdated}</span>
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">{article.title}</h1>
        <p className="mt-5 leading-7 text-slate-700">{article.content}</p>
        <h2 className="mt-8 text-lg font-semibold">Troubleshooting Steps</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-700">
          {article.troubleshootingSteps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <h2 className="mt-8 text-lg font-semibold">Escalation Criteria</h2>
        <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{article.escalationCriteria}</p>
        <p className="mt-8 border-t pt-5 text-xs text-slate-500">Fictional SecureDesk knowledge-base content created for this portfolio demonstration.</p>
      </article>
    </main>
  );
}
