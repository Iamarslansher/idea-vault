import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusCircle,
  Sparkles,
  Wallet,
  MapPin,
  Briefcase,
  Layers,
  CheckCircle2,
  Trash2,
  Coins,
  Shield,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { CATEGORIES, LOCATIONS, BUSINESS_TYPES } from '../config/constants';
import { addIdea } from '../store/slices/ideasSlice';
import { openAuthModal } from '../store/slices/uiSlice';
import { firebaseService } from '../services/firebaseService';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

export default function ShareIdeaPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1].id);
  const [businessType, setBusinessType] = useState('Hybrid');
  const [budget, setBudget] = useState('75000');
  const [location, setLocation] = useState('Karachi');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [monetization, setMonetization] = useState('');
  const [risksAndMitigation, setRisksAndMitigation] = useState('');

  // Dynamic execution steps
  const [steps, setSteps] = useState([
    { title: 'Validation & Market Test', description: 'Run initial surveys or social media tests to measure local demand.' },
    { title: 'Resource & Material Procurement', description: 'Procure key equipment and supplies at wholesale rates.' },
    { title: 'Launch & Customer Acquisition', description: 'Open orders via direct WhatsApp marketing or local delivery.' }
  ]);

  // Dynamic resources
  const [resources, setResources] = useState([
    'Primary working equipment',
    'Packaging or digital setup',
    'Social media & marketing budget'
  ]);
  const [newResourceInput, setNewResourceInput] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const handleStepChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([...steps, { title: '', description: '' }]);
  };

  const removeStep = (index) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const addResource = () => {
    if (!newResourceInput.trim()) return;
    setResources([...resources, newResourceInput.trim()]);
    setNewResourceInput('');
  };

  const removeResource = (index) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      dispatch(openAuthModal({ intent: 'Please sign in or create an account to publish your idea on IdeaVault.' }));
      return;
    }

    if (!title.trim() || !shortDescription.trim() || !fullDescription.trim()) {
      toast.error('Please complete all required fields (title, summary, and description).');
      return;
    }

    setSubmitting(true);
    const chosenCat = CATEGORIES.find(c => c.id === category) || CATEGORIES[1];
    const budgetNum = Number(budget) || 50000;

    const newIdeaPayload = {
      title: title.trim(),
      category,
      categoryLabel: chosenCat.label,
      businessType,
      budget: budgetNum,
      location,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      executionSteps: steps.map((s, idx) => ({ step: idx + 1, ...s })),
      requiredResources: resources,
      budgetBreakdown: [
        { item: 'Core Inventory & Equipment', amount: Math.round(budgetNum * 0.45), percentage: 45 },
        { item: 'Customer Acquisition & Marketing', amount: Math.round(budgetNum * 0.25), percentage: 25 },
        { item: 'Digital Tools & Packaging', amount: Math.round(budgetNum * 0.15), percentage: 15 },
        { item: 'Emergency Buffer / Working Capital', amount: Math.round(budgetNum * 0.15), percentage: 15 }
      ],
      monetization: monetization.trim() || 'Direct sales margin / recurring retainer.',
      risksAndMitigation: risksAndMitigation.trim() || 'Mitigate risks by starting lean with an MVP test.'
    };

    try {
      const created = await firebaseService.createIdea(newIdeaPayload, user);
      dispatch(addIdea(created));

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast.success('Your idea was published to IdeaVault! 🎉');
      navigate(`/ideas/${created.id}`);
    } catch (err) {
      toast.error('Failed to publish idea.');
    } finally {
      setSubmitting(false);
    }
  };

  const budgetPresets = [25000, 50000, 100000, 200000, 500000, 1000000];

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
            <PlusCircle className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Creator Studio
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
          Share a Business or Project Idea
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Publish your venture blueprint for the Pakistani community. Outline the capital needed in PKR, execution steps, and find collaborators.
        </p>
      </div>

      <DisclaimerBanner variant="compact" />

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Details Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>1. Core Idea Concept</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Idea Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. On-Demand Solar Panel Deionized Cleaning Service"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs sm:text-sm bg-white"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Business Type *
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs sm:text-sm bg-white"
              >
                <option value="Online">Online / Digital</option>
                <option value="Physical">Physical Store / Local</option>
                <option value="Hybrid">Hybrid (Online + Physical)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Location / City *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs sm:text-sm bg-white"
              >
                {LOCATIONS.filter(l => l !== 'All Locations').map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget in PKR */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Required Budget (PKR) *
              </label>
              <span className="text-xs font-bold text-blue-600">
                PKR {Number(budget || 0).toLocaleString('en-PK')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Wallet className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 85000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 mr-1">Presets:</span>
              {budgetPresets.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b.toString())}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                    budget === b.toString()
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  PKR {b >= 100000 ? `${b / 100000} Lakh` : `${b / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Description / Elevator Pitch *
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="A 2-3 sentence teaser summarizing the opportunity and customer value..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Concept & Market Breakdown *
            </label>
            <textarea
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              rows={4}
              placeholder="Explain the problem in the Pakistani market, how your solution works, target customer persona, and why this is viable right now..."
              className="w-full p-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
              required
            />
          </div>
        </div>

        {/* Execution Steps */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>2. Step-by-Step Execution Guide</span>
            </h3>
            <button
              type="button"
              onClick={addStep}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((st, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    Step {idx + 1}
                  </span>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={st.title}
                  onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                  placeholder="Step title (e.g. Sourcing & Equipment)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-white"
                  required
                />

                <textarea
                  value={st.description}
                  onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                  placeholder="Detail what specific action is taken in this step..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Resources, Monetization & Risks */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>3. Economics & Resources</span>
          </h3>

          {/* Resources tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Key Required Resources & Tools
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newResourceInput}
                onChange={(e) => setNewResourceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addResource();
                  }
                }}
                placeholder="Add tool/resource (e.g. 24ft carbon pole, Shopify store)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={addResource}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {resources.map((r, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-200"
                >
                  <span>{r}</span>
                  <button
                    type="button"
                    onClick={() => removeResource(i)}
                    className="hover:text-red-500 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Monetization & Profit Model
              </label>
              <textarea
                value={monetization}
                onChange={(e) => setMonetization(e.target.value)}
                rows={3}
                placeholder="How does this make money? (e.g. PKR 4,500/month subscription, 55% food gross margin)..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Key Risks & Practical Mitigation
              </label>
              <textarea
                value={risksAndMitigation}
                onChange={(e) => setRisksAndMitigation(e.target.value)}
                rows={3}
                placeholder="Potential hurdles in Pakistan (e.g. loadshedding, cash flow, logistics) and how to handle them..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/25 hover:shadow-xl transition disabled:opacity-50"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{submitting ? 'Publishing Idea...' : 'Publish Idea to IdeaVault'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}

