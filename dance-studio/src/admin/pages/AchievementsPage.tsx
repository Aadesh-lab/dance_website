import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { Button, Card, Field, ImageUpload, PageHeader, TextArea, TextInput } from '../ui';
import type { Achievement } from '../../lib/types';

const EMPTY: Achievement = { title: '', description: '', year: '', image: '', sortOrder: 0 };

export function AchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [draft, setDraft] = useState<Achievement>(EMPTY);
  const [err, setErr] = useState<string | null>(null);

  const load = () =>
    api.get<Achievement[]>('/api/admin/achievements', true)
      .then((d) => { setItems(d); setErr(null); })
      .catch((e) => setErr(e instanceof Error ? e.message : 'Failed to load'));
  useEffect(() => { load(); }, []);

  const add = async () => { if (!draft.title) return; await api.post('/api/admin/achievements', draft, true); setDraft(EMPTY); load(); };
  const update = async (a: Achievement) => { await api.put(`/api/admin/achievements/${a.id}`, a, true); load(); };
  const remove = async (id?: number) => { if (!id) return; if (!confirm('Delete?')) return; await api.del(`/api/admin/achievements/${id}`, true); load(); };

  return (
    <div>
      <PageHeader title="Achievements" subtitle="Awards, recognitions and milestones." />
      {err && (
        <div className="mb-4 p-3 bg-amber-100 border border-amber-300 text-amber-900 text-xs">
          Achievements backend not reachable ({err}). Fallback content still renders on the public site.
        </div>
      )}

      <Card className="mb-6">
        <h2 className="font-semibold mb-4">Add achievement</h2>
        <div className="flex flex-col gap-4">
          <Field label="Title"><TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="Description"><TextArea rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
          <Field label="Year"><TextInput value={draft.year ?? ''} onChange={(e) => setDraft({ ...draft, year: e.target.value })} /></Field>
          <Field label="Image (optional)"><ImageUpload value={draft.image ?? ''} onChange={(url) => setDraft({ ...draft, image: url })} /></Field>
          <Button onClick={add}><Plus size={16} className="inline mr-1" /> Add</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((a) => (
          <Card key={a.id}>
            <Field label="Title"><TextInput value={a.title} onChange={(e) => setItems(items.map((x) => x.id === a.id ? { ...x, title: e.target.value } : x))} /></Field>
            <div className="my-3"><Field label="Description"><TextArea rows={2} value={a.description} onChange={(e) => setItems(items.map((x) => x.id === a.id ? { ...x, description: e.target.value } : x))} /></Field></div>
            <div className="my-3"><Field label="Year"><TextInput value={a.year ?? ''} onChange={(e) => setItems(items.map((x) => x.id === a.id ? { ...x, year: e.target.value } : x))} /></Field></div>
            <Field label="Image"><ImageUpload value={a.image ?? ''} onChange={(url) => setItems(items.map((x) => x.id === a.id ? { ...x, image: url } : x))} /></Field>
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
