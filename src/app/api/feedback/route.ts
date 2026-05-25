import { NextResponse } from "next/server";
import { z } from "zod";
import { getTicket } from "@/data/seed";
import { saveFeedback } from "@/lib/db";
import { getRuntimeBindings } from "@/lib/runtime";

export const runtime = "nodejs";

const feedbackSchema = z.object({
  analysisId: z.string().uuid(),
  ticketId: z.string().regex(/^SD-\d{4}$/),
  action: z.enum(["Approve Draft", "Edit Draft", "Escalate", "Mark Suggestion Incorrect"]),
  editedDraft: z.string().max(5000).default(""),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = feedbackSchema.safeParse(payload);
  if (!parsed.success || !getTicket(parsed.success ? parsed.data.ticketId : "")) {
    return NextResponse.json({ error: "Feedback must reference a valid demo analysis." }, { status: 400 });
  }

  try {
    const bindings = await getRuntimeBindings();
    if (bindings.FEEDBACK_RATE_LIMITER) {
      const { success } = await bindings.FEEDBACK_RATE_LIMITER.limit({ key: "public-demo:feedback" });
      if (!success) {
        return NextResponse.json({ error: "Feedback limit reached. Please try again in one minute." }, { status: 429 });
      }
    }
    const persisted = await saveFeedback(bindings.DB, {
      id: crypto.randomUUID(),
      analysisId: parsed.data.analysisId,
      ticketId: parsed.data.ticketId,
      action: parsed.data.action,
      editedDraft: parsed.data.editedDraft,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({
      persisted,
      message: persisted ? "Feedback saved to demo analytics." : "Feedback recorded for this session; D1 is not connected locally.",
    });
  } catch {
    return NextResponse.json({ error: "Feedback could not be saved." }, { status: 500 });
  }
}
