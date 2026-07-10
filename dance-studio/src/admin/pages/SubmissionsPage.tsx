import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { Button, Card, PageHeader } from '../ui';
import type { Submission } from '../../lib/types';

export function SubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);

  const load = () => api.get<Submission[]>('/api/admin/submissions', true).then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm('Delete this submission?')) return;
    await api.del(`/api/admin/submissions/${id}`, true);
    load();
  };

  return (
    <div>
      <PageHeader title="Submissions" subtitle="Trial-class and booking requests from the website" />
      <Card className="overflow-x-auto">
        {items.length === 0 ? (
          <p className="text-sm text-brand-muted">No submissions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-brand-muted border-b border-brand-ink/10">
              <tr>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Phone</th>
                <th className="py-3 pr-4">Age</th>
                <th className="py-3 pr-4">Style</th>
                <th className="py-3 pr-4">Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-b border-brand-ink/10">
                  <td className="py-3 pr-4 font-medium">{s.name}</td>
                  <td className="py-3 pr-4">{s.phone}</td>
                  <td className="py-3 pr-4">{s.age || '—'}</td>
                  <td className="py-3 pr-4">{s.style || '—'}</td>
                  <td className="py-3 pr-4 text-brand-muted">{new Date(s.createdAt).toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <Button variant="danger" onClick={() => remove(s.id)}><Trash2 size={14} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
