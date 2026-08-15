/**
 * Findely Automated Daily 5:00 PM – 10:00 PM (IST) Global Scraping Daemon
 * Orchestrates continuous multi-country scraping and Gemini Pro AI intelligence extraction during peak hiring hours.
 */

import * as path from "path";
import * as fs from "fs";

// Load .env.local natively
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  }
}

import { runBatchScrape } from "../src/lib/scraper/batchRunner";

function getISTDate(): { hours: number; minutes: number; timeStr: string } {
  const now = new Date();
  // IST is UTC + 5:30
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utcMs + 5.5 * 3600000);
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const timeStr = istTime.toLocaleTimeString("en-IN", { hour12: true, timeZone: "Asia/Kolkata" });
  return { hours, minutes, timeStr };
}

async function executeScrapeJob() {
  const { hours, timeStr } = getISTDate();
  console.log(`\n[${new Date().toISOString()}] 🕒 Current IST Time: ${timeStr}`);

  console.log("==================================================");
  console.log("🚀 Running Findely Daily 5 PM - 10 PM Scraping Cycle");
  console.log("==================================================");

  try {
    const results = await runBatchScrape();
    console.log("\n✅ [Scraping Cycle Complete]");
    console.log(`   Companies Scraped: ${results.companiesScraped}`);
    console.log(`   New Jobs Added:    ${results.newJobsAdded}`);
    console.log(`   Total Active Jobs: ${results.totalActiveJobs}`);
    console.log("==================================================");
  } catch (err: any) {
    console.error("❌ Scraping cycle error:", err);
  }
}

async function startDailyScheduler() {
  console.log("==================================================");
  console.log("⏰ Findely Daily 5:00 PM – 10:00 PM IST Scheduler Started");
  console.log("==================================================");
  console.log("Mode: Automated Hourly Scrapes between 17:00 and 22:00 IST");

  // Run immediate first pass
  await executeScrapeJob();

  // Check every 15 minutes
  setInterval(async () => {
    const { hours, minutes, timeStr } = getISTDate();
    
    // Active window: 17:00 (5 PM) to 22:00 (10 PM) IST
    const isWithinWindow = hours >= 17 && hours <= 22;

    // Trigger on the top of the hour within window (minute < 15)
    if (isWithinWindow && minutes < 15) {
      console.log(`🔔 5PM-10PM IST Active Window Match (${timeStr}) — Starting automated scrape...`);
      await executeScrapeJob();
    } else {
      console.log(`⏳ Standby: Next scheduled window is 5:00 PM – 10:00 PM IST (Current IST: ${timeStr})`);
    }
  }, 15 * 60 * 1000); // Check every 15 mins
}

startDailyScheduler();
