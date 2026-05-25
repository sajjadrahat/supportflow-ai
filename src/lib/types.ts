import { z } from "zod";

export const urgencySchema = z.enum(["Low", "Medium", "High", "Critical"]);
export const actionSchema = z.enum([
  "Resolve in Support",
  "Request More Information",
  "Escalate to Engineering",
]);

export const triageSchema = z.object({
  category: z.string(),
  urgency: urgencySchema,
  summary: z.string(),
  sentiment: z.string(),
  missing_information: z.array(z.string()),
  recommended_action: actionSchema,
  escalation_reason: z.string(),
  confidence: z.number().min(0).max(1),
  reasoning_summary: z.string(),
});

export const escalationSchema = z.object({
  issue_summary: z.string(),
  customer_impact: z.string(),
  steps_already_attempted: z.array(z.string()),
  suspected_product_area: z.string(),
  reproduction_information: z.string(),
  missing_diagnostic_information: z.array(z.string()),
  knowledge_base_references: z.array(z.string()),
  suggested_priority: urgencySchema,
});

export const generatedResultSchema = z.object({
  triage: triageSchema,
  draft_reply: z.string(),
  escalation: escalationSchema,
});

export type Urgency = z.infer<typeof urgencySchema>;
export type RecommendedAction = z.infer<typeof actionSchema>;
export type Triage = z.infer<typeof triageSchema>;
export type EscalationSummary = z.infer<typeof escalationSchema>;

export type TicketStatus = "New" | "Analyzed" | "Needs Review";

export interface Ticket {
  id: string;
  subject: string;
  customerName: string;
  customerCompany: string;
  createdAt: string;
  status: TicketStatus;
  initialUrgency: Urgency;
  categoryHint: string;
  body: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  troubleshootingSteps: string[];
  escalationCriteria: string;
  lastUpdated: string;
  keywords: string[];
}

export interface RetrievedArticle extends KnowledgeArticle {
  relevance: number;
  excerpt: string;
}

export interface AnalysisResult {
  id: string;
  ticketId: string;
  createdAt: string;
  triage: Triage;
  articles: RetrievedArticle[];
  draftReply: string;
  escalation: EscalationSummary | null;
  mode: "openai" | "guided-demo";
  persisted: boolean;
  cached?: boolean;
}

export type FeedbackAction =
  | "Approve Draft"
  | "Edit Draft"
  | "Escalate"
  | "Mark Suggestion Incorrect";

export interface DemoMetrics {
  ticketsAnalyzed: number;
  suggestedEscalations: number;
  approvedDrafts: number;
  editedDrafts: number;
  incorrectSuggestions: number;
  categories: { category: string; count: number }[];
}
