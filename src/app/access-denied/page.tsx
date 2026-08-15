"use client";

import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, LogIn, Globe } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/lib/authContext";

export default function AccessDeniedPage() {
  const { user, openAuthModal } = useAuth();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-[#F7F9F2] dark:bg-[#131E12] text-[#1D2E1B] dark:text-white font-urbanist overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-[#A9C632]/10 blur-[130px] pointer-events-none" />

      {/* Access Denied Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-md w-full rounded-3xl p-8 md:p-10 border border-amber-500/30 bg-white/85 dark:bg-[#1D2E1B]/85 backdrop-blur-2xl shadow-2xl text-center space-y-6"
      >
        {/* Lock Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
          <Lock className="w-10 h-10" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500">
            Restricted Sector
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1D2E1B] dark:text-white">
            Access Restricted
          </h1>
          <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] leading-relaxed">
            {user
              ? `You are signed in as ${user.email}, but this sector requires elevated permissions or verified company credentials.`
              : "This workspace or data sector is protected by multi-tenant authentication. Please sign in with your verified account."}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          {!user ? (
            <button
              onClick={() => openAuthModal()}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1D2E1B] dark:bg-[#A9C632] text-white dark:text-[#1D2E1B] font-bold text-xs shadow-lg hover:opacity-90 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Account</span>
            </button>
          ) : (
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1D2E1B] dark:bg-[#A9C632] text-white dark:text-[#1D2E1B] font-bold text-xs shadow-lg hover:opacity-90 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>Back to Map Workspace</span>
            </Link>
          )}

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] text-[#1D2E1B] dark:text-white font-bold text-xs hover:border-[#A9C632] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#546E50] dark:text-[#C8D2A6]" />
            <span>Return to Live Grid</span>
          </Link>
        </div>

        {/* Security badge */}
        <div className="pt-4 border-t border-[#C8D2A6]/40 dark:border-[#3D543A]/40 flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#546E50] dark:text-[#C8D2A6]/60">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A9C632]" />
          <span>Findely Multi-Tenant Security Guard</span>
        </div>
      </motion.div>
    </div>
  );
}
