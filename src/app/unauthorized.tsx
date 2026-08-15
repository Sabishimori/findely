"use client";

import Link from "next/link";
import { Lock, LogIn, Globe } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/lib/authContext";

export default function Unauthorized() {
  const { openAuthModal } = useAuth();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-[#F7F9F2] dark:bg-[#131E12] text-[#1D2E1B] dark:text-white font-urbanist overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 max-w-md w-full rounded-3xl p-8 border border-amber-500/30 bg-white/85 dark:bg-[#1D2E1B]/85 backdrop-blur-2xl shadow-2xl text-center space-y-6"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500">
            401 Unauthorized
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1D2E1B] dark:text-white">
            Authentication Required
          </h1>
          <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] leading-relaxed">
            Please sign in with your verified credentials to access this protected workspace.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => openAuthModal()}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1D2E1B] dark:bg-[#A9C632] text-white dark:text-[#1D2E1B] font-bold text-xs shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Account</span>
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] text-[#1D2E1B] dark:text-white font-bold text-xs hover:border-[#A9C632] transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#546E50] dark:text-[#C8D2A6]" />
            <span>Return to Map</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
