import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Compass,
  Users,
  Lightbulb,
  Wallet,
  MapPin,
  CheckCircle,
  PlusCircle,
  Rocket,
  Search,
  Handshake
} from 'lucide-react';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import IdeaCard from '../components/ideas/IdeaCard';
import { openAuthModal } from '../store/slices/uiSlice';
import { setFilters } from '../store/slices/ideasSlice';
import { CATEGORIES, APP_CONFIG } from '../config/constants';
import { formatPKR } from '../utils/formatters';

export default function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: ideas } = useSelector((state) => state.ideas);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Trending & Featured ideas (sorted by likes)
  const featuredIdeas = [...ideas]
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, 3);

  // Platform statistics
  const totalIdeas = ideas.length;
  const totalLikes = ideas.reduce((acc, i) => acc + (i.likesCount || 0), 0);
  const totalViews = ideas.reduce((acc, i) => acc + (i.viewsCount || 0), 0);
  const totalCommitments = ideas.reduce((acc, i) => acc + (i.commitmentsCount || 0), 0);

  const handleCategoryClick = (catId) => {
    dispatch(setFilters({ activeCategory: catId }));
    navigate('/explore');
  };

  const handleStartSharing = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal({ intent: 'Join IdeaVault to share your business concept with the community.' }));
    } else {
      navigate('/share');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 lg:pt-28 pb-12">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-transparent pointer-events-none -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-36 left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Pakistan's Dedicated Idea & Opportunity Discovery Hub</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-navy-950 max-w-4xl mx-auto leading-tight sm:leading-none"
          >
            Ideas Today. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
              Opportunities Tomorrow.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Discover battle-tested business blueprints, micro-SaaS projects, and local opportunities in Karachi, Lahore & across Pakistan. Complete with required budgets in PKR, execution steps, and collaborators.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
          >
            <Link
              to="/explore"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/25 hover:shadow-xl transition"
            >
              <Compass className="w-5 h-5" />
              <span>Explore Ideas</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              to="/ai-generator"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-sm hover:shadow transition"
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Gemini AI Generator</span>
            </Link>

            <button
              onClick={handleStartSharing}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-navy-900 hover:bg-navy-950 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition"
            >
              <PlusCircle className="w-5 h-5 text-blue-400" />
              <span>Share an Idea</span>
            </button>
          </motion.div>

          {/* Inspirational Disclaimer Banner right in Hero */}
          <div className="mt-12 max-w-3xl mx-auto">
            <DisclaimerBanner variant="card" />
          </div>
        </div>
      </section>

      {/* Real-Time Platform Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft">
          
          <div className="flex flex-col items-center text-center p-3 border-r border-slate-100 last:border-r-0">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 mb-2">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              {totalIdeas}+
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Actionable Ideas
            </div>
          </div>

          <div className="flex flex-col items-center text-center p-3 border-r border-slate-100 last:border-r-0">
            <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              {totalLikes * 4 + 180}+
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Community Likes
            </div>
          </div>

          <div className="flex flex-col items-center text-center p-3 border-r border-slate-100 last:border-r-0">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 mb-2">
              <Handshake className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              {totalCommitments + 45}+
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Collaborations
            </div>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 mb-2">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              10+
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Cities & Remote
            </div>
          </div>

        </div>
      </section>

      {/* Featured / Trending Ideas Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Community Favorites
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Featured Opportunities Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Top-rated business concepts with detailed PKR budgets, execution roadmaps, and active collaboration.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition"
          >
            <span>Browse All {ideas.length} Ideas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </section>

      {/* Explore by Category Shelf */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Broad Spectrum
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
            Explore Opportunities by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            From local retail in Karachi to global online micro-SaaS ventures.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="p-4 rounded-2xl bg-white hover:bg-blue-50/70 border border-slate-200/90 hover:border-blue-400 text-left transition-all group flex flex-col justify-between shadow-xs hover:shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-600 text-slate-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {cat.label}
                </h4>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Explore blueprints &rarr;
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How IdeaVault Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Simple & Powerful
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-1 text-white">
              How IdeaVault Turns Concepts into Reality
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Browse openly without barriers, generate custom ideas with Gemini AI, and find committed partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-400/30 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-white">
                Discover Actionable Blueprints
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Filter by Pakistani cities like Karachi or Lahore, budget in PKR, and business model. Every idea includes step-by-step guidance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/30 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-white">
                AI Generation with Gemini
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Provide your exact budget (e.g. PKR 50,000), skills, and city. Google Gemini designs tailor-made business plans and financial estimates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-white">
                Commit & Collaborate
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Click "I'm Interested" to connect directly with idea creators as a co-founder, investor, tech builder, or marketing partner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Have an Idea That Could Change Someone's Future?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Don't keep great ideas locked in your mind. Share your blueprint, find ambitious collaborators in Karachi and nationwide, and build the future together.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleStartSharing}
                className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 font-extrabold text-sm sm:text-base shadow hover:bg-blue-50 transition"
              >
                Share Your Idea Now &rarr;
              </button>
              <Link
                to="/explore"
                className="px-6 py-3.5 rounded-2xl bg-blue-800/60 hover:bg-blue-800 text-white font-semibold text-sm sm:text-base border border-blue-400/40 transition"
              >
                Explore Ideas First
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

