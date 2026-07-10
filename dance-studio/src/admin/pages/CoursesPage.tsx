import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { Button, Card, Field, ImageUpload, PageHeader, Select, TextArea, TextInput } from '../ui';
import type { Course } from '../../lib/types';

const EMPTY: Course = { slug: '', title: '', image: '', category: 'adult', description: '', sortOrder: 0 };

export function CoursesPage() {
  const [items, setItems] = useState<Course[]>([]);
  const [draft, setDraft] = useState<Course>(EMPTY);

  const load = () => api.get<Course[]>('/api/admin/courses', true).then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.title || !draft.slug) return;
    await api.post('/api/admin/courses', draft, true);
    setDraft(EMPTY);
    load();
  };

  const update = async (c: Course) => {
    await api.put(`/api/admin/courses/${c.id}`, c, true);
    load();
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm('Delete this course?')) return;
    await api.del(`/api/admin/courses/${id}`, true);
    load();
  };

  return (
    <div>
      <PageHeader title="Dance Courses" subtitle="Manage the dance styles displayed on the site" />

      <Card className="mb-6">
        <h2 className="font-semibold mb-4">Add new course</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Slug (id)"><TextInput value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} placeholder="hip-hop" /></Field>
          <Field label="Title"><TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="HIP-HOP" /></Field>
          <Field label="Category">
            <Select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as 'adult' | 'kids' })}>
              <option value="adult">Adult</option>
              <option value="kids">Kids</option>
            </Select>
          </Field>
          <Field label="Sort order"><TextInput type="number" value={draft.sortOrder ?? 0} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} /></Field>
          <div className="md:col-span-2">
            <Field label="Image"><ImageUpload value={draft.image} onChange={(url) => setDraft({ ...draft, image: url })} /></Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Description"><TextArea rows={2} value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={add}><Plus size={16} className="inline mr-1" /> Add course</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((c) => (
          <Card key={c.id}>
            <div className="flex gap-4">
              {c.image && <img src={c.image} alt={c.title} className="w-24 h-24 object-cover rounded-lg" />}
              <div className="flex-1 flex flex-col gap-2">
                <TextInput value={c.title} onChange={(e) => setItems(items.map((x) => x.id === c.id ? { ...x, title: e.target.value } : x))} />
                <TextInput value={c.slug} onChange={(e) => setItems(items.map((x) => x.id === c.id ? { ...x, slug: e.target.value } : x))} />
                <div className="flex gap-2">
                  <Select value={c.category} onChange={(e) => setItems(items.map((x) => x.id === c.id ? { ...x, category: e.target.value as 'adult' | 'kids' } : x))}>
                    <option value="adult">Adult</option>
                    <option value="kids">Kids</option>
                  </Select>
                  <TextInput type="number" value={c.sortOrder ?? 0} onChange={(e) => setItems(items.map((x) => x.id === c.id ? { ...x, sortOrder: Number(e.target.value) } : x))} />
                </div>
              </div>
            </div>
            <ImageUpload value={c.image} onChange={(url) => setItems(items.map((x) => x.id === c.id ? { ...x, image: url } : x))} />
            <TextArea rows={2} value={c.description ?? ''} onChange={(e) => setItems(items.map((x) => x.id === c.id ? { ...x, description: e.target.value } : x))} className="mt-3" />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="danger" onClick={() => remove(c.id)}><Trash2 size={16} /></Button>
              <Button onClick={() => update(c)}><Save size={16} className="inline mr-1" /> Save</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
