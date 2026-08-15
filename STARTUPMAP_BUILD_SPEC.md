# StartupMap — Personal Build Spec (for Antigravity)

## 0. What this is

A personal job/startup tracker, built for one user (you). Not a SaaS product. No accounts, no landing page, no growth features. You open it, you see your data, you use it.

This is the only document you need. Build directly from this.

---

## 1. Core loop

```
Discover companies/jobs → Track status → Take notes → Follow up → Applied/Rejected/Offer
```

Two views, toggled:
- **Map view** — geographic browse, for discovery
- **Board view** — kanban by status, for day-to-day tracking

No separate "saved" feature — everything you add IS the tracked list.

---

## 2. What we're building

### MVP screens (2 total)
1. **Board** — kanban columns: `Researching → Interested → Applied → Interviewing → Offer / Rejected`. Each card = a company. Click a card → detail panel (slide-over, not a new page).
2. **Map** — pins for companies with coordinates. Click pin → same detail panel as board.

Both views share one detail panel component, and both live under a left icon rail (Discover / Track) matching the reference pattern in Section 12. That's the whole UI surface.

### Detail panel (slide-over, tabbed — see Section 12)
**Details tab:**
- Company name, one-liner, location, website link
- Status dropdown (same 5 stages as board columns)
- **Founder(s)** — name + optional LinkedIn URL, shown as a small linked row (see Section 5a)
- Notes (plain textarea, autosave)
- Next action + optional date

**Jobs tab:**
- List of open roles (title, posted date, apply link)

### Add new entry
- One button: "Add company" — opens a small form (name, url, location, notes optional)
- Paste-a-job-URL flow is v2, not MVP. Manual entry first.

---

## 3. What we are NOT building

- Auth / login / signup
- Multi-user anything
- Saved-jobs-as-a-separate-feature (redundant — everything tracked IS saved)
- Analytics/tracking
- Funding rounds, investor data, detailed founder bios (out of scope — you just need to know who they are, not their life story)
- Recommendation engine
- Scraping infrastructure against sites that block automated access
- Notifications/reminders system (v2 at earliest)
- Company review/rating system (Indeed already has this — link out instead)

If you catch yourself building any of the above, stop and re-read this doc.

---

## 4. Data sources & discovery pipeline

### Core sources (all public, no auth bypass, no blocked-site scraping)

| Source | What it gives you | Access method |
|---|---|---|
| Indeed API | Live job listings: title, company, location, type, apply URL | Official API, already wired in |
| YC public directory | Company name, one-liner, industry, batch, location — fully public, no login | Fetch YC's public directory pages, parse listing data |
| Company's own website/careers page | Description, founders (About page), open roles | Fetch the company's own public page — this is first-party, not scraping a third party |
| Web search (keyword discovery) | New company candidates matching your criteria | Search by keyword + location + stage, e.g. "seed funded fintech startup Bengaluru 2026" |
| Mapbox Geocoding API | Lat/long from location text | One-time per company, cached |

**Hard rule, unchanged from Section 9:** nothing gets fetched from a site that blocks automated access via robots.txt or sits behind a login wall. YC's directory and a company's own site are fine because they're public by design. A site like Crunchbase or LinkedIn stays off-limits.

### 4a. Keyword-based discovery pipeline

Instead of only tracking companies you manually add, you can define **search keywords** (e.g. "fintech Bengaluru", "B2B SaaS design tool Series A") and let the app periodically surface new candidates for your approval — nothing gets added to your map/board automatically.

```
You define keywords (stored, editable anytime)
        ↓
Scheduled job (same daily run as Section 9) searches:
  - YC directory for matching companies
  - Web search for matching companies mentioned in recent articles/launches
        ↓
Candidates deduplicated against companies already in your DB
        ↓
New candidates land in a "Suggestions" queue — NOT auto-added to Board/Map
        ↓
You review the queue (name, one-liner, source link) and approve/discard each
        ↓
Approved candidates become real Company rows (status: researching), geocoded, ready to track
```

This keeps your dataset intentional (like your 30-50 hand-picked companies) while still automating the *finding* part — the tedious bit — without ever polluting your tracker with junk matches or needing you to manually browse YC's directory yourself.

### Data model addition
```
Keyword
  id
  term              // "fintech Bengaluru"
  created_at

Suggestion
  id
  keyword_id
  company_name
  one_liner
  source_url        // where it was found (YC listing, article, etc.)
  status             // "pending" | "approved" | "discarded"
  found_at
```

### Not building
- A generic web crawler that scrapes arbitrary sites — the discovery step is targeted searches against YC's public directory and web search results, not a crawler roaming the internet
- Auto-approval of suggestions — every candidate needs your explicit yes before it becomes a tracked company

---

## 5. Data model

Single local file, not a hosted database. SQLite (via `better-sqlite3` or `libsql`) — at your scale (dozens of records) this is plenty, and filtering/sorting stays trivial as it grows.

```
Company
  id
  name
  one_liner
  location_text        // "Bengaluru, Karnataka"
  lat, lng              // geocoded once, cached
  website
  status                // researching | interested | applied | interviewing | offer | rejected
  notes                 // free text
  next_action           // free text, optional
  next_action_date      // optional
  created_at
  updated_at

Founder
  id
  company_id
  name
  role                  // "Co-founder & CEO" etc, optional
  linkedin_url          // optional, manual/suggested entry — no reliable API source
  created_at

Job
  id
  company_id
  title
  url
  posted_date
  job_type
  source                // "indeed" | "manual" | "indeed-sync"
  status                // "active" | "likely_closed"
  last_seen_at          // updated every sync run it still appears in
```

Three tables. Founders and jobs both hang off a company — neither requires the other to exist.

### 5a. Founder display

- Detail panel shows founders as a compact row under the company header — name, small role label if given, LinkedIn icon-link if a URL exists.
- If no founders added yet: show nothing extra, don't render an empty "Founders" heading. Consistent with the "no empty-state decoration" rule in Section 7.
- Adding a founder manually is just another field in the "Add/Edit company" form — a small repeatable name+url row, not a separate screen.
- **Auto-lookup:** an optional "Find founders" action on a company triggers a background web search ("[company name] founder / co-founder"). Confident matches are shown as **suggestions** you approve or discard — never auto-saved directly to the Founder table. Founder identity is a fact worth getting right, unlike job listings, so this stays a one-click-confirm step rather than a silent sync.
- No confident match found → section stays empty, no error message shown.

---

## 6. Tech stack — kept deliberately light

```
Frontend + Backend   Next.js (App Router) + TypeScript
Database             SQLite (local file, no server needed)
ORM                  Drizzle (lighter than Prisma for this scale) or Prisma if more familiar
UI                   Tailwind CSS only — no component library
Map                  Mapbox GL JS (free tier covers personal use easily)
Deployment           Vercel (needed for daily cron — see Section 9)
```

Skip: Auth.js, Postgres, Zod-heavy validation layers, shadcn/ui, any analytics SDK.

---

## 7. UI direction — minimal, not heavy

Explicit design constraints for Antigravity to follow:

- **No dashboard aesthetic.** No KPI cards, no colored badges everywhere, no gradient headers. Plain text, generous whitespace, one accent color max.
- **Typography does the work.** One typeface (system font stack or a single Google Font), 2-3 sizes total. No decorative type.
- **Board columns:** plain vertical lists, thin dividers, no drop-shadows on cards. Card = company name + one-liner + tiny status dot + small job-count badge if jobs > 0 (e.g. "3 open roles"). Founders stay inside the detail panel, not on the card.
- **Map:** default Mapbox light style, clustered markers with count badges when companies overlap at a given zoom (Section 12) — simple built-in Mapbox clustering, not custom logic. Marker = small logo tile or initial-letter fallback.
- **Detail panel:** slide-over from the right, not a modal with a dark overlay. Feels lighter.
- **Color:** neutral grays + one accent. Don't theme five statuses in five different colors — use the accent for the active state, a muted gray-scale progression for status.
- **No onboarding, no empty-state illustrations, no tooltips explaining what a kanban board is.** You know how to use your own tool.

If in doubt: cut the element. This is a tool, not a portfolio piece.

---

## 8. Build sequence (Antigravity sprints)

```
Sprint 1 — Project setup
  Next.js + TypeScript + Tailwind, SQLite + Drizzle schema (Company, Founder, Job), seed script

Sprint 2 — Board view + left icon rail
  Kanban columns, card component, click-to-change-status, left rail nav (Discover/Track icons)

Sprint 3 — Detail panel
  Slide-over with Details/Jobs tab switcher (Section 12), edit fields, notes textarea with autosave (debounced), founders row display

Sprint 4 — Add company flow + founder lookup
  Add-company form, "Find founders" suggest-and-confirm flow (Section 5a)

Sprint 5 — Map view
  Mapbox integration, clustered markers with count badges, logo tiles, hover/selected ring state,
  pins from geocoded companies, click → detail panel, bottom-left stats footer + Filters button (Section 12)
  Geocode-on-save for new companies (Mapbox Geocoding API call when lat/lng missing)

Sprint 6 — Polish
  Minimal empty states, keyboard shortcuts if easy (e.g. "n" for new), responsive check for phone use

Sprint 7 — Job data
  Wire in Indeed search so jobs populate a company's Jobs list from real listings

Sprint 8 — Keyword discovery pipeline
  Keyword management UI (add/edit/remove search terms), YC directory fetch + parse,
  web search integration for candidate discovery, Suggestions queue UI (approve/discard),
  dedup check against existing companies before surfacing a suggestion

Sprint 9 — Daily auto-sync
  Deploy to Vercel, add Vercel Cron config (17:30 IST daily), build /api/sync/daily route,
  wire status/last_seen_at updates on Job rows, run keyword discovery in the same daily job,
  add "Updated today, X new jobs, Y new suggestions" indicator to Board view
```

---

## 9. Daily auto-sync (5–6 PM run)

Goal: once a day, the app checks for new job listings for tracked companies, and runs your keyword discovery searches (Section 4a) — updating the board and suggestions queue without you doing it manually.

**Framing:** this is automated *search*, not a scraper. It calls the Indeed API and fetches public pages (YC directory, company career pages) on a schedule — same sources as Section 4, just automated instead of manual. Sites that block automated access stay off-limits; this only works because these sources are meant to be queried or are first-party public pages.

### How it works
1. A scheduled job runs once daily, ~5:30 PM.
2. **Job sync:** for each tracked company (or saved search term), calls the Indeed job search API. New listings inserted, tagged `source: "indeed-sync"`. Listings that disappear get marked `status: "likely_closed"` (never deleted).
3. **Discovery sync:** for each saved keyword (Section 4a), searches YC's directory + web search for matching companies. New matches (deduped against existing companies) land in the Suggestions queue.
4. A small "Updated today — X new jobs, Y new suggestions" indicator appears on Board view. No push notifications, no email.

### Why this needs a real deployment, not just localhost
A scheduled job only fires reliably if something is always running. Your laptop being asleep or closed at 5:30 PM means the sync silently skips that day.

| Option | How | Trade-off |
|---|---|---|
| **Deploy to Vercel** (recommended) | Vercel Cron Jobs — one config entry, hits an API route on schedule | Free tier covers this; app becomes reachable from your phone too |
| **Keep it fully local** | `node-cron` in a long-running process, or system `crontab` calling a sync script | Only fires if your machine is on and the process is running at that exact time |

Vercel is the simpler, more reliable path — and gets you phone access as a side benefit.

### Sync job pseudocode
```
GET /api/sync/daily   (triggered by Vercel Cron at 17:30 IST)

  // Job sync
  for each tracked company/search-term:
    results = Indeed.search(term, location)
    for each result:
      if not exists in Job table (match by title+company+url):
        insert as new, status=active
      else:
        update last_seen_at
  mark any Job not seen in this run (and previously active) as likely_closed

  // Discovery sync
  for each saved Keyword:
    ycMatches = fetchYCDirectory(keyword.term)
    webMatches = webSearch(keyword.term + " startup")
    for each candidate in ycMatches + webMatches:
      if not exists in Company table (fuzzy match on name):
        insert into Suggestion table, status=pending

  return { new_jobs, closed_jobs, new_suggestions }
```

### Rate/quota note
Indeed's API has rate limits — with a handful of tracked companies/searches running once a day, you're nowhere near them. No backoff logic or queueing needed at this scale.

---

## 10. Autonomous build mode — self-feeding sprints

You want Antigravity to run through the sprint sequence on its own, without stopping after every sprint to ask "should I continue?" Here's how to do that safely.

### PROGRESS.md checkpoint file
At project root, Antigravity maintains a `PROGRESS.md`, read at the start of every session and updated at the end of every sprint:

```markdown
# StartupMap Build Progress

## Status: Sprint 3 in progress

## Completed
- [x] Sprint 1 — Project setup (SQLite schema, seed script working)
- [x] Sprint 2 — Board view (kanban columns, click-to-change-status)

## In progress
- [ ] Sprint 3 — Detail panel (slide-over built, founders row pending)

## Next up
- Sprint 4 — Add company flow + founder lookup
- Sprint 5 — Map view
...

## Known issues / decisions made
- Using Drizzle instead of Prisma (lighter for this scale)
- Skipped drag-and-drop, using click-to-change-status instead
```

### Self-feeding rule
Standing instruction for the agent (add to Antigravity's project/agent config, not just this doc):

> At the start of each turn, read `PROGRESS.md` first. If the current sprint is complete and passes a basic self-check (app runs, no errors, feature visibly works), mark it done, update `PROGRESS.md`, and move to the next sprint listed in Section 8 — without waiting for explicit "continue" each time. Only stop and ask the user when: (a) all sprints in Section 8 are complete, (b) a decision isn't covered by this doc (e.g. a schema change not listed here, an ambiguous UI choice), or (c) something breaks that can't be self-diagnosed after a couple of attempts.

Autonomy means "don't stop to ask permission before the next sprint," not "ignore the constraints in this doc." Everything in Section 11 still applies at every step.

---

## 11. Build rules for the AI agent

- Do not build a scraper against any site that blocks automated access (Crunchbase, LinkedIn, etc.) — the daily sync only ever calls the Indeed API.
- Do not add authentication, multi-user support, or any hosted-database dependency unless explicitly asked.
- Do not install a UI component library (shadcn, MUI, etc.) — Tailwind utility classes only.
- Do not add analytics, telemetry, or tracking of any kind.
- Do not redesign a completed sprint's UI without being asked.
- Do not change the database schema without flagging it in `PROGRESS.md` first, then continuing.
- Keep every screen to what's specified above — resist adding "nice to have" panels, sidebars, or stat widgets that weren't asked for.
- Never auto-save founder suggestions from web lookup without explicit user confirmation (Section 5a).
- Work through sprints continuously per Section 10 — update `PROGRESS.md` after each, don't wait for a "continue" prompt between sprints.
- If a feature isn't in Section 2 or Section 8, don't build it — ask first.

---

## 12. UI reference pattern (from screenshots)

Layout to match, described from the reference screenshots — not their backend or data, just the visible frontend arrangement:

### Left icon rail (fixed, ~60px wide)
- Discover (map icon) → your **Map view**
- Track (checklist icon) → your **Board view**
- Skip: Resume/PDF export icon — not in MVP scope (Section 3)

### Top bar
- Location/search input, left-aligned, generous width
- Right side: small counters if useful later ("Saved: 0" style) — for a single-user tool these aren't necessary; skip unless you want the visual rhythm. No avatar/login needed (no auth, Section 3).

### Map (Discover)
- Clustered markers: circular badge showing count when multiple companies are near each other at current zoom
- Individual markers: small square/rounded logo tile (fallback to a plain initial-letter tile if no logo)
- Hover/selected state: colored ring around the marker (pick your one accent color, per Section 7)
- No blurred/locked markers — that's their paywall gate, not relevant here (Section 3)
- Zoom controls, geolocate button, bottom-right — standard Mapbox controls, no need to build custom ones

### Detail slide-over (right panel, opens on marker/card click)
- Optional small status tag at top (e.g. "Actively hiring" if jobs.length > 0) — muted style, not a bold paywall-style banner
- Logo, company name, website icon-link
- Industry tag(s), business model (B2B/B2C), founded year — all optional fields, only render if filled in
- **Founders section**: avatar (or initial-tile fallback), name, role, LinkedIn/X icon links, short bio with "Read more" expand/collapse if bio is long. Bio field is optional manual entry — you write 1-2 lines if you want, not required.
- **Tabs at the bottom of the panel: "Details" / "Jobs"** — Details tab shows the fields above, Jobs tab shows the job list (title, posted date, apply link). This replaces one long scrolling panel with two tabs — cleaner and matches the reference.

### Bottom-left stats footer (Map view only)
- Small pill: total tracked companies
- Small pill: total open jobs (sum across tracked companies)
- "Filters" button here too (status filter, has-jobs filter — keep it to 2-3 filters max, not a full faceted search)

### List/Map toggle
- Simple two-button toggle, top-left of the main content area — swaps between Board (list-style) and Map without losing selection state

### What we deliberately don't replicate
- "Upgrade" / paywall UI, "Free trial" badge, locked/blurred company markers — all monetization gates from their commercial product, irrelevant to a personal single-user tool
- Bottom-right playback scrubber (looks like a hiring-activity timelapse control) — nice detail on their end, out of scope for MVP; can revisit as a v2 idea if you want to visualize hiring trends over time later

---

## 13. One-sentence scope check

> A two-screen personal tracker (board + map) for the startups and jobs I'm actually considering — with founder info and live job listings on each company, a daily auto-sync, no accounts, no banned scraping, and no UI beyond what's needed to see status and take notes.

If a proposed feature doesn't serve that sentence, it doesn't go in.
