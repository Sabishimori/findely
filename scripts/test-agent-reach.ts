/**
 * Test Runner: Agent-Reach Social Intelligence Engine + Gemini Pro Routing
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

import { syncAgentReachToDatabase } from "../src/lib/scraper/agentReach";
import { extractSocialHiringWithGemini } from "../src/lib/scraper/geminiScraper";

async function testAgentReach() {
  console.log("==================================================");
  console.log("🌐 Testing Findely Agent-Reach + Gemini Pro AI Engine");
  console.log("==================================================");

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ No GEMINI_API_KEY found!");
    return;
  }
  console.log("🔑 Gemini API Key Active");

  try {
    const startTime = Date.now();

    // 1. Test with real-world Twitter/X founder hiring tweets
    console.log("🐦 [AgentReach] Feeding sample founder tweets from X and Reddit...");
    const sampleSocialPosts = [
      {
        author: "@swyx (Latent Space)",
        content: "Smol AI / Latent Space is hiring a Founding AI Systems Engineer in San Francisco (or remote)! We are building autonomous developer agents. Stack: Python, Rust, PyTorch, Next.js, vLLM. Salary: $160k - $240k + 1.5% equity. DM me or apply at https://latent.space/careers",
        url: "https://x.com/swyx/status/17892019283",
        platform: "x" as const,
      },
      {
        author: "@karpathy",
        content: "Eureka Labs is hiring 2 founding AI Curriculum & System Engineers in San Francisco, CA. Building AI native education. Stack: PyTorch, CUDA, React, Python. Apply at https://eurekalabs.ai/join",
        url: "https://x.com/karpathy/status/1812938491",
        platform: "x" as const,
      },
      {
        author: "@bengaluru_founder",
        content: "Sarvam-backed stealth agentic robotics startup in Indiranagar, Bengaluru is hiring 3 founding full-stack & CUDA hackers. Hybrid Bengaluru. ₹45L - ₹75L + heavy equity. Slide into my DMs or email hiring@stealth-blr.ai",
        url: "https://x.com/bengaluru_founder/status/182390123",
        platform: "x" as const,
      }
    ];

    const result = await syncAgentReachToDatabase();
    const socialResult = await extractSocialHiringWithGemini(sampleSocialPosts);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log("\n==================================================");
    console.log(`✅ [Agent-Reach Completed in ${elapsed}s]`);
    console.log(`   Live Signals Discovered: ${result.discovered}`);
    console.log(`   Social X/Twitter Signals Verified: ${socialResult.length}`);
    console.log("==================================================");

    if (socialResult.length > 0) {
      console.log("\n🐦 Verified Social / X Founder Hiring Tweets:");
      socialResult.forEach((sig, idx) => {
        console.log(`\n[Social Signal ${idx + 1}] ${sig.companyName} — ${sig.roleTitle}`);
        console.log(`   📍 Location: ${sig.location} (${sig.isRemote ? "Remote" : "Onsite/Hybrid"})`);
        console.log(`   🏷️ Tech Stack: ${sig.techStack.join(", ")}`);
        console.log(`   💰 Salary: ${sig.currency || "$"}${sig.minSalary ? sig.minSalary.toLocaleString() : 0} - ${sig.maxSalary ? sig.maxSalary.toLocaleString() : 0}`);
        console.log(`   👤 Founder: ${sig.founderName || "Founder"} (${sig.founderHandle || "X/Twitter"})`);
        console.log(`   🔗 Apply: ${sig.applyUrl}`);
        console.log(`   💡 Summary: ${sig.summary}`);
      });
    }

    if (result.signals.length > 0) {
      console.log("\n📋 Sample Discovered Hiring Signals:");
      result.signals.slice(0, 5).forEach((sig, idx) => {
        console.log(`\n[Signal ${idx + 1}] ${sig.companyName} — ${sig.roleTitle}`);
        console.log(`   📍 Location: ${sig.location} (${sig.isRemote ? "Remote" : "Onsite"})`);
        console.log(`   🏷️ Tech Stack: ${sig.techStack.join(", ")}`);
        console.log(`   💰 Salary: ${sig.currency || "$"}${sig.minSalary || 0} - ${sig.maxSalary || 0}`);
        console.log(`   🔗 Apply: ${sig.applyUrl}`);
        console.log(`   💡 Summary: ${sig.summary}`);
      });
    }
  } catch (err: any) {
    console.error("❌ Error running AgentReach:", err);
  }
}

testAgentReach();
