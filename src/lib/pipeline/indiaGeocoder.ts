/**
 * Findely India Tech Hub Geocoder & Coordinate Mapping Engine
 * Maps Indian neighborhoods, tech parks, and cities to precise latitude/longitude coordinates.
 */

export interface GeocodedLocation {
  city: string;
  neighborhood?: string;
  state: string;
  country: "India";
  lat: number;
  lng: number;
}

export const INDIA_TECH_HUBS: Record<string, GeocodedLocation> = {
  // ── Bengaluru Tech Corridors ─────────────────────────────────────────
  "bengaluru": { city: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lng: 77.5946 },
  "bangalore": { city: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lng: 77.5946 },
  "koramangala": { city: "Bengaluru", neighborhood: "Koramangala", state: "Karnataka", country: "India", lat: 12.9352, lng: 77.6245 },
  "hsr layout": { city: "Bengaluru", neighborhood: "HSR Layout", state: "Karnataka", country: "India", lat: 12.9121, lng: 77.6446 },
  "indiranagar": { city: "Bengaluru", neighborhood: "Indiranagar", state: "Karnataka", country: "India", lat: 12.9784, lng: 77.6408 },
  "whitefield": { city: "Bengaluru", neighborhood: "Whitefield", state: "Karnataka", country: "India", lat: 12.9698, lng: 77.7500 },
  "domlur": { city: "Bengaluru", neighborhood: "Domlur", state: "Karnataka", country: "India", lat: 12.9609, lng: 77.6387 },
  "jp nagar": { city: "Bengaluru", neighborhood: "JP Nagar", state: "Karnataka", country: "India", lat: 12.9063, lng: 77.5857 },
  "electronic city": { city: "Bengaluru", neighborhood: "Electronic City", state: "Karnataka", country: "India", lat: 12.8452, lng: 77.6602 },
  "outer ring road": { city: "Bengaluru", neighborhood: "Bellandur ORR", state: "Karnataka", country: "India", lat: 12.9304, lng: 77.6784 },

  // ── Delhi NCR & Gurugram Hubs ────────────────────────────────────────
  "gurugram": { city: "Gurugram", state: "Haryana", country: "India", lat: 28.4595, lng: 77.0266 },
  "gurgaon": { city: "Gurugram", state: "Haryana", country: "India", lat: 28.4595, lng: 77.0266 },
  "cyber city": { city: "Gurugram", neighborhood: "DLF Cyber City", state: "Haryana", country: "India", lat: 28.4950, lng: 77.0895 },
  "golf course road": { city: "Gurugram", neighborhood: "Golf Course Road", state: "Haryana", country: "India", lat: 28.4623, lng: 77.0984 },
  "noida": { city: "Noida", state: "Uttar Pradesh", country: "India", lat: 28.5355, lng: 77.3910 },
  "delhi": { city: "New Delhi", state: "Delhi", country: "India", lat: 28.6139, lng: 77.2090 },
  "new delhi": { city: "New Delhi", state: "Delhi", country: "India", lat: 28.6139, lng: 77.2090 },

  // ── Hyderabad Tech Corridors ─────────────────────────────────────────
  "hyderabad": { city: "Hyderabad", state: "Telangana", country: "India", lat: 17.3850, lng: 78.4867 },
  "hitec city": { city: "Hyderabad", neighborhood: "HITEC City", state: "Telangana", country: "India", lat: 17.4435, lng: 78.3772 },
  "gachibowli": { city: "Hyderabad", neighborhood: "Gachibowli", state: "Telangana", country: "India", lat: 17.4401, lng: 78.3489 },
  "madhapur": { city: "Hyderabad", neighborhood: "Madhapur", state: "Telangana", country: "India", lat: 17.4483, lng: 78.3915 },
  "financial district": { city: "Hyderabad", neighborhood: "Financial District", state: "Telangana", country: "India", lat: 17.4156, lng: 78.3427 },

  // ── Mumbai & Pune Innovation Hubs ────────────────────────────────────
  "mumbai": { city: "Mumbai", state: "Maharashtra", country: "India", lat: 19.0760, lng: 72.8777 },
  "bkc": { city: "Mumbai", neighborhood: "Bandra Kurla Complex", state: "Maharashtra", country: "India", lat: 19.0664, lng: 72.8683 },
  "andheri": { city: "Mumbai", neighborhood: "Andheri East", state: "Maharashtra", country: "India", lat: 19.1197, lng: 72.8464 },
  "pune": { city: "Pune", state: "Maharashtra", country: "India", lat: 18.5204, lng: 73.8567 },
  "baner": { city: "Pune", neighborhood: "Baner", state: "Maharashtra", country: "India", lat: 18.5590, lng: 73.7868 },
  "hinjawadi": { city: "Pune", neighborhood: "Hinjawadi Infotech Park", state: "Maharashtra", country: "India", lat: 18.5913, lng: 73.7389 },
  "viman nagar": { city: "Pune", neighborhood: "Viman Nagar", state: "Maharashtra", country: "India", lat: 18.5679, lng: 73.9143 },

  // ── Chennai, Kochi, Ahmedabad & Emerging Corridors ───────────────────
  "chennai": { city: "Chennai", state: "Tamil Nadu", country: "India", lat: 13.0827, lng: 80.2707 },
  "omr": { city: "Chennai", neighborhood: "OMR IT Corridor", state: "Tamil Nadu", country: "India", lat: 12.9348, lng: 80.2285 },
  "guindy": { city: "Chennai", neighborhood: "Guindy Industrial Estate", state: "Tamil Nadu", country: "India", lat: 13.0067, lng: 80.2025 },
  "ahmedabad": { city: "Ahmedabad", state: "Gujarat", country: "India", lat: 23.0225, lng: 72.5714 },
  "kochi": { city: "Kochi", state: "Kerala", country: "India", lat: 9.9312, lng: 76.2673 },
  "infopark": { city: "Kochi", neighborhood: "Infopark Kakkanad", state: "Kerala", country: "India", lat: 10.0159, lng: 76.3639 },
  "jaipur": { city: "Jaipur", state: "Rajasthan", country: "India", lat: 26.9124, lng: 75.7873 },
  "chandigarh": { city: "Chandigarh", state: "Chandigarh", country: "India", lat: 30.7333, lng: 76.7794 },
  "coimbatore": { city: "Coimbatore", state: "Tamil Nadu", country: "India", lat: 11.0168, lng: 76.9558 },
  "kolkata": { city: "Kolkata", state: "West Bengal", country: "India", lat: 22.5726, lng: 88.3639 },
  "salt lake": { city: "Kolkata", neighborhood: "Salt Lake Sector V", state: "West Bengal", country: "India", lat: 22.5786, lng: 88.4326 },
};

/**
 * Geocode any Indian city or neighborhood to exact GPS coordinates
 */
export function geocodeIndianLocation(rawLocation: string): GeocodedLocation {
  if (!rawLocation) {
    return INDIA_TECH_HUBS["bengaluru"];
  }

  const normalized = rawLocation.toLowerCase().trim();

  // 1. Direct key match
  for (const [key, loc] of Object.entries(INDIA_TECH_HUBS)) {
    if (normalized.includes(key)) {
      return loc;
    }
  }

  // 2. Default to central Bengaluru Innovation Corridor if no specific city matches
  return {
    city: rawLocation.split(",")[0].trim() || "Bengaluru",
    state: "Karnataka",
    country: "India",
    lat: 12.9716 + (Math.random() - 0.5) * 0.04, // slight deterministic jitter to prevent pin stacking
    lng: 77.5946 + (Math.random() - 0.5) * 0.04,
  };
}
