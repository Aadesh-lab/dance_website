import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { Button, Card, Field, ImageUpload, PageHeader, TextArea, TextInput } from '../ui';
import type { Testimonial } from '../../lib/types';

const EMPTY: Testimonial = { name: '', role: '', quote: '', image: '', rating: 5, sortOrder: 0 };

export function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [draft, setDraft] = useState<Testimonial>(EMPTY);
  const [err, setErr] = useState<string | null>(null);

  const load = () =>
    api.get<Testimonial[]>('/api/admin/testimonials', true)
      .then((d) => { setItems(d); setErr(null); })
      .catch((e) => setErr(e instanceof Error ? e.message : 'Failed to load'));

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.name || !draft.quote) return;
    await api.post('/api/admin/testimonials', draft, true);
    setDraft(EMPTY);
    load();
  };
  const update = async (a: Testimonial) => { await api.put(`/api/admin/testimonials/${a.id}`, a, true); load(); };
  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm('Delete?')) return;
    await api.del(`/api/admin/testimonials/${id}`, true);
    load();
  };

  return (
    <div>
      <PageHeader title="Testimonials" subtitle="Student reviews shown on the homepage." />
      {err && (
        <div className="mb-4 p-3 bg-amber-100 border border-amber-300 text-amber-900 text-xs">
          Testimonials backend not reachable yet ({err}). New entries will be lost on reload — fallback content will still display on the site.
        </div>
      )}

      <Card className="mb-6">
        <h2 className="font-semibold mb-4">Add testimonial</h2>
        <div className="flex flex-col gap-4">
          <Field label="Name"><TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="Role (e.g. Ballet Student, 3 years)"><TextInput value={draft.role ?? ''} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></Field>
          <Field label="Quote"><TextArea rows={3} value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} /></Field>
          <Field label="Rating (1-5)"><TextInput type="number" min={1} max={5} value={draft.rating ?? 5} onChange={(e) => setDraft({ ...draft, rating: parseInt(e.target.value, 10) || 5 })} /></Field>
          <Field label="Photo"><ImageUpload value={draft.image ?? ''} onChange={(url) => setDraft({ ...draft, image: url })} /></Field>
          <Button onClick={add}><Plus size={16} className="inline mr-1" /> Add</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((t) => (
          <Card key={t.id}>
            <Field label="Name"><TextInput value={t.name} onChange={(e) => setItems(items.map((x) => x.id === t.id ? { ...x, name: e.target.value } : x))} /></Field>
            <div className="my-3"><Field label="Role"><TextInput value={t.role ?? ''} onChange={(e) => setItems(items.map((x) => x.id === t.id ? { ...x, role: e.target.value } : x))} /></Field></div>
            <Field label="Quote"><TextArea rows={3} value={t.quote} onChange={(e) => setItems(items.map((x) => x.id === t.id ? { ...x, quote: e.target.value } : x))} /></Field>
            <div className="my-3"><Field label="Rating"><TextInput type="number" min={1} max={5} value={t.rating ?? 5} onChange={(e) => setItems(items.map((x) => x.id === t.id ? { ...x, rating: parseInt(e.target.value, 10) || 5 } : x))} /></Field></div>
            <Field label="Photo"><ImageUpload value={t.image ?? ''} onChange={(url) => setItems(items.map((x) => x.id === t.id ? { ...x, image: url } : x))} /></Field>
            <div className="flex justify-between mt-4">
              <Button variant="danger" onClick={() => remove(t.id)}><Trash2 size={16} /></Button>
              <Button onClick={() => update(t)}><Save size={16} className="inline mr-1" /> Save</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
