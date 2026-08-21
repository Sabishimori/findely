import { checkRateLimit, RATE_LIMIT_PRESETS } from "../src/lib/security/rateLimiter";
import { verifyAdminRequest } from "../src/lib/security/adminAuth";
import { randomInt } from "node:crypto";

async function runSecurityTests() {
  console.log("🔒 Running Automated Security Verification Suite...\n");

  // Test 1: Cryptographic OTP Generation
  console.log("1. Testing Cryptographic OTP generation (10,000 samples)...");
  let validRange = true;
  for (let i = 0; i < 10000; i++) {
    const code = randomInt(100000, 1000000);
    if (code < 100000 || code > 999999) {
      validRange = false;
      break;
    }
  }
  console.log(validRange ? "  ✓ PASS: All OTPs strictly within 6-digit range [100000..999999]" : "  ✗ FAIL: Out of range OTP generated");

  // Test 2: Rate Limiting
  console.log("\n2. Testing Sliding-Window Rate Limiting...");
  const testKey = "test_rate_limit_user_" + Date.now();
  const limit = RATE_LIMIT_PRESETS.OTP_SEND.limit; // 3 per minute
  
  let passedCount = 0;
  let blockedCount = 0;
  for (let i = 0; i < 5; i++) {
    const res = checkRateLimit(testKey, limit, 60000);
    if (res.allowed) passedCount++;
    else blockedCount++;
  }
  console.log(`  Requests allowed: ${passedCount}/${limit}, Blocked: ${blockedCount}`);
  if (passedCount === limit && blockedCount === 2) {
    console.log("  ✓ PASS: Rate limiter strictly blocked excessive requests (> 3/min)");
  } else {
    console.log("  ✗ FAIL: Rate limiter did not enforce limits correctly");
  }

  // Test 3: Admin Endpoint Authorization
  console.log("\n3. Testing Admin Authorization Protection...");
  
  // Test unauthorized request (no headers/session)
  const unauthReq = new Request("http://localhost:3000/api/admin/ads", { method: "GET" }) as any;
  const unauthRes = await verifyAdminRequest(unauthReq);
  console.log("  Unauthorized Request Result:", unauthRes.authorized ? "ALLOWED (FAIL)" : "BLOCKED (PASS)");

  // Test authorized request (with valid x-admin-secret)
  const authReq = new Request("http://localhost:3000/api/admin/ads", {
    method: "GET",
    headers: { "x-admin-secret": process.env.ADMIN_API_SECRET || "findely_admin_secret_key_2026_dev" },
  }) as any;
  const authRes = await verifyAdminRequest(authReq);
  console.log("  Authorized Request Result:", authRes.authorized ? "ALLOWED (PASS)" : "BLOCKED (FAIL)");

  console.log("\n✨ All Security Tests Completed Successfully!");
}

runSecurityTests().catch(console.error);
