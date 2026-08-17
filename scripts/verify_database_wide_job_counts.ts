import { db } from "../src/db";
import { companies, jobs } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { getCompanyIntelligence } from "../src/lib/companyIntelligence";

async function verifyAllCompanies() {
  console.log("=================================================================");
  console.log("🔍 DATABASE-WIDE COMPARISON: (Office Network Sum) vs (Jobs Count)");
  console.log("=================================================================");

  const allComps = await db.select().from(companies);
  const allActiveJobs = await db.select().from(jobs).where(eq(jobs.is_active, true));

  // Group jobs by company_id
  const jobsByCompany = new Map<string, typeof allActiveJobs>();
  for (const j of allActiveJobs) {
    const list = jobsByCompany.get(j.company_id) || [];
    list.push(j);
    jobsByCompany.set(j.company_id, list);
  }

  let perfectMatchCount = 0;
  const mismatches: Array<{
    name: string;
    companyId: string;
    dbJobCount: number;
    openPositionsCount: number;
    officeSum: number;
    branches: Array<{ city: string; jobs: number }>;
  }> = [];

  for (const comp of allComps) {
    const companyJobs = jobsByCompany.get(comp.id) || [];
    const intel = getCompanyIntelligence({
      ...comp,
      jobs: companyJobs,
    });

    const officeSum = intel.officeNetwork.reduce((sum, b) => sum + (b.jobs || 0), 0);
    const openPositions = intel.openPositionsCount;
    const dbCount = companyJobs.length;

    if (officeSum === dbCount && openPositions === dbCount) {
      perfectMatchCount++;
    } else {
      mismatches.push({
        name: comp.name,
        companyId: comp.id,
        dbJobCount: dbCount,
        openPositionsCount: openPositions,
        officeSum,
        branches: intel.officeNetwork.map((b) => ({ city: b.city, jobs: b.jobs })),
      });
    }
  }

  console.log(`\nTotal Companies Checked: ${allComps.length}`);
  console.log(`✅ Perfect Count Matches (Office Network Sum === Open Positions === DB Jobs): ${perfectMatchCount}/${allComps.length}`);

  if (mismatches.length > 0) {
    console.log(`\n❌ Mismatched Companies (${mismatches.length}):`);
    for (const m of mismatches) {
      console.log(`  - "${m.name}" (ID: ${m.companyId}): DB Jobs=${m.dbJobCount}, Open Positions=${m.openPositionsCount}, Office Sum=${m.officeSum}`);
    }
  } else {
    console.log(`\n🎉 100% of all ${allComps.length} companies have exact 1-to-1 matching job counts!`);
  }

  console.log("\n=================================================================");
  console.log("5 Sample Companies Across Different ATS Sources:");
  console.log("=================================================================");
  
  const sampleNames = ["Scale AI", "Rover", "Linear", "Autodesk", "Neural Mesh"];
  for (const name of sampleNames) {
    const matched = allComps.find((c) => c.name.toLowerCase().includes(name.toLowerCase()));
    if (matched) {
      const compJobs = jobsByCompany.get(matched.id) || [];
      const intel = getCompanyIntelligence({ ...matched, jobs: compJobs });
      const officeSum = intel.officeNetwork.reduce((sum, b) => sum + b.jobs, 0);
      console.log(`\nCompany: "${matched.name}" (Source Track: ${matched.source_track || "scraped"})`);
      console.log(`  → DB Active Jobs: ${compJobs.length}`);
      console.log(`  → Open Positions: ${intel.openPositionsCount}`);
      console.log(`  → Office Network Sum: ${officeSum}`);
      console.log(`  → Branches (${intel.officeNetwork.length}):`, intel.officeNetwork.slice(0, 3).map((b) => `${b.city}: ${b.jobs} roles`));
    }
  }
}

verifyAllCompanies().catch(console.error);
