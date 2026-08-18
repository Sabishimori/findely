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

    await db.delete(advertisements).where(eq(advertisements.id, adId));

    return NextResponse.json({
      success: true,
      message: "Ad record permanently deleted.",
      adId,
    });
  } catch (error: any) {
    console.error("[Admin Ad Delete Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete ad" },
      { status: 500 }
    );
  }
}
