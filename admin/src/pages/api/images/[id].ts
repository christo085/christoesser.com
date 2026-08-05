import type { APIRoute } from 'astro';
import { store } from '../../../lib/content-store';

export const GET: APIRoute = async ({ params }) => {
  const result = await store.getWithMetadata(`images/${params.id}`, { type: 'arrayBuffer' });
  if (!result) return new Response('Not found', { status: 404 });
  return new Response(result.data, {
    headers: {
      'Content-Type': String(result.metadata?.contentType || 'application/octet-stream'),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
