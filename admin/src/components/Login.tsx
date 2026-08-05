import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [code, setCode] = useState('');
  const [factorId, setFactorId] = useState(''); const [challengeId, setChallengeId] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    if (!factorId) {
      const signIn = await supabase.auth.signInWithPassword({ email, password });
      if (signIn.error) { setError(signIn.error.message); setBusy(false); return; }
      const factors = await supabase.auth.mfa.listFactors(); const factor = factors.data?.totp.find((item) => item.status === 'verified');
      if (!factor) { setError('No verified MFA factor is enrolled for this account.'); setBusy(false); return; }
      const challenge = await supabase.auth.mfa.challenge({ factorId: factor.id });
      if (challenge.error) { setError(challenge.error.message); setBusy(false); return; }
      setFactorId(factor.id); setChallengeId(challenge.data.id); setBusy(false); return;
    }
    const verified = await supabase.auth.mfa.verify({ factorId, challengeId, code });
    if (verified.error) setError(verified.error.message); else location.href = '/'; setBusy(false);
  }
  return <main className="login"><form onSubmit={submit}><span className="eyebrow">Private access</span><h1>{factorId ? 'Confirm identity.' : 'Welcome back.'}</h1>{!factorId && <><label className="field">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><label className="field">Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label></>}{factorId && <label className="field">Authenticator code<input inputMode="numeric" pattern="[0-9]{6}" required value={code} onChange={(e) => setCode(e.target.value)} /></label>}{error && <p style={{ color: '#ff8e8e' }}>{error}</p>}<button className="primary" disabled={busy}>{busy ? 'Checking…' : factorId ? 'Verify' : 'Sign in'}</button></form></main>;
}
