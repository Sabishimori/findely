import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Retrieves the currently authenticated user from NextAuth session.
 * Used across Server Actions and API routes to enforce strict Multi-Tenant Isolation.
 */
export async function getSessionUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return null;
    }

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email));

    return userRows[0] || null;
  } catch (error) {
    console.error("[AuthSession] Error fetching session user:", error);
    return null;
  }
}
