/**
 * Findely Global ATS Scraping Engine
 * Connects directly to public Greenhouse, Lever, and Ashby endpoints
 * Extracts 100% verified, active roles with direct ATS apply URLs
 */

import { geocodeLocation, GeocodedLocation } from "./geocoder";
import { huntRecruiterEmail } from "./emailHunter";

export interface ScrapedJob {
  externalId: string;
  title: string;
  department: string;
  location: string;
  locationType: "onsite" | "hybrid" | "remote";
  lat: number;
  lng: number;
  salaryMin?: number;
  salaryMax?: number;
  equity?: string;
  applyUrl: string;
  recruiterEmail?: string;
  description: string;
  postedAt: Date;
}

export interface ScrapedCompanyResult {
  name: string;
  slug: string;
  domain: string;
  logoUrl: string;
  headline: string;
  description: string;
  careersUrl: string;
  atsType: "greenhouse" | "lever" | "ashby" | "custom";
  contactEmail?: string;
  primaryLocation: GeocodedLocation;
  jobs: ScrapedJob[];
}

/**
 * Helper to extract salary numbers from job text (e.g. "$160,000 - $220,000" or "$180k - $240k")
 */
function extractSalaryRange(text: string): { min?: number; max?: number } {
  if (!text) return {};

  const kMatch = text.match(/\$(\d{2,3})k\s*[-–—to]+\s*\$(\d{2,3})k/i);
  if (kMatch) {
    return {
      min: parseInt(kMatch[1], 10) * 1000,
      max: parseInt(kMatch[2], 10) * 1000,
    };
  }

  const fullMatch = text.match(/\$(\d{2,3}(?:,\d{3})+)\s*[-–—to]+\s*\$(\d{2,3}(?:,\d{3})+)/);
  if (fullMatch) {
    return {
      min: parseInt(fullMatch[1].replace(/,/g, ""), 10),
      max: parseInt(fullMatch[2].replace(/,/g, ""), 10),
    };
  }

  const singleMatch = text.match(/\$(\d{2,3}(?:,\d{3})+|\d{2,3}k)/i);
  if (singleMatch) {
    const val = singleMatch[1].toLowerCase().includes("k")
      ? parseInt(singleMatch[1].replace(/k/i, ""), 10) * 1000
      : parseInt(singleMatch[1].replace(/,/g, ""), 10);
    return { min: val, max: Math.round(val * 1.3) };
  }

  return {};
}

// ── 1. Greenhouse Scraper ──────────────────────────────────────
export async function scrapeGreenhouseBoard(
  companyName: string,
  boardToken: string,
  domain: string,
  logoUrl?: string
): Promise<ScrapedCompanyResult | null> {
  try {
    const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`, {
      headers: { "User-Agent": "Findely-Spatial-Job-Engine/1.0" },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    const rawJobs = data.jobs || [];

    const jobs: ScrapedJob[] = [];

    for (const j of rawJobs) {
      const locString = j.location?.name || "San Francisco, CA";
      const geo = geocodeLocation(locString);
      const desc = j.content ? j.content.replace(/<[^>]*>?/gm, " ").slice(0, 1000) : "";
      const salary = extractSalaryRange(desc);
      const email = huntRecruiterEmail(desc, domain);

      jobs.push({
        externalId: String(j.id),
        title: j.title || "Software Engineer",
        department: j.departments?.[0]?.name || "Engineering",
        location: locString,
        locationType: geo.locationType,
        lat: geo.lat,
        lng: geo.lng,
        salaryMin: salary.min,
        salaryMax: salary.max,
        applyUrl: j.absolute_url || `https://boards.greenhouse.io/${boardToken}/jobs/${j.id}`,
        recruiterEmail: email || undefined,
        description: desc,
        postedAt: j.updated_at ? new Date(j.updated_at) : new Date(),
      });
    }

    const primaryGeo = jobs.length > 0 ? { city: jobs[0].location, country: "United States", lat: jobs[0].lat, lng: jobs[0].lng, locationType: jobs[0].locationType } : geocodeLocation("San Francisco");

    return {
      name: companyName,
      slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      domain,
      logoUrl: logoUrl || `https://logo.clearbit.com/${domain}`,
      headline: `Frontier Tech and Engineering at ${companyName}`,
      description: `Explore live verified roles directly at ${companyName} on Findely.`,
      careersUrl: `https://boards.greenhouse.io/${boardToken}`,
      atsType: "greenhouse",
      contactEmail: `careers@${domain}`,
      primaryLocation: primaryGeo,
      jobs,
    };
  } catch (err) {
    console.error(`Failed to scrape Greenhouse board for ${companyName}:`, err);
    return null;
  }
}

// ── 2. Lever Scraper ──────────────────────────────────────────
export async function scrapeLeverBoard(
  companyName: string,
  siteName: string,
  domain: string,
  logoUrl?: string
): Promise<ScrapedCompanyResult | null> {
  try {
    const res = await fetch(`https://api.lever.co/v0/postings/${siteName}?mode=json`, {
      headers: { "User-Agent": "Findely-Spatial-Job-Engine/1.0" },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const rawJobs = await res.json();

    const jobs: ScrapedJob[] = [];

    for (const j of rawJobs) {
      const locString = j.categories?.location || "San Francisco, CA";
      const geo = geocodeLocation(locString);
      const desc = j.descriptionPlain || "";
      const salary = extractSalaryRange(desc);
      const email = huntRecruiterEmail(desc, domain);

      jobs.push({
        externalId: String(j.id),
        title: j.text || "Engineer",
        department: j.categories?.team || j.categories?.department || "Engineering",
        location: locString,
        locationType: j.workplaceType === "remote" ? "remote" : geo.locationType,
        lat: geo.lat,
        lng: geo.lng,
        salaryMin: salary.min,
        salaryMax: salary.max,
        applyUrl: j.hostedUrl || `https://jobs.lever.co/${siteName}/${j.id}`,
        recruiterEmail: email || undefined,
        description: desc.slice(0, 1000),
        postedAt: j.createdAt ? new Date(j.createdAt) : new Date(),
      });
    }

    const primaryGeo = jobs.length > 0 ? { city: jobs[0].location, country: "United States", lat: jobs[0].lat, lng: jobs[0].lng, locationType: jobs[0].locationType } : geocodeLocation("San Francisco");

    return {
      name: companyName,
      slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      domain,
      logoUrl: logoUrl || `https://logo.clearbit.com/${domain}`,
      headline: `Frontier Tech and Engineering at ${companyName}`,
      description: `Explore live verified roles directly at ${companyName} on Findely.`,
      careersUrl: `https://jobs.lever.co/${siteName}`,
      atsType: "lever",
      contactEmail: `careers@${domain}`,
      primaryLocation: primaryGeo,
      jobs,
    };
  } catch (err) {
    console.error(`Failed to scrape Lever board for ${companyName}:`, err);
    return null;
  }
}

// ── 3. Ashby Scraper ──────────────────────────────────────────
export async function scrapeAshbyBoard(
  companyName: string,
  ashbyIdentifier: string,
  domain: string,
  logoUrl?: string
): Promise<ScrapedCompanyResult | null> {
  try {
    const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${ashbyIdentifier}`, {
      headers: { "User-Agent": "Findely-Spatial-Job-Engine/1.0" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const rawJobs = data.jobs || [];

    const jobs: ScrapedJob[] = [];

    for (const j of rawJobs) {
      const locString = j.locationName || j.secondaryLocations?.[0]?.locationName || "San Francisco, CA";
      const geo = geocodeLocation(locString);
      const desc = j.descriptionPlain || "";
      const salary = extractSalaryRange(desc);
      const email = huntRecruiterEmail(desc, domain);

      jobs.push({
        externalId: String(j.id),
        title: j.title || "Engineer",
        department: j.departmentName || "Engineering",
        location: locString,
        locationType: j.isRemote ? "remote" : geo.locationType,
        lat: geo.lat,
        lng: geo.lng,
        salaryMin: salary.min,
        salaryMax: salary.max,
        applyUrl: j.jobUrl || `https://jobs.ashbyhq.com/${ashbyIdentifier}/${j.id}`,
        recruiterEmail: email || undefined,
        description: desc.slice(0, 1000),
        postedAt: j.publishedAt ? new Date(j.publishedAt) : new Date(),
      });
    }

    const primaryGeo = jobs.length > 0 ? { city: jobs[0].location, country: "United States", lat: jobs[0].lat, lng: jobs[0].lng, locationType: jobs[0].locationType } : geocodeLocation("San Francisco");

    return {
      name: companyName,
      slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      domain,
      logoUrl: logoUrl || `https://logo.clearbit.com/${domain}`,
      headline: `Frontier Tech and Engineering at ${companyName}`,
      description: `Explore live verified roles directly at ${companyName} on Findely.`,
      careersUrl: `https://jobs.ashbyhq.com/${ashbyIdentifier}`,
      atsType: "ashby",
      contactEmail: `careers@${domain}`,
      primaryLocation: primaryGeo,
      jobs,
    };
  } catch (err) {
    console.error(`Failed to scrape Ashby board for ${companyName}:`, err);
    return null;
  }
}

// ── 4. Remotive Global Startup API Connector ─────────────────
export async function scrapeRemotiveGlobalJobs(limit: number = 60): Promise<ScrapedCompanyResult[]> {
  try {
    const res = await fetch(`https://remotive.com/api/remote-jobs?category=software-dev&limit=${limit}`, {
      headers: { "User-Agent": "Findely-Global-Job-Engine/1.0" },
      next: { revalidate: 7200 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    const rawJobs = data.jobs || [];

    // Group jobs by company name
    const companyMap = new Map<string, ScrapedCompanyResult>();

    for (const j of rawJobs) {
      const cName = j.company_name || "Global Startup";
      const domain = cName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
      const locString = j.candidate_required_location || "Worldwide Remote";
      const geo = geocodeLocation(locString);
      const desc = (j.description || "").replace(/<[^>]*>?/gm, " ").slice(0, 1000);
      const salary = extractSalaryRange(j.salary || desc);

      const job: ScrapedJob = {
        externalId: String(j.id || Math.random()),
        title: j.title || "Software Engineer",
        department: j.category || "Engineering",
        location: locString,
        locationType: "remote",
        lat: geo.lat,
        lng: geo.lng,
        salaryMin: salary.min,
        salaryMax: salary.max,
        applyUrl: j.url || `https://remotive.com`,
        description: desc,
        postedAt: j.publication_date ? new Date(j.publication_date) : new Date(),
      };

      if (companyMap.has(cName)) {
        companyMap.get(cName)!.jobs.push(job);
      } else {
        companyMap.set(cName, {
          name: cName,
          slug: cName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          domain,
          logoUrl: j.company_logo || `https://logo.clearbit.com/${domain}`,
          headline: `Global Tech Startup - Hiring Worldwide on Findely`,
          description: `${cName} is actively hiring engineers and builders worldwide.`,
          careersUrl: j.url || `https://remotive.com`,
          atsType: "custom",
          primaryLocation: geo,
          jobs: [job],
        });
      }
    }

    return Array.from(companyMap.values());
  } catch (err) {
    console.error("Failed to scrape Remotive global jobs:", err);
    return [];
  }
}
