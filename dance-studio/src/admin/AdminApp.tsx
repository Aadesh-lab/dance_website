import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { CoursesPage } from './pages/CoursesPage';
import { PricingPage } from './pages/PricingPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReelsPage } from './pages/ReelsPage';
import { AdvantagesPage } from './pages/AdvantagesPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { TeachersPage } from './pages/TeachersPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { isAuthed } from '../lib/auth';

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!isAuthed()) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export function AdminApp() {
  return (
    <div className="min-h-screen bg-white text-brand-ink font-sans">
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="reels" element={<ReelsPage />} />
          <Route path="advantages" element={<AdvantagesPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="submissions" element={<SubmissionsPage />} />
        </Route>
      </Routes>
    </div>
  );
}
