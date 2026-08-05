import { useState } from 'react';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const response = await fetch('/api/admin-auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    if (response.ok) location.href = '/';
    else {
      const result = await response.json().catch(() => ({}));
      setError(result.error ?? 'Unable to sign in.');
    }
    setBusy(false);
  }

  return (
    <main className="login">
      <form onSubmit={submit}>
        <span className="eyebrow">temporary private access</span>
        <h1>Welcome back.</h1>
        <label className="field">
          Password
          <input type="password" required autoFocus value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p style={{ color: '#ff6b5e' }}>{error}</p>}
        <button className="primary" disabled={busy}>{busy ? 'Checking…' : 'Enter dashboard'}</button>
        <p className="muted" style={{ fontSize: '.72rem' }}>Temporary password authentication. Replace this with full authentication before production use.</p>
      </form>
    </main>
  );
}
