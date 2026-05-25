import { describe, expect, it } from "vitest";
import { generatedResultSchema } from "@/lib/types";

describe("triage structured response validation", () => {
  it("accepts a complete structured API result", () => {
    const result = generatedResultSchema.safeParse({
      triage: {
        category: "Browser Extension",
        urgency: "Medium",
        summary: "Toolbar button missing after update.",
        sentiment: "Inconvenienced",
        missing_information: [],
        recommended_action: "Resolve in Support",
        escalation_reason: "",
        confidence: 0.9,
        reasoning_summary: "The retrieved procedure matches.",
      },
      draft_reply: "Please pin the enabled extension.",
      escalation: {
        issue_summary: "",
        customer_impact: "",
        steps_already_attempted: [],
        suspected_product_area: "",
        reproduction_information: "",
        missing_diagnostic_information: [],
        knowledge_base_references: [],
        suggested_priority: "Low",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unsupported recommendation", () => {
    const invalid = generatedResultSchema.safeParse({
      triage: { recommended_action: "Auto-send response" },
    });
    expect(invalid.success).toBe(false);
  });
});
