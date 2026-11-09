import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import IdeaDetailPage from './pages/IdeaDetailPage';
import DashboardPage from './pages/DashboardPage';
import ShareIdeaPage from './pages/ShareIdeaPage';
import EditIdeaPage from './pages/EditIdeaPage';
import MyIdeasPage from './pages/MyIdeasPage';
import MyCommitmentsPage from './pages/MyCommitmentsPage';
import LikedIdeasPage from './pages/LikedIdeasPage';
import AIGeneratorPage from './pages/AIGeneratorPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      {/* Toast Notification Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0F172A',
            color: '#F8FAFC',
            borderRadius: '1rem',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#3B82F6',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      <Routes>
        {/* Public Website Routes with Navbar & Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/ideas/:id" element={<IdeaDetailPage />} />
          <Route path="/ai-generator" element={<AIGeneratorPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Dashboard & Workspace Routes with Sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/share" element={<ShareIdeaPage />} />
          <Route path="/edit/:id" element={<EditIdeaPage />} />
          <Route path="/my-ideas" element={<MyIdeasPage />} />
          <Route path="/my-commitments" element={<MyCommitmentsPage />} />
          <Route path="/liked-ideas" element={<LikedIdeasPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
