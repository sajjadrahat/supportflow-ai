import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { buildGuidedAnalysis } from "@/lib/demo-analysis";
import { generatedResultSchema, type EscalationSummary, type RetrievedArticle, type Ticket, type Triage } from "@/lib/types";

function citeDraft(draft: string, articles: RetrievedArticle[]): string {
  const citations = articles.map((article) => `[${article.id}] ${article.title}`).join("; ");
  return `${draft.trim()}\n\nSources consulted: ${citations}`;
}

export async function createAnalysisContent(
  ticket: Ticket,
  articles: RetrievedArticle[],
  config: { apiKey?: string; model?: string; useFallback?: boolean },
): Promise<{
  triage: Triage;
  draftReply: string;
  escalation: EscalationSummary | null;
  mode: "openai" | "guided-demo";
}> {
  if (!articles.length || !config.apiKey || config.useFallback) {
    const guided = buildGuidedAnalysis(ticket, articles);
    return {
      ...guided,
      draftReply: articles.length ? citeDraft(guided.draftReply, articles) : guided.draftReply,
      mode: "guided-demo",
    };
  }

  const documentation = articles
    .map(
      (article) =>
        `${article.id}: ${article.title}\nSummary: ${article.content}\nSteps: ${article.troubleshootingSteps.join(" | ")}\nEscalation: ${article.escalationCriteria}`,
    )
    .join("\n\n");
  const client = new OpenAI({ apiKey: config.apiKey });
  const response = await client.responses.parse({
    model: config.model ?? "gpt-4o-mini",
    store: false,
    max_output_tokens: 1200,
    input: [
      {
        role: "system",
        content:
          "You assist SecureDesk support agents with fictional portfolio-demo tickets. Return only grounded suggestions for human review. Use only the supplied knowledge articles for procedures. Do not invent steps, policy, diagnoses or assurances. If documentation is insufficient, recommend Request More Information and explicitly say a human must review. Keep reasoning plain-language and concise.",
      },
      {
        role: "user",
        content: `Analyze this fictional ticket and draft a concise response.\n\nTicket ID: ${ticket.id}\nCustomer: ${ticket.customerName}\nSubject: ${ticket.subject}\nMessage: ${ticket.body}\n\nRetrieved documentation:\n${documentation}`,
      },
    ],
    text: {
      format: zodTextFormat(generatedResultSchema, "supportflow_analysis"),
    },
  });
  if (!response.output_parsed) throw new Error("The AI response could not be parsed safely.");

  const generated = response.output_parsed;
  return {
    triage: generated.triage,
    draftReply: citeDraft(generated.draft_reply, articles),
    escalation:
      generated.triage.recommended_action === "Escalate to Engineering" ? generated.escalation : null,
    mode: "openai",
  };
}
