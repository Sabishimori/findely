/**
 * Findely Agent-Reach Social Intelligence Engine
 * Fetches real-time public developer signals, founder announcements, and hiring threads across X/HN/Reddit,
 * routing raw unstructured text through Gemini Pro AI for deep filtering, extraction, and automated DB ingestion.
 */

import { db } from "../../db";
import { companies, jobs } from "../../db/schema";
import { eq, or, and } from "drizzle-orm";
import { geocodeLocation } from "./geocoder";
import {
  extractSocialHiringWithGemini,
  RawSocialPost,
  SocialHiringSignal,
} from "./geminiScraper";

/**
 * Fetches recent public developer hiring posts from Hacker News Algolia search API (100% public, high signal)
 */
export async function fetchHNHiringPosts(limit = 15): Promise<RawSocialPost[]> {
  try {
    // Search for comments mentioning hiring, full-time, remote or founding engineer
    const url = `https://hn.algolia.com/api/v1/search?query=hiring+OR+remote+OR+engineer&tags=comment&hitsPerPage=${limit}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Findely-AgentReach/1.0" },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const hits = data.hits || [];

    return hits
      .filter((h: any) => h.comment_text && h.comment_text.length > 50)
      .map((h: any) => {
        // Strip basic HTML tags from HN comments
        const cleanContent = (h.comment_text || "")
          .replace(/<p>/gi, "\n\n")
          .replace(/<[^>]+>/g, " ")
          .replace(/&#x27;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, "&");

        return {
          id: String(h.objectID),
          author: h.author || "Founder",
          content: cleanContent,
          url: `https://news.ycombinator.com/item?id=${h.objectID}`,
          platform: "hackernews" as const,
          timestamp: h.created_at,
        };
      });
  } catch (err) {
    console.error("[AgentReach] Error fetching HN posts:", err);
    return [];
  }
}

/**
 * Discovers and parses live social hiring signals through Gemini Pro AI
 */
export async function discoverSocialHiringSignals(
  customPosts?: RawSocialPost[]
): Promise<SocialHiringSignal[]> {
  console.log("[AgentReach] Starting Social Intelligence Discovery...");

  // 1. Fetch live public signals if not passed explicitly
  const postsToAnalyze: RawSocialPost[] =
    customPosts && customPosts.length > 0
      ? customPosts
      : await fetchHNHiringPosts(20);

  if (postsToAnalyze.length === 0) {
    console.log("[AgentReach] No social posts found to analyze.");
    return [];
  }

  console.log(
    `[AgentReach] Routing ${postsToAnalyze.length} public social posts through Gemini Pro AI...`
  );

  // 2. Route through Gemini Pro AI for semantic filtering and structuring
  const signals = await extractSocialHiringWithGemini(postsToAnalyze);

  console.log(
    `[AgentReach] Gemini Pro verified ${signals.length} high-confidence hiring signals!`
  );

  return signals;
}

/**
 * Discovers social signals, resolves coordinates, and ingests into Findely Database
 */
export async function syncAgentReachToDatabase(): Promise<{
  discovered: number;
  inserted: number;
  signals: SocialHiringSignal[];
}> {
  const signals = await discoverSocialHiringSignals();
  let inserted = 0;

  for (const sig of signals) {
    try {
      const domain =
        sig.companyDomain ||
        `${sig.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;

      const websiteUrl = sig.applyUrl.startsWith("http")
        ? sig.applyUrl
        : `https://${domain}`;

      // 1. Check if company exists
      let existingCompany = await db
        .select()
        .from(companies)
        .where(eq(companies.name, sig.companyName))
        .get();

      const hqCoords = geocodeLocation(sig.location || "San Francisco");

      if (!existingCompany) {
        const logo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        const newCo = await db
          .insert(companies)
          .values({
            name: sig.companyName,
            website_url: websiteUrl,
            logo_url: logo,
            description: sig.summary,
            location_text: sig.location || "Remote",
            latitude: hqCoords.lat,
            longitude: hqCoords.lng,
            tech_stack_json:
              sig.techStack && sig.techStack.length > 0
                ? JSON.stringify(sig.techStack)
                : null,
            founders_json: sig.founderName
              ? JSON.stringify([
                  {
                    name: sig.founderName,
                    role: "Founder / Leadership",
                    avatar_url: null,
                  },
                ])
              : null,
            status: "verified",
          })
          .returning()
          .get();

        existingCompany = newCo;
      }

      if (!existingCompany) continue;

      // 2. Check if job already exists
      const existingJob = await db
        .select()
        .from(jobs)
        .where(
          and(
            eq(jobs.company_id, existingCompany.id),
            eq(jobs.title, sig.roleTitle)
          )
        )
        .get();

      if (!existingJob) {
        const jobCoords = geocodeLocation(sig.location || existingCompany.location_text || "San Francisco");
        await db.insert(jobs).values({
          company_id: existingCompany.id,
          title: sig.roleTitle,
          description: sig.summary,
          location_text: sig.location || "Remote",
          latitude: jobCoords.lat,
          longitude: jobCoords.lng,
          salary_range:
            sig.minSalary && sig.maxSalary
              ? `${sig.currency || "$"}${sig.minSalary.toLocaleString()} - ${sig.currency || "$"}${sig.maxSalary.toLocaleString()}`
              : undefined,
          apply_url: sig.applyUrl,
          job_type: "Full-time",
          is_active: true,
        });
        inserted++;
      }
    } catch (dbErr) {
      console.warn(`[AgentReach] DB insertion skip for ${sig.companyName}:`, dbErr);
    }
  }

  console.log(
    `[AgentReach] Sync Complete: ${signals.length} discovered, ${inserted} new roles added to map.`
  );

  return {
    discovered: signals.length,
    inserted,
    signals,
  };
}

