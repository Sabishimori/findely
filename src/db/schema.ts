import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('individual'), // 'individual' | 'company_rep'
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Candidate Profile Suite
export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text('user_id').references(() => users.id),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull(),
  phone: text('phone'),
  location: text('location'),
  employment_status: text('employment_status').default('actively_looking'), // 'freelancer' | 'fresher' | 'employed' | 'actively_looking'
  experience_level: text('experience_level').default('Senior (5+ yrs)'),
  availability: text('availability').default('immediate'), // 'immediate' | '2_weeks' | '1_month'
  resume_filename: text('resume_filename').default('Alex_Rivera_CV_2026.pdf'),
  resume_url: text('resume_url'),
  bio: text('bio'),
  skills_json: text('skills_json'), // JSON array of string tags
  
  // Social & Project Handles
  linkedin_url: text('linkedin_url'),
  github_url: text('github_url'),
  behance_url: text('behance_url'),
  instagram_url: text('instagram_url'),
  website_url: text('website_url'),
  project_url: text('project_url'),
  
  avatar_url: text('avatar_url'),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const companies = sqliteTable('companies', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  website_url: text('website_url').notNull(),
  logo_url: text('logo_url'),
  description: text('description'),
  location_text: text('location_text'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  
  // Deep Company Intelligence
  founded_year: integer('founded_year'),
  company_size: text('company_size'), // e.g. "500-1,000 employees"
  contact_email: text('contact_email'),
  contact_phone: text('contact_phone'),
  founders_json: text('founders_json'), // JSON array of [{ name, role, linkedin_url, avatar_url }]
  hr_leads_json: text('hr_leads_json'), // JSON array of [{ name, role, linkedin_url, avatar_url }]
  tech_stack_json: text('tech_stack_json'), // JSON array of string tags
  
  claimed_by: text('claimed_by').references(() => users.id),
  status: text('status').notNull().default('verified'), // 'unverified' | 'verified' | 'flagged'
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const scrape_sources = sqliteTable('scrape_sources', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  company_id: text('company_id').notNull().references(() => companies.id),
  source_type: text('source_type').notNull(),
  source_url: text('source_url').notNull(),
  consent_given: integer('consent_given', { mode: 'boolean' }).default(true),
  consented_by: text('consented_by').references(() => users.id),
  last_crawled: integer('last_crawled', { mode: 'timestamp' }),
  last_status: text('last_status'),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  company_id: text('company_id').notNull().references(() => companies.id),
  title: text('title').notNull(),
  description: text('description'),
  full_description: text('full_description'),
  location_text: text('location_text').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  salary_range: text('salary_range'),
  job_type: text('job_type').default('Full-time'),
  experience_level: text('experience_level').default('Senior'),
  geocode_status: text('geocode_status').notNull().default('ok'),
  apply_url: text('apply_url'),
  posted_at: integer('posted_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  first_seen_at: integer('first_seen_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  last_seen_at: integer('last_seen_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  is_active: integer('is_active', { mode: 'boolean' }).default(true),
  source_id: text('source_id').references(() => scrape_sources.id),
});

export const scrape_runs = sqliteTable('scrape_runs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  scrape_source_id: text('scrape_source_id').notNull().references(() => scrape_sources.id),
  started_at: integer('started_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  finished_at: integer('finished_at', { mode: 'timestamp' }),
  jobs_found: integer('jobs_found').default(0),
  jobs_new: integer('jobs_new').default(0),
  jobs_closed: integer('jobs_closed').default(0),
  status: text('status').notNull().default('success'),
  error_message: text('error_message'),
});

// Unified Application & Saved Jobs Tracker
export const applications = sqliteTable('applications', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text('user_id').references(() => users.id),
  job_id: text('job_id').references(() => jobs.id),
  company_id: text('company_id').references(() => companies.id),
  job_title: text('job_title').notNull(),
  company_name: text('company_name').notNull(),
  company_logo: text('company_logo'),
  location_text: text('location_text'),
  apply_url: text('apply_url'),
  salary_range: text('salary_range'),
  status: text('status').notNull().default('applied'), // 'applied' | 'saved' | 'interviewing' | 'offer' | 'rejected' | 'archived'
  applied_at: integer('applied_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  notes: text('notes'),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Company Requests with AI Verification
export const company_requests = sqliteTable('company_requests', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  website_url: text('website_url').notNull(),
  careers_url: text('careers_url').notNull(),
  location_text: text('location_text'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  description: text('description'),
  logo_url: text('logo_url'),
  submitted_by_email: text('submitted_by_email'),
  status: text('status').notNull().default('pending_scan'),
  ai_safety_score: integer('ai_safety_score').default(98),
  ai_analysis: text('ai_analysis'),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Community Flagging & Quality Reports
export const company_reports = sqliteTable('company_reports', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  company_id: text('company_id').references(() => companies.id),
  company_name: text('company_name').notNull(),
  reason: text('reason').notNull(), // 'ghost_jobs' | 'misleading_comp' | 'scam_phishing' | 'wrong_location' | 'out_of_business' | 'other'
  comment: text('comment'),
  reported_by_email: text('reported_by_email'),
  status: text('status').notNull().default('pending_review'), // 'pending_review' | 'resolved' | 'dismissed'
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

