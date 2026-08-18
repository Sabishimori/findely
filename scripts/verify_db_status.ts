import { db } from "../src/db";
import { companies, jobs } from "../src/db/schema";
import { count, sql } from "drizzle-orm";

async function verify() {
  const [c] = await db.select({ count: count() }).from(companies);
  const [j] = await db.select({ count: count() }).from(jobs);

  console.log(`📦 Total Companies in DB: ${c.count}`);
  console.log(`💼 Total Active Jobs in DB: ${j.count}`);

  const sampleIndia = await db
    .select({
      name: companies.name,
      location: companies.location_text,
      tier: companies.size_tier,
    })
    .from(companies)
    .where(sql`location_text LIKE '%India%'`)
    .limit(6);

  console.log("\n🇮🇳 Sample Indian Startups in DB:");
  console.table(sampleIndia);
}

verify();
