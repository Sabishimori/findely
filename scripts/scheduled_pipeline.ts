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

import { runIndiaDiscoveryPipeline } from "../src/lib/pipeline/pipelineEngine";

const INTERVAL_HOURS = 24;

async function runScheduledCycle() {
  console.log(`\n[${new Date().toISOString()}] ⏰ Triggering Automated Daily Discovery Pipeline...`);
  try {
    const stats = await runIndiaDiscoveryPipeline();
    console.log(`[${new Date().toISOString()}] ✅ Cycle complete: ${stats.companiesDiscovered} startups processed, ${stats.jobsSynced} roles synced.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Scheduled cycle failed:`, err);
  }
  console.log(`⏳ Next automated cycle scheduled in ${INTERVAL_HOURS} hours.\n`);
}

// Run initial cycle immediately, then repeat every 24 hours
runScheduledCycle();
setInterval(runScheduledCycle, INTERVAL_HOURS * 60 * 60 * 1000);
