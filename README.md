<div align="center">
  <img src="public/main-logo.png" alt="Findely Logo" width="90" height="90" style="border-radius: 20px;" />
  <h1 align="center">Findely — Spatial Startup & High-Signal Job Discovery</h1>
  <p align="center">
    <strong>Explore verified frontier startups, global office networks, and live open roles on an interactive 3D spatial globe and map.</strong>
  </p>
  <p align="center">
    <a href="https://github.com/Sabishimori/findely/stargazers"><img src="https://img.shields.io/github/stars/Sabishimori/findely?color=A9C632&style=flat-square" alt="Stars" /></a>
    <a href="https://github.com/Sabishimori/findely/network/members"><img src="https://img.shields.io/github/forks/Sabishimori/findely?color=546E50&style=flat-square" alt="Forks" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-A9C632.svg?style=flat-square" alt="MIT License" /></a>
    <a href="https://github.com/Sabishimori/findely/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" /></a>
  </p>
</div>

---

## 🌟 What is Findely?

**Findely** is a high-signal discovery platform designed for founders, engineers, and tech talents. Instead of wading through recruiter spam, outdated aggregators, and generic homepage bounces, Findely provides an **interactive 3D spatial globe and 2D map** with real-time verified company intelligence, global office networks, founder socials, and direct ATS application links with zero intermediate redirects.

---

## ✨ Key Features

- 🌍 **Interactive 3D / 2.5D GPU Spatial Globe & Map**: Powered by Three.js WebGL and MapLibre/Mapbox GL with custom radar markers, branch clustering, and dark/light spatial modes.
- ⚡ **Zero-LLM Deterministic ATS Engine**: Direct REST/JSON fetchers for **Greenhouse, Lever, Ashby, and Workday CXS** with uncapped pagination, fetching 100% of live open positions.
- 🏢 **Multi-Office Spatial Decomposition**: Automatically decomposes multi-location job listings into distinct office rows with exact coordinates per physical branch.
- 📍 **Step 0 Geocoding Engine**: High-precision geocoding with broad-region and remote-location detection (`null` coordinates for remote/worldwide roles, preventing false San Francisco fallbacks).
- 🚀 **Dual Ingestion (Track A & Track B)**: 
  - **Track A**: Automated, high-speed ATS board extraction.
  - **Track B**: Founder self-submission gated by 6-digit email OTP verification and pre-submission link validation.
- 🛡️ **Automated Continuous Link Validator**: Background health check engine that validates HTTP status codes and title matching on every stored apply link.
- 🪟 **Multi-Window Floating Portals**: Drag, minimize, cascade, and compare up to 5 company profiles side-by-side on top of the live map without losing your place.
- ⚡ **Zero-Latency Job Tracker**: Instant optimistic UI saving (`<1ms`) with real-time cross-window synchronization and full Kanban stage tracking.
- 💌 **AI Email Outreach Generator**: Generates customized pitch emails for candidates directly to founders and hiring teams.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 16 (App Router, Turbopack)](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/) + [Motion v13](https://motion.dev/) |
| **3D & Mapping** | [Three.js](https://threejs.org/) + [MapLibre GL](https://maplibre.org/) / [Mapbox GL](https://www.mapbox.com/) |
| **Database & ORM** | [Turso (LibSQL)](https://turso.tech/) + [SQLite](https://sqlite.org/) + [Drizzle ORM](https://orm.drizzle.team/) |
| **Auth & Security** | [NextAuth.js](https://next-auth.js.org/) + Nodemailer Email OTP Gating |
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
Create `.env.local` in the root directory:
```env
# Database (Turso Cloud DB)
TURSO_DATABASE_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"

# Authentication & NextAuth
NEXTAUTH_SECRET="your-random-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional Email SMTP (for Track B Founder OTPs)
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_FROM="Findely <noreply@findely.dev>"
```

### 4. Migrate Database Schema & Sync Live ATS Jobs
```bash
# Run schema migrations
npm run db:migrate:production

# Ingest all live ATS roles into database (Greenhouse, Lever, Ashby, Workday)
npm run scrape:live
```

### 5. Run the Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the map and live company intelligence!

---

## 🧪 Testing & Verification

Run the dedicated test suites to verify each ATS integration and data pipeline:

```bash
# Full TypeScript Type Check
npx tsc --noEmit

# Greenhouse Pipeline Verification (Scale AI, Postman, Figma)
npx tsx scripts/test_greenhouse_pipeline.ts

# Lever Pipeline Verification (Spotify, Rover, Wealthfront)
npx tsx scripts/test_lever_pipeline.ts

# Ashby Pipeline Verification (Linear, Supabase, DeepL)
npx tsx scripts/test_ashby_pipeline.ts

# Workday Pipeline Verification (Autodesk, Adobe, NVIDIA)
npx tsx scripts/test_workday_pipeline.ts

# Track B Founder OTP & Geocoding Verification
npx tsx scripts/test_track_b_pipeline.ts

# Database-Wide Parity Check (Office Networks vs. DB Roles)
npx tsx scripts/verify_database_wide_job_counts.ts
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
