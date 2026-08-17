import { db } from "../src/db";
import { companies, jobs, otp_sessions } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { submitFounderRoleListing } from "../src/app/actions";

async function runTrackBTests() {
  console.log("=================================================================");
  console.log("🧪 FINDELY TRACK B: FOUNDER SELF-SUBMISSION ACCEPTANCE TEST SUITE");
  console.log("=================================================================\n");

  const testEmail = `founder_test_${Date.now()}@frontierstartups.io`;
  const validOtp = "789123";

  // -------------------------------------------------------------------------
  // Criterion 1: OTP Gating Security Check
  // -------------------------------------------------------------------------
  console.log("1. Testing OTP Gating & Anti-Spam Security...");
  const unverifiedResult = await submitFounderRoleListing({
    email: testEmail,
    otpCode: "000000", // invalid OTP
    companyName: "Stealth AI Lab",
    websiteUrl: "https://stealthai.io",
    officeCity: "San Francisco, CA",
    roleTitle: "Founding AI Engineer",
    applyUrl: "https://linear.app/careers",
  });

  if (!unverifiedResult.success) {
    console.log(`✅ CRITERION 1 PASSED: Unverified submission blocked successfully: "${unverifiedResult.error}"`);
  } else {
    throw new Error("❌ Security Failure: Unverified OTP submission was allowed through!");
  }

  // Set up valid verified session for subsequent test steps
  await db.insert(otp_sessions).values({
    email: testEmail,
    otp_code: validOtp,
    name: "Alex Rivera",
    expires_at: new Date(Date.now() + 10 * 60 * 1000),
    verified: true,
  }).run();
  console.log(`✓ Verified OTP session created for test founder: ${testEmail}`);

  // -------------------------------------------------------------------------
  // Criterion 2: Dead Link Rejection via Validator Check
  // -------------------------------------------------------------------------
  console.log("\n2. Testing Dead Apply URL Detection via Unified Validator...");
  const deadLinkResult = await submitFounderRoleListing({
    email: testEmail,
    otpCode: validOtp,
    companyName: "Ghost Startup",
    websiteUrl: "https://ghoststartup.io",
    officeCity: "Bengaluru, India",
    roleTitle: "Staff Systems Engineer",
    applyUrl: "https://this-domain-does-not-exist-findely-test-999.org/jobs/404",
  });

  if (!deadLinkResult.success) {
    console.log(`✅ CRITERION 2 PASSED: Dead apply URL caught by validator and rejected: "${deadLinkResult.error}"`);
  } else {
    throw new Error("❌ Validation Failure: Dead apply URL was permitted into the database!");
  }

  // -------------------------------------------------------------------------
  // Criterion 3: End-to-End Verified Founder Submission (Non-SF Physical Cities)
  // -------------------------------------------------------------------------
  console.log("\n3. Testing End-to-End Founder Submission with Non-SF Physical Locations...");
  
  // 3a. Bengaluru, India Test
  const testCompanyName = `Neural Mesh ${Date.now()}`;
  const bengaluruResult = await submitFounderRoleListing({
    email: testEmail,
    otpCode: validOtp,
    companyName: testCompanyName,
    websiteUrl: "https://linear.app",
    officeCity: "Bengaluru, India",
    roleTitle: "Senior / Staff Fullstack Engineer",
    department: "Core Systems",
    salaryRange: "$180,000 - $240,000",
    jobType: "Full-time · Onsite",
    techStack: ["Rust", "Distributed Systems", "PostgreSQL"],
    applyUrl: "https://jobs.ashbyhq.com/linear/d3bc1ced-3ce4-4086-a050-555055dbb1ff",
    founderName: "Alex Rivera",
    founderRole: "Co-Founder & CTO",
    founderLinkedin: "https://linkedin.com/in/alex-rivera-test",
    companyDescription: "Building next-generation distributed consensus protocols in Bengaluru hub.",
  });

  if (!bengaluruResult.success || !bengaluruResult.companyId || !bengaluruResult.jobId) {
    throw new Error(`Failed Bengaluru submission: ${bengaluruResult.error}`);
  }

  const savedBengaluruCompany = await db.select().from(companies).where(eq(companies.id, bengaluruResult.companyId));
  const savedBengaluruJob = await db.select().from(jobs).where(eq(jobs.id, bengaluruResult.jobId));
  const bc = savedBengaluruCompany[0];
  const bj = savedBengaluruJob[0];

  console.log(`[Submission A: Bengaluru] Company: "${bc.name}"`);
  console.log(`   → Stored Location Text: "${bc.location_text}"`);
  console.log(`   → Geocoded Coords: [Lat: ${bc.latitude?.toFixed(4)}, Lng: ${bc.longitude?.toFixed(4)}]`);
  console.log(`   → Source Track: ${bc.source_track}`);
  console.log(`   → Active: ${bj.is_active} | Validation Status: ${bj.validation_status}`);

  const isBengaluruCoords = bc.latitude !== null && Math.abs(bc.latitude - 12.97) < 0.1 && bc.longitude !== null && Math.abs(bc.longitude - 77.59) < 0.1;
  if (!isBengaluruCoords) {
    throw new Error(`❌ Geocoding failed: Expected Bengaluru coordinates (~12.97, ~77.59), got [${bc.latitude}, ${bc.longitude}]`);
  }
  console.log(`   ✅ Bengaluru coordinates verified (~12.97, ~77.59) — NOT default San Francisco!`);

  // 3b. London, UK Test
  const londonResult = await submitFounderRoleListing({
    email: testEmail,
    otpCode: validOtp,
    companyName: `${testCompanyName} UK`,
    websiteUrl: "https://linear.app",
    officeCity: "London, UK",
    roleTitle: "Senior / Staff Fullstack Engineer",
    department: "European Infrastructure",
    applyUrl: "https://jobs.ashbyhq.com/linear/d3bc1ced-3ce4-4086-a050-555055dbb1ff",
  });

  const savedLondonCompany = await db.select().from(companies).where(eq(companies.id, londonResult.companyId!));
  const lc = savedLondonCompany[0];
  console.log(`\n[Submission B: London] Company: "${lc.name}"`);
  console.log(`   → Stored Location Text: "${lc.location_text}"`);
  console.log(`   → Geocoded Coords: [Lat: ${lc.latitude?.toFixed(4)}, Lng: ${lc.longitude?.toFixed(4)}]`);

  const isLondonCoords = lc.latitude !== null && Math.abs(lc.latitude - 51.51) < 0.1 && lc.longitude !== null && Math.abs(lc.longitude - -0.13) < 0.1;
  if (!isLondonCoords) {
    throw new Error(`❌ Geocoding failed: Expected London coordinates (~51.51, ~-0.13), got [${lc.latitude}, ${lc.longitude}]`);
  }
  console.log(`   ✅ London coordinates verified (~51.51, ~-0.13) — NOT default San Francisco!`);
  console.log(`✅ CRITERION 3 PASSED: Non-SF physical cities correctly resolve to their true global coordinates!`);

  // -------------------------------------------------------------------------
  // Criterion 4: Step 0 Geocoding Check on Remote Founder Role
  // -------------------------------------------------------------------------
  console.log("\n4. Testing Founder Submission with Remote / Broad Location (Step 0 fix check)...");
  
  // 4a. Worldwide Remote
  const remoteSubmission = await submitFounderRoleListing({
    email: testEmail,
    otpCode: validOtp,
    companyName: `${testCompanyName} Remote Division`,
    websiteUrl: "https://linear.app",
    officeCity: "Worldwide Remote",
    roleTitle: "Senior / Staff Fullstack Engineer",
    department: "Developer Experience",
    applyUrl: "https://jobs.ashbyhq.com/linear/d3bc1ced-3ce4-4086-a050-555055dbb1ff",
  });

  const savedRemoteJob = await db.select().from(jobs).where(eq(jobs.id, remoteSubmission.jobId!));
  const rj = savedRemoteJob[0];
  const isCorrectNull = rj.latitude === null && rj.longitude === null;
  console.log(`[Submission C: Worldwide Remote] Role: "${rj.title}" at [${rj.location_text}] => coords: [${rj.latitude}, ${rj.longitude}] (Null Coords: ${isCorrectNull ? "✅" : "❌"})`);

  // 4b. Europe Broad Region
  const europeSubmission = await submitFounderRoleListing({
    email: testEmail,
    otpCode: validOtp,
    companyName: `${testCompanyName} EU Remote`,
    websiteUrl: "https://linear.app",
    officeCity: "Europe",
    roleTitle: "Senior / Staff Fullstack Engineer",
    department: "European Division",
    applyUrl: "https://jobs.ashbyhq.com/linear/d3bc1ced-3ce4-4086-a050-555055dbb1ff",
  });

  const savedEuropeJob = await db.select().from(jobs).where(eq(jobs.id, europeSubmission.jobId!));
  const ej = savedEuropeJob[0];
  const isEuropeNull = ej.latitude === null && ej.longitude === null;
  console.log(`[Submission D: Europe Broad Region] Role: "${ej.title}" at [${ej.location_text}] => coords: [${ej.latitude}, ${ej.longitude}] (Null Coords: ${isEuropeNull ? "✅" : "❌"})`);

  if (!isCorrectNull || !isEuropeNull) {
    throw new Error("❌ Remote/broad founder jobs were geocoded to non-null coordinates!");
  }
  console.log(`✅ CRITERION 4 PASSED: Step 0 broad/remote geocoding rules strictly applied to Track B!`);

  console.log(`\n=================================================================`);
  console.log(`🎉 ALL TRACK B FOUNDER SUBMISSION ACCEPTANCE CRITERIA PASSED!`);
  console.log(`=================================================================`);
}

runTrackBTests().catch(err => {
  console.error("Track B test error:", err);
});
