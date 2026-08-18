import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { advertisements } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    let allAds: any[] = [];
    try {
      allAds = await db
        .select()
        .from(advertisements)
        .orderBy(desc(advertisements.created_at));
    } catch (dbErr) {
      console.warn("[Admin Ads API Warning]: DB query fallback", dbErr);
    }

    const pending = allAds.filter((a) => a.status === "pending_approval" || a.status === "pending");
    const active = allAds.filter((a) => a.status === "active");
    const rejected = allAds.filter((a) => a.status === "rejected");
    const expired = allAds.filter((a) => a.status === "expired");

    const totalRevenueCents = allAds
      .filter((a) => a.payment_status === "paid" || a.payment_status === "completed" || a.status === "active")
      .reduce((sum, a) => sum + (a.amount_paid_cents || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        total: allAds.length,
        pendingCount: pending.length,
        activeCount: active.length,
        rejectedCount: rejected.length,
        expiredCount: expired.length,
        totalRevenueUsd: (totalRevenueCents / 100).toFixed(2),
      },
      ads: allAds,
      pending,
      active,
      rejected,
      expired,
    });
  } catch (error: any) {
    console.error("[Admin Ads API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch ads list" },
      { status: 500 }
    );
  }
}
