import React from 'react';
import { Compass, Sparkles, HeartHandshake } from 'lucide-react';
import { APP_CONFIG } from '../../config/constants';

export default function DisclaimerBanner({ variant = 'card', className = '' }) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs ${className}`}>
        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="italic leading-relaxed font-medium">
          {APP_CONFIG.disclaimer}
        </span>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <p className={`text-xs text-slate-500 italic flex items-center gap-1.5 ${className}`}>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
        <span>{APP_CONFIG.disclaimer}</span>
      </p>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-blue-950 p-5 md:p-6 text-white shadow-soft border border-slate-800 ${className}`}>
      {/* Subtle background glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-400">
          <HeartHandshake className="w-6 h-6 text-amber-300" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
              Community Principle & Inspiration
            </span>
          </div>
          <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed italic">
            "{APP_CONFIG.disclaimer}"
          </p>
        </div>
      </div>
    </div>
  );
}

