import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Handshake, CheckCircle2, Sparkles, Send, User, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { COMMITMENT_ROLES } from '../../config/constants';
import { addCommitmentRecord } from '../../store/slices/commitmentsSlice';
import { addCommitmentLocal } from '../../store/slices/ideasSlice';
import { firebaseService } from '../../services/firebaseService';
import { formatPKR } from '../../utils/formatters';

export default function CommitmentModal({ idea, isOpen, onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [selectedRole, setSelectedRole] = useState(COMMITMENT_ROLES[0].id);
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !idea) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please write a brief note on how you would like to collaborate.');
      return;
    }

    setSubmitting(true);
    const chosenRoleObj = COMMITMENT_ROLES.find(r => r.id === selectedRole) || COMMITMENT_ROLES[0];

    try {
      const commitment = await firebaseService.addCommitment(idea.id, {
        role: chosenRoleObj.id,
        roleLabel: chosenRoleObj.label,
        message: `${message}${contactInfo ? `\n\nContact / WhatsApp: ${contactInfo}` : ''}`,
        user
      });

      dispatch(addCommitmentRecord(commitment));
      dispatch(addCommitmentLocal({ ideaId: idea.id, commitment }));

      // Trigger celebration confetti
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 }
      });

      toast.success('Your collaboration interest was sent to the idea creator! 🎉');
      onClose();
    } catch (err) {
      toast.error('Failed to submit collaboration request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 z-10 my-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Handshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Community Collaboration
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  Commit & Collaborate
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Target Idea Mini Card */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-5">
            <div className="text-xs font-bold text-slate-900 truncate mb-1">
              {idea.title}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span>Budget: <strong className="text-slate-800">{formatPKR(idea.budget)}</strong></span>
              <span>•</span>
              <span>Location: <strong className="text-slate-800">{idea.location}</strong></span>
              <span>•</span>
              <span>By {idea.creatorName}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                How do you want to collaborate?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {COMMITMENT_ROLES.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 mb-0.5">
                        {role.label}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">
                        {role.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note / Skills message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Proposal / Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Explain what skills, capital, or ideas you bring to this venture..."
                className="w-full p-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs sm:text-sm"
                required
              />
            </div>

            {/* Contact Info (WhatsApp / Phone) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Contact Info (WhatsApp / Phone / LinkedIn)
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="+92 300 1234567 or linkedin.com/in/..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs sm:text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Send Collaboration Request'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

