import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sparkles,
  PlusCircle,
  Compass,
  LayoutDashboard,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Bookmark,
  Heart,
  Briefcase,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { openAuthModal } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { firebaseService } from '../../services/firebaseService';
import { markAllAsRead } from '../../store/slices/notificationsSlice';
import { APP_CONFIG } from '../../config/constants';
import toast from 'react-hot-toast';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: notifications } = useSelector((state) => state.notifications);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleShareClick = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal({ intent: 'Sign in to share your business or project idea with the IdeaVault community.' }));
    } else {
      navigate('/share');
    }
  };

  const handleLogout = async () => {
    await firebaseService.logoutUser();
    dispatch(logout());
    setIsUserMenuOpen(false);
    toast.success('Signed out successfully.');
    navigate('/');
  };

  const navLinks = [
    { label: 'Explore Ideas', to: '/explore', icon: Compass },
    { label: 'AI Generator', to: '/ai-generator', icon: Sparkles, badge: 'Gemini' },
    { label: 'About', to: '/about', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-navy-950 flex items-center gap-1">
                Idea<span className="text-blue-600">Vault</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 hidden sm:inline -mt-1 tracking-tight">
                {APP_CONFIG.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                  location.pathname === '/dashboard'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Share Idea CTA */}
            <button
              onClick={handleShareClick}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share an Idea</span>
            </button>

            {/* If Authenticated: Notifications & User Avatar */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Notifications Popover */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => {
                      setIsNotifOpen(!isNotifOpen);
                      setIsUserMenuOpen(false);
                    }}
                    className="p-2 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 relative transition"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifs.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">Notifications</span>
                          {unreadNotifs.length > 0 && (
                            <span className="text-[11px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {unreadNotifs.length} new
                            </span>
                          )}
                        </div>
                        {unreadNotifs.length > 0 && (
                          <button
                            onClick={() => dispatch(markAllAsRead())}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-xs">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 6).map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3.5 hover:bg-slate-50 transition cursor-pointer ${
                                !notif.read ? 'bg-blue-50/40' : ''
                              }`}
                              onClick={() => {
                                setIsNotifOpen(false);
                                if (notif.ideaId) navigate(`/ideas/${notif.ideaId}`);
                              }}
                            >
                              <div className="font-semibold text-xs text-slate-900 mb-0.5">
                                {notif.title}
                              </div>
                              <div className="text-xs text-slate-600 leading-snug line-clamp-2">
                                {notif.message}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="px-4 pt-2 border-t border-slate-100 text-center">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsNotifOpen(false)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                          View all in Dashboard &rarr;
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen);
                      setIsNotifOpen(false);
                    }}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition"
                  >
                    <img
                      src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName}`}
                      alt={user?.displayName || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="font-bold text-sm text-slate-900 truncate">
                          {user?.displayName}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                        <span className="mt-1.5 inline-block text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                          {user?.role || 'IdeaVault Member'}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Dashboard Overview
                        </Link>

                        <Link
                          to="/my-ideas"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                        >
                          <Lightbulb className="w-4 h-4 text-slate-400" />
                          My Shared Ideas
                        </Link>

                        <Link
                          to="/my-commitments"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          My Commitments
                        </Link>

                        <Link
                          to="/liked-ideas"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                        >
                          <Heart className="w-4 h-4 text-slate-400" />
                          Liked & Bookmarks
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Profile & Settings
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* If Unauthenticated: Soft Auth Triggers */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(openAuthModal({ tab: 'login', intent: 'Welcome back! Sign in to access your IdeaVault.' }))}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-navy-950 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => dispatch(openAuthModal({ tab: 'signup', intent: 'Join IdeaVault to share, save, and collaborate on ideas.' }))}
                  className="hidden sm:inline-flex px-3.5 py-2 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
                >
                  Join Free
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-navy-900 md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <div className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4 text-slate-500" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>Dashboard Overview</span>
              </Link>
              <Link
                to="/my-ideas"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Lightbulb className="w-4 h-4 text-slate-500" />
                <span>My Ideas</span>
              </Link>
              <Link
                to="/my-commitments"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Briefcase className="w-4 h-4 text-slate-500" />
                <span>My Commitments</span>
              </Link>
              <Link
                to="/liked-ideas"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Heart className="w-4 h-4 text-slate-500" />
                <span>Liked & Bookmarked</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => dispatch(openAuthModal({ tab: 'login' }))}
                className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Sign In
              </button>
              <button
                onClick={() => dispatch(openAuthModal({ tab: 'signup' }))}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-xl"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

