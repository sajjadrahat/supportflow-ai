type RateWindow = { count: number; resetAt: number };

const requests = new Map<string, RateWindow>();
const WINDOW_MS = 60_000;
const MAX_ANALYSES_PER_MINUTE = 6;

export function permitAnalysis(key: string, now = Date.now()): boolean {
  const current = requests.get(key);
  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_ANALYSES_PER_MINUTE) return false;
  current.count += 1;
  return true;
}
