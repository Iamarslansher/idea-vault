import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IdeaCard from './IdeaCard';
import SkeletonCard from '../common/SkeletonCard';
import EmptyState from '../common/EmptyState';

export default function IdeaGrid({
  ideas = [],
  loading = false,
  onCommitClick,
  onResetFilters,
  emptyTitle,
  emptyDescription,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No ideas match your filters'}
        description={emptyDescription || 'We could not find any business or project opportunities matching your current filters. Try relaxing your budget or category.'}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onCommitClick={onCommitClick}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

