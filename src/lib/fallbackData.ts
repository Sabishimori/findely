export interface FallbackCompany {
  id: string;
  name: string;
  website_url: string;
  logo_url: string | null;
  description: string | null;
  location_text: string | null;
  latitude: number;
  longitude: number;
  founded_year?: number | null;
  company_size?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  status: string;
  activeJobCount: number;
  jobTitles: string[];
  roles: any[];
  founders: any[];
  hrLeads: any[];
  techStack: string[];
  latestPostDate?: Date | null;
}

export const FALLBACK_COMPANIES: FallbackCompany[] = [
  {
    id: "stripe-fallback-1",
    name: "Stripe",
    website_url: "https://stripe.com",
    logo_url: "https://images.ctfassets.net/f60q1anpxzid/3gq61R9jQG4308QxM8eP9c/6122d159a68bc7c5b6b15809ceb10291/Stripe_icon_-_Square.svg",
    description: "Financial infrastructure platform for the internet. Millions of businesses rely on Stripe to accept payments and manage revenue.",
    location_text: "South San Francisco, CA, USA",
    latitude: 37.7749,
    longitude: -122.4194,
    founded_year: 2010,
    company_size: "7,000+ employees",
    contact_email: "press@stripe.com",
    contact_phone: "+1 (888) 926-2289",
    status: "verified",
    activeJobCount: 3,
    jobTitles: ["Staff Software Engineer, Global Settlement", "Lead Infrastructure Engineer", "Senior Product Designer"],
    founders: [
      { name: "Patrick Collison", role: "Co-Founder & CEO", linkedin_url: "https://linkedin.com/in/patrickcollison", avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120" },
      { name: "John Collison", role: "Co-Founder & President", linkedin_url: "https://linkedin.com/in/john-collison", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120" },
    ],
    hrLeads: [
      { name: "Sarah Jenkins", role: "Head of Global Talent Acquisition", linkedin_url: "https://linkedin.com/in/sarah-jenkins-talent", avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120" },
    ],
    techStack: ["Ruby", "Go", "React", "TypeScript", "PostgreSQL", "Kafka"],
    roles: [
      {
        id: "stripe-role-1",
        title: "Staff Software Engineer, Global Settlement",
        salary_range: "$220,000 - $290,000",
        work_mode: "hybrid",
        role_category: "Engineering",
        location_text: "South San Francisco, CA",
        apply_url: "https://stripe.com/jobs",
        is_active: true,
        posted_at: new Date(Date.now() - 24 * 3600 * 1000),
      },
      {
        id: "stripe-role-2",
        title: "Lead Infrastructure Engineer",
        salary_range: "$210,000 - $275,000",
        work_mode: "remote",
        role_category: "Infrastructure",
        location_text: "San Francisco, CA & Remote",
        apply_url: "https://stripe.com/jobs",
        is_active: true,
        posted_at: new Date(Date.now() - 48 * 3600 * 1000),
      },
    ],
  },
  {
    id: "vercel-fallback-2",
    name: "Vercel",
    website_url: "https://vercel.com",
    logo_url: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    description: "The Frontend Cloud platform powering the next generation of dynamic web experiences and the Next.js framework.",
    location_text: "San Francisco, CA, USA",
    latitude: 37.7897,
    longitude: -122.4000,
    founded_year: 2015,
    company_size: "600+ employees",
    contact_email: "talent@vercel.com",
    status: "verified",
    activeJobCount: 2,
    jobTitles: ["AI Solutions Engineer", "Senior Frontend Architect"],
    founders: [
      { name: "Guillermo Rauch", role: "Founder & CEO", linkedin_url: "https://linkedin.com/in/rauchg", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120" },
    ],
    hrLeads: [
      { name: "Elena Rostova", role: "VP of People & Culture", linkedin_url: "https://linkedin.com/in/elena-rostova", avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120" },
    ],
    techStack: ["Next.js", "React", "Rust", "TypeScript", "Turbopack", "Node.js"],
    roles: [
      {
        id: "vercel-role-1",
        title: "AI Solutions Engineer",
        salary_range: "$170,000 - $220,000",
        work_mode: "remote",
        role_category: "AI & ML",
        location_text: "San Francisco, CA & Remote",
        apply_url: "https://vercel.com/careers",
        is_active: true,
        posted_at: new Date(Date.now() - 12 * 3600 * 1000),
      },
    ],
  },
  {
    id: "linear-fallback-3",
    name: "Linear",
    website_url: "https://linear.app",
    logo_url: "https://linear.app/static/apple-touch-icon.png",
    description: "The issue tracking tool built for high-performance software teams who value speed, craft, and keyboard-first ergonomics.",
    location_text: "San Francisco, CA, USA",
    latitude: 37.7650,
    longitude: -122.4200,
    founded_year: 2019,
    company_size: "70+ employees",
    contact_email: "jobs@linear.app",
    status: "verified",
    activeJobCount: 2,
    jobTitles: ["Principal UI/UX Designer", "Staff Full-Stack Engineer"],
    founders: [
      { name: "Karri Saarinen", role: "Co-Founder & CEO", linkedin_url: "https://linkedin.com/in/karrisaarinen", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120" },
    ],
    hrLeads: [
      { name: "Hanna Lind", role: "Talent Lead", linkedin_url: "https://linkedin.com/in/hanna-lind-talent", avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120" },
    ],
    techStack: ["TypeScript", "React", "Electron", "Node.js", "WebSockets"],
    roles: [
      {
        id: "linear-role-1",
        title: "Principal UI/UX Designer",
        salary_range: "$190,000 - $260,000 + Equity",
        work_mode: "remote",
        role_category: "Design",
        location_text: "San Francisco, CA & Remote",
        apply_url: "https://linear.app/careers",
        is_active: true,
        posted_at: new Date(Date.now() - 6 * 3600 * 1000),
      },
    ],
  },
  {
    id: "figma-fallback-4",
    name: "Figma",
    website_url: "https://figma.com",
    logo_url: "https://static.figma.com/app/icon/1/favicon.png",
    description: "Collaborative interface design and product development tool loved by creative teams and developers worldwide.",
    location_text: "New York, NY, USA",
    latitude: 40.7128,
    longitude: -74.0060,
    founded_year: 2012,
    company_size: "1,200+ employees",
    contact_email: "recruiting@figma.com",
    status: "verified",
    activeJobCount: 2,
    jobTitles: ["Senior UI/UX Product Designer", "Staff WebGL Engine Architect"],
    founders: [
      { name: "Dylan Field", role: "Co-Founder & CEO", linkedin_url: "https://linkedin.com/in/dylanfield", avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120" },
    ],
    hrLeads: [
      { name: "Chloe Chen", role: "Head of Design Recruiting", linkedin_url: "https://linkedin.com/in/chloe-chen-figma", avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" },
    ],
    techStack: ["C++", "WebAssembly", "WebGL", "TypeScript", "React"],
    roles: [
      {
        id: "figma-role-1",
        title: "Senior UI/UX Product Designer",
        salary_range: "$175,000 - $230,000",
        work_mode: "hybrid",
        role_category: "Design",
        location_text: "New York, NY",
        apply_url: "https://figma.com/careers",
        is_active: true,
        posted_at: new Date(Date.now() - 4 * 3600 * 1000),
      },
    ],
  },
  {
    id: "openai-fallback-5",
    name: "OpenAI",
    website_url: "https://openai.com",
    logo_url: "https://openai.com/favicon.ico",
    description: "AI research and deployment company behind ChatGPT, GPT-4o, and advanced foundational reasoning models.",
    location_text: "San Francisco, CA, USA",
    latitude: 37.7600,
    longitude: -122.4150,
    founded_year: 2015,
    company_size: "1,500+ employees",
    contact_email: "careers@openai.com",
    status: "verified",
    activeJobCount: 2,
    jobTitles: ["Research Scientist, Multimodal Reasoning", "Product Designer, Consumer AI"],
    founders: [
      { name: "Sam Altman", role: "Co-Founder & CEO", linkedin_url: "https://linkedin.com/in/samaltman", avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120" },
    ],
    hrLeads: [
      { name: "Rachel Gomez", role: "Director of AI Research Recruiting", linkedin_url: "https://linkedin.com/in/rachel-gomez-ai", avatar_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120" },
    ],
    techStack: ["Python", "PyTorch", "CUDA", "C++", "JAX"],
    roles: [
      {
        id: "openai-role-1",
        title: "Research Scientist, Multimodal Reasoning",
        salary_range: "$300,000 - $450,000 + Equity",
        work_mode: "onsite",
        role_category: "AI & ML",
        location_text: "San Francisco, CA",
        apply_url: "https://openai.com/careers",
        is_active: true,
        posted_at: new Date(Date.now() - 2 * 3600 * 1000),
      },
    ],
  },
  {
    id: "supabase-fallback-6",
    name: "Supabase",
    website_url: "https://supabase.com",
    logo_url: "https://supabase.com/favicon/favicon-196x196.png",
    description: "The open source Firebase alternative. Build in a weekend, scale to millions with Postgres database and auth.",
    location_text: "Singapore & Remote",
    latitude: 1.3521,
    longitude: 103.8198,
    founded_year: 2020,
    company_size: "150+ employees",
    contact_email: "careers@supabase.com",
    status: "verified",
    activeJobCount: 2,
    jobTitles: ["Senior Distributed Systems Engineer", "Developer Relations Lead"],
    founders: [
      { name: "Paul Copplestone", role: "Co-Founder & CEO", linkedin_url: "https://linkedin.com/in/paulcopplestone", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120" },
    ],
    hrLeads: [
      { name: "Kylie Wong", role: "Head of People", linkedin_url: "https://linkedin.com/in/kylie-wong-people", avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120" },
    ],
    techStack: ["PostgreSQL", "Elixir", "Go", "TypeScript", "Rust"],
    roles: [
      {
        id: "supabase-role-1",
        title: "Senior Distributed Systems Engineer",
        salary_range: "$160,000 - $210,000",
        work_mode: "remote",
        role_category: "Engineering",
        location_text: "Singapore & Global Remote",
        apply_url: "https://supabase.com/careers",
        is_active: true,
        posted_at: new Date(Date.now() - 18 * 3600 * 1000),
      },
    ],
  },
  {
    id: "cursor-fallback-7",
    name: "Cursor",
    website_url: "https://cursor.com",
    logo_url: "https://www.google.com/s2/favicons?domain=cursor.com&sz=128",
    description: "The AI-first code editor designed to make engineers 10x more productive with state-of-the-art autocomplete and codebase reasoning.",
    location_text: "San Francisco, CA, USA",
    latitude: 37.7790,
    longitude: -122.4180,
    founded_year: 2022,
    company_size: "35+ employees",
    contact_email: "careers@cursor.com",
    status: "verified",
    activeJobCount: 2,
    jobTitles: ["Founding AI Systems Engineer", "Senior Full-Stack UI Engineer"],
    founders: [
      { name: "Aman Sanger", role: "Co-Founder", linkedin_url: "https://linkedin.com/in/amansanger", avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120" },
      { name: "Michael Truell", role: "Co-Founder & CEO", linkedin_url: "https://linkedin.com/in/michaeltruell", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120" },
    ],
    hrLeads: [],
    techStack: ["TypeScript", "Electron", "Rust", "Python", "PyTorch"],
    roles: [
      {
        id: "cursor-role-1",
        title: "Founding AI Systems Engineer",
        salary_range: "$220,000 - $320,000 + Equity",
        work_mode: "onsite",
        role_category: "AI & ML",
        location_text: "San Francisco, CA",
        apply_url: "https://cursor.com/careers",
        is_active: true,
        posted_at: new Date(Date.now() - 10 * 3600 * 1000),
      },
    ],
  },
  {
    id: "postman-fallback-8",
    name: "Postman",
    website_url: "https://postman.com",
    logo_url: "https://www.google.com/s2/favicons?domain=postman.com&sz=128",
    description: "The leading enterprise API platform used by over 30 million developers to build, test, and collaborate on APIs.",
    location_text: "San Francisco, CA & Bengaluru, India",
    latitude: 12.9716,
    longitude: 77.5946,
    founded_year: 2014,
    company_size: "1,000+ employees",
    contact_email: "careers@postman.com",
    status: "verified",
    activeJobCount: 2,
    jobTitles: ["Senior Staff Engineer, API Governance", "Product Lead, API Intelligence"],
    founders: [
      { name: "Abhinav Asthana", role: "CEO & Co-Founder", linkedin_url: "https://linkedin.com/in/abhinavasthana", avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120" },
    ],
    hrLeads: [],
    techStack: ["Node.js", "React", "TypeScript", "Go", "AWS"],
    roles: [
      {
        id: "postman-role-1",
        title: "Senior Staff Engineer, API Governance",
        salary_range: "$190,000 - $260,000",
        work_mode: "hybrid",
        role_category: "Engineering",
        location_text: "San Francisco, CA & Bengaluru",
        apply_url: "https://postman.com/careers",
        is_active: true,
        posted_at: new Date(Date.now() - 14 * 3600 * 1000),
      },
    ],
  },
];
