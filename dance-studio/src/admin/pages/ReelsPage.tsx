import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Upload } from 'lucide-react';
import { api } from '../../lib/api';
import { Button, Card, Field, ImageUpload, PageHeader, TextInput } from '../ui';
import type { Reel } from '../../lib/types';

const EMPTY: Reel = { title: '', videoUrl: '', thumbnailUrl: '', sortOrder: 0 };

export function ReelsPage() {
  const [items, setItems] = useState<Reel[]>([]);
  const [draft, setDraft] = useState<Reel>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = () => api.get<Reel[]>('/api/admin/reels', true).then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.videoUrl) return;
    await api.post('/api/admin/reels', draft, true);
    setDraft(EMPTY); load();
  };

  const update = async (r: Reel) => { await api.put(`/api/admin/reels/${r.id}`, r, true); load(); };
  const remove = async (id?: number) => { if (!id) return; if (!confirm('Delete this reel?')) return; await api.del(`/api/admin/reels/${id}`, true); load(); };

  const onBulk = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true); setErr(null);
    try {
      for (const f of files) {
        const { url } = await api.upload(f);
        await api.post('/api/admin/reels', { title: f.name.replace(/\.[^.]+$/, ''), videoUrl: url, sortOrder: 0 }, true);
      }
      load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <PageHeader
        title="Reels"
        subtitle="Short videos shown in the Reels section on the public site"
        action={
          <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand-gold hover:bg-brand-gold-dark text-white ${busy ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload size={16} /> {busy ? 'Uploading…' : 'Bulk upload'}
            <input type="file" accept="video/*" multiple className="hidden" onChange={onBulk} />
          </label>
        }
      />

      {err && <div className="mb-4 text-sm text-red-400">{err}</div>}

      <Card className="mb-6">
        <h2 className="font-semibold mb-4">Add reel manually</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title"><TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="Sort order"><TextInput type="number" value={draft.sortOrder ?? 0} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} /></Field>
          <div className="md:col-span-2">
            <Field label="Video"><ImageUpload value={draft.videoUrl} onChange={(url) => setDraft({ ...draft, videoUrl: url })} /></Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Thumbnail (optional)"><ImageUpload value={draft.thumbnailUrl ?? ''} onChange={(url) => setDraft({ ...draft, thumbnailUrl: url })} /></Field>
          </div>
        </div>
        <div className="mt-4"><Button onClick={add}><Plus size={16} className="inline mr-1" /> Add reel</Button></div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((r) => (
          <Card key={r.id}>
            <div className="aspect-[9/16] rounded-lg overflow-hidden bg-black mb-3">
              <video src={r.videoUrl} poster={r.thumbnailUrl || undefined} muted controls className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-3">
              <Field label="Title"><TextInput value={r.title} onChange={(e) => setItems(items.map((x) => x.id === r.id ? { ...x, title: e.target.value } : x))} /></Field>
              <Field label="Sort order"><TextInput type="number" value={r.sortOrder ?? 0} onChange={(e) => setItems(items.map((x) => x.id === r.id ? { ...x, sortOrder: Number(e.target.value) } : x))} /></Field>
              <Field label="Video URL"><TextInput value={r.videoUrl} onChange={(e) => setItems(items.map((x) => x.id === r.id ? { ...x, videoUrl: e.target.value } : x))} /></Field>
              <Field label="Thumbnail"><ImageUpload value={r.thumbnailUrl ?? ''} onChange={(url) => setItems(items.map((x) => x.id === r.id ? { ...x, thumbnailUrl: url } : x))} /></Field>
              <div className="flex justify-between mt-2">
                <Button variant="danger" onClick={() => remove(r.id)}><Trash2 size={16} /></Button>
                <Button onClick={() => update(r)}><Save size={16} className="inline mr-1" /> Save</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
