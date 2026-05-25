CREATE TABLE IF NOT EXISTS analysis_generation_locks (
  ticket_id TEXT PRIMARY KEY REFERENCES tickets(id),
  created_at TEXT NOT NULL
) STRICT;

INSERT OR IGNORE INTO analysis_generation_locks (ticket_id, created_at)
SELECT ticket_id, MIN(created_at)
FROM analyses
GROUP BY ticket_id;
