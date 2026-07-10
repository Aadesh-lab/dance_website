import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { FloatingActions } from './components/FloatingActions';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-brand-ink font-sans overflow-x-hidden selection:bg-brand-gold selection:text-white">
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
      <FloatingActions />
    </div>
  );
}
