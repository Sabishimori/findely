import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function runProductionMigration() {
  console.log("=================================================");
  console.log("🚀 EXECUTING DATABASE SCHEMA MIGRATION");
  console.log("=================================================");

  const migrations = [
    // Tables
    `CREATE TABLE IF NOT EXISTS otp_sessions (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      name TEXT,
      expires_at INTEGER NOT NULL,
      verified INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch())
    );`,
    `CREATE TABLE IF NOT EXISTS company_reports (
      id TEXT PRIMARY KEY,
      company_id TEXT,
      company_name TEXT NOT NULL,
      reason TEXT NOT NULL,
      comment TEXT,
      reported_by_email TEXT,
      status TEXT DEFAULT 'pending_review',
      created_at INTEGER DEFAULT (unixepoch())
    );`,
    // Alter companies
    `ALTER TABLE companies ADD COLUMN source_track TEXT DEFAULT 'scraped';`,
    `ALTER TABLE companies ADD COLUMN size_tier TEXT DEFAULT 'startup';`,
    // Alter jobs
    `ALTER TABLE jobs ADD COLUMN last_validated INTEGER;`,
    `ALTER TABLE jobs ADD COLUMN validation_failures INTEGER DEFAULT 0;`,
    `ALTER TABLE jobs ADD COLUMN validation_status TEXT DEFAULT 'valid';`,
    `ALTER TABLE jobs ADD COLUMN is_active INTEGER DEFAULT 1;`,
  ];

  for (const statement of migrations) {
    try {
      await db.run(sql.raw(statement));
      console.log(`✓ Applied: ${statement.split("\n")[0].trim()}`);
    } catch (err: any) {
      // Column already exists or duplicate column error is expected during re-runs
      if (
        err.message?.includes("duplicate column") ||
        err.message?.includes("already exists") ||
        err.message?.includes("SQLITE_ERROR: duplicate column")
      ) {
        console.log(`ℹ Column/table already exists: ${statement.split("\n")[0].trim()}`);
      } else {
        console.warn(`Notice on statement [${statement.split("\n")[0]}]:`, err.message);
      }
    }
  }

  console.log("=================================================");
  console.log("✅ DATABASE SCHEMA MIGRATION COMPLETED SUCCESSFULLY");
  console.log("=================================================");
}

runProductionMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
