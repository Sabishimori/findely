import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { registerOrLoginUser } from "@/app/actions";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        try {
          await registerOrLoginUser({
            email: user.email,
            name: user.name || user.email.split("@")[0],
            avatar: user.image || undefined,
            authProvider: "google",
          });
        } catch (e) {
          console.error("Failed to register Google OAuth user", e);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "findely_production_secret_key_2026_super_secure",
};
