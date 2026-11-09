import React from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  Sparkles,
  Compass,
  Handshake,
  CheckCircle2,
  Heart,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { APP_CONFIG } from '../config/constants';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>About IdeaVault</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-950 tracking-tight">
          Ideas Today. Opportunities Tomorrow.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Pakistan's community-driven idea discovery and collaboration platform designed to turn ambition into viable ventures.
        </p>
      </div>

      {/* Inspirational Core Banner */}
      <DisclaimerBanner variant="card" />

      {/* Our Story / Problem Statement */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-navy-950">
          The Problem We Are Solving
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <p>
            Across Karachi, Lahore, Islamabad, and all of Pakistan, millions of ambitious youth, professionals, and entrepreneurs want to launch something of their own. However, they repeatedly hit three walls:
          </p>
          <ul className="space-y-2.5 pl-2">
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0"></span>
              <span><strong>Unclear Starting Capital:</strong> Generic internet advice quotes dollars or vague figures. People don't know what an idea actually costs in Pakistani Rupees (PKR).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></span>
              <span><strong>Lack of Actionable Execution Steps:</strong> Ideas remain abstract fantasies without 4-phase concrete roadmaps adapted to local Pakistani markets.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></span>
              <span><strong>Isolated Builders:</strong> Solitary founders struggle to find trusted technical partners, marketers, suppliers, or angel backers.</span>
            </li>
          </ul>
          <p>
            IdeaVault was built to dismantle these barriers. We provide transparent, community-shared business blueprints and pair them with Google Gemini AI intelligence to formulate practical plans for any budget.
          </p>
        </div>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Zero-Barrier Discovery</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Browse freely without forced logins. Evaluate blueprints, compare PKR budgets, and discover verified local opportunities.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Gemini AI Customization</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Tailor opportunities to your exact financial constraints, technical skills, and target city with modern Google Gemini intelligence.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Handshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Community Commitments</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Click "I'm Interested" to connect directly with idea creators as co-founders, investors, developers, or suppliers.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center py-6">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/20 transition"
        >
          <span>Explore All Ideas Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

