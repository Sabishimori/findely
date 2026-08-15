/**
 * SSRF (Server-Side Request Forgery) Guard
 * Validates and sanitizes outgoing URLs before the scraper fetches them.
 */

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "0.0.0.0",
  "169.254.169.254", // AWS/GCP/Azure Instance Metadata Service
  "metadata.google.internal",
  "instance-data",
]);

/**
 * Checks if an IP address belongs to a private / loopback / link-local subnet.
 */
function isPrivateOrReservedIP(ip: string): boolean {
  // IPv4 regex check
  const ipv4Parts = ip.split(".").map(Number);
  if (ipv4Parts.length === 4 && ipv4Parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    const [a, b] = ipv4Parts;
    if (a === 127) return true; // Loopback 127.0.0.0/8
    if (a === 10) return true; // Private 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // Private 172.16.0.0/12
    if (a === 192 && b === 168) return true; // Private 192.168.0.0/16
    if (a === 169 && b === 254) return true; // Link-local 169.254.0.0/16
    if (a === 0) return true; // Current network 0.0.0.0/8
  }

  // IPv6 checks
  if (ip === "::1" || ip.startsWith("fe80:") || ip.startsWith("fc00:") || ip.startsWith("fd00:")) {
    return true;
  }

  return false;
}

export interface SSRFValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  error?: string;
}

export function validateUrlForScraping(rawUrl: string): SSRFValidationResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { isValid: false, error: "Missing or invalid URL" };
  }

  let parsed: URL;
  try {
    const formatted = rawUrl.startsWith("http://") || rawUrl.startsWith("https://") 
      ? rawUrl 
      : `https://${rawUrl}`;
    parsed = new URL(formatted);
  } catch (_) {
    return { isValid: false, error: "Malformed URL" };
  }

  // Protocol whitelist: only http and https
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { isValid: false, error: `Disallowed protocol: ${parsed.protocol}. Only http and https are permitted.` };
  }

  const hostname = parsed.hostname.toLowerCase().trim();

  // Check explicit blocklist
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { isValid: false, error: `Access to internal host '${hostname}' is strictly blocked.` };
  }

  // Check local/internal suffixes
  if (
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".lan")
  ) {
    return { isValid: false, error: `Access to internal network domains is blocked.` };
  }

  // Check private IP ranges
  if (isPrivateOrReservedIP(hostname)) {
    return { isValid: false, error: `Access to private IP address '${hostname}' is strictly blocked.` };
  }

  // Disallow basic auth in URLs (e.g. http://user:pass@evil.com)
  if (parsed.username || parsed.password) {
    return { isValid: false, error: "URLs with embedded credentials are not allowed." };
  }

  return {
    isValid: true,
    sanitizedUrl: parsed.toString(),
  };
}
