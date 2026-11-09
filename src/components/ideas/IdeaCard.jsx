import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Heart,
  Bookmark,
  Eye,
  MapPin,
  Wallet,
  ArrowUpRight,
  Sparkles,
  Handshake,
  Share2,
  Clock
} from 'lucide-react';
import { toggleLikeLocal, toggleBookmark, incrementViewsLocal } from '../../store/slices/ideasSlice';
import { openAuthModal } from '../../store/slices/uiSlice';
import { firebaseService } from '../../services/firebaseService';
import { formatPKR, formatRelativeTime, truncate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function IdeaCard({ idea, onCommitClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { bookmarks } = useSelector((state) => state.ideas);

  const [isLiking, setIsLiking] = useState(false);

  // Check if current user liked this idea
  const isLiked = Boolean(
    isAuthenticated &&
    user?.uid &&
    Array.isArray(idea.likedBy) &&
    idea.likedBy.includes(user.uid)
  );

  const isBookmarked = bookmarks.includes(idea.id);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      dispatch(openAuthModal({ intent: 'Sign in to like this idea and save it to your profile.' }));
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI update
    dispatch(toggleLikeLocal({ ideaId: idea.id, userId: user.uid }));

    try {
      await firebaseService.toggleLike(idea.id, user.uid);
    } catch (err) {
      // Revert if error
      dispatch(toggleLikeLocal({ ideaId: idea.id, userId: user.uid }));
      toast.error('Could not update like.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      dispatch(openAuthModal({ intent: 'Sign in to bookmark and track your favorite ideas.' }));
      return;
    }

    dispatch(toggleBookmark(idea.id));
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Idea saved to bookmarks!');
  };

  const handleCardClick = () => {
    dispatch(incrementViewsLocal(idea.id));
    firebaseService.incrementViews(idea.id);
    navigate(`/ideas/${idea.id}`);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/ideas/${idea.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: idea.title,
          text: `Check out this business idea on IdeaVault: ${idea.title}`,
          url
        });
      } catch (err) {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleCommit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      dispatch(openAuthModal({ intent: 'Sign in to request collaboration or express interest in this idea.' }));
      return;
    }

    if (onCommitClick) {
      onCommitClick(idea);
    } else {
      navigate(`/ideas/${idea.id}#commit`);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="group cursor-pointer bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-blue-400/80 shadow-soft hover:shadow-card transition-all flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Accent Gradient Bar on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Creator Header */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={idea.creatorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${idea.creatorName}`}
              alt={idea.creatorName}
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 shadow-xs"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                {idea.creatorName}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3 shrink-0" />
                <span>{formatRelativeTime(idea.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Bookmark & Share) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              title="Share Idea"
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleBookmark}
              title={isBookmarked ? 'Remove Bookmark' : 'Save for later'}
              className={`p-1.5 rounded-full transition ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-50'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category & Business Type Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100/80">
            {idea.categoryLabel || idea.category}
          </span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
            idea.businessType === 'Online'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : idea.businessType === 'Physical'
              ? 'bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-purple-50 text-purple-700 border-purple-100'
          }`}>
            {idea.businessType}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2 mb-2">
          {idea.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
          {idea.shortDescription}
        </p>

        {/* Specs Pill Bar: Budget & Location */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-slate-400">Req. Budget</div>
              <div className="text-xs font-bold text-slate-900 truncate">
                {formatPKR(idea.budget)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            <div className="p-1 rounded-lg bg-blue-100 text-blue-700 shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-slate-400">Location</div>
              <div className="text-xs font-bold text-slate-900 truncate">
                {idea.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Like Button with Animation, Views, and Commit CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Heart Like Button */}
          <motion.button
            type="button"
            onClick={handleLike}
            whileTap={{ scale: 0.8 }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
              isLiked
                ? 'bg-red-50 text-red-600'
                : 'text-slate-500 hover:text-red-500 hover:bg-red-50/50'
            }`}
            title="Like this idea"
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isLiked ? 'text-red-500 fill-red-500' : 'text-slate-400'
                }`}
              />
            </motion.div>
            <span>{idea.likesCount || 0}</span>
          </motion.button>

          {/* View Counter */}
          <div className="flex items-center gap-1 text-slate-400 text-xs font-medium" title="Views">
            <Eye className="w-3.5 h-3.5" />
            <span>{idea.viewsCount || 0}</span>
          </div>
        </div>

        {/* I'm Interested CTA */}
        <button
          type="button"
          onClick={handleCommit}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition"
        >
          <Handshake className="w-3.5 h-3.5" />
          <span>I'm Interested</span>
        </button>
      </div>
    </motion.div>
  );
}

