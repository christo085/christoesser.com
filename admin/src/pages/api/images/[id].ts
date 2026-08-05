import type { APIRoute } from 'astro';
import { store } from '../../../lib/content-store';

export const GET: APIRoute = async ({ params }) => { const result = await store.getWithMetadata(`images/${params.id}`); if (!result || typeof result.data === 'string') return new Response('Not found', { status: 404 }); return new Response(result.data as ArrayBuffer, { headers: { 'Content-Type': String(result.metadata?.contentType || 'application/octet-stream'), 'Cache-Control': 'public, max-age=31536000, immutable' } }); };
