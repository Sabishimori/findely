/**
 * Findely Geographic & Spatial Coordinates Utility
 * Provides area autocomplete, instant spatial zoom coordinates, and reverse-geocoding.
 */

export interface StartupTechHub {
  name: string;
  region: string;
  country: string;
  coordinates: [number, number]; // [lng, lat]
  zoom: number;
}

export const KNOWN_AREAS: StartupTechHub[] = [
  { name: "San Francisco & Bay Area", region: "California", country: "United States", coordinates: [-122.4194, 37.7749], zoom: 10.5 },
  { name: "Silicon Valley / South Bay", region: "California", country: "United States", coordinates: [-122.0839, 37.3861], zoom: 11 },
  { name: "New York City", region: "New York", country: "United States", coordinates: [-74.006, 40.7128], zoom: 10.8 },
  { name: "London", region: "Greater London", country: "United Kingdom", coordinates: [-0.1278, 51.5074], zoom: 10.5 },
  { name: "Berlin", region: "Berlin", country: "Germany", coordinates: [13.405, 52.52], zoom: 10.5 },
  { name: "Bengaluru", region: "Karnataka", country: "India", coordinates: [77.5946, 12.9716], zoom: 10.5 },
  { name: "Tokyo", region: "Kanto", country: "Japan", coordinates: [139.6917, 35.6895], zoom: 10.5 },
  { name: "Singapore", region: "Central", country: "Singapore", coordinates: [103.8198, 1.3521], zoom: 11 },
  { name: "Sydney", region: "New South Wales", country: "Australia", coordinates: [151.2093, -33.8688], zoom: 10.5 },
  { name: "Austin", region: "Texas", country: "United States", coordinates: [-97.7431, 30.2672], zoom: 10.5 },
  { name: "Seattle", region: "Washington", country: "United States", coordinates: [-122.3321, 47.6062], zoom: 10.5 },
  { name: "Boston & Cambridge", region: "Massachusetts", country: "United States", coordinates: [-71.0589, 42.3601], zoom: 10.5 },
  { name: "Paris", region: "Île-de-France", country: "France", coordinates: [2.3522, 48.8566], zoom: 10.5 },
  { name: "Amsterdam", region: "North Holland", country: "Netherlands", coordinates: [4.9041, 52.3676], zoom: 10.5 },
  { name: "Toronto", region: "Ontario", country: "Canada", coordinates: [-79.3832, 43.6532], zoom: 10.5 },
  { name: "Zurich", region: "Zurich", country: "Switzerland", coordinates: [8.5417, 47.3769], zoom: 10.5 },
  { name: "Stockholm", region: "Stockholm", country: "Sweden", coordinates: [18.0686, 59.3293], zoom: 10.5 },
  { name: "Tel Aviv", region: "Tel Aviv", country: "Israel", coordinates: [34.7818, 32.0853], zoom: 10.5 },
];

/**
 * Filter known global tech hubs and areas based on search query
 */
export function searchTechAreas(query: string, maxResults = 3): StartupTechHub[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return KNOWN_AREAS.filter(
    (area) =>
      area.name.toLowerCase().includes(q) ||
      area.region.toLowerCase().includes(q) ||
      area.country.toLowerCase().includes(q)
  ).slice(0, maxResults);
}

export interface ReverseGeocodeResult {
  fullAddress: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

/**
 * Reverse geocodes [lat, lng] to human-readable address with graceful fallback
 */
export async function reverseGeocodeLocation(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult> {
  const roundedLat = parseFloat(lat.toFixed(5));
  const roundedLng = parseFloat(lng.toFixed(5));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${roundedLat}&lon=${roundedLng}&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Findely-Spatial-Mapper/1.0 (+https://findely.app)",
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        const addressObj = data.address || {};
        const city =
          addressObj.city ||
          addressObj.town ||
          addressObj.village ||
          addressObj.suburb ||
          addressObj.county ||
          "Frontier Tech Hub";
        const country = addressObj.country || "Global";

        return {
          fullAddress: data.display_name,
          city: `${city}, ${country}`,
          country,
          latitude: roundedLat,
          longitude: roundedLng,
        };
      }
    }
  } catch (err) {
    console.warn("Reverse geocode network timeout, using spatial coordinate fallback:", err);
  }

  // Fallback to closest known tech hub or raw coordinates
  let closestHub = "Spatial Tech Hub";
  let minDistance = Infinity;
  for (const hub of KNOWN_AREAS) {
    const d = Math.hypot(hub.coordinates[1] - roundedLat, hub.coordinates[0] - roundedLng);
    if (d < minDistance) {
      minDistance = d;
      if (d < 1.5) closestHub = `${hub.name}, ${hub.country}`;
    }
  }

  return {
    fullAddress: closestHub !== "Spatial Tech Hub" ? `${closestHub} (GPS: ${roundedLat}, ${roundedLng})` : `Spatial Pin [${roundedLat}, ${roundedLng}]`,
    city: closestHub,
    country: "Global",
    latitude: roundedLat,
    longitude: roundedLng,
  };
}
