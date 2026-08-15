"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Findely Error Boundary]", error);
  }, [error]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-[#F7F9F2] dark:bg-[#131E12] text-[#1D2E1B] dark:text-white font-urbanist overflow-hidden">
      {/* Ambient Error Glow */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-red-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-[#A9C632]/10 blur-[130px] pointer-events-none" />

      {/* Error Card Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 max-w-md w-full rounded-3xl p-8 md:p-10 border border-red-500/30 bg-white/85 dark:bg-[#1D2E1B]/85 backdrop-blur-2xl shadow-2xl text-center space-y-6"
      >
        {/* Warning Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 shadow-inner">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-500">
            Telemetry Interrupted
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1D2E1B] dark:text-white">
            Unexpected System Exception
          </h1>
          <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] leading-relaxed">
            Our spatial synchronization engine encountered an unexpected event. Your session remains secure.
          </p>
          {error?.digest && (
            <span className="inline-block mt-2 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-mono text-[#546E50] dark:text-[#C8D2A6]">
              Digest: {error.digest}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1D2E1B] dark:bg-[#A9C632] text-white dark:text-[#1D2E1B] font-bold text-xs shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-initialize Telemetry</span>
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] text-[#1D2E1B] dark:text-white font-bold text-xs hover:border-[#A9C632] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#546E50] dark:text-[#C8D2A6]" />
            <span>Return to Live Map</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
