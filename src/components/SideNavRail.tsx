"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Map as MapIcon, 
  List, 
  Bookmark, 
  ShieldCheck, 
  Palette,
  Coffee,
  Heart,
  Home
} from "lucide-react";
import { NavTab } from "./Navigation";
import BuilderSupportModal from "./BuilderSupportModal";
import { useAuth } from "@/lib/authContext";

export default function SideNavRail({
  currentTab,
  onSelectTab,
  viewMode,
  onSelectViewMode,
  isDarkMode = false,
  candidateName = "Candidate Profile",
  candidateAvatar,
  onOpenLandingPage,
}: {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  viewMode: "map" | "list";
  onSelectViewMode: (mode: "map" | "list") => void;
  isDarkMode?: boolean;
  candidateName?: string;
  candidateAvatar?: string;
  onOpenLandingPage?: () => void;
}) {
  const { user, logout, openAuthModal } = useAuth();
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const activeName = user?.name || candidateName;
  const activeAvatar = user?.avatar || candidateAvatar || "https://api.dicebear.com/7.x/initials/svg?seed=Builder&backgroundColor=1D2E1B&textColor=A9C632";

  return (
    <>
      <aside className="fixed left-4 top-4 bottom-4 z-40 flex flex-col items-center justify-between py-5 px-3 rounded-[32px] border shadow-2xl backdrop-blur-2xl transition-all select-none pointer-events-auto bg-white/85 dark:bg-[#152216]/95 border-[#C8D2A6] dark:border-white/10 text-[#1D2E1B] dark:text-white">
        {/* ── Top Brand Emblem (Main Logo Vector in Apple Squircle) ─────── */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => {
              if (onOpenLandingPage) {
                onOpenLandingPage();
              } else {
                onSelectTab("globe");
                onSelectViewMode("map");
              }
            }}
            aria-label="Findely Logo - Return to Landing Page"
            className="w-12 h-12 apple-icon-tile bg-[#1D2E1B] hover:bg-[#2D442A] border border-[#C8D2A6]/60 dark:border-white/10 flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer p-1.5 overflow-hidden group"
            title="About Findely · Landing Page"
          >
            <img
              src="/logofinal.svg"
              alt="Findely"
              className="w-full h-full object-contain"
            />
          </button>

          {/* ── Navigation Icons Stack (Apple-style squircle buttons) ────────── */}
          <nav className="flex flex-col items-center gap-3">
            {/* 2.5D GPU Map */}
            <button
              onClick={() => {
                onSelectTab("globe");
                onSelectViewMode("map");
              }}
              aria-label="2.5D Interactive Map View"
              className={`w-11 h-11 apple-squircle flex items-center justify-center transition-all cursor-pointer ${
                currentTab === "globe" && viewMode === "map"
                  ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-md scale-105 ring-2 ring-[#A9C632]/50"
                  : "bg-transparent text-[#546E50] dark:text-[#D2E0CC] hover:text-[#1D2E1B] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              }`}
              title="2.5D Interactive Map"
            >
              <MapIcon className="w-5 h-5" />
            </button>

            {/* List View */}
            <button
              onClick={() => {
                onSelectTab("globe");
                onSelectViewMode("list");
              }}
              aria-label="Grid List View"
              className={`w-11 h-11 apple-squircle flex items-center justify-center transition-all cursor-pointer ${
                currentTab === "globe" && viewMode === "list"
                  ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-md scale-105 ring-2 ring-[#A9C632]/50"
                  : "bg-transparent text-[#546E50] dark:text-[#D2E0CC] hover:text-[#1D2E1B] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              }`}
              title="Grid List View"
            >
              <List className="w-5 h-5" />
            </button>

            {/* Tracker (Applied & Saved) */}
            <button
              onClick={() => onSelectTab("applied")}
              aria-label="Application and Saved Job Tracker"
              className={`w-11 h-11 apple-squircle flex items-center justify-center transition-all cursor-pointer ${
                currentTab === "applied"
                  ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-md scale-105 ring-2 ring-[#A9C632]/50"
                  : "bg-transparent text-[#546E50] dark:text-[#D2E0CC] hover:text-[#1D2E1B] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              }`}
              title="Application & Saved Tracker"
            >
              <Bookmark className="w-5 h-5" />
            </button>

            {/* AI Audit Queue */}
            <button
              onClick={() => onSelectTab("verification")}
              aria-label="AI Safety Verification Queue"
              className={`w-11 h-11 apple-squircle flex items-center justify-center transition-all cursor-pointer ${
                currentTab === "verification"
                  ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-md scale-105 ring-2 ring-[#A9C632]/50"
                  : "bg-transparent text-[#546E50] dark:text-[#D2E0CC] hover:text-[#1D2E1B] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              }`}
              title="AI Safety Verification Queue"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
          </nav>
        </div>

        {/* ── Bottom Section: Support Creator Button & Candidate Profile ── */}
        <div className="flex flex-col items-center gap-3">
          {/* Support Builder Chip */}
          <button
            onClick={() => setShowBuilderModal(true)}
            aria-label="Support the Builder via PayPal"
            className="w-10 h-10 apple-squircle flex items-center justify-center text-[#546E50] hover:text-[#A9C632] dark:text-[#D2E0CC] dark:hover:text-[#A9C632] hover:bg-[#A9C632]/15 border border-transparent hover:border-[#A9C632]/40 transition-all cursor-pointer group"
            title="Support the Builder · PayPal & Donations"
          >
            <Heart className="w-4.5 h-4.5 group-hover:fill-[#A9C632] group-hover:scale-110 transition-transform" />
          </button>

          {/* Candidate Profile Avatar Button in Apple Squircle */}
          <button
            onClick={() => {
              if (!user) {
                openAuthModal();
              } else {
                onSelectTab("profile");
              }
            }}
            aria-label="Candidate Profile and Portfolio"
            className={`relative p-0.5 rounded-[18px] transition-all cursor-pointer group focus:outline-none ${
              currentTab === "profile" ? "ring-2 ring-[#A9C632] scale-105" : "hover:scale-105"
            }`}
            title="Candidate Profile & Portfolio"
          >
            <div className="w-10 h-10 apple-icon-tile">
              <img
                src={activeAvatar}
                alt={activeName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#A9C632] border-2 border-white dark:border-[#1D2E1B] shadow-xs" />
          </button>

          {/* Return to Landing / Overview */}
          <button
            onClick={() => {
              if (onOpenLandingPage) {
                onOpenLandingPage();
              }
            }}
            aria-label="Return to Overview & About"
            className="w-10 h-10 apple-squircle flex items-center justify-center text-[#546E50] hover:text-[#1D2E1B] dark:text-[#C8D2A6] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 border border-[#C8D2A6]/40 dark:border-white/10 transition-all cursor-pointer group"
            title="Return to Overview & About"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </aside>

      {/* ── Builder & Matcha Support Modal ── */}
      <BuilderSupportModal
        isOpen={showBuilderModal}
        onClose={() => setShowBuilderModal(false)}
        isDarkMode={isDarkMode}
      />
    </>
  );
}
