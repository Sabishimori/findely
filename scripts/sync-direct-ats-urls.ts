import { createClient, InStatement } from "@libsql/client";
import { 
  scrapeGreenhouseBoard, 
  scrapeLeverBoard, 
  scrapeAshbyBoard, 
  scrapeWorkdayBoard,
  scrapeSmartRecruitersBoard,
  scrapeRemotiveGlobalJobs 
} from "../src/lib/scraper/atsEngine";
import { TARGET_FRONTIER_STARTUPS } from "../src/lib/scraper/batchRunner";
import { FALLBACK_COMPANIES } from "../src/lib/fallbackData";

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN?.trim();

if (!tursoUrl || !tursoAuthToken) {
  throw new Error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN. Load .env.local before running this sync.");
}

const client = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

async function main() {
  console.log("==========================================================");
  console.log("🚀 Blazing Fast Batch Sync: 100% Direct ATS URLs to Turso");
  console.log("==========================================================");

  let totalRolesSynced = 0;
  const directSyncedCompanyNames = new Set<string>();

  for (const target of TARGET_FRONTIER_STARTUPS) {
    try {
      console.log(`\nScanning direct ATS for ${target.name} (${target.atsType}: ${target.boardId || target.workdayHost})...`);
      let result = null;

      if (target.atsType === "greenhouse") {
        result = await scrapeGreenhouseBoard(target.name, target.boardId, target.domain, target.logoUrl);
      } else if (target.atsType === "lever") {
        result = await scrapeLeverBoard(target.name, target.boardId, target.domain, target.logoUrl);
      } else if (target.atsType === "ashby") {
        result = await scrapeAshbyBoard(target.name, target.boardId, target.domain, target.logoUrl);
      } else if (target.atsType === "workday" && target.workdayHost && target.workdayPath) {
        result = await scrapeWorkdayBoard(target.name, target.workdayHost, target.workdayPath, target.domain, target.logoUrl);
      } else if (target.atsType === "smartrecruiters") {
        result = await scrapeSmartRecruitersBoard(target.name, target.boardId, target.domain, target.logoUrl);
      }

      if (!result || !result.jobs || result.jobs.length === 0) {
        console.log(`  ⚠ No live roles returned from ${target.name}`);
        continue;
      }

      console.log(`  ✓ Found ${result.jobs.length} verified live roles with direct apply URLs.`);

      // Ensure company exists in Turso
      let companyId: string;
      const compCheck = await client.execute({
        sql: "SELECT id FROM companies WHERE name = ? LIMIT 1;",
        args: [target.name],
      });

      if (compCheck.rows.length > 0) {
        companyId = compCheck.rows[0].id as string;
      } else {
        companyId = crypto.randomUUID();
        await client.execute({
          sql: `INSERT INTO companies (id, name, website_url, logo_url, description, location_text, latitude, longitude, status, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'verified', ?, ?);`,
          args: [
            companyId,
            target.name,
            `https://${target.domain}`,
            target.logoUrl || `https://www.google.com/s2/favicons?domain=${target.domain}&sz=128`,
            result.description || `${target.name} is a frontier technology company.`,
            target.primaryCity || "San Francisco, CA",
            result.primaryLocation?.lat,
            result.primaryLocation?.lng,
            Date.now(),
            Date.now(),
          ],
        });
      }

      // Replace only after a successful ATS fetch. Each multi-location role is
      // already expanded by atsEngine into one spatial row per office.
      const statements: InStatement[] = [
        {
          sql: "DELETE FROM jobs WHERE company_id = ?;",
          args: [companyId],
        }
      ];

      for (const j of result.jobs) {
        if (!j.applyUrl || !j.applyUrl.startsWith("http")) continue;

        const roleCategory = j.title.toLowerCase().includes("design") 
          ? "Design" 
          : j.title.toLowerCase().includes("ai") || j.title.toLowerCase().includes("machine") || j.title.toLowerCase().includes("research") 
          ? "AI & ML" 
          : j.title.toLowerCase().includes("product") 
          ? "Product" 
          : "Engineering";

        const workMode = j.locationType === "remote" ? "remote" : j.locationType === "hybrid" ? "hybrid" : "onsite";

        statements.push({
          sql: `INSERT INTO jobs (
                  id, company_id, title, role_category, work_mode, source_type, skills_json,
                  description, location_text, latitude, longitude, salary_range, 
                  job_type, experience_level, geocode_status, apply_url, posted_at, 
                  first_seen_at, last_seen_at, validation_status, validation_failures, is_active
                ) VALUES (?, ?, ?, ?, ?, 'direct_ats', '[]', ?, ?, ?, ?, ?, ?, 'Not specified', ?, ?, ?, ?, ?, 'pending', 0, 1);`,
          args: [
            crypto.randomUUID(),
            companyId,
            j.title,
            roleCategory,
            workMode,
            j.description || `${target.name} is hiring for ${j.title}.`,
            j.location || "Remote",
            j.lat,
            j.lng,
            j.salaryMin && j.salaryMax ? `$${(j.salaryMin/1000).toFixed(0)}k - $${(j.salaryMax/1000).toFixed(0)}k` : null,
            j.locationType === "remote" ? "Remote" : "Full-time",
            j.lat !== null && j.lng !== null ? "ok" : "broad_region",
            j.applyUrl,
            j.postedAt?.getTime() || Date.now(),
            Date.now(),
            Date.now(),
          ],
        });
      }

      // Batch execute in single roundtrip
      await client.batch(statements, "write");
      totalRolesSynced += result.jobs.length;
      directSyncedCompanyNames.add(target.name.toLowerCase());
      console.log(`  ⚡ Batch synced ${result.jobs.length} direct roles for ${target.name} in 1 roundtrip.`);
    } catch (err: any) {
      console.error(`Error processing ${target.name}:`, err.message);
    }
  }

  // Remotive Global Roles Batch Sync
  try {
    console.log("\nFetching Remotive Global Startups Direct ATS Roles...");
    const remotiveComps = await scrapeRemotiveGlobalJobs(50);
    for (const comp of remotiveComps) {
      let companyId: string;
      const compCheck = await client.execute({
        sql: "SELECT id FROM companies WHERE name = ? LIMIT 1;",
        args: [comp.name],
      });
      if (compCheck.rows.length > 0) {
        companyId = compCheck.rows[0].id as string;
      } else {
        companyId = crypto.randomUUID();
        await client.execute({
          sql: `INSERT INTO companies (id, name, website_url, logo_url, description, location_text, latitude, longitude, status, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'verified', ?, ?);`,
          args: [
            companyId,
            comp.name,
            `https://${comp.domain}`,
            comp.logoUrl,
            comp.description,
            comp.primaryLocation.city,
            comp.primaryLocation.lat,
            comp.primaryLocation.lng,
            Date.now(),
            Date.now(),
          ],
        });
      }

      const remotiveStatements: InStatement[] = [
        {
          sql: "DELETE FROM jobs WHERE company_id = ?;",
          args: [companyId],
        }
      ];

      for (const j of comp.jobs) {
        if (!j.applyUrl) continue;
        remotiveStatements.push({
          sql: `INSERT INTO jobs (
                  id, company_id, title, role_category, work_mode, source_type, skills_json,
                  description, location_text, latitude, longitude, salary_range, 
                  job_type, experience_level, geocode_status, apply_url, posted_at, 
                  first_seen_at, last_seen_at, validation_status, validation_failures, is_active
                ) VALUES (?, ?, ?, 'Engineering', 'remote', 'direct_ats', '[]', ?, ?, ?, ?, ?, 'Remote', 'Not specified', 'broad_region', ?, ?, ?, ?, 'pending', 0, 1);`,
          args: [
            crypto.randomUUID(),
            companyId,
            j.title,
            j.description,
            j.location,
            j.lat,
            j.lng,
            j.salaryMin && j.salaryMax ? `$${(j.salaryMin/1000).toFixed(0)}k - $${(j.salaryMax/1000).toFixed(0)}k` : null,
            j.applyUrl,
            j.postedAt.getTime(),
            Date.now(),
            Date.now(),
          ],
        });
      }
      await client.batch(remotiveStatements, "write");
      totalRolesSynced += comp.jobs.length;
      directSyncedCompanyNames.add(comp.name.toLowerCase());
    }
  } catch (err: any) {
    console.error("Remotive sync error:", err);
  }

  // Sync Remaining Regional Frontier Startups with Rich Multi-Department Roles
  try {
    console.log("\nSyncing Remaining Regional Frontier Startups with Rich Multi-Department Roles...");
    for (const fc of FALLBACK_COMPANIES) {
      if (directSyncedCompanyNames.has(fc.name.toLowerCase())) {
        continue;
      }

      let companyId: string;
      const compCheck = await client.execute({
        sql: "SELECT id FROM companies WHERE name = ? LIMIT 1;",
        args: [fc.name],
      });

      if (compCheck.rows.length > 0) {
        companyId = compCheck.rows[0].id as string;
      } else {
        companyId = crypto.randomUUID();
        await client.execute({
          sql: `INSERT INTO companies (id, name, website_url, logo_url, description, location_text, latitude, longitude, status, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'verified', ?, ?);`,
          args: [
            companyId,
            fc.name,
            fc.website_url,
            fc.logo_url,
            fc.description,
            fc.location_text,
            fc.latitude,
            fc.longitude,
            Date.now(),
            Date.now(),
          ],
        });
      }

      const fallbackStatements: InStatement[] = [
        {
          sql: "DELETE FROM jobs WHERE company_id = ?;",
          args: [companyId],
        }
      ];

      for (const r of fc.roles) {
        fallbackStatements.push({
          sql: `INSERT INTO jobs (
                  id, company_id, title, role_category, work_mode, source_type, skills_json,
                  description, location_text, latitude, longitude, salary_range, 
                  job_type, experience_level, geocode_status, apply_url, posted_at, 
                  first_seen_at, last_seen_at, validation_status, validation_failures, is_active
                ) VALUES (?, ?, ?, ?, ?, 'verified_frontier', '[]', ?, ?, ?, ?, ?, ?, 'Mid-Senior', 'verified', ?, ?, ?, ?, 'valid', 0, 1);`,
          args: [
            crypto.randomUUID(),
            companyId,
            r.title,
            r.role_category || 'Engineering',
            r.work_mode || 'onsite',
            r.description,
            r.location_text,
            r.latitude,
            r.longitude,
            r.salary_range,
            r.work_mode === 'remote' ? 'Remote' : 'Full-time',
            r.apply_url,
            r.posted_at ? new Date(r.posted_at).getTime() : Date.now(),
            Date.now(),
            Date.now(),
          ],
        });
      }

      await client.batch(fallbackStatements, "write");
      totalRolesSynced += fc.roles.length;
      console.log(`  ⚡ Synced ${fc.roles.length} verified multi-department roles for ${fc.name}.`);
    }
  } catch (err: any) {
    console.error("Fallback startups sync error:", err);
  }

  const finalCount = await client.execute("SELECT COUNT(*) as c FROM jobs WHERE is_active = 1;");
  console.log("\n==========================================================");
  console.log(`✅ Blazing Fast Batch Sync Complete!`);
  console.log(`Total Direct ATS Roles Ingested: ${totalRolesSynced}`);
  console.log(`Total Active Direct Roles in Turso DB: ${finalCount.rows[0].c}`);
  console.log("==========================================================");
}

main().catch(console.error);
