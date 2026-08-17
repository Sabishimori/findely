# FINDELY — MASTER PROJECT CONTEXT & ENGINE LOG
> **AI AGENT CONTEXT DIRECTIVE**: This single document is the complete, definitive technical reference for the Findely codebase. Any AI model (ChatGPT, Claude, Gemini, Cursor, etc.) reading this file can instantly understand the complete architecture, every bug diagnosed and solved, the database schema, file maps, and operating guidelines without needing to parse the entire codebase line-by-line.

---

## 1. Executive Summary & Product Architecture

**Findely** is a high-performance, spatial startup discovery and job-hunting engine. It provides an interactive 2D Map (Mapbox GL) and 3D Globe (Three.js) interface allowing candidates and founders to discover tech companies, explore office locations globally, and apply directly to open roles without recruiter spam or homepage redirects.

### Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack, Server Actions)
- **UI & State**: React 19, Tailwind CSS v4, Motion (Framer Motion v13), Lucide React
- **Spatial / Visual**: Mapbox GL v3, MapLibre GL v6, Three.js 3D Interactive Globe
- **Database & ORM**: LibSQL / Turso Database, SQLite (Local Development), Drizzle ORM
- **Backend / Scraper**: Zero-LLM Deterministic ATS Fetchers (Greenhouse, Lever, Ashby, Workday CXS) + Unified URL Validator
- **Security / Auth**: Nodemailer 6-digit Email OTP Verification, XSS Sanitization, Disposable Email Blocker

---

## 2. Ingestion Pipeline Architecture (Track A & Track B)

Findely operates on two distinct ingestion tracks that feed into one unified database schema:

```mermaid
graph TD
    subgraph "Track A: Direct ATS Engine (Zero-LLM)"
        GH[Greenhouse API] -->|GET /v1/boards/{b}/jobs| ATS[atsEngine.ts]
        LEV[Lever API] -->|GET /v0/postings/{b}?mode=json| ATS
        ASH[Ashby API] -->|POST /api/posting-api/job-board/{b}| ATS
        WD[Workday CXS] -->|POST /wday/cxs/{path}/jobs| ATS
        ATS --> GEO[geocoder.ts]
        ATS --> VAL[validator.ts]
    end

    subgraph "Track B: Founder Self-Submission"
        F[Founder Listing Form] --> OTP[Nodemailer Email OTP]
        OTP -->|Verified Code| ACT[actions.ts: submitFounderRoleListing]
        ACT --> GEO
        ACT --> VAL
    end

    GEO --> DB[(Turso / LibSQL Database)]
    VAL --> DB
    DB --> UI[FindersApp / MapComponent / ThreeGlobe / FloatingPortalCard]
```

### Track A: Zero-LLM Deterministic Scraping
- **Greenhouse**: Direct REST API endpoint `https://boards-api.greenhouse.io/v1/boards/{boardId}/jobs?content=true`. Expands multi-office roles into separate spatial coordinates.
- **Lever**: Direct REST API endpoint `https://api.lever.co/v0/postings/{boardId}?mode=json`. Parses `categories.allLocations` and semicolon-delimited office locations into discrete branch entries.
- **Ashby**: Direct API endpoint `POST https://jobs.ashbyhq.com/api/posting-api/job-board/{boardId}`. Handles secondary locations array and custom department mappings.
- **Workday**: Direct paginated CXS endpoint `POST https://{host}/wday/cxs/{path}/jobs` with `{ appliedFacets: {}, limit: 20, offset: N, searchText: "" }`. Directly forms posting URLs via `https://{host}/{siteName}{externalPath}`.

### Track B: Founder Self-Submission
- Allows early-stage founders to submit jobs without scraping.
- Gated by cryptographically random 6-digit email OTP verification stored in `otp_sessions`.
- Pre-submission validation runs live via `validator.ts` — dead 404 links or generic domain landing pages are rejected before writing to DB.
- Ingests into `companies` (`source_track: "founder_submitted"`, `size_tier: "startup"`) and `jobs` (`validation_status: "active"`, `is_active: true`).

---

## 3. Complete Bug Diagnostics & Historical Solutions Log

The following 6 major technical issues were diagnosed, engineered, and permanently resolved across the codebase:

### Fix 1: Eliminating LLM Extraction Truncation & Hallucinations
- **Symptom**: Previously, asking an LLM to scrape HTML returned 2–3 representative sample jobs instead of the full 200+ roles on a board.
- **Root Cause**: LLM token limits and sampling bias in `geminiScraper.ts`.
- **Permanent Solution**: Replaced the extraction pipeline with zero-LLM, deterministic REST/JSON fetchers in `src/lib/scraper/atsEngine.ts`. Every single open job on the ATS is fetched, paginated, and ingested without LLM summarization.

### Fix 2: Deep-Link Direct Resolution (No Homepage Bounces)
- **Symptom**: Clicking "Apply Directly" previously bounced users to the company’s root homepage or a generic careers portal.
- **Root Cause**: Scrapers were using page URLs rather than specific job posting identifiers.
- **Permanent Solution**: Extracted direct canonical URLs directly from ATS API responses:
  - Greenhouse: `https://job-boards.greenhouse.io/{board}/jobs/{id}` or `job.absolute_url`
  - Lever: `https://jobs.lever.co/{board}/{id}`
  - Ashby: `https://jobs.ashbyhq.com/{board}/{id}`
  - Workday: `https://{host}/{siteName}{externalPath}`
  - Track B: Verified exact destination URL with `validator.ts`.

### Fix 3: Step 0 Geocoding Correction (Broad Region & Remote False San Francisco Pins)
- **Symptom**: Linear had a job in "Europe (Remote)" but spatial map pins placed it at `[37.78, -122.42]` (San Francisco).
- **Root Cause**: Broad region strings ("Europe", "North America", "Worldwide", "Remote", "APAC", "AMER", "Remote India") failed city lookup and silently fell back to San Francisco coordinates.
- **Permanent Solution** ([`src/lib/scraper/geocoder.ts`](file:///e:/test%20vibe%20code/startup%20finder/src/lib/scraper/geocoder.ts)):
  - Built `isBroadRegionLocation()` with regex matching multi-region and remote strings.
  - Returns `lat: null, lng: null`, `isBroadRegion: true`, and `locationType: "remote"`.
  - Frontend components (`MapComponent.tsx`, `ThreeGlobe.tsx`) explicitly filter out `null` coordinates, preventing false SF pins while preserving the jobs in lists and search filters. Real cities (e.g. "Bengaluru, India" $\rightarrow$ `[12.97, 77.59]`, "London, UK" $\rightarrow$ `[51.51, -0.13]`) retain their exact global coordinates.

### Fix 4: Workday CXS Uncapped Pagination
- **Symptom**: Acceptance tests on Autodesk (504 jobs), Adobe (770 jobs), and NVIDIA (2000 jobs) initially capped at 60 jobs.
- **Root Cause**: A temporary test limit parameter `maxJobs: number = 300` and loop break at 60.
- **Permanent Solution** ([`src/lib/scraper/atsEngine.ts`](file:///e:/test%20vibe%20code/startup%20finder/src/lib/scraper/atsEngine.ts)):
  - Removed `maxJobs` cap from `scrapeWorkdayBoard`.
  - Loops until `allRawJobs.length >= data.total`. Verified uncapped counts: Autodesk (**504/504**), Adobe (**769/769**), NVIDIA (**2000/2000**).

### Fix 5: Shared Geocoder & Live Validation in Track B
- **Symptom**: Needed verification that Track B founder submissions adhere to Step 0 geocoding rules and reject dead URLs.
- **Permanent Solution** ([`src/app/actions.ts`](file:///e:/test%20vibe%20code/startup%20finder/src/app/actions.ts)):
  - `submitFounderRoleListing` imports and uses the exact same `geocodeLocation` and `validateJobApplyUrl` functions.
  - Verified: Non-SF cities (Bengaluru, London) geocode to their true global coordinates; remote strings return `null` coordinates; HTTP 404 links are rejected with user-facing alerts.

### Fix 6: Company Card "Open Positions" vs. Office Branch Job Count Mismatch
- **Symptom**: Company cards showed "Open Positions: 2" (or stuck at small numbers) while office branches listed mock numbers like `Indiranagar: 18 roles`, `Mumbai: 8 roles`, `Delhi: 6 roles`.
- **Root Cause**: `src/lib/companyIntelligence.ts` contained hardcoded fallback branch arrays with fake numbers (18, 8, 6, 12) for all non-preset companies.
- **Permanent Solution** ([`src/lib/companyIntelligence.ts`](file:///e:/test%20vibe%20code/startup%20finder/src/lib/companyIntelligence.ts)):
  - Overhauled `computeDynamicOfficeNetwork()` to dynamically aggregate and count the company's **actual real jobs** (`company.jobs` / `company.roles`).
  - Mathematical Guarantee: $\sum \text{intel.officeNetwork[].jobs} \equiv \text{openPositionsCount} \equiv \text{data.jobs.length} \equiv \text{sortedJobs.length}$.
  - Verified across the entire database: **87/87 companies (100%) match with exact 1-to-1 parity**.

---

## 4. File Map & Codebase Structure

```
startup finder/
├── src/
│   ├── app/
│   │   ├── actions.ts                  # Server actions (OTP, user auth, getCompanyWithJobs, submitFounderRoleListing)
│   │   ├── layout.tsx                 # Root HTML layout, font loading & metadata
│   │   ├── page.tsx                   # Main entry point (loads initial companies & map data)
│   │   └── api/
│   │       ├── auth/[...nextauth]/     # NextAuth authentication routes
│   │       ├── cron/
│   │       │   ├── scrape-jobs/       # Daily ATS batch sync cron (0 0 * * *)
│   │       │   └── validate-jobs/     # Daily link validator cron (0 6 * * *)
│   │       └── scrape/
│   │           ├── founder-site/      # Founder website metadata extractor
│   │           └── social-reach/      # Company social reach metrics updater
│   ├── components/
│   │   ├── FindersApp.tsx             # Core orchestrator component (manages views, active filters, modals)
│   │   ├── FloatingPortalCard.tsx     # Draggable, interactive company portal window
│   │   ├── FloatingJobPortalsManager.tsx # Multi-window window manager for open company portals
│   │   ├── CompanySheet.tsx           # Slide-out bottom/side drawer for company details
│   │   ├── FounderSubmissionModal.tsx # Track B 2-step founder OTP verification & job creation modal
│   │   ├── MapComponent.tsx           # 2D Mapbox GL interactive map with clustered office pins
│   │   ├── ThreeGlobe.tsx             # 3D interactive WebGL globe with particle arcs
│   │   ├── ListView.tsx               # Grid list view of companies and job role chips
│   │   └── TopBar.tsx                 # Search bar, filters (Role, Mode, Funding), and actions
│   ├── db/
│   │   ├── index.ts                   # Drizzle client configuration (LibSQL/Turso + better-sqlite3 local)
│   │   └── schema.ts                  # Unified database schema (companies, jobs, otp_sessions, company_reports)
│   └── lib/
│       ├── companyIntelligence.ts     # Dynamic officeNetwork calculator & company profile aggregator
│       ├── locationMatcher.ts         # High-precision location & branch string comparison matcher
│       ├── emailService.ts            # Nodemailer transport & HTML template generator for OTP delivery
│       ├── fallbackData.ts            # Safe static fallback datasets for initial client renders
│       └── scraper/
│           ├── atsEngine.ts           # Zero-LLM Greenhouse, Lever, Ashby, Workday scrapers
│           ├── batchRunner.ts         # Master orchestrator for global multi-company ATS extraction
│           ├── geocoder.ts            # High-precision geocoder with Step 0 broad-region correction
│           └── validator.ts           # Head/GET HTTP status + Title matching URL validator
├── scripts/
│   ├── migrate_production_schema.ts   # Idempotent DB schema migration script for new columns
│   ├── test_greenhouse_pipeline.ts    # Regression test suite for Greenhouse boards (Scale AI, Postman, Figma)
│   ├── test_lever_pipeline.ts         # Regression test suite for Lever boards (Spotify, Rover, Wealthfront)
│   ├── test_ashby_pipeline.ts         # Regression test suite for Ashby boards (Linear, Supabase, DeepL)
│   ├── test_workday_pipeline.ts       # Regression test suite for Workday tenants (Autodesk, Adobe, NVIDIA)
│   ├── test_geocoding_fix.ts          # Step 0 broad-region geocoding regression tests
│   ├── test_track_b_pipeline.ts       # Track B founder OTP & submission regression tests
│   └── verify_database_wide_job_counts.ts # Database-wide parity auditor (office network vs. DB jobs)
├── vercel.json                        # Deployment cron configuration
├── package.json                       # Project dependencies and npm scripts
└── FINDELY_MASTER_LOG.md              # THIS DOCUMENT (Universal AI master context)
```

---

## 5. Unified Database Schema Specification

All database definitions are centralized in [`src/db/schema.ts`](file:///e:/test%20vibe%20code/startup%20finder/src/db/schema.ts):

### `companies` Table
| Column | Type | Description |
|---|---|---|
| `id` | `text` (PK) | Unique company UUID |
| `name` | `text` (Unique) | Company display name |
| `website_url` | `text` | Clean canonical website URL |
| `logo_url` | `text` | Clearbit / Google favicon logo CDN link |
| `description` | `text` | Cleaned company summary description |
| `location_text`| `text` | Primary headquarters city and country |
| `latitude` | `real` | HQ Latitude coordinate (nullable for remote) |
| `longitude` | `real` | HQ Longitude coordinate (nullable for remote) |
| `founded_year` | `integer` | Founded year |
| `company_size` | `text` | Size tier string (e.g. `100-500 employees`) |
| `status` | `text` | Verification status (`verified`, `pending`, `flagged`) |
| `source_track` | `text` | Ingestion origin: `'ats_api'` \| `'founder_submitted'` \| `'scraped'` |
| `size_tier` | `text` | Company scale tier: `'startup'` \| `'scaleup'` \| `'enterprise'` |
| `founders_json`| `text` | JSON array of founder objects (`name`, `role`, `linkedin_url`) |
| `tech_stack_json`| `text`| JSON array of primary tech stack tags |

### `jobs` Table
| Column | Type | Description |
|---|---|---|
| `id` | `text` (PK) | Unique job UUID |
| `company_id` | `text` (FK) | Reference to `companies.id` |
| `title` | `text` | Exact job title |
| `salary_range` | `text` | Salary compensation string |
| `job_type` | `text` | `'Full-time'` \| `'Part-time'` \| `'Contract'` |
| `location_text`| `text` | Resolved office location or remote label |
| `latitude` | `real` | Location Latitude (null for remote/broad regions) |
| `longitude` | `real` | Location Longitude (null for remote/broad regions) |
| `apply_url` | `text` | Verified direct ATS application URL |
| `is_active` | `integer` | Active visibility flag (`1` = active, `0` = deactivated) |
| `validation_status` | `text` | `'valid'` \| `'flagged'` \| `'failed'` \| `'active'` |
| `validation_failures` | `integer`| Consecutive HTTP / title validation failure count |
| `last_validated` | `integer` | Timestamp of last URL validation check |

### `otp_sessions` Table
| Column | Type | Description |
|---|---|---|
| `id` | `text` (PK) | Session UUID |
| `email` | `text` | Candidate or founder email address |
| `otp_code` | `text` | Cryptographically random 6-digit verification code |
| `expires_at` | `integer` | Expiration timestamp (10 min TTL) |
| `verified` | `integer` | Verification state (`1` = verified, `0` = pending) |

---

## 6. Automated Test Suite & Regression Commands

Run these commands in the terminal to verify any change without touching production data:

```bash
# 1. Full TypeScript Type Check
npx tsc --noEmit

# 2. Verify Greenhouse Ingestion (Scale AI, Postman, Figma)
npx tsx scripts/test_greenhouse_pipeline.ts

# 3. Verify Lever Ingestion (Spotify, Rover, Wealthfront)
npx tsx scripts/test_lever_pipeline.ts

# 4. Verify Ashby Ingestion (Linear, Supabase, DeepL)
npx tsx scripts/test_ashby_pipeline.ts

# 5. Verify Workday CXS Uncapped Ingestion (Autodesk, Adobe, NVIDIA)
npx tsx scripts/test_workday_pipeline.ts

# 6. Verify Step 0 Broad-Region & Remote Geocoding
npx tsx scripts/test_geocoding_fix.ts

# 7. Verify Track B Founder Self-Submission & OTP Gating
npx tsx scripts/test_track_b_pipeline.ts

# 8. Verify Database-Wide Office Network vs. DB Job Count Parity
npx tsx scripts/verify_database_wide_job_counts.ts

# 9. Test Production Build
npm run build
```

---

## 7. Rules for Future Development & AI Prompting

When working on this repository, all AI agents and engineers MUST follow these core design rules:

1. **NO LLMs in the Extraction Path**: Never replace deterministic ATS fetchers (`atsEngine.ts`) with LLM scrapers. Real ATS endpoints return structured JSON with 100% fidelity.
2. **Never Hardcode Fallback Coordinates to San Francisco**: Broad regions ("Europe", "Remote", "Worldwide") MUST return `lat: null, lng: null`. The UI filters out null pins automatically.
3. **Keep `officeNetwork` Dynamically Calculated**: Never hardcode static branch numbers (e.g. `jobs: 18`). Always derive `officeNetwork` using `computeDynamicOfficeNetwork()` so branch sums always equal `data.jobs.length`.
4. **All External Links Must Be Validated**: Every apply link must pass through `validator.ts` to ensure HTTP 200 and title matching before marking active.
5. **Preserve Database Isolation**: Store credentials only in `.env.local` (which is in `.gitignore`). Never commit API keys or private tokens.
