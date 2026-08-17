import { NextRequest, NextResponse } from "next/server";
import { validateBatchJobs } from "@/lib/scraper/validator";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow 60s for batch validation

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    // In local development without CRON_SECRET configured, allow execution
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

    const limitParam = req.nextUrl.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 30;

    console.log(`[Findely Validator Cron] Validating batch of ${limit} jobs...`);
    const results = await validateBatchJobs({ limit });

    return NextResponse.json({
      message: "Job validation batch completed",
      ...results,
    });
  } catch (err: any) {
    console.error("[Findely Validator Cron] Error during validation batch:", err);
    return NextResponse.json(
      { error: "Validation job execution failed", details: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized validator trigger" }, { status: 401 });
    }

    let limit = 30;
    try {
      const body = await req.json();
      if (body?.limit) limit = body.limit;
    } catch (_) {}

    console.log(`[Findely Validator] Manual validation triggered for ${limit} jobs...`);
    const results = await validateBatchJobs({ limit });

    return NextResponse.json({
      message: "Manual validation triggered successfully",
      ...results,
    });
  } catch (err: any) {
    console.error("[Findely Validator] Manual validation error:", err);
    return NextResponse.json(
      { error: "Manual validation execution failed", details: err?.message },
      { status: 500 }
    );
  }
}
