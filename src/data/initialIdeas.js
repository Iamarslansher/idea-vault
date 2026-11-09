export const INITIAL_IDEAS = [
  {
    id: 'idea-1',
    title: 'Solar Panel Micro-Cleaning & Efficiency Audit Service',
    category: 'agriculture-energy',
    categoryLabel: 'Agriculture & Solar',
    businessType: 'Physical',
    budget: 85000,
    location: 'Karachi',
    shortDescription: 'Residential & commercial solar panel deep cleaning using deionized water sprayers and efficiency thermal checkup across DHA, Clifton, and Gulshan.',
    fullDescription: 'With Karachi experiencing significant dust and pollution, rooftop solar panels lose between 15% to 30% of their power generation capacity within just 3 weeks without specialized cleaning. Normal tap water leaves heavy calcium deposits (scaling) that damage photovoltaic glass permanently.\n\nThis business provides subscription-based, bi-weekly specialized solar cleaning using portable water purification units and non-scratch telescopic microfiber brushes. In addition, basic thermal sensor checks can detect micro-cracks and hot spots before inverter failures occur.',
    executionSteps: [
      { step: 1, title: 'Equipment Sourcing', description: 'Procure 24-ft telescopic carbon-fiber water-fed poles, specialized soft solar brushes, and 12V portable pressure pump from Bolton Market / Saddar, Karachi.' },
      { step: 2, title: 'Deionized Water Setup', description: 'Acquire twin-tank portable deionization resin filters to ensure zero total dissolved solids (TDS < 10) so panels dry spot-free without water stains.' },
      { step: 3, title: 'Targeted Local Outreach', description: 'Flyer distribution and society WhatsApp group promotions across solar-dense residential zones (DHA Phase 5, 6, 8, Clifton, and Gulshan-e-Iqbal).' },
      { step: 4, title: 'Subscription Model Launch', description: 'Offer bi-monthly maintenance packages at PKR 4,500/month for 10-15kW home systems and PKR 15,000/month for commercial rooftops.' },
      { step: 5, title: 'Referral & Proof of Value', description: 'Provide inverter generation screenshot before and after cleaning to visually prove the 20%+ wattage boost to clients.' }
    ],
    requiredResources: [
      '24ft Telescopic carbon fiber poles with integrated hose',
      'Portable deionized water filter tanks',
      'Safety harness, non-slip rooftop footwear, and helmets',
      'Motorcycle carrier rack for easy Karachi traffic transit',
      'Infrared thermometer gun for hotspot detection'
    ],
    budgetBreakdown: [
      { item: 'Telescopic poles & imported solar brushes', amount: 35000, percentage: 41 },
      { item: 'Portable water purification / resin tank', amount: 22000, percentage: 26 },
      { item: 'Safety equipment & harnesses', amount: 12000, percentage: 14 },
      { item: 'Marketing, flyers & society permits', amount: 10000, percentage: 12 },
      { item: 'Working capital & fuel reserve', amount: 6000, percentage: 7 }
    ],
    monetization: 'Recurring monthly subscriptions (PKR 3,500 - 8,000 per villa) plus one-off deep descaling services for commercial factories (PKR 25,000 - 50,000 per setup).',
    risksAndMitigation: 'Rooftop safety risk is mitigated through mandatory dual-anchor safety harnesses. Water scarcity in Karachi is solved by bringing dedicated 40L pure water drums on a bike-trailer.',
    creatorId: 'user-tariq-101',
    creatorName: 'Engr. Tariq Mahmood',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creatorRole: 'Renewable Energy Consultant',
    createdAt: Date.now() - 1000 * 60 * 60 * 28, // 28 hours ago
    likesCount: 42,
    likedBy: ['user-demo-1', 'user-2', 'user-5'],
    viewsCount: 389,
    commitmentsCount: 8,
    bookmarksCount: 19,
    commentsCount: 3,
    comments: [
      {
        id: 'c-1',
        userId: 'user-ali-88',
        userName: 'Ali Raza',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: 'MashaAllah great idea! In DHA Karachi dust builds up within 10 days. I have an 18kW system and would definitely hire this service.',
        createdAt: Date.now() - 1000 * 60 * 60 * 20
      },
      {
        id: 'c-2',
        userId: 'user-bilal-44',
        userName: 'Bilal Khan',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        content: 'I have experience in safety harness gear and logistics in Karachi. Would love to partner on scaling this across Clifton.',
        createdAt: Date.now() - 1000 * 60 * 60 * 12
      }
    ],
    commitments: [
      {
        id: 'comm-1',
        userId: 'user-bilal-44',
        userName: 'Bilal Khan',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        role: 'partner',
        roleLabel: 'Co-founder / Business Partner',
        message: 'Interested in partnering to handle operational logistics and customer acquisition in DHA Karachi.',
        createdAt: Date.now() - 1000 * 60 * 60 * 12
      }
    ]
  },
  {
    id: 'idea-2',
    title: 'Karachi Street-Bites Cloud Kitchen & Late Night Chai Delivery',
    category: 'food-dining',
    categoryLabel: 'Food & Culinary',
    businessType: 'Hybrid',
    budget: 180000,
    location: 'Karachi',
    shortDescription: 'Late-night specialized authentic Bun Kabab, Matka Chai, and Paratha Rolls cloud delivery operating from 10 PM to 4 AM via WhatsApp and Foodpanda.',
    fullDescription: 'Karachi never sleeps, but after 11 PM, high-quality, hygienic local street food options delivered hot with premium tamper-evident packaging are surprisingly scarce. Most local dhabas lack packaging that keeps parathas crisp and chai steaming hot during transit.\n\nBy renting a low-cost residential kitchen annex near Gulshan / Johar or Bahadurabad, you can focus purely on standardized Karachi classics: crispy Hunter Beef & Daal Bun Kababs, Doodh Patti in insulated spill-proof cups, and Nutella Malai Rolls. Operating overheads remain low because there is no dine-in front or expensive high-street commercial rent.',
    executionSteps: [
      { step: 1, title: 'Kitchen Space Acquisition', description: 'Secure a ground-floor kitchen annex or shared commercial commissary in Gulshan-e-Iqbal or PECHS with gas supply.' },
      { step: 2, title: 'Custom Thermal Packaging', description: 'Order custom heat-insulating silver-foil lined boxes for bun kababs and double-walled paper cups with tight silicone lids for chai from Paper Market Karachi.' },
      { step: 3, title: 'Standardized Flavor Profiles', description: 'Develop recipe bible for chutneys (green tangy mint, sweet imli tamarind) ensuring identical taste in every batch.' },
      { step: 4, title: 'Digital Ordering Funnel', description: 'Launch a direct WhatsApp Business catalog with automated location pin capture, plus onboarding on Foodpanda as a cloud brand.' },
      { step: 5, title: 'Late Night Digital Hype', description: 'Run hyper-targeted Instagram and TikTok video campaigns between 10 PM and 2 AM targeting night-owl students, call-center employees, and freelancers.' }
    ],
    requiredResources: [
      'Commercial flat-top grill (Tawa) & 2-burner commercial stove',
      'Deep freezer and mini prep refrigerator',
      'Food-grade vacuum seal and tamper-evident thermal delivery bags',
      '2 dedicated rider tie-ups or Foodpanda delivery fleet',
      'Branded greaseproof paper wrappers and sticker labels'
    ],
    budgetBreakdown: [
      { item: 'Kitchen equipment & flat-top heavy tawa', amount: 55000, percentage: 31 },
      { item: 'First month kitchen rent & advance deposit', amount: 40000, percentage: 22 },
      { item: 'Bulk thermal packaging & branded boxes', amount: 35000, percentage: 19 },
      { item: 'Initial raw ingredients & dairy stockpile', amount: 25000, percentage: 14 },
      { item: 'Digital social media ads & Foodpanda listing fee', amount: 25000, percentage: 14 }
    ],
    monetization: 'High-margin average order value (AOV) of PKR 850 - 1,400 with 55% gross food margin.',
    risksAndMitigation: 'Delivery delays ruining food quality are countered through strict 3km delivery radius limit and double-walled insulated bags.',
    creatorId: 'user-marium-202',
    creatorName: 'Marium Shakeel',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    creatorRole: 'Culinary Entrepreneur',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    likesCount: 67,
    likedBy: ['user-demo-1', 'user-3', 'user-8'],
    viewsCount: 512,
    commitmentsCount: 5,
    bookmarksCount: 34,
    commentsCount: 4,
    comments: [],
    commitments: []
  },
  {
    id: 'idea-3',
    title: 'Urdu AI Voice-to-Text & Transcription SaaS for Doctors & Lawyers',
    category: 'software-web',
    categoryLabel: 'Software & Web',
    businessType: 'Online',
    budget: 45000,
    location: 'Online / Remote',
    shortDescription: 'Specialized Web & Mobile audio recording app that transcribes Roman Urdu and formal Urdu voice notes into structured client consultation reports.',
    fullDescription: 'In Pakistan, thousands of busy medical doctors, legal attorneys, and real estate consultants spend hours every evening typing patient clinical histories or legal case notes. Many prefer speaking into their phone in Roman Urdu or spoken Urdu with English technical terms.\n\nBy leveraging the Gemini Flash API / Whisper fine-tuned on Pakistani colloquial vocabulary, this lightweight SaaS captures audio dictation and immediately outputs properly formatted English/Urdu clinical summaries or legal bullet points ready to copy into hospital EMRs or court files.',
    executionSteps: [
      { step: 1, title: 'MVP Web App Development', description: 'Build React + Tailwind web recorder interface with client-side audio compression (WebM / Opus).' },
      { step: 2, title: 'Gemini Multimodal Speech Integration', description: 'Send audio stream to Gemini API with strict system prompt specifying Urdu/Roman Urdu terminology normalization.' },
      { step: 3, title: 'Field Pilot with 10 Clinics', description: 'Conduct hands-on demos with private medical clinics in Karachi and Lahore; show doctors how 3-minute voice notes become instant prescription notes.' },
      { step: 4, title: 'Pricing & Monetization', description: 'Introduce freemium tier (30 mins free/month) and paid pro plan at PKR 2,500/month or PKR 25,000/year.' }
    ],
    requiredResources: [
      'Next.js / Vite React frontend with PWA audio recording support',
      'Google Gemini API token for low-latency multimodal audio understanding',
      'Vercel / Cloudflare hosting',
      'Stripe / PayFast / JazzCash digital payment gateway integration'
    ],
    budgetBreakdown: [
      { item: 'Domain, SSL & Cloud hosting (12 months)', amount: 15000, percentage: 33 },
      { item: 'Gemini API credits for pilot usage', amount: 12000, percentage: 27 },
      { item: 'Doctor/lawyer direct marketing & demo brochures', amount: 10000, percentage: 22 },
      { item: 'Payment gateway setup & compliance', amount: 8000, percentage: 18 }
    ],
    monetization: 'B2B Software subscription: PKR 2,500/month per practitioner or PKR 8,000/month for hospital departmental licenses.',
    risksAndMitigation: 'Noisy medical ward background audio handled by noise-gate client filters and temperature 0 Gemini audio transcription.',
    creatorId: 'user-hamza-303',
    creatorName: 'Hamza Farooq',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    creatorRole: 'Full Stack AI Engineer',
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    likesCount: 94,
    likedBy: ['user-demo-1', 'user-1', 'user-4', 'user-9'],
    viewsCount: 890,
    commitmentsCount: 14,
    bookmarksCount: 52,
    commentsCount: 6,
    comments: [],
    commitments: []
  },
  {
    id: 'idea-4',
    title: 'Karachi Port Logistics & Customs Clearance Dashboard for SMEs',
    category: 'karachi-local',
    categoryLabel: 'Karachi Opportunities',
    businessType: 'Online',
    budget: 95000,
    location: 'Karachi',
    shortDescription: 'Simplified WhatsApp & Web tracker for small traders at Karachi Port (KPT) and Port Qasim to monitor WeBOC GD statuses and demurrage timers.',
    fullDescription: 'Over 60,000 small and medium importers across Pakistan deal with cargo entering Karachi Port Trust (KPT) and Port Qasim. Traditional clearing agents communicate erratically via disorganized phone calls, leading to costly container demurrage and detention penalties.\n\nThis platform aggregates automated tracking alerts for consignment clearance checkpoints, WeBOC Goods Declaration (GD) milestone tracking, and free-day demurrage countdown timers sent directly to the business owner via WhatsApp Business alerts.',
    executionSteps: [
      { step: 1, title: 'Clearing Agent Partnerships', description: 'Partner with 3 reputable custom clearing agents at I.I. Chundrigar Road and KPT West Wharf to understand exact GD milestone bottlenecks.' },
      { step: 2, title: 'Notification Bot Development', description: 'Build automated WhatsApp notification engine using Meta Cloud API notifying clients at 5 key stages: Gate-in, Examination, Assessment, Payment, and Out-of-Charge.' },
      { step: 3, title: 'Demurrage Countdown Clock', description: 'Build interactive countdown visualizer that sends urgency warning 48 hours before shipping line free-time expires.' },
      { step: 4, title: 'Pilot Rollout', description: 'Onboard 20 textile and electronics importers in Bolton Market, Jodia Bazaar, and Shershah.' }
    ],
    requiredResources: [
      'Meta WhatsApp Business API verified account',
      'Web portal for clearing agents and importers',
      'Cloud database with automated cron jobs',
      'Physical sales visits to clearing agent offices around Tower and Chundrigar Road'
    ],
    budgetBreakdown: [
      { item: 'WhatsApp Business API setup & prepaid credits', amount: 30000, percentage: 32 },
      { item: 'Cloud infrastructure & database setup', amount: 25000, percentage: 26 },
      { item: 'Sales collateral & trader onboarding visits', amount: 20000, percentage: 21 },
      { item: 'Legal terms & SME data security compliance', amount: 20000, percentage: 21 }
    ],
    monetization: 'Charge PKR 1,500 per tracked container GD or PKR 12,000/month unlimited plan for active trading houses.',
    risksAndMitigation: 'Port delays outside user control: System provides timestamped audit logs proving whether delay was at terminal, customs assessment, or payment stage.',
    creatorId: 'user-zain-404',
    creatorName: 'Zain Ul Abideen',
    creatorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    creatorRole: 'Supply Chain Specialist',
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
    likesCount: 38,
    likedBy: ['user-2'],
    viewsCount: 420,
    commitmentsCount: 6,
    bookmarksCount: 22,
    commentsCount: 2,
    comments: [],
    commitments: []
  },
  {
    id: 'idea-5',
    title: 'High-Demand O/A Level & MDCAT Live Micro-Tuition Circles',
    category: 'education',
    categoryLabel: 'EdTech & Tuition',
    businessType: 'Online',
    budget: 35000,
    location: 'Online / Remote',
    shortDescription: 'Cohort-based live interactive problem-solving batches (maximum 6 students) for Physics & Chemistry past paper mastery with top university toppers.',
    fullDescription: 'Parents in Pakistan pay PKR 15,000 - 30,000 per month for standard academy teachers who teach crowded classrooms of 50+ students where individual questions are ignored. On the other end, 1-on-1 private home tutors charge steep rates that many families cannot afford.\n\nMicro-Tuition Circles bring together 4 to 6 students of similar grade levels for 1-hour high-intensity interactive sessions focusing exclusively on Cambridge past-paper topical questions, guided by students currently studying at AKU, IBA, or LUMS.',
    executionSteps: [
      { step: 1, title: 'Tutor Vetting & Standardization', description: 'Interview and recruit 5 top-scoring medical/engineering university students with straight A* backgrounds.' },
      { step: 2, title: 'Curriculum & Past Paper Sprints', description: 'Prepare 8-week topical exam drills with curated worksheets and digital whiteboard setups.' },
      { step: 3, title: 'Parent Webinar & Free Diagnostic Test', description: 'Host a free 45-minute live diagnostic test for Grade 10/11 students showing parents exact weak areas.' },
      { step: 4, title: 'Cohort Launch', description: 'Enroll 4 cohorts of 6 students each at PKR 7,500/month per subject.' }
    ],
    requiredResources: [
      'Drawing tablets / styluses for tutors',
      'Zoom / Google Meet Education Pro accounts',
      'Digital past paper vault and automated quiz portal',
      'Facebook / Instagram parent community outreach'
    ],
    budgetBreakdown: [
      { item: 'Graphic tablets for founding tutors', amount: 16000, percentage: 46 },
      { item: 'Software subscriptions & domain', amount: 8000, percentage: 23 },
      { item: 'Targeted ads to parents in Clifton, DHA & Gulshan', amount: 11000, percentage: 31 }
    ],
    monetization: 'PKR 7,500/student/month per subject. With 4 cohorts of 6 students (24 students), monthly revenue reaches PKR 180,000 with 65% net margin.',
    risksAndMitigation: 'Student retention is kept above 85% by providing weekly recorded summary videos and direct parent WhatsApp performance check-ins.',
    creatorId: 'user-ayesha-505',
    creatorName: 'Dr. Ayesha Siddiqui',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    creatorRole: 'Medical Researcher & Educator',
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
    likesCount: 53,
    likedBy: ['user-demo-1', 'user-4'],
    viewsCount: 610,
    commitmentsCount: 9,
    bookmarksCount: 29,
    commentsCount: 3,
    comments: [],
    commitments: []
  },
  {
    id: 'idea-6',
    title: 'Artisan Pakistani Leather Goods Direct-to-Consumer (D2C) Export',
    category: 'ecommerce',
    categoryLabel: 'E-Commerce & Trade',
    businessType: 'Hybrid',
    budget: 250000,
    location: 'Lahore',
    shortDescription: 'Exporting premium handcrafted full-grain leather laptop sleeves, travel duffels, and minimalist wallets directly from Sialkot/Lahore to GCC and US buyers.',
    fullDescription: 'Pakistan is globally renowned for top-tier leather tanneries in Sialkot, Kasur, and Karachi, producing goods for international luxury labels that mark prices up by 800%. By sourcing directly from generational master craftsmen and curating a minimalist, modern aesthetic with brass hardware, a Pakistani direct-to-consumer brand can sell globally at competitive price points while retaining healthy margins.',
    executionSteps: [
      { step: 1, title: 'Craftsman Sourcing in Sialkot/Lahore', description: 'Partner directly with small family workshops to manufacture pilot samples of 3 core products: 15-inch laptop sleeve, bi-fold wallet, and weekender duffel.' },
      { step: 2, title: 'Studio Photography & Brand Identity', description: 'Capture clean, earthy studio and lifestyle imagery highlighting vegetable-tanned grain texture and hand-stitched edges.' },
      { step: 3, title: 'Shopify Store & International Courier Deals', description: 'Set up Shopify with DHL Express / FedEx SME discounted e-commerce international shipping rates (3-5 day delivery to UAE, UK, US).' },
      { step: 4, title: 'TikTok & Reddit Organic Community Marketing', description: 'Showcase satisfying behind-the-scenes leather cutting, burnishing, and embossing videos to build authentic artisanal credibility.' }
    ],
    requiredResources: [
      'Master artisan workshop contracts',
      'Initial sample inventory (30 wallets, 15 sleeves, 10 duffels)',
      'High-grade packaging: organic cotton dust bags and rigid magnetic gift boxes',
      'Shopify e-commerce store with international multi-currency checkout',
      'DHL / FedEx export corporate account'
    ],
    budgetBreakdown: [
      { item: 'First production run & raw full-grain leather', amount: 120000, percentage: 48 },
      { item: 'Custom luxury packaging & brass debossing dies', amount: 45000, percentage: 18 },
      { item: 'Product photography & brand design', amount: 35000, percentage: 14 },
      { item: 'Shopify setup, domain & paid initial ads', amount: 30000, percentage: 12 },
      { item: 'Courier sample shipments & reserves', amount: 20000, percentage: 8 }
    ],
    monetization: 'High average order value: Laptop sleeve at \$65 (approx. PKR 18,000) costs PKR 4,200 to produce, leaving healthy 70%+ gross margin before shipping.',
    risksAndMitigation: 'International return handling: We provide strict measurement charts and offer instant store credit for sizing exchanges instead of costly return freights.',
    creatorId: 'user-daniyal-606',
    creatorName: 'Daniyal Qureshi',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    creatorRole: 'E-commerce Brand Strategist',
    createdAt: Date.now() - 1000 * 60 * 60 * 140,
    likesCount: 81,
    likedBy: ['user-demo-1', 'user-3', 'user-6'],
    viewsCount: 780,
    commitmentsCount: 11,
    bookmarksCount: 45,
    commentsCount: 5,
    comments: [],
    commitments: []
  }
];

