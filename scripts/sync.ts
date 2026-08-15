import { runBatchScrape } from "../src/lib/scraper/batchRunner";

async function main() {
  console.log("==================================================");
  console.log("🚀 Starting Findely Frontier ATS Scraper Pipeline");
  console.log("==================================================");

  const results = await runBatchScrape();
  
  console.log("\n==================================================");
  console.log("✅ Scraping Pipeline Complete!");
  console.log(`Total Companies Scraped: ${results.companiesScraped}`);
  console.log(`New Jobs Discovered: ${results.newJobsAdded}`);
  console.log(`Total Active Jobs in DB: ${results.totalActiveJobs}`);
  console.log("==================================================");
}

main().catch((err) => {
  console.error("Scraper failed:", err);
  process.exit(1);
});
