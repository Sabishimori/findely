import { createClient, InStatement } from "@libsql/client";
import { 
  scrapeGreenhouseBoard, 
  scrapeLeverBoard, 
  scrapeAshbyBoard, 
  scrapeRemotiveGlobalJobs 
} from "../src/lib/scraper/atsEngine";
import { TARGET_FRONTIER_STARTUPS } from "../src/lib/scraper/batchRunner";

const tursoUrl = process.env.TURSO_DATABASE_URL || "libsql://findely-sabishimori.aws-ap-south-1.turso.io";
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE4MTg0MDQyNTYsImlhdCI6MTc4Njg2ODI1NywiaWQiOiIwMWEwMDhkMS0xMjAxLTc5YmEtOWIwMi03YjJkYTE2NTI5MmUiLCJraWQiOiJIcEJPQ3ZqM1BuWHJlQk9sS2hmUlB3VGNLckh3U2NyckFfR0g5bDZlQXg4IiwicmlkIjoiY2RiZjIxZjktZGNjMy00M2ViLThlMzItZTZjMTk5Nzk5Mjc2In0.8Cy4YuS-XWZKTPWnZ9WkuDUg6Brq4_wOXNXljbmZ6drv7gisXEl91ZXkuejlAn1S_Av3xRnvMQcLA4BuqtOOCA";

const client = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

async function main() {
  console.log("==========================================================");
  console.log("🚀 Blazing Fast Batch Sync: 100% Direct ATS URLs to Turso");
  console.log("==========================================================");

  let totalRolesSynced = 0;

  for (const target of TARGET_FRONTIER_STARTUPS) {
    try {
      console.log(`\nScanning direct ATS for ${target.name} (${target.atsType}: ${target.boardId})...`);
      let result = null;

      if (target.atsType === "greenhouse") {
        result = await scrapeGreenhouseBoard(target.name, target.boardId, target.domain, target.logoUrl);
      } else if (target.atsType === "lever") {
        result = await scrapeLeverBoard(target.name, target.boardId, target.domain, target.logoUrl);
      } else if (target.atsType === "ashby") {
        result = await scrapeAshbyBoard(target.name, target.boardId, target.domain, target.logoUrl);
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
            result.primaryLocation?.lat || 37.7749,
            result.primaryLocation?.lng || -122.4194,
            Date.now(),
            Date.now(),
          ],
        });
      }

      // Delete old jobs for this company and insert clean direct ATS roles in one lightning fast batch!
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
          sql: `INSERT INTO jobs (id, company_id, title, role_category, location_text, work_mode, salary_range, description, skills_json, apply_url, is_active, source_type, posted_at, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, '[]', ?, 1, 'direct_ats', ?, ?, ?);`,
          args: [
            crypto.randomUUID(),
            companyId,
            j.title,
            roleCategory,
            j.location || "San Francisco, CA",
            workMode,
            j.salaryMin && j.salaryMax ? `$${(j.salaryMin/1000).toFixed(0)}k - $${(j.salaryMax/1000).toFixed(0)}k` : null,
            j.description || `${target.name} is hiring for ${j.title}.`,
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
          sql: "DELETE FROM jobs WHERE company_id = ? AND source_type = 'remotive';",
          args: [companyId],
        }
      ];

      for (const j of comp.jobs) {
        if (!j.applyUrl) continue;
        remotiveStatements.push({
          sql: `INSERT INTO jobs (id, company_id, title, role_category, location_text, work_mode, salary_range, description, skills_json, apply_url, is_active, source_type, posted_at, created_at, updated_at) 
                VALUES (?, ?, ?, 'Engineering', ?, 'remote', ?, ?, '[]', ?, 1, 'remotive', ?, ?, ?);`,
          args: [
            crypto.randomUUID(),
            companyId,
            j.title,
            j.location,
            j.salaryMin && j.salaryMax ? `$${(j.salaryMin/1000).toFixed(0)}k - $${(j.salaryMax/1000).toFixed(0)}k` : null,
            j.description,
            j.applyUrl,
            j.postedAt.getTime(),
            Date.now(),
            Date.now(),
          ],
        });
      }
      await client.batch(remotiveStatements, "write");
      totalRolesSynced += comp.jobs.length;
    }
  } catch (err: any) {
    console.error("Remotive sync error:", err);
  }

  const finalCount = await client.execute("SELECT COUNT(*) as c FROM jobs WHERE is_active = 1;");
  console.log("\n==========================================================");
  console.log(`✅ Blazing Fast Batch Sync Complete!`);
  console.log(`Total Direct ATS Roles Ingested: ${totalRolesSynced}`);
  console.log(`Total Active Direct Roles in Turso DB: ${finalCount.rows[0].c}`);
  console.log("==========================================================");
}

main().catch(console.error);
