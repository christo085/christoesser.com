import type { APIRoute } from 'astro';
import { isValidSession } from '../../lib/session';
import { id, now, readContent, store, writeContent } from '../../lib/content-store';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!await isValidSession(cookies.get('admin_session')?.value)) return new Response('Unauthorized', { status: 401 });

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return new Response('Image file required', { status: 400 });

  const imageId = id();
  const path = `images/${imageId}`;
  await store.set(path, await file.arrayBuffer(), { metadata: { contentType: file.type, filename: file.name } });

  if (form.get('target') === 'project') {
    const projectId = String(form.get('projectId') || '');
    const content = await readContent();
    const project = content.projects.find((entry) => entry.id === projectId);
    if (!project) return new Response('Project not found', { status: 404 });
    project.image_path = imageId;
    await writeContent(content);
    return new Response(JSON.stringify(project), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  const content = await readContent();
  const item = {
    id: imageId,
    album_id: null,
    title: String(form.get('title') || file.name),
    description: '',
    image_path: path,
    sort_order: content.photos.length,
    featured: false,
    published: false,
    created_at: now(),
  };
  content.photos.unshift(item);
  await writeContent(content);

  return new Response(JSON.stringify(item), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
