export interface OfficeLocation {
  flag: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  jobs: number;
  isHQ?: boolean;
}

export interface CompanyIntelligence {
  industry: string[];
  businessModel: string[];
  founded: number | string;
  workMode: string;
  about: string;
  keyInvestors: string[];
  fundingStage: string;
  totalFunding: string;
  valuation: string;
  benefits: Array<{ name: string; status: "Available" | "Partial" }>;
  officeAddress: string;
  officeNetwork: OfficeLocation[];
  totalLocationsCount: number;
  departments: string[];
  teamSize: string;
  openPositionsCount: number;
  techStack?: string[];
}

export const ANTHROPIC_INTELLIGENCE: CompanyIntelligence = {
  industry: [
    "AI / ML",
    "Generative AI",
    "Artificial Intelligence Research",
    "Artificial Intelligence"
  ],
  businessModel: ["B2B", "B2C"],
  founded: 2021,
  workMode: "On-site, Remote",
  about:
    "Anthropic is an AI safety and research company that develops reliable, interpretable, and steerable AI systems. Its flagship product is Claude, a family of large language models and AI assistants designed for tasks such as writing, coding, analysis, and enterprise workflows, with a strong emphasis on responsible AI development and long-term safety.",
  keyInvestors: [
    "Altimeter Capital",
    "ICONIQ Capital",
    "Craft Ventures",
    "Founders Fund",
    "MGX",
    "Dragoneer",
    "Greenoaks",
    "Coatue",
    "Amazon",
    "GIC"
  ],
  fundingStage: "Series H",
  totalFunding: "$132B",
  valuation: "$965B",
  benefits: [
    { name: "Donation Matching", status: "Available" },
    { name: "Equity/Stock Options", status: "Available" },
    { name: "Flexible Hours", status: "Available" },
    { name: "Health Insurance", status: "Available" },
    { name: "Parental Leave", status: "Available" },
    { name: "Performance Bonus", status: "Available" },
    { name: "Remote Work", status: "Available" },
    { name: "Unlimited PTO", status: "Available" },
    { name: "Visa Sponsorship", status: "Available" }
  ],
  officeAddress: "Atlanta, Georgia, United States",
  officeNetwork: [
    { flag: "🇺🇸", city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: 333, isHQ: true },
    { flag: "🇺🇸", city: "New York", country: "United States", lat: 40.7128, lng: -74.0060, jobs: 222 },
    { flag: "🇺🇸", city: "Seattle", country: "United States", lat: 47.6062, lng: -122.3321, jobs: 125 },
    { flag: "🇬🇧", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, jobs: 64 },
    { flag: "🇯🇵", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, jobs: 38 },
    { flag: "🇨🇦", city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, jobs: 29 },
    { flag: "🇩🇪", city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, jobs: 22 },
    { flag: "🇫🇷", city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, jobs: 19 },
    { flag: "🇸🇬", city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, jobs: 16 },
    { flag: "🇦🇺", city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, jobs: 14 },
    { flag: "🇳🇱", city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, jobs: 12 },
    { flag: "🇮🇪", city: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603, jobs: 11 },
    { flag: "🇨🇭", city: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417, jobs: 9 },
    { flag: "🇸🇪", city: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686, jobs: 8 },
    { flag: "🇮🇳", city: "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946, jobs: 24 },
    { flag: "🇺🇸", city: "Austin", country: "United States", lat: 30.2672, lng: -97.7431, jobs: 45 },
    { flag: "🇺🇸", city: "Boston", country: "United States", lat: 42.3601, lng: -71.0589, jobs: 36 },
    { flag: "🇺🇸", city: "Chicago", country: "United States", lat: 41.8781, lng: -87.6298, jobs: 28 },
    { flag: "🇺🇸", city: "Los Angeles", country: "United States", lat: 34.0522, lng: -118.2437, jobs: 25 },
    { flag: "🇺🇸", city: "San Diego", country: "United States", lat: 32.7157, lng: -117.1611, jobs: 18 },
    { flag: "🇺🇸", city: "Denver", country: "United States", lat: 39.7392, lng: -104.9903, jobs: 15 },
    { flag: "🇺🇸", city: "Atlanta", country: "United States", lat: 33.7490, lng: -84.3880, jobs: 42 }
  ],
  totalLocationsCount: 22,
  departments: [
    "Operations",
    "Design",
    "HR & Talent",
    "Engineering",
    "Other",
    "Customer Success",
    "Sales",
    "Legal",
    "AI",
    "Finance & Accounts",
    "Academy & Training",
    "Security",
    "Marketing",
    "Research & Science",
    "Data & Analytics",
    "Product",
    "Content Production",
    "Customer Support"
  ],
  teamSize: "850+ employees",
  openPositionsCount: 395
};

const COMPANY_PRESETS: Record<string, Partial<CompanyIntelligence>> = {
  stripe: {
    industry: ["Fintech", "Developer Tools", "Payments Infrastructure", "SaaS"],
    businessModel: ["B2B", "Enterprise"],
    founded: 2010,
    workMode: "Hybrid, Remote",
    about: "Stripe is a financial infrastructure platform for the internet. Millions of companies—from the world’s largest enterprises to the most ambitious startups—use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.",
    keyInvestors: ["Sequoia Capital", "Andreessen Horowitz", "Peter Thiel", "Elon Musk", "General Catalyst", "Founders Fund"],
    fundingStage: "Late Stage / Pre-IPO",
    totalFunding: "$8.7B",
    valuation: "$65B",
    officeAddress: "South San Francisco, CA & Dublin, Ireland",
    teamSize: "7,000+ employees",
    openPositionsCount: 142
  },
  openai: {
    industry: ["AI / ML", "Generative AI", "AGI Research", "Enterprise AI"],
    businessModel: ["B2B", "B2C", "API Platform"],
    founded: 2015,
    workMode: "On-site, Hybrid",
    about: "OpenAI is an AI research and deployment company. Our mission is to ensure that artificial general intelligence benefits all of humanity.",
    keyInvestors: ["Microsoft", "Thrive Capital", "Khosla Ventures", "Founders Fund", "Sequoia Capital", "Tiger Global"],
    fundingStage: "Series G",
    totalFunding: "$14B",
    valuation: "$157B",
    officeAddress: "Mission District, San Francisco, CA, USA",
    teamSize: "1,500+ employees",
    openPositionsCount: 210
  },
  linear: {
    industry: ["Productivity", "Developer Tools", "Project Management", "SaaS"],
    businessModel: ["B2B", "Product-Led Growth"],
    founded: 2019,
    workMode: "100% Remote",
    about: "Linear is a modern project and issue tracking tool designed for high-performance software and product teams. Crafted with keyboard-first ergonomics and 60fps synchronization.",
    keyInvestors: ["Accel", "Sequoia Capital", "01 Advisors", "Dylan Field", "Patrick Collison"],
    fundingStage: "Series B",
    totalFunding: "$52M",
    valuation: "$400M",
    officeAddress: "San Francisco, CA & Worldwide Distributed",
    teamSize: "75+ employees",
    openPositionsCount: 18
  },
  vercel: {
    industry: ["Cloud Computing", "Developer Experience", "Frontend Infrastructure", "Serverless"],
    businessModel: ["B2B", "B2C", "Enterprise"],
    founded: 2015,
    workMode: "Remote-First",
    about: "Vercel is the frontend cloud platform for web developers, empowering teams to build, deploy, and scale fast, dynamic web applications with Next.js and global edge networks.",
    keyInvestors: ["Accel", "CRV", "GV (Google Ventures)", "Tiger Global", "Bedrock Capital"],
    fundingStage: "Series E",
    totalFunding: "$563M",
    valuation: "$3.25B",
    officeAddress: "San Francisco, CA, United States",
    teamSize: "600+ employees",
    openPositionsCount: 54
  },
  supabase: {
    industry: ["Open Source", "Database", "Backend as a Service", "Developer Tools"],
    businessModel: ["B2B", "Open Source SaaS"],
    founded: 2020,
    workMode: "100% Remote",
    about: "Supabase is an open source Firebase alternative providing Postgres databases, authentication, instant APIs, edge functions, and real-time subscriptions for modern builders.",
    keyInvestors: ["Coatue", "Felicis Ventures", "Y Combinator", "Mozilla Corporation"],
    fundingStage: "Series B",
    totalFunding: "$116M",
    valuation: "$1B",
    officeAddress: "Singapore & 100% Global Remote",
    teamSize: "120+ employees",
    openPositionsCount: 25
  },
  figma: {
    industry: ["Design Systems", "Collaboration", "Creative Software", "SaaS"],
    businessModel: ["B2B", "Product-Led Growth", "Enterprise"],
    founded: 2012,
    workMode: "Hybrid, Remote",
    about: "Figma is a collaborative design platform that helps teams build better products from ideation to production in real-time on the web.",
    keyInvestors: ["Index Ventures", "Greylock Partners", "Kleiner Perkins", "Sequoia Capital", "Andreessen Horowitz"],
    fundingStage: "Late Stage",
    totalFunding: "$3.3B",
    valuation: "$12.5B",
    officeAddress: "Market St, San Francisco, CA, USA",
    teamSize: "1,800+ employees",
    openPositionsCount: 95
  }
};

export function getCompanyIntelligence(company: {
  name: string;
  description?: string | null;
  founded_year?: number | null;
  company_size?: string | null;
  location_text?: string | null;
  jobs?: any[];
}): CompanyIntelligence {
  const normName = company.name.toLowerCase().trim();

  // If Anthropic
  if (normName.includes("anthropic")) {
    return {
      ...ANTHROPIC_INTELLIGENCE,
      openPositionsCount: company.jobs && company.jobs.length > 0 ? company.jobs.length : ANTHROPIC_INTELLIGENCE.openPositionsCount
    };
  }

  // Check presets
  for (const [key, preset] of Object.entries(COMPANY_PRESETS)) {
    if (normName.includes(key)) {
      return {
        ...ANTHROPIC_INTELLIGENCE,
        ...preset,
        founded: company.founded_year || preset.founded || 2020,
        teamSize: company.company_size || preset.teamSize || "500+ employees",
        about: company.description || preset.about || ANTHROPIC_INTELLIGENCE.about,
        officeAddress: company.location_text || preset.officeAddress || "San Francisco, CA, United States",
        openPositionsCount: company.jobs && company.jobs.length > 0 ? company.jobs.length : (preset.openPositionsCount || 45)
      };
    }
  }

  const rawLoc = company.location_text || "San Francisco, CA, USA";
  const isIndia = rawLoc.toLowerCase().includes("india") || rawLoc.toLowerCase().includes("bengaluru") || rawLoc.toLowerCase().includes("mumbai");
  const isEurope = rawLoc.toLowerCase().includes("uk") || rawLoc.toLowerCase().includes("london") || rawLoc.toLowerCase().includes("paris") || rawLoc.toLowerCase().includes("sweden") || rawLoc.toLowerCase().includes("germany");
  const isJapan = rawLoc.toLowerCase().includes("japan") || rawLoc.toLowerCase().includes("tokyo");
  const isKorea = rawLoc.toLowerCase().includes("korea") || rawLoc.toLowerCase().includes("seoul");
  const isAus = rawLoc.toLowerCase().includes("australia") || rawLoc.toLowerCase().includes("sydney") || rawLoc.toLowerCase().includes("new zealand");

  let branches: OfficeLocation[] = [];

  if (isIndia) {
    branches = [
      { flag: "🇮🇳", city: rawLoc.split(",")[0] || "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946, jobs: Math.max(18, (company.jobs?.length || 2)), isHQ: true },
      { flag: "🇮🇳", city: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777, jobs: 8 },
      { flag: "🇮🇳", city: "Delhi / NCR", country: "India", lat: 28.6139, lng: 77.2090, jobs: 6 },
      { flag: "🇺🇸", city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: 12 },
      { flag: "🇯🇵", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, jobs: 4 },
      { flag: "🌐", city: "Worldwide Remote", country: "Global", lat: 12.9716, lng: 77.5946, jobs: Math.max(10, company.jobs?.length || 3) }
    ];
  } else if (isEurope) {
    branches = [
      { flag: "🇪🇺", city: rawLoc.split(",")[0] || "London", country: "Europe", lat: 51.5074, lng: -0.1278, jobs: Math.max(20, (company.jobs?.length || 2)), isHQ: true },
      { flag: "🇩🇪", city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, jobs: 14 },
      { flag: "🇫🇷", city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, jobs: 9 },
      { flag: "🇺🇸", city: "New York", country: "United States", lat: 40.7128, lng: -74.0060, jobs: 11 },
      { flag: "🇮🇳", city: "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946, jobs: 6 },
      { flag: "🌐", city: "Worldwide Remote", country: "Global", lat: 51.5074, lng: -0.1278, jobs: 15 }
    ];
  } else if (isJapan || isKorea) {
    branches = [
      { flag: isJapan ? "🇯🇵" : "🇰🇷", city: rawLoc.split(",")[0] || (isJapan ? "Tokyo" : "Seoul"), country: isJapan ? "Japan" : "South Korea", lat: isJapan ? 35.6762 : 37.5665, lng: isJapan ? 139.6503 : 126.9780, jobs: Math.max(16, (company.jobs?.length || 2)), isHQ: true },
      { flag: "🇺🇸", city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: 8 },
      { flag: "🇸🇬", city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, jobs: 5 },
      { flag: "🌐", city: "Worldwide Remote", country: "Global", lat: 35.6762, lng: 139.6503, jobs: 10 }
    ];
  } else if (isAus) {
    branches = [
      { flag: "🇦🇺", city: rawLoc.split(",")[0] || "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, jobs: Math.max(22, (company.jobs?.length || 2)), isHQ: true },
      { flag: "🇦🇺", city: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631, jobs: 9 },
      { flag: "🇺🇸", city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: 14 },
      { flag: "🇳🇿", city: "Auckland", country: "New Zealand", lat: -36.8485, lng: 174.7633, jobs: 4 },
      { flag: "🌐", city: "Worldwide Remote", country: "Global", lat: -33.8688, lng: 151.2093, jobs: 18 }
    ];
  } else {
    // Standard USA / Global Tech Powerhouse
    branches = [
      { flag: "🇺🇸", city: rawLoc.split(",")[0] || "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: Math.max(25, (company.jobs?.length || 2)), isHQ: true },
      { flag: "🇺🇸", city: "New York", country: "United States", lat: 40.7128, lng: -74.0060, jobs: 18 },
      { flag: "🇬🇧", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, jobs: 12 },
      { flag: "🇮🇳", city: "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946, jobs: 10 },
      { flag: "🇯🇵", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, jobs: 7 },
      { flag: "🌐", city: "Worldwide Remote", country: "Global", lat: 37.7749, lng: -122.4194, jobs: 24 }
    ];
  }

  return {
    industry: ["Technology", "Software", "AI / ML", "SaaS"],
    businessModel: ["B2B", "Enterprise"],
    founded: company.founded_year || 2021,
    workMode: "On-site, Remote",
    about: company.description || `${company.name} is a frontier technology company architecting high-velocity systems, scalable infrastructure, and modern software products.`,
    keyInvestors: ["Sequoia Capital", "Andreessen Horowitz", "Founders Fund", "Y Combinator", "Index Ventures"],
    fundingStage: "Series B / Growth",
    totalFunding: "$48M",
    valuation: "$350M",
    benefits: ANTHROPIC_INTELLIGENCE.benefits,
    officeAddress: rawLoc,
    officeNetwork: branches,
    totalLocationsCount: branches.length,
    departments: ANTHROPIC_INTELLIGENCE.departments,
    teamSize: company.company_size || "100-500 employees",
    openPositionsCount: company.jobs?.length || 12
  };
}
