"use client";

import Link from "next/link";
import { Compass, MapPin, ArrowLeft, Globe, Search, Home } from "lucide-react";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-[#F7F9F2] dark:bg-[#131E12] text-[#1D2E1B] dark:text-white font-urbanist overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#A9C632]/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#1D2E1B]/20 dark:bg-[#A9C632]/10 blur-[140px] pointer-events-none" />

      {/* Main Glassmorphic 404 Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 max-w-lg w-full rounded-3xl p-8 md:p-10 border border-[#C8D2A6] dark:border-[#3D543A] bg-white/80 dark:bg-[#1D2E1B]/80 backdrop-blur-2xl shadow-2xl text-center space-y-6"
      >
        {/* Animated Radar Pulse Icon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-[#A9C632]/40"
          />
          <div className="relative w-20 h-20 rounded-2xl bg-[#A9C632]/15 border border-[#A9C632]/40 flex items-center justify-center text-[#A9C632] shadow-inner">
            <Compass className="w-10 h-10 animate-spin-slow" />
          </div>
          <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#1D2E1B] dark:bg-[#A9C632] text-[#A9C632] dark:text-[#1D2E1B] text-[10px] font-black uppercase tracking-wider">
            404
          </span>
        </div>

        {/* Heading & Context */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#A9C632]">
            Spatial Coordinate Lost
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1D2E1B] dark:text-white">
            Lost in Mapped Orbit
          </h1>
          <p className="text-sm text-[#546E50] dark:text-[#C8D2A6] leading-relaxed max-w-sm mx-auto">
            The company portal, job listing, or coordinate you requested does not exist or has migrated to a new sector.
          </p>
        </div>

        {/* Quick Route Teleport Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1D2E1B] dark:bg-[#A9C632] text-white dark:text-[#1D2E1B] font-bold text-xs shadow-lg hover:opacity-90 transition-all cursor-pointer group"
          >
            <Globe className="w-4 h-4 text-[#A9C632] dark:text-[#1D2E1B] group-hover:rotate-45 transition-transform" />
            <span>Live 2.5D Globe</span>
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] text-[#1D2E1B] dark:text-white font-bold text-xs hover:border-[#A9C632] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#546E50] dark:text-[#C8D2A6]" />
            <span>Return to App</span>
          </Link>
        </div>

        {/* Footnote Telemetry */}
        <div className="pt-4 border-t border-[#C8D2A6]/40 dark:border-[#3D543A]/40 flex items-center justify-between text-[11px] text-[#546E50] dark:text-[#C8D2A6]/60">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#A9C632]" />
            Telemetry Grid: Active
          </span>
          <span>Findely Spatial v2.5</span>
        </div>
      </motion.div>
    </div>
  );
}
