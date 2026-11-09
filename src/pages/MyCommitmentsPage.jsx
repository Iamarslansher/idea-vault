import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Handshake, ExternalLink, Clock, Wallet, MapPin, CheckCircle } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import { formatPKR, formatRelativeTime } from '../utils/formatters';

export default function MyCommitmentsPage() {
  const { items: commitments } = useSelector((state) => state.commitments);
  const { user } = useSelector((state) => state.auth);

  const myCommitments = commitments.filter((c) => c.userId === user?.uid);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
            <Handshake className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Partnerships & Interests
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-navy-950">
          My Commitments & Collaboration Requests ({myCommitments.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Opportunities where you have expressed interest as a partner, investor, developer, or marketer.
        </p>
      </div>

      {myCommitments.length === 0 ? (
        <EmptyState
          title="No active commitments"
          description="When you browse ideas on IdeaVault and click 'I'm Interested', your collaboration proposals and contact logs will appear here."
          actionText="Explore Opportunities"
          onAction={() => window.location.href = '/explore'}
          icon={Handshake}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myCommitments.map((comm) => (
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
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{comm.status || 'Active'}</span>
                  </span>
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
                  Sent {formatRelativeTime(comm.createdAt)}
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

    </div>
  );
}

