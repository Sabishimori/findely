/**
 * Findely Enterprise XSS (Cross-Site Scripting) Sanitization Engine
 * Protects all user inputs, profiles, job trackers, company submissions, and notes.
 */

// HTML Character Escape Map
const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

// Dangerous HTML tags that should never exist in raw text inputs
const DANGEROUS_TAGS_REGEX = /<\s*(script|iframe|object|embed|style|link|meta|applet|form|svg|math)[\s\S]*?>[\s\S]*?<\s*\/\s*\1\s*>|<\s*(script|iframe|object|embed|style|link|meta|applet|form|svg|math)[\s\S]*?>/gi;

// Dangerous JavaScript event handlers like onload=, onerror=, onclick=, etc.
const INLINE_HANDLERS_REGEX = /\bon\w+\s*=\s*(['"]).*?\1|\bon\w+\s*=\s*[^\s>]+/gi;

// Dangerous URI schemes
const DANGEROUS_PROTOCOLS_REGEX = /^(javascript:|vbscript:|data:text\/html|data:application\/javascript|data:image\/svg\+xml)/i;

/**
 * Strips dangerous HTML tags, inline JavaScript handlers, and escapes special HTML chars.
 */
export function sanitizeText(input: string | null | undefined, options?: { allowLineBreaks?: boolean }): string {
  if (!input || typeof input !== "string") return "";

  // 1. Remove dangerous script/iframe tags
  let cleaned = input.replace(DANGEROUS_TAGS_REGEX, "");

  // 2. Remove inline event handlers (onerror=, onload=, etc.)
  cleaned = cleaned.replace(INLINE_HANDLERS_REGEX, "");

  // 3. Remove null byte injection attacks
  cleaned = cleaned.replace(/\0/g, "");

  // 4. Escape angle brackets to prevent raw HTML markup injection
  cleaned = cleaned.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // 5. Trim excessive whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Validates and sanitizes URLs (LinkedIn, GitHub, Website, Portfolio, Apply URLs).
 * Only allows valid http, https, or mailto protocols.
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  // Block dangerous protocols
  if (DANGEROUS_PROTOCOLS_REGEX.test(trimmed)) {
    return null;
  }

  // Block protocol-relative URL exploits starting with //
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  // Must start with http://, https://, or mailto:
  if (/^https?:\/\//i.test(trimmed) || /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(trimmed)) {
    try {
      // Parse with URL constructor to ensure valid structural URI
      const parsed = new URL(trimmed);
      if (parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "mailto:") {
        return parsed.toString();
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Deep sanitizes all string properties inside objects and arrays (e.g. JSON blobs).
 */
export function sanitizeObject<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    return sanitizeText(data) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      // Check if the key indicates a URL
      if (key.toLowerCase().includes("url") || key.toLowerCase().includes("website") || key.toLowerCase().includes("link")) {
        result[key] = typeof value === "string" ? sanitizeUrl(value) : sanitizeObject(value);
      } else {
        result[key] = sanitizeObject(value);
      }
    }
    return result as T;
  }

  return data;
}
