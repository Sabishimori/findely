import { db } from "../src/db";
import { companies, jobs } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { 
  scrapeGreenhouseBoard, 
  scrapeLeverBoard, 
  scrapeAshbyBoard, 
  scrapeSmartRecruitersBoard 
} from "../src/lib/scraper/atsEngine";

export interface YCCompanyTarget {
  name: string;
  domain: string;
  batch?: string;
  atsType: "greenhouse" | "lever" | "ashby" | "smartrecruiters";
  boardId: string;
  logoUrl?: string;
  foundedYear?: number;
  companySize?: string;
  founders?: Array<{ name: string; role: string; linkedin_url?: string; avatar_url?: string }>;
  techStack?: string[];
  primaryCity?: string;
  description?: string;
}

// ── Top Y Combinator Portfolio Companies ───────────────────────
export const YC_PORTFOLIO_STARTUPS: YCCompanyTarget[] = [
  {
    name: "Stripe",
    domain: "stripe.com",
    batch: "YC S09",
    atsType: "greenhouse",
    boardId: "stripe",
    logoUrl: "https://logo.clearbit.com/stripe.com",
    foundedYear: 2010,
    companySize: "7,000+ employees",
    founders: [{ name: "Patrick Collison", role: "CEO" }, { name: "John Collison", role: "President" }],
    techStack: ["Ruby", "Scala", "Java", "Go", "React", "AWS"],
    primaryCity: "San Francisco, CA",
    description: "Financial infrastructure for the internet, powering millions of businesses worldwide.",
  },
  {
    name: "Supabase",
    domain: "supabase.com",
    batch: "YC S20",
    atsType: "ashby",
    boardId: "supabase",
    logoUrl: "https://logo.clearbit.com/supabase.com",
    foundedYear: 2020,
    companySize: "150+ employees",
    founders: [{ name: "Paul Copplestone", role: "CEO" }, { name: "Ant Wilson", role: "CTO" }],
    techStack: ["PostgreSQL", "Elixir", "TypeScript", "Go", "Rust", "Next.js"],
    primaryCity: "San Francisco, CA",
    description: "The open source Firebase alternative providing PostgreSQL databases, Auth, and Storage.",
  },
  {
    name: "Linear",
    domain: "linear.app",
    batch: "YC W20",
    atsType: "ashby",
    boardId: "linear",
    logoUrl: "https://logo.clearbit.com/linear.app",
    foundedYear: 2019,
    companySize: "80+ employees",
    founders: [{ name: "Karri Saarinen", role: "CEO" }, { name: "Tuomas Artman", role: "CTO" }],
    techStack: ["TypeScript", "React", "Node.js", "GraphQL", "WebSockets"],
    primaryCity: "San Francisco, CA",
    description: "The issue tracking tool you'll enjoy using. Streamline software projects, sprints, and roadmaps.",
  },
  {
    name: "Cursor",
    domain: "cursor.com",
    batch: "YC S22",
    atsType: "ashby",
    boardId: "cursor",
    logoUrl: "https://logo.clearbit.com/cursor.com",
    foundedYear: 2022,
    companySize: "40+ employees",
    founders: [{ name: "Michael Truell", role: "CEO" }, { name: "Sualeh Asif", role: "Co-Founder" }],
    techStack: ["TypeScript", "Python", "Rust", "PyTorch", "Electron"],
    primaryCity: "San Francisco, CA",
    description: "An AI-powered code editor built on VS Code designed for hyper-productive software engineering.",
  },
  {
    name: "Resend",
    domain: "resend.com",
    batch: "YC W23",
    atsType: "ashby",
    boardId: "resend",
    logoUrl: "https://logo.clearbit.com/resend.com",
    foundedYear: 2023,
    companySize: "25+ employees",
    founders: [{ name: "Zeno Rocha", role: "CEO" }, { name: "Bu Kinoshita", role: "Co-Founder" }],
    techStack: ["Next.js", "TypeScript", "React Email", "Node.js", "PostgreSQL"],
    primaryCity: "San Francisco, CA",
    description: "Email infrastructure for developers, built with modern developer experience and React Email.",
  },
  {
    name: "Retool",
    domain: "retool.com",
    batch: "YC W17",
    atsType: "greenhouse",
    boardId: "retool",
    logoUrl: "https://logo.clearbit.com/retool.com",
    foundedYear: 2017,
    companySize: "500+ employees",
    founders: [{ name: "David Hsu", role: "CEO" }],
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    primaryCity: "San Francisco, CA",
    description: "Fast way to build internal tools. Drag and drop building blocks and connect to any database.",
  },
  {
    name: "Brex",
    domain: "brex.com",
    batch: "YC W17",
    atsType: "greenhouse",
    boardId: "brex",
    logoUrl: "https://logo.clearbit.com/brex.com",
    foundedYear: 2017,
    companySize: "1,200+ employees",
    founders: [{ name: "Henrique Dubugras", role: "Co-CEO" }, { name: "Pedro Franceschi", role: "Co-CEO" }],
    techStack: ["Elixir", "Kotlin", "React", "TypeScript", "Kubernetes"],
    primaryCity: "San Francisco, CA",
    description: "Corporate cards and spend management software built specifically for high-growth tech startups.",
  },
  {
    name: "Deel",
    domain: "deel.com",
    batch: "YC S19",
    atsType: "greenhouse",
    boardId: "deel",
    logoUrl: "https://logo.clearbit.com/deel.com",
    foundedYear: 2019,
    companySize: "3,500+ employees",
    founders: [{ name: "Alex Bouaziz", role: "CEO" }, { name: "Shuo Wang", role: "Chief Revenue Officer" }],
    techStack: ["Node.js", "React", "PostgreSQL", "TypeScript", "AWS"],
    primaryCity: "San Francisco, CA",
    description: "Global payroll and compliance platform helping companies hire anyone, anywhere in minutes.",
  },
  {
    name: "Scale AI",
    domain: "scale.com",
    batch: "YC S16",
    atsType: "greenhouse",
    boardId: "scaleai",
    logoUrl: "https://logo.clearbit.com/scale.com",
    foundedYear: 2016,
    companySize: "1,000+ employees",
    founders: [{ name: "Alexandr Wang", role: "CEO" }],
    techStack: ["Python", "PyTorch", "React", "Node.js", "MongoDB"],
    primaryCity: "San Francisco, CA",
    description: "Data infrastructure foundation for AI. Powering LLM fine-tuning, RLHF, and computer vision.",
  },
  {
    name: "Vercel",
    domain: "vercel.com",
    batch: "YC W15",
    atsType: "greenhouse",
    boardId: "vercel",
    logoUrl: "https://logo.clearbit.com/vercel.com",
    foundedYear: 2015,
    companySize: "600+ employees",
    founders: [{ name: "Guillermo Rauch", role: "CEO" }],
    techStack: ["Next.js", "React", "Turborepo", "Rust", "Go", "AWS"],
    primaryCity: "San Francisco, CA",
    description: "Frontend cloud platform for modern web frameworks and edge serverless infrastructure.",
  },
  {
    name: "GitLab",
    domain: "gitlab.com",
    batch: "YC W15",
    atsType: "greenhouse",
    boardId: "gitlab",
    logoUrl: "https://logo.clearbit.com/gitlab.com",
    foundedYear: 2014,
    companySize: "2,000+ employees",
    founders: [{ name: "Sid Sijbrandij", role: "Co-Founder" }, { name: "Dmitriy Zaporozhets", role: "Co-Founder" }],
    techStack: ["Ruby on Rails", "Vue.js", "Go", "PostgreSQL", "Kubernetes"],
    primaryCity: "Remote",
    description: "The complete DevSecOps platform delivered as a single application for software teams.",
  },
  {
    name: "Zapier",
    domain: "zapier.com",
    batch: "YC S12",
    atsType: "greenhouse",
    boardId: "zapier",
    logoUrl: "https://logo.clearbit.com/zapier.com",
    foundedYear: 2011,
    companySize: "800+ employees",
    founders: [{ name: "Wade Foster", role: "CEO" }, { name: "Bryan Helmig", role: "CTO" }],
    techStack: ["Python", "Django", "React", "AWS", "MySQL"],
    primaryCity: "Remote",
    description: "Workflow automation tool connecting over 6,000+ business applications seamlessly.",
  },
  {
    name: "Modal",
    domain: "modal.com",
    batch: "YC S21",
    atsType: "ashby",
    boardId: "modal",
    logoUrl: "https://logo.clearbit.com/modal.com",
    foundedYear: 2021,
    companySize: "30+ employees",
    founders: [{ name: "Erik Bernhardsson", role: "CEO" }],
    techStack: ["Python", "Rust", "Linux Containers", "GPU Infrastructure", "CUDA"],
    primaryCity: "New York, NY",
    description: "Serverless cloud compute for AI, generative models, batch jobs, and GPU workloads in Python.",
  },
  {
    name: "Razorpay",
    domain: "razorpay.com",
    batch: "YC W15",
    atsType: "smartrecruiters",
    boardId: "razorpay",
    logoUrl: "https://logo.clearbit.com/razorpay.com",
    foundedYear: 2014,
    companySize: "3,000+ employees",
    founders: [{ name: "Harshil Mathur", role: "CEO" }, { name: "Shashank Kumar", role: "Managing Director" }],
    techStack: ["PHP", "Go", "React", "MySQL", "AWS"],
    primaryCity: "Bengaluru",
    description: "India's leading full-stack financial services and payments platform for enterprises and startups.",
  },
  {
    name: "Zepto",
    domain: "zeptonow.com",
    batch: "YC W21",
    atsType: "lever",
    boardId: "zepto",
    logoUrl: "https://logo.clearbit.com/zeptonow.com",
    foundedYear: 2021,
    companySize: "1,500+ employees",
    founders: [{ name: "Aadit Palicha", role: "CEO" }, { name: "Kaivalya Vohra", role: "CTO" }],
    techStack: ["Java", "Python", "React Native", "PostgreSQL", "Kafka"],
    primaryCity: "Bengaluru",
    description: "Instant 10-minute grocery delivery hyper-growth unicorn operating across top Indian metropolitans.",
  },
];

export async function scrapeAndSyncYCCompanies() {
  console.log("===================================================================");
  console.log("🟠 Scraping Live ATS Portals from Top Y Combinator (YC) Companies");
  console.log("===================================================================");

  let totalJobsFound = 0;
  let companiesSynced = 0;

  for (const target of YC_PORTFOLIO_STARTUPS) {
    try {
      console.log(`\n🔍 Scraping ${target.name} [${target.batch || "YC"}] via ${target.atsType} (${target.boardId})...`);
      let result = null;

      if (target.atsType === "greenhouse") {
        result = await scrapeGreenhouseBoard(target.name, target.boardId, target.domain, target.logoUrl);
      } else if (target.atsType === "lever") {
        result = await scrapeLeverBoard(target.name, target.boardId, target.domain, target.logoUrl);
      } else if (target.atsType === "ashby") {
        result = await scrapeAshbyBoard(target.name, target.boardId, target.domain, target.logoUrl);
      } else if (target.atsType === "smartrecruiters") {
        result = await scrapeSmartRecruitersBoard(target.name, target.boardId, target.domain, target.logoUrl);
      }

      if (!result || !result.jobs || result.jobs.length === 0) {
        console.log(`  ⚠️ No active roles returned for ${target.name} right now.`);
        continue;
      }

      console.log(`  ✅ Extracted ${result.jobs.length} verified live jobs with direct ATS apply URLs!`);

      // 1. Upsert Company in Database
      const existing = await db
        .select({ id: companies.id })
        .from(companies)
        .where(eq(companies.name, target.name))
        .limit(1);

      let companyId: string;
      if (existing.length > 0) {
        companyId = existing[0].id;
        await db
          .update(companies)
          .set({
            website_url: `https://${target.domain}`,
            logo_url: target.logoUrl || result.logoUrl,
            description: target.description || result.description,
            location_text: target.primaryCity || result.primaryLocation.city,
            latitude: result.primaryLocation.lat,
            longitude: result.primaryLocation.lng,
            founded_year: target.foundedYear,
            company_size: target.companySize,
            founders_json: target.founders ? JSON.stringify(target.founders) : undefined,
            tech_stack_json: target.techStack ? JSON.stringify(target.techStack) : undefined,
            status: "verified",
            updated_at: new Date(),
          })
          .where(eq(companies.id, companyId));
      } else {
        companyId = crypto.randomUUID();
        await db.insert(companies).values({
          id: companyId,
          name: target.name,
          website_url: `https://${target.domain}`,
          logo_url: target.logoUrl || result.logoUrl,
          description: target.description || result.description,
          location_text: target.primaryCity || result.primaryLocation.city,
          latitude: result.primaryLocation.lat,
          longitude: result.primaryLocation.lng,
          founded_year: target.foundedYear,
          company_size: target.companySize,
          founders_json: target.founders ? JSON.stringify(target.founders) : null,
          tech_stack_json: target.techStack ? JSON.stringify(target.techStack) : null,
          status: "verified",
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      // 2. Clear old jobs and insert fresh active roles with direct apply URLs
      await db.delete(jobs).where(eq(jobs.company_id, companyId));

      for (const j of result.jobs) {
        await db.insert(jobs).values({
          id: crypto.randomUUID(),
          company_id: companyId,
          title: j.title,
          description: j.description || `${j.title} at ${target.name}`,
          location_text: j.location || target.primaryCity || "San Francisco, CA",
          latitude: j.lat,
          longitude: j.lng,
          salary_range: j.salaryMin && j.salaryMax ? `$${j.salaryMin / 1000}k - $${j.salaryMax / 1000}k` : null,
          apply_url: j.applyUrl,
          is_active: true,
          posted_at: j.postedAt || new Date(),
          first_seen_at: new Date(),
          last_seen_at: new Date(),
        });
        totalJobsFound++;
      }

      companiesSynced++;
    } catch (err: any) {
      console.error(`  ❌ Failed to sync ${target.name}:`, err?.message || err);
    }
  }

  console.log("\n===================================================================");
  console.log(`🎉 Successfully Synced ${companiesSynced} YC Companies with ${totalJobsFound} Live Direct ATS Roles!`);
  console.log("===================================================================");
}

// Auto-run when executed directly via tsx
if (require.main === module) {
  scrapeAndSyncYCCompanies()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("YC Scraper error:", err);
      process.exit(1);
    });
}
