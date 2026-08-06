import { useEffect, useState } from 'react';
import AdminNav from './AdminNav';

type Album = { id: string; title: string; slug: string; description: string; published: boolean };

function persistPatch(body: Record<string, unknown>) {
  fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    .then((response) => { if (!response.ok) console.error('Failed to save change', body); })
    .catch((error) => console.error('Failed to save change', error));
}

export default function AlbumEditor() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/content?admin=1')
      .then((response) => response.json())
      .then((data) => setAlbums(data.albums ?? []));
  }, []);

  async function addAlbum() {
    if (!title.trim()) return;
    setBusy(true);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const item = { title, slug, description: '', published: false };
    const response = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'albums', item }) });
    if (response.ok) {
      const created = await response.json();
      setAlbums((current) => [created, ...current]);
    }
    setTitle('');
    setBusy(false);
  }

  function saveField(id: string, changes: Partial<Album>) {
    setAlbums((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));
    persistPatch({ type: 'albums', id, changes });
  }

  function toggle(album: Album) {
    saveField(album.id, { published: !album.published });
  }

  async function remove(album: Album) {
    if (!confirm('Delete this album?')) return;
    await fetch('/api/content', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'albums', id: album.id }) });
    setAlbums((current) => current.filter((item) => item.id !== album.id));
  }

  return (
    <div className="shell">
      <AdminNav active="/content" />
      <main className="main">
        <span className="eyebrow">content manager</span>
        <h1>Manage albums.</h1>

        <div className="panel">
          <div className="row">
            <input aria-label="New album title" placeholder="New album title" value={title} onChange={(event) => setTitle(event.target.value)} />
            <button className="primary" disabled={busy} onClick={addAlbum}>{busy ? 'Saving…' : 'Add album'}</button>
          </div>
        </div>

        {albums.length ? (
          <div className="project-list">
            {albums.map((album) => (
              <div className="project-item" key={album.id}>
                <label className="field">
                  Title
                  <input type="text" defaultValue={album.title} onBlur={(event) => saveField(album.id, { title: event.target.value })} />
                </label>
                <label className="field">
                  Description
                  <textarea rows={2} defaultValue={album.description} onBlur={(event) => saveField(album.id, { description: event.target.value })} />
                </label>
                <div className="project-footer">
                  <span className="tag">{album.published ? 'Published' : 'Draft'}</span>
                  <div className="row">
                    <button className="muted" onClick={() => toggle(album)}>{album.published ? 'Unpublish' : 'Publish'}</button>
                    <button className="danger" onClick={() => remove(album)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">No albums yet. Add one above.</div>
        )}
      </main>
    </div>
  );
}
