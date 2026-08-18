import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { advertisements } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { adId, reason } = await req.json();

    if (!adId) {
      return NextResponse.json(
        { success: false, error: "adId is required" },
        { status: 400 }
      );
    }

    await db
      .update(advertisements)
      .set({
        status: "rejected",
      })
      .where(eq(advertisements.id, adId));

    return NextResponse.json({
      success: true,
      message: "Ad status updated to rejected.",
      adId,
      status: "rejected",
      reason: reason || "Unverified payment or invalid creative",
    });
  } catch (error: any) {
    console.error("[Admin Ad Reject Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reject ad" },
      { status: 500 }
    );
  }
}
