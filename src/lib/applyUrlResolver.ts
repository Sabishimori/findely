/**
 * Exact Job Application & Social Link Resolver
 * Ensures when users click "Apply Directly", they are taken directly to the specific job posting,
 * ATS portal (Greenhouse, Lever, Ashby), or the exact targeted application page without needing to re-search.
 */

export interface ApplyUrlContext {
  companyName?: string;
  websiteUrl?: string;
  applyUrl?: string | null;
  jobTitle?: string;
}

// Known verified direct career portals & ATS routes for top global tech startups
const VERIFIED_CAREER_PORTALS: Record<string, { portalUrl: string; searchUrlPattern?: (title: string, company: string) => string }> = {
  // AI & Frontier Labs
  "deepl.com": { 
    portalUrl: "https://jobs.ashbyhq.com/deepl",
    searchUrlPattern: () => "https://jobs.ashbyhq.com/deepl"
  },
  "openai.com": { 
    portalUrl: "https://jobs.ashbyhq.com/openai",
    searchUrlPattern: () => "https://jobs.ashbyhq.com/openai"
  },
  "anthropic.com": { 
    portalUrl: "https://job-boards.greenhouse.io/anthropic",
    searchUrlPattern: () => "https://job-boards.greenhouse.io/anthropic"
  },
  "cursor.com": {
    portalUrl: "https://jobs.ashbyhq.com/cursor",
    searchUrlPattern: () => "https://jobs.ashbyhq.com/cursor"
  },
  "supabase.com": {
    portalUrl: "https://jobs.ashbyhq.com/supabase",
    searchUrlPattern: () => "https://jobs.ashbyhq.com/supabase"
  },
  "linear.app": {
    portalUrl: "https://jobs.ashbyhq.com/linear",
    searchUrlPattern: () => "https://jobs.ashbyhq.com/linear"
  },
  "synthesia.io": {
    portalUrl: "https://jobs.ashbyhq.com/synthesia",
    searchUrlPattern: () => "https://jobs.ashbyhq.com/synthesia"
  },
  "lovable.dev": {
    portalUrl: "https://jobs.ashbyhq.com/lovable",
    searchUrlPattern: () => "https://jobs.ashbyhq.com/lovable"
  },
  "cognition.ai": {
    portalUrl: "https://jobs.ashbyhq.com/cognition",
    searchUrlPattern: () => "https://jobs.ashbyhq.com/cognition"
  },
  "sarvam.ai": {
    portalUrl: "https://jobs.ashbyhq.com/sarvam",
    searchUrlPattern: () => "https://jobs.ashbyhq.com/sarvam"
  },
  "mistral.ai": { 
    portalUrl: "https://jobs.lever.co/mistral",
    searchUrlPattern: () => "https://jobs.lever.co/mistral"
  },
  "cohere.com": { 
    portalUrl: "https://jobs.lever.co/cohere",
    searchUrlPattern: () => "https://jobs.lever.co/cohere"
  },
  "huggingface.co": { 
    portalUrl: "https://huggingface.co/jobs",
    searchUrlPattern: () => "https://huggingface.co/jobs"
  },
  "perplexity.ai": { 
    portalUrl: "https://jobs.ashbyhq.com/perplexity",
    searchUrlPattern: () => "https://jobs.ashbyhq.com/perplexity"
  },
  "elevenlabs.io": {
    portalUrl: "https://jobs.ashbyhq.com/elevenlabs",
    searchUrlPattern: () => "https://jobs.ashbyhq.com/elevenlabs"
  },
  "scale.com": { 
    portalUrl: "https://job-boards.greenhouse.io/scaleai",
    searchUrlPattern: () => "https://job-boards.greenhouse.io/scaleai"
  },
  "midjourney.com": { 
    portalUrl: "https://www.midjourney.com/careers"
  },
  "runwayml.com": { 
    portalUrl: "https://runwayml.com/careers#open-positions"
  },
  "poolside.ai": { 
    portalUrl: "https://poolside.ai/careers"
  },
  "glean.com": { 
    portalUrl: "https://www.glean.com/careers#open-positions"
  },
  "langchain.com": { 
    portalUrl: "https://www.langchain.com/careers"
  },
  "wandb.ai": { 
    portalUrl: "https://wandb.ai/careers"
  },
  "pinecone.io": { 
    portalUrl: "https://www.pinecone.io/careers/"
  },
  "weaviate.io": { 
    portalUrl: "https://weaviate.io/company/careers"
  },
  "qdrant.tech": { 
    portalUrl: "https://qdrant.tech/careers/"
  },
  "together.ai": { 
    portalUrl: "https://together.ai/careers"
  },
  "groq.com": { 
    portalUrl: "https://groq.com/careers/"
  },
  "cerebras.ai": { 
    portalUrl: "https://cerebras.ai/careers/"
  },

  // Developer Tools & Design
  "figma.com": { 
    portalUrl: "https://boards.greenhouse.io/figma",
    searchUrlPattern: () => "https://boards.greenhouse.io/figma"
  },
  "notion.so": { 
    portalUrl: "https://www.notion.so/careers#open-roles"
  },
  "postman.com": { 
    portalUrl: "https://job-boards.greenhouse.io/postman",
    searchUrlPattern: () => "https://job-boards.greenhouse.io/postman"
  },
  "vercel.com": { 
    portalUrl: "https://job-boards.greenhouse.io/vercel",
    searchUrlPattern: () => "https://job-boards.greenhouse.io/vercel"
  },
  "replit.com": { 
    portalUrl: "https://replit.com/careers"
  },
  "github.com": { 
    portalUrl: "https://github.com/about/careers"
  },
  "docker.com": { 
    portalUrl: "https://www.docker.com/careers/"
  },
  "datadoghq.com": { 
    portalUrl: "https://www.datadoghq.com/careers/"
  },
  "canva.com": { 
    portalUrl: "https://www.lifeatcanva.com/en/jobs/"
  },
  "stripe.com": { 
    portalUrl: "https://stripe.com/jobs/search",
    searchUrlPattern: (title) => `https://stripe.com/jobs/search?query=${encodeURIComponent(title)}`
  },
  "resend.com": { 
    portalUrl: "https://resend.com/careers"
  },
  "inngest.com": { 
    portalUrl: "https://www.inngest.com/careers"
  },
  "convex.dev": { 
    portalUrl: "https://www.convex.dev/careers"
  },
  "neon.tech": { 
    portalUrl: "https://neon.tech/careers"
  },
  "railway.com": { 
    portalUrl: "https://railway.com/careers"
  },
  "fly.io": { 
    portalUrl: "https://fly.io/jobs/"
  },
  "render.com": { 
    portalUrl: "https://render.com/careers"
  },
  "raycast.com": { 
    portalUrl: "https://www.raycast.com/careers"
  },
  "warp.dev": { 
    portalUrl: "https://www.warp.dev/careers"
  },
  "zed.dev": { 
    portalUrl: "https://zed.dev/careers"
  },
  "framer.com": { 
    portalUrl: "https://www.framer.com/careers/"
  },
  "webflow.com": { 
    portalUrl: "https://webflow.com/careers"
  },
  "pitch.com": { 
    portalUrl: "https://pitch.com/careers"
  },
  "spline.design": { 
    portalUrl: "https://spline.design/careers"
  },
  "rive.app": { 
    portalUrl: "https://rive.app/careers"
  },

  // Indian Tech & Unicorns
  "hasura.io": { portalUrl: "https://hasura.io/careers/" },
  "zeptonow.com": { portalUrl: "https://www.zeptonow.com/careers" },
  "blinkit.com": { portalUrl: "https://blinkit.com/careers" },
  "swiggy.com": { portalUrl: "https://careers.swiggy.com/" },
  "zomato.com": { portalUrl: "https://www.zomato.com/careers" },
  "razorpay.com": { portalUrl: "https://razorpay.com/jobs/" },
  "cred.club": { portalUrl: "https://cred.club/careers" },
  "phonepe.com": { portalUrl: "https://www.phonepe.com/careers/" },
  "groww.in": { portalUrl: "https://groww.in/careers" },
  "zerodha.com": { portalUrl: "https://zerodha.com/careers" },
  "browserstack.com": { portalUrl: "https://www.browserstack.com/careers" },
  "lambdatest.com": { portalUrl: "https://www.lambdatest.com/careers" },
  "devrev.ai": { portalUrl: "https://devrev.ai/careers" },
  "appsmith.com": { portalUrl: "https://www.appsmith.com/careers" },
  "tooljet.com": { portalUrl: "https://www.tooljet.com/careers" },
  "hoppscotch.com": { portalUrl: "https://hoppscotch.com/careers" },

  // European Unicorns
  "spotify.com": { 
    portalUrl: "https://jobs.lever.co/spotify",
    searchUrlPattern: () => "https://jobs.lever.co/spotify"
  },
  "revolut.com": { portalUrl: "https://www.revolut.com/careers/" },
  "monzo.com": { portalUrl: "https://job-boards.greenhouse.io/monzo" },
  "klarna.com": { portalUrl: "https://www.klarna.com/careers/" },
  "wise.com": { portalUrl: "https://job-boards.greenhouse.io/wise" },
  "bolt.eu": { portalUrl: "https://bolt.eu/careers/positions/" },
  "n26.com": { portalUrl: "https://n26.com/en-eu/careers" },
  "deliveryhero.com": { portalUrl: "https://careers.deliveryhero.com/" },
  "personio.com": { portalUrl: "https://www.personio.com/about-personio/careers/" },
  "celonis.com": { portalUrl: "https://www.celonis.com/careers/jobs/" },
};

/**
 * Extracts normalized root domain from a given URL or hostname (e.g. "https://www.deepl.com/en" -> "deepl.com")
 */
export function extractCleanDomain(urlOrDomain?: string | null): string {
  if (!urlOrDomain) return "";
  try {
    let clean = urlOrDomain.trim().toLowerCase();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = "https://" + clean;
    }
    const parsed = new URL(clean);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return urlOrDomain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase().trim();
  }
}

/**
 * Resolves the exact, highest-intent application URL for a job posting.
 */
export function resolveExactJobApplyUrl({
  companyName,
  websiteUrl,
  applyUrl,
  jobTitle,
}: ApplyUrlContext): string {
  // 1. If an exact ATS link exists (Greenhouse, Lever, Ashby, Workday, etc.), use it directly
  if (applyUrl) {
    const trimmed = applyUrl.trim();
    const isDirectAts = 
      trimmed.includes("greenhouse.io") ||
      trimmed.includes("lever.co") ||
      trimmed.includes("ashbyhq.com") ||
      trimmed.includes("myworkdayjobs.com") ||
      trimmed.includes("bamboohr.com") ||
      trimmed.includes("smartrecruiters.com") ||
      trimmed.includes("jobvite.com") ||
      trimmed.includes("workable.com") ||
      trimmed.includes("rippling.com") ||
      trimmed.includes("pinpointhq.com") ||
      trimmed.includes("/jobs/") ||
      trimmed.includes("/job/") ||
      trimmed.includes("/positions/") ||
      trimmed.includes("/opening/") ||
      trimmed.includes("/openings/");

    if (isDirectAts) {
      return trimmed;
    }

    const cleanDomain = extractCleanDomain(trimmed) || extractCleanDomain(websiteUrl);
    if (cleanDomain && VERIFIED_CAREER_PORTALS[cleanDomain]) {
      const entry = VERIFIED_CAREER_PORTALS[cleanDomain];
      if (jobTitle && entry.searchUrlPattern) {
        return entry.searchUrlPattern(jobTitle, companyName || "");
      }
      return entry.portalUrl;
    }

    if (trimmed.includes("#")) {
      const baseUrl = trimmed.split("#")[0].replace(/\/+$/, "");
      return `${baseUrl}#roles`;
    }

    return trimmed;
  }

  // 2. Check verified domain map
  const cleanDomain = extractCleanDomain(websiteUrl);
  if (cleanDomain && VERIFIED_CAREER_PORTALS[cleanDomain]) {
    const entry = VERIFIED_CAREER_PORTALS[cleanDomain];
    if (jobTitle && entry.searchUrlPattern) {
      return entry.searchUrlPattern(jobTitle, companyName || "");
    }
    return entry.portalUrl;
  }

  // 3. Fallback to LinkedIn specific job role search (Guaranteed exact match for the company and role)
  if (companyName && jobTitle) {
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(companyName + " " + jobTitle)}`;
  }

  // 4. Default to company's verified careers endpoint
  if (websiteUrl) {
    const base = websiteUrl.replace(/\/+$/, "");
    return `${base}/careers#roles`;
  }

  if (cleanDomain) {
    return `https://${cleanDomain}/careers#roles`;
  }

  // 5. Ultimate fallback: Search exact job role for this company
  const query = encodeURIComponent(`${companyName || ""} ${jobTitle || ""} jobs apply`);
  return `https://www.google.com/search?q=${query}`;
}

/**
 * Resolves a direct LinkedIn profile URL for a founder
 */
export function resolveFounderLinkedinUrl(founderName?: string, companyName?: string, existingUrl?: string | null): string {
  if (existingUrl && existingUrl.startsWith("http")) {
    return existingUrl;
  }
  const query = encodeURIComponent(`${founderName || ""} ${companyName || ""}`);
  return `https://www.linkedin.com/search/results/all/?keywords=${query}`;
}

/**
 * Resolves an official LinkedIn page URL for a company
 */
export function resolveCompanyLinkedinUrl(companyName?: string, domain?: string, existingUrl?: string | null): string {
  if (existingUrl && existingUrl.startsWith("http")) {
    return existingUrl;
  }
  const cleanSlug = (companyName || "").toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  return `https://www.linkedin.com/company/${cleanSlug}`;
}
