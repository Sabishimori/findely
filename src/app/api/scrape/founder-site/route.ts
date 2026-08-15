import { NextRequest, NextResponse } from "next/server";
import { scrapeFounderWebsite } from "@/lib/scraper/founderScraper";
import { validateUrlForScraping } from "@/lib/security/ssrfGuard";
import { db } from "@/db";
import { companies, jobs } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    const validation = validateUrlForScraping(url);
    if (!validation.isValid || !validation.sanitizedUrl) {
      return NextResponse.json({ error: validation.error || "Invalid target URL" }, { status: 400 });
    }

    const scraped = await scrapeFounderWebsite(validation.sanitizedUrl);

    if (!scraped) {
      return NextResponse.json(
        { error: "Could not automatically extract roles from this website. Our team will review manually." },
        { status: 422 }
      );
    }

    // Insert or update company
    const existing = await db
      .select()
      .from(companies)
      .where(eq(companies.name, scraped.name))
      .limit(1);

    let companyId: string;

    if (existing.length > 0) {
      companyId = existing[0].id;
      await db
        .update(companies)
        .set({
          website_url: `https://${scraped.domain}`,
          logo_url: scraped.logoUrl || existing[0].logo_url,
          description: scraped.description || existing[0].description,
          location_text: scraped.primaryLocation.city,
          latitude: scraped.primaryLocation.lat,
          longitude: scraped.primaryLocation.lng,
          contact_email: scraped.contactEmail || existing[0].contact_email,
          updated_at: new Date(),
        })
        .where(eq(companies.id, companyId));
    } else {
      companyId = crypto.randomUUID();
      await db.insert(companies).values({
        id: companyId,
        name: scraped.name,
        website_url: `https://${scraped.domain}`,
        logo_url: scraped.logoUrl,
        description: scraped.description,
        location_text: scraped.primaryLocation.city,
        latitude: scraped.primaryLocation.lat,
        longitude: scraped.primaryLocation.lng,
        founded_year: 2024,
        company_size: "10-50 employees",
        contact_email: scraped.contactEmail,
        status: "verified",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Insert jobs
    let newJobsCount = 0;
    for (const j of scraped.jobs) {
      await db.insert(jobs).values({
        id: crypto.randomUUID(),
        company_id: companyId,
        title: j.title,
        description: j.description.slice(0, 300),
        full_description: j.description,
        location_text: j.location,
        latitude: j.lat,
        longitude: j.lng,
        salary_range: j.salaryMin && j.salaryMax ? `$${Math.round(j.salaryMin / 1000)}k - $${Math.round(j.salaryMax / 1000)}k` : "$150k - $220k",
        job_type: "Full-time",
        experience_level: "Senior",
        apply_url: j.applyUrl,
        posted_at: j.postedAt,
        first_seen_at: new Date(),
        last_seen_at: new Date(),
        is_active: true,
      });
      newJobsCount++;
    }

    return NextResponse.json({
      success: true,
      company: scraped.name,
      domain: scraped.domain,
      jobsCount: newJobsCount,
      primaryLocation: scraped.primaryLocation,
      message: `Successfully indexed ${scraped.name} with ${newJobsCount} open positions!`,
    });
  } catch (err: any) {
    console.error("Founder site scraping error:", err);
    return NextResponse.json(
      { error: "Failed to scrape founder website", details: err?.message },
      { status: 500 }
    );
  }
}
