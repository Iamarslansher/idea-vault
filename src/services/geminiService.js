import { APP_CONFIG } from '../config/constants';

/**
 * Intelligent AI Idea Generator for IdeaVault
 * Integrates Google Gemini API with smart resilient fallback
 */
export async function generateAIIdea({
  budgetPKR,
  city = 'Karachi',
  businessType = 'Hybrid',
  skills = 'Marketing, Web Development',
  customPrompt = '',
  apiKey = ''
}) {
  const activeKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (activeKey && activeKey.trim().length > 10) {
    try {
      return await callGeminiAPI({
        apiKey: activeKey.trim(),
        budgetPKR,
        city,
        businessType,
        skills,
        customPrompt
      });
    } catch (err) {
      console.warn('Gemini live API call failed, switching to local intelligent blueprint engine:', err);
    }
  }

  // Resilient fallback engine tailored to Pakistani economic context
  return generateLocalSmartBlueprint({ budgetPKR, city, businessType, skills, customPrompt });
}

async function callGeminiAPI({ apiKey, budgetPKR, city, businessType, skills, customPrompt }) {
  const systemPrompt = `You are an elite Pakistani startup incubator director, business strategist, and economist at IdeaVault.
Your mission is to generate an innovative, highly viable, practical business or project idea tailored to the Pakistani market.
Location: ${city}
Available Budget: PKR ${budgetPKR}
Business Model Preference: ${businessType}
User Skills & Background: ${skills}
Additional Notes: ${customPrompt || 'None'}

Return ONLY valid JSON matching this exact structure without markdown code fences or backticks:
{
  "title": "Clear, professional, compelling title",
  "category": "business | online-earning | karachi-local | software-web | food-dining | agriculture-energy | ecommerce | freelancing | education",
  "categoryLabel": "Human readable category",
  "businessType": "${businessType}",
  "budget": ${Number(budgetPKR) || 100000},
  "location": "${city}",
  "shortDescription": "2-3 sentences punchy summary of the opportunity and target audience.",
  "fullDescription": "In-depth 3 paragraph breakdown explaining market problem in ${city}, value proposition, and competitive advantage.",
  "executionSteps": [
    {"step": 1, "title": "Validation & Setup", "description": "Specific actions in ${city}"},
    {"step": 2, "title": "Resource Procurement", "description": "What to buy and where locally"},
    {"step": 3, "title": "Customer Acquisition", "description": "Marketing channel strategy"},
    {"step": 4, "title": "Delivery & Operations", "description": "How the service/product is fulfilled"},
    {"step": 5, "title": "Scaling & Unit Economics", "description": "How to scale profits"}
  ],
  "requiredResources": [
    "Resource 1 with local context",
    "Resource 2",
    "Resource 3",
    "Resource 4"
  ],
  "budgetBreakdown": [
    {"item": "Core Inventory / Equipment", "amount": ${Math.round((Number(budgetPKR) || 100000) * 0.45)}, "percentage": 45},
    {"item": "Marketing & Customer Acquisition", "amount": ${Math.round((Number(budgetPKR) || 100000) * 0.25)}, "percentage": 25},
    {"item": "Software / Digital Tools / Packaging", "amount": ${Math.round((Number(budgetPKR) || 100000) * 0.15)}, "percentage": 15},
    {"item": "Emergency Operating Reserve", "amount": ${Math.round((Number(budgetPKR) || 100000) * 0.15)}, "percentage": 15}
  ],
  "monetization": "Detailed breakdown of pricing, margins, and projected timeline to break even in PKR.",
  "risksAndMitigation": "Realistic challenges in ${city} (e.g. power outages, logistics, cash flow) and practical solutions."
}`;

  // Call Gemini REST API directly using gemini-2.5-flash or gemini-1.5-flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textOutput) {
    throw new Error('Empty response from Gemini');
  }

  // Clean JSON response
  let cleaned = textOutput.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }

  return JSON.parse(cleaned);
}

/**
 * Smart localized generator with realistic Pakistani opportunities
 */
function generateLocalSmartBlueprint({ budgetPKR, city, businessType, skills, customPrompt }) {
  const budget = Number(budgetPKR) || 75000;
  const isDigital = businessType === 'Online';
  const isFood = skills.toLowerCase().includes('cook') || skills.toLowerCase().includes('food');
  const isTech = skills.toLowerCase().includes('react') || skills.toLowerCase().includes('code') || skills.toLowerCase().includes('dev') || skills.toLowerCase().includes('software');

  // Curated templates dynamically adapted to inputs
  if (isTech || (isDigital && budget < 60000)) {
    return {
      title: `B2B Micro-SaaS WhatsApp Automation for ${city} Wholesale Traders`,
      category: 'software-web',
      categoryLabel: 'Software & Web',
      businessType: 'Online',
      budget: budget,
      location: city === 'All Locations' ? 'Online / Remote' : city,
      shortDescription: `Customized WhatsApp Business API & automated inventory catalog bots specifically built for wholesale distributors in ${city}.`,
      fullDescription: `Wholesale merchants in commercial trade centers like Bolton Market, Jodia Bazaar, or Hafeez Centre receive hundreds of unstructured WhatsApp voice notes and text inquiries daily asking for daily rates and stock availability. Manually typing stock counts leads to missed orders and inventory mismatch.\n\nBy leveraging your skills in ${skills}, you can deploy a lightweight automated inventory catalog bot using webhooks and Google Sheets/Supabase backend, allowing buyers to type product codes and receive instant PDF invoices and payment QR codes.`,
      executionSteps: [
        { step: 1, title: 'Local Merchant Interviews', description: `Visit 5-10 active trading shops in ${city} to document their most frequent 5 order inquiries.` },
        { step: 2, title: 'Prototype Bot Build', description: `Build a React dashboard and Meta Cloud API webhook connecting to a live Google Sheet inventory.` },
        { step: 3, title: 'Free 14-Day Pilot', description: `Install the bot for 3 influential shop owners; automate their morning price-list broadcast to 500+ regular buyers.` },
        { step: 4, title: 'Monthly Retainer Rollout', description: 'Offer the system at PKR 8,000 to PKR 15,000 per month including daily server maintenance.' }
      ],
      requiredResources: [
        'Vite React Web Dashboard & Cloud hosting',
        'Meta WhatsApp Cloud API developer credentials',
        'Direct visits to wholesale markets in ' + city,
        'Pre-made invoice PDF generator template'
      ],
      budgetBreakdown: [
        { item: 'Server hosting & domain (1 year)', amount: Math.round(budget * 0.25), percentage: 25 },
        { item: 'Meta WhatsApp API message verification fund', amount: Math.round(budget * 0.35), percentage: 35 },
        { item: 'Direct sales flyers & on-site trader onboarding', amount: Math.round(budget * 0.25), percentage: 25 },
        { item: 'Contingency emergency reserve', amount: Math.round(budget * 0.15), percentage: 15 }
      ],
      monetization: `Recurring B2B software retainer: PKR 10,000/month per merchant. Onboarding 10 traders generates PKR 100,000 monthly recurring revenue (MRR) with negligible cloud costs.`,
      risksAndMitigation: `Trader resistance to new technology is mitigated by keeping the customer interface 100% inside their existing WhatsApp chat without forcing them to download any new app.`
    };
  }

  if (isFood || (!isDigital && budget >= 100000)) {
    return {
      title: `Specialized Artisanal Breakfast & Chai Hub in ${city}`,
      category: 'food-dining',
      categoryLabel: 'Food & Culinary',
      businessType: businessType === 'Online' ? 'Hybrid' : businessType,
      budget: budget,
      location: city === 'All Locations' ? 'Karachi' : city,
      shortDescription: `Early morning high-grade Halwa Puri, artisanal Karak Chai, and stuffed Khasta Kachoris served in premium takeaway packaging for office commuters in ${city}.`,
      fullDescription: `Morning commuters and corporate professionals in commercial districts across ${city} crave authentic, crispy, hygienic traditional breakfasts. Traditional street vendors often suffer from unhygienic open-air setups and soggy newspaper wrapping.\n\nWith a focus on clean oil, vacuum-insulated takeaway containers, and corporate pre-ordering via WhatsApp, you can capture morning office crowd demand between 7:30 AM and 11:30 AM before daily traffic peaks.`,
      executionSteps: [
        { step: 1, title: 'Location Scouting', description: `Find a small commercial stall or kiosk near corporate offices, banks, or hospital clusters in ${city}.` },
        { step: 2, title: 'Hygienic Prep & Packaging', description: 'Procure greaseproof branded boxes, leakproof gravy containers for Chana Tarkari, and insulated cups for tea.' },
        { step: 3, title: 'Corporate Breakfast Combos', description: 'Introduce "Office Team Platters" for 5-10 people delivered on fixed schedules.' },
        { step: 4, title: 'Digital Presence & Word of Mouth', description: 'Distribute breakfast tasting boxes to office branch managers nearby.' }
      ],
      requiredResources: [
        'Commercial deep fryer and heavy-gauge tea samovar',
        'Food-grade stainless steel prep table',
        'Custom thermal food-grade packaging',
        'WhatsApp Business automated order taker'
      ],
      budgetBreakdown: [
        { item: 'Cooking equipment & stainless steel tawa/stove', amount: Math.round(budget * 0.40), percentage: 40 },
        { item: 'Advance deposit & 1st month stall rental', amount: Math.round(budget * 0.30), percentage: 30 },
        { item: 'Bulk food packaging & printed stickers', amount: Math.round(budget * 0.18), percentage: 18 },
        { item: 'First week raw ingredients & oil', amount: Math.round(budget * 0.12), percentage: 12 }
      ],
      monetization: `Average order PKR 450 - PKR 850 per person with 50% gross food margin. Target 60 orders daily generating PKR 750,000 monthly gross revenue.`,
      risksAndMitigation: `Weather and humidity ruining puri crispness are solved by using moisture-vented cardboard containers instead of standard polyethylene bags.`
    };
  }

  // Default versatile opportunity
  return {
    title: `Local E-Commerce Brand for Niche Herbal & Organic Skincare in ${city}`,
    category: 'ecommerce',
    categoryLabel: 'E-Commerce & Trade',
    businessType: businessType,
    budget: budget,
    location: city === 'All Locations' ? 'Nationwide (Pakistan)' : city,
    shortDescription: `100% pure cold-pressed oils, rose water mists, and authentic herbal hair serums sourced from local Pakistani growers and sold via social commerce.`,
    fullDescription: `Pakistani consumers are shifting away from harsh chemical-laden cosmetics toward authentic, pure, lab-tested herbal alternatives like rosemary hair oil, neem acne mists, and saffron facial oils. International imported brands are excessively expensive due to import duties and dollar exchange rates.\n\nBy leveraging your capabilities in ${skills}, you can source high-purity cold-pressed base oils directly from verified tanners and growers in Punjab/Sindh, bottle them into elegant amber dropper vials, and build an authentic brand identity focusing on ingredient transparency.`,
    executionSteps: [
      { step: 1, title: 'Raw Material Sourcing', description: 'Direct sourcing of bulk pure carrier oils and steam-distilled hydrosols from registered Pakistani suppliers.' },
      { step: 2, title: 'Amber Glass Packaging & Labelling', description: 'Procure 30ml/50ml amber glass dropper bottles with leakproof tamper seals from local packaging distributors.' },
      { step: 3, title: 'Short-Form Video Marketing', description: 'Create authentic educational TikToks and Instagram reels testing purity and demonstrating hair & skin routines.' },
      { step: 4, title: 'Cash-on-Delivery (COD) Courier Integration', description: 'Integrate Trax, Call Courier, or Leopard Courier with automated SMS confirmation to minimize return rates.' }
    ],
    requiredResources: [
      'Amber dropper glass bottles and UV-resistant labels',
      'Certified pure carrier and essential oils',
      'Shopify / custom React storefront',
      'COD courier corporate merchant accounts'
    ],
    budgetBreakdown: [
      { item: 'Raw ingredients & carrier oils inventory', amount: Math.round(budget * 0.40), percentage: 40 },
      { item: 'Glass bottles, dropper caps & custom packaging', amount: Math.round(budget * 0.25), percentage: 25 },
      { item: 'Social media video ads & creator gifting', amount: Math.round(budget * 0.22), percentage: 22 },
      { item: 'Courier cash-on-delivery deposit & reserves', amount: Math.round(budget * 0.13), percentage: 13 }
    ],
    monetization: `High margin product: Serum produced for PKR 480 sells for PKR 1,650. Selling 10 units daily generates PKR 495,000 monthly turnover with ~60% net margins.`,
    risksAndMitigation: `COD refusal rate (RTO) is minimized by requiring automated WhatsApp voice/SMS confirmation before courier dispatch.`
  };
}

