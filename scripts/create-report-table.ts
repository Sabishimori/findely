import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function createTable() {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS company_reports (
      id TEXT PRIMARY KEY,
      company_id TEXT,
      company_name TEXT NOT NULL,
      reason TEXT NOT NULL,
      comment TEXT,
      reported_by_email TEXT,
      status TEXT NOT NULL DEFAULT 'pending_review',
      created_at INTEGER
    );
  `);
  console.log("✅ company_reports table successfully verified in database!");
}

createTable();
