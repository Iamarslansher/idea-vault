import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Heart, Bookmark } from 'lucide-react';
import IdeaGrid from '../components/ideas/IdeaGrid';
import CommitmentModal from '../components/ideas/CommitmentModal';

export default function LikedIdeasPage() {
  const { items: ideas, bookmarks } = useSelector((state) => state.ideas);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('liked'); // 'liked' | 'bookmarks'
  const [selectedIdeaForCommit, setSelectedIdeaForCommit] = useState(null);

  const likedIdeas = ideas.filter(
    (i) => Array.isArray(i.likedBy) && user?.uid && i.likedBy.includes(user.uid)
  );

  const bookmarkedIdeas = ideas.filter((i) => bookmarks.includes(i.id));

  const currentDisplayList = activeTab === 'liked' ? likedIdeas : bookmarkedIdeas;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950">
          Saved & Liked Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Quickly access ventures you have favored or bookmarked for execution.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('liked')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === 'liked'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className={`w-4 h-4 ${activeTab === 'liked' ? 'fill-red-500 text-red-500' : ''}`} />
          <span>Liked Ideas ({likedIdeas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === 'bookmarks'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${activeTab === 'bookmarks' ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>Bookmarks ({bookmarkedIdeas.length})</span>
        </button>
      </div>

      {/* Ideas Grid */}
      <IdeaGrid
        ideas={currentDisplayList}
        onCommitClick={(idea) => setSelectedIdeaForCommit(idea)}
        emptyTitle={activeTab === 'liked' ? 'No liked ideas yet' : 'No bookmarked ideas yet'}
        emptyDescription={
          activeTab === 'liked'
            ? 'Click the red heart on idea cards across the explore page to save them here.'
            : 'Click the bookmark icon on any idea to track it for later execution.'
        }
      />

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

