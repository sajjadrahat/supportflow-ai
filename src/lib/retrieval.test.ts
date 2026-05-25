import { describe, expect, it } from "vitest";
import { getTicket } from "@/data/seed";
import { retrieveArticles } from "@/lib/retrieval";

describe("retrieveArticles", () => {
  it("ranks the matching browser extension article first", () => {
    const ticket = getTicket("SD-1051");
    expect(ticket).toBeDefined();
    const results = retrieveArticles(ticket!);
    expect(results[0].id).toBe("KB-004");
    expect(results[0].relevance).toBeGreaterThan(results[1].relevance);
  });

  it("finds the security escalation documentation for a phishing report", () => {
    const results = retrieveArticles(getTicket("SD-1068")!);
    expect(results.map((result) => result.id)).toContain("KB-010");
  });
});
