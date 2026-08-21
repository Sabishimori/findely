import { NextRequest } from "next/server";
import { getSessionUser } from "./authSession";

const ADMIN_SECRET = process.env.ADMIN_API_SECRET || "findely_admin_secret_key_2026_dev";
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "sagar@findely.app,admin@findely.app,sabishimori@gmail.com")
  .toLowerCase()
  .split(",")
  .map((e) => e.trim());

export interface AdminAuthResult {
  authorized: boolean;
  user?: any;
  error?: string;
}

/**
 * Validates whether an incoming HTTP request or Server Action call has administrative privileges.
 * Checks both secret header (for programmatic/webhook/cron administration) and authenticated admin session.
 */
export async function verifyAdminRequest(req?: NextRequest): Promise<AdminAuthResult> {
  // 1. Check Secret Header (x-admin-secret or Authorization header)
  if (req) {
    const headerSecret = req.headers.get("x-admin-secret");
    if (headerSecret && headerSecret === ADMIN_SECRET) {
      return { authorized: true };
    }

    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ") && authHeader.slice(7) === ADMIN_SECRET) {
      return { authorized: true };
    }
  }

  // 2. Check Authenticated NextAuth Admin Session
  try {
    const sessionUser = await getSessionUser();
    if (sessionUser) {
      const email = sessionUser.email?.toLowerCase().trim();
      const role = (sessionUser as any).role?.toLowerCase();

      if (role === "admin" || (email && ADMIN_EMAILS.includes(email))) {
        return { authorized: true, user: sessionUser };
      }
    }
  } catch (err) {
    console.error("[AdminAuth] Session verification error:", err);
  }

  return {
    authorized: false,
    error: "Unauthorized: Administrative privileges or valid x-admin-secret required.",
  };
}
