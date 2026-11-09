import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  User,
  MapPin,
  Briefcase,
  Heart,
  Eye,
  Lightbulb,
  Sparkles,
  ShieldCheck,
  Edit,
  Share2
} from 'lucide-react';
import IdeaGrid from '../components/ideas/IdeaGrid';
import CommitmentModal from '../components/ideas/CommitmentModal';
import { firebaseService, DEMO_USERS } from '../services/firebaseService';
import toast from 'react-hot-toast';

export default function PublicProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { items: ideas } = useSelector((state) => state.ideas);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [creatorProfile, setCreatorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIdeaForCommit, setSelectedIdeaForCommit] = useState(null);

  // Filter ideas shared by this creator
  const creatorIdeas = ideas.filter(
    (i) => (i.creatorId || i.ownerId) === userId
  );

  // Compute statistics
  const totalLikes = creatorIdeas.reduce((sum, i) => sum + (i.likesCount || 0), 0);
  const totalViews = creatorIdeas.reduce((sum, i) => sum + (i.viewsCount || 0), 0);

  const isSelf = Boolean(currentUser?.uid && currentUser.uid === userId);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setLoading(true);

      // 1. If self
      if (currentUser && currentUser.uid === userId) {
        if (isMounted) {
          setCreatorProfile(currentUser);
          setLoading(false);
        }
        return;
      }

      // 2. Check demo users
      const demoMatch = DEMO_USERS.find((d) => d.uid === userId);
      if (demoMatch) {
        if (isMounted) {
          setCreatorProfile(demoMatch);
          setLoading(false);
        }
        return;
      }

      // 3. Check Firestore
      try {
        const fetched = await firebaseService.getUserProfile(userId);
        if (fetched && isMounted) {
          setCreatorProfile(fetched);
          setLoading(false);
          return;
        }
      } catch (e) {
        // Fallback
      }

      // 4. Derive from idea details if available
      const sampleIdea = creatorIdeas[0];
      if (sampleIdea && isMounted) {
        setCreatorProfile({
          uid: userId,
          displayName: sampleIdea.creatorName || 'IdeaVault Creator',
          avatar: sampleIdea.creatorAvatar,
          role: sampleIdea.creatorRole || 'Entrepreneur',
          location: sampleIdea.location || 'Pakistan',
          bio: `Active entrepreneur and creator sharing innovative opportunity blueprints on IdeaVault.`,
          skills: [sampleIdea.categoryLabel || 'Business Ideation']
        });
      } else if (isMounted) {
        setCreatorProfile({
          uid: userId,
          displayName: 'IdeaVault Creator',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`,
          role: 'Entrepreneur',
          location: 'Pakistan',
          bio: 'Community member contributing ideas and ventures to IdeaVault.',
          skills: ['Entrepreneurship']
        });
      }

      if (isMounted) setLoading(false);
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [userId, currentUser, creatorIdeas.length]);

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile link copied to clipboard!');
  };

  const name = creatorProfile?.displayName || creatorIdeas[0]?.creatorName || 'IdeaVault Creator';
  const avatar = creatorProfile?.photoURL || creatorProfile?.avatar || creatorIdeas[0]?.creatorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
  const role = creatorProfile?.role || creatorIdeas[0]?.creatorRole || 'IdeaVault Builder';
  const location = creatorProfile?.location || creatorIdeas[0]?.location || 'Pakistan';
  const bio = creatorProfile?.bio || 'Active entrepreneur sharing venture blueprints on IdeaVault.';
  const skills = creatorProfile?.skills || ['Entrepreneurship', 'Market Strategy'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-navy-950 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleShareProfile}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-navy-950 hover:bg-slate-50 transition"
          title="Share Profile"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Creator Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={avatar}
            alt={name}
            className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 shadow-md shrink-0 ring-4 ring-blue-50"
          />

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 flex items-center justify-center sm:justify-start gap-2">
                  <span>{name}</span>
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" title="Verified Creator" />
                </h1>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Member of IdeaVault Community
                </div>
              </div>

              {isSelf && (
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold self-center sm:self-auto transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Settings</span>
                </Link>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {role}
              </span>
              <span className="text-xs text-slate-600 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{location}</span>
              </span>
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed pt-1">
              {bio}
            </p>

            {/* Skills */}
            {Array.isArray(skills) && skills.length > 0 && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Creator Metrics Row */}
        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-xl sm:text-2xl font-black text-navy-950">
              {creatorIdeas.length}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
              <span>Ideas Shared</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-xl sm:text-2xl font-black text-navy-950">
              {totalLikes}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>Likes Received</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-xl sm:text-2xl font-black text-navy-950">
              {totalViews}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Total Views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Ideas Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-950">
              Blueprints & Ideas by {name} ({creatorIdeas.length})
            </h2>
            <p className="text-xs text-slate-500">
              Explore opportunities published by this creator.
            </p>
          </div>
        </div>

        <IdeaGrid
          ideas={creatorIdeas}
          onCommitClick={(idea) => setSelectedIdeaForCommit(idea)}
          emptyTitle="No ideas published yet"
          emptyDescription={`${name} hasn't shared any public ideas yet.`}
        />
      </div>

      {/* Commitment Modal */}
      {selectedIdeaForCommit && (
        <CommitmentModal
          idea={selectedIdeaForCommit}
          isOpen={Boolean(selectedIdeaForCommit)}
          onClose={() => setSelectedIdeaForCommit(null)}
        />
      )}

    </div>
  );
}

