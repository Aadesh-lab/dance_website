import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { Button, Card, Field, ImageUpload, PageHeader, TextArea, TextInput } from '../ui';
import type { Advantage } from '../../lib/types';

const EMPTY: Advantage = { title: '', image: '', description: '', sortOrder: 0 };

export function AdvantagesPage() {
  const [items, setItems] = useState<Advantage[]>([]);
  const [draft, setDraft] = useState<Advantage>(EMPTY);

  const load = () => api.get<Advantage[]>('/api/admin/advantages', true).then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const add = async () => { if (!draft.title) return; await api.post('/api/admin/advantages', draft, true); setDraft(EMPTY); load(); };
  const update = async (a: Advantage) => { await api.put(`/api/admin/advantages/${a.id}`, a, true); load(); };
  const remove = async (id?: number) => { if (!id) return; if (!confirm('Delete?')) return; await api.del(`/api/admin/advantages/${id}`, true); load(); };

  return (
    <div>
      <PageHeader title="Advantages" subtitle="Reasons to choose the studio (shown as cards on the site)" />

      <Card className="mb-6">
        <h2 className="font-semibold mb-4">Add advantage</h2>
        <div className="flex flex-col gap-4">
          <Field label="Title"><TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="Description"><TextArea rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
          <Field label="Image"><ImageUpload value={draft.image} onChange={(url) => setDraft({ ...draft, image: url })} /></Field>
          <Button onClick={add}><Plus size={16} className="inline mr-1" /> Add</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((a) => (
          <Card key={a.id}>
            <Field label="Title"><TextInput value={a.title} onChange={(e) => setItems(items.map((x) => x.id === a.id ? { ...x, title: e.target.value } : x))} /></Field>
            <div className="my-3"><Field label="Description"><TextArea rows={2} value={a.description} onChange={(e) => setItems(items.map((x) => x.id === a.id ? { ...x, description: e.target.value } : x))} /></Field></div>
            <Field label="Image"><ImageUpload value={a.image} onChange={(url) => setItems(items.map((x) => x.id === a.id ? { ...x, image: url } : x))} /></Field>
            <div className="flex justify-between mt-4">
              <Button variant="danger" onClick={() => remove(a.id)}><Trash2 size={16} /></Button>
              <Button onClick={() => update(a)}><Save size={16} className="inline mr-1" /> Save</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
