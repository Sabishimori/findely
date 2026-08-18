/**
 * Findely Pipeline Orchestrator & Idempotent Database Sync Engine
 * Coordinates multi-source discovery, AI normalization, and safe database upserts.
 */

import { db } from "@/db";
import { companies, jobs } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { DiscoveredIndianCompany, INDIA_DISCOVERY_TARGETS, discoverIndianStartupsByHub } from "./indiaDiscovery";

export interface PipelineExecutionStats {
  hubsScanned: number;
  companiesDiscovered: number;
  companiesCreated: number;
  companiesUpdated: number;
  jobsSynced: number;
  durationMs: number;
  tierBreakdown: Record<string, number>;
}

/**
 * Executes full multi-hub discovery pipeline across Indian Tech Corridors
 */
export async function runIndiaDiscoveryPipeline(onProgress?: (msg: string) => void): Promise<PipelineExecutionStats> {
  const startTime = Date.now();
  const log = (msg: string) => {
    console.log(`[Pipeline] ${msg}`);
    if (onProgress) onProgress(msg);
  };

  log("🚀 Launching India-First Multi-Tier Discovery Pipeline...");
  
  const stats: PipelineExecutionStats = {
    hubsScanned: 0,
    companiesDiscovered: 0,
    companiesCreated: 0,
    companiesUpdated: 0,
    jobsSynced: 0,
    durationMs: 0,
    tierBreakdown: {
      boutique_studio: 0,
      mid_tier: 0,
      breakout: 0,
      bootstrapped: 0,
    },
  };

  const allDiscovered: DiscoveredIndianCompany[] = [];

  // 1. Scan Hubs in Parallel / Controlled Batches
  for (const target of INDIA_DISCOVERY_TARGETS) {
    log(`🔍 Scanning Hub: ${target.hub} (${target.tierFocus})...`);
    try {
      const results = await discoverIndianStartupsByHub(target);
      stats.hubsScanned += 1;
      stats.companiesDiscovered += results.length;
      allDiscovered.push(...results);
      log(`  ✓ Found ${results.length} verified ventures in ${target.hub}`);
    } catch (e) {
      log(`  ⚠️ Failed scanning ${target.hub}: ${e}`);
    }
  }

  // 2. Ingest and Upsert into Database
  log(`💾 Ingesting ${allDiscovered.length} discovered companies into database...`);

  for (const company of allDiscovered) {
    stats.tierBreakdown[company.tier] = (stats.tierBreakdown[company.tier] || 0) + 1;

    try {
      // Check if company already exists by website_url or name
      const existing = await db
        .select()
        .from(companies)
        .where(
          sql`LOWER(${companies.website_url}) = ${company.websiteUrl.toLowerCase()} OR LOWER(${companies.name}) = ${company.name.toLowerCase()}`
        )
        .limit(1);

      let companyId: string;

      if (existing.length > 0) {
        companyId = existing[0].id;
        stats.companiesUpdated += 1;

        // Update company metadata
        await db
          .update(companies)
          .set({
            description: company.description || existing[0].description,
            location_text: `${company.neighborhood ? company.neighborhood + ", " : ""}${company.city}, India`,
            latitude: company.lat,
            longitude: company.lng,
            company_size: company.teamSize || existing[0].company_size,
            founders_json: JSON.stringify(company.founders || []),
            tech_stack_json: JSON.stringify(
              Array.from(new Set([...(company.jobs.flatMap((j) => j.techStack)), company.industry]))
            ),
            updated_at: new Date(),
          })
          .where(eq(companies.id, companyId));
      } else {
        companyId = crypto.randomUUID();
        stats.companiesCreated += 1;

        await db.insert(companies).values({
          id: companyId,
          name: company.name,
          website_url: company.websiteUrl,
          logo_url: company.logoUrl,
          description: company.description,
          location_text: `${company.neighborhood ? company.neighborhood + ", " : ""}${company.city}, India`,
          latitude: company.lat,
          longitude: company.lng,
          company_size: company.teamSize || "15-50",
          founders_json: JSON.stringify(company.founders || []),
          tech_stack_json: JSON.stringify(
            Array.from(new Set([...(company.jobs.flatMap((j) => j.techStack)), company.industry]))
          ),
          source_track: "ats_api",
          size_tier: company.tier === "breakout" ? "growth" : "startup",
          status: "verified",
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      // Upsert Jobs for Company
      for (const job of company.jobs) {
        const existingJob = await db
          .select()
          .from(jobs)
          .where(
            sql`${jobs.company_id} = ${companyId} AND LOWER(${jobs.title}) = ${job.title.toLowerCase()}`
          )
          .limit(1);

        const roleCategory = job.title.toLowerCase().includes("design") 
          ? "Design" 
          : job.title.toLowerCase().includes("ai") || job.title.toLowerCase().includes("machine") 
          ? "AI & ML" 
          : job.title.toLowerCase().includes("product") 
          ? "Product" 
          : "Engineering";

        const workMode = job.isRemote ? "remote" : "onsite";

        if (existingJob.length > 0) {
          await db
            .update(jobs)
            .set({
              salary_range: job.formattedSalary || existingJob[0].salary_range,
              apply_url: job.applyUrl || existingJob[0].apply_url,
              location_text: job.location,
              latitude: company.lat,
              longitude: company.lng,
              last_seen_at: new Date(),
              is_active: true,
            })
            .where(eq(jobs.id, existingJob[0].id));
        } else {
          await db.run(sql`
            INSERT INTO jobs (
              id, company_id, title, role_category, work_mode, source_type, skills_json,
              description, location_text, latitude, longitude, salary_range, 
              job_type, experience_level, geocode_status, apply_url, posted_at, 
              first_seen_at, last_seen_at, validation_status, validation_failures, is_active
            ) VALUES (
              ${crypto.randomUUID()},
              ${companyId},
              ${job.title},
              ${roleCategory},
              ${workMode},
              'direct_ats',
              ${JSON.stringify(job.techStack)},
              ${job.descriptionSummary || `Role at ${company.name}`},
              ${job.location},
              ${company.lat},
              ${company.lng},
              ${job.formattedSalary || 'Competitive'},
              'Full-time',
              'Senior',
              'ok',
              ${job.applyUrl},
              ${Date.now()},
              ${Date.now()},
              ${Date.now()},
              'valid',
              0,
              1
            );
          `);
        }
        stats.jobsSynced += 1;
      }
    } catch (dbErr) {
      log(`  ⚠️ Database upsert error for ${company.name}: ${dbErr}`);
    }
  }

  stats.durationMs = Date.now() - startTime;
  log(`✨ Pipeline Completed in ${(stats.durationMs / 1000).toFixed(2)}s`);
  log(`📊 Summary: ${stats.companiesCreated} New Companies, ${stats.companiesUpdated} Updated, ${stats.jobsSynced} Live Roles Synced.`);
  
  return stats;
}
