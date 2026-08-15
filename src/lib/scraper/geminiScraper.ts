/**
 * Findely Gemini Pro AI Scraping & Intelligence Engine
 * Uses Gemini Pro LLM to extract structured startup dossiers, leadership, branch networks, and verified jobs from arbitrary web content.
 */

import { geocodeLocation, geocodeRealLocation } from "./geocoder";
import { ScrapedCompanyResult, ScrapedJob } from "./atsEngine";

export interface GeminiScrapedJob {
  title: string;
  department?: string;
  seniority?: string;
  location?: string;
  isRemote?: boolean;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  techStack?: string[];
  applyUrl?: string;
  descriptionSummary?: string;
}

export interface GeminiScrapedCompany {
  name: string;
  tagline: string;
  description: string;
  industry: string;
  hqCity: string;
  branchCities?: string[];
  websiteUrl: string;
  logoUrl?: string;
  founders?: Array<{
    name: string;
    role: string;
    linkedinUrl?: string;
    twitterUrl?: string;
  }>;
  jobs: GeminiScrapedJob[];
}

export async function extractWithGeminiPro(
  htmlOrText: string,
  targetUrl: string
): Promise<GeminiScrapedCompany | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[GeminiScraper] No GEMINI_API_KEY detected in environment");
    return null;
  }

  try {
    // Truncate safely to avoid exceeding payload limits while retaining high signal
    const cleanContent = htmlOrText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
      .replace(/\s+/g, " ")
      .slice(0, 120000); // 120k chars

    const systemPrompt = `You are Findely's Frontier AI Startup Intelligence Extractor.
Extract structured company data and all open jobs from the provided web content.
Target URL: ${targetUrl}

You MUST return ONLY a valid, raw JSON object (without markdown code blocks, without backticks) matching this exact schema:
{
  "name": "Company Name",
  "tagline": "Short punchy 1-sentence tagline",
  "description": "Comprehensive 2-3 sentence overview of what the startup builds",
  "industry": "Industry Sector (e.g. AI / LLMs, Fintech, Developer Tools, Robotics, Infrastructure)",
  "hqCity": "Primary Headquarter City (e.g. San Francisco, New York, London, Tokyo, Bengaluru)",
  "branchCities": ["Additional Office Cities"],
  "websiteUrl": "${targetUrl}",
  "logoUrl": "URL to official logo if present, or null",
  "founders": [
    {
      "name": "Founder Name",
      "role": "Co-Founder & CEO / CTO",
      "linkedinUrl": "https://linkedin.com/in/... or null",
      "twitterUrl": "https://x.com/... or null"
    }
  ],
  "jobs": [
    {
      "title": "Exact Role Title (e.g. Founding AI Research Engineer)",
      "department": "Engineering / AI / Product / Design / Sales",
      "seniority": "Founding / Staff / Senior / Mid / Junior",
      "location": "Job Location City or Remote",
      "isRemote": true,
      "minSalary": 160000,
      "maxSalary": 240000,
      "currency": "USD",
      "techStack": ["Python", "PyTorch", "Rust", "Next.js"],
      "applyUrl": "Direct ATS application URL or link to role",
      "descriptionSummary": "1-sentence summary of role scope"
    }
  ]
}`;

    // High-availability working Gemini models verified for this environment
    const modelsToTry = [
      "gemini-3.5-flash",
      "gemini-3.6-flash",
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
      "gemini-3-flash-preview",
      "gemini-3.7-flash",
    ];

    for (const modelName of modelsToTry) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const payload = {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\n=== WEB CONTENT START ===\n${cleanContent}\n=== WEB CONTENT END ===`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`[GeminiScraper] ${modelName} returned HTTP ${res.status}:`, errText);
          continue; // Try next model
        }

        const data = await res.json();
        const rawResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawResponse) continue;

        // Parse JSON (handle possible markdown fences if returned)
        const cleanJsonStr = rawResponse
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const parsed: GeminiScrapedCompany = JSON.parse(cleanJsonStr);
        if (parsed && parsed.name) {
          console.log(`[GeminiScraper] Successfully extracted intelligence for ${parsed.name} using ${modelName} (${parsed.jobs?.length || 0} jobs)`);
          return parsed;
        }
      } catch (err) {
        console.error(`[GeminiScraper] Error with ${modelName}:`, err);
      }
    }

    return null;
  } catch (globalErr) {
    console.error("[GeminiScraper] Global extraction error:", globalErr);
    return null;
  }
}

/**
 * Converts Gemini Scraped Company into Findely's standardized DB ScrapedCompanyResult
 */
export async function convertGeminiResultToCompanyResult(
  geminiData: GeminiScrapedCompany,
  domain: string
): Promise<ScrapedCompanyResult> {
  const hqCoords = geocodeLocation(geminiData.hqCity || "San Francisco");

  const jobs: ScrapedJob[] = (geminiData.jobs || []).map((j, i) => {
    const jobCoords = j.location ? geocodeLocation(j.location) : hqCoords;
    const isRemote = j.isRemote ?? (j.location?.toLowerCase().includes("remote") || false);
    const locationType: "onsite" | "hybrid" | "remote" = isRemote ? "remote" : "onsite";

    return {
      externalId: `gemini_${domain}_${i}_${Date.now()}`,
      title: j.title,
      department: j.department || "Engineering",
      location: j.location || geminiData.hqCity || "San Francisco, CA",
      locationType,
      lat: jobCoords.lat,
      lng: jobCoords.lng,
      salaryMin: j.minSalary,
      salaryMax: j.maxSalary,
      equity: undefined,
      applyUrl: j.applyUrl || geminiData.websiteUrl,
      description: j.descriptionSummary || `Role at ${geminiData.name}`,
      postedAt: new Date(),
    };
  });

  return {
    name: geminiData.name,
    slug: domain.split(".")[0].toLowerCase(),
    domain,
    logoUrl: geminiData.logoUrl || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    headline: geminiData.tagline || `Frontier technology startup based in ${geminiData.hqCity}.`,
    description: geminiData.description || `Frontier engineering roles at ${geminiData.name}`,
    careersUrl: geminiData.websiteUrl,
    atsType: "custom",
    contactEmail: geminiData.founders?.[0]?.name ? undefined : undefined,
    primaryLocation: hqCoords,
    jobs,
  };
}

export interface RawSocialPost {
  id?: string;
  author: string;
  content: string;
  url: string;
  platform: "x" | "hackernews" | "reddit" | "github" | "other";
  timestamp?: string;
}

export interface SocialHiringSignal {
  companyName: string;
  companyDomain?: string;
  tagline?: string;
  roleTitle: string;
  location: string;
  isRemote: boolean;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  techStack: string[];
  applyUrl: string;
  founderName?: string;
  founderHandle?: string;
  summary: string;
  confidence: number; // 0 - 100
}

/**
 * Routes raw social posts (from X, Reddit, HackerNews, GitHub) through Gemini AI
 * to identify real hiring signals, filter out spam, and extract structured job/founder dossiers.
 */
export async function extractSocialHiringWithGemini(
  posts: RawSocialPost[]
): Promise<SocialHiringSignal[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || posts.length === 0) return [];

  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3-flash-preview",
  ];

  const formattedPosts = posts
    .map(
      (p, i) =>
        `[POST_${i + 1}] Platform: ${p.platform} | Author: ${p.author} | URL: ${p.url}\nContent:\n${p.content}\n`
    )
    .join("\n---\n");

  const systemPrompt = `You are Findely's AI Social Hiring Intelligence Parser.
Analyze the following public social posts/threads from startup founders and tech leaders.
Identify legitimate hiring announcements and ignore general banter, memes, non-hiring chatter, or self-promotion without open positions.

Return a valid JSON array of verified hiring signals. Schema:
[
  {
    "companyName": "Exact Company Name",
    "companyDomain": "company.com or null",
    "tagline": "Short description of what the company does",
    "roleTitle": "Role Title (e.g. Founding AI Engineer, Staff Rust Engineer)",
    "location": "City, Country (e.g. Bengaluru, India or San Francisco, CA) or Remote",
    "isRemote": true/false,
    "minSalary": 0,
    "maxSalary": 0,
    "currency": "USD" or "INR" or null,
    "techStack": ["PyTorch", "Rust", "Next.js", ...],
    "applyUrl": "Direct apply link or email or the post URL",
    "founderName": "Founder Name or null",
    "founderHandle": "@handle or null",
    "summary": "1-2 sentence overview of the role and opportunity",
    "confidence": 95
  }
]
If a post is NOT a hiring signal, omit it. Return ONLY the raw JSON array.`;

  for (const modelName of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nPOSTS TO ANALYZE:\n${formattedPosts.slice(0, 80000)}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleanJson = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const signals: SocialHiringSignal[] = JSON.parse(cleanJson);
      if (Array.isArray(signals)) {
        return signals.filter((s) => s.companyName && s.roleTitle);
      }
    } catch (err) {
      console.warn(`[AgentReach] Error parsing social signals with ${modelName}:`, err);
    }
  }

  return [];
}

