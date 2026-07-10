import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings, Sparkles, IndianRupee, Image, Film, ListChecks, Award, Inbox, Users, MessageSquare, Trophy } from 'lucide-react';
import { logout } from '../lib/auth';
import { Brand } from '../components/Brand';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
  { to: '/admin/courses', label: 'Dance Courses', icon: Sparkles },
  { to: '/admin/pricing', label: 'Pricing Plans', icon: IndianRupee },
  { to: '/admin/gallery', label: 'Gallery', icon: Image },
  { to: '/admin/reels', label: 'Reels', icon: Film },
  { to: '/admin/advantages', label: 'Advantages', icon: ListChecks },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/teachers', label: 'Teachers', icon: Users },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { to: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { to: '/admin/submissions', label: 'Submissions', icon: Inbox },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const onLogout = () => { logout(); navigate('/admin/login', { replace: true }); };

  return (
    <div className="flex min-h-screen bg-white text-brand-ink">
      <aside className="w-64 bg-brand-footer text-white flex flex-col p-4 border-r border-brand-ink/10">
        <div className="px-3 py-5 mb-4 border-b border-white/10">
          <Brand size="md" variant="light" />
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 mt-3">Admin Panel</div>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.15em] uppercase font-medium transition-colors ${
                  isActive ? 'bg-brand-gold text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.15em] uppercase font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors mt-4 border-t border-white/10 pt-4"
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>
      <main className="flex-1 p-8 lg:p-12 overflow-x-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
}
