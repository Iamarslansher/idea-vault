import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  ShieldCheck,
  LogOut,
  Save,
  CheckCircle2,
  Database,
  Cloud
} from 'lucide-react';
import toast from 'react-hot-toast';
import { updateUserProfile, setAuthSuccess, logout } from '../store/slices/authSlice';
import { saveStoredUser } from '../services/storageService';
import { firebaseService, DEMO_USERS } from '../services/firebaseService';
import { isFirebaseConfigured } from '../config/firebase';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [role, setRole] = useState(user?.role || 'Entrepreneur');
  const [location, setLocation] = useState(user?.location || 'Karachi, Pakistan');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    setSaving(true);

    const updated = {
      ...user,
      displayName,
      role,
      location,
      bio
    };

    saveStoredUser(updated);
    dispatch(updateUserProfile(updated));
    setSaving(false);
    toast.success('Profile details updated! ✨');
  };

  const handleDemoSwitch = async (index) => {
    const chosen = await firebaseService.loginWithDemo(index);
    dispatch(setAuthSuccess(chosen));
    setDisplayName(chosen.displayName);
    setRole(chosen.role);
    setLocation(chosen.location);
    setBio(chosen.bio);
    toast.success(`Switched active profile to ${chosen.displayName}!`);
  };

  const handleLogout = async () => {
    await firebaseService.logoutUser();
    dispatch(logout());
    toast.success('Signed out.');
    window.location.href = '/';
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950">
          Profile & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Manage your IdeaVault identity, public creator details, and backend connection.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100 text-center sm:text-left">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName}`}
            alt={user?.displayName}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-md shrink-0"
          />
          <div className="space-y-1 min-w-0">
            <h2 className="text-xl font-bold text-navy-950 truncate">
              {user?.displayName || 'Anonymous Member'}
            </h2>
            <div className="text-xs text-slate-500 truncate">{user?.email}</div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {user?.role || 'Entrepreneur'}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {user?.location || 'Pakistan'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleUpdate} className="space-y-4 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bio / Background
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                placeholder="Share a short bio about your entrepreneurial goals..."
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Instant Profile Switcher Shelf */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Switch Between Demo Personas</span>
        </h3>
        <p className="text-xs text-slate-500">
          Instantly switch testing profiles to evaluate IdeaVault from the perspective of a founder, angel investor, or growth marketer.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_USERS.map((demo, idx) => (
            <button
              key={demo.uid}
              type="button"
              onClick={() => handleDemoSwitch(idx)}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition text-left space-y-2 group"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={demo.avatar}
                  alt={demo.displayName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                    {demo.displayName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{demo.location}</div>
                </div>
              </div>
              <span className="block text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded truncate">
                {demo.role}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Backend & Firebase Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Backend & Persistence Infrastructure</span>
        </h3>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>Status:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isFirebaseConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {isFirebaseConfigured ? 'Firebase Cloud Connected' : 'Local Persistent Engine Active'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {isFirebaseConfigured
                ? 'Your project is connected to Firebase Authentication and Google Cloud Firestore.'
                : 'All ideas, likes, commitments, and profiles are saved persistently in local state. Provide Firebase API keys in .env to enable multi-device cloud sync.'}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Current Account</span>
          </button>
        </div>
      </div>

    </div>
  );
}

