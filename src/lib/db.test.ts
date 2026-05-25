import { describe, expect, it, vi } from "vitest";
import { acquireAnalysisGenerationLock, getLatestAnalysis, saveFeedback } from "@/lib/db";

describe("saveFeedback", () => {
  it("persists a bound feedback event when D1 is available", async () => {
    const run = vi.fn().mockResolvedValue({ success: true });
    const bind = vi.fn().mockReturnValue({ run });
    const prepare = vi.fn().mockReturnValue({ bind });
    const db = { prepare } as unknown as D1Database;
    const saved = await saveFeedback(db, {
      id: "feedback-1",
      analysisId: "analysis-1",
      ticketId: "SD-1051",
      action: "Approve Draft",
      editedDraft: "",
      createdAt: "2026-05-25T00:00:00Z",
    });
    expect(saved).toBe(true);
    expect(prepare).toHaveBeenCalledOnce();
    expect(bind).toHaveBeenCalledWith("feedback-1", "analysis-1", "SD-1051", "Approve Draft", "", "2026-05-25T00:00:00Z");
    expect(run).toHaveBeenCalledOnce();
  });
});

describe("analysis cost controls", () => {
  it("returns a saved analysis as cached content", async () => {
    const stored = {
      id: "analysis-1",
      ticketId: "SD-1051",
      createdAt: "2026-05-25T00:00:00Z",
      triage: {},
      articles: [],
      draftReply: "",
      escalation: null,
      mode: "openai",
      persisted: false,
    };
    const first = vi.fn().mockResolvedValue({ analysis_json: JSON.stringify(stored) });
    const bind = vi.fn().mockReturnValue({ first });
    const db = { prepare: vi.fn().mockReturnValue({ bind }) } as unknown as D1Database;
    const analysis = await getLatestAnalysis(db, "SD-1051");
    expect(analysis?.cached).toBe(true);
    expect(analysis?.persisted).toBe(true);
  });

  it("acquires generation only when D1 inserts a new lock", async () => {
    const run = vi.fn().mockResolvedValue({ meta: { changes: 1 } });
    const db = { prepare: vi.fn().mockReturnValue({ bind: vi.fn().mockReturnValue({ run }) }) } as unknown as D1Database;
    await expect(acquireAnalysisGenerationLock(db, "SD-1068")).resolves.toBe(true);
  });
});
