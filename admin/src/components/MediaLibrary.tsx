import { useEffect, useRef, useState } from 'react';
import AdminNav from './AdminNav';

type Photo = {
  id: string;
  title: string;
  description: string;
  image_path: string;
  album_id: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
};

type Album = { id: string; title: string };

function persistPatch(body: Record<string, unknown>) {
  fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    .then((response) => { if (!response.ok) console.error('Failed to save change', body); })
    .catch((error) => console.error('Failed to save change', error));
}

export default function MediaLibrary() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/content?admin=1')
      .then((response) => response.json())
      .then((data) => { setPhotos(data.photos ?? []); setAlbums(data.albums ?? []); });
  }, []);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (!list.length) return;
    setUploading(list.length);
    const created: Photo[] = [];
    for (const file of list) {
      const form = new FormData();
      form.set('file', file);
      form.set('title', file.name.replace(/\.[^.]+$/, ''));
      const response = await fetch('/api/upload', { method: 'POST', body: form });
      if (response.ok) created.push(await response.json());
      setUploading((count) => Math.max(0, count - 1));
    }
    if (created.length) setPhotos((current) => [...created, ...current]);
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files.length) uploadFiles(event.dataTransfer.files);
  }

  function reorder(nextOrder: Photo[]) {
    setPhotos(nextOrder);
    persistPatch({ type: 'photos', reorder: nextOrder.map((photo) => photo.id) });
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= photos.length) return;
    const next = [...photos];
    [next[index], next[target]] = [next[target], next[index]];
    reorder(next);
  }

  function saveChanges(photo: Photo, changes: Partial<Photo>) {
    setPhotos((current) => current.map((item) => (item.id === photo.id ? { ...item, ...changes } : item)));
    persistPatch({ type: 'photos', id: photo.id, changes });
  }

  function toggle(photo: Photo) {
    saveChanges(photo, { published: !photo.published });
  }

  function saveField(photo: Photo, field: 'title' | 'description', value: string) {
    if (value === photo[field]) return;
    saveChanges(photo, { [field]: value });
  }

  async function remove(photo: Photo) {
    if (!confirm('Delete this photo?')) return;
    await fetch('/api/content', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'photos', id: photo.id }) });
    setPhotos((current) => current.filter((item) => item.id !== photo.id));
  }

  return (
    <div className="shell">
      <AdminNav active="/media" />
      <main className="main">
        <span className="eyebrow">content manager</span>
        <h1>Manage photos.</h1>

        <div
          className={`dropzone${dragOver ? ' drag-over' : ''}`}
          onDragOver={(event) => { event.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          {uploading ? `Uploading ${uploading}…` : (
            <>
              Drag images here, or <label htmlFor="media-upload">browse files</label>
              <input
                ref={inputRef}
                id="media-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => { if (event.target.files) uploadFiles(event.target.files); event.target.value = ''; }}
              />
            </>
          )}
        </div>

        {photos.length ? (
          <div className="media-grid">
            {photos.map((photo, index) => (
              <div className="media-item" key={photo.id}>
                <div className="media-thumb">
                  <span className={`media-status${photo.published ? ' published' : ''}`}>{photo.published ? 'Published' : 'Draft'}</span>
                  <img src={`/api/images/${photo.id}`} alt={photo.title || 'Untitled'} loading="lazy" />
                </div>
                <div className="media-body">
                  <input
                    type="text"
                    defaultValue={photo.title}
                    placeholder="Title"
                    onBlur={(event) => saveField(photo, 'title', event.target.value)}
                  />
                  <textarea
                    defaultValue={photo.description}
                    placeholder="Caption / description"
                    onBlur={(event) => saveField(photo, 'description', event.target.value)}
                  />
                  <select value={photo.album_id ?? ''} onChange={(event) => saveChanges(photo, { album_id: event.target.value || null })}>
                    <option value="">No album</option>
                    {albums.map((album) => <option key={album.id} value={album.id}>{album.title}</option>)}
                  </select>
                  <label className="checkbox-field">
                    <input type="checkbox" checked={photo.featured} onChange={(event) => saveChanges(photo, { featured: event.target.checked })} />
                    Featured
                  </label>
                  <div className="media-actions">
                    <div className="row">
                      <button className="icon-btn" disabled={index === 0} onClick={() => move(index, -1)}>&uarr;</button>
                      <button className="icon-btn" disabled={index === photos.length - 1} onClick={() => move(index, 1)}>&darr;</button>
                    </div>
                    <div className="row">
                      <button className="muted-btn" onClick={() => toggle(photo)}>{photo.published ? 'Unpublish' : 'Publish'}</button>
                      <button className="danger" onClick={() => remove(photo)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">No photos yet. Upload the first one above.</div>
        )}
      </main>
    </div>
  );
}
