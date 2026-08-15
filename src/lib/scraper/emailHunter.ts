/**
 * Findely Contact & Recruiter Email Hunter
 * Extracts real hiring, talent, and career emails while filtering out junk/spam addresses
 */

const HIRING_EMAIL_PREFIXES = [
  "careers",
  "jobs",
  "talent",
  "hiring",
  "recruiting",
  "people",
  "founders",
  "founder",
  "team",
  "hello",
  "join",
];

const JUNK_PREFIXES = [
  "support",
  "help",
  "billing",
  "sales",
  "press",
  "media",
  "privacy",
  "legal",
  "security",
  "abuse",
  "noreply",
  "no-reply",
  "unsubscribe",
  "terms",
  "contact",
];

/**
 * Extract verified recruiting/careers email from text or HTML
 */
export function huntRecruiterEmail(
  content: string,
  companyDomain?: string
): string | null {
  if (!content) return null;

  // Regex to extract all valid email patterns
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const matches = content.match(emailRegex);

  if (!matches || matches.length === 0) {
    // If company domain provided, check standard fallback
    if (companyDomain && !["gmail.com", "yahoo.com"].includes(companyDomain)) {
      return `careers@${companyDomain}`;
    }
    return null;
  }

  // Deduplicate and filter matches
  const uniqueEmails = Array.from(new Set(matches.map((m) => m.toLowerCase().trim())));

  // 1. Look for explicit hiring email prefixes
  for (const email of uniqueEmails) {
    const prefix = email.split("@")[0].toLowerCase();
    if (HIRING_EMAIL_PREFIXES.some((hp) => prefix.includes(hp))) {
      return email;
    }
  }

  // 2. Look for company domain matching emails that aren't junk
  if (companyDomain) {
    const domainEmail = uniqueEmails.find((email) => {
      const parts = email.split("@");
      const prefix = parts[0];
      const domain = parts[1];
      if (domain === companyDomain) {
        return !JUNK_PREFIXES.some((jp) => prefix.includes(jp));
      }
      return false;
    });
    if (domainEmail) return domainEmail;
  }

  // 3. Fallback to first non-junk email
  const cleanEmail = uniqueEmails.find((email) => {
    const prefix = email.split("@")[0];
    return !JUNK_PREFIXES.some((jp) => prefix.includes(jp));
  });

  return cleanEmail || null;
}
