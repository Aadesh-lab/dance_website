import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { Button, Card, Field, ImageUpload, PageHeader, TextArea, TextInput } from '../ui';
import type { Teacher } from '../../lib/types';

const EMPTY: Teacher = { name: '', specialty: '', image: '', bio: '', quote: '', quoteAuthor: '', sortOrder: 0 };

export function TeachersPage() {
  const [items, setItems] = useState<Teacher[]>([]);
  const [draft, setDraft] = useState<Teacher>(EMPTY);
  const [notice, setNotice] = useState<string | null>(null);

  const load = () =>
    api.get<Teacher[]>('/api/admin/teachers', true)
      .then(setItems)
      .catch((err: unknown) => {
        // Backend endpoint may not exist yet – degrade gracefully so the page doesn't crash.
        setItems([]);
        setNotice(err instanceof Error ? err.message : 'Teachers API unavailable');
      });

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.name) return;
    try {
      await api.post('/api/admin/teachers', draft, true);
      setDraft(EMPTY);
      load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not save teacher (API not available yet)');
    }
  };
  const update = async (t: Teacher) => {
    try { await api.put(`/api/admin/teachers/${t.id}`, t, true); load(); }
    catch (err) { setNotice(err instanceof Error ? err.message : 'Update failed'); }
  };
  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm('Delete?')) return;
    try { await api.del(`/api/admin/teachers/${id}`, true); load(); }
    catch (err) { setNotice(err instanceof Error ? err.message : 'Delete failed'); }
  };

  return (
    <div>
      <PageHeader title="Teachers" subtitle="Instructors shown on the public Teachers page" />

      {notice && (
        <div className="mb-6 border border-amber-200 bg-amber-50 text-amber-900 p-4 text-sm">
          {notice}. Frontend fallbacks will be shown to visitors until the backend Teachers endpoints are added.
        </div>
      )}

      <Card className="mb-6">
        <h2 className="font-semibold mb-4">Add teacher</h2>
        <div className="flex flex-col gap-4">
          <Field label="Name"><TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="Specialty"><TextInput value={draft.specialty} onChange={(e) => setDraft({ ...draft, specialty: e.target.value })} /></Field>
          <Field label="Bio"><TextArea rows={2} value={draft.bio ?? ''} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} /></Field>
          <Field label="Quote (optional)"><TextArea rows={2} value={draft.quote ?? ''} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} /></Field>
          <Field label="Quote author"><TextInput value={draft.quoteAuthor ?? ''} onChange={(e) => setDraft({ ...draft, quoteAuthor: e.target.value })} /></Field>
          <Field label="Photo"><ImageUpload value={draft.image} onChange={(url) => setDraft({ ...draft, image: url })} /></Field>
          <Button onClick={add}><Plus size={16} className="inline mr-1" /> Add</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((t) => (
          <Card key={t.id}>
            <Field label="Name"><TextInput value={t.name} onChange={(e) => setItems(items.map((x) => x.id === t.id ? { ...x, name: e.target.value } : x))} /></Field>
            <div className="my-3"><Field label="Specialty"><TextInput value={t.specialty} onChange={(e) => setItems(items.map((x) => x.id === t.id ? { ...x, specialty: e.target.value } : x))} /></Field></div>
            <div className="my-3"><Field label="Bio"><TextArea rows={2} value={t.bio ?? ''} onChange={(e) => setItems(items.map((x) => x.id === t.id ? { ...x, bio: e.target.value } : x))} /></Field></div>
            <div className="my-3"><Field label="Quote"><TextArea rows={2} value={t.quote ?? ''} onChange={(e) => setItems(items.map((x) => x.id === t.id ? { ...x, quote: e.target.value } : x))} /></Field></div>
            <div className="my-3"><Field label="Quote author"><TextInput value={t.quoteAuthor ?? ''} onChange={(e) => setItems(items.map((x) => x.id === t.id ? { ...x, quoteAuthor: e.target.value } : x))} /></Field></div>
            <Field label="Photo"><ImageUpload value={t.image} onChange={(url) => setItems(items.map((x) => x.id === t.id ? { ...x, image: url } : x))} /></Field>
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
