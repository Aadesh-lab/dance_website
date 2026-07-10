import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings, Sparkles, IndianRupee, Image, Film, ListChecks, Award, Inbox, Users, MessageSquare, Trophy, Menu, X } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  const onLogout = () => { logout(); navigate('/admin/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-white text-brand-ink lg:flex">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-brand-footer text-white px-4 py-3 border-b border-white/10">
        <Brand size="sm" variant="light" />
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 -mr-2 text-white/90 hover:text-white"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Overlay when drawer is open on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] bg-brand-footer text-white flex flex-col p-4 border-r border-brand-ink/10 overflow-y-auto transform transition-transform duration-200 lg:static lg:translate-x-0 lg:shrink-0 lg:transform-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-3 py-5 mb-4 border-b border-white/10 flex items-start justify-between">
          <div>
            <Brand size="md" variant="light" />
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 mt-3">Admin Panel</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="lg:hidden p-1 text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
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

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-12 overflow-x-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
}
