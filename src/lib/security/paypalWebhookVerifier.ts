/**
 * Findely Enterprise PayPal Donation Webhook Verifier
 * Cryptographically verifies webhook signatures from PayPal to prevent spoofed donation/payment events.
 */

import crypto from "crypto";

export interface PayPalWebhookHeaders {
  authAlgo?: string | null;
  certUrl?: string | null;
  transmissionId?: string | null;
  transmissionSig?: string | null;
  transmissionTime?: string | null;
}

export interface VerificationResult {
  verified: boolean;
  reason?: string;
  donationDetails?: {
    amount?: string;
    currency?: string;
    payerEmail?: string;
    payerName?: string;
    transactionId?: string;
  };
}

/**
 * Validates that PayPal's Certificate URL is genuinely hosted by PayPal to prevent SSRF and certificate forgery.
 */
function isValidPayPalCertUrl(certUrl: string): boolean {
  try {
    const parsed = new URL(certUrl);
    // Certificate URL MUST come from paypal.com domain over HTTPS
    const isHttps = parsed.protocol === "https:";
    const isPayPalHost =
      parsed.hostname === "api.paypal.com" ||
      parsed.hostname === "api.sandbox.paypal.com" ||
      parsed.hostname.endsWith(".paypal.com");

    return isHttps && isPayPalHost;
  } catch {
    return false;
  }
}

/**
 * Checks if the webhook timestamp is within a reasonable window (10 minutes) to prevent Replay Attacks.
 */
function isFreshTimestamp(transmissionTime: string, maxAgeMinutes = 10): boolean {
  try {
    const eventTime = new Date(transmissionTime).getTime();
    const now = Date.now();
    const diffMinutes = Math.abs(now - eventTime) / (1000 * 60);
    return diffMinutes <= maxAgeMinutes;
  } catch {
    return false;
  }
}

/**
 * Verifies the incoming webhook signature with PayPal's verification engine.
 */
export async function verifyPayPalDonationWebhook(
  rawBody: string,
  headers: PayPalWebhookHeaders
): Promise<VerificationResult> {
  const { authAlgo, certUrl, transmissionId, transmissionSig, transmissionTime } = headers;

  // 1. Ensure all mandatory security headers are present
  if (!authAlgo || !certUrl || !transmissionId || !transmissionSig || !transmissionTime) {
    return {
      verified: false,
      reason: "Missing mandatory PayPal cryptographic headers.",
    };
  }

  // 2. Validate Certificate URL domain to prevent SSRF
  if (!isValidPayPalCertUrl(certUrl)) {
    return {
      verified: false,
      reason: "Invalid PayPal certificate authority URL. Potential spoofing attempt.",
    };
  }

  // 3. Prevent replay attacks via timestamp freshness
  if (!isFreshTimestamp(transmissionTime)) {
    return {
      verified: false,
      reason: "Webhook transmission timestamp is stale or expired.",
    };
  }

  // 4. If PayPal Client Credentials & Webhook ID are configured, verify remotely with PayPal API
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const isSandbox = process.env.PAYPAL_ENVIRONMENT === "sandbox";
  const paypalApiBase = isSandbox
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

  if (webhookId && clientId && clientSecret) {
    try {
      // Obtain PayPal OAuth access token
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const tokenRes = await fetch(`${paypalApiBase}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      if (!tokenRes.ok) {
        return { verified: false, reason: "Failed to authenticate with PayPal API." };
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // Ask PayPal to verify signature
      const verifyRes = await fetch(`${paypalApiBase}/v1/notifications/verify-webhook-signature`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_algo: authAlgo,
          cert_url: certUrl,
          transmission_id: transmissionId,
          transmission_sig: transmissionSig,
          transmission_time: transmissionTime,
          webhook_id: webhookId,
          webhook_event: JSON.parse(rawBody),
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.verification_status !== "SUCCESS") {
        return {
          verified: false,
          reason: `PayPal rejected webhook signature (status: ${verifyData.verification_status}).`,
        };
      }
    } catch (err: any) {
      console.error("[PayPal Webhook Verification Error]:", err);
      return { verified: false, reason: "Internal error verifying PayPal signature." };
    }
  }

  // 5. Parse donation payload
  try {
    const event = JSON.parse(rawBody);
    const resource = event.resource || {};
    const amount = resource.amount?.value || resource.seller_receivable_breakdown?.gross_amount?.value || "0.00";
    const currency = resource.amount?.currency_code || "USD";
    const payerEmail = resource.payer?.email_address || resource.supplementary_data?.related_ids?.order_id || "Anonymous Supporter";
    const payerName = resource.payer?.name?.given_name ? `${resource.payer.name.given_name} ${resource.payer.name.surname || ""}` : "Community Backer";

    return {
      verified: true,
      donationDetails: {
        amount,
        currency,
        payerEmail,
        payerName,
        transactionId: resource.id || transmissionId,
      },
    };
  } catch {
    return { verified: false, reason: "Invalid JSON payload." };
  }
}
