# JobMap — Technical Specification v1

> Working name only — rename freely. This doc is written to be handed directly to Claude Code as an implementation brief. It assumes the existing Next.js + react-map-gl + MapLibre + server-actions codebase already in place.

---

## 1. Product Summary

An open-source, always-on map that shows where companies are hiring right now. Companies self-list (or get listed by users) and opt in to having their careers page or job-board feed monitored daily. The map is the primary surface — it should render immediately on load, populated or empty, never blocked or blank.

**Core loop:** company gets added → source URL captured → daily crawl pulls current openings → openings geocoded and pinned → map updates → users browse/filter by pin.

---

## 2. Explicit Non-Goals (read before building)

- **No scraping of LinkedIn or Indeed profiles/listings directly.** Both aggressively detect and legally pursue scrapers (see hiQ v. LinkedIn). Any attempt will get the server's IP banned and creates real legal exposure once this is public/open-source.
- **No login-gated scraping** of any platform (i.e., never scrape behind a fake/real LinkedIn session).
- Not building a full ATS or applicant-tracking system — this is discovery/visibility only, not an application pipeline.

**What replaces the "LinkedIn/Indeed" need:**
- Companies that use **Greenhouse**, **Lever**, or **Workday** (the majority of mid-to-large companies) expose *public, unauthenticated JSON job-board endpoints* meant for exactly this kind of consumption. No scraping needed, no ToS violation.
- Indeed offers a **Publisher/XML feed API** for aggregators — usable if you register for it later; not required for MVP.
- Everything else comes from the company's own careers page, which they explicitly opt in to sharing.

---

## 3. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js (App Router), React, react-map-gl | Already in place |
| Map | MapLibre GL + CARTO Positron tiles | Already in place, no API key |
| Geocoding | OpenStreetMap Nominatim | Already in place — respect 1 req/sec rate limit, cache results |
| Database | Postgres (Supabase or Neon for free managed hosting) | Plain lat/lng columns, no PostGIS needed at this scale |
| ORM | Prisma or Drizzle | Drizzle is lighter if you want fast iteration |
| Backend jobs | Next.js API routes / server actions + a scheduled function | See §7 |
| Scraping | Playwright (JS-rendered pages) + Cheerio (static HTML) | Only ever targets URLs the company submitted |
| Cron | Vercel Cron (if hosted on Vercel) or a small node-cron worker if self-hosted | Daily at 17:00–18:00 IST |
| Auth (company claim flow) | Magic-link email (Resend/Postmark) — no password needed | Keeps it low-friction for company reps |
| Hosting | Vercel (frontend + API) + Supabase (DB + auth) | Both have generous free tiers, good for open-source |

---

## 4. Data Model

```
companies
  id            uuid PK
  name          text
  website_url   text
  logo_url      text nullable
  description   text nullable
  claimed_by    uuid FK -> users.id, nullable   -- null = community-added, unverified
  status        enum('unverified','verified','flagged')
  created_at    timestamptz
  updated_at    timestamptz

scrape_sources
  id            uuid PK
  company_id    uuid FK -> companies.id
  source_type   enum('careers_page','greenhouse','lever','workday','manual')
  source_url    text
  consent_given boolean default false      -- required true before any crawl runs
  consented_by  uuid FK -> users.id, nullable
  last_crawled  timestamptz nullable
  last_status   enum('ok','error','blocked') nullable
  created_at    timestamptz

jobs
  id            uuid PK
  company_id    uuid FK -> companies.id
  title         text
  description   text nullable
  location_text text                        -- raw string as scraped, e.g. "Bengaluru, India (Hybrid)"
  latitude      float nullable
  longitude     float nullable
  geocode_status enum('pending','ok','failed')
  apply_url     text nullable
  posted_at     timestamptz nullable
  first_seen_at timestamptz
  last_seen_at  timestamptz                 -- if a job stops appearing on a crawl, mark inactive
  is_active     boolean default true
  source_id     uuid FK -> scrape_sources.id

scrape_runs
  id            uuid PK
  scrape_source_id uuid FK
  started_at    timestamptz
  finished_at   timestamptz nullable
  jobs_found    int
  jobs_new      int
  jobs_closed   int
  status        enum('success','partial','failed')
  error_message text nullable

users
  id            uuid PK
  email         text unique
  role          enum('individual','company_rep')
  created_at    timestamptz
```

Key design point: **`consent_given` gates everything.** No `scrape_sources` row gets crawled by the cron job unless this is `true`. This is your legal/ethical guardrail baked into the schema, not just a UI checkbox.

---

## 5. Add-Company Flow (the "open source, people can submit" part)

1. Anyone can add a company: name, website, and — critically — they check a box confirming *"I have the right to submit this company's data and/or this company has agreed to be monitored."*
2. This creates the company as `status: unverified`.
3. Separately, a company rep can **claim** a listing via magic-link email verification (using a company-domain email, similar to what you saw on the Mapbox signup — cheap fraud check).
4. Once claimed, the rep can:
   - Add/confirm the `scrape_sources` entry (their careers page or Greenhouse/Lever board URL) and explicitly flip `consent_given = true`.
   - Or skip scraping entirely and manually post job openings themselves.
5. Community-added, unverified companies with no consent simply **don't get crawled** — they can still show a pin (from their public website's stated address, not job scraping) but no job data populates until claimed + consented.

This solves your "let people add companies, let companies confirm and control their own data" requirement without needing to scrape anyone without permission.

---

## 6. Scraping Pipeline

**Trigger:** daily cron, 17:00 IST (adjust to 17:30 if you want mid-window).

**Per `scrape_source` where `consent_given = true`:**

1. **Detect type:**
   - If `source_url` matches `boards.greenhouse.io/*` → hit `https://boards-api.greenhouse.io/v1/boards/{token}/jobs` (public JSON, no auth).
   - If it matches `jobs.lever.co/*` → hit `https://api.lever.co/v0/postings/{company}?mode=json` (public JSON, no auth).
   - Otherwise → treat as a generic careers page: fetch with Playwright (handles JS-rendered React/Vue career pages), extract job titles/locations via a combination of structured data (`JobPosting` schema.org markup, common on modern career pages) and a fallback CSS-selector heuristic.
2. **Diff against existing `jobs` rows** for that company: new postings → insert; postings no longer present → set `is_active = false`, keep `last_seen_at`.
3. **Geocode** any job with a new/changed `location_text` via Nominatim, cache by normalized location string so you're not re-geocoding "Bengaluru, India" 500 times a day.
4. **Log** a `scrape_runs` row regardless of outcome — this gives you an admin view of what's failing.
5. **Backoff/respect:** max 1 request per source per day, honor `robots.txt` on generic career pages, set a clear descriptive User-Agent (e.g. `JobMapBot/1.0 (+https://yoursite.com/about-bot)`), and if a source 403s/blocks you three days running, auto-flip its status to `blocked` and stop hammering it — surface that to the company rep to fix instead of retrying forever.

---

## 7. Map Behavior

- The map **always mounts** on `/map` regardless of data state. Never show a blank white screen.
- Empty state (like your current screenshot) should render as an **overlay on top of the live, pannable/zoomable map**, not replace it.
- Pins cluster at low zoom (use MapLibre's built-in clustering, it's free) and split into individual markers as you zoom in.
- Popup on click = bottom-sheet style (slides up from bottom on mobile, floating card on desktop) showing: company logo, name, open role count, 2–3 featured roles, "View all roles" → company detail page.
- Filter bar (bottom-left, as in your screenshot) stays but gets real filters: role type, remote/hybrid/onsite, posted-within (24h/7d/30d), company size if you collect it later.

---

## 8. UI Direction (distinct from generic job-board look)

Avoid: light blue-and-white SaaS card grid (the "every job board" look).

Suggested direction:
- **Dark base map** (MapLibre has free dark styles, or restyle CARTO Dark Matter) with a single warm accent color (amber/orange) for active job pins — reads as "signal on a dark field" rather than "spreadsheet with pins."
- Pins **pulse briefly** when a job is newly discovered that day (subtle animation, decays after 24h) — reinforces the "freshness" story from your daily crawl.
- Popups as **bottom sheets**, not modals — feels more like a native map app (Google Maps/Citymapper) than a B2B dashboard.
- Typography: one confident display serif or heavy grotesque for headings against a clean system sans for body — avoids the default Inter-everywhere SaaS look.

I can generate an actual visual mockup of this if useful — say the word.

---

## 9. Open-Source Readiness Checklist

- `LICENSE` — MIT (matches your Loom/Weave precedent).
- `README.md` — setup instructions, env vars, "why we don't scrape LinkedIn/Indeed" explainer (turns your legal constraint into a trust signal for contributors).
- `.env.example` listing all required keys (see below) — never commit real secrets.
- `CONTRIBUTING.md` — how to add a new job-board integration (Greenhouse/Lever pattern makes this extensible — a PR template for "add support for X ATS" is a great community on-ramp).
- Rate-limit and bot-identification info documented publicly (`/about-bot` page) so any company can see exactly what's crawling them and opt out.
- An opt-out endpoint/email so any company can request removal — important for public trust and reduces legal exposure.

---

## 10. Environment Variables

```
DATABASE_URL=
NEXT_PUBLIC_MAP_STYLE_URL=          # CARTO/MapLibre style JSON
NOMINATIM_USER_AGENT=               # required by Nominatim usage policy
RESEND_API_KEY=                     # magic-link auth emails
CRON_SECRET=                        # to authenticate the scheduled cron hitting your API route
```

No Mapbox key, no LinkedIn/Indeed API key required for MVP.

---

## 11. Build Phases (hand these to Claude Code incrementally, not all at once)

**Phase 1 — Foundation**
- DB schema + migrations (§4)
- Map always-mounted with empty-state overlay (§7)
- Manual "Add company" flow, no scraping yet — just company + manual job entry

**Phase 2 — Consent + claim flow**
- Magic-link company claim
- `scrape_sources` + consent toggle UI

**Phase 3 — Scraping pipeline**
- Greenhouse + Lever integrations first (highest reliability, zero scraping risk)
- Generic careers-page scraper second (Playwright + schema.org JobPosting extraction)
- Cron wiring (§6)

**Phase 4 — Polish**
- Clustering, filters, bottom-sheet popups
- Dark theme + pulse animation (§8)
- Admin view of `scrape_runs` for debugging failed sources

**Phase 5 — Open-source packaging**
- README, LICENSE, CONTRIBUTING, `/about-bot` page, opt-out flow (§9)

---

## 12. Open Questions to Settle Before Phase 3

- Do you want unverified/community-added companies visible on the map at all before they're claimed, or hidden until claimed? (Affects trust and spam risk.)
- Self-hosted cron worker vs. Vercel Cron — depends on your hosting budget/target.
- Do you want job descriptions stored in full (higher scrape footprint, more useful) or just title + location + apply link (lighter, faster)?
