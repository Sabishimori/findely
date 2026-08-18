import { db } from "./index";
import { sql } from "drizzle-orm";

export async function ensureAdsTable() {
  try {
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS advertisements (
        id TEXT PRIMARY KEY,
        company_name TEXT NOT NULL,
        website_url TEXT NOT NULL,
        logo_url TEXT,
        tagline TEXT NOT NULL,
        badge_type TEXT NOT NULL DEFAULT 'AD',
        location TEXT DEFAULT 'Global',
        contact_email TEXT NOT NULL,
        tier TEXT NOT NULL DEFAULT 'Pro Sponsor (30 Days)',
        duration_days INTEGER NOT NULL DEFAULT 30,
        amount_paid_cents INTEGER NOT NULL DEFAULT 4900,
        currency TEXT NOT NULL DEFAULT 'USD',
        payment_method TEXT DEFAULT 'paypal',
        payment_id TEXT,
        payment_status TEXT NOT NULL DEFAULT 'pending_verification',
        status TEXT NOT NULL DEFAULT 'pending_approval',
        impressions_count INTEGER DEFAULT 0,
        clicks_count INTEGER DEFAULT 0,
        start_date INTEGER,
        end_date INTEGER,
        created_at INTEGER
      );
    `);
    console.log("✅ Advertisements table successfully ensured.");
  } catch (err) {
    console.error("Error creating advertisements table:", err);
  }
}

// Execute if run directly
if (require.main === module) {
  ensureAdsTable().then(() => process.exit(0));
}
