import { useEffect, useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { api } from '../../lib/api';
import { Button, Card, PageHeader, Select, TextInput } from '../ui';
import type { GalleryCategory, GalleryItem } from '../../lib/types';

const CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: 'studio', label: 'Studio Photos' },
  { value: 'competitions', label: 'Competitions' },
  { value: 'certificates', label: 'Certificates' },
  { value: 'events', label: 'Events' },
];

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState<GalleryCategory>('studio');

  const load = () => api.get<GalleryItem[]>('/api/admin/gallery', true).then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true); setErr(null);
    try {
      for (const f of files) {
        const { url } = await api.upload(f);
        await api.post('/api/admin/gallery', { url, caption: f.name.replace(/\.[^.]+$/, ''), category: uploadCategory, sortOrder: 0 }, true);
      }
      load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm('Delete this image?')) return;
    await api.del(`/api/admin/gallery/${id}`, true);
    load();
  };

  const updateItem = async (item: GalleryItem) => {
    await api.put(`/api/admin/gallery/${item.id}`, item, true);
  };

  return (
    <div>
      <PageHeader
        title="Gallery"
        subtitle="Studio photos and clips — uploaded to MinIO. Categorize each item to power the public tab filter."
        action={
          <div className="flex items-center gap-3">
            <Select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value as GalleryCategory)}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
            <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand-gold hover:bg-brand-gold-dark text-white ${busy ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload size={16} /> {busy ? 'Uploading…' : 'Upload'}
              <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={onFiles} />
            </label>
          </div>
        }
      />
      {err && <div className="mb-4 text-sm text-red-400">{err}</div>}

      {items.length === 0 ? (
        <Card><p className="text-sm text-brand-muted">No gallery items yet.</p></Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((it) => (
            <Card key={it.id} className="p-3">
              <img src={it.url} alt={it.caption ?? ''} className="w-full aspect-square object-cover rounded-lg mb-2" />
              <TextInput
                value={it.caption ?? ''}
                onChange={(e) => setItems(items.map((x) => x.id === it.id ? { ...x, caption: e.target.value } : x))}
                onBlur={() => updateItem(it)}
                placeholder="Caption"
              />
              <div className="mt-2">
                <Select
                  value={it.category ?? 'studio'}
                  onChange={(e) => {
                    const updated = { ...it, category: e.target.value as GalleryCategory };
                    setItems(items.map((x) => x.id === it.id ? updated : x));
                    updateItem(updated);
                  }}
                >
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </Select>
              </div>
              <div className="flex justify-end mt-2">
                <Button variant="danger" onClick={() => remove(it.id)}><Trash2 size={14} /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
