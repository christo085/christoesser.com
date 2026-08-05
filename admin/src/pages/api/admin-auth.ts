import type { APIRoute } from 'astro';
import { createSession, revokeSession } from '../../lib/session';
import { checkRateLimit, clearRateLimit, recordFailedAttempt } from '../../lib/rate-limit';

export const prerender = false;

const cookie = (value: string, maxAge: number) => `admin_session=${value}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=${maxAge}`;
const json = (body: unknown, status: number, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...extraHeaders } });

function clientIp(request: Request) {
  return request.headers.get('x-nf-client-connection-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export const POST: APIRoute = async ({ request }) => {
  const configuredPassword = import.meta.env.ADMIN_PASSWORD;
  if (!configuredPassword) return json({ error: 'Temporary admin password is not configured.' }, 503);

  const ip = clientIp(request);
  const limited = await checkRateLimit(ip);
  if (limited) return json({ error: 'Too many attempts. Try again later.' }, 429, { 'Retry-After': String(limited.retryAfterSeconds) });

  const body = await request.json().catch(() => ({}));
  if (body.password !== configuredPassword) {
    await recordFailedAttempt(ip);
    return json({ error: 'Incorrect password.' }, 401);
  }

  await clearRateLimit(ip);
  const { token, maxAge } = await createSession();
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie(token, maxAge) } });
};

export const DELETE: APIRoute = async ({ cookies }) => {
  await revokeSession(cookies.get('admin_session')?.value);
  return new Response(null, { status: 204, headers: { 'Set-Cookie': cookie('', 0) } });
};
