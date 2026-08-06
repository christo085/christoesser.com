import { useEffect, useState } from 'react';
import AdminNav from './AdminNav';

const fields: { key: string; label: string; page: string; fallback: string; multiline?: boolean }[] = [
  { key: 'hero_subhead', label: 'Hero subhead', page: 'Home', fallback: 'Photographer, filmmaker, and builder of software and hardware.' },
  { key: 'about_headline', label: 'Headline', page: 'About', fallback: 'Photographer. Engineer.' },
  { key: 'about_bio', label: 'Bio', page: 'About', fallback: "I'm Christo. I photograph places and people, make films, write software, build physical things, and self-host the systems that keep them moving.", multiline: true },
  { key: 'photography_subhead', label: 'Subhead', page: 'Photography', fallback: 'A living collection of images. Albums and descriptions are managed privately and will grow over time.', multiline: true },
  { key: 'contact_subhead', label: 'Subhead', page: 'Contact', fallback: 'For collaborations, questions, or anything else.' },
];

export default function SiteTextEditor() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/content?admin=1')
      .then((response) => response.json())
      .then((data) => { setSettings(data.settings ?? {}); setLoaded(true); });
  }, []);

  function save(key: string, value: string) {
    setSettings((current) => ({ ...current, [key]: value }));
    fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'settings', changes: { [key]: value } }) })
      .catch((error) => console.error('Failed to save site text', error));
  }

  return (
    <div className="shell">
      <AdminNav active="/settings" />
      <main className="main">
        <span className="eyebrow">content manager</span>
        <h1>Manage site text.</h1>
        <p className="muted" style={{ marginTop: -24, marginBottom: 32 }}>
          Leave a field blank to use the default copy shown as its placeholder.
        </p>

        {loaded && (
          <div className="project-list">
            {fields.map((field) => (
              <div className="project-item" key={field.key}>
                <label className="field">
                  {field.page} &mdash; {field.label}
                  {field.multiline ? (
                    <textarea
                      rows={3}
                      defaultValue={settings[field.key] ?? ''}
                      placeholder={field.fallback}
                      onBlur={(event) => save(field.key, event.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      defaultValue={settings[field.key] ?? ''}
                      placeholder={field.fallback}
                      onBlur={(event) => save(field.key, event.target.value)}
                    />
                  )}
                </label>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
