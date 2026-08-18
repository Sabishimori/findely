"use client";

import { useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import { CompanyMapItem } from "./MapComponent";
import { getCompanyLogoUrl, handleImageError } from "@/lib/logoResolver";

export interface SponsoredAdItem {
  id: string;
  name: string;
  tagline: string;
  badgeType: "AD" | "FEATURED" | "BOOST" | "WAITLIST";
  logoUrl?: string;
  websiteUrl: string;
  jobCount?: number;
  location?: string;
  companyId?: string;
  isExternal?: boolean;
}

const SPONSORED_ADS: SponsoredAdItem[] = [
  {
    id: "ad-freshworks",
    name: "Freshworks",
    tagline: "Global SaaS Customer Engagement Suite • 153 Live Roles",
    badgeType: "FEATURED",
    websiteUrl: "https://freshworks.com",
    logoUrl: "https://logo.clearbit.com/freshworks.com",
    jobCount: 153,
    location: "Chennai & Bengaluru",
    companyId: "company-freshworks",
  },
  {
    id: "ad-jumbo",
    name: "Jumbo",
    tagline: "Smart Wealth Management & Liquidity for High-Growth Founders",
    badgeType: "AD",
    websiteUrl: "https://jumbowealth.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=jumbowealth.com&sz=128",
    location: "Bengaluru",
    isExternal: true,
  },
  {
    id: "ad-canva",
    name: "Canva",
    tagline: "Visual Communication & AI Creative Suite • 249 Open Positions",
    badgeType: "FEATURED",
    websiteUrl: "https://canva.com",
    logoUrl: "https://logo.clearbit.com/canva.com",
    jobCount: 249,
    location: "Sydney & Global",
    companyId: "company-canva",
  },
  {
    id: "ad-talboss",
    name: "TalBoss",
    tagline: "AI-Powered Executive & Founding Engineer Sourcing Platform",
    badgeType: "AD",
    websiteUrl: "https://talboss.ai",
    logoUrl: "https://www.google.com/s2/favicons?domain=talboss.ai&sz=128",
    location: "Bengaluru & SF",
    isExternal: true,
  },
  {
    id: "ad-phonepe",
    name: "PhonePe",
    tagline: "India's Digital Payments & Financial Services Powerhouse • 77 Roles",
    badgeType: "BOOST",
    websiteUrl: "https://phonepe.com",
    logoUrl: "https://logo.clearbit.com/phonepe.com",
    jobCount: 77,
    location: "Bengaluru",
    companyId: "company-phonepe",
  },
  {
    id: "ad-nvidia",
    name: "NVIDIA",
    tagline: "World Leader in Accelerated Computing & GPU Systems • 2,000+ Jobs",
    badgeType: "FEATURED",
    websiteUrl: "https://nvidia.com",
    logoUrl: "https://logo.clearbit.com/nvidia.com",
    jobCount: 2000,
    location: "Santa Clara & Global",
    companyId: "company-nvidia",
  },
  {
    id: "ad-openai",
    name: "OpenAI",
    tagline: "Frontier AI Research & Safe Deployment • 931 Positions Open",
    badgeType: "FEATURED",
    websiteUrl: "https://openai.com",
    logoUrl: "https://logo.clearbit.com/openai.com",
    jobCount: 931,
    location: "San Francisco",
    companyId: "company-openai",
  },
  {
    id: "ad-rocketlab",
    name: "Rocket Lab",
    tagline: "Next-Gen Launch Vehicles & Deep Space Flight Systems • 409 Roles",
    badgeType: "BOOST",
    websiteUrl: "https://rocketlabusa.com",
    logoUrl: "https://logo.clearbit.com/rocketlabusa.com",
    jobCount: 409,
    location: "Long Beach & Auckland",
    companyId: "company-rocket-lab",
  },
  {
    id: "ad-jamm",
    name: "JAMM",
    tagline: "Ultra-Fast Lightweight Video Collaboration for Distributed Teams",
    badgeType: "AD",
    websiteUrl: "https://jamm.app",
    logoUrl: "https://www.google.com/s2/favicons?domain=jamm.app&sz=128",
    location: "Remote",
    isExternal: true,
  },
];

export default function SponsoredLiveTicker({
  companies = [],
  onSelectCompany,
  onOpenBoostModal,
  isDarkMode = false,
}: {
  companies?: CompanyMapItem[];
  onSelectCompany?: (company: CompanyMapItem) => void;
  onOpenBoostModal?: () => void;
  isDarkMode?: boolean;
}) {
  const [isPaused, setIsPaused] = useState(false);

  const handleAdClick = (ad: SponsoredAdItem) => {
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
  const tickerItems = [...SPONSORED_ADS, ...SPONSORED_ADS];

  return (
    <div className="relative w-full max-w-4xl mx-auto select-none pointer-events-auto">
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-2xl border shadow-xl backdrop-blur-2xl overflow-hidden transition-all ${
          isDarkMode
            ? "bg-[#1D2E1B]/90 border-[#3D543A] text-white"
            : "bg-white/90 border-[#C8D2A6] text-[#1D2E1B]"
        }`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Live Pulse Header */}
        <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-[#C8D2A6]/60 dark:border-[#3D543A]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A9C632] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A9C632]" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1D2E1B] dark:text-[#A9C632] flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#A9C632] fill-current" />
            Live Spotlight
          </span>
        </div>

        {/* Scrolling Marquee Track */}
        <div className="relative flex-1 overflow-hidden flex items-center">
          <div
            className={`flex items-center gap-6 whitespace-nowrap ${
              isPaused ? "[animation-play-state:paused]" : ""
            }`}
            style={{
              animation: "marqueeScroll 38s linear infinite",
            }}
          >
            {tickerItems.map((ad, idx) => {
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
                  className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer group shrink-0 text-left"
                >
                  {/* Badge */}
                  <span
                    className={`text-[8.5px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${badgeStyle}`}
                  >
                    {ad.badgeType}
                  </span>

                  {/* Logo */}
                  <div className="w-4.5 h-4.5 rounded-md bg-white dark:bg-white/10 p-0.5 border border-[#C8D2A6]/50 dark:border-white/10 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={ad.logoUrl || getCompanyLogoUrl(ad.websiteUrl, ad.name)}
                      alt={ad.name}
                      className="w-full h-full object-contain"
                      onError={(e) => handleImageError(e, ad.name)}
                    />
                  </div>

                  {/* Name */}
                  <span className="text-xs font-bold text-[#1D2E1B] dark:text-white group-hover:text-[#A9C632] transition-colors">
                    {ad.name}
                  </span>

                  {/* Tagline */}
                  <span className="text-[11px] text-[#546E50] dark:text-[#C8D2A6] font-medium hidden sm:inline max-w-[280px] truncate">
                    {ad.tagline}
                  </span>

                  {/* Jobs Count if present */}
                  {ad.jobCount && (
                    <span className="text-[9.5px] font-bold text-[#1D2E1B] dark:text-[#A9C632] bg-[#A9C632]/20 dark:bg-[#A9C632]/20 px-1.5 py-0.5 rounded-full border border-[#A9C632]/40 shrink-0">
                      {ad.jobCount > 99 ? "99+" : ad.jobCount} Jobs
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Action: Promote / Boost Trigger */}
        {onOpenBoostModal && (
          <div className="shrink-0 pl-2 border-l border-[#C8D2A6]/60 dark:border-[#3D543A]">
            <button
              onClick={onOpenBoostModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#A9C632] text-[#1D2E1B] text-[10.5px] font-extrabold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              title="Promote or boost your startup in the live spotlight"
            >
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Boost ⚡</span>
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
