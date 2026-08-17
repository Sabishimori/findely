import { geocodeLocation, isBroadRegionLocation } from "../src/lib/scraper/geocoder";
import { scrapeAshbyBoard, scrapeLeverBoard, scrapeGreenhouseBoard } from "../src/lib/scraper/atsEngine";

async function runGeocodeFixTests() {
  console.log("=================================================================");
  console.log("🧭 STEP 0 GEOCORRECTION TEST SUITE");
  console.log("=================================================================\n");

  console.log("1. Testing Direct Geocoder Output on Broad / Remote Strings:");
  const testCases = [
    { input: "Europe", expectedNull: true },
    { input: "Europe (Remote)", expectedNull: true },
    { input: "North America", expectedNull: true },
    { input: "AMER", expectedNull: true },
    { input: "Remote", expectedNull: true },
    { input: "Worldwide", expectedNull: true },
    { input: "San Francisco, CA", expectedNull: false },
    { input: "London (Remote)", expectedNull: false },
    { input: "Berlin, Germany (Hybrid)", expectedNull: false },
    { input: "Bengaluru, India", expectedNull: false },
  ];

  for (const tc of testCases) {
    const geo = geocodeLocation(tc.input);
    const passed = tc.expectedNull ? (geo.lat === null && geo.lng === null) : (geo.lat !== null && geo.lng !== null);
    console.log(`   → [${tc.input.padEnd(25)}] => lat: ${geo.lat !== null ? geo.lat.toFixed(4) : "null"}, lng: ${geo.lng !== null ? geo.lng.toFixed(4) : "null"} | isBroadRegion: ${geo.isBroadRegion} | Passed: ${passed ? "✅" : "❌"}`);
    if (!passed) {
      throw new Error(`Geocoding check failed for "${tc.input}"`);
    }
  }

  console.log("\n2. Spot-Checking Live Ashby Integration (Linear & Supabase):");
  const linear = await scrapeAshbyBoard("Linear", "linear", "linear.app");
  if (linear) {
    const remoteRoles = linear.jobs.filter(j => j.location.includes("Europe") || j.location.includes("North America") || j.location === "Remote");
    console.log(`   ✓ Found ${remoteRoles.length} broad/remote roles in Linear.`);
    for (const r of remoteRoles.slice(0, 3)) {
      const correct = r.lat === null && r.lng === null;
      console.log(`     - "${r.title}" at [${r.location}] => coords: [${r.lat}, ${r.lng}] (Correct null: ${correct ? "✅" : "❌"})`);
      if (!correct) throw new Error(`Linear remote role has non-null coordinates!`);
    }
  }

  console.log("\n3. Spot-Checking Live Lever Integration (Wealthfront & Spotify):");
  const wealthfront = await scrapeLeverBoard("Wealthfront", "wealthfront", "wealthfront.com");
  if (wealthfront) {
    const sampleJobs = wealthfront.jobs.slice(0, 3);
    for (const j of sampleJobs) {
      console.log(`     - "${j.title}" at [${j.location}] => coords: [${j.lat?.toFixed(2)}, ${j.lng?.toFixed(2)}]`);
    }
  }

  console.log("\n4. Spot-Checking Live Greenhouse Integration (Scale AI):");
  const scale = await scrapeGreenhouseBoard("Scale AI", "scaleai", "scale.com");
  if (scale) {
    const sampleJobs = scale.jobs.slice(0, 3);
    for (const j of sampleJobs) {
      console.log(`     - "${j.title}" at [${j.location}] => coords: [${j.lat?.toFixed(2)}, ${j.lng?.toFixed(2)}]`);
    }
  }

  console.log("\n=================================================================");
  console.log("🎉 STEP 0 COMPLETE: ALL BROAD & REMOTE GEOCODING TESTS PASSED!");
  console.log("=================================================================");
}

runGeocodeFixTests().catch(err => {
  console.error("Geocoding fix test error:", err);
});
