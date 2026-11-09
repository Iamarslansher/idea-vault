# 💡 IdeaVault — Ideas Today. Opportunities Tomorrow.

A production-ready, responsive idea-sharing and discovery platform built with **React.js, Vite, Tailwind CSS, Redux Toolkit, Firebase Authentication & Firestore, and the Google Gemini API**.

---

## 🌟 Key Features

### 1. Public Discovery & Soft Authentication Wall
- **No Forced Login:** Visitors can freely browse, search, and inspect full idea blueprints without having an account.
- **Contextual Soft Wall:** Authentication is triggered only when an active interaction is attempted (liking, bookmarking, commenting, showing interest/collaborating, sharing an idea, or publishing an AI idea).
- **1-Click Instant Demo Profiles:**
  - **Zainab Qazi** (Tech Founder — Karachi)
  - **Fahad Mehmood** (Angel Investor — Lahore)
  - **Saad Alvi** (Growth Marketer — Islamabad)

### 2. Community Principles & Inspirational Note
Every idea card, detail view, and AI generator view prominently displays the community principle:
> *"This platform provides ideas and opportunities, but actual execution and success depend on your personal effort and hard work. InshaAllah, Rizq comes from Allah."*

### 3. Explore & Advanced Discovery Engine
- **Search & Filter:** By keyword, Pakistani locations (*Karachi, Lahore, Islamabad, Online/Remote, Nationwide*), business models (*Online, Physical, Hybrid*), and categories.
- **Budget in PKR:** Filter by budget tiers (under PKR 50k, 50k - 200k, 200k - 500k, 500k - 1M, 1M+ PKR) or custom amounts.
- **Interactive Idea Cards:** Creator avatar, category badge, budget formatted in PKR, location, view count, and a like button with heart animation that turns red (`#EF4444`) with live counts.
- **Detailed Blueprint Pages:** Step-by-step 4-phase execution guides, required tools & resources, PKR budget allocation breakdowns, monetization strategies, and risk mitigation.

### 4. Full Idea Lifecycle (CRUD)
- **Share an Idea:** Guided submission form with dynamic execution steps, required resources, PKR budget presets, and celebration confetti.
- **Manage My Ideas:** Edit or delete posted ideas with confirmation modals and instant Firestore / local store updates.

### 5. Google Gemini AI Idea Generator
- Input your available budget in PKR (with slider and quick ticks), target Pakistani city, skills, and model preference.
- Generates a custom business opportunity complete with:
  - Concept pitch and Pakistani market viability
  - 4-Phase step-by-step launch roadmap
  - PKR budget allocation breakdown
  - Monetization and risk mitigation
- **1-Click Publish:** Publish the AI-generated blueprint directly to IdeaVault.

### 6. Commitments & Community Collaboration
- Click **"I'm Interested"** on any opportunity to offer partnership as a **Co-founder, Investor, Tech Developer, Marketing Specialist, Supplier, or Apprentice**.
- Instant notifications delivered to the idea creator.
- Track all your active collaboration commitments directly from your dashboard.

### 7. Main Dashboard & Sidebar Navigation
- Responsive collapsible sidebar with active links:
  1. Home / Dashboard (with real-time stats: Total Ideas Shared, Total Likes, Total Views, Total Commitments)
  2. Explore Ideas
  3. AI Idea Generator
  4. Share an Idea
  5. My Ideas (Manage/CRUD)
  6. My Commitments / Interests
  7. Liked Ideas & Bookmarks
  8. Notifications & Profile
  9. Logout

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React.js (JavaScript JSX) + Vite |
| **Styling** | Tailwind CSS with Deep Navy (`#0F172A`) & Primary Blue (`#2563EB`) palette |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) & persistent caching |
| **Backend / Auth / Database** | Firebase Authentication & Cloud Firestore (with persistent offline fallback) |
| **AI Generation** | Google Gemini 2.5 Flash API + localized smart blueprint engine |
| **Icons & Animation** | Lucide React, Framer Motion, Canvas Confetti |
| **Notifications** | React Hot Toast |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration (Optional)
The application works immediately out-of-the-box using local persistent storage and demo accounts. To connect to live Firebase and Gemini services, copy `.env.example` to `.env`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🔒 Firestore Security Rules
Robust security rules are provided in `firestore.rules`:
- Public read access for ideas to allow frictionless exploration.
- User-authenticated create, update, and delete isolation.
- Rate-limited counters for community likes, views, and comments.
