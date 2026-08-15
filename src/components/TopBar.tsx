"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { 
  Search, 
  Bell, 
  Archive, 
  Link as LinkIcon, 
  Check, 
  Sun, 
  Moon, 
  Plus, 
  SlidersHorizontal, 
  RotateCw, 
  Command, 
  LogOut,
  MapPin,
  Building2,
  Briefcase,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { CompanyMapItem } from "./MapComponent";
import { searchTechAreas, StartupTechHub } from "@/lib/geoUtils";
import { handleImageError, getCompanyLogoUrl } from "@/lib/logoResolver";
import { playTapSound } from "@/lib/soundFx";

export default function TopBar({
  searchQuery,
  onSearchChange,
  onOpenAddCompany,
  onOpenFilterDrawer,
  onSelectTab,
  onRefresh,
  onExitToLanding,
  isDarkMode = false,
  onToggleDarkMode,
  companies = [],
  onSelectCompany,
  onFlyToArea,
}: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddCompany: () => void;
  onOpenFilterDrawer?: () => void;
  onSelectTab: (tab: any) => void;
  onRefresh?: () => Promise<void> | void;
  onExitToLanding?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  companies?: CompanyMapItem[];
  onSelectCompany?: (company: CompanyMapItem) => void;
  onFlyToArea?: (area: StartupTechHub) => void;
}) {
  const { user, logout } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshToast, setShowRefreshToast] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matched specific open roles / jobs across all companies
  const matchedJobs = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: Array<{
      id: string;
      title: string;
      salary_range?: string | null;
      location_text: string;
      company: CompanyMapItem;
    }> = [];

    for (const comp of companies) {
      if (comp.roles && comp.roles.length > 0) {
        for (const role of comp.roles) {
          if (
            role.title.toLowerCase().includes(q) ||
            (role.location_text && role.location_text.toLowerCase().includes(q)) ||
            (role.salary_range && role.salary_range.toLowerCase().includes(q))
          ) {
            results.push({
              id: role.id,
              title: role.title,
              salary_range: role.salary_range,
              location_text: role.location_text || comp.location_text || "Global",
              company: comp,
            });
          }
        }
      } else if (comp.jobTitles && comp.jobTitles.length > 0) {
        for (const title of comp.jobTitles) {
          if (title.toLowerCase().includes(q)) {
            results.push({
              id: `${comp.id}_${title}`,
              title,
              salary_range: null,
              location_text: comp.location_text || "Global",
              company: comp,
            });
          }
        }
      }
    }
    return results.slice(0, 10);
  }, [companies, searchQuery]);

  // Filter matched companies
  const matchedCompanies = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return companies
      .filter((c) => {
        return (
          c.name.toLowerCase().includes(q) ||
          (c.location_text && c.location_text.toLowerCase().includes(q))
        );
      })
      .slice(0, 4);
  }, [companies, searchQuery]);

  // Filter top matched tech areas / cities
  const matchedAreas = useMemo(() => {
    return searchQuery.trim() ? searchTechAreas(searchQuery, 3) : [];
  }, [searchQuery]);

  const hasMatches = searchQuery.trim().length > 0 && (matchedJobs.length > 0 || matchedCompanies.length > 0 || matchedAreas.length > 0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (matchedJobs.length > 0 && onSelectCompany) {
        playTapSound();
        onSelectCompany(matchedJobs[0].company);
        setIsSearchFocused(false);
      } else if (matchedCompanies.length > 0 && onSelectCompany) {
        playTapSound();
        onSelectCompany(matchedCompanies[0]);
        setIsSearchFocused(false);
      } else if (matchedAreas.length > 0 && onFlyToArea) {
        playTapSound();
        onFlyToArea(matchedAreas[0]);
        setIsSearchFocused(false);
      }
    }
  };

  const handleRefreshClick = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      setShowRefreshToast(true);
      setTimeout(() => setShowRefreshToast(false), 2200);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <header className="fixed top-4 left-22 md:left-26 right-6 z-40 select-none pointer-events-none font-sans">
      <div className="w-full p-2.5 rounded-[28px] border shadow-2xl backdrop-blur-2xl pointer-events-auto flex items-center justify-between gap-4 transition-all bg-white/90 dark:bg-[#1D2E1B]/95 border-[#C8D2A6] dark:border-[#3D543A] text-[#1D2E1B] dark:text-white">
        
        {/* ── Left: Search Bar with Autocomplete Dropdown ────── */}
        <div ref={searchContainerRef} className="flex items-center gap-3 flex-1 max-w-2xl relative pl-2">
          <Search className="w-4 h-4 text-[#546E50] dark:text-[#C8D2A6] absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsSearchFocused(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search roles (e.g. UI/UX, Frontend), companies, or cities..."
            className={`w-full pl-11 pr-14 py-2.5 text-xs rounded-2xl border transition-all focus:outline-none focus:border-[#A9C632] ${
              isDarkMode
                ? "bg-[#243822] border-[#3D543A] text-white placeholder:text-[#A0B28C]"
                : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B] placeholder:text-[#546E50]"
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-[10px] font-mono text-[#546E50] pointer-events-none">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>

          {/* ── Autocomplete Scrollable Dropdown (Roles, Companies & Areas) ── */}
          {isSearchFocused && hasMatches && (
            <div className="absolute left-2 right-0 top-full mt-2.5 max-h-[380px] overflow-y-auto custom-scrollbar rounded-[24px] p-3 shadow-2xl border backdrop-blur-3xl z-50 bg-white/95 dark:bg-[#1D2E1B]/95 border-[#C8D2A6] dark:border-[#3D543A] space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* 1. Matched Open Roles / Jobs Section */}
              {matchedJobs.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-[#546E50] dark:text-[#C8D2A6] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3 text-[#A9C632]" />
                      <span>Open Roles & Positions ({matchedJobs.length})</span>
                    </span>
                    <span className="text-[9px] text-[#A9C632] font-semibold">Click to Teleport ↗</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedJobs.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          playTapSound();
                          if (onSelectCompany) onSelectCompany(item.company);
                          setIsSearchFocused(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left flex items-center justify-between gap-3 hover:bg-[#A9C632]/15 transition-all cursor-pointer group border border-transparent hover:border-[#A9C632]/30"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/10 p-0.5 flex items-center justify-center shrink-0 overflow-hidden border border-[#C8D2A6]/40 dark:border-white/10">
                            <img
                              src={getCompanyLogoUrl(item.company.logo_url || undefined, item.company.name, item.company.website_url)}
                              alt={item.company.name}
                              onError={(e) => handleImageError(e, item.company.name)}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate text-[#1D2E1B] dark:text-white group-hover:text-[#A9C632] transition-colors leading-tight flex items-center gap-1.5">
                              <span>{item.title}</span>
                              <span className="text-[10px] text-[#A9C632] font-medium">• {item.company.name}</span>
                            </p>
                            <p className="text-[10px] text-[#546E50] dark:text-[#C8D2A6] truncate leading-tight mt-0.5">
                              📍 {item.location_text}
                            </p>
                          </div>
                        </div>
                        {item.salary_range ? (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] shrink-0 border border-[#A9C632]/30 whitespace-nowrap">
                            {item.salary_range}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] shrink-0 border border-[#A9C632]/30 whitespace-nowrap">
                            Active Role
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Companies Section */}
              {matchedCompanies.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-[#546E50] dark:text-[#C8D2A6] flex items-center gap-1.5 pt-1.5 border-t border-black/5 dark:border-white/5">
                    <Building2 className="w-3 h-3 text-[#A9C632]" />
                    <span>Companies ({matchedCompanies.length})</span>
                  </div>
                  <div className="space-y-0.5 mt-0.5">
                    {matchedCompanies.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          playTapSound();
                          if (onSelectCompany) onSelectCompany(c);
                          setIsSearchFocused(false);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between gap-3 hover:bg-[#A9C632]/15 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-black/5 dark:bg-white/10 p-0.5 flex items-center justify-center shrink-0 overflow-hidden border border-[#C8D2A6]/40 dark:border-white/10">
                            <img
                              src={getCompanyLogoUrl(c.logo_url || undefined, c.name, c.website_url)}
                              alt={c.name}
                              onError={(e) => handleImageError(e, c.name)}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate text-[#1D2E1B] dark:text-white group-hover:text-[#A9C632] transition-colors leading-tight">
                              {c.name}
                            </p>
                            <p className="text-[10px] text-[#546E50] dark:text-[#C8D2A6] truncate leading-tight">
                              {c.location_text || "Global"}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] shrink-0 border border-[#A9C632]/30">
                          {c.activeJobCount} {c.activeJobCount === 1 ? "Role" : "Roles"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Areas / Cities Section */}
              {matchedAreas.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-[#546E50] dark:text-[#C8D2A6] flex items-center gap-1.5 pt-1.5 border-t border-black/5 dark:border-white/5">
                    <MapPin className="w-3 h-3 text-[#A9C632]" />
                    <span>Areas & Hubs ({matchedAreas.length})</span>
                  </div>
                  <div className="space-y-0.5 mt-0.5">
                    {matchedAreas.map((area) => (
                      <button
                        key={area.name}
                        type="button"
                        onClick={() => {
                          playTapSound();
                          if (onFlyToArea) onFlyToArea(area);
                          setIsSearchFocused(false);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between gap-3 hover:bg-[#A9C632]/15 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-[#A9C632]/20 flex items-center justify-center shrink-0 text-[#A9C632] border border-[#A9C632]/30">
                            <MapPin className="w-3 h-3" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate text-[#1D2E1B] dark:text-white group-hover:text-[#A9C632] transition-colors leading-tight">
                              {area.name}
                            </p>
                            <p className="text-[10px] text-[#546E50] dark:text-[#C8D2A6] truncate leading-tight">
                              {area.region}, {area.country}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-[#546E50] dark:text-[#C8D2A6] group-hover:text-[#A9C632] flex items-center gap-1">
                          <span>Zoom Area</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: Action Toolbar (6px gap alignment) ──────── */}
        <div className="flex items-center gap-2 flex-shrink-0 pr-1">
          {/* Filter Drawer Toggle */}
          {onOpenFilterDrawer && (
            <button
              onClick={onOpenFilterDrawer}
              className="p-2.5 apple-squircle border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-[#A9C632]/10 text-[#546E50] dark:text-[#C8D2A6] transition-colors cursor-pointer"
              title="Filter Roles & Stack"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 apple-squircle border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-[#A9C632]/10 text-[#546E50] dark:text-[#C8D2A6] transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#A9C632]" />
            </button>

            {/* Notifications Flyout */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl p-4 shadow-2xl border text-xs z-50 bg-white dark:bg-[#1D2E1B] border-[#C8D2A6] dark:border-[#3D543A]">
                <h4 className="font-bold text-sm mb-2 text-[#1D2E1B] dark:text-white">Active Notifications</h4>
                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-[#F7F9F2] dark:bg-white/[0.03] space-y-0.5">
                    <p className="font-semibold text-xs text-[#1D2E1B] dark:text-white">AI Scan Completed</p>
                    <p className="text-[10px] text-[#546E50] dark:text-[#C8D2A6]">Verified careers endpoint authenticated (100/100)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Data Refresh Button (Re-syncs Map and Workspace in-place) */}
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="p-2.5 apple-squircle border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-[#A9C632]/10 text-[#546E50] dark:text-[#C8D2A6] transition-colors relative cursor-pointer group"
            title="Refresh Map & Job Database"
          >
            <RotateCw className={`w-4 h-4 transition-transform ${isRefreshing ? "animate-spin text-[#A9C632]" : "group-hover:rotate-45"}`} />
            {showRefreshToast && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-[#1D2E1B] text-[#A9C632] text-[10px] font-mono whitespace-nowrap shadow-md z-50">
                Map Refreshed!
              </span>
            )}
          </button>

          {/* Archive / Saved Tracker Jump */}
          <button
            onClick={() => onSelectTab("applied")}
            className="p-2.5 apple-squircle border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-[#A9C632]/10 text-[#546E50] dark:text-[#C8D2A6] transition-colors cursor-pointer"
            title="Archive & Saved Applications"
          >
            <Archive className="w-4 h-4" />
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="p-2.5 apple-squircle border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-[#A9C632]/10 text-[#546E50] dark:text-[#C8D2A6] transition-colors relative cursor-pointer"
            title="Copy Link to Share"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#A9C632]" /> : <LinkIcon className="w-4 h-4" />}
            {copiedLink && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#1D2E1B] text-[#A9C632] text-[10px] font-mono whitespace-nowrap shadow-md">
                Copied!
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 apple-squircle border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-[#A9C632]/10 text-[#546E50] dark:text-[#C8D2A6] transition-colors cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#A9C632]" /> : <Moon className="w-4 h-4 text-[#1D2E1B]" />}
          </button>

          {/* Sign Out / Exit to Landing Page */}
          <button
            onClick={() => {
              if (user) {
                logout();
              }
              if (onExitToLanding) {
                onExitToLanding();
              }
            }}
            className="p-2.5 apple-squircle border border-red-500/30 hover:bg-red-500/10 text-red-500/80 hover:text-red-500 transition-colors cursor-pointer"
            title={user ? "Log Out" : "Exit to Landing Page"}
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Primary Action: + Add company */}
          <button
            onClick={onOpenAddCompany}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer bg-[#1D2E1B] text-white hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B] dark:hover:bg-[#96B228] ml-1"
          >
            <Plus className="w-4 h-4 text-[#A9C632] dark:text-[#1D2E1B] stroke-[3]" />
            <span>Add company</span>
          </button>
        </div>
      </div>
    </header>
  );
}
