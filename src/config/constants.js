export const APP_CONFIG = {
  name: 'IdeaVault',
  tagline: 'Ideas Today. Opportunities Tomorrow.',
  disclaimer: 'This platform provides ideas and opportunities, but actual execution and success depend on your personal effort and hard work. InshaAllah, Rizq comes from Allah.',
  version: '2.0.0',
};

export const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: 'Sparkles' },
  { id: 'business', label: 'Business & Retail', icon: 'Store' },
  { id: 'online-earning', label: 'Online Earning', icon: 'Laptop' },
  { id: 'karachi-local', label: 'Karachi Opportunities', icon: 'MapPin' },
  { id: 'software-web', label: 'Software & Web', icon: 'Code' },
  { id: 'food-dining', label: 'Food & Culinary', icon: 'Utensils' },
  { id: 'agriculture-energy', label: 'Agriculture & Solar', icon: 'Sun' },
  { id: 'ecommerce', label: 'E-Commerce & Trade', icon: 'ShoppingBag' },
  { id: 'freelancing', label: 'Services & Freelance', icon: 'Briefcase' },
  { id: 'education', label: 'EdTech & Tuition', icon: 'GraduationCap' },
];

export const LOCATIONS = [
  'All Locations',
  'Karachi',
  'Lahore',
  'Islamabad / Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Hyderabad',
  'Online / Remote',
  'Nationwide (Pakistan)',
];

export const BUSINESS_TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'Online', label: 'Online / Digital', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Physical', label: 'Physical Store / On-ground', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Hybrid', label: 'Hybrid (Online + Physical)', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
];

export const BUDGET_TIERS = [
  { id: 'all', label: 'Any Budget', min: 0, max: Infinity },
  { id: 'under-50k', label: 'Under PKR 50k', min: 0, max: 50000 },
  { id: '50k-200k', label: 'PKR 50k - 200k', min: 50000, max: 200000 },
  { id: '200k-500k', label: 'PKR 200k - 500k', min: 200000, max: 500000 },
  { id: '500k-1m', label: 'PKR 500k - 1M', min: 500000, max: 1000000 },
  { id: 'over-1m', label: 'PKR 1M+', min: 1000000, max: Infinity },
];

export const COMMITMENT_ROLES = [
  { id: 'partner', label: 'Co-founder / Business Partner', description: 'Interested in partnering and building together' },
  { id: 'investor', label: 'Seed Investor / Angel Funder', description: 'Can fund or provide capital/resources' },
  { id: 'tech', label: 'Developer / Tech Contributor', description: 'Provide software, web, or technical expertise' },
  { id: 'marketing', label: 'Marketing & Sales Specialist', description: 'Drive customer acquisition and distribution' },
  { id: 'supplier', label: 'Supplier / Vendor', description: 'Provide raw materials, wholesale, or fulfillment' },
  { id: 'learner', label: 'Apprentice / Explorer', description: 'Looking to learn, execute, or collaborate closely' },
];

