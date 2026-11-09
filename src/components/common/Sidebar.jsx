import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  PlusCircle,
  FolderGit2,
  Handshake,
  Heart,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  X,
  ShieldAlert
} from 'lucide-react';
import { toggleSidebar, setMobileSidebarOpen } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { firebaseService } from '../../services/firebaseService';
import { APP_CONFIG } from '../../config/constants';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isSidebarCollapsed, isMobileSidebarOpen } = useSelector((state) => state.ui);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: ideas } = useSelector((state) => state.ideas);
  const { items: commitments } = useSelector((state) => state.commitments);
  const { bookmarks } = useSelector((state) => state.ideas);

  // Compute user-specific quick counters
  const myIdeas = ideas.filter(i => i.creatorId === user?.uid);
  const myLiked = ideas.filter(i => Array.isArray(i.likedBy) && i.likedBy.includes(user?.uid));
  const myCommitments = commitments.filter(c => c.userId === user?.uid);

  const navItems = [
    {
      name: 'Home / Dashboard',
      to: '/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Explore Ideas',
      to: '/explore',
      icon: Compass,
      badge: ideas.length
    },
    {
      name: 'AI Idea Generator',
      to: '/ai-generator',
      icon: Sparkles,
      badge: 'Gemini'
    },
    {
      name: 'Share an Idea',
      to: '/share',
      icon: PlusCircle,
      badge: null
    },
    {
      name: 'My Ideas',
      to: '/my-ideas',
      icon: FolderGit2,
      badge: myIdeas.length > 0 ? myIdeas.length : null
    },
    {
      name: 'My Commitments',
      to: '/my-commitments',
      icon: Handshake,
      badge: myCommitments.length > 0 ? myCommitments.length : null
    },
    {
      name: 'Liked & Bookmarks',
      to: '/liked-ideas',
      icon: Heart,
      badge: (myLiked.length + bookmarks.length) > 0 ? (myLiked.length + bookmarks.length) : null
    },
    {
      name: 'Profile & Settings',
      to: '/profile',
      icon: UserCheck,
      badge: null
    },
  ];

  const handleLogout = async () => {
    await firebaseService.logoutUser();
    dispatch(logout());
    toast.success('Signed out successfully.');
    navigate('/');
  };

  const closeMobile = () => {
    dispatch(setMobileSidebarOpen(false));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-navy-950 text-slate-200 border-r border-slate-800 transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-72'}
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 shrink-0">
          <NavLink
            to="/"
            onClick={closeMobile}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shrink-0 shadow-glow">
              <Lightbulb className="w-5 h-5 text-amber-300" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                  Idea<span className="text-blue-400">Vault</span>
                </span>
                <span className="text-[10px] text-slate-400 truncate -mt-0.5">
                  {APP_CONFIG.tagline}
                </span>
              </div>
            )}
          </NavLink>

          {/* Close for mobile */}
          <button
            onClick={closeMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse toggle */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <div className={`px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 ${isSidebarCollapsed ? 'text-center' : ''}`}>
            {isSidebarCollapsed ? '•' : 'Platform Navigation'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobile}
                title={isSidebarCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1">{item.name}</span>
                )}

                {!isSidebarCollapsed && item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-blue-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User profile & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 shrink-0">
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between gap-3">
              <NavLink
                to="/profile"
                onClick={closeMobile}
                className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition"
              >
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName || 'User'}`}
                  alt={user?.displayName || 'User'}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-700"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">
                    {user?.displayName || 'Guest Explorer'}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {user?.role || 'Idea Enthusiast'}
                  </div>
                </div>
              </NavLink>

              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <NavLink to="/profile" title={user?.displayName || 'Profile'}>
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName || 'User'}`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-slate-700"
                />
              </NavLink>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

