import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { advertisements } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { adId } = await req.json();

    if (!adId) {
      return NextResponse.json(
        { success: false, error: "adId is required" },
        { status: 400 }
      );
    }

    // Fetch existing ad to calculate end date based on duration
    const existing = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, adId))
      .limit(1);

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ad not found" },
        { status: 404 }
      );
    }

    const ad = existing[0];
    const durationDays = ad.duration_days || 30;
    const now = new Date();
    const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    await db
      .update(advertisements)
      .set({
        status: "active",
        payment_status: "paid",
        start_date: now,
        end_date: endDate,
      })
      .where(eq(advertisements.id, adId));

    return NextResponse.json({
      success: true,
      message: `🎉 Ad for ${ad.company_name} is now approved and LIVE on Findely's live ticker for ${durationDays} days!`,
      adId,
      status: "active",
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
    });
  } catch (error: any) {
    console.error("[Admin Ad Approve Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to approve ad" },
      { status: 500 }
    );
  }
}
