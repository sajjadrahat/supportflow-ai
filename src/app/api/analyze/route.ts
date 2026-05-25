import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getTicket } from "@/data/seed";
import { createAnalysisContent } from "@/lib/ai";
import {
  acquireAnalysisGenerationLock,
  getLatestAnalysis,
  releaseAnalysisGenerationLock,
  saveAnalysis,
} from "@/lib/db";
import { permitAnalysis } from "@/lib/rate-limit";
import { retrieveArticles } from "@/lib/retrieval";
import { getRuntimeBindings } from "@/lib/runtime";
import type { AnalysisResult } from "@/lib/types";

export const runtime = "nodejs";

const requestSchema = z.object({
  ticketId: z.string().regex(/^SD-\d{4}$/),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Select one of the fictional demo tickets to analyze." }, { status: 400 });
  }
  const ticket = getTicket(parsed.data.ticketId);
  if (!ticket) {
    return NextResponse.json({ error: "This ticket is not part of the fictional demo dataset." }, { status: 404 });
  }

  try {
    const bindings = await getRuntimeBindings();
    if (bindings.ANALYZE_RATE_LIMITER) {
      const { success } = await bindings.ANALYZE_RATE_LIMITER.limit({ key: "public-demo:analysis" });
      if (!success) {
        return NextResponse.json({ error: "The public demo is busy. Please retry in one minute." }, { status: 429 });
      }
    } else {
      const requestKey =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "local-demo";
      if (!permitAnalysis(requestKey)) {
        return NextResponse.json({ error: "Analysis limit reached. Please wait a minute and try again." }, { status: 429 });
      }
    }

    const cached = await getLatestAnalysis(bindings.DB, ticket.id);
    if (cached) return NextResponse.json(cached);

    if (!(await acquireAnalysisGenerationLock(bindings.DB, ticket.id))) {
      return NextResponse.json(
        { error: "This sample ticket is already being prepared. Please retry shortly." },
        { status: 409 },
      );
    }
    const articles = retrieveArticles(ticket);
    try {
      const content = await createAnalysisContent(ticket, articles, {
        apiKey: bindings.OPENAI_API_KEY,
        model: bindings.OPENAI_MODEL,
        useFallback: bindings.USE_DEMO_AI_FALLBACK === "true",
      });
      const analysis: AnalysisResult = {
        id: crypto.randomUUID(),
        ticketId: ticket.id,
        createdAt: new Date().toISOString(),
        articles,
        ...content,
        persisted: false,
        cached: false,
      };
      analysis.persisted = await saveAnalysis(bindings.DB, analysis);
      return NextResponse.json(analysis);
    } catch (error) {
      await releaseAnalysisGenerationLock(bindings.DB, ticket.id);
      throw error;
    }
  } catch {
    return NextResponse.json(
      { error: "Analysis could not be completed safely. Please retry or continue with human review." },
      { status: 500 },
    );
  }
}
