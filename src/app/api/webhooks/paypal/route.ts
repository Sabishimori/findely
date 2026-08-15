import { NextRequest, NextResponse } from "next/server";
import { verifyPayPalDonationWebhook } from "@/lib/security/paypalWebhookVerifier";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const headers = {
      authAlgo: req.headers.get("paypal-auth-algo"),
      certUrl: req.headers.get("paypal-cert-url"),
      transmissionId: req.headers.get("paypal-transmission-id"),
      transmissionSig: req.headers.get("paypal-transmission-sig"),
      transmissionTime: req.headers.get("paypal-transmission-time"),
    };

    const verification = await verifyPayPalDonationWebhook(rawBody, headers);

    if (!verification.verified) {
      console.warn(`[PayPal Security Block]: Webhook verification failed: ${verification.reason}`);
      return NextResponse.json(
        { success: false, error: verification.reason || "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const { donationDetails } = verification;

    // Log verified builder support donation
    console.log(`💚 [Verified Donation Received]: $${donationDetails?.amount} ${donationDetails?.currency} from ${donationDetails?.payerName} (${donationDetails?.payerEmail}) - Tx: ${donationDetails?.transactionId}`);

    return NextResponse.json({
      success: true,
      message: "Donation verified and acknowledged. Thank you for supporting Findely!",
      transactionId: donationDetails?.transactionId,
    });
  } catch (error: any) {
    console.error("[PayPal Webhook Handler Error]:", error);
    return NextResponse.json(
      { success: false, error: "Internal processing error" },
      { status: 500 }
    );
  }
}
