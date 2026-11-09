import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wallet,
  MapPin,
  Briefcase,
  Layers,
  Wand2,
  CheckCircle2,
  Coins,
  Shield,
  PlusCircle,
  Key,
  RotateCcw,
  Building,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { LOCATIONS, BUSINESS_TYPES, APP_CONFIG } from '../config/constants';
import { generateAIIdea } from '../services/geminiService';
import { addIdea } from '../store/slices/ideasSlice';
import { openAuthModal } from '../store/slices/uiSlice';
import { firebaseService } from '../services/firebaseService';
import { formatPKR } from '../utils/formatters';

export default function AIGeneratorPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Form states
  const [budgetPKR, setBudgetPKR] = useState(75000);
  const [city, setCity] = useState('Karachi');
  const [businessType, setBusinessType] = useState('Hybrid');
  const [skills, setSkills] = useState('Sales, Social Media Marketing, Cooking');
  const [customPrompt, setCustomPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Generation state
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const skillPresets = [
    'Web & React Development',
    'Social Media Marketing & TikTok',
    'Cooking, Baking & Culinary',
    'Graphic Design & Branding',
    'Sales, Distribution & Retail',
    'Solar Installation & Electrical'
  ];

  const budgetQuickTicks = [35000, 75000, 150000, 350000, 750000, 1500000];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedResult(null);

    try {
      const result = await generateAIIdea({
        budgetPKR,
        city,
        businessType,
        skills,
        customPrompt,
        apiKey
      });

      setGeneratedResult(result);
      toast.success('Your custom business blueprint has been generated! 🚀');
    } catch (err) {
      toast.error('Generation error. Please check inputs or API key.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishDirectly = async () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal({ intent: 'Sign in to publish this AI-generated blueprint to IdeaVault.' }));
      return;
    }

    if (!generatedResult) return;

    setPublishing(true);
    try {
      const created = await firebaseService.createIdea(generatedResult, user);
      dispatch(addIdea(created));

      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.7 }
      });

      toast.success('AI Blueprint published directly to IdeaVault! 🎉');
      navigate(`/ideas/${created.id}`);
    } catch (err) {
      toast.error('Failed to publish idea.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Powered by Google Gemini AI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-950">
          AI Venture Generator
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Input your available budget in PKR, your Pakistani city, and skills. Gemini will engineer a tailored, highly viable business roadmap with step-by-step guidance.
        </p>
      </div>

      {/* Inspirational Banner */}
      <DisclaimerBanner variant="card" />

      {/* Generator Input Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft">
        <form onSubmit={handleGenerate} className="space-y-6">
          
          {/* Budget in PKR Slider & Input */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" />
                Available Investment Budget (PKR)
              </label>
              <span className="text-sm sm:text-base font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">
                {formatPKR(budgetPKR)}
              </span>
            </div>

            <input
              type="range"
              min="20000"
              max="2000000"
              step="10000"
              value={budgetPKR}
              onChange={(e) => setBudgetPKR(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Quick Select:</span>
              {budgetQuickTicks.map((tick) => (
                <button
                  key={tick}
                  type="button"
                  onClick={() => setBudgetPKR(tick)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    budgetPKR === tick
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tick >= 100000 ? `${tick / 100000} Lakh` : `${tick / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* City & Business Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Pakistani City / Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm bg-white font-medium"
                >
                  {LOCATIONS.filter(l => l !== 'All Locations').map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Preference / Model
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm bg-white font-medium"
                >
                  <option value="Online">Online / Digital E-commerce / SaaS</option>
                  <option value="Physical">Physical Store / Local On-ground Service</option>
                  <option value="Hybrid">Hybrid (Online Ordering + Local Delivery)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills & Background */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Skills, Hobbies, or Work Experience
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Sales, React.js, Cooking, Motorcycle driving, Graphic design..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
              required
            />
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400">Suggestions:</span>
              {skillPresets.map((sk) => (
                <button
                  key={sk}
                  type="button"
                  onClick={() => setSkills(sk)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition"
                >
                  + {sk}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Additional Notes or Constraints (Optional)
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Must be executable within 14 days, no heavy machinery..."
              className="w-full px-4 py-2 rounded-2xl border border-slate-300 text-xs sm:text-sm"
            />
          </div>

          {/* Advanced Gemini Key Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{showKeyInput ? 'Hide Gemini API Key Settings' : 'Advanced: Use Custom Gemini API Key'}</span>
            </button>

            {showKeyInput && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
                <p className="text-[11px] text-slate-500">
                  Optional: If left empty, IdeaVault uses the built-in system key or localized Pakistan economic template engine.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-extrabold text-base shadow-lg shadow-blue-600/25 hover:shadow-xl transition flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Wand2 className="w-5 h-5 animate-spin" />
                <span>Gemini is engineering your business blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generate Custom Business Blueprint</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Result Blueprint Display */}
      {generatedResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-500/80 shadow-2xl space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
                <Sparkles className="w-3.5 h-3.5" />
                Generated Opportunity Blueprint
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                {generatedResult.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                {generatedResult.categoryLabel || generatedResult.category}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {generatedResult.businessType}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Req. Budget</span>
              <strong className="text-sm font-extrabold text-slate-900">{formatPKR(generatedResult.budget)}</strong>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Location</span>
              <strong className="text-sm font-extrabold text-slate-900">{generatedResult.location}</strong>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Source</span>
              <strong className="text-sm font-extrabold text-blue-600">Gemini 2.5 Flash</strong>
            </div>
          </div>

          {/* Concept Pitch */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              The Elevator Pitch
            </h4>
            <p className="text-base text-slate-800 font-medium leading-relaxed">
              {generatedResult.shortDescription}
            </p>
          </div>

          {/* In-depth Concept */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Market Opportunity & Pakistani Context
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {generatedResult.fullDescription}
            </p>
          </div>

          {/* Step-by-Step Blueprint */}
          {Array.isArray(generatedResult.executionSteps) && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Execution Roadmap (4-5 Phases)
              </h4>
              <div className="space-y-2.5">
                {generatedResult.executionSteps.map((stepItem, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {stepItem.step || idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{stepItem.title}</div>
                      <div className="text-xs text-slate-600 leading-relaxed">{stepItem.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget Allocation Breakdown */}
          {Array.isArray(generatedResult.budgetBreakdown) && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                PKR Budget Allocation Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {generatedResult.budgetBreakdown.map((b, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">{b.item}</span>
                    <strong className="text-slate-900">{formatPKR(b.amount)} ({b.percentage}%)</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monetization & Risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
              <div className="text-xs font-bold text-emerald-900 uppercase">Monetization & Margins</div>
              <p className="text-xs text-emerald-800 leading-relaxed">{generatedResult.monetization}</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1">
              <div className="text-xs font-bold text-amber-900 uppercase">Risks & Local Mitigation</div>
              <p className="text-xs text-amber-800 leading-relaxed">{generatedResult.risksAndMitigation}</p>
            </div>
          </div>

          {/* Direct Publish CTA Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 italic">
              Satisfied with this blueprint? Publish it to the platform or share it with co-founders.
            </p>

            <button
              type="button"
              onClick={handlePublishDirectly}
              disabled={publishing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{publishing ? 'Publishing to IdeaVault...' : 'Publish Directly to IdeaVault'}</span>
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}

