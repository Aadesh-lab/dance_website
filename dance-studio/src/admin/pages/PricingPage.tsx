import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { Button, Card, Field, PageHeader, TextInput } from '../ui';
import type { PricingPlan } from '../../lib/types';

const EMPTY: PricingPlan = { name: '', duration: '', price: 0, saveAmount: '', highlight: false, sortOrder: 0 };

export function PricingPage() {
  const [items, setItems] = useState<PricingPlan[]>([]);
  const [draft, setDraft] = useState<PricingPlan>(EMPTY);

  const load = () => api.get<PricingPlan[]>('/api/admin/pricing', true).then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.name) return;
    await api.post('/api/admin/pricing', draft, true);
    setDraft(EMPTY); load();
  };
  const update = async (p: PricingPlan) => { await api.put(`/api/admin/pricing/${p.id}`, p, true); load(); };
  const remove = async (id?: number) => { if (!id) return; if (!confirm('Delete this plan?')) return; await api.del(`/api/admin/pricing/${id}`, true); load(); };

  return (
    <div>
      <PageHeader title="Pricing Plans" subtitle="Membership plans shown on the Fees section" />

      <Card className="mb-6">
        <h2 className="font-semibold mb-4">Add plan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Name"><TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Monthly Plan" /></Field>
          <Field label="Duration"><TextInput value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} placeholder="1 Month" /></Field>
          <Field label="Price (₹)"><TextInput type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} /></Field>
          <Field label="Save (₹)"><TextInput value={draft.saveAmount ?? ''} onChange={(e) => setDraft({ ...draft, saveAmount: e.target.value })} /></Field>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!draft.highlight} onChange={(e) => setDraft({ ...draft, highlight: e.target.checked })} />
            Highlight
          </label>
          <Button onClick={add}><Plus size={16} className="inline mr-1" /> Add plan</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <Card key={p.id}>
            <div className="flex flex-col gap-3">
              <Field label="Name"><TextInput value={p.name} onChange={(e) => setItems(items.map((x) => x.id === p.id ? { ...x, name: e.target.value } : x))} /></Field>
              <Field label="Duration"><TextInput value={p.duration} onChange={(e) => setItems(items.map((x) => x.id === p.id ? { ...x, duration: e.target.value } : x))} /></Field>
              <Field label="Price"><TextInput type="number" value={p.price} onChange={(e) => setItems(items.map((x) => x.id === p.id ? { ...x, price: Number(e.target.value) } : x))} /></Field>
              <Field label="Save (₹)"><TextInput value={p.saveAmount ?? ''} onChange={(e) => setItems(items.map((x) => x.id === p.id ? { ...x, saveAmount: e.target.value } : x))} /></Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!p.highlight} onChange={(e) => setItems(items.map((x) => x.id === p.id ? { ...x, highlight: e.target.checked } : x))} />
                Highlight
              </label>
              <div className="flex justify-between gap-2 mt-2">
                <Button variant="danger" onClick={() => remove(p.id)}><Trash2 size={16} /></Button>
                <Button onClick={() => update(p)}><Save size={16} className="inline mr-1" /> Save</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
