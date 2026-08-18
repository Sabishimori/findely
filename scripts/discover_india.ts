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

async function main() {
  console.log("==================================================================");
  console.log("🇮🇳 FINDELY INDIA-FIRST MULTI-TIER STARTUP INTELLIGENCE PIPELINE");
  console.log("==================================================================");
  console.log("🎯 Sourcing: Breakout, Mid-Tier & Boutique Studios/Agencies across Indian Hubs");
  console.log(`🔑 Gemini Pro Engine: ${process.env.GEMINI_API_KEY ? "Active (API Key Detected)" : "Curated High-Signal Knowledge Graph"}`);
  console.log("------------------------------------------------------------------");

  try {
    const stats = await runIndiaDiscoveryPipeline();
    console.log("\n==================================================================");
    console.log("🎉 DISCOVERY PIPELINE EXECUTION REPORT");
    console.log("==================================================================");
    console.log(`• Tech Hubs Scanned:     ${stats.hubsScanned}`);
    console.log(`• Total Companies:       ${stats.companiesDiscovered}`);
    console.log(`• New Startups Inserted: ${stats.companiesCreated}`);
    console.log(`• Existing Updated:      ${stats.companiesUpdated}`);
    console.log(`• Live Roles Synced:     ${stats.jobsSynced}`);
    console.log(`• Execution Duration:    ${(stats.durationMs / 1000).toFixed(2)}s`);
    console.log("\n🏢 Tier Breakdown:");
    console.log(`  - 🎨 Boutique Studios & Agencies: ${stats.tierBreakdown.boutique_studio || 0}`);
    console.log(`  - 🚀 Mid-Tier Startups:           ${stats.tierBreakdown.mid_tier || 0}`);
    console.log(`  - 🌟 Breakout Tech Ventures:      ${stats.tierBreakdown.breakout || 0}`);
    console.log(`  - ⚡ Bootstrapped & Indie Labs:   ${stats.tierBreakdown.bootstrapped || 0}`);
    console.log("==================================================================\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Pipeline failed with error:", err);
    process.exit(1);
  }
}

main();
