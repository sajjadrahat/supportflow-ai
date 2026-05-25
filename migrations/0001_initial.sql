CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_company TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL,
  initial_urgency TEXT NOT NULL,
  category_hint TEXT NOT NULL,
  body TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS knowledge_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  troubleshooting_steps TEXT NOT NULL,
  escalation_criteria TEXT NOT NULL,
  last_updated TEXT NOT NULL,
  keywords TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES tickets(id),
  category TEXT NOT NULL,
  urgency TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  confidence REAL NOT NULL,
  analysis_json TEXT NOT NULL,
  draft_reply TEXT NOT NULL,
  created_at TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  analysis_id TEXT NOT NULL REFERENCES analyses(id),
  ticket_id TEXT NOT NULL REFERENCES tickets(id),
  action TEXT NOT NULL,
  edited_draft TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_analyses_ticket_id ON analyses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_feedback_analysis_id ON feedback(analysis_id);
