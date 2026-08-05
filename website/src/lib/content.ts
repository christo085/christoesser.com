import type { Photo, Project } from '@christoesser/shared';

type RemoteContent = { photos: Photo[]; projects: Project[] };
const fallback: RemoteContent = { photos: [], projects: [] };

// The public app has no private credentials. When PUBLIC_CONTENT_API_URL is set,
// it reads only published content from the admin site's public read endpoint.
async function remoteContent(): Promise<RemoteContent> {
  const endpoint = import.meta.env.PUBLIC_CONTENT_API_URL;
  if (!endpoint) return fallback;
  try { const response = await fetch(endpoint, { headers: { Accept: 'application/json' } }); if (!response.ok) return fallback; return await response.json() as RemoteContent; } catch { return fallback; }
}

export async function publishedPhotos() { return (await remoteContent()).photos; }
export async function publishedProjects() { return (await remoteContent()).projects; }
