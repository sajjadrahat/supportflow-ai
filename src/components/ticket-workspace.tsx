"use client";

import { useState } from "react";
import Link from "next/link";
import type { AnalysisResult, FeedbackAction, Ticket, Urgency } from "@/lib/types";
import { DecisionCard } from "@/components/decision-card";

function urgencyClass(urgency: Urgency) {
  return urgency === "High" || urgency === "Critical" ? "bg-[#f6e1d9] text-[#933c27]" : urgency === "Medium" ? "bg-[#efe7d4] text-[#85621e]" : "bg-[#e5ece8] text-[#426158]";
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
    <div className="mt-10 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
      <aside className="card h-fit overflow-hidden lg:sticky lg:top-5">
        <div className="panel-dark px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#88aaa1]">Incoming case</p>
          <p className="mt-3 font-mono text-sm text-[#a5dacb]">{ticket.id}</p>
        </div>
        <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold leading-snug">{ticket.subject}</h2>
          </div>
          <span className={`pill ${urgencyClass(ticket.initialUrgency)}`}>{ticket.initialUrgency}</span>
        </div>
        <dl className="mt-7 grid grid-cols-2 gap-5 border-y py-5 text-sm">
          <div><dt className="eyebrow">Customer</dt><dd className="mt-2 font-medium">{ticket.customerName}</dd></div>
          <div><dt className="eyebrow">Organization</dt><dd className="mt-2 font-medium">{ticket.customerCompany}</dd></div>
          <div><dt className="eyebrow">Received</dt><dd className="mt-2 text-[#59645f]">{new Date(ticket.createdAt).toLocaleDateString()}</dd></div>
          <div><dt className="eyebrow">Status</dt><dd className="mt-2 text-[#59645f]">{ticket.status}</dd></div>
        </dl>
        <p className="eyebrow mt-6">Customer message</p>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#4d5955]">{ticket.body}</p>
        </div>
      </aside>

      <section className="space-y-5" aria-label="AI analysis workspace">
        {!analysis && (
          <div className="panel-dark rounded-[1.5rem] p-8 sm:p-11">
            <p className="text-xs uppercase tracking-[0.2em] text-[#86a59c]">Assisted review</p>
            <h2 className="display mt-5 text-4xl">Prepare case intelligence</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#bac8c3]">
              Retrieve documented guidance and prepare a reviewed recommendation. Saved analyses are reused to keep this public demo cost controlled.
            </p>
            <button
              type="button"
              onClick={analyze}
              disabled={loading}
              className="mt-8 rounded-full bg-[#e5efe8] px-6 py-3 font-semibold text-[#17332e] hover:bg-white disabled:opacity-60"
            >
              {loading ? "Analyzing ticket..." : "Analyze with AI"}
            </button>
          </div>
        )}

        {error && <div className="rounded-2xl border border-[#efc0b2] bg-[#f6e1d9] p-4 text-sm text-[#8c3624]" role="alert">{error}</div>}
        {notice && <div className="rounded-2xl border border-[#badbce] bg-[#def1e9] p-4 text-sm text-[#155b4e]" role="status">{notice}</div>}

        {analysis && (
          <>
            <div className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-[#f0ece3] px-6 py-4">
                <p className="eyebrow">Triage recommendation</p>
                {analysis.cached && <span className="pill bg-[#e4ece7] text-[#48645b]">Saved analysis reused / no new AI call</span>}
              </div>
              <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="display text-3xl">{analysis.triage.category}</h2>
                </div>
                <div className="flex gap-2">
                  <span className={`pill ${urgencyClass(analysis.triage.urgency)}`}>{analysis.triage.urgency}</span>
                  <span className="pill bg-[#def1e9] text-[#155b4e]">{Math.round(analysis.triage.confidence * 100)}% confidence</span>
                </div>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="eyebrow">Issue summary</p>
                  <p className="mt-2 text-sm leading-6">{analysis.triage.summary}</p>
                </div>
                <div>
                  <p className="eyebrow">Customer indicator</p>
                  <p className="mt-2 text-sm leading-6">{analysis.triage.sentiment}</p>
                </div>
                <div>
                  <p className="eyebrow">Still needed</p>
                  {analysis.triage.missing_information.length ? (
                    <ul className="mt-3 space-y-2 text-sm text-[#4d5955]">
                      {analysis.triage.missing_information.map((item) => <li key={item}>- {item}</li>)}
                    </ul>
                  ) : <p className="mt-2 text-sm text-[#68716c]">No additional information requested.</p>}
                </div>
                <div>
                  <p className="eyebrow">Why this path</p>
                  <p className="mt-2 text-sm leading-6 text-[#4d5955]">{analysis.triage.reasoning_summary}</p>
                </div>
              </div>
              <p className="mt-6 border-t pt-4 text-xs text-[#68716c]">
                Generation mode: {analysis.mode === "openai" ? "OpenAI structured output" : "Guided local demo output (no API key configured)"}.
              </p>
              </div>
            </div>

            <section className="card p-6" aria-label="Retrieved knowledge articles">
              <p className="eyebrow">Evidence</p>
              <h2 className="display mt-3 text-3xl">Retrieved knowledge</h2>
              {analysis.articles.length ? (
                <div className="mt-4 space-y-3">
                  {analysis.articles.map((article) => (
                    <article className="rounded-2xl border bg-[#faf7ef] p-4" key={article.id}>
                      <div className="flex items-center justify-between gap-4">
                        <Link className="text-sm font-semibold text-[#15715f] hover:underline" href={`/demo/knowledge/${article.id}`}>{article.title}</Link>
                        <span className="pill bg-[#e4ece7] text-[#48645b]">{article.relevance}% match</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#59645f]">{article.excerpt}</p>
                    </article>
                  ))}
                </div>
              ) : <p className="mt-4 text-sm text-slate-600">No suitable article found. Continue with human review rather than an unsupported reply.</p>}
            </section>

            <section className="card p-6">
              <div className="flex flex-wrap justify-between gap-3">
                <div><p className="eyebrow">Response preparation</p><h2 className="display mt-3 text-3xl">Draft reply</h2></div>
                <span className="pill h-fit bg-[#efe7d4] text-[#80601e]">Review before sending</span>
              </div>
              <label className="sr-only" htmlFor="draft-reply">Editable drafted customer reply</label>
              <textarea
                id="draft-reply"
                className="input mt-5 min-h-72 resize-y bg-[#faf7ef] font-sans text-sm leading-7"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
            </section>

            <DecisionCard action={analysis.triage.recommended_action} reason={analysis.triage.escalation_reason} />

            {analysis.escalation && (
              <section className="card p-6" aria-label="Engineering escalation summary">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="eyebrow">Internal handoff</p><h2 className="display mt-3 text-3xl">Engineering brief</h2></div>
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
              <p className="eyebrow">Review checkpoint</p>
              <h2 className="display mt-3 text-3xl">Human feedback</h2>
              <p className="mt-3 text-sm text-[#59645f]">Record whether this suggestion helped. Feedback contributes only to demo usage statistics.</p>
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
