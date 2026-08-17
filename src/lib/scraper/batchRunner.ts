/**
 * Findely Global Batch Scraping Runner
 * Orchestrates multi-company ATS extraction across India, USA, UK, Europe, Russia, China, Japan, Korea, Australia, New Zealand & Remote
 */

import { db } from "@/db";
import { companies, jobs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { 
  scrapeGreenhouseBoard, 
  scrapeLeverBoard, 
  scrapeAshbyBoard, 
  scrapeWorkdayBoard,
  scrapeRemotiveGlobalJobs,
  ScrapedCompanyResult 
} from "./atsEngine";

export interface CompanyTarget {
  name: string;
  domain: string;
  atsType: "greenhouse" | "lever" | "ashby" | "workday";
  boardId: string;
  workdayHost?: string;
  workdayPath?: string;
  logoUrl?: string;
  foundedYear?: number;
  companySize?: string;
  founders?: Array<{ name: string; role: string; linkedin_url?: string; avatar_url?: string }>;
  techStack?: string[];
  primaryCountry?: string;
  primaryCity?: string;
}

export const TARGET_FRONTIER_STARTUPS: CompanyTarget[] = [
  // ── 1. INDIA STARTUPS ──────────────────────────────────────────
  {
    name: "Postman",
    domain: "postman.com",
    atsType: "greenhouse",
    boardId: "postman",
    logoUrl: "https://logo.clearbit.com/postman.com",
    foundedYear: 2014,
    companySize: "1,200+ employees",
    founders: [{ name: "Abhinav Asthana", role: "CEO" }, { name: "Ankit Sobti", role: "CTO" }],
    techStack: ["Node.js", "React", "TypeScript", "Go", "AWS"],
    primaryCountry: "India",
    primaryCity: "Bengaluru",
  },
  {
    name: "Hasura",
    domain: "hasura.io",
    atsType: "ashby",
    boardId: "hasura",
    logoUrl: "https://logo.clearbit.com/hasura.io",
    foundedYear: 2017,
    companySize: "300+ employees",
    founders: [{ name: "Tanmai Gopal", role: "CEO" }, { name: "Rajoshi Ghosh", role: "COO" }],
    techStack: ["GraphQL", "Haskell", "Rust", "Go", "PostgreSQL"],
    primaryCountry: "India",
    primaryCity: "Bengaluru",
  },
  {
    name: "InVideo",
    domain: "invideo.io",
    atsType: "ashby",
    boardId: "invideo",
    logoUrl: "https://logo.clearbit.com/invideo.io",
    foundedYear: 2017,
    companySize: "250+ employees",
    founders: [{ name: "Sanket Shah", role: "CEO" }, { name: "Pankit Chheda", role: "CTO" }],
    techStack: ["WebGL", "Python", "React", "PyTorch", "Node.js"],
    primaryCountry: "India",
    primaryCity: "Mumbai",
  },
  {
    name: "Sarvam AI",
    domain: "sarvam.ai",
    atsType: "ashby",
    boardId: "sarvam",
    logoUrl: "https://logo.clearbit.com/sarvam.ai",
    foundedYear: 2023,
    companySize: "50+ employees",
    founders: [{ name: "Vivek Raghavan", role: "Co-Founder" }, { name: "Pratyush Kumar", role: "Co-Founder" }],
    techStack: ["PyTorch", "CUDA", "Transformers", "Python", "Kubernetes"],
    primaryCountry: "India",
    primaryCity: "Bengaluru",
  },

  // ── 2. USA STARTUPS ────────────────────────────────────────────
  {
    name: "OpenAI",
    domain: "openai.com",
    atsType: "ashby",
    boardId: "openai",
    logoUrl: "https://logo.clearbit.com/openai.com",
    foundedYear: 2015,
    companySize: "1,500+ employees",
    founders: [{ name: "Sam Altman", role: "CEO" }, { name: "Greg Brockman", role: "President" }],
    techStack: ["Python", "PyTorch", "Kubernetes", "Rust", "TypeScript"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "Cursor",
    domain: "cursor.com",
    atsType: "ashby",
    boardId: "cursor",
    logoUrl: "https://logo.clearbit.com/cursor.com",
    foundedYear: 2023,
    companySize: "40+ employees",
    founders: [{ name: "Michael Truell", role: "CEO" }, { name: "Sualeh Asif", role: "CTO" }],
    techStack: ["TypeScript", "Rust", "Python", "LLMs", "Electron"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "Cognition AI",
    domain: "cognition.ai",
    atsType: "ashby",
    boardId: "cognition",
    logoUrl: "https://logo.clearbit.com/cognition.ai",
    foundedYear: 2023,
    companySize: "50+ employees",
    founders: [{ name: "Scott Wu", role: "CEO" }],
    techStack: ["Python", "PyTorch", "TypeScript", "AI Agents", "Rust"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "Anthropic",
    domain: "anthropic.com",
    atsType: "greenhouse",
    boardId: "anthropic",
    logoUrl: "https://logo.clearbit.com/anthropic.com",
    foundedYear: 2021,
    companySize: "800+ employees",
    founders: [{ name: "Dario Amodei", role: "CEO" }, { name: "Daniela Amodei", role: "President" }],
    techStack: ["Python", "JAX", "PyTorch", "AWS", "Rust"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "Stripe",
    domain: "stripe.com",
    atsType: "greenhouse",
    boardId: "stripe",
    logoUrl: "https://logo.clearbit.com/stripe.com",
    foundedYear: 2010,
    companySize: "7,000+ employees",
    founders: [{ name: "Patrick Collison", role: "CEO" }, { name: "John Collison", role: "President" }],
    techStack: ["Ruby", "Sorbet", "Java", "Go", "React"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "Linear",
    domain: "linear.app",
    atsType: "ashby",
    boardId: "linear",
    logoUrl: "https://logo.clearbit.com/linear.app",
    foundedYear: 2019,
    companySize: "60+ employees",
    founders: [{ name: "Karri Saarinen", role: "CEO" }, { name: "Jori Lallo", role: "Co-Founder" }],
    techStack: ["TypeScript", "React", "Node.js", "GraphQL", "SQLite"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "Vercel",
    domain: "vercel.com",
    atsType: "greenhouse",
    boardId: "vercel",
    logoUrl: "https://logo.clearbit.com/vercel.com",
    foundedYear: 2015,
    companySize: "600+ employees",
    founders: [{ name: "Guillermo Rauch", role: "CEO" }],
    techStack: ["Next.js", "TypeScript", "Rust", "Turbopack", "Edge"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "Supabase",
    domain: "supabase.com",
    atsType: "ashby",
    boardId: "supabase",
    logoUrl: "https://logo.clearbit.com/supabase.com",
    foundedYear: 2020,
    companySize: "150+ employees",
    founders: [{ name: "Paul Copplestone", role: "CEO" }, { name: "Ant Wilson", role: "CTO" }],
    techStack: ["PostgreSQL", "Elixir", "TypeScript", "Go", "Docker"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "Scale AI",
    domain: "scale.com",
    atsType: "greenhouse",
    boardId: "scaleai",
    logoUrl: "https://logo.clearbit.com/scale.com",
    foundedYear: 2016,
    companySize: "1,000+ employees",
    founders: [{ name: "Alexandr Wang", role: "CEO" }],
    techStack: ["Python", "React", "Node.js", "PyTorch", "Kubernetes"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "Figma",
    domain: "figma.com",
    atsType: "greenhouse",
    boardId: "figma",
    logoUrl: "https://logo.clearbit.com/figma.com",
    foundedYear: 2012,
    companySize: "1,500+ employees",
    founders: [{ name: "Dylan Field", role: "CEO" }],
    techStack: ["C++", "WebAssembly", "TypeScript", "React", "Rust"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "Perplexity AI",
    domain: "perplexity.ai",
    atsType: "ashby",
    boardId: "perplexity",
    logoUrl: "https://logo.clearbit.com/perplexity.ai",
    foundedYear: 2022,
    companySize: "100+ employees",
    founders: [{ name: "Aravind Srinivas", role: "CEO" }, { name: "Denis Yarats", role: "CTO" }],
    techStack: ["Python", "FastAPI", "React", "Next.js", "PyTorch"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "ElevenLabs",
    domain: "elevenlabs.io",
    atsType: "ashby",
    boardId: "elevenlabs",
    logoUrl: "https://logo.clearbit.com/elevenlabs.io",
    foundedYear: 2022,
    companySize: "80+ employees",
    founders: [{ name: "Mati Staniszewski", role: "CEO" }, { name: "Piotr Dabkowski", role: "CTO" }],
    techStack: ["Python", "PyTorch", "Audio DSP", "React", "Next.js"],
    primaryCountry: "United States",
    primaryCity: "New York",
  },
  {
    name: "Modal Labs",
    domain: "modal.com",
    atsType: "ashby",
    boardId: "modal",
    logoUrl: "https://logo.clearbit.com/modal.com",
    foundedYear: 2021,
    companySize: "40+ employees",
    founders: [{ name: "Erik Bernhardsson", role: "CEO" }],
    techStack: ["Python", "Rust", "Linux", "gRPC", "Kubernetes"],
    primaryCountry: "United States",
    primaryCity: "New York",
  },
  {
    name: "Resend",
    domain: "resend.com",
    atsType: "ashby",
    boardId: "resend",
    logoUrl: "https://logo.clearbit.com/resend.com",
    foundedYear: 2023,
    companySize: "20+ employees",
    founders: [{ name: "Zeno Rocha", role: "CEO" }],
    techStack: ["Next.js", "TypeScript", "Tailwind", "React Email", "Node.js"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "PostHog",
    domain: "posthog.com",
    atsType: "ashby",
    boardId: "posthog",
    logoUrl: "https://logo.clearbit.com/posthog.com",
    foundedYear: 2020,
    companySize: "80+ employees",
    founders: [{ name: "James Hawkins", role: "CEO" }, { name: "Tim Glaser", role: "CTO" }],
    techStack: ["Python", "Django", "ClickHouse", "React", "TypeScript"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "Cal.com",
    domain: "cal.com",
    atsType: "ashby",
    boardId: "calcom",
    logoUrl: "https://logo.clearbit.com/cal.com",
    foundedYear: 2021,
    companySize: "40+ employees",
    founders: [{ name: "Peer Richelsen", role: "CEO" }],
    techStack: ["Next.js", "Prisma", "TailwindCSS", "TypeScript", "Node.js"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },

  // ── 3. UK & EUROPE STARTUPS ───────────────────────────────────
  {
    name: "Mistral AI",
    domain: "mistral.ai",
    atsType: "lever",
    boardId: "mistral",
    logoUrl: "https://logo.clearbit.com/mistral.ai",
    foundedYear: 2023,
    companySize: "70+ employees",
    founders: [{ name: "Arthur Mensch", role: "CEO" }, { name: "Guillaume Lample", role: "Chief Scientist" }],
    techStack: ["PyTorch", "C++", "CUDA", "Python", "Kubernetes"],
    primaryCountry: "France",
    primaryCity: "Paris",
  },
  {
    name: "DeepL",
    domain: "deepl.com",
    atsType: "ashby",
    boardId: "deepl",
    logoUrl: "https://logo.clearbit.com/deepl.com",
    foundedYear: 2017,
    companySize: "1,000+ employees",
    founders: [{ name: "Jaroslaw Kutylowski", role: "CEO" }],
    techStack: ["Python", "C++", "Rust", "Transformers", "PyTorch"],
    primaryCountry: "Germany",
    primaryCity: "Berlin",
  },
  {
    name: "Spotify",
    domain: "spotify.com",
    atsType: "lever",
    boardId: "spotify",
    logoUrl: "https://logo.clearbit.com/spotify.com",
    foundedYear: 2006,
    companySize: "9,000+ employees",
    founders: [{ name: "Daniel Ek", role: "CEO" }, { name: "Martin Lorentzon", role: "Co-Founder" }],
    techStack: ["Java", "Python", "C++", "GCP", "Kubernetes"],
    primaryCountry: "Sweden",
    primaryCity: "Stockholm",
  },
  {
    name: "Synthesia",
    domain: "synthesia.io",
    atsType: "ashby",
    boardId: "synthesia",
    logoUrl: "https://logo.clearbit.com/synthesia.io",
    foundedYear: 2017,
    companySize: "300+ employees",
    founders: [{ name: "Victor Riparbelli", role: "CEO" }, { name: "Steffen Tjerrild", role: "COO" }],
    techStack: ["PyTorch", "C++", "TypeScript", "WebGL", "Python"],
    primaryCountry: "United Kingdom",
    primaryCity: "London",
  },
  {
    name: "Lovable",
    domain: "lovable.dev",
    atsType: "ashby",
    boardId: "lovable",
    logoUrl: "https://logo.clearbit.com/lovable.dev",
    foundedYear: 2023,
    companySize: "25+ employees",
    founders: [{ name: "Anton Osika", role: "CEO" }],
    techStack: ["TypeScript", "Next.js", "AI Agents", "React", "Node.js"],
    primaryCountry: "Sweden",
    primaryCity: "Stockholm",
  },
  {
    name: "Prisma",
    domain: "prisma.io",
    atsType: "ashby",
    boardId: "prisma",
    logoUrl: "https://logo.clearbit.com/prisma.io",
    foundedYear: 2016,
    companySize: "100+ employees",
    founders: [{ name: "Johannes Schickling", role: "CEO" }],
    techStack: ["Rust", "TypeScript", "Node.js", "PostgreSQL", "GraphQL"],
    primaryCountry: "Germany",
    primaryCity: "Berlin",
  },
  {
    name: "Raycast",
    domain: "raycast.com",
    atsType: "ashby",
    boardId: "raycast",
    logoUrl: "https://logo.clearbit.com/raycast.com",
    foundedYear: 2020,
    companySize: "30+ employees",
    founders: [{ name: "Thomas Paul Mann", role: "CEO" }, { name: "Petr Nikolaev", role: "CTO" }],
    techStack: ["Swift", "Rust", "TypeScript", "React", "Node.js"],
    primaryCountry: "United Kingdom",
    primaryCity: "London",
  },

  // ── 4. JAPAN & KOREA STARTUPS ─────────────────────────────────
  {
    name: "Mercari",
    domain: "mercari.com",
    atsType: "greenhouse",
    boardId: "mercari",
    logoUrl: "https://logo.clearbit.com/mercari.com",
    foundedYear: 2013,
    companySize: "2,000+ employees",
    founders: [{ name: "Shintaro Yamada", role: "CEO" }],
    techStack: ["Go", "GCP", "Microservices", "React", "Kubernetes"],
    primaryCountry: "Japan",
    primaryCity: "Tokyo",
  },
  {
    name: "Upstage AI",
    domain: "upstage.ai",
    atsType: "ashby",
    boardId: "upstage",
    logoUrl: "https://logo.clearbit.com/upstage.ai",
    foundedYear: 2020,
    companySize: "120+ employees",
    founders: [{ name: "Sung Kim", role: "CEO" }],
    techStack: ["Python", "PyTorch", "Transformers", "CUDA", "FastAPI"],
    primaryCountry: "South Korea",
    primaryCity: "Seoul",
  },

  // ── 5. AUSTRALIA & NEW ZEALAND STARTUPS ───────────────────────
  {
    name: "Canva",
    domain: "canva.com",
    atsType: "greenhouse",
    boardId: "canva",
    logoUrl: "https://logo.clearbit.com/canva.com",
    foundedYear: 2012,
    companySize: "4,000+ employees",
    founders: [{ name: "Melanie Perkins", role: "CEO" }, { name: "Cliff Obrecht", role: "COO" }],
    techStack: ["Java", "TypeScript", "React", "Rust", "AWS"],
    primaryCountry: "Australia",
    primaryCity: "Sydney",
  },
  {
    name: "Linktree",
    domain: "linktr.ee",
    atsType: "lever",
    boardId: "linktree",
    logoUrl: "https://logo.clearbit.com/linktr.ee",
    foundedYear: 2016,
    companySize: "300+ employees",
    founders: [{ name: "Alex Zaccaria", role: "CEO" }, { name: "Anthony Zaccaria", role: "COO" }],
    techStack: ["TypeScript", "Node.js", "GraphQL", "React", "AWS"],
    primaryCountry: "Australia",
    primaryCity: "Melbourne",
  },
  {
    name: "SafetyCulture",
    domain: "safetyculture.com",
    atsType: "lever",
    boardId: "safetyculture",
    logoUrl: "https://logo.clearbit.com/safetyculture.com",
    foundedYear: 2004,
    companySize: "800+ employees",
    founders: [{ name: "Luke Anear", role: "CEO" }],
    techStack: ["Go", "React", "TypeScript", "AWS", "gRPC"],
    primaryCountry: "Australia",
    primaryCity: "Sydney",
  },
  {
    name: "Xero",
    domain: "xero.com",
    atsType: "greenhouse",
    boardId: "xero",
    logoUrl: "https://logo.clearbit.com/xero.com",
    foundedYear: 2006,
    companySize: "5,000+ employees",
    founders: [{ name: "Rod Drury", role: "Founder" }],
    techStack: ["C#", ".NET", "AWS", "React", "TypeScript"],
    primaryCountry: "New Zealand",
    primaryCity: "Wellington",
  },

  // ── 6. WORKDAY TECH POWERHOUSES ────────────────────────────────
  {
    name: "Autodesk",
    domain: "autodesk.com",
    atsType: "workday",
    boardId: "autodesk",
    workdayHost: "autodesk.wd1.myworkdayjobs.com",
    workdayPath: "autodesk/Ext",
    logoUrl: "https://logo.clearbit.com/autodesk.com",
    foundedYear: 1982,
    companySize: "14,000+ employees",
    founders: [{ name: "John Walker", role: "Founder" }],
    techStack: ["C++", "Python", "React", "AWS", "TypeScript"],
    primaryCountry: "United States",
    primaryCity: "San Francisco",
  },
  {
    name: "Adobe",
    domain: "adobe.com",
    atsType: "workday",
    boardId: "adobe",
    workdayHost: "adobe.wd5.myworkdayjobs.com",
    workdayPath: "adobe/external_experienced",
    logoUrl: "https://logo.clearbit.com/adobe.com",
    foundedYear: 1982,
    companySize: "29,000+ employees",
    founders: [{ name: "John Warnock", role: "Co-Founder" }, { name: "Charles Geschke", role: "Co-Founder" }],
    techStack: ["C++", "Java", "React", "TypeScript", "Python"],
    primaryCountry: "United States",
    primaryCity: "San Jose",
  },
  {
    name: "NVIDIA",
    domain: "nvidia.com",
    atsType: "workday",
    boardId: "nvidia",
    workdayHost: "nvidia.wd5.myworkdayjobs.com",
    workdayPath: "nvidia/NVIDIAExternalCareerSite",
    logoUrl: "https://logo.clearbit.com/nvidia.com",
    foundedYear: 1993,
    companySize: "29,000+ employees",
    founders: [{ name: "Jensen Huang", role: "CEO" }],
    techStack: ["CUDA", "C++", "Python", "PyTorch", "Deep Learning"],
    primaryCountry: "United States",
    primaryCity: "Santa Clara",
  }
];

export async function runBatchScrape(targets: CompanyTarget[] = TARGET_FRONTIER_STARTUPS) {
  let companiesScraped = 0;
  let jobsInserted = 0;
  const errors: string[] = [];

  console.log(`[Findely Scraper] Launching multi-country pipeline for ${targets.length} frontier startups...`);

  // 1. Scrape Dedicated ATS Boards
  for (const target of targets) {
    try {
      let result: ScrapedCompanyResult | null = null;

      if (target.atsType === "greenhouse") {
        result = await scrapeGreenhouseBoard(target.name, target.boardId, target.domain, target.logoUrl);
      } else if (target.atsType === "lever") {
        result = await scrapeLeverBoard(target.name, target.boardId, target.domain, target.logoUrl);
      } else if (target.atsType === "ashby") {
        result = await scrapeAshbyBoard(target.name, target.boardId, target.domain, target.logoUrl);
      } else if (target.atsType === "workday" && target.workdayHost && target.workdayPath) {
        result = await scrapeWorkdayBoard(target.name, target.workdayHost, target.workdayPath, target.domain, target.logoUrl);
      }

      if (!result || result.jobs.length === 0) {
        continue;
      }

      // Upsert company in database
      const existing = await db
        .select()
        .from(companies)
        .where(eq(companies.name, result.name));

      let companyId: string;

      if (existing.length > 0) {
        companyId = existing[0].id;
        await db
          .update(companies)
          .set({
            website_url: `https://${result.domain}`,
            logo_url: result.logoUrl || existing[0].logo_url,
            description: result.description || existing[0].description,
            location_text: target.primaryCity ? `${target.primaryCity}, ${target.primaryCountry}` : result.primaryLocation.city,
            latitude: target.primaryCity ? result.primaryLocation.lat : result.primaryLocation.lat,
            longitude: target.primaryCity ? result.primaryLocation.lng : result.primaryLocation.lng,
            contact_email: result.contactEmail || existing[0].contact_email,
            status: "verified",
            updated_at: new Date(),
          })
          .where(eq(companies.id, companyId));
      } else {
        companyId = crypto.randomUUID();
        await db.insert(companies).values({
          id: companyId,
          name: result.name,
          website_url: `https://${result.domain}`,
          logo_url: result.logoUrl,
          description: result.description,
          location_text: target.primaryCity ? `${target.primaryCity}, ${target.primaryCountry}` : result.primaryLocation.city,
          latitude: result.primaryLocation.lat,
          longitude: result.primaryLocation.lng,
          founded_year: target.foundedYear,
          company_size: target.companySize,
          contact_email: result.contactEmail,
          founders_json: target.founders ? JSON.stringify(target.founders) : null,
          tech_stack_json: target.techStack ? JSON.stringify(target.techStack) : null,
          status: "verified",
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      // 1. Collect all live scraped (applyUrl + location) pairs
      const liveRoleKeys = new Set(result.jobs.map((j) => `${j.applyUrl}:::${j.location}`));

      // 2. Fetch existing active jobs for this company and purge closed/expired roles
      const existingCompanyJobs = await db
        .select()
        .from(jobs)
        .where(eq(jobs.company_id, companyId));

      let purgedForCompany = 0;
      for (const ej of existingCompanyJobs) {
        const ejKey = `${ej.apply_url}:::${ej.location_text}`;
        if (ej.apply_url && !liveRoleKeys.has(ejKey)) {
          await db.delete(jobs).where(eq(jobs.id, ej.id));
          purgedForCompany++;
        }
      }
      if (purgedForCompany > 0) {
        console.log(`  🗑️ Purged ${purgedForCompany} expired roles for ${result.name}`);
      }

      // 3. Upsert live active jobs (each office gets its own geocoded row)
      for (const j of result.jobs) {
        const existingJob = await db
          .select()
          .from(jobs)
          .where(
            and(
              eq(jobs.company_id, companyId),
              eq(jobs.apply_url, j.applyUrl),
              eq(jobs.location_text, j.location)
            )
          );

        if (existingJob.length === 0) {
          await db.insert(jobs).values({
            id: crypto.randomUUID(),
            company_id: companyId,
            title: j.title,
            location_text: j.location,
            latitude: j.lat,
            longitude: j.lng,
            salary_range: j.salaryMin && j.salaryMax ? `$${(j.salaryMin/1000).toFixed(0)}k - $${(j.salaryMax/1000).toFixed(0)}k` : null,
            job_type: j.locationType === "remote" ? "Remote" : "Full-time",
            apply_url: j.applyUrl,
            description: j.description,
            posted_at: j.postedAt,
            is_active: true,
            validation_status: "pending",
            validation_failures: 0,
          });
          jobsInserted++;
        } else {
          await db
            .update(jobs)
            .set({
              title: j.title,
              latitude: j.lat,
              longitude: j.lng,
              salary_range: j.salaryMin && j.salaryMax ? `$${(j.salaryMin/1000).toFixed(0)}k - $${(j.salaryMax/1000).toFixed(0)}k` : existingJob[0].salary_range,
              job_type: j.locationType === "remote" ? "Remote" : "Full-time",
              description: j.description || existingJob[0].description,
              is_active: true,
            })
            .where(eq(jobs.id, existingJob[0].id));
        }
      }

      companiesScraped++;
      console.log(`✓ Scraped ${result.name} (${target.primaryCountry || "Global"}): ${result.jobs.length} roles.`);
    } catch (err: any) {
      errors.push(`Error scraping ${target.name}: ${err?.message}`);
      console.error(`Error scraping ${target.name}:`, err);
    }
  }

  // 2. Ingest Remotive Global Startup Remote & Worldwide Jobs
  try {
    console.log("[Findely Scraper] Fetching Remotive Global Startups...");
    const remotiveCompanies = await scrapeRemotiveGlobalJobs(50);
    
    for (const comp of remotiveCompanies) {
      const existing = await db
        .select()
        .from(companies)
        .where(eq(companies.name, comp.name));

      let companyId: string;
      if (existing.length > 0) {
        companyId = existing[0].id;
      } else {
        companyId = crypto.randomUUID();
        await db.insert(companies).values({
          id: companyId,
          name: comp.name,
          website_url: `https://${comp.domain}`,
          logo_url: comp.logoUrl,
          description: comp.description,
          location_text: comp.primaryLocation.city,
          latitude: comp.primaryLocation.lat,
          longitude: comp.primaryLocation.lng,
          status: "verified",
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      for (const j of comp.jobs) {
        const existingJob = await db
          .select()
          .from(jobs)
          .where(eq(jobs.apply_url, j.applyUrl));

        if (existingJob.length === 0) {
          await db.insert(jobs).values({
            id: crypto.randomUUID(),
            company_id: companyId,
            title: j.title,
            location_text: j.location,
            latitude: j.lat,
            longitude: j.lng,
            salary_range: j.salaryMin && j.salaryMax ? `$${(j.salaryMin/1000).toFixed(0)}k - $${(j.salaryMax/1000).toFixed(0)}k` : null,
            job_type: j.locationType === "remote" ? "Remote" : "Full-time",
            apply_url: j.applyUrl,
            description: j.description,
            posted_at: j.postedAt,
            is_active: true,
          });
          jobsInserted++;
        }
      }
      companiesScraped++;
    }
  } catch (err: any) {
    console.error("Remotive sync error:", err);
  }

  // ── 4. AgentReach Social Intelligence Discovery ──────────────────
  try {
    console.log("[Findely Scraper] Running AgentReach Social Intelligence & Founder Signal Pass...");
    const { syncAgentReachToDatabase } = await import("./agentReach");
    const socialResults = await syncAgentReachToDatabase();
    jobsInserted += socialResults.inserted;
    companiesScraped += socialResults.discovered;
  } catch (reachErr: any) {
    console.warn("[Findely Scraper] AgentReach pass skipped or errored:", reachErr.message);
  }

  const allJobsCount = await db.select().from(jobs);

  return {
    success: true,
    companiesScraped,
    newJobsAdded: jobsInserted,
    totalActiveJobs: allJobsCount.length,
    errors,
  };
}
