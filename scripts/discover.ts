import { scrapeFounderWebsite } from "../src/lib/scraper/founderScraper";

async function main() {
  const targetUrl = process.argv[2] || "https://linear.app";
  console.log(`🔍 Discovering & Scraping Company Website: ${targetUrl}`);

  const scraped = await scrapeFounderWebsite(targetUrl);
  if (!scraped) {
    console.log("❌ Could not extract company information from URL.");
    return;
  }

  console.log("\n✅ Company Discovered:");
  console.log(`Name: ${scraped.name}`);
  console.log(`Domain: ${scraped.domain}`);
  console.log(`Location: ${scraped.primaryLocation.city} (${scraped.primaryLocation.lat}, ${scraped.primaryLocation.lng})`);
  console.log(`Description: ${scraped.description}`);
  console.log(`Jobs Found: ${scraped.jobs.length}`);
  scraped.jobs.forEach((j, i) => {
    console.log(`  ${i + 1}. ${j.title} (${j.location})`);
  });
}

main().catch((err) => {
  console.error("Discover failed:", err);
  process.exit(1);
});
