import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Card, PageHeader } from '../ui';
import type { SitePayload, Submission } from '../../lib/types';

export function DashboardPage() {
  const [site, setSite] = useState<SitePayload | null>(null);
  const [subs, setSubs] = useState<Submission[]>([]);

  useEffect(() => {
    api.get<SitePayload>('/api/public/site').then(setSite).catch(() => {});
    api.get<Submission[]>('/api/admin/submissions', true).then(setSubs).catch(() => {});
  }, []);

  const stat = (label: string, value: number | string, to: string) => (
    <Link to={to} className="block">
      <Card className="hover:border-brand-gold transition-colors">
        <div className="text-xs uppercase tracking-widest text-brand-muted font-semibold">{label}</div>
        <div className="text-3xl font-bold mt-2">{value}</div>
      </Card>
    </Link>
  );

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your studio content" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stat('Courses', site?.courses.length ?? '—', '/admin/courses')}
        {stat('Pricing Plans', site?.pricing.length ?? '—', '/admin/pricing')}
        {stat('Gallery Items', site?.gallery.length ?? '—', '/admin/gallery')}
        {stat('New Submissions', subs.length, '/admin/submissions')}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Latest Submissions</h2>
        <Card>
          {subs.length === 0 ? (
            <p className="text-sm text-brand-muted">No submissions yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {subs.slice(0, 5).map((s) => (
                <li key={s.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-brand-muted">{s.phone} {s.style && `• ${s.style}`}</div>
                  </div>
                  <div className="text-xs text-brand-muted">{new Date(s.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
