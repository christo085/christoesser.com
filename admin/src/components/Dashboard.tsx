import { useEffect, useState } from 'react';
import AdminNav from './AdminNav';

type Counts = { photos: number; projects: number; albums: number };

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts>({ photos: 0, projects: 0, albums: 0 });

  useEffect(() => {
    fetch('/api/content?admin=1')
      .then((response) => response.json())
      .then((data) => setCounts({ photos: data.photos?.length ?? 0, projects: data.projects?.length ?? 0, albums: data.albums?.length ?? 0 }));
  }, []);

  async function logout() {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    location.href = '/login';
  }

  return (
    <div className="shell">
      <AdminNav active="/">
        <button className="logout" onClick={logout}>Sign out</button>
      </AdminNav>
      <main className="main">
        <span className="eyebrow">control room</span>
        <h1>Good to see you.</h1>
        <p className="muted">Content is stored in Netlify Blobs.</p>
        <div className="stats">
          <div className="stat"><span className="muted">Photos</span><strong>{counts.photos}</strong></div>
          <div className="stat"><span className="muted">Albums</span><strong>{counts.albums}</strong></div>
          <div className="stat"><span className="muted">Projects</span><strong>{counts.projects}</strong></div>
        </div>
        <div className="panel">
          <h2>Publishing</h2>
          <p className="muted">Create content, then publish it from its management page. The public site reads published items through its configured content endpoint.</p>
        </div>
      </main>
    </div>
  );
}
