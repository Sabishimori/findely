"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

export default function TopBar({
  searchQuery,
  onSearchChange,
  onOpenAddCompany,
  onOpenFilterDrawer,
  onSelectTab,
  onRefresh,
  isDarkMode = false,
  onToggleDarkMode,
}: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddCompany: () => void;
  onOpenFilterDrawer?: () => void;
  onSelectTab: (tab: any) => void;
  onRefresh?: () => Promise<void> | void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}) {
  const { user, logout } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshToast, setShowRefreshToast] = useState(false);

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
        
        {/* ── Left: Search Bar (Spacious with 6px inset padding) ─ */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl relative pl-2">
          <Search className="w-4 h-4 text-[#546E50] dark:text-[#C8D2A6] absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search companies, roles (e.g. UI/UX Designer, Full-Stack), locations..."
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
                    <p className="text-[10px] text-[#546E50] dark:text-[#C8D2A6]">Vercel careers endpoint verified (100/100)</p>
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
