import React from "react";
import { Link } from "react-router-dom";
import {
  Lightbulb,
  Heart,
  Shield,
  Sparkles,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { APP_CONFIG, CATEGORIES } from "../../config/constants";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-glow">
                <Lightbulb className="w-5 h-5 text-amber-300" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Idea<span className="text-blue-400">Vault</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Pakistan's dedicated platform for discovering, sharing, and
              collaborating on actionable business opportunities, tech projects,
              and local ventures.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
              "{APP_CONFIG.disclaimer}"
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Discover
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/explore" className="hover:text-white transition">
                  Explore All Ideas
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-generator"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <span>Gemini AI Generator</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                    AI
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/share" className="hover:text-white transition">
                  Share an Idea
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  Platform Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Hot Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Popular Niches
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  to="/explore?category=karachi-local"
                  className="hover:text-white transition"
                >
                  Karachi Opportunities
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?category=software-web"
                  className="hover:text-white transition"
                >
                  Software & Web Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?category=food-dining"
                  className="hover:text-white transition"
                >
                  Food & Cloud Kitchens
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?category=agriculture-energy"
                  className="hover:text-white transition"
                >
                  Solar & Agriculture
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?category=online-earning"
                  className="hover:text-white transition"
                >
                  Online Earning & Micro-SaaS
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Built With
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>React.js & Tailwind CSS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Firebase Auth & Firestore</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>Google Gemini 2.5 Flash</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Redux Toolkit State</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            © {new Date().getFullYear()} IdeaVault. {APP_CONFIG.tagline}
          </p>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline-block" />
            <span>by</span>
            <a
              href="https://arsalan-portfolio-pied.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-200 hover:text-blue-400 font-semibold underline decoration-slate-600 hover:decoration-blue-400 transition-colors"
            >
              Arsalan Sher
            </a>
            <span>for creators & entrepreneurs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
