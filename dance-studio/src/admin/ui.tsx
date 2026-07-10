import { useState } from 'react';
import { api } from '../lib/api';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-10 pb-6 border-b border-brand-ink/10">
      <div>
        <h1 className="font-serif text-4xl text-brand-ink">{title}</h1>
        {subtitle && <p className="text-brand-muted text-sm mt-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.25em] text-brand-muted font-semibold mb-2">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-brand-paper border border-brand-ink/15 px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-gold transition-colors ${props.className ?? ''}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-brand-paper border border-brand-ink/15 px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-gold transition-colors ${props.className ?? ''}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full bg-brand-paper border border-brand-ink/15 px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-gold transition-colors ${props.className ?? ''}`}
    />
  );
}

export function Button({ variant = 'primary', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const styles: Record<string, string> = {
    primary: 'bg-brand-gold hover:bg-brand-gold-dark text-white',
    ghost: 'bg-brand-paper hover:bg-brand-pink-soft text-brand-ink border border-brand-ink/15',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  return (
    <button
      {...rest}
      className={`px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${rest.className ?? ''}`}
    />
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-brand-ink/10 p-6 shadow-sm ${className}`}>{children}</div>
  );
}

export function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr(null);
    try {
      const { url } = await api.upload(file);
      onChange(url);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {value && (
        <img src={value} alt="" className="w-16 h-16 object-cover border border-brand-ink/10" />
      )}
      <div className="flex-1 flex flex-col gap-2">
        <TextInput value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or upload…" />
        <label className="text-[10px] tracking-[0.25em] uppercase text-brand-gold cursor-pointer hover:text-brand-gold-dark font-semibold">
          {busy ? 'Uploading…' : 'Upload from device'}
          <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
        </label>
        {err && <span className="text-xs text-red-500">{err}</span>}
      </div>
    </div>
  );
}
