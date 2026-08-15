"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Map as MapIcon, 
  List, 
  Bookmark, 
  ShieldCheck, 
  Sun, 
  Moon, 
  User,
  Command,
  Sparkles,
  Palette
} from "lucide-react";
import { NavTab } from "./Navigation";

export default function TopHeader({
  searchQuery,
  onSearchChange,
  currentTab,
  onSelectTab,
  viewMode,
  onSelectViewMode,
  isDarkMode = false,
  onToggleDarkMode,
  onOpenProfile,
  candidateName = "Alex Rivera",
  candidateAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160",
}: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  viewMode: "map" | "list";
  onSelectViewMode: (mode: "map" | "list") => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenProfile?: () => void;
  candidateName?: string;
  candidateAvatar?: string;
}) {
  return (
    <header className="fixed top-4 inset-x-4 md:inset-x-8 z-40 flex items-center justify-between pointer-events-none select-none font-sans">
      {/* ── Floating Island Pill Container ──────────────────── */}
      <div className={`w-full max-w-7xl mx-auto px-4 py-2.5 rounded-3xl border shadow-2xl backdrop-blur-2xl pointer-events-auto flex items-center justify-between gap-3 transition-all ${
        isDarkMode
          ? "bg-[#0C100E]/90 border-white/[0.12] text-white shadow-black/60"
          : "bg-white/92 border-gray-200/80 text-gray-900 shadow-gray-200/60"
      }`}>
        {/* Brand & Mode Switchers */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <div 
            onClick={() => {
              onSelectTab("globe");
              onSelectViewMode("map");
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-2xl bg-[#4E9B78] text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform font-space-grotesk">
              F.
            </div>
            <span className="font-bold text-sm tracking-tight font-space-grotesk hidden sm:inline">
              Findely
            </span>
          </div>

          {/* Navigation Tabs Pill */}
          <nav className="flex items-center gap-1 p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold">
            <button
              onClick={() => {
                onSelectTab("globe");
                onSelectViewMode("map");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                currentTab === "globe" && viewMode === "map"
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-[#4E9B78]" />
              <span className="hidden md:inline">2.5D Map</span>
            </button>

            <button
              onClick={() => {
                onSelectTab("globe");
                onSelectViewMode("list");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                currentTab === "globe" && viewMode === "list"
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">List</span>
            </button>

            <button
              onClick={() => onSelectTab("applied")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                currentTab === "applied"
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-500" />
              <span>Tracker</span>
            </button>

            <button
              onClick={() => onSelectTab("verification")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                currentTab === "verification"
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#4E9B78]" />
              <span className="hidden lg:inline">Audit</span>
            </button>
          </nav>
        </div>

        {/* Center Omnibar Search */}
        <div className="flex-1 max-w-md mx-2 relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roles (e.g. UI/UX Designer), companies, locations..."
            className="w-full pl-9 pr-10 py-1.5 text-xs rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.1] focus:outline-none focus:border-[#4E9B78] transition-all placeholder:text-gray-400"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[9px] font-mono text-gray-400">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Right Actions: Theme Toggle & Candidate Profile */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-colors text-gray-600 dark:text-gray-300"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-700" />}
          </button>

          {/* Candidate Profile Trigger Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 pl-2.5 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] border border-black/[0.06] dark:border-white/[0.08] transition-all cursor-pointer group"
            title="Candidate Profile & Social Handles"
          >
            <div className="text-left hidden sm:block">
              <p className="font-bold text-xs leading-none group-hover:text-[#4E9B78] transition-colors">
                {candidateName}
              </p>
              <span className="text-[9px] text-emerald-500 font-mono font-medium">● Actively Looking</span>
            </div>
            <img
              src={candidateAvatar}
              alt={candidateName}
              className="w-7 h-7 rounded-xl object-cover ring-1 ring-black/10 dark:ring-white/20 shadow-xs"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
