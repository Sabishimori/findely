import { matchesLocation } from "./locationMatcher";

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
  spotify: {
    industry: ["Audio Streaming", "Music Tech", "Podcast Platform", "AdTech", "AI Recommendation"],
    businessModel: ["Freemium", "B2C Subscription", "Ad-Supported"],
    founded: 2006,
    workMode: "Work From Anywhere / Distributed",
    about: "Spotify is the world’s most popular audio streaming subscription service with a community of over 600 million users across 180+ global markets.",
    keyInvestors: ["Founders Fund", "Technology Crossover Ventures", "Tencent Music", "Baillie Gifford"],
    fundingStage: "Public (NYSE: SPOT)",
    totalFunding: "$2.6B",
    valuation: "$68B",
    officeAddress: "Birger Jarlsgatan 61, Stockholm, Sweden",
    teamSize: "9,000+ employees",
    openPositionsCount: 220,
    officeNetwork: [
      { flag: "🇸🇪", city: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686, jobs: 64, isHQ: true },
      { flag: "🇬🇧", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, jobs: 48 },
      { flag: "🇺🇸", city: "New York", country: "United States", lat: 40.7128, lng: -74.0060, jobs: 42 },
      { flag: "🇺🇸", city: "Boston", country: "United States", lat: 42.3601, lng: -71.0589, jobs: 18 },
      { flag: "🇩🇪", city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, jobs: 16 },
      { flag: "🇯🇵", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, jobs: 12 },
      { flag: "🇦🇺", city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, jobs: 9 },
      { flag: "🇫🇷", city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, jobs: 8 },
      { flag: "🇮🇳", city: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777, jobs: 14 },
      { flag: "🇸🇬", city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, jobs: 7 },
      { flag: "🇨🇦", city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, jobs: 6 }
    ],
    totalLocationsCount: 11,
  },
  deepl: {
    industry: ["Neural Machine Translation", "Language AI", "LLMs", "Enterprise AI"],
    businessModel: ["B2B SaaS", "B2C Subscription", "API Platform"],
    founded: 2017,
    workMode: "Hybrid / On-site",
    about: "DeepL is the world’s leading language AI company, developing neural machine translation and communications intelligence trusted by millions of global professionals and enterprises.",
    keyInvestors: ["Benchmark", "IVP", "Index Ventures", "Atomico"],
    fundingStage: "Series C",
    totalFunding: "$420M",
    valuation: "$2B",
    officeAddress: "Cologne & Berlin, Germany",
    teamSize: "1,000+ employees",
    openPositionsCount: 45,
    officeNetwork: [
      { flag: "🇩🇪", city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, jobs: 18, isHQ: true },
      { flag: "🇩🇪", city: "Cologne", country: "Germany", lat: 50.9375, lng: 6.9603, jobs: 14 },
      { flag: "🇬🇧", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, jobs: 8 },
      { flag: "🇯🇵", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, jobs: 6 },
      { flag: "🇺🇸", city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: 5 },
      { flag: "🇳🇱", city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, jobs: 4 }
    ],
    totalLocationsCount: 6,
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
    openPositionsCount: 210,
    officeNetwork: [
      { flag: "🇺🇸", city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: 110, isHQ: true },
      { flag: "🇬🇧", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, jobs: 32 },
      { flag: "🇯🇵", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, jobs: 18 },
      { flag: "🇮🇪", city: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603, jobs: 14 },
      { flag: "🇺🇸", city: "New York", country: "United States", lat: 40.7128, lng: -74.0060, jobs: 20 },
      { flag: "🇸🇬", city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, jobs: 8 },
      { flag: "🇫🇷", city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, jobs: 6 },
      { flag: "🇨🇭", city: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417, jobs: 5 }
    ],
    totalLocationsCount: 8,
  },
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
    openPositionsCount: 142,
    officeNetwork: [
      { flag: "🇺🇸", city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: 55, isHQ: true },
      { flag: "🇮🇪", city: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603, jobs: 38, isHQ: true },
      { flag: "🇬🇧", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, jobs: 24 },
      { flag: "🇯🇵", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, jobs: 12 },
      { flag: "🇸🇬", city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, jobs: 10 },
      { flag: "🇺🇸", city: "Seattle", country: "United States", lat: 47.6062, lng: -122.3321, jobs: 15 },
      { flag: "🇺🇸", city: "New York", country: "United States", lat: 40.7128, lng: -74.0060, jobs: 14 },
      { flag: "🇮🇳", city: "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946, jobs: 12 }
    ],
    totalLocationsCount: 8,
  },
  postman: {
    industry: ["API Platform", "Developer Tools", "Collaboration", "SaaS"],
    businessModel: ["B2B", "Product-Led Growth", "Enterprise"],
    founded: 2014,
    workMode: "Hybrid / Remote",
    about: "Postman is the leading API platform for building and using APIs, used by over 30 million developers across 500,000 organizations worldwide.",
    keyInvestors: ["Nexus Venture Partners", "Insight Partners", "CRV", "Coatue"],
    fundingStage: "Series D",
    totalFunding: "$433M",
    valuation: "$5.6B",
    officeAddress: "Bengaluru, India & San Francisco, CA",
    teamSize: "1,200+ employees",
    openPositionsCount: 38,
    officeNetwork: [
      { flag: "🇮🇳", city: "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946, jobs: 20, isHQ: true },
      { flag: "🇺🇸", city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: 12 },
      { flag: "🇬🇧", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, jobs: 6 },
      { flag: "🇯🇵", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, jobs: 4 }
    ],
    totalLocationsCount: 4,
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
    openPositionsCount: 18,
    officeNetwork: [
      { flag: "🇺🇸", city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: 8, isHQ: true },
      { flag: "🇬🇧", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, jobs: 4 },
      { flag: "🇩🇪", city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, jobs: 3 },
      { flag: "🇯🇵", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, jobs: 2 },
      { flag: "🇫🇷", city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, jobs: 2 }
    ],
    totalLocationsCount: 5,
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
    openPositionsCount: 54,
    officeNetwork: [
      { flag: "🇺🇸", city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: 26, isHQ: true },
      { flag: "🇬🇧", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, jobs: 12 },
      { flag: "🇯🇵", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, jobs: 8 },
      { flag: "🇩🇪", city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, jobs: 6 }
    ],
    totalLocationsCount: 4,
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
    openPositionsCount: 25,
    officeNetwork: [
      { flag: "🇸🇬", city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, jobs: 10, isHQ: true },
      { flag: "🇺🇸", city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: 8 },
      { flag: "🇬🇧", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, jobs: 5 },
      { flag: "🇩🇪", city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, jobs: 4 }
    ],
    totalLocationsCount: 4,
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
    openPositionsCount: 95,
    officeNetwork: [
      { flag: "🇺🇸", city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, jobs: 48, isHQ: true },
      { flag: "🇺🇸", city: "New York", country: "United States", lat: 40.7128, lng: -74.0060, jobs: 24 },
      { flag: "🇬🇧", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, jobs: 18 },
      { flag: "🇯🇵", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, jobs: 10 },
      { flag: "🇫🇷", city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, jobs: 6 },
      { flag: "🇦🇺", city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, jobs: 5 }
    ],
    totalLocationsCount: 6,
  }
};

import { geocodeLocation } from "./scraper/geocoder";

export function getFlagForCountryOrCity(locStr: string): string {
  const s = (locStr || "").toLowerCase();
  if (s.includes("india") || s.includes("bengaluru") || s.includes("bangalore") || s.includes("mumbai") || s.includes("delhi") || s.includes("noida") || s.includes("gurgaon") || s.includes("hyderabad") || s.includes("indiranagar") || s.includes("pune") || s.includes("chennai")) return "🇮🇳";
  if (s.includes("united states") || s.includes("usa") || s.includes("san francisco") || s.includes("new york") || s.includes("seattle") || s.includes("austin") || s.includes("boston") || s.includes("chicago") || s.includes("los angeles") || s.includes("santa clara") || s.includes("san jose") || s.includes("california") || s.includes("palo alto") || s.includes("mountain view") || s.includes("sunnyvale") || s.includes("denver") || s.includes("atlanta") || s.includes(", ca") || s.includes(", ny") || s.includes(", wa") || s.includes(", tx") || s.includes(", ma") || s.includes(", il")) return "🇺🇸";
  if (s.includes("united kingdom") || s.includes("uk") || s.includes("london") || s.includes("cambridge") || s.includes("oxford") || s.includes("manchester") || s.includes("edinburgh")) return "🇬🇧";
  if (s.includes("germany") || s.includes("berlin") || s.includes("munich") || s.includes("frankfurt") || s.includes("hamburg") || s.includes("cologne")) return "🇩🇪";
  if (s.includes("france") || s.includes("paris") || s.includes("lyon")) return "🇫🇷";
  if (s.includes("japan") || s.includes("tokyo") || s.includes("osaka") || s.includes("kyoto")) return "🇯🇵";
  if (s.includes("korea") || s.includes("seoul")) return "🇰🇷";
  if (s.includes("singapore")) return "🇸🇬";
  if (s.includes("australia") || s.includes("sydney") || s.includes("melbourne") || s.includes("brisbane")) return "🇦🇺";
  if (s.includes("new zealand") || s.includes("wellington") || s.includes("auckland")) return "🇳🇿";
  if (s.includes("canada") || s.includes("toronto") || s.includes("vancouver") || s.includes("montreal") || s.includes("waterloo")) return "🇨🇦";
  if (s.includes("sweden") || s.includes("stockholm")) return "🇸🇪";
  if (s.includes("netherlands") || s.includes("amsterdam")) return "🇳🇱";
  if (s.includes("ireland") || s.includes("dublin")) return "🇮🇪";
  if (s.includes("switzerland") || s.includes("zurich") || s.includes("geneva")) return "🇨🇭";
  if (s.includes("israel") || s.includes("tel aviv") || s.includes("yokneam")) return "🇮🇱";
  if (s.includes("spain") || s.includes("barcelona") || s.includes("madrid")) return "🇪🇸";
  if (s.includes("remote") || s.includes("worldwide") || s.includes("global") || s.includes("anywhere")) return "🌐";
  return "📍";
}

export function computeDynamicOfficeNetwork(
  companyLocation: string,
  rawJobs: any[],
  hqCoords?: { lat?: number | null; lng?: number | null }
): OfficeLocation[] {
  const normHQ = (companyLocation || "San Francisco, CA").trim();
  const hqGeo = geocodeLocation(normHQ);
  const hqCity = hqGeo.city || normHQ.split(",")[0] || "Headquarters";
  const hqCountry = hqGeo.country || "Global";

  if (!rawJobs || rawJobs.length === 0) {
    return [
      {
        flag: getFlagForCountryOrCity(normHQ),
        city: hqCity,
        country: hqCountry,
        lat: (hqCoords?.lat !== undefined && hqCoords?.lat !== null) ? hqCoords.lat : (hqGeo.lat || 37.7749),
        lng: (hqCoords?.lng !== undefined && hqCoords?.lng !== null) ? hqCoords.lng : (hqGeo.lng || -122.4194),
        jobs: 0,
        isHQ: true,
      },
    ];
  }

  // Aggregate real jobs by resolved location
  const branchMap = new Map<string, {
    flag: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
    jobs: number;
    isHQ: boolean;
  }>();

  for (const job of rawJobs) {
    const rawLoc = (job.location_text || job.location || "").trim();
    const geo = geocodeLocation(rawLoc || normHQ);

    // Clean display city name
    const cityKey = (geo.city || rawLoc || hqCity).trim();
    const normalizedKey = cityKey.toLowerCase();

    const isJobHQ = (
      normalizedKey === hqCity.toLowerCase() ||
      (geo.lat !== null && hqGeo.lat !== null && Math.abs(geo.lat - hqGeo.lat) < 0.1 && geo.lng !== null && hqGeo.lng !== null && Math.abs(geo.lng - hqGeo.lng) < 0.1)
    );

    const existing = branchMap.get(normalizedKey);
    if (existing) {
      existing.jobs += 1;
      if (isJobHQ) existing.isHQ = true;
    } else {
      const flag = getFlagForCountryOrCity(rawLoc || geo.country);
      const lat = (job.latitude !== null && job.latitude !== undefined) 
        ? job.latitude 
        : (geo.lat ?? (isJobHQ ? (hqCoords?.lat ?? hqGeo.lat ?? 37.7749) : 0));
      const lng = (job.longitude !== null && job.longitude !== undefined) 
        ? job.longitude 
        : (geo.lng ?? (isJobHQ ? (hqCoords?.lng ?? hqGeo.lng ?? -122.4194) : 0));

      branchMap.set(normalizedKey, {
        flag,
        city: geo.city || rawLoc || hqCity,
        country: geo.country || (geo.isBroadRegion ? "Remote" : "Global"),
        lat,
        lng,
        jobs: 1,
        isHQ: isJobHQ,
      });
    }
  }

  const branches = Array.from(branchMap.values());

  // Ensure there is at least one designated HQ branch
  const hasHQ = branches.some((b) => b.isHQ);
  if (!hasHQ && branches.length > 0) {
    branches[0].isHQ = true;
  }

  // Sort branches: HQ first, then descending by real job count
  branches.sort((a, b) => {
    if (a.isHQ && !b.isHQ) return -1;
    if (!a.isHQ && b.isHQ) return 1;
    return b.jobs - a.jobs;
  });

  return branches;
}

export function getCompanyIntelligence(company: any): CompanyIntelligence {
  const normName = (company.name || "").toLowerCase();
  const rawJobs = company.jobs || company.roles || [];
  const rawLoc = company.location_text || "San Francisco, CA, USA";
  const hqCoords = { lat: company.latitude, lng: company.longitude };

  const dynamicOfficeNetwork = computeDynamicOfficeNetwork(rawLoc, rawJobs, hqCoords);
  const actualPositionsCount = rawJobs.length;

  // 1. Anthropic Preset
  if (normName.includes("anthropic")) {
    return {
      ...ANTHROPIC_INTELLIGENCE,
      officeAddress: rawLoc,
      officeNetwork: dynamicOfficeNetwork,
      totalLocationsCount: dynamicOfficeNetwork.length,
      openPositionsCount: actualPositionsCount > 0 ? actualPositionsCount : ANTHROPIC_INTELLIGENCE.openPositionsCount,
    };
  }

  // 2. Named Presets
  for (const [key, preset] of Object.entries(COMPANY_PRESETS)) {
    if (normName.includes(key)) {
      return {
        ...ANTHROPIC_INTELLIGENCE,
        ...preset,
        founded: company.founded_year || preset.founded || 2020,
        teamSize: company.company_size || preset.teamSize || "500+ employees",
        about: company.description || preset.about || ANTHROPIC_INTELLIGENCE.about,
        officeAddress: rawLoc,
        officeNetwork: dynamicOfficeNetwork,
        totalLocationsCount: dynamicOfficeNetwork.length,
        openPositionsCount: actualPositionsCount > 0 ? actualPositionsCount : (preset.openPositionsCount || 0),
      };
    }
  }

  // 3. General Companies (CRED, Scale AI, Linear, Autodesk, NVIDIA, Adobe, etc.)
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
    officeNetwork: dynamicOfficeNetwork,
    totalLocationsCount: dynamicOfficeNetwork.length,
    departments: ANTHROPIC_INTELLIGENCE.departments,
    teamSize: company.company_size || "100-500 employees",
    openPositionsCount: actualPositionsCount,
  };
}

export interface CompanyMapPin {
  pinId: string;
  company: any;
  locationName: string;
  isHQ: boolean;
  latitude: number;
  longitude: number;
  roleCount: number;
  rolesAtLocation?: any[];
}

export function getAllPinsForCompanies(companies: any[]): CompanyMapPin[] {
  const pins: CompanyMapPin[] = [];
  const seenPinCoordinates = new Set<string>();

  for (const company of companies) {
    if (!company) continue;

    // 1. Primary HQ Pin
    if (company.latitude !== null && company.latitude !== undefined && company.longitude !== null && company.longitude !== undefined) {
      const coordKey = `${company.id}-${company.latitude.toFixed(3)}-${company.longitude.toFixed(3)}`;
      seenPinCoordinates.add(coordKey);
      pins.push({
        pinId: `${company.id}-hq`,
        company,
        locationName: company.location_text || "Headquarters",
        isHQ: true,
        latitude: company.latitude,
        longitude: company.longitude,
        roleCount: company.activeJobCount || (company.roles?.length || 1),
        rolesAtLocation: company.roles || [],
      });
    }

    // 2. Global Branch Network Pins
    const intel = getCompanyIntelligence(company);
    if (intel && intel.officeNetwork && intel.officeNetwork.length > 0) {
      for (const branch of intel.officeNetwork) {
        if (!branch.lat || !branch.lng) continue;
        
        // Skip if exact duplicate of existing pin for this company
        const coordKey = `${company.id}-${branch.lat.toFixed(3)}-${branch.lng.toFixed(3)}`;
        if (seenPinCoordinates.has(coordKey)) {
          continue;
        }
        seenPinCoordinates.add(coordKey);

        const citySlug = branch.city.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const matchingRoles = company.roles?.filter((r: any) =>
          matchesLocation(r.location_text, branch.city, r.job_type)
        ) || [];

        pins.push({
          pinId: `${company.id}-branch-${citySlug}`,
          company,
          locationName: `${branch.city}, ${branch.country}`,
          isHQ: !!branch.isHQ,
          latitude: branch.lat,
          longitude: branch.lng,
          roleCount: matchingRoles.length > 0 ? matchingRoles.length : (branch.jobs || 1),
          rolesAtLocation: matchingRoles,
        });
      }
    }
  }

  return pins;
}

