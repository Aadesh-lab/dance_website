import { useEffect, useState } from 'react';
import { Trash2, Upload, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { Button, Card, Field, PageHeader, TextArea, TextInput } from '../ui';
import type { Certificate } from '../../lib/types';

export function CertificatesPage() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = () =>
    api.get<Certificate[]>('/api/admin/certificates', true).then(setItems).catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setErr(null);
    try {
      for (const f of files) {
        const { url } = await api.upload(f);
        await api.post(
          '/api/admin/certificates',
          {
            title: f.name.replace(/\.[^.]+$/, ''),
            image: url,
            description: '',
            sortOrder: 0,
          },
          true,
        );
      }
      load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const save = async (c: Certificate) => {
    await api.put(`/api/admin/certificates/${c.id}`, c, true);
    load();
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm('Delete this certificate?')) return;
    await api.del(`/api/admin/certificates/${id}`, true);
    load();
  };

  return (
    <div>
      <PageHeader
        title="Certificates"
        subtitle="Awards, achievements & recognitions — uploaded to MinIO"
        action={
          <label
            className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand-gold hover:bg-brand-gold-dark text-white ${busy ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Upload size={16} /> {busy ? 'Uploading…' : 'Upload certificate(s)'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onFiles}
            />
          </label>
        }
      />
      {err && <div className="mb-4 text-sm text-red-400">{err}</div>}

      {items.length === 0 ? (
        <Card>
          <p className="text-sm text-brand-muted">
            No certificates yet — upload one to get started.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => (
            <Card key={c.id} className="p-3">
              <img
                src={c.image}
                alt={c.title}
                className="w-full aspect-[4/3] object-cover rounded-lg mb-3 bg-brand-paper"
              />
              <div className="flex flex-col gap-3">
                <Field label="Title">
                  <TextInput
                    value={c.title}
                    onChange={(e) =>
                      setItems(items.map((x) => (x.id === c.id ? { ...x, title: e.target.value } : x)))
                    }
                  />
                </Field>
                <Field label="Description">
                  <TextArea
                    rows={2}
                    value={c.description ?? ''}
                    onChange={(e) =>
                      setItems(
                        items.map((x) => (x.id === c.id ? { ...x, description: e.target.value } : x)),
                      )
                    }
                  />
                </Field>
                <Field label="Sort order">
                  <TextInput
                    type="number"
                    value={c.sortOrder ?? 0}
                    onChange={(e) =>
                      setItems(
                        items.map((x) =>
                          x.id === c.id ? { ...x, sortOrder: Number(e.target.value) } : x,
                        ),
                      )
                    }
                  />
                </Field>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button variant="danger" onClick={() => remove(c.id)}>
                  <Trash2 size={14} />
                </Button>
                <Button onClick={() => save(c)}>
                  <Save size={14} className="inline mr-1" /> Save
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
