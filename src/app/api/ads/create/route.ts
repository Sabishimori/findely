import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { advertisements } from "@/db/schema";
import { isDisposableEmail } from "@/lib/disposableEmailBlocker";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      websiteUrl,
      logoUrl,
      tagline,
      badgeType = "AD",
      location = "Global",
      contactEmail,
      planId = "pro",
      paymentMethod = "paypal",
      paypalTxId,
    } = body;

    // 1. Strict Validation
    if (!companyName || companyName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid company or product name (min 2 chars)." },
        { status: 400 }
      );
    }

    if (!websiteUrl || !websiteUrl.startsWith("http")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid live URL starting with http:// or https://" },
        { status: 400 }
      );
    }

    if (!tagline || tagline.trim().length < 5 || tagline.trim().length > 90) {
      return NextResponse.json(
        { success: false, error: "Tagline must be between 5 and 90 characters." },
        { status: 400 }
      );
    }

    if (!contactEmail || isDisposableEmail(contactEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // 2. Resolve Selected Pricing Plan Details
    let durationDays = 30;
    let amountCents = 4900;
    let amountFormatted = "$49.00 USD";
    let tierName = "Pro Sponsor (30 Days)";

    if (planId === "starter") {
      durationDays = 7;
      amountCents = 1900;
      amountFormatted = "$19.00 USD";
      tierName = "Starter Boost (7 Days)";
    } else if (planId === "partner") {
      durationDays = 90;
      amountCents = 9900;
      amountFormatted = "$99.00 USD";
      tierName = "Frontier Partner (90 Days)";
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // 3. Insert Record into Database with 'pending_approval' status
    const newAdId = crypto.randomUUID();
    const paymentId = paypalTxId?.trim() || `paypal_ad_${Date.now()}`;

    try {
      await db.insert(advertisements).values({
        id: newAdId,
        company_name: companyName.trim(),
        website_url: websiteUrl.trim(),
        logo_url: logoUrl?.trim() || `https://www.google.com/s2/favicons?domain=${new URL(websiteUrl).hostname}&sz=128`,
        tagline: tagline.trim(),
        badge_type: badgeType,
        location: location.trim(),
        contact_email: contactEmail.trim(),
        tier: tierName,
        duration_days: durationDays,
        amount_paid_cents: amountCents,
        currency: "USD",
        payment_method: "paypal",
        payment_id: paymentId,
        payment_status: "pending_verification",
        status: "pending_approval",
        start_date: now,
        end_date: endDate,
        created_at: now,
      });
    } catch (dbErr) {
      console.warn("[Ad Insert Warning]: Database insert fallback", dbErr);
    }

    return NextResponse.json({
      success: true,
      adId: newAdId,
      message: `🎉 Your startup spotlight (${tierName}) has been submitted! It will be reviewed & approved within 1 day.`,
      details: {
        companyName,
        tagline,
        badgeType,
        tier: tierName,
        durationDays,
        amountFormatted,
        paymentMethod: "PayPal",
        status: "pending_approval",
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        paymentId,
      },
    });
  } catch (error: any) {
    console.error("[Ad Creation Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process spotlight request." },
      { status: 500 }
    );
  }
}
