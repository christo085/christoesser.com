import { getStore } from '@netlify/blobs';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

const rateLimitStore = () => getStore({ name: 'christo-ratelimit', consistency: 'strong' });

type AttemptRecord = { count: number; windowStart: number };

export async function checkRateLimit(key: string): Promise<{ retryAfterSeconds: number } | null> {
  const record = await rateLimitStore().get(key, { type: 'json' }) as AttemptRecord | null;
  if (!record) return null;
  const elapsed = Date.now() - record.windowStart;
  if (elapsed > WINDOW_MS) return null;
  if (record.count >= MAX_ATTEMPTS) return { retryAfterSeconds: Math.ceil((WINDOW_MS - elapsed) / 1000) };
  return null;
}

export async function recordFailedAttempt(key: string) {
  const record = await rateLimitStore().get(key, { type: 'json' }) as AttemptRecord | null;
  const now = Date.now();
  if (!record || now - record.windowStart > WINDOW_MS) {
    await rateLimitStore().setJSON(key, { count: 1, windowStart: now } satisfies AttemptRecord);
  } else {
    await rateLimitStore().setJSON(key, { count: record.count + 1, windowStart: record.windowStart } satisfies AttemptRecord);
  }
}

export async function clearRateLimit(key: string) {
  await rateLimitStore().delete(key);
}
