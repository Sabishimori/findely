// ── Smart Multi-Token Search & Relative Timestamp Utility ────────────────

const STOP_WORDS = new Set([
  "in", "at", "for", "the", "and", "or", "of", "to", "with", "a", "an", "on", "by", "from", "near", "jobs", "job", "hiring", "openings", "roles", "role"
]);

const SYNONYMS: Record<string, string[]> = {
  "usa": ["united states", "america", "us", "san francisco", "sf", "new york", "nyc", "seattle", "austin", "boston", "chicago", "los angeles", "la", "san diego", "denver", "atlanta", "california", "texas"],
  "us": ["united states", "america", "usa", "san francisco", "sf", "new york", "nyc", "seattle", "austin", "boston", "chicago", "los angeles", "la", "california"],
  "united states": ["usa", "us", "america"],
  "uk": ["united kingdom", "britain", "london", "england", "great britain"],
  "united kingdom": ["uk", "britain", "london"],
  "india": ["bengaluru", "bangalore", "mumbai", "delhi", "ncr", "hyderabad", "pune", "gurugram", "chennai", "ind"],
  "bengaluru": ["bangalore", "beangalure", "bengalore", "blr", "india"],
  "bangalore": ["bengaluru", "beangalure", "blr", "india"],
  "beangalure": ["bengaluru", "bangalore", "india"],
  "germany": ["berlin", "cologne", "munich", "frankfurt", "hamburg", "deutschland", "de"],
  "japan": ["tokyo", "osaka", "kyoto", "jp"],
  "tokyo": ["japan", "jp"],
  "london": ["uk", "united kingdom", "england"],
  "sf": ["san francisco", "bay area", "california", "usa"],
  "san francisco": ["sf", "bay area", "silicon valley", "california", "usa"],
  "nyc": ["new york", "manhattan", "brooklyn", "usa"],
  "new york": ["nyc", "manhattan", "usa"],
  "remote": ["worldwide", "distributed", "anywhere", "wfh"],
  "ui": ["ui/ux", "ux", "product design", "designer", "frontend"],
  "ux": ["ui/ux", "ui", "product design", "user experience", "designer"],
  "frontend": ["front-end", "ui", "react", "nextjs", "web", "client"],
  "backend": ["back-end", "server", "api", "node", "python", "golang", "rust"],
  "ml": ["machine learning", "ai", "artificial intelligence", "deep learning", "llm", "nlp"],
  "ai": ["artificial intelligence", "ml", "machine learning", "genai", "llm", "nlp"],
  "it": ["information technology", "tech support", "it support", "systems"],
  "support": ["customer support", "it support", "technical support", "helpdesk"],
};

export function parseSearchTokens(query: string): string[] {
  if (!query || !query.trim()) return [];
  
  // Clean special characters but preserve slashes for UI/UX, C++, etc.
  const cleaned = query
    .toLowerCase()
    .replace(/[,\.;:\?!#\(\)]/g, " ")
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  
  // Filter out standalone stop words unless the entire query is just that stop word
  const significant = words.filter(w => !STOP_WORDS.has(w));
  return significant.length > 0 ? significant : words;
}

export function matchSmartQuery(
  searchableTexts: (string | null | undefined)[],
  query: string
): boolean {
  if (!query || !query.trim()) return true;

  const tokens = parseSearchTokens(query);
  if (tokens.length === 0) return true;

  const combined = searchableTexts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[,\.;:\?!#\(\)]/g, " ");

  // Every token in the search query must find a match in the combined text (directly or via synonyms)
  return tokens.every(token => {
    // 1. Direct substring match
    if (combined.includes(token)) return true;

    // 2. Check synonyms
    const synList = SYNONYMS[token];
    if (synList && synList.some(syn => combined.includes(syn))) {
      return true;
    }

    // 3. Fuzzy check for simple character typo (e.g. beangalure -> bengaluru)
    for (const [key, aliases] of Object.entries(SYNONYMS)) {
      if (token.includes(key) || key.includes(token)) {
        if (combined.includes(key) || aliases.some(a => combined.includes(a))) {
          return true;
        }
      }
    }

    return false;
  });
}

export function formatRelativeTime(dateInput?: Date | string | number | null): string {
  if (!dateInput) return "Recently";

  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);
  const now = Date.now();
  const diffMs = Math.max(0, now - date.getTime());
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMinutes < 5) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks === 1) return "1w ago";
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths === 1) return "1mo ago";
  return `${diffMonths}mo ago`;
}
