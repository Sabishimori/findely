"use client";

import { useState, useEffect } from "react";
import { Zap, Megaphone, Plus, Sparkles } from "lucide-react";
import { CompanyMapItem } from "./MapComponent";
import { getCompanyLogoUrl, handleImageError } from "@/lib/logoResolver";

export interface SponsoredAdItem {
  id: string;
  name: string;
  tagline: string;
  badgeType: "AD" | "FEATURED" | "BOOST" | "LAUNCH" | "HIRING" | "AVAILABLE_SLOT";
  logoUrl?: string;
  websiteUrl: string;
  jobCount?: number;
  location?: string;
  companyId?: string;
  isExternal?: boolean;
  isAvailableSlot?: boolean;
}

const DEFAULT_FREE_SLOTS: SponsoredAdItem[] = [
  {
    id: "slot-free-1",
    name: "Claim Free Spotlight ⚡",
    tagline: "Feature your startup, dev tool, or open roles in Findely's live marquee • 100% Free",
    badgeType: "AVAILABLE_SLOT",
    websiteUrl: "",
    isAvailableSlot: true,
    location: "Global",
  },
  {
    id: "slot-free-2",
    name: "Promote Your Launch 🚀",
    tagline: "Broadcast to 50,000+ software engineers & founders in real-time • Zero Cost",
    badgeType: "AVAILABLE_SLOT",
    websiteUrl: "",
    isAvailableSlot: true,
    location: "Spotlight",
  },
  {
    id: "slot-free-3",
    name: "Post Your Hiring Surge ✨",
    tagline: "Instant 1-click live placement with custom logo and direct fly-to pin",
    badgeType: "AVAILABLE_SLOT",
    websiteUrl: "",
    isAvailableSlot: true,
    location: "Live Stream",
  },
];

export default function SponsoredLiveTicker({
  companies = [],
  onSelectCompany,
  onOpenAdModal,
  isDarkMode = false,
}: {
  companies?: CompanyMapItem[];
  onSelectCompany?: (company: CompanyMapItem) => void;
  onOpenAdModal?: () => void;
  isDarkMode?: boolean;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [adsList, setAdsList] = useState<SponsoredAdItem[]>(DEFAULT_FREE_SLOTS);

  // Fetch dynamic live ads from database API
  useEffect(() => {
    const fetchLiveAds = async () => {
      try {
        const res = await fetch("/api/ads/live");
        if (res.ok) {
          const data = await res.json();
          if (data.ads && data.ads.length > 0) {
            setAdsList(data.ads);
          }
        }
      } catch (err) {
        console.warn("[Ticker Ads Fetch Warning]: using free slots fallback", err);
      }
    };
    fetchLiveAds();
  }, []);

  const handleAdClick = (ad: SponsoredAdItem) => {
    // If it's an available slot, open the free ad modal!
    if (ad.isAvailableSlot || ad.badgeType === "AVAILABLE_SLOT") {
      if (onOpenAdModal) {
        onOpenAdModal();
      }
      return;
    }

    if (ad.companyId && onSelectCompany) {
      const match = companies.find(
        (c) => c.id === ad.companyId || c.name.toLowerCase() === ad.name.toLowerCase()
      );
      if (match) {
        onSelectCompany(match);
        return;
      }
    }

    if (ad.websiteUrl) {
      window.open(ad.websiteUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Double the list for infinite seamless marquee loop
  const tickerItems = [...adsList, ...adsList];

  return (
    <div className="relative w-full max-w-6xl sm:max-w-7xl mx-auto select-none pointer-events-auto">
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-2xl border shadow-2xl backdrop-blur-2xl overflow-hidden transition-all ${
          isDarkMode
            ? "bg-[#1D2E1B]/90 border-[#3D543A] text-white"
            : "bg-white/90 border-[#C8D2A6] text-[#1D2E1B]"
        }`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Live Pulse Header */}
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-[#C8D2A6]/60 dark:border-[#3D543A]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A9C632] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A9C632]" />
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1D2E1B] dark:text-[#A9C632] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#A9C632] fill-current" />
            Live Spotlight
          </span>
        </div>

        {/* Scrolling Marquee Track (Extended Length) */}
        <div className="relative flex-1 overflow-hidden flex items-center">
          <div
            className={`flex items-center gap-8 whitespace-nowrap ${
              isPaused ? "[animation-play-state:paused]" : ""
            }`}
            style={{
              animation: "marqueeScroll 45s linear infinite",
            }}
          >
            {tickerItems.map((ad, idx) => {
              const isAvailable = ad.isAvailableSlot || ad.badgeType === "AVAILABLE_SLOT";

              if (isAvailable) {
                // ── Dotted Outline for Available Free Slot ──
                return (
                  <button
                    key={`${ad.id}-${idx}`}
                    onClick={() => handleAdClick(ad)}
                    className="flex items-center gap-2.5 px-3.5 py-1 rounded-xl border border-dashed border-[#A9C632] bg-[#A9C632]/10 dark:bg-[#A9C632]/15 hover:bg-[#A9C632]/25 dark:hover:bg-[#A9C632]/30 transition-all cursor-pointer group shrink-0 text-left shadow-xs"
                    title="Click to claim this 100% free live spotlight slot"
                  >
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-mono font-black bg-[#A9C632] text-[#1D2E1B] shadow-xs flex items-center gap-1">
                      <Plus className="w-2.5 h-2.5 stroke-[3]" />
                      FREE SLOT
                    </span>

                    <span className="text-xs font-extrabold text-[#1D2E1B] dark:text-[#A9C632] group-hover:underline">
                      {ad.name}
                    </span>

                    <span className="text-[11.5px] text-[#546E50] dark:text-[#C8D2A6] font-medium hidden sm:inline max-w-[360px] truncate">
                      {ad.tagline}
                    </span>

                    <span className="text-[9.5px] font-extrabold text-[#1D2E1B] dark:text-white bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-md border border-[#A9C632]/40 shrink-0">
                      Claim ⚡
                    </span>
                  </button>
                );
              }

              const badgeStyle =
                ad.badgeType === "AD"
                  ? "bg-black/10 dark:bg-white/10 text-[#546E50] dark:text-[#C8D2A6] border border-black/10 dark:border-white/10"
                  : ad.badgeType === "BOOST"
                  ? "bg-[#A9C632] text-[#1D2E1B] font-black shadow-sm"
                  : "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] font-bold";

              return (
                <button
                  key={`${ad.id}-${idx}`}
                  onClick={() => handleAdClick(ad)}
                  className="flex items-center gap-2.5 px-3 py-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer group shrink-0 text-left"
                >
                  {/* Badge */}
                  <span
                    className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-mono ${badgeStyle}`}
                  >
                    {ad.badgeType}
                  </span>

                  {/* Logo */}
                  <div className="w-5 h-5 rounded-md bg-white dark:bg-white/10 p-0.5 border border-[#C8D2A6]/50 dark:border-white/10 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={ad.logoUrl || getCompanyLogoUrl(ad.websiteUrl, ad.name)}
                      alt={ad.name}
                      className="w-full h-full object-contain"
                      onError={(e) => handleImageError(e, ad.name)}
                    />
                  </div>

                  {/* Name */}
                  <span className="text-xs font-extrabold text-[#1D2E1B] dark:text-white group-hover:text-[#A9C632] transition-colors">
                    {ad.name}
                  </span>

                  {/* Tagline */}
                  <span className="text-[11.5px] text-[#546E50] dark:text-[#C8D2A6] font-medium hidden sm:inline max-w-[340px] truncate">
                    {ad.tagline}
                  </span>

                  {/* Jobs Count if present */}
                  {ad.jobCount && (
                    <span className="text-[9.5px] font-bold text-[#1D2E1B] dark:text-[#A9C632] bg-[#A9C632]/20 dark:bg-[#A9C632]/20 px-2 py-0.5 rounded-full border border-[#A9C632]/40 shrink-0">
                      {ad.jobCount > 99 ? "99+" : ad.jobCount} Jobs
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Action: Free Claim Spot Button */}
        {onOpenAdModal && (
          <div className="shrink-0 pl-3 border-l border-[#C8D2A6]/60 dark:border-[#3D543A]">
            <button
              onClick={onOpenAdModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#A9C632] text-[#1D2E1B] text-[11px] font-black shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              title="Claim a 100% free live spotlight for your startup"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Claim Free Spot ⚡</span>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
