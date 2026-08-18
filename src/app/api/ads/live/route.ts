import { NextResponse } from "next/server";
import { db } from "@/db";
import { advertisements } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export interface LiveAdResponseItem {
  id: string;
  name: string;
  tagline: string;
  badgeType: "AD" | "FEATURED" | "BOOST" | "LAUNCH" | "HIRING" | "AVAILABLE_SLOT";
  logoUrl?: string;
  websiteUrl: string;
  location?: string;
  isAvailableSlot?: boolean;
  companyId?: string;
  jobCount?: number;
}

const DEFAULT_FREE_SLOTS: LiveAdResponseItem[] = [
  {
    id: "free-slot-1",
    name: "Claim Free Spot ⚡",
    tagline: "Feature your startup, tool, or hiring in Findely's live spotlight • 100% Free",
    badgeType: "AVAILABLE_SLOT",
    websiteUrl: "",
    isAvailableSlot: true,
    location: "Global",
  },
  {
    id: "free-slot-2",
    name: "Promote Your Launch 🚀",
    tagline: "Broadcast your product to 50,000+ software engineers & founders • Zero Cost",
    badgeType: "AVAILABLE_SLOT",
    websiteUrl: "",
    isAvailableSlot: true,
    location: "Spotlight",
  },
  {
    id: "free-slot-3",
    name: "Post Your Hiring Surge ✨",
    tagline: "Instant 1-click live spotlight placement for frontier builders and startups",
    badgeType: "AVAILABLE_SLOT",
    websiteUrl: "",
    isAvailableSlot: true,
    location: "Live Stream",
  },
];

export async function GET() {
  try {
    let dbAds: any[] = [];
    try {
      dbAds = await db
        .select()
        .from(advertisements)
        .where(eq(advertisements.status, "active"))
        .orderBy(desc(advertisements.created_at));
    } catch (dbErr) {
      console.warn("[Advertisements API]: Table lookup fallback", dbErr);
    }

    const formattedDbAds: LiveAdResponseItem[] = dbAds.map((ad) => ({
      id: ad.id,
      name: ad.company_name,
      tagline: ad.tagline,
      badgeType: (ad.badge_type as any) || "AD",
      logoUrl: ad.logo_url || undefined,
      websiteUrl: ad.website_url,
      location: ad.location || "Global",
      isAvailableSlot: false,
    }));

    // Combine verified user ads with free available slot reservation prompts
    const combinedAds = [...formattedDbAds, ...DEFAULT_FREE_SLOTS];

    return NextResponse.json({
      success: true,
      ads: combinedAds,
      activePaidCount: formattedDbAds.length,
    });
  } catch (error: any) {
    console.error("[Ads Live API Error]:", error);
    return NextResponse.json({
      success: true,
      ads: DEFAULT_FREE_SLOTS,
      activePaidCount: 0,
    });
  }
}
