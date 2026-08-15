import { NextRequest, NextResponse } from "next/server";
import { syncAgentReachToDatabase, discoverSocialHiringSignals } from "@/lib/scraper/agentReach";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return process.env.NODE_ENV === "development";
  }

  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  const urlKey = req.nextUrl.searchParams.get("key");
  return urlKey === cronSecret;
}

/**
 * GET /api/scrape/social-reach
 * Runs AgentReach to scan public developer signals through Gemini Pro AI
 */
export async function GET(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dryRun = req.nextUrl.searchParams.get("dryRun") === "true";

    if (dryRun) {
      const signals = await discoverSocialHiringSignals();
      return NextResponse.json({
        success: true,
        mode: "dry-run",
        discoveredCount: signals.length,
        signals,
      });
    }

    const result = await syncAgentReachToDatabase();
    return NextResponse.json({
      success: true,
      message: "AgentReach sync completed successfully",
      discovered: result.discovered,
      inserted: result.inserted,
      signals: result.signals,
    });
  } catch (err: any) {
    console.error("[AgentReach Route Error]:", err);
    return NextResponse.json(
      { error: "AgentReach scanning failed", details: err.message },
      { status: 500 }
    );
  }
}
