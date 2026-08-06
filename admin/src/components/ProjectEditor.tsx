import { useEffect, useState } from 'react';
import { projectCategories } from '@christoesser/shared';
import AdminNav from './AdminNav';

type ProjectLink = { label: string; url: string };
type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  links: ProjectLink[];
  image_path: string | null;
  date: string | null;
  category: string;
  featured: boolean;
  published: boolean;
};

function persistPatch(body: Record<string, unknown>) {
  fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    .then((response) => { if (!response.ok) console.error('Failed to save change', body); })
    .catch((error) => console.error('Failed to save change', error));
}

export default function ProjectEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/content?admin=1')
      .then((response) => response.json())
      .then((data) => setProjects(data.projects ?? []));
  }, []);

  async function addProject() {
    if (!title.trim()) return;
    setBusy(true);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const item = { title, slug, description: '', technologies: [], links: [], image_path: null, published: false, featured: false, category: projectCategories[0], date: null };
    const response = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'projects', item }) });
    if (response.ok) {
      const created = await response.json();
      setProjects((current) => [created, ...current]);
    }
    setTitle('');
    setBusy(false);
  }

  function updateLocal(id: string, changes: Partial<Project>) {
    setProjects((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  }

  function saveField(id: string, changes: Partial<Project>) {
    updateLocal(id, changes);
    persistPatch({ type: 'projects', id, changes });
  }

  function addLink(project: Project) {
    updateLocal(project.id, { links: [...project.links, { label: '', url: '' }] });
  }

  function updateLink(project: Project, index: number, field: keyof ProjectLink, value: string) {
    const links = project.links.map((link, i) => (i === index ? { ...link, [field]: value } : link));
    updateLocal(project.id, { links });
  }

  function removeLink(project: Project, index: number) {
    saveField(project.id, { links: project.links.filter((_, i) => i !== index) });
  }

  function toggle(project: Project) {
    saveField(project.id, { published: !project.published });
  }

  async function uploadCover(project: Project, file: File) {
    const form = new FormData();
    form.set('file', file);
    form.set('target', 'project');
    form.set('projectId', project.id);
    const response = await fetch('/api/upload', { method: 'POST', body: form });
    if (response.ok) {
      const updated = await response.json();
      setProjects((current) => current.map((item) => (item.id === project.id ? updated : item)));
    }
  }

  async function remove(project: Project) {
    if (!confirm('Delete this project?')) return;
    await fetch('/api/content', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'projects', id: project.id }) });
    setProjects((current) => current.filter((item) => item.id !== project.id));
  }

  return (
    <div className="shell">
      <AdminNav active="/projects" />
      <main className="main">
        <span className="eyebrow">content manager</span>
        <h1>Manage projects.</h1>

        <div className="panel">
          <div className="row">
            <input aria-label="New project title" placeholder="New project title" value={title} onChange={(event) => setTitle(event.target.value)} />
            <button className="primary" disabled={busy} onClick={addProject}>{busy ? 'Saving…' : 'Add project'}</button>
          </div>
        </div>

        {projects.length ? (
          <div className="project-list">
            {projects.map((project) => (
              <div className="project-item" key={project.id}>
                <div className="row" style={{ gap: 14 }}>
                  {project.image_path && (
                    <img src={`/api/images/${project.image_path}`} alt="" style={{ width: 96, height: 64, objectFit: 'cover', border: '1px solid var(--line)' }} />
                  )}
                  <label className="muted-btn" style={{ cursor: 'pointer' }}>
                    {project.image_path ? 'Replace cover image' : 'Add cover image'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadCover(project, file); event.target.value = ''; }}
                    />
                  </label>
                </div>

                <div className="project-fields">
                  <label className="field">
                    Title
                    <input type="text" defaultValue={project.title} onBlur={(event) => saveField(project.id, { title: event.target.value })} />
                  </label>
                  <label className="field">
                    Category
                    <select value={project.category} onChange={(event) => saveField(project.id, { category: event.target.value })}>
                      {projectCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                    </select>
                  </label>
                  <label className="field">
                    Date
                    <input type="text" placeholder="e.g. 2026 or Ongoing" defaultValue={project.date ?? ''} onBlur={(event) => saveField(project.id, { date: event.target.value.trim() || null })} />
                  </label>
                </div>

                <label className="field">
                  Description
                  <textarea rows={3} defaultValue={project.description} onBlur={(event) => saveField(project.id, { description: event.target.value })} />
                </label>

                <label className="field">
                  Technologies (comma separated)
                  <input
                    type="text"
                    defaultValue={project.technologies.join(', ')}
                    onBlur={(event) => saveField(project.id, { technologies: event.target.value.split(',').map((tech) => tech.trim()).filter(Boolean) })}
                  />
                </label>

                <div className="field">
                  Links
                  <div className="links-list">
                    {project.links.map((link, index) => (
                      <div className="links-row" key={index}>
                        <input type="text" placeholder="Label" value={link.label} onChange={(event) => updateLink(project, index, 'label', event.target.value)} onBlur={() => saveField(project.id, { links: project.links })} />
                        <input type="text" placeholder="https://…" value={link.url} onChange={(event) => updateLink(project, index, 'url', event.target.value)} onBlur={() => saveField(project.id, { links: project.links })} />
                        <button className="icon-btn" onClick={() => removeLink(project, index)}>Remove</button>
                      </div>
                    ))}
                  </div>
                  <button className="muted-btn" style={{ justifySelf: 'start' }} onClick={() => addLink(project)}>+ Add link</button>
                </div>

                <div className="project-footer">
                  <label className="checkbox-field">
                    <input type="checkbox" checked={project.featured} onChange={(event) => saveField(project.id, { featured: event.target.checked })} />
                    Featured
                  </label>
                  <div className="row">
                    <button className="muted" onClick={() => toggle(project)}>{project.published ? 'Unpublish' : 'Publish'}</button>
                    <button className="danger" onClick={() => remove(project)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">No projects yet. Add one above.</div>
        )}
      </main>
    </div>
  );
}
