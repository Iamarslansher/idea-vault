import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, MapPin, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { closeAuthModal, setAuthModalTab } from '../../store/slices/uiSlice';
import { setAuthLoading, setAuthSuccess, setAuthError } from '../../store/slices/authSlice';
import { firebaseService, DEMO_USERS } from '../../services/firebaseService';
import { isFirebaseConfigured } from '../../config/firebase';

export default function AuthModal() {
  const dispatch = useDispatch();
  const { isAuthModalOpen, authModalTab, authModalIntent } = useSelector((state) => state.ui);
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('Karachi');
  const [role, setRole] = useState('Entrepreneur');

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    dispatch(closeAuthModal());
  };

  const handleTabChange = (tab) => {
    dispatch(setAuthModalTab(tab));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    dispatch(setAuthLoading(true));
    try {
      const user = await firebaseService.loginUser({ email, password });
      dispatch(setAuthSuccess(user));
      toast.success(`Welcome back, ${user.displayName || 'Explorer'}!`);
      handleClose();
    } catch (err) {
      dispatch(setAuthError(err.message));
      toast.error(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      toast.error('Please fill in your name, email, and password.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    dispatch(setAuthLoading(true));
    try {
      const user = await firebaseService.registerUser({
        email,
        password,
        displayName,
        location,
        role
      });
      dispatch(setAuthSuccess(user));
      toast.success(`Account created! Welcome to IdeaVault, ${user.displayName}! 🎉`);
      handleClose();
    } catch (err) {
      dispatch(setAuthError(err.message));
      toast.error(err.message || 'Registration failed.');
    }
  };

  const handleDemoLogin = async (index) => {
    dispatch(setAuthLoading(true));
    try {
      const user = await firebaseService.loginWithDemo(index);
      dispatch(setAuthSuccess(user));
      toast.success(`Logged in as demo profile: ${user.displayName} (${user.role}) 🚀`);
      handleClose();
    } catch (err) {
      toast.error('Demo login failed');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 my-8"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-blue-900 px-6 py-6 text-white relative">
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-xs font-semibold tracking-wider uppercase text-blue-300">
                Community Authentication
              </span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-white">
              {authModalTab === 'login' ? 'Sign In to IdeaVault' : 'Join the IdeaVault Community'}
            </h3>

            {authModalIntent ? (
              <p className="mt-2 text-xs md:text-sm text-blue-100 bg-white/10 px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{authModalIntent}</span>
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-300">
                Ideas Today. Opportunities Tomorrow.
              </p>
            )}
          </div>

          <div className="p-6">
            {/* Quick Demo Login Shelf */}
            <div className="mb-6 pb-5 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Instant 1-Click Demo Profiles
                </span>
                <span className="text-[11px] text-blue-600 font-medium">No typing required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_USERS.map((demo, idx) => (
                  <button
                    key={demo.uid}
                    type="button"
                    onClick={() => handleDemoLogin(idx)}
                    className="flex flex-col items-start p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <img
                        src={demo.avatar}
                        alt={demo.displayName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                          {demo.displayName.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {demo.location.split(',')[0]}
                        </div>
                      </div>
                    </div>
                    <span className="mt-1.5 text-[10px] font-medium text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded truncate w-full">
                      {demo.role.split('&')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs for standard auth */}
            <div className="flex border-b border-slate-200 mb-5">
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition ${
                  authModalTab === 'login'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('signup')}
                className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition ${
                  authModalTab === 'signup'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Forms */}
            {authModalTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In to Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Asad Siddiqui"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs bg-white"
                      >
                        <option value="Karachi">Karachi</option>
                        <option value="Lahore">Lahore</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Multan">Multan</option>
                        <option value="Peshawar">Peshawar</option>
                        <option value="Quetta">Quetta</option>
                        <option value="Online / Remote">Online / Remote</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs bg-white"
                    >
                      <option value="Entrepreneur">Entrepreneur / Builder</option>
                      <option value="Investor">Investor / Capitalist</option>
                      <option value="Developer">Software Engineer</option>
                      <option value="Marketer">Marketing Specialist</option>
                      <option value="Consultant">Domain Consultant</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password (Min 6 chars)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {loading ? 'Creating account...' : 'Create IdeaVault Account'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="mt-5 text-center">
              <span className="text-[11px] text-slate-400">
                {isFirebaseConfigured
                  ? '🔒 Protected with Firebase Authentication & Cloud Firestore.'
                  : '💡 Operating in Persistent Storage Mode. Live Firebase keys can be provided in .env.'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

