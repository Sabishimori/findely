import Database from "better-sqlite3";

const db = new Database("sqlite.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS otp_sessions (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    name TEXT,
    expires_at INTEGER NOT NULL,
    verified INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS company_reports (
    id TEXT PRIMARY KEY,
    company_id TEXT,
    company_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    comment TEXT,
    reported_by_email TEXT,
    status TEXT DEFAULT 'pending_review',
    created_at INTEGER DEFAULT (unixepoch())
  );
`);

console.log("✅ otp_sessions and company_reports tables verified and created in sqlite.db");
