<div align="center">
  <img src="public/main-logo.png" alt="Findely Logo" width="90" height="90" style="border-radius: 20px;" />
  <h1 align="center">Findely — Spatial Startup & High-Signal Job Discovery</h1>
  <p align="center">
    <strong>Explore verified venture-backed startups and open engineering roles on an interactive 3D spatial map.</strong>
  </p>
  <p align="center">
    <a href="https://github.com/Sabishimori/findely/stargazers"><img src="https://img.shields.io/github/stars/Sabishimori/findely?color=A9C632&style=flat-square" alt="Stars" /></a>
    <a href="https://github.com/Sabishimori/findely/network/members"><img src="https://img.shields.io/github/forks/Sabishimori/findely?color=546E50&style=flat-square" alt="Forks" /></a>
    <img src="https://img.shields.io/badge/License-Proprietary%20%7C%20All%20Rights%20Reserved-red.svg?style=flat-square" alt="Proprietary" />
  </p>
</div>

---

## 🌟 What is Findely?

**Findely** is a high-signal discovery platform designed for founders, engineers, and tech talents. Instead of wading through recruiter spam and generic job boards, Findely provides an **interactive 3D spatial globe and map** with real-time verified company intelligence, active open roles, founder socials, and direct ATS application links.

---

## ✨ Key Features

- 🌍 **Interactive 3D / 2.5D GPU Spatial Map**: Powered by MapLibre GL and WebGL with responsive pitch/bearing tilt controls, custom radar markers, and dark/light modes.
- 🪟 **Multi-Window Floating Portals**: Drag, minimize, cascade, and compare up to 5 company profiles side-by-side on top of the live map without losing your place.
- ⚡ **Zero-Latency Event-Driven Job Tracker**: Instant optimistic UI saving (`<1ms`) with real-time cross-window synchronization and full Kanban stage tracking (Saved, Applied, Interviewing, Offered).
- 🚩 **Community Moderation & Reporting**: Integrated flag/report system on every single job card and company dossier with dedicated verification moderation queue.
- 🤖 **AgentReach & Gemini Pro Scraping Engine**: Automated discovery pipeline that crawls founder socials, careers pages, and ATS boards (Greenhouse, Lever, Ashby, Workable).
- 💌 **AI Email Outreach Generator**: Generates customized pitch emails for candidates directly to founders and hiring teams.
- 🌓 **Day & Night Spatial Themes**: Smooth transition between Tactical Dark Mode (`#131E12`) and Crisp Minimalist Light Mode (`#F7F9F2`).

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/) + [Motion](https://motion.dev/) |
| **Mapping Engine** | [MapLibre GL](https://maplibre.org/) + Carto Voyager / Dark Matter Vector Tiles |
| **Database & ORM** | [Drizzle ORM](https://orm.drizzle.team/) + SQLite / Better-SQLite3 |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) (Google OAuth & Guest Mode) |
| **Icons & Assets** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Sabishimori/findely.git
cd findely
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration:
```env
# Google OAuth (Optional for guest mode)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Gemini AI (For scraper pipeline)
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Initialize Database & Seed Startups
```bash
npx drizzle-kit push
npm run db:seed
```

### 5. Run the Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the map!

---

## 🌐 Deploy to Vercel / v0

Findely is 100% configured for instant one-click deployment:

1. Push your code to your GitHub repository: `https://github.com/Sabishimori/findely`
2. Go to [Vercel](https://vercel.com/new) or **v0 Project Import**.
3. Select your repository `Sabishimori/findely`.
4. Add your Environment Variables (`NEXTAUTH_SECRET`, etc.).
5. Click **Deploy**! 🚀

---

## 📄 License & Intellectual Property Notice

**Proprietary Software — All Rights Reserved.**  
Copyright © 2026 Findely / Sabishimori.

Unauthorized copying, cloning, scraping, reproduction, or distribution of this code, design architecture, or assets is strictly prohibited. See the [LICENSE](LICENSE) file for complete terms.
