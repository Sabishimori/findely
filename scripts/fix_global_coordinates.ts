import { db } from "../src/db";
import { companies, jobs } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { CITY_COORDINATES } from "../src/lib/scraper/geocoder";

const GLOBAL_COMPANY_HUBS: Record<string, { city: string; country: string; lat: number; lng: number }> = {
  // India
  "Postman": { city: "Bengaluru, India", country: "India", lat: 12.9716, lng: 77.5946 },
  "Sarvam AI": { city: "Bengaluru, India", country: "India", lat: 12.9352, lng: 77.6245 },
  "Hasura": { city: "Bengaluru, India", country: "India", lat: 12.9784, lng: 77.6408 },
  "InVideo": { city: "Mumbai, India", country: "India", lat: 19.0760, lng: 72.8777 },
  "Razorpay": { city: "Bengaluru, India", country: "India", lat: 12.9121, lng: 77.6446 },

  // Japan & Korea
  "Mercari": { city: "Tokyo, Japan", country: "Japan", lat: 35.6580, lng: 139.7016 },
  "SmartHR": { city: "Tokyo, Japan", country: "Japan", lat: 35.6628, lng: 139.7314 },
  "Upstage AI": { city: "Seoul, South Korea", country: "South Korea", lat: 37.4979, lng: 127.0276 },
  "Toss": { city: "Seoul, South Korea", country: "South Korea", lat: 37.3948, lng: 127.1119 },

  // Australia & New Zealand
  "Canva": { city: "Sydney, Australia", country: "Australia", lat: -33.8688, lng: 151.2093 },
  "Linktree": { city: "Melbourne, Australia", country: "Australia", lat: -37.8136, lng: 144.9631 },
  "SafetyCulture": { city: "Sydney, Australia", country: "Australia", lat: -33.8830, lng: 151.2167 },
  "Xero": { city: "Wellington, New Zealand", country: "New Zealand", lat: -41.2865, lng: 174.7762 },

  // UK & Europe
  "DeepMind": { city: "London, UK", country: "United Kingdom", lat: 51.5308, lng: -0.1238 },
  "Mistral AI": { city: "Paris, France", country: "France", lat: 48.8566, lng: 2.3522 },
  "DeepL": { city: "Berlin, Germany", country: "Germany", lat: 52.5200, lng: 13.4050 },
  "Synthesia": { city: "London, UK", country: "United Kingdom", lat: 51.5260, lng: -0.0780 },
  "Lovable": { city: "Stockholm, Sweden", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  "Prisma": { city: "Berlin, Germany", country: "Germany", lat: 52.5200, lng: 13.4050 },
  "Raycast": { city: "London, UK", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  "Spotify": { city: "Stockholm, Sweden", country: "Sweden", lat: 59.3340, lng: 18.0560 },

  // USA
  "OpenAI": { city: "San Francisco, CA, USA", country: "United States", lat: 37.7600, lng: -122.4150 },
  "Anthropic": { city: "San Francisco, CA, USA", country: "United States", lat: 37.7946, lng: -122.4005 },
  "Stripe": { city: "South San Francisco, CA, USA", country: "United States", lat: 37.7749, lng: -122.4194 },
  "Figma": { city: "San Francisco, CA, USA", country: "United States", lat: 37.7785, lng: -122.4056 },
  "Linear": { city: "San Francisco, CA, USA", country: "United States", lat: 37.7712, lng: -122.4158 },
  "Vercel": { city: "San Francisco, CA, USA", country: "United States", lat: 37.7897, lng: -122.4000 },
  "Scale AI": { city: "San Francisco, CA, USA", country: "United States", lat: 37.7746, lng: -122.4184 },
  "Perplexity AI": { city: "San Francisco, CA, USA", country: "United States", lat: 37.7721, lng: -122.4203 },
  "ElevenLabs": { city: "New York, NY, USA", country: "United States", lat: 40.7128, lng: -74.0060 },
  "Modal Labs": { city: "New York, NY, USA", country: "United States", lat: 40.7411, lng: -73.9897 },
  "Resend": { city: "San Francisco, CA, USA", country: "United States", lat: 37.7754, lng: -122.4222 },
  "PostHog": { city: "San Francisco, CA, USA", country: "United States", lat: 37.7722, lng: -122.4213 },
  "Supabase": { city: "Singapore & Remote", country: "Singapore", lat: 1.3521, lng: 103.8198 },
};

async function main() {
  console.log("🌍 Aligning All Company Coordinates Across Continents...");

  const allComps = await db.select().from(companies).all();

  for (const c of allComps) {
    const hub = GLOBAL_COMPANY_HUBS[c.name.trim()];
    if (hub) {
      await db
        .update(companies)
        .set({
          location_text: hub.city,
          latitude: hub.lat,
          longitude: hub.lng,
          status: "verified",
          updated_at: new Date(),
        })
        .where(eq(companies.id, c.id));

      console.log(`✓ Updated ${c.name} -> ${hub.city} [${hub.lat}, ${hub.lng}]`);
    }
  }

  console.log("✅ Coordinates Successfully Aligned!");
}

main().catch(console.error);
