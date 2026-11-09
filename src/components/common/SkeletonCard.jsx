import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft animate-pulse flex flex-col justify-between">
      <div>
        {/* Creator header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 bg-slate-200 rounded w-28"></div>
            <div className="h-2.5 bg-slate-200 rounded w-20"></div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 bg-slate-200 rounded-full w-20"></div>
          <div className="h-5 bg-slate-200 rounded-full w-16"></div>
        </div>

        {/* Title */}
        <div className="h-5 bg-slate-200 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>

        {/* Short description */}
        <div className="space-y-2 mb-5">
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-4/5"></div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-6 bg-slate-200 rounded w-24"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
          <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

