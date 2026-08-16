import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';
import path from 'path';

async function exportToTurso() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  if (!tursoUrl || !tursoAuthToken) {
    console.error(`
❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in environment.

👉 How to get your 100% Free Turso Database:
1. Visit https://turso.tech/ and sign up for free (No credit card needed)
2. Create a database: 'turso db create findely'
3. Get URL: 'turso db show findely --url'
4. Create Token: 'turso db tokens create findely'
5. Set environment variables:
   TURSO_DATABASE_URL=libsql://findely-yourusername.turso.io
   TURSO_AUTH_TOKEN=your_token_here
`);
    process.exit(1);
  }

  console.log("🔄 Connecting to local SQLite database...");
  const dbPath = path.join(process.cwd(), 'sqlite.db');
  const sqlite = new Database(dbPath);

  console.log(`☁️ Connecting to Turso Cloud DB: ${tursoUrl}...`);
  const turso = createClient({
    url: tursoUrl,
    authToken: tursoAuthToken,
  });

  // 1. Ensure tables exist on Turso
  console.log("🛠️ Initializing tables and schema on Turso Cloud...");
  await turso.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'individual',
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      phone TEXT,
      location TEXT,
      employment_status TEXT DEFAULT 'actively_looking',
      experience_level TEXT DEFAULT 'Senior (5+ yrs)',
      availability TEXT DEFAULT 'immediate',
      resume_filename TEXT DEFAULT 'Alex_Rivera_CV_2026.pdf',
      resume_url TEXT,
      bio TEXT,
      skills_json TEXT,
      linkedin_url TEXT,
      github_url TEXT,
      behance_url TEXT,
      instagram_url TEXT,
      website_url TEXT,
      project_url TEXT,
      avatar_url TEXT,
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      website_url TEXT NOT NULL,
      logo_url TEXT,
      description TEXT,
      location_text TEXT,
      latitude REAL,
      longitude REAL,
      founded_year INTEGER,
      company_size TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      founders_json TEXT,
      hr_leads_json TEXT,
      tech_stack_json TEXT,
      claimed_by TEXT,
      status TEXT NOT NULL DEFAULT 'verified',
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      title TEXT NOT NULL,
      role_category TEXT NOT NULL,
      location_text TEXT,
      work_mode TEXT NOT NULL DEFAULT 'hybrid',
      salary_range TEXT,
      description TEXT,
      skills_json TEXT,
      apply_url TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      source_type TEXT NOT NULL DEFAULT 'direct_ats',
      posted_at INTEGER,
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      job_id TEXT,
      company_id TEXT,
      job_title TEXT NOT NULL,
      company_name TEXT NOT NULL,
      company_logo TEXT,
      location_text TEXT,
      salary_range TEXT,
      apply_url TEXT,
      status TEXT NOT NULL DEFAULT 'saved',
      notes TEXT,
      applied_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS company_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      website_url TEXT NOT NULL,
      careers_url TEXT,
      requester_email TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      ai_confidence REAL,
      ai_analysis_json TEXT,
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS company_reports (
      id TEXT PRIMARY KEY,
      company_id TEXT,
      company_name TEXT NOT NULL,
      job_id TEXT,
      job_title TEXT,
      reason TEXT NOT NULL,
      details TEXT,
      reporter_email TEXT,
      status TEXT NOT NULL DEFAULT 'pending_review',
      created_at INTEGER
    );
  `);

  // 2. Export Companies
  const companies = sqlite.prepare('SELECT * FROM companies').all() as any[];
  console.log(`📦 Exporting ${companies.length} Companies to Turso...`);
  for (const c of companies) {
    await turso.execute({
      sql: `INSERT OR REPLACE INTO companies (
        id, name, website_url, logo_url, description, location_text, latitude, longitude,
        founded_year, company_size, contact_email, contact_phone, founders_json, hr_leads_json,
        tech_stack_json, claimed_by, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        c.id, c.name, c.website_url, c.logo_url, c.description, c.location_text, c.latitude, c.longitude,
        c.founded_year, c.company_size, c.contact_email, c.contact_phone, c.founders_json, c.hr_leads_json,
        c.tech_stack_json, c.claimed_by, c.status, c.created_at, c.updated_at
      ]
    });
  }

  // 3. Export Jobs
  const jobs = sqlite.prepare('SELECT * FROM jobs').all() as any[];
  console.log(`📦 Exporting ${jobs.length} Jobs to Turso...`);
  for (const j of jobs) {
    await turso.execute({
      sql: `INSERT OR REPLACE INTO jobs (
        id, company_id, title, role_category, location_text, work_mode, salary_range,
        description, skills_json, apply_url, is_active, source_type, posted_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        j.id, j.company_id, j.title, j.role_category, j.location_text, j.work_mode, j.salary_range,
        j.description, j.skills_json, j.apply_url, j.is_active, j.source_type, j.posted_at, j.created_at, j.updated_at
      ]
    });
  }

  // 4. Export Profiles
  const profiles = sqlite.prepare('SELECT * FROM profiles').all() as any[];
  console.log(`📦 Exporting ${profiles.length} Profiles to Turso...`);
  for (const p of profiles) {
    await turso.execute({
      sql: `INSERT OR REPLACE INTO profiles (
        id, user_id, name, username, email, phone, location, employment_status,
        experience_level, availability, resume_filename, resume_url, bio, skills_json,
        linkedin_url, github_url, behance_url, instagram_url, website_url, project_url,
        avatar_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.id, p.user_id, p.name, p.username, p.email, p.phone, p.location, p.employment_status,
        p.experience_level, p.availability, p.resume_filename, p.resume_url, p.bio, p.skills_json,
        p.linkedin_url, p.github_url, p.behance_url, p.instagram_url, p.website_url, p.project_url,
        p.avatar_url, p.created_at, p.updated_at
      ]
    });
  }

  console.log("🎉 All data successfully exported to Turso Cloud Database!");
}

exportToTurso().catch(console.error);
