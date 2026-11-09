import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Edit,
  Save,
  Wallet,
  MapPin,
  CheckCircle2,
  Trash2,
  PlusCircle,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORIES, LOCATIONS } from '../config/constants';
import { updateIdea } from '../store/slices/ideasSlice';
import { firebaseService } from '../services/firebaseService';

export default function EditIdeaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: ideas } = useSelector((state) => state.ideas);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const existingIdea = ideas.find((i) => i.id === id);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [businessType, setBusinessType] = useState('Hybrid');
  const [budget, setBudget] = useState('50000');
  const [location, setLocation] = useState('Karachi');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [monetization, setMonetization] = useState('');
  const [risksAndMitigation, setRisksAndMitigation] = useState('');
  const [steps, setSteps] = useState([]);
  const [resources, setResources] = useState([]);
  const [newResourceInput, setNewResourceInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingIdea) {
      setTitle(existingIdea.title || '');
      setCategory(existingIdea.category || CATEGORIES[1].id);
      setBusinessType(existingIdea.businessType || 'Hybrid');
      setBudget((existingIdea.budget || 50000).toString());
      setLocation(existingIdea.location || 'Karachi');
      setShortDescription(existingIdea.shortDescription || '');
      setFullDescription(existingIdea.fullDescription || '');
      setMonetization(existingIdea.monetization || '');
      setRisksAndMitigation(existingIdea.risksAndMitigation || '');
      setSteps(
        Array.isArray(existingIdea.executionSteps) && existingIdea.executionSteps.length > 0
          ? existingIdea.executionSteps
          : [{ title: 'Execution Step', description: 'Action details' }]
      );
      setResources(Array.isArray(existingIdea.requiredResources) ? existingIdea.requiredResources : []);
    }
  }, [existingIdea]);

  if (!existingIdea) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Idea Not Found</h2>
        <button
          onClick={() => navigate('/my-ideas')}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Back to My Ideas
        </button>
      </div>
    );
  }

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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !shortDescription.trim() || !fullDescription.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setSaving(true);
    const chosenCat = CATEGORIES.find(c => c.id === category) || CATEGORIES[1];
    const budgetNum = Number(budget) || 50000;

    const updatedFields = {
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
      monetization: monetization.trim(),
      risksAndMitigation: risksAndMitigation.trim()
    };

    try {
      await firebaseService.updateIdea(existingIdea.id, updatedFields);
      dispatch(updateIdea({ id: existingIdea.id, ...updatedFields }));
      toast.success('Idea updated successfully! ✨');
      navigate(`/ideas/${existingIdea.id}`);
    } catch (err) {
      toast.error('Failed to update idea.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel & Go Back</span>
          </button>
          <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
            <Edit className="w-6 h-6 text-blue-600" />
            <span>Edit Idea: {existingIdea.title}</span>
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core fields */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Idea Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm bg-white"
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
                Business Type
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm bg-white"
              >
                <option value="Online">Online / Digital</option>
                <option value="Physical">Physical Store / Local</option>
                <option value="Hybrid">Hybrid (Online + Physical)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm bg-white"
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
              Budget in PKR
            </label>
            <div className="relative">
              <Wallet className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Description / Hook *
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Concept Breakdown *
            </label>
            <textarea
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              rows={4}
              className="w-full p-4 rounded-2xl border border-slate-300 text-sm"
              required
            />
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Execution Steps</h3>
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
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Step {idx + 1}</span>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={st.title}
                  onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                  placeholder="Step title"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                />
                <textarea
                  value={st.description}
                  onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                  placeholder="Step details"
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving changes...' : 'Save Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}

