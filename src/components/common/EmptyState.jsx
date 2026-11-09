import React from 'react';
import { Lightbulb, RotateCcw, PlusCircle } from 'lucide-react';

export default function EmptyState({
  title = 'No ideas found',
  description = 'Try adjusting your search criteria, clearing filters, or be the first to share an idea in this category!',
  actionText = 'Reset Filters',
  onAction,
  secondaryActionText = 'Share an Idea',
  onSecondaryAction,
  icon: Icon = Lightbulb,
}) {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-dashed border-slate-300 max-w-xl mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-blue-500" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>{actionText}</span>
          </button>
        )}

        {onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{secondaryActionText}</span>
          </button>
        )}
      </div>
    </div>
  );
}

