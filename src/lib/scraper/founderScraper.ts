/**
 * Findely Founder Self-Serve Website Parser
 * Automatically crawls a founder's website URL, extracts open roles, branding, and locations
 */

import * as cheerio from "cheerio";
import { geocodeLocation, geocodeRealLocation } from "./geocoder";
import { huntRecruiterEmail } from "./emailHunter";
import { 
  scrapeGreenhouseBoard, 
  scrapeLeverBoard, 
  scrapeAshbyBoard, 
  ScrapedCompanyResult, 
  ScrapedJob 
} from "./atsEngine";

export async function scrapeFounderWebsite(url: string): Promise<ScrapedCompanyResult | null> {
  try {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const parsedUrl = new URL(cleanUrl);
    const domain = parsedUrl.hostname.replace(/^www\./, "");
    const companyName = domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1);

    const res = await fetch(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FindelyBot/1.0; +https://findely.app)",
        Accept: "text/html,application/xhtml+xml,application/xml",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch website (HTTP ${res.status})`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // 1. Detect embedded ATS
    // Check Greenhouse
    const ghMatch = html.match(/boards\.greenhouse\.io\/(?:embed\/job_board\?for=)?([a-zA-Z0-9_-]+)/i);
    if (ghMatch && ghMatch[1]) {
      const ghResult = await scrapeGreenhouseBoard(companyName, ghMatch[1], domain);
      if (ghResult && ghResult.jobs.length > 0) return ghResult;
    }

    // Check Lever
    const leverMatch = html.match(/jobs\.lever\.co\/([a-zA-Z0-9_-]+)/i);
    if (leverMatch && leverMatch[1]) {
      const leverResult = await scrapeLeverBoard(companyName, leverMatch[1], domain);
      if (leverResult && leverResult.jobs.length > 0) return leverResult;
    }

    // Check Ashby
    const ashbyMatch = html.match(/jobs\.ashbyhq\.com\/([a-zA-Z0-9_-]+)/i);
    if (ashbyMatch && ashbyMatch[1]) {
      const ashbyResult = await scrapeAshbyBoard(companyName, ashbyMatch[1], domain);
      if (ashbyResult && ashbyResult.jobs.length > 0) return ashbyResult;
    }

    // 2. High-Precision Gemini Pro Intelligence Extraction
    if (process.env.GEMINI_API_KEY) {
      try {
        const { extractWithGeminiPro, convertGeminiResultToCompanyResult } = await import("./geminiScraper");
        const geminiData = await extractWithGeminiPro(html, cleanUrl);
        if (geminiData && geminiData.name) {
          const geminiCompanyResult = await convertGeminiResultToCompanyResult(geminiData, domain);
          if (geminiCompanyResult) {
            return geminiCompanyResult;
          }
        }
      } catch (geminiErr) {
        console.warn("[FounderScraper] Gemini Pro extraction fallback:", geminiErr);
      }
    }

    // 3. Fallback: Cheerio DOM & Metadata Extractor
    const pageTitle = $('meta[property="og:title"]').attr("content") || $("title").text() || companyName;
    const pageDesc = 
      $('meta[property="og:description"]').attr("content") || 
      $('meta[name="description"]').attr("content") || 
      `Frontier technology and engineering roles at ${companyName}.`;
    
    let logoUrl = $('meta[property="og:image"]').attr("content") || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    if (!logoUrl.startsWith("http")) {
      logoUrl = `https://${domain}${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}`;
    }

    // 4. Extract Contact Email
    const recruiterEmail = huntRecruiterEmail(html, domain);

    // 5. Custom DOM Jobs Extractor
    const jobs: ScrapedJob[] = [];

    // Search for common job listing elements
    const jobLinks = $('a[href*="/job"], a[href*="/career"], a[href*="/position"], [data-job-id], .job-item, .posting');

    jobLinks.each((i, el) => {
      if (jobs.length >= 25) return; // Cap at 25 roles per custom crawl

      const element = $(el);
      const title = 
        element.find("h2, h3, h4, .title, .job-title").text().trim() || 
        element.text().trim().split("\n")[0].trim();

      const href = element.attr("href") || "";
      let applyUrl = href;
      if (href && !href.startsWith("http")) {
        applyUrl = `https://${domain}${href.startsWith("/") ? "" : "/"}${href}`;
      }

      if (title && title.length > 4 && title.length < 80) {
        const textContext = element.parent().text();
        const geo = geocodeLocation(textContext);

        jobs.push({
          externalId: `custom_${domain}_${i}`,
          title: title.slice(0, 70),
          department: "Engineering",
          location: geo.city,
          locationType: geo.locationType,
          lat: geo.lat,
          lng: geo.lng,
          applyUrl: applyUrl || cleanUrl,
          recruiterEmail: recruiterEmail || undefined,
          description: pageDesc,
          postedAt: new Date(),
        });
      }
    });

    // 5. Extract Headquarters / Location from Footer or Contact
    let siteLocationText = $('footer, .footer, .contact, address, [class*="address"], [class*="location"]').text().trim();
    if (siteLocationText.length > 200) {
      siteLocationText = siteLocationText.slice(0, 200);
    }

    const primaryGeo = jobs.length > 0 && jobs[0].location !== "Remote"
      ? { city: jobs[0].location, country: "Global", lat: jobs[0].lat, lng: jobs[0].lng, locationType: jobs[0].locationType }
      : await geocodeRealLocation(siteLocationText || companyName);

    return {
      name: companyName,
      slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      domain,
      logoUrl,
      headline: pageTitle.slice(0, 100),
      description: pageDesc.slice(0, 300),
      careersUrl: cleanUrl,
      atsType: "custom",
      contactEmail: recruiterEmail || `careers@${domain}`,
      primaryLocation: primaryGeo,
      jobs,
    };
  } catch (err) {
    console.error(`Failed to parse founder website (${url}):`, err);
    return null;
  }
}
