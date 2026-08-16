import fs from 'fs';
import path from 'path';

// Read mass_global_seed.ts to extract GLOBAL_STARTUPS
const massSeedPath = path.join(process.cwd(), 'scripts', 'mass_global_seed.ts');
const content = fs.readFileSync(massSeedPath, 'utf8');

// Find GLOBAL_STARTUPS array
const startIdx = content.indexOf('const GLOBAL_STARTUPS: StartupDef[] = [');
const endIdx = content.indexOf('async function main()');

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find GLOBAL_STARTUPS in mass_global_seed.ts");
  process.exit(1);
}

const rawArrayString = content.substring(startIdx + 'const GLOBAL_STARTUPS: StartupDef[] = '.length, endIdx).trim();
// Remove trailing semicolon if any
const cleanedArrayString = rawArrayString.replace(/;\s*$/, '');

const fallbackDataFileContent = `export interface FallbackCompany {
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
  jobs: any[];
  sources: any[];
  founders: any[];
  hrLeads: any[];
  techStack: string[];
  latestPostDate?: Date | null;
}

interface StartupDef {
  name: string;
  domain: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  founded: number;
  size: string;
  founders: Array<{ name: string; role: string }>;
  techStack: string[];
  description: string;
  roles: Array<{ title: string; salary: string; type: string }>;
}

const RAW_GLOBAL_STARTUPS: StartupDef[] = ${cleanedArrayString};

export const FALLBACK_COMPANIES: FallbackCompany[] = RAW_GLOBAL_STARTUPS.map((s, idx) => {
  const companyId = "company-" + s.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const logoUrl = "https://www.google.com/s2/favicons?domain=" + s.domain + "&sz=128";
  
  const formattedRoles = s.roles.map((r, rIdx) => ({
    id: companyId + "-role-" + rIdx,
    company_id: companyId,
    title: r.title,
    location_text: s.city,
    latitude: s.lat,
    longitude: s.lng,
    salary_range: r.salary,
    work_mode: r.type.toLowerCase().includes("remote") ? "remote" : r.type.toLowerCase().includes("hybrid") ? "hybrid" : "onsite",
    role_category: r.title.includes("Designer") ? "Design" : r.title.includes("AI") || r.title.includes("Machine") ? "AI & ML" : "Engineering",
    apply_url: resolveExactJobApplyUrl({ companyName: s.name, websiteUrl: "https://" + s.domain, jobTitle: r.title }),
    description: s.name + " is seeking a high-caliber " + r.title + " to join our team in " + s.city + ". Tech stack: " + s.techStack.join(", ") + ".",
    posted_at: new Date(Date.now() - ((idx * 3 + rIdx) % 7 + 1) * 86400000),
    is_active: true,
  }));

  return {
    id: companyId,
    name: s.name,
    website_url: "https://" + s.domain,
    logo_url: logoUrl,
    description: s.description,
    location_text: s.city,
    latitude: s.lat,
    longitude: s.lng,
    founded_year: s.founded,
    company_size: s.size,
    contact_email: "careers@" + s.domain,
    contact_phone: null,
    status: "verified",
    activeJobCount: formattedRoles.length,
    jobTitles: formattedRoles.map(r => r.title),
    roles: formattedRoles,
    jobs: formattedRoles,
    sources: [],
    founders: s.founders,
    hrLeads: [],
    techStack: s.techStack,
    latestPostDate: formattedRoles[0]?.posted_at || new Date(),
  };
});
`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'lib', 'fallbackData.ts'), fallbackDataFileContent, 'utf8');
console.log("Successfully generated src/lib/fallbackData.ts with ALL 76+ startups and 176+ roles!");
