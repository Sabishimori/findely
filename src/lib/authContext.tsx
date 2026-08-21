"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { playTapSound } from "./soundFx";
import { getSession, signOut } from "next-auth/react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider: "google" | "work_email" | "email_otp";
  companyDomain?: string;
  verified: boolean;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithGoogle: (email: string, name: string) => Promise<void>;
  loginWithWorkEmail: (name: string, email: string) => Promise<void>;
  setVerifiedUser: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize from NextAuth session OR localStorage
  useEffect(() => {
    async function syncAuth() {
      try {
        // 1. Check if user logged in via NextAuth Google OAuth
        const nextAuthSession = await getSession();
        if (nextAuthSession?.user?.email) {
          const email = nextAuthSession.user.email;
          const name = nextAuthSession.user.name || email.split("@")[0];
          const avatar = nextAuthSession.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1D2E1B&textColor=A9C632`;
          
          const oauthUser: AuthUser = {
            id: `google_${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
            name,
            email,
            avatar,
            authProvider: "google",
            companyDomain: email.split("@")[1] || "gmail.com",
            verified: true,
            role: "Verified Google Member",
          };

          setUser(oauthUser);
          localStorage.setItem("findely_auth_user", JSON.stringify(oauthUser));
          
          // Register in database asynchronously
          const { registerOrLoginUser } = await import("@/app/actions");
          await registerOrLoginUser({ email, name, avatar, authProvider: "google" });
          return;
        }

        // 2. Otherwise check localStorage session
        const stored = localStorage.getItem("findely_auth_user");
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }

    syncAuth();
  }, []);

  const openAuthModal = () => {
    playTapSound();
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    playTapSound();
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = async (googleEmail: string, googleName: string) => {
    playTapSound();
    const email = googleEmail.trim();
    const name = googleName.trim() || email.split("@")[0];
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1D2E1B&textColor=A9C632`;

    const googleUser: AuthUser = {
      id: `google_${Date.now()}`,
      name,
      email,
      avatar,
      authProvider: "google",
      companyDomain: "gmail.com",
      verified: true,
      role: "Verified Google Member",
    };

    setUser(googleUser);
    try {
      localStorage.setItem("findely_auth_user", JSON.stringify(googleUser));
      const { registerOrLoginUser } = await import("@/app/actions");
      await registerOrLoginUser({ email, name, avatar, authProvider: "google" });
    } catch (e) {
      console.error("Failed to persist Google session", e);
    }
    setIsAuthModalOpen(false);
  };

  const loginWithWorkEmail = async (name: string, email: string) => {
    playTapSound();
    const cleanEmail = email.trim();
    const cleanName = name.trim() || cleanEmail.split("@")[0];
    const domain = cleanEmail.includes("@") ? cleanEmail.split("@")[1] : "company.com";
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=1D2E1B&textColor=A9C632`;

    const workUser: AuthUser = {
      id: `work_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      avatar,
      authProvider: "work_email",
      companyDomain: domain,
      verified: true,
      role: "Verified Member",
    };

    setUser(workUser);
    try {
      localStorage.setItem("findely_auth_user", JSON.stringify(workUser));
      const { registerOrLoginUser } = await import("@/app/actions");
      await registerOrLoginUser({ email: cleanEmail, name: cleanName, avatar, authProvider: "work_email" });
    } catch (e) {
      console.error("Failed to persist Work session", e);
    }
    setIsAuthModalOpen(false);
  };

  const setVerifiedUser = (verifiedUser: AuthUser) => {
    playTapSound();
    setUser(verifiedUser);
    try {
      localStorage.setItem("findely_auth_user", JSON.stringify(verifiedUser));
    } catch (e) {
      console.error("Failed to save verified user session", e);
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    playTapSound();
    setUser(null);
    try {
      localStorage.removeItem("findely_auth_user");
      signOut({ redirect: false });
    } catch (e) {
      console.error("Failed to clear session", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithWorkEmail,
        setVerifiedUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
