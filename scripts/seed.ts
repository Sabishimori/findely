import { db } from '../src/db';
import { users, profiles, companies, scrape_sources, jobs, scrape_runs, applications, company_requests } from '../src/db/schema';

async function main() {
  console.log('Seeding Finders v3 with Candidate Profiles, Deep Companies, and Fresh Date Timestamps...');

  try { await db.delete(applications); } catch (_) {}
  try { await db.delete(company_requests); } catch (_) {}
  try { await db.delete(scrape_runs); } catch (_) {}
  try { await db.delete(jobs); } catch (_) {}
  try { await db.delete(scrape_sources); } catch (_) {}
  try { await db.delete(profiles); } catch (_) {}
  try { await db.delete(companies); } catch (_) {}
  try { await db.delete(users); } catch (_) {}

  // Seed User & Candidate Profile
  const newUsers = await db.insert(users).values([
    { email: 'alex@finders.app', role: 'individual' },
    { email: 'rep@stripe.com', role: 'company_rep' },
    { email: 'rep@vercel.com', role: 'company_rep' },
  ]).returning();
  const alexId = newUsers[0].id;
  const repId = newUsers[1].id;

  await db.insert(profiles).values({
    user_id: alexId,
    name: 'Alex Rivera',
    username: 'alexrivera',
    email: 'alex@finders.app',
    phone: '+1 (415) 890-4820',
    location: 'San Francisco, CA & Remote',
    employment_status: 'actively_looking',
    experience_level: 'Senior Product Designer & Full-Stack (6+ yrs)',
    availability: 'immediate',
    resume_filename: 'Alex_Rivera_Senior_Designer_CV.pdf',
    resume_url: 'https://finders.app/resumes/alex_rivera.pdf',
    bio: 'Product Designer & Frontend Engineer passionate about crafting fluid 60fps design systems, spatial interfaces, and developer intelligence tools.',
    skills_json: JSON.stringify(['UI/UX Design', 'Figma', 'React', 'TypeScript', 'Next.js', 'Design Systems', 'TailwindCSS', 'WebGL']),
    linkedin_url: 'https://linkedin.com/in/alexrivera-design',
    github_url: 'https://github.com/alexrivera-dev',
    behance_url: 'https://behance.net/alexrivera',
    instagram_url: 'https://instagram.com/alexrivera.design',
    website_url: 'https://alexrivera.design',
    project_url: 'https://spatial-canvas.app',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
  });
  console.log('Seeded candidate profile.');

  // Seed Companies
  const newCompanies = await db.insert(companies).values([
    {
      name: 'Stripe',
      website_url: 'https://stripe.com',
      logo_url: 'https://images.ctfassets.net/f60q1anpxzid/3gq61R9jQG4308QxM8eP9c/6122d159a68bc7c5b6b15809ceb10291/Stripe_icon_-_Square.svg',
      location_text: 'South San Francisco, CA, USA',
      latitude: 37.7749,
      longitude: -122.4194,
      founded_year: 2010,
      company_size: '7,000+ employees',
      contact_email: 'press@stripe.com',
      contact_phone: '+1 (888) 926-2289',
      founders_json: JSON.stringify([
        { name: 'Patrick Collison', role: 'Co-Founder & CEO', linkedin_url: 'https://linkedin.com/in/patrickcollison', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
        { name: 'John Collison', role: 'Co-Founder & President', linkedin_url: 'https://linkedin.com/in/john-collison', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
      ]),
      hr_leads_json: JSON.stringify([
        { name: 'Sarah Jenkins', role: 'Head of Global Talent Acquisition', linkedin_url: 'https://linkedin.com/in/sarah-jenkins-talent', avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120' },
      ]),
      tech_stack_json: JSON.stringify(['Ruby', 'Go', 'React', 'TypeScript', 'PostgreSQL']),
      description: 'Financial infrastructure platform for the internet. Millions of companies accept payments with Stripe.',
      claimed_by: repId,
      status: 'verified',
    },
    {
      name: 'Vercel',
      website_url: 'https://vercel.com',
      logo_url: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png',
      location_text: 'San Francisco, CA, USA',
      latitude: 37.7897,
      longitude: -122.4000,
      founded_year: 2015,
      company_size: '600+ employees',
      contact_email: 'talent@vercel.com',
      contact_phone: '+1 (415) 890-3320',
      founders_json: JSON.stringify([
        { name: 'Guillermo Rauch', role: 'Founder & CEO', linkedin_url: 'https://linkedin.com/in/rauchg', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
      ]),
      hr_leads_json: JSON.stringify([
        { name: 'Elena Rostova', role: 'VP of People & Culture', linkedin_url: 'https://linkedin.com/in/elena-rostova', avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120' },
      ]),
      tech_stack_json: JSON.stringify(['Next.js', 'React', 'Rust', 'TypeScript', 'Turbopack']),
      description: 'The Frontend Cloud platform powering the next generation of web experiences and AI SDK.',
      status: 'verified',
    },
    {
      name: 'Figma',
      website_url: 'https://figma.com',
      logo_url: 'https://static.figma.com/app/icon/1/favicon.png',
      location_text: 'New York, NY, USA',
      latitude: 40.7128,
      longitude: -74.0060,
      founded_year: 2012,
      company_size: '1,200+ employees',
      contact_email: 'recruiting@figma.com',
      contact_phone: '+1 (212) 555-0199',
      founders_json: JSON.stringify([
        { name: 'Dylan Field', role: 'Co-Founder & CEO', linkedin_url: 'https://linkedin.com/in/dylanfield', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
      ]),
      hr_leads_json: JSON.stringify([
        { name: 'Chloe Chen', role: 'Head of Design Recruiting', linkedin_url: 'https://linkedin.com/in/chloe-chen-figma', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' }
      ]),
      tech_stack_json: JSON.stringify(['C++', 'WebAssembly', 'WebGL', 'TypeScript', 'React']),
      description: 'Collaborative interface design and product development tool loved by creative teams worldwide.',
      status: 'verified',
    },
    {
      name: 'OpenAI',
      website_url: 'https://openai.com',
      logo_url: 'https://openai.com/favicon.ico',
      location_text: 'San Francisco, CA, USA',
      latitude: 37.7600,
      longitude: -122.4150,
      founded_year: 2015,
      company_size: '1,500+ employees',
      contact_email: 'careers@openai.com',
      contact_phone: '+1 (415) 890-4411',
      founders_json: JSON.stringify([
        { name: 'Sam Altman', role: 'Co-Founder & CEO', linkedin_url: 'https://linkedin.com/in/samaltman', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120' }
      ]),
      hr_leads_json: JSON.stringify([
        { name: 'Rachel Gomez', role: 'Director of AI Research Recruiting', linkedin_url: 'https://linkedin.com/in/rachel-gomez-ai', avatar_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120' }
      ]),
      tech_stack_json: JSON.stringify(['Python', 'PyTorch', 'C++', 'CUDA']),
      description: 'AI research and deployment company behind ChatGPT, GPT-4o, and Sora.',
      status: 'verified',
    },
    {
      name: 'Linear',
      website_url: 'https://linear.app',
      logo_url: 'https://linear.app/static/apple-touch-icon.png',
      location_text: 'San Francisco, CA, USA',
      latitude: 37.7650,
      longitude: -122.4200,
      founded_year: 2019,
      company_size: '70+ employees',
      contact_email: 'jobs@linear.app',
      contact_phone: '+1 (415) 300-4821',
      founders_json: JSON.stringify([
        { name: 'Karri Saarinen', role: 'Co-Founder & CEO', linkedin_url: 'https://linkedin.com/in/karrisaarinen', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' }
      ]),
      hr_leads_json: JSON.stringify([
        { name: 'Hanna Lind', role: 'Talent Lead', linkedin_url: 'https://linkedin.com/in/hanna-lind-talent', avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120' }
      ]),
      tech_stack_json: JSON.stringify(['TypeScript', 'React', 'Electron', 'Node.js']),
      description: 'The purpose-built issue tracking tool engineered for high-performance product teams.',
      status: 'verified',
    },
    {
      name: 'DeepMind',
      website_url: 'https://deepmind.google',
      logo_url: 'https://deepmind.google/static/images/favicon.png',
      location_text: 'London, United Kingdom',
      latitude: 51.5074,
      longitude: -0.1278,
      founded_year: 2010,
      company_size: '2,000+ employees',
      contact_email: 'deepmind-talent@google.com',
      contact_phone: '+44 20 7000 1200',
      founders_json: JSON.stringify([
        { name: 'Demis Hassabis', role: 'Co-Founder & CEO', linkedin_url: 'https://linkedin.com/in/demishassabis', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' }
      ]),
      hr_leads_json: JSON.stringify([
        { name: 'Oliver Wright', role: 'Staff Research Recruiter', linkedin_url: 'https://linkedin.com/in/oliver-wright-deepmind', avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120' }
      ]),
      tech_stack_json: JSON.stringify(['JAX', 'TensorFlow', 'Python', 'C++']),
      description: 'World-leading AI laboratory solving scientific intelligence and biological discoveries.',
      status: 'verified',
    },
    {
      name: 'Supabase',
      website_url: 'https://supabase.com',
      logo_url: 'https://supabase.com/favicon/favicon-196x196.png',
      location_text: 'Singapore & Remote',
      latitude: 1.3521,
      longitude: 103.8198,
      founded_year: 2020,
      company_size: '150+ employees',
      contact_email: 'careers@supabase.com',
      contact_phone: '+65 6000 8820',
      founders_json: JSON.stringify([
        { name: 'Paul Copplestone', role: 'Co-Founder & CEO', linkedin_url: 'https://linkedin.com/in/paulcopplestone', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' }
      ]),
      hr_leads_json: JSON.stringify([
        { name: 'Kylie Wong', role: 'Head of People', linkedin_url: 'https://linkedin.com/in/kylie-wong-people', avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120' }
      ]),
      tech_stack_json: JSON.stringify(['PostgreSQL', 'Elixir', 'Go', 'TypeScript']),
      description: 'The open source Firebase alternative. Build in a weekend, scale to millions with Postgres.',
      status: 'verified',
    },
    {
      name: 'Spotify',
      website_url: 'https://spotify.com',
      logo_url: 'https://open.spotifycdn.com/cdn/images/favicon.0f31d2ea.ico',
      location_text: 'Stockholm, Sweden',
      latitude: 59.3293,
      longitude: 18.0686,
      founded_year: 2006,
      company_size: '9,000+ employees',
      contact_email: 'jobs@spotify.com',
      contact_phone: '+46 8 5000 1000',
      founders_json: JSON.stringify([
        { name: 'Daniel Ek', role: 'Founder & CEO', linkedin_url: 'https://linkedin.com/in/danielek', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' }
      ]),
      hr_leads_json: JSON.stringify([
        { name: 'Astrid Lindholm', role: 'Talent Acquisition Director', linkedin_url: 'https://linkedin.com/in/astrid-lindholm', avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120' }
      ]),
      tech_stack_json: JSON.stringify(['Java', 'Python', 'C++', 'GCP']),
      description: 'The global audio streaming platform connecting over 600M listeners to artists.',
      status: 'verified',
    },
  ]).returning();

  const getComp = (name: string) => newCompanies.find((c: any) => c.name === name)!;

  // Now seed Jobs with timestamps (past 24h, past 7d, past 30d)
  const now = Date.now();
  const newJobs = await db.insert(jobs).values([
    // Figma (Updated 4 hours ago - ⚡ Past 24h)
    {
      company_id: getComp('Figma').id,
      title: 'Senior UI/UX Product Designer',
      salary_range: '$175,000 - $230,000',
      job_type: 'Full-time · Hybrid',
      experience_level: 'Senior',
      description: 'Craft intuitive generative canvas workflows and layout intelligence.',
      full_description: 'We are seeking an exceptional Senior UI/UX Product Designer to rethink how teams collaborate in Figma. Partner with engineering to design responsive autolayout systems and next-generation design-to-code workflows.',
      location_text: 'New York, NY',
      latitude: 40.7128,
      longitude: -74.0060,
      apply_url: 'https://figma.com/careers/designer',
      posted_at: new Date(now - 4 * 60 * 60 * 1000), // 4h ago
      last_seen_at: new Date(now - 4 * 60 * 60 * 1000),
      is_active: true,
    },
    {
      company_id: getComp('Figma').id,
      title: 'Staff WebGL & Canvas Engine Architect',
      salary_range: '$210,000 - $285,000',
      job_type: 'Full-time · On-site',
      experience_level: 'Staff',
      description: 'Push 60fps browser rendering limits using C++ WebAssembly and WebGL shaders.',
      full_description: 'Architect the core rendering engine powering multi-user vector canvases in Figma.',
      location_text: 'New York, NY',
      latitude: 40.7128,
      longitude: -74.0060,
      apply_url: 'https://figma.com/careers/webgl',
      posted_at: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2d ago (Past 7d)
      last_seen_at: new Date(now - 2 * 24 * 60 * 60 * 1000),
      is_active: true,
    },

    // Linear (Updated 1 day ago)
    {
      company_id: getComp('Linear').id,
      title: 'Principal UI/UX Designer',
      salary_range: '$190,000 - $260,000 + Equity',
      job_type: 'Full-time · Remote / SF',
      experience_level: 'Staff',
      description: 'Define the design language and keyboard-first ergonomics for modern software teams.',
      full_description: 'Join Linear as a Principal UI/UX Designer to craft buttery-smooth micro-interactions, dark mode color science, and tactile keyboard shortcuts.',
      location_text: 'San Francisco, CA',
      latitude: 37.7650,
      longitude: -122.4200,
      apply_url: 'https://linear.app/careers/design',
      posted_at: new Date(now - 1 * 24 * 60 * 60 * 1000), // 1d ago
      last_seen_at: new Date(now - 1 * 24 * 60 * 60 * 1000),
      is_active: true,
    },

    // OpenAI (Updated 6 hours ago - ⚡ Past 24h)
    {
      company_id: getComp('OpenAI').id,
      title: 'Research Scientist, Multimodal Reasoning',
      salary_range: '$300,000 - $450,000 + Equity',
      job_type: 'Full-time · On-site',
      experience_level: 'Lead',
      description: 'Advance foundational multimodal understanding across vision, speech, and reasoning.',
      full_description: 'Work at the frontier of artificial general intelligence developing novel scaling recipes and reinforcement learning paradigms.',
      location_text: 'San Francisco, CA',
      latitude: 37.7600,
      longitude: -122.4150,
      apply_url: 'https://openai.com/careers/research',
      posted_at: new Date(now - 6 * 60 * 60 * 1000),
      last_seen_at: new Date(now - 6 * 60 * 60 * 1000),
      is_active: true,
    },
    {
      company_id: getComp('OpenAI').id,
      title: 'Product Designer, Consumer AI',
      salary_range: '$185,000 - $250,000',
      job_type: 'Full-time · On-site',
      experience_level: 'Senior',
      description: 'Design conversational multimodal interfaces and agent interactions for hundreds of millions.',
      full_description: 'Shape how humanity interacts with advanced intelligence through adaptive, contextual UI components.',
      location_text: 'San Francisco, CA',
      latitude: 37.7600,
      longitude: -122.4150,
      apply_url: 'https://openai.com/careers/design',
      posted_at: new Date(now - 3 * 24 * 60 * 60 * 1000),
      last_seen_at: new Date(now - 3 * 24 * 60 * 60 * 1000),
      is_active: true,
    },

    // Vercel (Updated 18 days ago - Past 30d)
    {
      company_id: getComp('Vercel').id,
      title: 'AI Solutions Engineer',
      salary_range: '$170,000 - $220,000',
      job_type: 'Full-time · Remote',
      experience_level: 'Senior',
      description: 'Empower developers to ship generative user interfaces using the AI SDK.',
      full_description: 'Author reference architectures and optimize streaming response latency for customer AI workloads.',
      location_text: 'San Francisco, CA',
      latitude: 37.7897,
      longitude: -122.4000,
      apply_url: 'https://vercel.com/careers/ai',
      posted_at: new Date(now - 18 * 24 * 60 * 60 * 1000),
      last_seen_at: new Date(now - 18 * 24 * 60 * 60 * 1000),
      is_active: true,
    },

    // Stripe
    {
      company_id: getComp('Stripe').id,
      title: 'Staff Software Engineer, Global Settlement',
      salary_range: '$220,000 - $290,000',
      job_type: 'Full-time · Hybrid',
      experience_level: 'Staff',
      description: 'Architect mission-critical payment settlement and real-time financial ledger engines.',
      full_description: 'Build the ultra-reliable core ledgers that process billions of dollars every day.',
      location_text: 'South San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194,
      apply_url: 'https://stripe.com/jobs/payments',
      posted_at: new Date(now - 5 * 24 * 60 * 60 * 1000),
      last_seen_at: new Date(now - 5 * 24 * 60 * 60 * 1000),
      is_active: true,
    },

    // DeepMind
    {
      company_id: getComp('DeepMind').id,
      title: 'Research Engineer, Reinforcement Learning',
      salary_range: '£140,000 - £190,000',
      job_type: 'Full-time · Hybrid',
      experience_level: 'Senior',
      description: 'Develop next-generation autonomous decision making agents and self-improving algorithms.',
      full_description: 'Collaborate with world-class research scientists in our London headquarters.',
      location_text: 'London, UK',
      latitude: 51.5074,
      longitude: -0.1278,
      apply_url: 'https://deepmind.google/careers/rl',
      posted_at: new Date(now - 8 * 24 * 60 * 60 * 1000),
      last_seen_at: new Date(now - 8 * 24 * 60 * 60 * 1000),
      is_active: true,
    },

    // Supabase
    {
      company_id: getComp('Supabase').id,
      title: 'PostgreSQL Internals Engineer',
      salary_range: '$160,000 - $210,000',
      job_type: 'Full-time · Remote',
      experience_level: 'Senior',
      description: 'Contribute directly to Postgres extensions, pg_graphql, and real-time replication.',
      full_description: 'Write high-performance C and Rust extensions for PostgreSQL.',
      location_text: 'Singapore & Remote',
      latitude: 1.3521,
      longitude: 103.8198,
      apply_url: 'https://supabase.com/careers/pg',
      posted_at: new Date(now - 12 * 60 * 60 * 1000), // 12h ago
      last_seen_at: new Date(now - 12 * 60 * 60 * 1000),
      is_active: true,
    }
  ]).returning();

  console.log(`Inserted ${newJobs.length} jobs with dates.`);

  // Seed sample application and saved job
  await db.insert(applications).values([
    {
      user_id: alexId,
      company_id: getComp('Figma').id,
      job_title: 'Senior UI/UX Product Designer',
      company_name: 'Figma',
      company_logo: 'https://static.figma.com/app/icon/1/favicon.png',
      location_text: 'New York, NY',
      salary_range: '$175,000 - $230,000',
      apply_url: 'https://figma.com/careers/designer',
      status: 'interviewing',
      applied_at: new Date(now - 2 * 24 * 60 * 60 * 1000),
      notes: 'Completed design portfolio round with Dylan and Chloe. Final interview scheduled.',
    },
    {
      user_id: alexId,
      company_id: getComp('Linear').id,
      job_title: 'Principal UI/UX Designer',
      company_name: 'Linear',
      company_logo: 'https://linear.app/static/apple-touch-icon.png',
      location_text: 'San Francisco, CA',
      salary_range: '$190,000 - $260,000 + Equity',
      apply_url: 'https://linear.app/careers/design',
      status: 'saved',
      applied_at: new Date(now - 1 * 24 * 60 * 60 * 1000),
      notes: 'Bookmarked to review design system guidelines.',
    },
  ]);

  console.log('Seeding complete.');
}

main().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
