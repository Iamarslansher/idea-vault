import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Wallet,
  MapPin,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Handshake,
  Edit,
  Trash2,
  Layers,
  Shield,
  Coins,
  Send,
  Building
} from 'lucide-react';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import CommentsSection from '../components/ideas/CommentsSection';
import CommitmentModal from '../components/ideas/CommitmentModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { toggleLikeLocal, toggleBookmark, deleteIdea, incrementViewsLocal } from '../store/slices/ideasSlice';
import { openAuthModal } from '../store/slices/uiSlice';
import { firebaseService } from '../services/firebaseService';
import { formatPKR, formatRelativeTime } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function IdeaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: ideas } = useSelector((state) => state.ideas);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { bookmarks } = useSelector((state) => state.ideas);

  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const idea = ideas.find((i) => i.id === id);

  useEffect(() => {
    if (idea) {
      dispatch(incrementViewsLocal(idea.id));
      firebaseService.incrementViews(idea.id);
    }
  }, [id]);

  if (!idea) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Idea Not Found</h2>
        <p className="text-slate-500 mb-6">
          The opportunity you are looking for does not exist or may have been removed.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Ideas</span>
        </Link>
      </div>
    );
  }

  const isOwner = Boolean(isAuthenticated && user?.uid && user.uid === idea.creatorId);
  const isLiked = Boolean(isAuthenticated && user?.uid && Array.isArray(idea.likedBy) && idea.likedBy.includes(user.uid));
  const isBookmarked = bookmarks.includes(idea.id);

  const handleLike = async () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal({ intent: 'Sign in to like this idea and save it to your profile.' }));
      return;
    }
    if (isLiking) return;
    setIsLiking(true);

    dispatch(toggleLikeLocal({ ideaId: idea.id, userId: user.uid }));
    try {
      await firebaseService.toggleLike(idea.id, user.uid);
    } catch (e) {
      dispatch(toggleLikeLocal({ ideaId: idea.id, userId: user.uid }));
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal({ intent: 'Sign in to bookmark this idea.' }));
      return;
    }
    dispatch(toggleBookmark(idea.id));
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks!');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: idea.title,
          text: `Check out "${idea.title}" on IdeaVault`,
          url
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await firebaseService.deleteIdea(idea.id);
      dispatch(deleteIdea(idea.id));
      toast.success('Idea deleted successfully.');
      navigate('/my-ideas');
    } catch (e) {
      toast.error('Failed to delete idea.');
    }
  };

  const commitmentsList = Array.isArray(idea.commitments) ? idea.commitments : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-navy-950 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <Link
                to={`/edit/${idea.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
              >
                <Edit className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Idea</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleBookmark}
            className={`p-2 rounded-xl border transition ${
              isBookmarked
                ? 'border-amber-300 bg-amber-50 text-amber-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        
        {/* Creator Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={idea.creatorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${idea.creatorName}`}
              alt={idea.creatorName}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
            />
            <div>
              <div className="text-sm font-bold text-slate-900">
                {idea.creatorName}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>{idea.creatorRole || 'Idea Creator'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(idea.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {idea.categoryLabel || idea.category}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
              idea.businessType === 'Online'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : idea.businessType === 'Physical'
                ? 'bg-slate-100 text-slate-700 border-slate-200'
                : 'bg-purple-50 text-purple-700 border-purple-100'
            }`}>
              {idea.businessType} Model
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-950 leading-tight">
          {idea.title}
        </h1>

        {/* Short Hook */}
        <p className="text-base text-slate-700 leading-relaxed font-medium">
          {idea.shortDescription}
        </p>

        {/* Metric Highlights Shelf */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Wallet className="w-3 h-3 text-emerald-600" />
              Estimated Budget
            </span>
            <div className="text-base sm:text-lg font-bold text-slate-900">
              {formatPKR(idea.budget)}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-600" />
              Target Location
            </span>
            <div className="text-base sm:text-lg font-bold text-slate-900">
              {idea.location}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-400" />
              Total Views
            </span>
            <div className="text-base sm:text-lg font-bold text-slate-900">
              {idea.viewsCount || 0}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Handshake className="w-3 h-3 text-indigo-600" />
              Interested Partners
            </span>
            <div className="text-base sm:text-lg font-bold text-slate-900">
              {idea.commitmentsCount || commitmentsList.length}
            </div>
          </div>
        </div>

        {/* Like & Commit Action CTAs */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          {/* Like button */}
          <motion.button
            type="button"
            onClick={handleLike}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              isLiked
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
            <span>{isLiked ? 'Liked' : 'Like Idea'}</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/80 text-xs">
              {idea.likesCount || 0}
            </span>
          </motion.button>

          {/* I'm Interested Collaboration CTA */}
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                dispatch(openAuthModal({ intent: 'Sign in to express interest in collaborating on this idea.' }));
              } else {
                setIsCommitModalOpen(true);
              }
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base shadow-md shadow-blue-600/20 hover:shadow-lg transition"
          >
            <Handshake className="w-5 h-5" />
            <span>I'm Interested / Request Collaboration</span>
          </button>
        </div>
      </div>

      {/* Inspirational Community Disclaimer */}
      <DisclaimerBanner variant="card" />

      {/* Full Description / Executive Concept */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg pb-3 border-b border-slate-100">
          <Layers className="w-5 h-5 text-blue-600" />
          <h2>Concept & Market Opportunity</h2>
        </div>
        <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {idea.fullDescription}
        </div>
      </div>

      {/* Execution Roadmap */}
      {Array.isArray(idea.executionSteps) && idea.executionSteps.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg pb-3 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2>Step-by-Step Execution Guide</h2>
          </div>

          <div className="space-y-4">
            {idea.executionSteps.map((stepItem, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50/40 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {stepItem.step || index + 1}
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    {stepItem.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Required Resources & Budget Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Required Resources */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <Building className="w-5 h-5 text-indigo-600" />
            <h3>Required Resources & Tools</h3>
          </div>
          <ul className="space-y-2.5">
            {Array.isArray(idea.requiredResources) && idea.requiredResources.length > 0 ? (
              idea.requiredResources.map((res, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                  <span>{res}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400 italic">No specific resources listed.</li>
            )}
          </ul>
        </div>

        {/* Budget Allocation Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <Coins className="w-5 h-5 text-amber-600" />
            <h3>Budget Allocation (PKR)</h3>
          </div>

          <div className="space-y-3">
            {Array.isArray(idea.budgetBreakdown) && idea.budgetBreakdown.length > 0 ? (
              idea.budgetBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item.item}</span>
                    <span className="text-slate-900 font-bold">{formatPKR(item.amount)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage || 25}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Estimated total budget: {formatPKR(idea.budget)}</p>
            )}
          </div>
        </div>

      </div>

      {/* Monetization & Risk Mitigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Monetization */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-2 border-b border-slate-100">
            <Coins className="w-5 h-5 text-emerald-600" />
            <h3>Monetization Strategy</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {idea.monetization || 'Direct service/product pricing with healthy margins.'}
          </p>
        </div>

        {/* Risk Mitigation */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-2 border-b border-slate-100">
            <Shield className="w-5 h-5 text-red-500" />
            <h3>Risks & Mitigation</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {idea.risksAndMitigation || 'Operational risks handled through lean MVP testing.'}
          </p>
        </div>

      </div>

      {/* Community Collaboration Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Interested Collaborators ({commitmentsList.length})
              </h3>
              <p className="text-xs text-slate-500">
                Community members who want to build, fund, or contribute to this opportunity.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                dispatch(openAuthModal({ intent: 'Sign in to join as a collaborator.' }));
              } else {
                setIsCommitModalOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition"
          >
            <Handshake className="w-4 h-4" />
            <span>Join Venture</span>
          </button>
        </div>

        {commitmentsList.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs sm:text-sm">
            No commitments yet. Click "I'm Interested" above to be the first collaborator!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {commitmentsList.map((comm) => (
              <div key={comm.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={comm.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${comm.userName}`}
                      alt={comm.userName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-xs font-bold text-slate-900">{comm.userName}</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                    {comm.roleLabel || comm.role}
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "{comm.message}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discussion & Comments */}
      <CommentsSection idea={idea} />

      {/* Commitment Modal */}
      <CommitmentModal
        idea={idea}
        isOpen={isCommitModalOpen}
        onClose={() => setIsCommitModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete this Idea?"
        message="Are you sure you want to delete this idea blueprint? This action is permanent and cannot be undone."
        confirmText="Yes, Delete Idea"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

    </div>
  );
}
