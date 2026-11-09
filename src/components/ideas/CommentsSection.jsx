import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Send, Clock, Sparkles } from 'lucide-react';
import { addCommentLocal } from '../../store/slices/ideasSlice';
import { openAuthModal } from '../../store/slices/uiSlice';
import { firebaseService } from '../../services/firebaseService';
import { formatRelativeTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function CommentsSection({ idea }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const comments = Array.isArray(idea?.comments) ? idea.comments : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(openAuthModal({ intent: 'Sign in to join the discussion on this idea.' }));
      return;
    }

    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const updatedIdea = await firebaseService.addComment(idea.id, {
        text: commentText.trim(),
        user
      });

      const newCommentObj = updatedIdea?.comments?.[0] || {
        id: 'comm-' + Date.now(),
        userId: user.uid,
        userName: user.displayName,
        userAvatar: user.avatar,
        content: commentText.trim(),
        createdAt: Date.now()
      };

      dispatch(addCommentLocal({ ideaId: idea.id, comment: newCommentObj }));
      setCommentText('');
      toast.success('Comment posted!');
    } catch (err) {
      toast.error('Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft">
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Community Discussion ({comments.length})
            </h3>
            <p className="text-xs text-slate-500">
              Ask questions, give feedback, or share ideas on execution.
            </p>
          </div>
        </div>
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=Guest`}
            alt="Current user"
            className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 mt-1"
          />
          <div className="flex-1 space-y-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isAuthenticated ? "Write a thoughtful question or suggestion..." : "Sign in to join the discussion..."}
              rows={2}
              className="w-full p-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
              onFocus={() => {
                if (!isAuthenticated) {
                  dispatch(openAuthModal({ intent: 'Sign in to join the discussion on this idea.' }));
                }
              }}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No comments yet. Be the first to start the discussion!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <img
                src={comment.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.userName}`}
                alt={comment.userName}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {comment.userName}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

