import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Compass, Sparkles, Filter, SlidersHorizontal, PlusCircle } from 'lucide-react';
import IdeaFilters from '../components/ideas/IdeaFilters';
import IdeaGrid from '../components/ideas/IdeaGrid';
import CommitmentModal from '../components/ideas/CommitmentModal';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { setFilters, resetFilters } from '../store/slices/ideasSlice';
import { openAuthModal } from '../store/slices/uiSlice';
import { BUDGET_TIERS } from '../config/constants';

export default function ExplorePage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { items: ideas } = useSelector((state) => state.ideas);
  const {
    activeCategory,
    searchQuery,
    selectedLocation,
    selectedBusinessType,
    selectedBudgetTier,
    customMinBudget,
    customMaxBudget,
    sortBy,
  } = useSelector((state) => state.ideas);

  const [selectedIdeaForCommit, setSelectedIdeaForCommit] = useState(null);

  // Sync category param from URL if present (e.g. /explore?category=karachi-local)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      dispatch(setFilters({ activeCategory: categoryParam }));
    }
  }, [searchParams, dispatch]);

  // Filter & Sort Logic
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      // Category filter
      if (activeCategory !== 'all' && idea.category !== activeCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All Locations') {
        const ideaLoc = (idea.location || '').toLowerCase();
        const targetLoc = selectedLocation.toLowerCase();
        if (!ideaLoc.includes(targetLoc) && !targetLoc.includes(ideaLoc)) {
          return false;
        }
      }

      // Business Type filter
      if (selectedBusinessType !== 'all' && idea.businessType !== selectedBusinessType) {
        return false;
      }

      // Budget Tier filter
      if (selectedBudgetTier !== 'all') {
        const tier = BUDGET_TIERS.find(t => t.id === selectedBudgetTier);
        if (tier) {
          const budgetNum = Number(idea.budget) || 0;
          if (budgetNum < tier.min || budgetNum > tier.max) {
            return false;
          }
        }
      }

      // Custom budget range
      if (customMinBudget !== '' && Number(idea.budget) < Number(customMinBudget)) {
        return false;
      }
      if (customMaxBudget !== '' && Number(idea.budget) > Number(customMaxBudget)) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (idea.title || '').toLowerCase().includes(q);
        const matchDesc = (idea.shortDescription || '').toLowerCase().includes(q) ||
                          (idea.fullDescription || '').toLowerCase().includes(q);
        const matchLoc = (idea.location || '').toLowerCase().includes(q);
        const matchCat = (idea.categoryLabel || idea.category || '').toLowerCase().includes(q);
        const matchCreator = (idea.creatorName || '').toLowerCase().includes(q);

        if (!matchTitle && !matchDesc && !matchLoc && !matchCat && !matchCreator) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'likes') return (b.likesCount || 0) - (a.likesCount || 0);
      if (sortBy === 'views') return (b.viewsCount || 0) - (a.viewsCount || 0);
      if (sortBy === 'budget-low') return (a.budget || 0) - (b.budget || 0);
      if (sortBy === 'budget-high') return (b.budget || 0) - (a.budget || 0);
      // default: recent
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [
    ideas,
    activeCategory,
    searchQuery,
    selectedLocation,
    selectedBusinessType,
    selectedBudgetTier,
    customMinBudget,
    customMaxBudget,
    sortBy
  ]);

  const handleCommitClick = (idea) => {
    setSelectedIdeaForCommit(idea);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Discovery Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            Explore Business Ideas & Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse practical Pakistani and global venture blueprints with real PKR budgets, execution steps, and collaborators.
          </p>
        </div>

        {/* Results Counter Badge */}
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-xs self-start md:self-auto">
          Showing <span className="text-blue-600 font-bold">{filteredIdeas.length}</span> opportunities
        </div>
      </div>

      {/* Filter Toolbar */}
      <IdeaFilters />

      {/* Community Disclaimer */}
      <DisclaimerBanner variant="compact" />

      {/* Ideas Grid */}
      <IdeaGrid
        ideas={filteredIdeas}
        onCommitClick={handleCommitClick}
        onResetFilters={() => dispatch(resetFilters())}
      />

      {/* Collaboration Commitment Modal */}
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

