import type {
  EscalationSummary,
  RetrievedArticle,
  Ticket,
  Triage,
} from "@/lib/types";

const guidance: Record<
  string,
  Pick<
    Triage,
    | "urgency"
    | "sentiment"
    | "missing_information"
    | "recommended_action"
    | "escalation_reason"
    | "reasoning_summary"
  >
> = {
  "Login / MFA": {
    urgency: "Medium",
    sentiment: "Blocked and seeking help",
    missing_information: ["Whether a recovery code is available", "Whether an organization administrator can verify the reset"],
    recommended_action: "Request More Information",
    escalation_reason: "",
    reasoning_summary: "The user is unable to access the account after a device change; documented recovery or verified reset steps should be checked first.",
  },
  Billing: {
    urgency: "Low",
    sentiment: "Concerned but calm",
    missing_information: ["Invoice period and seat activity export"],
    recommended_action: "Request More Information",
    escalation_reason: "",
    reasoning_summary: "The article explains billing snapshots, and reconciliation information is needed before a billing review.",
  },
  "Browser Extension": {
    urgency: "Medium",
    sentiment: "Inconvenienced",
    missing_information: [],
    recommended_action: "Resolve in Support",
    escalation_reason: "",
    reasoning_summary: "The extension remains installed and the documented toolbar pinning steps directly match the symptom after a Chrome update.",
  },
  "Email Notifications": {
    urgency: "Medium",
    sentiment: "Concerned about timeliness",
    missing_information: ["Affected recipient count", "Message timestamps with timezone", "Mail-system deferral or quarantine evidence"],
    recommended_action: "Request More Information",
    escalation_reason: "",
    reasoning_summary: "Delivery delay investigation needs timestamps and recipient scope before deciding whether escalation criteria are met.",
  },
  Permissions: {
    urgency: "Medium",
    sentiment: "Time-sensitive frustration",
    missing_information: ["Whether Rowan has an active team scope", "Whether a fresh sign-in was attempted after the role change"],
    recommended_action: "Request More Information",
    escalation_reason: "",
    reasoning_summary: "Report visibility depends on role scope and a refreshed session according to the supplied access article.",
  },
  "API Authentication": {
    urgency: "High",
    sentiment: "Operationally blocked",
    missing_information: ["Timestamp and request ID for a failed request", "Confirmation that the active token and API environment match"],
    recommended_action: "Request More Information",
    escalation_reason: "",
    reasoning_summary: "A 401 after credential changes needs the documented token and environment checks before engineering review.",
  },
  "Security / Phishing Report": {
    urgency: "High",
    sentiment: "Urgent security concern",
    missing_information: ["Original message headers", "Whether credentials were entered after clicking", "List of affected recipients"],
    recommended_action: "Escalate to Engineering",
    escalation_reason: "Multiple recipients saw a suspected impersonation message and two users clicked an unrecognized link, meeting immediate escalation criteria.",
    reasoning_summary: "The supplied security article explicitly calls for immediate escalation when a suspected impersonation link was clicked.",
  },
  "Integration Sync": {
    urgency: "High",
    sentiment: "Workflow impacted",
    missing_information: ["Integration warning code", "Whether missing users belong to the configured sync group", "Result of a safe retry"],
    recommended_action: "Request More Information",
    escalation_reason: "",
    reasoning_summary: "The sync warning article calls for logs and inclusion checks before escalation unless the failure persists after retry.",
  },
};

export function buildGuidedAnalysis(ticket: Ticket, articles: RetrievedArticle[]): {
  triage: Triage;
  draftReply: string;
  escalation: EscalationSummary | null;
} {
  const direction = guidance[ticket.categoryHint];
  const article = articles[0];
  const steps = article?.troubleshootingSteps ?? [
    "A support specialist should review this request because there is no matching documented procedure.",
  ];
  const triage: Triage = {
    category: ticket.categoryHint,
    urgency: direction?.urgency ?? ticket.initialUrgency,
    summary: ticket.subject,
    sentiment: direction?.sentiment ?? "Needs review",
    missing_information: direction?.missing_information ?? [],
    recommended_action: articles.length ? direction?.recommended_action ?? "Request More Information" : "Request More Information",
    escalation_reason: direction?.escalation_reason ?? "",
    confidence: articles.length ? 0.88 : 0.35,
    reasoning_summary: articles.length
      ? direction?.reasoning_summary ?? "A relevant documented workflow was found for human review."
      : "No sufficiently relevant help content was found, so a human should prepare the response.",
  };

  const draftReply = articles.length
    ? [
        `Hi ${ticket.customerName},`,
        "",
        `Thank you for reporting this. I understand that ${ticket.subject.toLowerCase()}.`,
        "",
        "Please try the following documented steps:",
        ...steps.map((step, index) => `${index + 1}. ${step}`),
        ...(triage.missing_information.length
          ? ["", "To continue investigating, please also provide:", ...triage.missing_information.map((item) => `- ${item}`)]
          : []),
        "",
        "Once you reply, a support specialist will review the next step.",
        "",
        "Regards,",
        "SecureDesk Support",
      ].join("\n")
    : "No supported response was generated because no relevant documentation was found. Please route this ticket for human review.";

  const escalation =
    triage.recommended_action === "Escalate to Engineering"
      ? {
          issue_summary: triage.summary,
          customer_impact: "Multiple employees may have interacted with a suspected impersonation link.",
          steps_already_attempted: ["Customer reported the suspicious message and affected clicks."],
          suspected_product_area: "Security communications / brand impersonation",
          reproduction_information: "Await original message headers and destination URL evidence from the customer.",
          missing_diagnostic_information: triage.missing_information,
          knowledge_base_references: articles.map((entry) => `${entry.id}: ${entry.title}`),
          suggested_priority: triage.urgency,
        }
      : null;

  return { triage, draftReply, escalation };
}
