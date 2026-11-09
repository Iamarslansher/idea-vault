import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sparkles,
  Lightbulb,
  Heart,
  Eye,
  Handshake,
  PlusCircle,
  Compass,
  ArrowRight,
  TrendingUp,
  FolderGit2,
  Clock,
  Bell,
  CheckCircle2
} from 'lucide-react';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { formatPKR, formatRelativeTime } from '../utils/formatters';
import { openAuthModal } from '../store/slices/uiSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: ideas } = useSelector((state) => state.ideas);
  const { items: commitments } = useSelector((state) => state.commitments);
  const { items: notifications } = useSelector((state) => state.notifications);

  // If unauthenticated visitor lands here, show helpful prompt with soft sign-in option
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <FolderGit2 className="w-8 h-8 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Sign in to access your personal dashboard
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Track your shared ideas, monitor live likes and views, manage collaboration proposals, and receive notifications.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => dispatch(openAuthModal({ intent: 'Sign in to access your dashboard metrics and shared ideas.' }))}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow transition"
          >
            Sign In with 1-Click Demo
          </button>
          <Link
            to="/explore"
            className="px-6 py-3 rounded-2xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
          >
            Explore Public Ideas
          </Link>
        </div>
      </div>
    );
  }

  // User-specific data
  const myIdeas = ideas.filter((i) => i.creatorId === user?.uid);
  const totalMyLikes = myIdeas.reduce((acc, i) => acc + (i.likesCount || 0), 0);
  const totalMyViews = myIdeas.reduce((acc, i) => acc + (i.viewsCount || 0), 0);
  const totalMyCommitments = myIdeas.reduce((acc, i) => acc + (i.commitmentsCount || (i.commitments?.length || 0)), 0);
  const mySentCommitments = commitments.filter((c) => c.userId === user?.uid);

  return (
    <div className="space-y-8">
      
      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Personal Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            Welcome back, {user?.displayName || 'Explorer'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Here's what's happening with your business blueprints, ideas, and collaborations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/ai-generator"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold hover:bg-slate-50 shadow-xs transition"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Generator</span>
          </Link>
          <Link
            to="/share"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share New Idea</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Ideas */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              My Ideas Shared
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-navy-950">
            {myIdeas.length}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Link to="/my-ideas" className="text-blue-600 hover:underline font-semibold">
              Manage ideas &rarr;
            </Link>
          </div>
        </div>

        {/* Total Likes */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Likes
            </span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-navy-950">
            {totalMyLikes}
          </div>
          <div className="text-[11px] text-slate-500">
            Across all shared opportunities
          </div>
        </div>

        {/* Total Views */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Views
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-navy-950">
            {totalMyViews}
          </div>
          <div className="text-[11px] text-slate-500">
            Community impressions
          </div>
        </div>

        {/* Total Commitments */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Commitments
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Handshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-navy-950">
            {totalMyCommitments + mySentCommitments.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Partnerships & inquiries
          </div>
        </div>

      </div>

      {/* Inspirational Banner */}
      <DisclaimerBanner variant="card" />

      {/* Content Grid: My Ideas & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: My Ideas Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              My Shared Ideas ({myIdeas.length})
            </h3>
            <Link to="/my-ideas" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
              View all &rarr;
            </Link>
          </div>

          {myIdeas.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-3">
              <Lightbulb className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-semibold text-slate-700">
                You haven't shared any ideas yet.
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Got a project or business concept? Share it with the community and find partners today.
              </p>
              <Link
                to="/share"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Share your first idea</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myIdeas.slice(0, 3).map((idea) => (
                <div
                  key={idea.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 shadow-soft transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {idea.categoryLabel || idea.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatRelativeTime(idea.createdAt)}
                      </span>
                    </div>
                    <Link
                      to={`/ideas/${idea.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 transition block truncate"
                    >
                      {idea.title}
                    </Link>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Budget: <strong className="text-slate-800">{formatPKR(idea.budget)}</strong></span>
                      <span>•</span>
                      <span>{idea.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center gap-1 text-slate-500" title="Likes">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                      <span>{idea.likesCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500" title="Views">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{idea.viewsCount || 0}</span>
                    </div>
                    <Link
                      to={`/edit/${idea.id}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Activity Feed & Commitments */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Recent Activity & Alerts
          </h3>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft divide-y divide-slate-100">
            {notifications.slice(0, 4).map((notif) => (
              <div key={notif.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{notif.title}</span>
                  <span className="text-[10px] text-slate-400">{formatRelativeTime(notif.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  {notif.message}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Shortcuts */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-900 to-navy-950 text-white space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h4 className="text-sm font-bold">Need a fresh venture idea?</h4>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              Use Gemini AI to tailor business models based on your exact budget in PKR and Pakistani city.
            </p>
            <Link
              to="/ai-generator"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition"
            >
              <span>Launch Gemini Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

