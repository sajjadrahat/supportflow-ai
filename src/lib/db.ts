import type { AnalysisResult, DemoMetrics, FeedbackAction } from "@/lib/types";

export async function getLatestAnalysis(db: D1Database | undefined, ticketId: string): Promise<AnalysisResult | null> {
  if (!db) return null;
  const stored = await db
    .prepare("SELECT analysis_json FROM analyses WHERE ticket_id = ? ORDER BY created_at DESC LIMIT 1")
    .bind(ticketId)
    .first<{ analysis_json: string }>();
  if (!stored) return null;
  return { ...(JSON.parse(stored.analysis_json) as AnalysisResult), cached: true, persisted: true };
}

export async function acquireAnalysisGenerationLock(
  db: D1Database | undefined,
  ticketId: string,
): Promise<boolean> {
  if (!db) return true;
  const result = await db
    .prepare("INSERT OR IGNORE INTO analysis_generation_locks (ticket_id, created_at) VALUES (?, ?)")
    .bind(ticketId, new Date().toISOString())
    .run();
  return Boolean(result.meta.changes);
}

export async function releaseAnalysisGenerationLock(db: D1Database | undefined, ticketId: string): Promise<void> {
  if (!db) return;
  await db.prepare("DELETE FROM analysis_generation_locks WHERE ticket_id = ?").bind(ticketId).run();
}

export async function saveAnalysis(db: D1Database | undefined, analysis: AnalysisResult): Promise<boolean> {
  if (!db) return false;
  await db
    .prepare(
      `INSERT INTO analyses
       (id, ticket_id, category, urgency, recommended_action, confidence, analysis_json, draft_reply, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      analysis.id,
      analysis.ticketId,
      analysis.triage.category,
      analysis.triage.urgency,
      analysis.triage.recommended_action,
      analysis.triage.confidence,
      JSON.stringify(analysis),
      analysis.draftReply,
      analysis.createdAt,
    )
    .run();
  return true;
}

export async function saveFeedback(
  db: D1Database | undefined,
  event: {
    id: string;
    analysisId: string;
    ticketId: string;
    action: FeedbackAction;
    editedDraft: string;
    createdAt: string;
  },
): Promise<boolean> {
  if (!db) return false;
  await db
    .prepare(
      `INSERT INTO feedback (id, analysis_id, ticket_id, action, edited_draft, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(event.id, event.analysisId, event.ticketId, event.action, event.editedDraft, event.createdAt)
    .run();
  return true;
}

export async function getMetrics(db: D1Database | undefined): Promise<DemoMetrics> {
  if (!db) {
    return {
      ticketsAnalyzed: 0,
      suggestedEscalations: 0,
      approvedDrafts: 0,
      editedDrafts: 0,
      incorrectSuggestions: 0,
      categories: [],
    };
  }

  const [analysisCount, escalations, feedbackRows, categoryRows] = await Promise.all([
    db.prepare("SELECT COUNT(*) AS count FROM analyses").first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) AS count FROM analyses WHERE recommended_action = ?").bind("Escalate to Engineering").first<{ count: number }>(),
    db.prepare("SELECT action, COUNT(*) AS count FROM feedback GROUP BY action").all<{ action: FeedbackAction; count: number }>(),
    db.prepare("SELECT category, COUNT(*) AS count FROM analyses GROUP BY category ORDER BY count DESC").all<{ category: string; count: number }>(),
  ]);
  const actions = new Map(feedbackRows.results.map((row) => [row.action, row.count]));

  return {
    ticketsAnalyzed: analysisCount?.count ?? 0,
    suggestedEscalations: escalations?.count ?? 0,
    approvedDrafts: actions.get("Approve Draft") ?? 0,
    editedDrafts: actions.get("Edit Draft") ?? 0,
    incorrectSuggestions: actions.get("Mark Suggestion Incorrect") ?? 0,
    categories: categoryRows.results,
  };
}
