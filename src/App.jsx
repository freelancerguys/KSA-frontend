import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentLayout from './layouts/StudentLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicPageLayout from './components/PublicPageLayout';
import DashboardOverview from './pages/student/DashboardOverview';
import FeesPage from './pages/student/FeesPage';
import DiaryPage from './pages/student/DiaryPage';
import ScoresPage from './pages/student/ScoresPage';
import ProfilePage from './pages/student/ProfilePage';
import BlogDetailPage from './pages/BlogDetailPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import SessionExpiredDialog from './components/SessionExpiredDialog';

export default function App() {
  return (
    <>
    <SessionExpiredDialog />
    <Routes>
      <Route
        path="/"
        element={
          <PublicPageLayout>
            <LandingPage />
          </PublicPageLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicPageLayout>
            <LoginPage />
          </PublicPageLayout>
        }
      />
      <Route
        path="/blogs/:slug"
        element={
          <PublicPageLayout>
            <BlogDetailPage />
          </PublicPageLayout>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <PublicPageLayout>
            <PrivacyPolicyPage />
          </PublicPageLayout>
        }
      />
      <Route
        path="/terms-and-conditions"
        element={
          <PublicPageLayout>
            <TermsAndConditionsPage />
          </PublicPageLayout>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="diary" element={<DiaryPage />} />
        <Route path="scores" element={<ScoresPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
    </>
  );
}
