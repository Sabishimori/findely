import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { runBatchScrape } from "@/lib/scraper/batchRunner";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow 60s for multi-board scraping on Vercel Pro/Hobby

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    // In production without secret configured, block by default
    return process.env.NODE_ENV === "development";
  }

  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  const urlKey = req.nextUrl.searchParams.get("key");
  return urlKey === cronSecret;
}

export async function GET(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
    }

    console.log(`[Findely Cron] Running daily 5:00 PM - 10:00 PM batch scrape...`);
    const results = await runBatchScrape();
    revalidateTag("map-data", { expire: 0 });

    return NextResponse.json({
      message: "Daily scrape executed successfully",
      ...results,
    });
  } catch (err: any) {
    console.error("[Findely Cron] Error during batch scrape:", err);
    return NextResponse.json(
      { error: "Scrape job execution failed", details: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized batch scrape trigger" }, { status: 401 });
    }

    console.log(`[Findely Batch] Running authorized manual scrape...`);
    const results = await runBatchScrape();
    revalidateTag("map-data", { expire: 0 });
    return NextResponse.json({
      message: "Manual batch scrape triggered successfully",
      ...results,
    });
  } catch (err: any) {
    console.error("[Findely Cron] Manual scrape error:", err);
    return NextResponse.json(
      { error: "Manual scrape execution failed", details: err?.message },
      { status: 500 }
    );
  }
}
