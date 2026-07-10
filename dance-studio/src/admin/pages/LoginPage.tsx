import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../lib/auth';
import { Button, Field, TextInput } from '../ui';
import { Brand } from '../../components/Brand';

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-paper gap-6">
      <Brand size="lg" orientation="vertical" />
      <form onSubmit={submit} className="w-full max-w-sm bg-white border border-brand-ink/10 p-10 flex flex-col gap-5 shadow-xl">
        <div className="text-center pb-4 border-b border-brand-ink/10">
          <div className="text-[10px] tracking-[0.3em] uppercase text-brand-muted">Admin Login</div>
        </div>
        <Field label="Username">
          <TextInput value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
        </Field>
        <Field label="Password">
          <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        {err && <div className="text-sm text-red-500">{err}</div>}
        <Button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
      </form>
    </div>
  );
}
