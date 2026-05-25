import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface RuntimeBindings {
  DB?: D1Database;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  USE_DEMO_AI_FALLBACK?: string;
}

export async function getRuntimeBindings(): Promise<RuntimeBindings> {
  try {
    const context = await getCloudflareContext({ async: true });
    return context.env as RuntimeBindings;
  } catch {
    return {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_MODEL: process.env.OPENAI_MODEL,
      USE_DEMO_AI_FALLBACK: process.env.USE_DEMO_AI_FALLBACK,
    };
  }
}
