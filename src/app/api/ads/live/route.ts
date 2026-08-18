import { NextResponse } from "next/server";
import { db } from "@/db";
import { advertisements } from "@/db/schema";
import { eq, desc, gt } from "drizzle-orm";

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

const DEFAULT_ECOSYSTEM_ADS: LiveAdResponseItem[] = [
  {
    id: "ad-freshworks",
    name: "Freshworks",
    tagline: "Global SaaS Customer Engagement Suite • 153 Live Roles",
    badgeType: "FEATURED",
    websiteUrl: "https://freshworks.com",
    logoUrl: "https://logo.clearbit.com/freshworks.com",
    location: "Chennai & Bengaluru",
    companyId: "company-freshworks",
    jobCount: 153,
  },
  {
    id: "slot-open-1",
    name: "Your Startup Here",
    tagline: "Reach 50,000+ Active Software Engineers & Founders Daily",
    badgeType: "AVAILABLE_SLOT",
    websiteUrl: "",
    isAvailableSlot: true,
    location: "Spotlight Slot 1",
  },
  {
    id: "ad-jumbo",
    name: "Jumbo",
    tagline: "Smart Wealth Management & Liquidity for High-Growth Founders",
    badgeType: "AD",
    websiteUrl: "https://jumbowealth.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=jumbowealth.com&sz=128",
    location: "Bengaluru",
  },
  {
    id: "ad-canva",
    name: "Canva",
    tagline: "Visual Communication & AI Creative Suite • 249 Open Roles",
    badgeType: "FEATURED",
    websiteUrl: "https://canva.com",
    logoUrl: "https://logo.clearbit.com/canva.com",
    location: "Sydney & Global",
    companyId: "company-canva",
    jobCount: 249,
  },
  {
    id: "slot-open-2",
    name: "Promote Your Launch",
    tagline: "Get Featured in the Live Ticker & Fly-to Map Pin • Instant Activation",
    badgeType: "AVAILABLE_SLOT",
    websiteUrl: "",
    isAvailableSlot: true,
    location: "Spotlight Slot 2",
  },
  {
    id: "ad-talboss",
    name: "TalBoss",
    tagline: "AI-Powered Founding Engineer Sourcing & Executive Hiring",
    badgeType: "AD",
    websiteUrl: "https://talboss.ai",
    logoUrl: "https://www.google.com/s2/favicons?domain=talboss.ai&sz=128",
    location: "Bengaluru & SF",
  },
  {
    id: "ad-phonepe",
    name: "PhonePe",
    tagline: "India's Digital Payments & Financial Services Powerhouse • 77 Roles",
    badgeType: "BOOST",
    websiteUrl: "https://phonepe.com",
    logoUrl: "https://logo.clearbit.com/phonepe.com",
    location: "Bengaluru",
    companyId: "company-phonepe",
    jobCount: 77,
  },
];

export async function GET() {
  try {
    let dbAds: any[] = [];
    try {
      // Ensure the table exists in SQLite/Turso
      dbAds = await db
        .select()
        .from(advertisements)
        .where(eq(advertisements.status, "active"))
        .orderBy(desc(advertisements.created_at));
    } catch (dbErr) {
      console.warn("[Advertisements API]: Table lookup fallback to default ecosystem ads", dbErr);
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

    // Merge live paid ads with default ecosystem slots
    const combinedAds = [...formattedDbAds, ...DEFAULT_ECOSYSTEM_ADS];

    return NextResponse.json({
      success: true,
      ads: combinedAds,
      activePaidCount: formattedDbAds.length,
    });
  } catch (error: any) {
    console.error("[Ads Live API Error]:", error);
    return NextResponse.json({
      success: true,
      ads: DEFAULT_ECOSYSTEM_ADS,
      activePaidCount: 0,
    });
  }
}
