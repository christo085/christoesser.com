const encoder = new TextEncoder();

function secret() {
  return import.meta.env.ADMIN_PASSWORD || '';
}

export async function createSessionToken() {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode('christo-admin-session'));
  return btoa(String.fromCharCode(...new Uint8Array(signature))).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

export async function isValidSession(token: string | undefined) {
  if (!token || !secret()) return false;
  return token === await createSessionToken();
}
