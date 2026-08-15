"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import SideNavRail from "./SideNavRail";
import TopBar from "./TopBar";
import CandidateProfilePage from "./CandidateProfilePage";
import UnifiedTrackerView from "./UnifiedTrackerView";
import VerificationQueueView from "./VerificationQueueView";
import FilterDrawer, { FilterOptions } from "./FilterDrawer";
import RequestCompanyModal, { SpatialLocationInfo } from "./RequestCompanyModal";
import AuthModal from "./AuthModal";
import LandingPage from "./LandingPage";
import JobListDrawer from "./JobListDrawer";
import ListView from "./ListView";
import SplashScreen from "./SplashScreen";
import CustomCursor from "./CustomCursor";
import FloatingJobPortalsManager, { OpenPortal } from "./FloatingJobPortalsManager";
import { NavTab } from "./Navigation";
import { getAllMapData } from "@/app/actions";
import { CompanyMapItem } from "./MapComponent";
import { useAuth } from "@/lib/authContext";
import { StartupTechHub, reverseGeocodeLocation } from "@/lib/geoUtils";
import { playTapSound } from "@/lib/soundFx";
import { MapPin, Navigation } from "lucide-react";

// Dynamic import for WebGL/MapLibre map
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

export default function FindersApp({
  initialCompanies = [],
  initialApplicationsCount = 0,
}: {
  initialCompanies?: any[];
  initialApplicationsCount?: number;
}) {
  const { user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>("globe");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [focusedArea, setFocusedArea] = useState<StartupTechHub | null>(null);
  const [spatialPinLocation, setSpatialPinLocation] = useState<SpatialLocationInfo | null>(null);
  const [geoToast, setGeoToast] = useState<string | null>(null);

  // Return to Landing Page automatically when user logs out, enter workspace when user logs in
  useEffect(() => {
    if (user) {
      setShowLandingPage(false);
    } else {
      setShowLandingPage(true);
    }
  }, [user]);

  // ── Multi-Window Floating Portals State (Max 4-5) ─────────────
  const [openPortals, setOpenPortals] = useState<OpenPortal[]>([]);

  // ── Sliding Job List Drawer State (Over Map) ──────────────────
  const [showListDrawer, setShowListDrawer] = useState(false);
  const [focusedFlyCompany, setFocusedFlyCompany] = useState<CompanyMapItem | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterOptions>({
    roles: [],
    locationType: "all",
    onlyHiring: false,
    minJobs: 0,
  });

  // Map Data
  const [allCompanies, setAllCompanies] = useState<CompanyMapItem[]>(
    (initialCompanies as CompanyMapItem[]) || []
  );

  const loadCompanies = async () => {
    try {
      const data = await getAllMapData();
      setAllCompanies(data as CompanyMapItem[]);
    } catch (err) {
      console.error("Failed to load map data", err);
    }
  };

  useEffect(() => {
    if (initialCompanies.length === 0) {
      loadCompanies();
    }
  }, [initialCompanies]);

  // Check URL query for company on initial landing
  useEffect(() => {
    if (typeof window !== "undefined" && allCompanies.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const companyParam = params.get("company");
      if (companyParam) {
        const matched = allCompanies.find(
          (c) =>
            c.name.toLowerCase().includes(companyParam.toLowerCase()) ||
            companyParam.toLowerCase().includes(c.name.toLowerCase())
        );
        if (matched) {
          setShowLandingPage(false);
          handleFlyToRole(matched);
        }
      }
    }
  }, [allCompanies]);

  // ── Multi-Window Portals Actions (Max 5 windows) ───────────
  const handleOpenPortal = (
    company: { id: string; name?: string; logo_url?: string | null; activeJobCount?: number } | CompanyMapItem,
    customPos?: { x: number; y: number }
  ) => {
    const fullCompany = allCompanies.find((c) => c.id === company.id) || company;

    setOpenPortals((prev) => {
      const existingIndex = prev.findIndex((p) => p.companyId === fullCompany.id);
      const highestZ = prev.reduce((max, p) => Math.max(max, p.zIndex), 100);

      // If portal is already in state, bring to front and un-minimize
      if (existingIndex >= 0) {
        return prev.map((p, idx) =>
          idx === existingIndex
            ? { ...p, isMinimized: false, zIndex: highestZ + 1 }
            : p
        );
      }

      // Calculate staggered initial position so windows cascade nicely
      const count = prev.length;
      const screenW = typeof window !== "undefined" ? window.innerWidth : 1200;
      const screenH = typeof window !== "undefined" ? window.innerHeight : 800;

      const initialPosition = customPos || {
        x: showListDrawer
          ? Math.max(500, screenW - 560 - (count % 3) * 40)
          : Math.max(70, Math.min(screenW - 540, 100 + (count % 4) * 150)),
        y: Math.max(80, Math.min(screenH - 680, 90 + (count % 3) * 60)),
      };

      const newPortal: OpenPortal = {
        companyId: fullCompany.id,
        companyName: fullCompany.name || "Company",
        companyLogo: fullCompany.logo_url || undefined,
        activeJobCount: fullCompany.activeJobCount,
        isMinimized: false,
        zIndex: highestZ + 1,
        initialPosition,
      };

      // Cap at 5 simultaneous portals (replace oldest if exceeded)
      if (prev.length >= 5) {
        return [...prev.slice(1), newPortal];
      }

      return [...prev, newPortal];
    });
  };

  const handleMinimizePortal = (companyId: string) => {
    setOpenPortals((prev) =>
      prev.map((p) => (p.companyId === companyId ? { ...p, isMinimized: true } : p))
    );
  };

  const handleRestorePortal = (companyId: string) => {
    setOpenPortals((prev) => {
      const highestZ = prev.reduce((max, p) => Math.max(max, p.zIndex), 100);
      return prev.map((p) =>
        p.companyId === companyId
          ? { ...p, isMinimized: false, zIndex: highestZ + 1 }
          : p
      );
    });
  };

  const handleClosePortal = (companyId: string) => {
    setOpenPortals((prev) => prev.filter((p) => p.companyId !== companyId));
  };

  const handleBringToFront = (companyId: string) => {
    setOpenPortals((prev) => {
      const highestZ = prev.reduce((max, p) => Math.max(max, p.zIndex), 100);
      return prev.map((p) =>
        p.companyId === companyId ? { ...p, zIndex: highestZ + 1 } : p
      );
    });
  };

  // 🛸 Fly To Role & Open Portal Action (Synchronous map fly + card presentation)
  const handleFlyToRole = (company: CompanyMapItem, job?: any) => {
    setFocusedFlyCompany({ ...company });
    handleOpenPortal(company);
  };

  // ✈️ Teleport map directly to clicked branch office
  const handleFlyToBranch = (city: string, lat: number, lng: number) => {
    setFocusedFlyCompany({
      id: crypto.randomUUID(),
      name: city,
      description: null,
      website_url: "",
      status: "verified",
      latitude: lat,
      longitude: lng,
      activeJobCount: 1,
    });
  };

  // ── Filter pipeline ─────────────────────────────────────────
  const filteredCompanies = allCompanies.filter((c) => {
    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = c.name.toLowerCase().includes(q);
      const descMatch = c.description?.toLowerCase().includes(q);
      const locationMatch = c.location_text?.toLowerCase().includes(q);
      const roleMatch = c.jobTitles?.some((t) => t.toLowerCase().includes(q));
      if (!nameMatch && !descMatch && !locationMatch && !roleMatch) return false;
    }

    // 2. Roles Filter
    if (filters.roles.length > 0) {
      const hasMatchingRole = c.jobTitles?.some((title) =>
        filters.roles.some((r) => title.toLowerCase().includes(r.toLowerCase()))
      );
      if (!hasMatchingRole) return false;
    }

    // 3. Location Type Filter
    if (filters.locationType === "remote") {
      const isRemote = c.location_text?.toLowerCase().includes("remote");
      if (!isRemote) return false;
    } else if (filters.locationType === "hybrid" || filters.locationType === "onsite") {
      const isRemoteOnly = c.location_text?.toLowerCase() === "remote";
      if (isRemoteOnly) return false;
    }

    // 4. Only Hiring Filter
    if (filters.onlyHiring && c.activeJobCount === 0) return false;

    // 5. Min Jobs Filter
    if (filters.minJobs > 0 && c.activeJobCount < filters.minJobs) return false;

    return true;
  });

  const totalJobsCount = allCompanies.reduce(
    (acc, c: any) => acc + (c.jobs?.length || c.activeJobCount || 0),
    0
  );
  const totalCompaniesCount = allCompanies.length;

  // ── Spatial Double-Click/Tap Map Handler (Capture Land Coordinates & Address) ──
  const handleMapDoubleClick = async (coords: { lat: number; lng: number }) => {
    playTapSound();
    setGeoToast("📍 Resolving Land Coordinates & Address...");
    try {
      const geo = await reverseGeocodeLocation(coords.lat, coords.lng);
      setSpatialPinLocation({
        address: geo.fullAddress,
        city: geo.city,
        lat: geo.latitude,
        lng: geo.longitude,
      });
      setGeoToast(null);
      setShowRequestModal(true);
    } catch (err) {
      console.warn("Geocoding notice:", err);
      setSpatialPinLocation({
        address: `Spatial Land Coordinates (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`,
        city: "Global Tech Hub",
        lat: coords.lat,
        lng: coords.lng,
      });
      setGeoToast(null);
      setShowRequestModal(true);
    }
  };

  if (showLandingPage) {
    return (
      <div className={`w-full h-full relative overflow-hidden font-urbanist ${isDarkMode ? "dark bg-[#131E12]" : "bg-[#F7F9F2]"}`}>
        <LandingPage
          onLaunchWorkspace={(companyName?: string) => {
            setShowLandingPage(false);
            setCurrentTab("globe");
            setViewMode("map");
            if (companyName) {
              const matched = allCompanies.find(
                (c) =>
                  c.name.toLowerCase().includes(companyName.toLowerCase()) ||
                  companyName.toLowerCase().includes(c.name.toLowerCase())
              );
              if (matched) {
                handleFlyToRole(matched);
              }
            }
          }}
          totalJobsCount={totalJobsCount || 176}
          totalCompaniesCount={Math.max(850, totalCompaniesCount || 76)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
        <AuthModal 
          isDarkMode={isDarkMode} 
          onSuccess={() => setShowLandingPage(false)} 
        />
      </div>
    );
  }

  return (
    <div className={`w-screen h-screen overflow-hidden flex flex-col relative font-urbanist select-none transition-colors ${isDarkMode ? "bg-[#1D2E1B] text-white" : "bg-[#F7F9F2] text-[#1D2E1B]"}`}>
      
      {/* ── 0. Animated Startup Splash Screen ─────────────────── */}
      <AnimatePresence>
        {showSplashScreen && (
          <SplashScreen
            onComplete={() => setShowSplashScreen(false)}
            totalCompaniesCount={allCompanies.length}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      {/* ── 0.1 Spatial Geocoding Toast ───────────────────────── */}
      <AnimatePresence>
        {geoToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#1D2E1B] dark:bg-[#A9C632] text-[#A9C632] dark:text-[#1D2E1B] text-xs font-bold shadow-2xl border border-[#A9C632]/50 flex items-center gap-2 animate-bounce">
            <Navigation className="w-3.5 h-3.5 animate-spin" />
            <span>{geoToast}</span>
          </div>
        )}
      </AnimatePresence>

      {/* ── 1. Floating Left Vertical Navigation Rail ──────── */}
      <SideNavRail
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === "globe") {
            setViewMode("map");
          }
        }}
        viewMode={viewMode}
        onSelectViewMode={(mode) => {
          setViewMode(mode);
          if (mode === "list") {
            setShowListDrawer(true);
          } else {
            setShowListDrawer(false);
          }
        }}
        onOpenLandingPage={() => setShowLandingPage(true)}
        isDarkMode={isDarkMode}
      />

      {/* ── 2. Floating Top Header Action Bar (When on map or list) ─ */}
      {currentTab !== "profile" && (
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddCompany={() => {
            setSpatialPinLocation(null);
            setShowRequestModal(true);
          }}
          onOpenFilterDrawer={() => setShowFilterDrawer(true)}
          onSelectTab={setCurrentTab}
          onRefresh={loadCompanies}
          onExitToLanding={() => setShowLandingPage(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          companies={allCompanies}
          onSelectCompany={(comp) => {
            setFocusedFlyCompany(comp);
            handleOpenPortal(comp);
          }}
          onFlyToArea={(area) => {
            setFocusedArea(area);
          }}
        />
      )}

      {/* ── 3. Full-Viewport Dynamic Content Canvas ─────────── */}
      <main className="w-full h-full relative overflow-hidden">
        {currentTab === "globe" ? (
          viewMode === "map" ? (
            <>
              {/* 2.5D GPU Globe & Map View (Always Live in Background) */}
              <MapComponent
                companies={filteredCompanies}
                searchQuery={searchQuery}
                onSelectCompany={handleOpenPortal}
                isDarkMode={isDarkMode}
                focusedCompany={focusedFlyCompany}
                focusedArea={focusedArea}
                onMapDoubleClick={handleMapDoubleClick}
                isListDrawerOpen={showListDrawer}
                onToggleListDrawer={() => setShowListDrawer(!showListDrawer)}
              />

              {/* Sliding Job List Drawer (Over Map with Expand to Grid support) */}
              <JobListDrawer
                isOpen={showListDrawer}
                onClose={() => setShowListDrawer(false)}
                companies={filteredCompanies}
                onFlyToRole={handleFlyToRole}
                onSelectCompany={handleOpenPortal}
                onExpandToFullPage={() => {
                  setViewMode("list");
                  setShowListDrawer(false);
                }}
                isDarkMode={isDarkMode}
              />
            </>
          ) : (
            <ListView
              companies={filteredCompanies as any}
              onSelectCompany={(companyId) => {
                const found = allCompanies.find((c) => c.id === companyId);
                if (found) handleOpenPortal(found);
              }}
              onBackToMap={() => {
                setViewMode("map");
                setShowListDrawer(true);
              }}
              isDarkMode={isDarkMode}
            />
          )
        ) : currentTab === "applied" ? (
          <UnifiedTrackerView isDarkMode={isDarkMode} />
        ) : currentTab === "verification" ? (
          <VerificationQueueView isDarkMode={isDarkMode} />
        ) : (
          <CandidateProfilePage isDarkMode={isDarkMode} />
        )}
      </main>

      {/* ── 4. Multi-Window Floating Portals & Minimized Dock ─ */}
      <FloatingJobPortalsManager
        portals={openPortals}
        onMinimize={handleMinimizePortal}
        onRestore={handleRestorePortal}
        onClose={handleClosePortal}
        onBringToFront={handleBringToFront}
        onFlyToBranch={handleFlyToBranch}
        highlightJobTitle={searchQuery}
        isDarkMode={isDarkMode}
      />

      {/* ── 5. Modals & Drawers ────────────────────────────── */}
      <FilterDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        filters={filters}
        onApplyFilters={setFilters}
        onResetFilters={() =>
          setFilters({ roles: [], locationType: "all", onlyHiring: false, minJobs: 0 })
        }
        isDarkMode={isDarkMode}
      />

      <RequestCompanyModal
        isOpen={showRequestModal}
        onClose={() => {
          setShowRequestModal(false);
          setSpatialPinLocation(null);
        }}
        onSubmitted={() => {
          loadCompanies();
          setSpatialPinLocation(null);
        }}
        spatialLocation={spatialPinLocation}
        isDarkMode={isDarkMode}
      />

      <AuthModal isDarkMode={isDarkMode} onSuccess={() => setShowLandingPage(false)} />

      {/* ── 6. iPad-Style ASMR Custom Cursor ───────────────── */}
      <CustomCursor isDarkMode={isDarkMode} />
    </div>
  );
}
