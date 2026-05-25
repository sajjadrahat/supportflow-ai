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
      const [response] = await Promise.all([
        fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketId: ticket.id }),
        }),
        new Promise((resolve) => window.setTimeout(resolve, 850)),
      ]);
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
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="card h-fit overflow-hidden lg:sticky lg:top-5">
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Incoming ticket</p>
          <p className="mt-3 font-mono text-sm font-medium text-[#2193f8]">{ticket.id}</p>
        </div>
        <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold leading-snug">{ticket.subject}</h2>
          </div>
          <span className={`pill ${urgencyClass(ticket.initialUrgency)}`}>{ticket.initialUrgency}</span>
        </div>
        <dl className="mt-7 grid grid-cols-2 gap-5 border-y py-5 text-sm">
          <div><dt className="text-xs font-medium text-slate-400">CUSTOMER</dt><dd className="mt-2 font-medium text-slate-800">{ticket.customerName}</dd></div>
          <div><dt className="text-xs font-medium text-slate-400">ORGANIZATION</dt><dd className="mt-2 font-medium text-slate-800">{ticket.customerCompany}</dd></div>
          <div><dt className="text-xs font-medium text-slate-400">RECEIVED</dt><dd className="mt-2 text-slate-600">{new Date(ticket.createdAt).toLocaleDateString()}</dd></div>
          <div><dt className="text-xs font-medium text-slate-400">STATUS</dt><dd className="mt-2 text-slate-600">{ticket.status}</dd></div>
        </dl>
        <p className="mt-6 text-xs font-medium uppercase tracking-wider text-slate-400">Customer message</p>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{ticket.body}</p>
        </div>
      </aside>

      <section className="space-y-5" aria-label="AI analysis workspace">
        {!analysis && (
          <div className="card flex flex-col items-center justify-center p-10 text-center sm:min-h-[360px]">
            {loading ? (
              <div aria-live="polite" className="flex w-full max-w-md flex-col items-center" role="status">
                <span className="analysis-spinner flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#d5ebff] border-t-[#2193f8] bg-[#eaf5ff]/40" />
                <h2 className="mt-6 text-xl font-semibold tracking-tight text-slate-950">Analyzing ticket</h2>
                <p className="mt-3 text-sm leading-7 text-slate-500">Retrieving knowledge and preparing a grounded suggestion.</p>
                <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <span className="analysis-progress block h-full w-2/5 rounded-full bg-[#2193f8]" />
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-500">
                  {["Retrieve", "Ground", "Draft"].map((stage, index) => (
                    <span className="flex items-center gap-2" key={stage}>
                      <span className="analysis-dot h-1.5 w-1.5 rounded-full bg-[#2193f8]" style={{ animationDelay: `${index * 180}ms` }} />
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf5ff] text-[#2193f8]">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M12 3v3m0 12v3M3 12h3m12 0h3M6.34 6.34l2.12 2.12m7.08 7.08 2.12 2.12m0-11.32-2.12 2.12m-7.08 7.08-2.12 2.12" strokeLinecap="round" />
                  </svg>
                </span>
                <h2 className="mt-6 text-xl font-semibold tracking-tight text-slate-950">Analyze this ticket</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
                  Retrieve documented guidance and prepare a reviewed recommendation. Saved analyses are reused to keep this public demo cost controlled.
                </p>
                <button
                  type="button"
                  onClick={analyze}
                  className="btn-primary mt-7"
                >
                  Analyze with AI
                </button>
              </>
            )}
          </div>
        )}

        {error && <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</div>}
        {notice && <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700" role="status">{notice}</div>}

        {analysis && (
          <>
            <div className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                <p className="text-sm font-medium text-slate-700">AI triage result</p>
                {analysis.cached && <span className="pill bg-emerald-50 text-emerald-700">Saved result / no new AI call</span>}
              </div>
              <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{analysis.triage.category}</h2>
                </div>
                <div className="flex gap-2">
                  <span className={`pill ${urgencyClass(analysis.triage.urgency)}`}>{analysis.triage.urgency}</span>
                  <span className="pill bg-[#eaf5ff] text-[#0574d4]">{Math.round(analysis.triage.confidence * 100)}% confidence</span>
                </div>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Issue summary</p>
                  <p className="mt-2 text-sm leading-6">{analysis.triage.summary}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Customer indicator</p>
                  <p className="mt-2 text-sm leading-6">{analysis.triage.sentiment}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Still needed</p>
                  {analysis.triage.missing_information.length ? (
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {analysis.triage.missing_information.map((item) => <li key={item}>- {item}</li>)}
                    </ul>
                  ) : <p className="mt-2 text-sm text-slate-500">No additional information requested.</p>}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Why this path</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{analysis.triage.reasoning_summary}</p>
                </div>
              </div>
              <p className="mt-6 border-t pt-4 text-xs text-slate-500">
                Generation mode: {analysis.mode === "openai" ? "OpenAI structured output" : "Guided local demo output (no API key configured)"}.
              </p>
              </div>
            </div>

            <section className="card p-6" aria-label="Retrieved knowledge articles">
              <h2 className="text-lg font-semibold text-slate-950">Relevant knowledge</h2>
              <p className="mt-1 text-sm text-slate-500">Sources selected to ground the suggested reply.</p>
              {analysis.articles.length ? (
                <div className="mt-4 space-y-3">
                  {analysis.articles.map((article) => (
                    <article className="rounded-xl border border-slate-200 p-4" key={article.id}>
                      <div className="flex items-center justify-between gap-4">
                        <Link className="text-sm font-medium text-[#0574d4] hover:underline" href={`/demo/knowledge/${article.id}`}>{article.title}</Link>
                        <span className="pill bg-slate-100 text-slate-600">{article.relevance}% match</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{article.excerpt}</p>
                    </article>
                  ))}
                </div>
              ) : <p className="mt-4 text-sm text-slate-600">No suitable article found. Continue with human review rather than an unsupported reply.</p>}
            </section>

            <section className="card p-6">
              <div className="flex flex-wrap justify-between gap-3">
                <div><h2 className="text-lg font-semibold text-slate-950">Draft customer reply</h2><p className="mt-1 text-sm text-slate-500">Editable before any action is recorded.</p></div>
                <span className="pill h-fit bg-amber-50 text-amber-700">Review before sending</span>
              </div>
              <label className="sr-only" htmlFor="draft-reply">Editable drafted customer reply</label>
              <textarea
                id="draft-reply"
                className="input mt-5 min-h-72 resize-y bg-slate-50/60 font-sans text-sm leading-7"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
            </section>

            <DecisionCard action={analysis.triage.recommended_action} reason={analysis.triage.escalation_reason} />

            {analysis.escalation && (
              <section className="card p-6" aria-label="Engineering escalation summary">
                <div className="flex items-center justify-between gap-3">
                  <div><h2 className="text-lg font-semibold text-slate-950">Engineering escalation summary</h2><p className="mt-1 text-sm text-slate-500">Internal handoff prepared for review.</p></div>
                  <button className="btn-secondary" type="button" onClick={copyEscalation}>Copy summary</button>
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
              <h2 className="text-lg font-semibold text-slate-950">Human feedback</h2>
              <p className="mt-2 text-sm text-slate-500">Record whether this suggestion helped. Feedback contributes only to demo usage statistics.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {(["Approve Draft", "Edit Draft", "Escalate", "Mark Suggestion Incorrect"] as FeedbackAction[]).map((action) => (
                  <button
                    className="btn-secondary disabled:opacity-50"
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
