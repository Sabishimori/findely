/**
 * Findely High-Precision Global Spatial Geocoding Engine
 * Maps textual city/neighborhood strings into exact [longitude, latitude] coordinates
 * Covering India, USA, UK, Europe, Russia, China, Japan, Korea, Australia, New Zealand & Remote
 */

export interface GeocodedLocation {
  city: string;
  country: string;
  lat: number | null;
  lng: number | null;
  locationType: "onsite" | "hybrid" | "remote";
  isBroadRegion?: boolean;
}

export const CITY_COORDINATES: Record<string, { lat: number; lng: number; country: string }> = {
  // ── 1. INDIA TECH HUBS ──────────────────────────────────────────
  "bengaluru": { lat: 12.9716, lng: 77.5946, country: "India" },
  "bangalore": { lat: 12.9716, lng: 77.5946, country: "India" },
  "koramangala": { lat: 12.9352, lng: 77.6245, country: "India" },
  "indiranagar": { lat: 12.9784, lng: 77.6408, country: "India" },
  "whitefield": { lat: 12.9698, lng: 77.7500, country: "India" },
  "hsr layout": { lat: 12.9121, lng: 77.6446, country: "India" },
  "mumbai": { lat: 19.0760, lng: 72.8777, country: "India" },
  "delhi": { lat: 28.6139, lng: 77.2090, country: "India" },
  "new delhi": { lat: 28.6139, lng: 77.2090, country: "India" },
  "gurgaon": { lat: 28.4595, lng: 77.0266, country: "India" },
  "gurugram": { lat: 28.4595, lng: 77.0266, country: "India" },
  "noida": { lat: 28.5355, lng: 77.3910, country: "India" },
  "hyderabad": { lat: 17.3850, lng: 78.4867, country: "India" },
  "hitec city": { lat: 17.4435, lng: 78.3772, country: "India" },
  "pune": { lat: 18.5204, lng: 73.8567, country: "India" },
  "chennai": { lat: 13.0827, lng: 80.2707, country: "India" },
  "ahmedabad": { lat: 23.0225, lng: 72.5714, country: "India" },
  "kolkata": { lat: 22.5726, lng: 88.3639, country: "India" },

  // ── 2. USA TECH HUBS ───────────────────────────────────────────
  "san francisco": { lat: 37.7749, lng: -122.4194, country: "United States" },
  "sf": { lat: 37.7749, lng: -122.4194, country: "United States" },
  "south park": { lat: 37.7818, lng: -122.3942, country: "United States" },
  "soma": { lat: 37.7785, lng: -122.4056, country: "United States" },
  "mission district": { lat: 37.7599, lng: -122.4148, country: "United States" },
  "palo alto": { lat: 37.4419, lng: -122.1430, country: "United States" },
  "mountain view": { lat: 37.3861, lng: -122.0839, country: "United States" },
  "sunnyvale": { lat: 37.3688, lng: -122.0363, country: "United States" },
  "san jose": { lat: 37.3382, lng: -121.8863, country: "United States" },
  "oakland": { lat: 37.8044, lng: -122.2712, country: "United States" },
  "berkeley": { lat: 37.8715, lng: -122.2730, country: "United States" },
  "new york": { lat: 40.7128, lng: -74.0060, country: "United States" },
  "new york city": { lat: 40.7128, lng: -74.0060, country: "United States" },
  "nyc": { lat: 40.7128, lng: -74.0060, country: "United States" },
  "manhattan": { lat: 40.7831, lng: -73.9712, country: "United States" },
  "brooklyn": { lat: 40.6782, lng: -73.9442, country: "United States" },
  "seattle": { lat: 47.6062, lng: -122.3321, country: "United States" },
  "austin": { lat: 30.2672, lng: -97.7431, country: "United States" },
  "boston": { lat: 42.3601, lng: -71.0589, country: "United States" },
  "los angeles": { lat: 34.0522, lng: -118.2437, country: "United States" },
  "chicago": { lat: 41.8781, lng: -87.6298, country: "United States" },
  "san diego": { lat: 32.7157, lng: -117.1611, country: "United States" },
  "miami": { lat: 25.7617, lng: -80.1918, country: "United States" },

  // ── 3. UNITED KINGDOM ──────────────────────────────────────────
  "london": { lat: 51.5074, lng: -0.1278, country: "United Kingdom" },
  "shoreditch": { lat: 51.5260, lng: -0.0780, country: "United Kingdom" },
  "kings cross": { lat: 51.5308, lng: -0.1238, country: "United Kingdom" },
  "cambridge": { lat: 52.2053, lng: 0.1218, country: "United Kingdom" },
  "oxford": { lat: 51.7520, lng: -1.2577, country: "United Kingdom" },
  "manchester": { lat: 53.4808, lng: -2.2426, country: "United Kingdom" },
  "edinburgh": { lat: 55.9533, lng: -3.1883, country: "United Kingdom" },
  "bristol": { lat: 51.4545, lng: -2.5879, country: "United Kingdom" },

  // ── 4. EUROPE TECH HUBS ────────────────────────────────────────
  "berlin": { lat: 52.5200, lng: 13.4050, country: "Germany" },
  "munich": { lat: 48.1351, lng: 11.5820, country: "Germany" },
  "paris": { lat: 48.8566, lng: 2.3522, country: "France" },
  "amsterdam": { lat: 52.3676, lng: 4.9041, country: "Netherlands" },
  "stockholm": { lat: 59.3293, lng: 18.0686, country: "Sweden" },
  "zurich": { lat: 47.3769, lng: 8.5417, country: "Switzerland" },
  "geneva": { lat: 46.2044, lng: 6.1432, country: "Switzerland" },
  "dublin": { lat: 53.3498, lng: -6.2603, country: "Ireland" },
  "tallinn": { lat: 59.4370, lng: 24.7536, country: "Estonia" },
  "helsinki": { lat: 60.1699, lng: 24.9384, country: "Finland" },
  "copenhagen": { lat: 55.6761, lng: 12.5683, country: "Denmark" },
  "oslo": { lat: 59.9139, lng: 10.7522, country: "Norway" },
  "lisbon": { lat: 38.7223, lng: -9.1393, country: "Portugal" },
  "madrid": { lat: 40.4168, lng: -3.7038, country: "Spain" },
  "barcelona": { lat: 41.3879, lng: 2.1699, country: "Spain" },
  "warsaw": { lat: 52.2297, lng: 21.0122, country: "Poland" },
  "vienna": { lat: 48.2082, lng: 16.3738, country: "Austria" },
  "prague": { lat: 50.0755, lng: 14.4378, country: "Czech Republic" },

  // ── 5. RUSSIA TECH HUBS ────────────────────────────────────────
  "moscow": { lat: 55.7558, lng: 37.6173, country: "Russia" },
  "saint petersburg": { lat: 59.9311, lng: 30.3609, country: "Russia" },
  "st petersburg": { lat: 59.9311, lng: 30.3609, country: "Russia" },
  "novosibirsk": { lat: 55.0084, lng: 82.9357, country: "Russia" },
  "kazan": { lat: 55.8304, lng: 49.0661, country: "Russia" },
  "innopolis": { lat: 55.7500, lng: 48.7400, country: "Russia" },
  "yekaterinburg": { lat: 56.8389, lng: 60.6057, country: "Russia" },

  // ── 6. CHINA & ASIA HUBS ───────────────────────────────────────
  "beijing": { lat: 39.9042, lng: 116.4074, country: "China" },
  "shanghai": { lat: 31.2304, lng: 121.4737, country: "China" },
  "shenzhen": { lat: 22.5431, lng: 114.0579, country: "China" },
  "hangzhou": { lat: 30.2741, lng: 120.1551, country: "China" },
  "guangzhou": { lat: 23.1291, lng: 113.2644, country: "China" },
  "hong kong": { lat: 22.3193, lng: 114.1694, country: "Hong Kong" },
  "taipei": { lat: 25.0330, lng: 121.5654, country: "Taiwan" },
  "singapore": { lat: 1.3521, lng: 103.8198, country: "Singapore" },

  // ── 7. JAPAN TECH HUBS ─────────────────────────────────────────
  "tokyo": { lat: 35.6762, lng: 139.6503, country: "Japan" },
  "shibuya": { lat: 35.6580, lng: 139.7016, country: "Japan" },
  "roppongi": { lat: 35.6628, lng: 139.7314, country: "Japan" },
  "minato": { lat: 35.6585, lng: 139.7514, country: "Japan" },
  "kyoto": { lat: 35.0116, lng: 135.7681, country: "Japan" },
  "osaka": { lat: 34.6937, lng: 135.5023, country: "Japan" },
  "nagoya": { lat: 35.1815, lng: 136.9066, country: "Japan" },
  "fukuoka": { lat: 33.5904, lng: 130.4017, country: "Japan" },

  // ── 8. SOUTH KOREA TECH HUBS ───────────────────────────────────
  "seoul": { lat: 37.5665, lng: 126.9780, country: "South Korea" },
  "gangnam": { lat: 37.4979, lng: 127.0276, country: "South Korea" },
  "pangyo": { lat: 37.3948, lng: 127.1119, country: "South Korea" },
  "seongnam": { lat: 37.4200, lng: 127.1265, country: "South Korea" },
  "busan": { lat: 35.1796, lng: 129.0756, country: "South Korea" },
  "incheon": { lat: 37.4563, lng: 126.7052, country: "South Korea" },
  "daejeon": { lat: 36.3504, lng: 127.3845, country: "South Korea" },

  // ── 9. AUSTRALIA TECH HUBS ─────────────────────────────────────
  "sydney": { lat: -33.8688, lng: 151.2093, country: "Australia" },
  "melbourne": { lat: -37.8136, lng: 144.9631, country: "Australia" },
  "brisbane": { lat: -27.4698, lng: 153.0251, country: "Australia" },
  "perth": { lat: -31.9505, lng: 115.8605, country: "Australia" },
  "adelaide": { lat: -34.9285, lng: 138.6007, country: "Australia" },
  "canberra": { lat: -35.2809, lng: 149.1300, country: "Australia" },

  // ── 10. NEW ZEALAND TECH HUBS ──────────────────────────────────
  "auckland": { lat: -36.8485, lng: 174.7633, country: "New Zealand" },
  "wellington": { lat: -41.2865, lng: 174.7762, country: "New Zealand" },
  "christchurch": { lat: -43.5321, lng: 172.6362, country: "New Zealand" },
  "queenstown": { lat: -45.0312, lng: 168.6626, country: "New Zealand" },
};

const BROAD_REGION_PATTERNS = [
  /^remote$/i,
  /^worldwide$/i,
  /^global$/i,
  /^anywhere$/i,
  /^distributed$/i,
  /^wfh$/i,
  /^virtual$/i,
  /^work from anywhere$/i,
  /^(?:europe|eu|emea|european union)(?:\s*\(?remote\)?)?$/i,
  /^(?:north america|amer|namer|us\/ca|latam|south america)(?:\s*\(?remote\)?)?$/i,
  /^(?:apac|asia pacific|asia|australasia)(?:\s*\(?remote\)?)?$/i,
  /^(?:us|usa|united states|canada|uk|germany|france|india|japan|korea|australia)\s+(?:remote|nationwide|virtual)$/i,
  /^(?:remote|virtual)\s+(?:us|usa|united states|canada|uk|germany|france|india|japan|korea|australia)$/i,
  /^(?:remote\s*[-–—/]\s*(?:us|usa|amer|eu|europe|apac|latam|global|worldwide|emea|india|uk|germany))$/i,
  /^(?:(?:us|usa|amer|eu|europe|apac|latam|global|worldwide|emea|india|uk|germany)\s*[-–—/]\s*remote)$/i,
  /.*remote\s*-\s*(?:us|amer|eu|emea|apac|latam|global|worldwide|india).*/i,
  /.*(?:us|amer|eu|emea|apac|latam|global|worldwide|india)\s*-\s*remote.*/i,
  /.*(?:remote\s*,\s*(?:us|usa|india|uk|germany|france|japan|canada)).*/i,
  /.*(?:(?:us|usa|india|uk|germany|france|japan|canada)\s*,\s*remote).*/i,
];

export function isBroadRegionLocation(rawLocation?: string): boolean {
  if (!rawLocation) return true;
  const s = rawLocation.trim();
  return BROAD_REGION_PATTERNS.some((p) => p.test(s));
}

/**
 * Geocode an arbitrary location string from an ATS job post
 */
export function geocodeLocation(rawLocation?: string): GeocodedLocation {
  if (!rawLocation) {
    return {
      city: "Remote",
      country: "Worldwide",
      lat: null,
      lng: null,
      locationType: "remote",
      isBroadRegion: true,
    };
  }

  const normalized = rawLocation.toLowerCase().trim();

  // 1. Broad region / purely remote check (e.g. "Europe", "Remote", "North America", "AMER")
  if (isBroadRegionLocation(rawLocation)) {
    return {
      city: rawLocation.trim(),
      country: "Remote / Multi-region",
      lat: null,
      lng: null,
      locationType: "remote",
      isBroadRegion: true,
    };
  }

  // Detect Remote & Hybrid modifiers for real cities (e.g. "London (Remote)" or "Berlin (Hybrid)")
  const isRemote = 
    normalized.includes("remote") || 
    normalized.includes("anywhere") || 
    normalized.includes("worldwide") ||
    normalized.includes("distributed");

  const isHybrid = normalized.includes("hybrid");

  // 2. Check matching city dictionary
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized.includes(key)) {
      // Add slight jitter (0.002 to 0.005) so multiple pins don't overlap completely
      const jitterLat = (Math.random() - 0.5) * 0.008;
      const jitterLng = (Math.random() - 0.5) * 0.008;

      return {
        city: key.charAt(0).toUpperCase() + key.slice(1),
        country: coords.country,
        lat: Number((coords.lat + jitterLat).toFixed(6)),
        lng: Number((coords.lng + jitterLng).toFixed(6)),
        locationType: isRemote ? "remote" : isHybrid ? "hybrid" : "onsite",
        isBroadRegion: false,
      };
    }
  }

  // 3. Specific Country fallback checks
  if (normalized.includes("india")) {
    return { city: "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946, locationType: isRemote ? "remote" : "onsite", isBroadRegion: false };
  }
  if (normalized.includes("japan")) {
    return { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, locationType: isRemote ? "remote" : "onsite", isBroadRegion: false };
  }
  if (normalized.includes("korea")) {
    return { city: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780, locationType: isRemote ? "remote" : "onsite", isBroadRegion: false };
  }
  if (normalized.includes("uk") || normalized.includes("united kingdom")) {
    return { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, locationType: isRemote ? "remote" : "onsite", isBroadRegion: false };
  }
  if (normalized.includes("germany")) {
    return { city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, locationType: isRemote ? "remote" : "onsite", isBroadRegion: false };
  }
  if (normalized.includes("france")) {
    return { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, locationType: isRemote ? "remote" : "onsite", isBroadRegion: false };
  }
  if (normalized.includes("russia")) {
    return { city: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173, locationType: isRemote ? "remote" : "onsite", isBroadRegion: false };
  }
  if (normalized.includes("china")) {
    return { city: "Beijing", country: "China", lat: 39.9042, lng: 116.4074, locationType: isRemote ? "remote" : "onsite", isBroadRegion: false };
  }
  if (normalized.includes("australia")) {
    return { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, locationType: isRemote ? "remote" : "onsite", isBroadRegion: false };
  }

  // Default fallback if unknown city — explicitly set null coordinates rather than guessing SF
  return {
    city: rawLocation.split(",")[0]?.trim() || "Remote",
    country: isRemote ? "Remote" : "Unknown",
    lat: null,
    lng: null,
    locationType: isRemote ? "remote" : isHybrid ? "hybrid" : "onsite",
    isBroadRegion: true,
  };
}

/**
 * High-Precision Real-World Geocoding with OpenStreetMap Nominatim + Fallback
 */
export async function geocodeRealLocation(rawLocation?: string): Promise<GeocodedLocation> {
  if (!rawLocation) {
    return geocodeLocation("San Francisco, CA, USA");
  }

  const clean = rawLocation.trim();

  // Try OpenStreetMap Nominatim Live Geocoder
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(clean)}&limit=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Findely-Spatial-Discovery-Engine/1.0 (+https://findely.app)",
      },
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const displayName = item.display_name || clean;

        if (!isNaN(lat) && !isNaN(lng)) {
          return {
            city: clean,
            country: displayName.split(",").pop()?.trim() || "Global",
            lat: Number(lat.toFixed(6)),
            lng: Number(lng.toFixed(6)),
            locationType: clean.toLowerCase().includes("remote") ? "remote" : "onsite",
          };
        }
      }
    }
  } catch (e) {
    console.warn(`[Nominatim Geocoder] Falling back to high-precision index for "${clean}"`);
  }

  // High-precision offline dictionary fallback
  return geocodeLocation(rawLocation);
}
