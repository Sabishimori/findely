/**
 * Findely AI Intelligence Normalizer & Enrichment Engine
 * Standardizes salaries (INR LPA & USD), company tiers, tech stacks, and brand logos.
 */

export interface NormalizedSalary {
  minSalary?: number;
  maxSalary?: number;
  currency: string;
  formatted: string;
}

export type CompanyTier = "breakout" | "mid_tier" | "boutique_studio" | "bootstrapped";

/**
 * Standardizes salary strings in INR (Lakhs / LPA) and USD ($)
 */
export function normalizeSalary(rawSalary?: string | number): NormalizedSalary {
  if (!rawSalary) {
    return { currency: "USD", formatted: "Competitive Equity & Salary" };
  }

  const str = String(rawSalary).trim();

  // 1. Check INR / LPA patterns (e.g. "15 - 25 LPA" or "₹18,00,000" or "20 Lakhs")
  const lpaMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*(?:lpa|lakh|lac|l)/i);
  if (lpaMatch) {
    const min = Math.round(parseFloat(lpaMatch[1]) * 100000);
    const max = Math.round(parseFloat(lpaMatch[2]) * 100000);
    return {
      minSalary: min,
      maxSalary: max,
      currency: "INR",
      formatted: `₹${lpaMatch[1]} - ₹${lpaMatch[2]} LPA`,
    };
  }

  const singleLpaMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:lpa|lakh|lac|l)/i);
  if (singleLpaMatch) {
    const amount = Math.round(parseFloat(singleLpaMatch[1]) * 100000);
    return {
      minSalary: amount,
      maxSalary: amount,
      currency: "INR",
      formatted: `₹${singleLpaMatch[1]} LPA`,
    };
  }

  // 2. Check USD patterns (e.g. "$120k - $180k" or "$140,000")
  const usdKMatch = str.match(/\$?(\d+)(?:k)?\s*(?:-|to)\s*\$?(\d+)(?:k)?/i);
  if (usdKMatch) {
    let min = parseInt(usdKMatch[1], 10);
    let max = parseInt(usdKMatch[2], 10);
    if (min < 1000) min *= 1000;
    if (max < 1000) max *= 1000;
    return {
      minSalary: min,
      maxSalary: max,
      currency: "USD",
      formatted: `$${min / 1000}k - $${max / 1000}k USD`,
    };
  }

  return {
    currency: "USD",
    formatted: str,
  };
}

/**
 * Classifies company tier based on team size, funding, and studio/craft characteristics
 */
export function classifyCompanyTier(company: {
  teamSize?: string | number;
  fundingStage?: string;
  industry?: string;
  description?: string;
  name?: string;
}): CompanyTier {
  const text = `${company.name || ""} ${company.description || ""} ${company.industry || ""} ${company.fundingStage || ""}`.toLowerCase();

  if (text.includes("studio") || text.includes("design agency") || text.includes("craft") || text.includes("consultancy") || text.includes("boutique")) {
    return "boutique_studio";
  }

  if (text.includes("bootstrapped") || text.includes("indie") || text.includes("profitable without vc") || text.includes("self-funded")) {
    return "bootstrapped";
  }

  if (text.includes("series a") || text.includes("series b") || text.includes("breakout") || text.includes("unicorn") || text.includes("yc w") || text.includes("yc s")) {
    return "breakout";
  }

  return "mid_tier";
}

/**
 * Resolves reliable brand favicon / logo
 */
export function resolveBrandLogo(domainOrUrl: string): string {
  try {
    let domain = domainOrUrl.trim();
    if (domain.startsWith("http")) {
      domain = new URL(domain).hostname;
    }
    domain = domain.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return `https://www.google.com/s2/favicons?domain=google.com&sz=128`;
  }
}

/**
 * Normalizes tech stack tags into clean, standardized labels
 */
export function normalizeTechStack(tags: string[] = []): string[] {
  const dictionary: Record<string, string> = {
    "react": "React",
    "react.js": "React",
    "reactjs": "React",
    "next": "Next.js",
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "node": "Node.js",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "python": "Python",
    "py": "Python",
    "pytorch": "PyTorch",
    "tensorflow": "TensorFlow",
    "fastapi": "FastAPI",
    "golang": "Go",
    "go": "Go",
    "rust": "Rust",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "redis": "Redis",
    "graphql": "GraphQL",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "k8s": "Kubernetes",
    "aws": "AWS",
    "figma": "Figma",
    "ui/ux": "UI/UX Craft",
    "solidity": "Solidity",
  };

  const set = new Set<string>();
  for (const tag of tags) {
    if (!tag) continue;
    const clean = tag.trim().toLowerCase();
    if (dictionary[clean]) {
      set.add(dictionary[clean]);
    } else if (tag.length > 1 && tag.length < 25) {
      set.add(tag.charAt(0).toUpperCase() + tag.slice(1));
    }
  }

  return Array.from(set).slice(0, 8);
}
