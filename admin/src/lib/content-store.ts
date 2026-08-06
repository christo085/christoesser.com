import { getStore } from '@netlify/blobs';

export type StoredPhoto = { id: string; album_id: string | null; title: string; description: string; image_path: string; sort_order: number; featured: boolean; published: boolean; created_at: string };
export type StoredAlbum = { id: string; title: string; slug: string; description: string; sort_order: number; published: boolean; created_at: string };
export type StoredProject = { id: string; title: string; slug: string; description: string; technologies: string[]; links: { label: string; url: string }[]; image_path: string | null; date: string | null; category: string; featured: boolean; published: boolean; created_at: string };
export type ContentState = { albums: StoredAlbum[]; photos: StoredPhoto[]; projects: StoredProject[]; settings: Record<string, string> };

const store = getStore({ name: 'christo-content', consistency: 'strong' });
const key = 'content.json';
const empty: ContentState = { albums: [], photos: [], projects: [], settings: {} };

export async function readContent() {
  const content = (await store.get(key, { type: 'json' }) as ContentState | null) ?? empty;
  return { ...empty, ...content };
}
export async function writeContent(content: ContentState) { await store.setJSON(key, content); return content; }
export function id() { return crypto.randomUUID(); }
export function now() { return new Date().toISOString(); }
export { store };
