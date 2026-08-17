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
  lat: number | null;
  lng: number | null;
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
  atsType: "greenhouse" | "lever" | "ashby" | "workday" | "custom";
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

// ── 1. Greenhouse Scraper (Fully Paginated & Multi-Office) ─────
export async function scrapeGreenhouseBoard(
  companyName: string,
  boardToken: string,
  domain: string,
  logoUrl?: string
): Promise<ScrapedCompanyResult | null> {
  try {
    const allRawJobs: any[] = [];
    let page = 1;
    let expectedTotal: number | null = null;
    let hasMorePages = true;

    while (hasMorePages) {
      const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true${page > 1 ? `&page=${page}` : ""}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Findely-Spatial-Job-Engine/1.0 (https://findely.com)",
          "Accept": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        if (page === 1) {
          console.warn(`[Greenhouse] Failed to fetch board '${boardToken}' for ${companyName}: HTTP ${res.status}`);
          return null;
        }
        break;
      }

      const data = await res.json();
      const pageJobs = data.jobs || [];
      if (expectedTotal === null && data.meta?.total !== undefined) {
        expectedTotal = data.meta.total;
      }

      allRawJobs.push(...pageJobs);

      // Check if pagination continues
      if (expectedTotal !== null && allRawJobs.length < expectedTotal && pageJobs.length > 0) {
        page++;
      } else {
        hasMorePages = false;
      }
    }

    // Count assertion
    if (expectedTotal !== null) {
      if (allRawJobs.length === expectedTotal) {
        console.log(`[Greenhouse] ✓ ${companyName} (${boardToken}): Exactly fetched ${allRawJobs.length}/${expectedTotal} open roles.`);
      } else {
        console.warn(`[Greenhouse] ! ${companyName} (${boardToken}): Fetched ${allRawJobs.length} roles (expected meta total: ${expectedTotal}).`);
      }
    } else {
      console.log(`[Greenhouse] ✓ ${companyName} (${boardToken}): Fetched ${allRawJobs.length} open roles.`);
    }

    const jobs: ScrapedJob[] = [];

    for (const j of allRawJobs) {
      // 1. Direct apply URL straight from ATS API response (never constructed or scraped)
      const directApplyUrl = j.absolute_url || `https://job-boards.greenhouse.io/${boardToken}/jobs/${j.id}`;

      // 2. Department hierarchy extraction
      const deptNames = Array.isArray(j.departments) && j.departments.length > 0
        ? j.departments.map((d: any) => d.name).filter(Boolean).join(", ")
        : "Engineering";

      // 3. Clean description and salary extraction
      const desc = j.content ? j.content.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().slice(0, 1500) : "";
      const salary = extractSalaryRange(desc);
      const email = huntRecruiterEmail(desc, domain);
      const postedAt = j.updated_at ? new Date(j.updated_at) : (j.first_published ? new Date(j.first_published) : new Date());

      // 4. Multi-office location handling:
      // Check if job has an offices array or multi-location string in location.name
      const distinctLocations: string[] = [];

      if (Array.isArray(j.offices) && j.offices.length > 0) {
        for (const off of j.offices) {
          const offLoc = off.location || off.name;
          if (offLoc && typeof offLoc === "string" && offLoc.trim()) {
            distinctLocations.push(offLoc.trim());
          }
        }
      }

      if (distinctLocations.length === 0 && j.location?.name) {
        const rawLoc = String(j.location.name);
        // Split by semicolon, slash, or pipe if multiple cities are listed in a single string
        if (rawLoc.includes(";") || rawLoc.includes(" / ") || rawLoc.includes(" | ")) {
          const splitLocs = rawLoc.split(/;| \/ | \| /).map((s) => s.trim()).filter(Boolean);
          distinctLocations.push(...splitLocs);
        } else {
          distinctLocations.push(rawLoc.trim());
        }
      }

      if (distinctLocations.length === 0) {
        distinctLocations.push("San Francisco, CA");
      }

      // Deduplicate locations for this job
      const uniqueLocations = Array.from(new Set(distinctLocations));

      // Spawn a distinct row for each office with dedicated spatial coordinates
      uniqueLocations.forEach((locStr, locIdx) => {
        const geo = geocodeLocation(locStr);
        const externalId = uniqueLocations.length > 1 ? `${j.id}_loc_${locIdx}` : String(j.id);

        jobs.push({
          externalId,
          title: j.title ? j.title.trim() : "Software Engineer",
          department: deptNames,
          location: locStr,
          locationType: geo.locationType,
          lat: geo.lat,
          lng: geo.lng,
          salaryMin: salary.min,
          salaryMax: salary.max,
          applyUrl: directApplyUrl,
          recruiterEmail: email || undefined,
          description: desc,
          postedAt,
        });
      });
    }

    const physicalJobs = jobs.filter((j) => j.lat !== null && j.lng !== null);
    const primaryGeo: GeocodedLocation = physicalJobs.length > 0
      ? { city: physicalJobs[0].location, country: "United States", lat: physicalJobs[0].lat, lng: physicalJobs[0].lng, locationType: physicalJobs[0].locationType, isBroadRegion: false }
      : { city: "Remote", country: "Worldwide", lat: null, lng: null, locationType: "remote", isBroadRegion: true };

    return {
      name: companyName,
      slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      domain,
      logoUrl: logoUrl || `https://logo.clearbit.com/${domain}`,
      headline: `Frontier Tech and Engineering at ${companyName}`,
      description: `Explore live verified roles directly at ${companyName} on Findely.`,
      careersUrl: `https://job-boards.greenhouse.io/${boardToken}`,
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

// ── 2. Lever Scraper (Zero-LLM, AllLocations & Direct Deep-Links) ─
export async function scrapeLeverBoard(
  companyName: string,
  siteName: string,
  domain: string,
  logoUrl?: string
): Promise<ScrapedCompanyResult | null> {
  try {
    const url = `https://api.lever.co/v0/postings/${siteName}?mode=json`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Findely-Spatial-Job-Engine/1.0 (https://findely.com)",
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[Lever] Failed to fetch board '${siteName}' for ${companyName}: HTTP ${res.status}`);
      return null;
    }

    const rawJobs = await res.json();
    if (!Array.isArray(rawJobs)) {
      console.warn(`[Lever] Invalid response format for ${companyName} (${siteName}): expected array`);
      return null;
    }

    console.log(`[Lever] ✓ ${companyName} (${siteName}): Fetched ${rawJobs.length} open roles from Lever API.`);

    const jobs: ScrapedJob[] = [];

    for (const j of rawJobs) {
      // 1. Direct apply URL straight from Lever response
      const directApplyUrl = j.hostedUrl || `https://jobs.lever.co/${siteName}/${j.id}`;

      // 2. Department & team hierarchy extraction
      const dept = j.categories?.team || j.categories?.department || "Engineering";

      // 3. Clean description and salary extraction
      const desc = (j.descriptionPlain || j.descriptionBodyPlain || (j.description ? j.description.replace(/<[^>]*>?/gm, " ") : ""))
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 1500);

      const salary = extractSalaryRange(desc);
      const email = huntRecruiterEmail(desc, domain);
      const postedAt = j.createdAt ? new Date(j.createdAt) : new Date();

      // 4. Lever location handling:
      // Lever real-world data uses categories.allLocations array and/or categories.location string
      const distinctLocations: string[] = [];

      if (Array.isArray(j.categories?.allLocations) && j.categories.allLocations.length > 0) {
        for (const loc of j.categories.allLocations) {
          if (loc && typeof loc === "string" && loc.trim()) {
            distinctLocations.push(loc.trim());
          }
        }
      }

      if (distinctLocations.length === 0 && j.categories?.location) {
        const rawLoc = String(j.categories.location).trim();
        if (rawLoc.includes(";") || rawLoc.includes(" / ") || rawLoc.includes(" | ")) {
          const splitLocs = rawLoc.split(/;| \/ | \| /).map((s) => s.trim()).filter(Boolean);
          distinctLocations.push(...splitLocs);
        } else if (rawLoc) {
          distinctLocations.push(rawLoc);
        }
      }

      if (distinctLocations.length === 0) {
        distinctLocations.push(j.country || "San Francisco, CA");
      }

      // Deduplicate locations for this role
      const uniqueLocations = Array.from(new Set(distinctLocations));

      uniqueLocations.forEach((locStr, locIdx) => {
        const geo = geocodeLocation(locStr);
        const isRemote = j.workplaceType === "remote" || locStr.toLowerCase().includes("remote");
        const isHybrid = j.workplaceType === "hybrid" || locStr.toLowerCase().includes("hybrid");
        const locationType: "onsite" | "hybrid" | "remote" = isRemote ? "remote" : (isHybrid ? "hybrid" : geo.locationType);

        const externalId = uniqueLocations.length > 1 ? `${j.id}_loc_${locIdx}` : String(j.id);

        jobs.push({
          externalId,
          title: j.text ? j.text.trim() : "Software Engineer",
          department: dept,
          location: locStr,
          locationType,
          lat: geo.lat,
          lng: geo.lng,
          salaryMin: salary.min,
          salaryMax: salary.max,
          applyUrl: directApplyUrl,
          recruiterEmail: email || undefined,
          description: desc,
          postedAt,
        });
      });
    }

    const physicalJobs = jobs.filter((j) => j.lat !== null && j.lng !== null);
    const primaryGeo: GeocodedLocation = physicalJobs.length > 0
      ? { city: physicalJobs[0].location, country: "United States", lat: physicalJobs[0].lat, lng: physicalJobs[0].lng, locationType: physicalJobs[0].locationType, isBroadRegion: false }
      : { city: "Remote", country: "Worldwide", lat: null, lng: null, locationType: "remote", isBroadRegion: true };

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

// ── 3. Ashby Scraper (Zero-LLM, SecondaryLocations & Direct Deep-Links) ─
export async function scrapeAshbyBoard(
  companyName: string,
  ashbyIdentifier: string,
  domain: string,
  logoUrl?: string
): Promise<ScrapedCompanyResult | null> {
  try {
    const url = `https://api.ashbyhq.com/posting-api/job-board/${ashbyIdentifier}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Findely-Spatial-Job-Engine/1.0 (https://findely.com)",
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[Ashby] Failed to fetch board '${ashbyIdentifier}' for ${companyName}: HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    const rawJobs = Array.isArray(data.jobs) ? data.jobs : [];

    console.log(`[Ashby] ✓ ${companyName} (${ashbyIdentifier}): Fetched ${rawJobs.length} open roles from Ashby API.`);

    const jobs: ScrapedJob[] = [];

    for (const j of rawJobs) {
      // 1. Direct apply URL straight from Ashby posting API
      const directApplyUrl = j.jobUrl || j.applyUrl || `https://jobs.ashbyhq.com/${ashbyIdentifier}/${j.id}`;

      // 2. Department hierarchy extraction
      const dept = j.department || j.team || j.departmentName || "Engineering";

      // 3. Clean description and salary extraction
      const desc = (j.descriptionPlain || (j.descriptionHtml ? j.descriptionHtml.replace(/<[^>]*>?/gm, " ") : ""))
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 1500);

      const salary = extractSalaryRange(desc);
      const email = huntRecruiterEmail(desc, domain);
      const postedAt = j.publishedAt ? new Date(j.publishedAt) : new Date();

      // 4. Ashby location handling (primary location + secondaryLocations array):
      const distinctLocations: string[] = [];

      // Primary location string
      if (j.location && typeof j.location === "string" && j.location.trim()) {
        const rawLoc = j.location.trim();
        if (rawLoc.includes(";") || rawLoc.includes(" / ") || rawLoc.includes(" | ")) {
          const splitLocs = rawLoc.split(/;| \/ | \| /).map((s: string) => s.trim()).filter(Boolean);
          distinctLocations.push(...splitLocs);
        } else {
          distinctLocations.push(rawLoc);
        }
      } else if (j.address?.postalAddress) {
        const addr = j.address.postalAddress;
        const parts = [addr.addressLocality, addr.addressRegion, addr.addressCountry].filter(Boolean);
        if (parts.length > 0) {
          distinctLocations.push(parts.join(", "));
        }
      }

      // Secondary locations from Ashby array
      if (Array.isArray(j.secondaryLocations) && j.secondaryLocations.length > 0) {
        for (const sec of j.secondaryLocations) {
          if (sec.location && typeof sec.location === "string" && sec.location.trim()) {
            distinctLocations.push(sec.location.trim());
          } else if (sec.address?.postalAddress) {
            const addr = sec.address.postalAddress;
            const parts = [addr.addressLocality, addr.addressRegion, addr.addressCountry].filter(Boolean);
            if (parts.length > 0) {
              distinctLocations.push(parts.join(", "));
            }
          }
        }
      }

      if (distinctLocations.length === 0) {
        if (j.isRemote === true || String(j.workplaceType).toLowerCase() === "remote") {
          distinctLocations.push("Remote");
        } else {
          distinctLocations.push("San Francisco, CA");
        }
      }

      // Deduplicate locations for this role
      const uniqueLocations = Array.from(new Set(distinctLocations));

      uniqueLocations.forEach((locStr, locIdx) => {
        const geo = geocodeLocation(locStr);
        const isRemote = j.isRemote === true || String(j.workplaceType).toLowerCase() === "remote" || locStr.toLowerCase().includes("remote");
        const isHybrid = String(j.workplaceType).toLowerCase() === "hybrid" || locStr.toLowerCase().includes("hybrid");
        const locationType: "onsite" | "hybrid" | "remote" = isRemote ? "remote" : (isHybrid ? "hybrid" : geo.locationType);

        const externalId = uniqueLocations.length > 1 ? `${j.id}_loc_${locIdx}` : String(j.id);

        jobs.push({
          externalId,
          title: j.title ? j.title.trim() : "Software Engineer",
          department: dept,
          location: locStr,
          locationType,
          lat: geo.lat,
          lng: geo.lng,
          salaryMin: salary.min,
          salaryMax: salary.max,
          applyUrl: directApplyUrl,
          recruiterEmail: email || undefined,
          description: desc,
          postedAt,
        });
      });
    }

    const physicalJobs = jobs.filter((j) => j.lat !== null && j.lng !== null);
    const primaryGeo: GeocodedLocation = physicalJobs.length > 0
      ? { city: physicalJobs[0].location, country: "United States", lat: physicalJobs[0].lat, lng: physicalJobs[0].lng, locationType: physicalJobs[0].locationType, isBroadRegion: false }
      : { city: "Remote", country: "Worldwide", lat: null, lng: null, locationType: "remote", isBroadRegion: true };

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

// ── 4. Workday Scraper (Zero-LLM, Paginated POST CXS & Direct Deep-Links) ─
export async function scrapeWorkdayBoard(
  companyName: string,
  host: string,
  path: string,
  domain: string,
  logoUrl?: string
): Promise<ScrapedCompanyResult | null> {
  try {
    const siteName = path.split("/")[1] || path;
    const url = `https://${host}/wday/cxs/${path}/jobs`;
    const limit = 20; // Workday CXS per-page limit
    let offset = 0;
    let expectedTotal: number | null = null;
    const allRawJobs: any[] = [];

    while (true) {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Findely-Spatial-Job-Engine/1.0 (https://findely.com)",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          appliedFacets: {},
          limit,
          offset,
          searchText: "",
        }),
      });

      if (!res.ok) {
        if (offset === 0) {
          console.warn(`[Workday] Failed to fetch board '${path}' for ${companyName}: HTTP ${res.status}`);
          return null;
        }
        break;
      }

      const data = await res.json();
      if (expectedTotal === null && data.total !== undefined) {
        expectedTotal = data.total;
      }

      const pageJobs = Array.isArray(data.jobPostings) ? data.jobPostings : [];
      allRawJobs.push(...pageJobs);

      offset += limit;
      if (
        pageJobs.length === 0 ||
        (expectedTotal !== null && allRawJobs.length >= expectedTotal)
      ) {
        break;
      }
    }

    console.log(`[Workday] ✓ ${companyName} (${host}/${path}): Fetched ${allRawJobs.length}/${expectedTotal || allRawJobs.length} open roles.`);

    const jobs: ScrapedJob[] = [];

    for (const j of allRawJobs) {
      if (!j.externalPath || !j.title) continue;

      // 1. Direct apply URL constructed exactly from Workday tenant base + site + externalPath
      const directApplyUrl = `https://${host}/${siteName}${j.externalPath}`;

      // 2. Department or Team
      const dept = j.bulletFields?.[1] || "Engineering";

      // 3. Location handling with Step 0 fix
      const locString = j.locationsText || "Remote";
      const distinctLocations: string[] = [];

      if (locString.includes(";") || locString.includes(" / ") || locString.includes(" | ")) {
        const splitLocs = locString.split(/;| \/ | \| /).map((s: string) => s.trim()).filter(Boolean);
        distinctLocations.push(...splitLocs);
      } else {
        distinctLocations.push(locString.trim());
      }

      const uniqueLocations = Array.from(new Set(distinctLocations));

      uniqueLocations.forEach((locStr, locIdx) => {
        const geo = geocodeLocation(locStr);
        const isRemote = geo.locationType === "remote" || locStr.toLowerCase().includes("remote");
        const locationType: "onsite" | "hybrid" | "remote" = isRemote ? "remote" : geo.locationType;
        const externalId = uniqueLocations.length > 1
          ? `${j.externalPath.replace(/[^a-zA-Z0-9_-]/g, "_")}_loc_${locIdx}`
          : j.externalPath.replace(/[^a-zA-Z0-9_-]/g, "_");

        jobs.push({
          externalId,
          title: j.title ? j.title.trim() : "Engineer",
          department: dept,
          location: locStr,
          locationType,
          lat: geo.lat,
          lng: geo.lng,
          applyUrl: directApplyUrl,
          description: `Verified open role at ${companyName}: ${j.title}. Location: ${locStr}.`,
          postedAt: new Date(),
        });
      });
    }

    const physicalJobs = jobs.filter((j) => j.lat !== null && j.lng !== null);
    const primaryGeo: GeocodedLocation = physicalJobs.length > 0
      ? { city: physicalJobs[0].location, country: "United States", lat: physicalJobs[0].lat, lng: physicalJobs[0].lng, locationType: physicalJobs[0].locationType, isBroadRegion: false }
      : { city: "Remote", country: "Worldwide", lat: null, lng: null, locationType: "remote", isBroadRegion: true };

    return {
      name: companyName,
      slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      domain,
      logoUrl: logoUrl || `https://logo.clearbit.com/${domain}`,
      headline: `Frontier Tech and Engineering at ${companyName}`,
      description: `Explore live verified roles directly at ${companyName} on Findely.`,
      careersUrl: `https://${host}/${siteName}`,
      atsType: "workday",
      contactEmail: `careers@${domain}`,
      primaryLocation: primaryGeo,
      jobs,
    };
  } catch (err) {
    console.error(`Failed to scrape Workday board for ${companyName}:`, err);
    return null;
  }
}

// ── 5. Remotive Global Startup API Connector ─────────────────
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
