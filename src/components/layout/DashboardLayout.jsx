import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, PlusCircle, Bell, Sparkles, CloudCheck, HardDrive, Shield } from 'lucide-react';
import Sidebar from '../common/Sidebar';
import AuthModal from '../auth/AuthModal';
import { setMobileSidebarOpen, openAuthModal } from '../../store/slices/uiSlice';
import { isFirebaseConfigured } from '../../config/firebase';

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isSidebarCollapsed } = useSelector((state) => state.ui);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Dashboard Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(setMobileSidebarOpen(true))}
              className="p-2 rounded-xl text-slate-600 hover:text-navy-950 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">IdeaVault /</span>
              <span className="text-sm font-bold text-slate-900 capitalize">
                {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-3">
            {/* Storage / Firebase Mode Indicator */}
            <div
              title={isFirebaseConfigured ? 'Firebase Firestore Live Sync Connected' : 'Persistent Storage Mode Active'}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                isFirebaseConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConfigured ? 'bg-emerald-500' : 'bg-blue-500'}`} />
              <span>{isFirebaseConfigured ? 'Cloud Live' : 'Storage Active'}</span>
            </div>

            {/* Share CTA */}
            <Link
              to="/share"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share Idea</span>
            </Link>

            {/* User Mini Avatar */}
            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center gap-2">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName}`}
                  alt={user?.displayName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
              </Link>
            ) : (
              <button
                onClick={() => dispatch(openAuthModal({ intent: 'Sign in to sync your ideas and dashboard.' }))}
                className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <AuthModal />
    </div>
  );
}

