export function matchesLocation(jobLocation: string | null | undefined, branchCity: string, jobType?: string | null): boolean {
  if (!branchCity) return true;

  const loc = (jobLocation || "").toLowerCase();
  const type = (jobType || "").toLowerCase();
  const cleanCity = branchCity.toLowerCase().split("/")[0].split(",")[0].trim();

  if (cleanCity.includes("remote") || cleanCity.includes("anywhere")) {
    return loc.includes("remote") || loc.includes("anywhere") || type.includes("remote");
  }

  if (!loc) return false;

  // Exact substring match
  if (loc.includes(cleanCity)) return true;

  // Common abbreviations with word boundary matching
  const abbreviations: Record<string, string[]> = {
    "san francisco": ["sf", "bay area"],
    "new york": ["nyc", "ny"],
    "new york city": ["nyc", "ny"],
    "seattle": ["sea"],
    "chicago": ["chi"],
    "atlanta": ["atl"],
    "bengaluru": ["blr", "bangalore"],
    "london": ["ldn", "uk"],
    "boston": ["bos"],
    "austin": ["atx"],
    "los angeles": ["la", "socal"],
    "tokyo": ["tyo"],
    "singapore": ["sg", "sgp"],
    "dublin": ["dub", "ireland"],
    "paris": ["par", "france"],
    "berlin": ["ber", "germany"],
    "amsterdam": ["ams", "netherlands"],
    "toronto": ["tor", "canada", "gta"],
    "sydney": ["syd", "australia"]
  };

  const abbrevs = abbreviations[cleanCity] || [];
  for (const abbr of abbrevs) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'i');
    if (regex.test(loc)) return true;
  }

  return false;
}
