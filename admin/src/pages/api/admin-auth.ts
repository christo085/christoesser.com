import type { APIRoute } from 'astro';
import { createSessionToken } from '../../lib/session';

export const prerender = false;

const cookie = (value: string, maxAge: number) => `admin_session=${value}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=${maxAge}`;

export const POST: APIRoute = async ({ request }) => {
  const configuredPassword = import.meta.env.ADMIN_PASSWORD;
  if (!configuredPassword) return new Response(JSON.stringify({ error: 'Temporary admin password is not configured.' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  const body = await request.json().catch(() => ({}));
  if (body.password !== configuredPassword) return new Response(JSON.stringify({ error: 'Incorrect password.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie(await createSessionToken(), 60 * 60 * 12) } });
};

export const DELETE: APIRoute = async () => new Response(null, { status: 204, headers: { 'Set-Cookie': cookie('', 0) } });
