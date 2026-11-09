import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Handshake,
  ExternalLink,
  Clock,
  Wallet,
  MapPin,
  CheckCircle,
  Check,
  X,
  User,
  Inbox,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../components/common/EmptyState';
import { updateCommitmentStatus } from '../store/slices/commitmentsSlice';
import { updateIdeaCommitmentStatusLocal } from '../store/slices/ideasSlice';
import { firebaseService } from '../services/firebaseService';
import { formatPKR, formatRelativeTime } from '../utils/formatters';

export default function MyCommitmentsPage() {
  const dispatch = useDispatch();
  const { items: commitments } = useSelector((state) => state.commitments);
  const { user } = useSelector((state) => state.auth);

  // Incoming requests on the user's ideas
  const incomingRequests = commitments.filter(
    (c) => (c.creatorId === user?.uid || c.ownerId === user?.uid) && c.senderId !== user?.uid && c.userId !== user?.uid
  );

  // Sent commitments by this user
  const sentCommitments = commitments.filter(
    (c) => c.senderId === user?.uid || c.userId === user?.uid
  );

  const pendingIncomingCount = incomingRequests.filter(
    (c) => (c.status || '').toLowerCase() === 'pending'
  ).length;

  const [activeTab, setActiveTab] = useState(
    pendingIncomingCount > 0 ? 'incoming' : 'sent'
  );

  const handleUpdateStatus = async (commitmentId, newStatus) => {
    try {
      await firebaseService.updateCommitmentStatus(commitmentId, newStatus);
      dispatch(updateCommitmentStatus({ id: commitmentId, status: newStatus }));
      dispatch(updateIdeaCommitmentStatusLocal({ commitmentId, status: newStatus }));
      toast.success(
        newStatus === 'accepted'
          ? 'Collaboration request accepted! 🟢'
          : 'Collaboration request declined 🔴'
      );
    } catch (e) {
      toast.error('Failed to update request status.');
    }
  };

  const renderStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'accepted') {
      return (
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-xs">
          <span>🟢</span>
          <span>Accepted</span>
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5 shadow-xs">
          <span>🔴</span>
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 shadow-xs">
        <span>🟡</span>
        <span>Pending</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
            <Handshake className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Partnerships & Collaboration Center
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-navy-950">
          Commitments & Collaborations
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Manage incoming requests from potential partners and track your outgoing collaboration proposals.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === 'incoming'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Requests ({incomingRequests.length})</span>
          {pendingIncomingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
              {pendingIncomingCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === 'sent'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>My Commitments ({sentCommitments.length})</span>
        </button>
      </div>

      {/* TAB 1: Incoming Requests (For Creators) */}
      {activeTab === 'incoming' && (
        <>
          {incomingRequests.length === 0 ? (
            <EmptyState
              title="No incoming collaboration requests yet"
              description="When other entrepreneurs, developers, or investors want to collaborate on your ideas, their proposals will appear here."
              actionText="View My Ideas"
              onAction={() => window.location.href = '/my-ideas'}
              icon={Inbox}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {incomingRequests.map((comm) => {
                const isPending = (comm.status || 'pending').toLowerCase() === 'pending';
                const requesterId = comm.senderId || comm.userId;

                return (
                  <div
                    key={comm.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-soft space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      {/* Requester Info */}
                      <Link
                        to={`/user/${requesterId}`}
                        className="flex items-center gap-3 group/user"
                        title="View user profile"
                      >
                        <img
                          src={comm.senderAvatar || comm.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${comm.senderName || comm.userName}`}
                          alt={comm.senderName || comm.userName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover/user:ring-2 group-hover/user:ring-blue-500 transition-all shrink-0"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover/user:text-blue-600 transition flex items-center gap-1.5">
                            <span>{comm.senderName || comm.userName || 'IdeaVault User'}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover/user:opacity-100 transition" />
                          </div>
                          <div className="text-xs text-slate-500">
                            Wants to collaborate as <strong className="text-blue-700">{comm.roleLabel || comm.role}</strong>
                          </div>
                        </div>
                      </Link>

                      {/* Interactive Accept & Reject Buttons OR Current Status */}
                      <div className="flex items-center gap-2">
                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(comm.id, 'accepted')}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-sm hover:shadow transition"
                              title="Accept collaboration request"
                            >
                              <Check className="w-4 h-4" />
                              <span>Accept</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(comm.id, 'rejected')}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition"
                              title="Reject collaboration request"
                            >
                              <X className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          renderStatusBadge(comm.status)
                        )}
                      </div>
                    </div>

                    {/* Target Idea and Message */}
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500">
                        Idea: <Link to={`/ideas/${comm.ideaId}`} className="font-bold text-slate-900 hover:text-blue-600 transition underline-offset-2 hover:underline">{comm.ideaTitle}</Link>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Proposal & Message</span>
                        <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                          {comm.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Received {formatRelativeTime(comm.timestamp || comm.createdAt)}
                      </span>
                      <Link
                        to={`/ideas/${comm.ideaId}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        View idea blueprint &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: Sent Commitments ("My Commitments" with live status badges) */}
      {activeTab === 'sent' && (
        <>
          {sentCommitments.length === 0 ? (
            <EmptyState
              title="No active commitments"
              description="When you browse ideas on IdeaVault and click 'I'm Interested', your collaboration proposals and contact logs will appear here."
              actionText="Explore Opportunities"
              onAction={() => window.location.href = '/explore'}
              icon={Handshake}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sentCommitments.map((comm) => (
                <div
                  key={comm.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                        Opportunity Title
                      </span>
                      <Link
                        to={`/ideas/${comm.ideaId}`}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 transition flex items-center gap-1.5"
                      >
                        <span>{comm.ideaTitle}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Role: {comm.roleLabel || comm.role}
                      </span>
                      {/* Live status badge: Pending 🟡, Accepted 🟢, Rejected 🔴 */}
                      {renderStatusBadge(comm.status)}
                    </div>
                  </div>

                  {/* Message Note */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Your Proposal Message</span>
                    <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                      {comm.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Sent {formatRelativeTime(comm.timestamp || comm.createdAt)}
                    </span>
                    <Link
                      to={`/ideas/${comm.ideaId}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      View full idea blueprint &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}
