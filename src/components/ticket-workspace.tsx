"use client";

import { useState } from "react";
import Link from "next/link";
import type { AnalysisResult, FeedbackAction, Ticket, Urgency } from "@/lib/types";
import { DecisionCard } from "@/components/decision-card";

function urgencyClass(urgency: Urgency) {
  return urgency === "High" || urgency === "Critical" ? "bg-red-50 text-red-700" : urgency === "Medium" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600";
}

export function TicketWorkspace({ ticket }: { ticket: Ticket }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState<FeedbackAction | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function analyze() {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: ticket.id }),
      });
      const payload = (await response.json()) as AnalysisResult | { error: string };
      if (!response.ok || "error" in payload) throw new Error("error" in payload ? payload.error : "Analysis failed.");
      setAnalysis(payload);
      setDraft(payload.draftReply);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Analysis could not be completed.");
    } finally {
      setLoading(false);
    }
  }

  async function recordFeedback(action: FeedbackAction) {
    if (!analysis) return;
    setFeedbackLoading(action);
    setError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: analysis.id,
          ticketId: ticket.id,
          action,
          editedDraft: action === "Edit Draft" ? draft : "",
        }),
      });
      const payload = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Feedback could not be saved.");
      setNotice(payload.message ?? "Feedback saved.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Feedback could not be saved.");
    } finally {
      setFeedbackLoading(null);
    }
  }

  async function copyEscalation() {
    if (!analysis?.escalation) return;
    const handoff = Object.entries(analysis.escalation)
      .map(([key, value]) => `${key.replaceAll("_", " ")}: ${Array.isArray(value) ? value.join("; ") : value}`)
      .join("\n");
    await navigator.clipboard.writeText(handoff);
    setNotice("Escalation summary copied.");
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
      <aside className="card h-fit p-6 lg:sticky lg:top-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{ticket.id}</p>
            <h2 className="mt-2 text-lg font-semibold">{ticket.subject}</h2>
          </div>
          <span className={`pill ${urgencyClass(ticket.initialUrgency)}`}>{ticket.initialUrgency}</span>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-y py-5 text-sm">
          <div><dt className="text-slate-500">Customer</dt><dd className="mt-1 font-medium">{ticket.customerName}</dd></div>
          <div><dt className="text-slate-500">Organization</dt><dd className="mt-1 font-medium">{ticket.customerCompany}</dd></div>
          <div><dt className="text-slate-500">Created</dt><dd className="mt-1">{new Date(ticket.createdAt).toLocaleString()}</dd></div>
          <div><dt className="text-slate-500">Status</dt><dd className="mt-1">{ticket.status}</dd></div>
        </dl>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Original message</p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{ticket.body}</p>
      </aside>

      <section className="space-y-5" aria-label="AI analysis workspace">
        {!analysis && (
          <div className="card p-8 text-center">
            <h2 className="text-xl font-semibold">Ready for triage</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
              Analysis begins only after you choose to run it. Any draft or escalation remains a suggestion for human review.
            </p>
            <button
              type="button"
              onClick={analyze}
              disabled={loading}
              className="mt-7 rounded-lg bg-[#142c54] px-5 py-3 font-medium text-white hover:bg-[#203e70] disabled:opacity-60"
            >
              {loading ? "Analyzing ticket..." : "Analyze with AI"}
            </button>
          </div>
        )}

        {error && <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</div>}
        {notice && <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700" role="status">{notice}</div>}

        {analysis && (
          <>
            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI triage suggestion</p>
                  <h2 className="mt-2 text-xl font-semibold">{analysis.triage.category}</h2>
                </div>
                <div className="flex gap-2">
                  <span className={`pill ${urgencyClass(analysis.triage.urgency)}`}>{analysis.triage.urgency}</span>
                  <span className="pill bg-blue-50 text-blue-700">{Math.round(analysis.triage.confidence * 100)}% confidence</span>
                </div>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-500">ISSUE SUMMARY</p>
                  <p className="mt-2 text-sm leading-6">{analysis.triage.summary}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">CUSTOMER INDICATOR</p>
                  <p className="mt-2 text-sm leading-6">{analysis.triage.sentiment}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">MISSING INFORMATION</p>
                  {analysis.triage.missing_information.length ? (
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {analysis.triage.missing_information.map((item) => <li key={item}>- {item}</li>)}
                    </ul>
                  ) : <p className="mt-2 text-sm text-slate-500">No additional information requested.</p>}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">REASONING SUMMARY</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{analysis.triage.reasoning_summary}</p>
                </div>
              </div>
              <p className="mt-5 text-xs text-slate-500">
                Generation mode: {analysis.mode === "openai" ? "OpenAI structured output" : "Guided local demo output (no API key configured)"}.
              </p>
            </div>

            <section className="card p-6" aria-label="Retrieved knowledge articles">
              <h2 className="text-lg font-semibold">Relevant Knowledge</h2>
              {analysis.articles.length ? (
                <div className="mt-4 space-y-3">
                  {analysis.articles.map((article) => (
                    <article className="rounded-xl border p-4" key={article.id}>
                      <div className="flex items-center justify-between gap-4">
                        <Link className="text-sm font-semibold text-[#305b9d] hover:underline" href={`/demo/knowledge/${article.id}`}>{article.title}</Link>
                        <span className="pill bg-slate-100 text-slate-600">{article.relevance}% match</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                    </article>
                  ))}
                </div>
              ) : <p className="mt-4 text-sm text-slate-600">No suitable article found. Continue with human review rather than an unsupported reply.</p>}
            </section>

            <section className="card p-6">
              <div className="flex flex-wrap justify-between gap-3">
                <h2 className="text-lg font-semibold">Draft Customer Reply</h2>
                <span className="pill bg-blue-50 text-blue-700">AI draft - review before sending</span>
              </div>
              <label className="sr-only" htmlFor="draft-reply">Editable drafted customer reply</label>
              <textarea
                id="draft-reply"
                className="input mt-4 min-h-72 resize-y font-sans text-sm leading-6"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
            </section>

            <DecisionCard action={analysis.triage.recommended_action} reason={analysis.triage.escalation_reason} />

            {analysis.escalation && (
              <section className="card p-6" aria-label="Engineering escalation summary">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Engineering Escalation Summary</h2>
                  <button className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50" type="button" onClick={copyEscalation}>Copy summary</button>
                </div>
                <dl className="mt-5 space-y-4 text-sm">
                  <div><dt className="font-semibold text-slate-500">Issue summary</dt><dd className="mt-1">{analysis.escalation.issue_summary}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Customer impact</dt><dd className="mt-1">{analysis.escalation.customer_impact}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Steps already attempted</dt><dd className="mt-1">{analysis.escalation.steps_already_attempted.join("; ")}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Suspected product area</dt><dd className="mt-1">{analysis.escalation.suspected_product_area}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Reproduction information</dt><dd className="mt-1">{analysis.escalation.reproduction_information}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Missing diagnostics</dt><dd className="mt-1">{analysis.escalation.missing_diagnostic_information.join("; ")}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Knowledge references</dt><dd className="mt-1">{analysis.escalation.knowledge_base_references.join("; ")}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Suggested priority</dt><dd className="mt-1">{analysis.escalation.suggested_priority}</dd></div>
                </dl>
              </section>
            )}

            <section className="card p-6" aria-label="Human feedback">
              <h2 className="text-lg font-semibold">Human Feedback</h2>
              <p className="mt-2 text-sm text-slate-600">Record whether this suggestion helped. Feedback contributes only to demo usage statistics.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {(["Approve Draft", "Edit Draft", "Escalate", "Mark Suggestion Incorrect"] as FeedbackAction[]).map((action) => (
                  <button
                    className="rounded-lg border bg-white px-4 py-2.5 text-sm font-medium hover:border-slate-400 disabled:opacity-50"
                    disabled={feedbackLoading !== null}
                    key={action}
                    type="button"
                    onClick={() => recordFeedback(action)}
                  >
                    {feedbackLoading === action ? "Saving..." : action}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </div>
  );
}
