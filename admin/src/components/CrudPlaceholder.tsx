import { useEffect, useState } from 'react';

type Item = { id: string; title?: string; key?: string; published?: boolean };

export default function CrudPlaceholder() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/content?admin=1')
      .then((response) => response.json())
      .then((data) => setItems(data.albums ?? []));
  }, []);

  async function add() {
    if (!title.trim()) return;
    setBusy(true);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const item = { title, slug, description: '', published: false };
    const response = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'albums', item }) });
    if (response.ok) setItems([await response.json(), ...items]);
    setTitle('');
    setBusy(false);
  }

  async function toggle(item: Item) {
    const response = await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'albums', id: item.id, changes: { published: !item.published } }) });
    if (response.ok) {
      const updated = await response.json();
      setItems(items.map((current) => (current.id === item.id ? updated : current)));
    }
  }

  async function remove(item: Item) {
    if (!confirm('Delete this item?')) return;
    await fetch('/api/content', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'albums', id: item.id }) });
    setItems(items.filter((current) => current.id !== item.id));
  }

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">CE<span>_</span> / CMS</div>
        <nav>
          <a href="/">Overview</a>
          <a className="active" href="/content">Site content</a>
          <a href="/media">Photography</a>
          <a href="/projects">Projects</a>
        </nav>
      </aside>
      <main className="main">
        <span className="eyebrow">content manager</span>
        <h1>Manage albums.</h1>
        <div className="panel">
          <div className="row">
            <input aria-label="New album title" placeholder="New album title" value={title} onChange={(event) => setTitle(event.target.value)} />
            <button className="primary" disabled={busy} onClick={add}>{busy ? 'Saving…' : 'Add'}</button>
          </div>
        </div>
        <div className="panel">
          {items.length ? items.map((item) => (
            <div className="row" key={item.id} style={{ justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
              <span className="row">
                <span className="tag">{item.published ? 'Published' : 'Draft'}</span>
                {item.title ?? item.key}
              </span>
              <div className="row">
                <button className="muted" onClick={() => toggle(item)}>{item.published ? 'Unpublish' : 'Publish'}</button>
                <button className="danger" onClick={() => remove(item)}>Delete</button>
              </div>
            </div>
          )) : <div className="empty">No albums yet. Add one above.</div>}
        </div>
      </main>
    </div>
  );
}
