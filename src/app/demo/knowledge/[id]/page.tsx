import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/data/seed";

export default async function KnowledgePage({ params }: { params: Promise<{ id: string }> }) {
  const article = getArticle((await params).id);
  if (!article) notFound();

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <Link href="/demo" className="text-sm font-semibold text-[#15715f] hover:underline">&larr; Return to queue</Link>
      <article className="card mt-7 overflow-hidden">
        <div className="panel-dark p-7 sm:p-10">
        <div className="flex flex-wrap justify-between gap-3">
          <span className="pill bg-[#193c39] text-[#8ad1bd]">{article.category}</span>
          <span className="text-sm text-[#9eb2ac]">Updated {article.lastUpdated}</span>
        </div>
        <p className="mt-9 text-xs uppercase tracking-[0.2em] text-[#88aaa1]">Knowledge source</p>
        <h1 className="display mt-4 text-4xl leading-tight">{article.title}</h1>
        </div>
        <div className="p-7 sm:p-10">
        <p className="leading-7 text-[#4d5955]">{article.content}</p>
        <h2 className="display mt-9 text-3xl">Troubleshooting steps</h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-[#4d5955]">
          {article.troubleshootingSteps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <h2 className="display mt-9 text-3xl">Escalation criteria</h2>
        <p className="mt-4 rounded-2xl bg-[#f0ece3] p-5 text-sm leading-7 text-[#4d5955]">{article.escalationCriteria}</p>
        <p className="mt-9 border-t pt-5 text-xs text-[#68716c]">Fictional SecureDesk knowledge-base content created for this portfolio demonstration.</p>
        </div>
      </article>
    </main>
  );
}
