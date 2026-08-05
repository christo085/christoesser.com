import { getStore } from '@netlify/blobs';

const SESSION_TTL_SECONDS = 60 * 60 * 12;
const sessionStore = () => getStore({ name: 'christo-sessions', consistency: 'strong' });

type SessionRecord = { expiresAt: number };

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function createSession() {
  const token = randomToken();
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  await sessionStore().setJSON(token, { expiresAt } satisfies SessionRecord);
  return { token, maxAge: SESSION_TTL_SECONDS };
}

export async function isValidSession(token: string | undefined) {
  if (!token) return false;
  const record = await sessionStore().get(token, { type: 'json' }) as SessionRecord | null;
  if (!record) return false;
  if (record.expiresAt < Date.now()) {
    await sessionStore().delete(token);
    return false;
  }
  return true;
}

export async function revokeSession(token: string | undefined) {
  if (!token) return;
  await sessionStore().delete(token);
}
