import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  MapPin,
  Briefcase,
  Wallet,
  Sparkles,
  ArrowUpDown,
  X
} from 'lucide-react';
import { CATEGORIES, LOCATIONS, BUSINESS_TYPES, BUDGET_TIERS } from '../../config/constants';
import { setFilters, resetFilters } from '../../store/slices/ideasSlice';

export default function IdeaFilters({ className = '' }) {
  const dispatch = useDispatch();
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

  const hasActiveFilters = Boolean(
    activeCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedLocation !== 'All Locations' ||
    selectedBusinessType !== 'all' ||
    selectedBudgetTier !== 'all' ||
    customMinBudget !== '' ||
    customMaxBudget !== '' ||
    sortBy !== 'recent'
  );

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Search Bar + Primary Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Term Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setFilters({ searchQuery: e.target.value }))}
              placeholder="Search ideas by keyword (e.g., Karachi, solar, cloud kitchen, SaaS)..."
              className="w-full pl-11 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => dispatch(setFilters({ searchQuery: '' }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Selector */}
          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedLocation}
              onChange={(e) => dispatch(setFilters({ selectedLocation: e.target.value }))}
              className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs sm:text-sm font-medium text-slate-700 appearance-none cursor-pointer"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Business Type Selector */}
          <div className="md:col-span-2 relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedBusinessType}
              onChange={(e) => dispatch(setFilters({ selectedBusinessType: e.target.value }))}
              className="w-full pl-9 pr-6 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs sm:text-sm font-medium text-slate-700 appearance-none cursor-pointer"
            >
              {BUSINESS_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-2 relative">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={sortBy}
              onChange={(e) => dispatch(setFilters({ sortBy: e.target.value }))}
              className="w-full pl-9 pr-6 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs sm:text-sm font-medium text-slate-700 appearance-none cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="likes">Most Liked</option>
              <option value="views">Most Viewed</option>
              <option value="budget-low">Lowest Budget</option>
              <option value="budget-high">Highest Budget</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => dispatch(setFilters({ activeCategory: cat.id }))}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Budget Tiers & Reset Bar */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              Budget:
            </span>
            {BUDGET_TIERS.map((tier) => {
              const isSelected = selectedBudgetTier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => dispatch(setFilters({ selectedBudgetTier: tier.id }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tier.label}
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => dispatch(resetFilters())}
              className="flex items-center gap-1 text-slate-500 hover:text-red-600 font-semibold transition text-xs shrink-0 ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

