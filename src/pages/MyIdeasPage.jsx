import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FolderGit2,
  PlusCircle,
  Eye,
  Heart,
  Handshake,
  Edit,
  Trash2,
  ExternalLink,
  Wallet,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/common/ConfirmationModal';
import EmptyState from '../components/common/EmptyState';
import { deleteIdea } from '../store/slices/ideasSlice';
import { firebaseService } from '../services/firebaseService';
import { formatPKR, formatRelativeTime } from '../utils/formatters';

export default function MyIdeasPage() {
  const dispatch = useDispatch();

  const { items: ideas } = useSelector((state) => state.ideas);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [ideaToDelete, setIdeaToDelete] = useState(null);

  const myIdeas = ideas.filter((i) => i.creatorId === user?.uid);

  const handleDeleteConfirm = async () => {
    if (!ideaToDelete) return;
    try {
      await firebaseService.deleteIdea(ideaToDelete.id);
      dispatch(deleteIdea(ideaToDelete.id));
      toast.success('Idea deleted.');
      setIdeaToDelete(null);
    } catch (e) {
      toast.error('Failed to delete idea.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
              <FolderGit2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Portfolio & Management
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-navy-950">
            My Shared Ideas ({myIdeas.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your posted business blueprints, track live community engagement, and edit details.
          </p>
        </div>

        <Link
          to="/share"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Idea</span>
        </Link>
      </div>

      {myIdeas.length === 0 ? (
        <EmptyState
          title="You haven't posted any ideas yet"
          description="Have a venture idea, software concept, or retail proposal? Share it with thousands of Pakistani builders and investors."
          actionText="Create an Idea"
          onAction={() => window.location.href = '/share'}
          icon={FolderGit2}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myIdeas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-soft hover:shadow-card transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left details */}
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {idea.categoryLabel || idea.category}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {idea.businessType}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(idea.createdAt)}
                  </span>
                </div>

                <Link
                  to={`/ideas/${idea.id}`}
                  className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition block truncate"
                >
                  {idea.title}
                </Link>

                <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">
                  {idea.shortDescription}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Req. Budget: <strong className="text-slate-800">{formatPKR(idea.budget)}</strong></span>
                  <span>•</span>
                  <span>Location: <strong className="text-slate-800">{idea.location}</strong></span>
                </div>
              </div>

              {/* Right metrics & action buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                {/* Stats */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1" title="Likes">
                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    <span>{idea.likesCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1" title="Views">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{idea.viewsCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1" title="Collaborators">
                    <Handshake className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{idea.commitmentsCount || idea.commitments?.length || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/ideas/${idea.id}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="View Idea"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/edit/${idea.id}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIdeaToDelete(idea)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                    title="Delete Idea"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(ideaToDelete)}
        title="Delete this Idea?"
        message={`Are you sure you want to permanently delete "${ideaToDelete?.title}"? All metrics and comments will be erased.`}
        confirmText="Yes, Delete Idea"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIdeaToDelete(null)}
      />

    </div>
  );
}

