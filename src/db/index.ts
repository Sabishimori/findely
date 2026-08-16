import * as schema from './schema';
import path from 'path';

// Support both 100% Free Turso Cloud SQLite and Local SQLite
const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

const isTurso = Boolean(tursoUrl && (tursoUrl.startsWith('libsql://') || tursoUrl.startsWith('https://')));

let dbInstance: any;

if (isTurso) {
  const { createClient } = require('@libsql/client');
  const { drizzle } = require('drizzle-orm/libsql');

  const client = createClient({
    url: tursoUrl!,
    authToken: tursoAuthToken,
  });

  // Ensure tables and performance indexes exist on Turso
  client.executeMultiple(`
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

    CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
    CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
    CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
    CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
    CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
    CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
    CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
  `).catch((err: any) => console.warn("Turso schema sync notice:", err));

  dbInstance = drizzle(client, { schema });
} else {
  const Database = require('better-sqlite3');
  const { drizzle } = require('drizzle-orm/better-sqlite3');

  const dbPath = path.join(process.cwd(), 'sqlite.db');
  const sqlite = new Database(dbPath);

  // Ensure tables exist on cold-start (critical for local dev and preview sandboxes)
  try {
    sqlite.exec(`
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

      CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
      CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
      CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
      CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
      CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
      CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
    `);
  } catch (e) {
    console.warn("Table auto-migration notice:", e);
  }

  dbInstance = drizzle(sqlite, { schema });
}

export const db = dbInstance;
