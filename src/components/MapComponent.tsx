"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Map, { Marker, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import DraggableCompanyCard from "./DraggableCompanyCard";
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sun, 
  Moon, 
  Compass, 
  Mountain, 
  Globe2, 
  Calendar, 
  Clock, 
  Zap, 
  List,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { handleImageError, getCompanyLogoUrl } from "@/lib/logoResolver";
import { getAllPinsForCompanies, CompanyMapPin } from "@/lib/companyIntelligence";
import { matchSmartQuery } from "@/lib/smartSearch";
import SponsoredLiveTicker from "./SponsoredLiveTicker";

export type CompanyMapItem = {
  id: string;
  name: string;
  website_url: string;
  logo_url?: string | null;
  description: string | null;
  location_text?: string | null;
  status: string;
  latitude: number | null;
  longitude: number | null;
  activeJobCount: number;
  jobTitles?: string[];
  latestPostDate?: Date | null;
  roles?: Array<{ id: string; title: string; salary_range?: string | null; location_text: string; posted_at?: Date | null }>;
  founders?: Array<{ name: string; role: string; linkedin_url?: string; avatar_url?: string }>;
  hrLeads?: Array<{ name: string; role: string; linkedin_url?: string; avatar_url?: string }>;
};

// 4 High-Performance Zero-Latency Basemap Styles (Strict maxzoom 18 to prevent grey 404 tile errors)
const MAP_STYLES: Record<string, any> = {
  light: {
    version: 8,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        ],
        tileSize: 256,
        maxzoom: 18,
      },
    },
    layers: [{ id: "raster-layer", type: "raster", source: "raster-tiles", minzoom: 0, maxzoom: 18 }],
  },
  dark: {
    version: 8,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        ],
        tileSize: 256,
        maxzoom: 18,
      },
    },
    layers: [{ id: "raster-layer", type: "raster", source: "raster-tiles", minzoom: 0, maxzoom: 18 }],
  },
  terrain: {
    version: 8,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        maxzoom: 18,
      },
    },
    layers: [{ id: "raster-layer", type: "raster", source: "raster-tiles", minzoom: 0, maxzoom: 18 }],
  },
  satellite: {
    version: 8,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        maxzoom: 18,
      },
    },
    layers: [{ id: "raster-layer", type: "raster", source: "raster-tiles", minzoom: 0, maxzoom: 18 }],
  },
};

export default function MapComponent({
  companies,
  searchQuery = "",
  onSelectCompany,
  onApplicationTracked,
  isDarkMode = false,
  onToggleDarkMode,
  focusedCompany = null,
  focusedArea = null,
  isListDrawerOpen = false,
  onToggleListDrawer,
  onOpenAdModal,
  onMapDoubleClick,
}: {
  companies: CompanyMapItem[];
  searchQuery?: string;
  onSelectCompany?: (company: CompanyMapItem) => void;
  onApplicationTracked?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  focusedCompany?: CompanyMapItem | null;
  focusedArea?: { coordinates: [number, number]; zoom?: number } | null;
  isListDrawerOpen?: boolean;
  onToggleListDrawer?: () => void;
  onOpenAdModal?: () => void;
  onMapDoubleClick?: (coords: { lat: number; lng: number }) => void;
}) {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [hoveredCompanyId, setHoveredCompanyId] = useState<string | null>(null);

  // Terrain mode state
  const [terrainMode, setTerrainMode] = useState<"light" | "dark" | "terrain" | "satellite">(
    isDarkMode ? "dark" : "light"
  );
  const [showTerrainMenu, setShowTerrainMenu] = useState(false);

  // Sync terrain basemap immediately when dark mode is toggled
  useEffect(() => {
    setTerrainMode(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Date Freshness Filter State
  const [dateFilter, setDateFilter] = useState<"all" | "24h" | "7d" | "30d">("all");

  const [viewState, setViewState] = useState({
    longitude: -20,
    latitude: 35,
    zoom: 2.3,
    pitch: 32, // 2.5D perspective pitch
    bearing: 0,
  });

  // Filter companies & all multi-location office branch pins with coordinates + strict search match + freshness filter
  const validPins = useMemo(() => {
    const allPins = getAllPinsForCompanies(companies);

    let list = allPins.filter(
      (p) => p.latitude !== null && p.latitude !== undefined && p.longitude !== null && p.longitude !== undefined
    );

    // If there's an active search query, ONLY show matching pins on the map with smart multi-token search!
    if (searchQuery && searchQuery.trim()) {
      list = list.filter((p) => {
        return matchSmartQuery(
          [
            p.company.name,
            p.company.description,
            p.locationName,
            p.company.location_text,
            ...(p.company.jobTitles || []),
            ...(p.company.roles?.map((r: any) => `${r.title} ${r.location_text || ""}`) || []),
            ...(p.rolesAtLocation?.map((r: any) => `${r.title} ${r.location_text || ""}`) || []),
          ],
          searchQuery
        );
      });
    }

    if (dateFilter !== "all") {
      const now = Date.now();
      const maxAgeMs =
        dateFilter === "24h"
          ? 24 * 60 * 60 * 1000
          : dateFilter === "7d"
          ? 7 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000;

      list = list.filter((p) => {
        if (!p.company.latestPostDate) return false;
        const age = now - new Date(p.company.latestPostDate).getTime();
        return age <= maxAgeMs;
      });
    }

    return list;
  }, [companies, searchQuery, dateFilter]);

  const flyToPin = useCallback(
    (pin: CompanyMapPin) => {
      setSelectedCompanyId(pin.company.id);
      if (onSelectCompany) {
        onSelectCompany(pin.company);
      }
      mapRef.current?.flyTo({
        center: [pin.longitude, pin.latitude],
        zoom: 11.5,
        pitch: 42,
        duration: 1500,
        essential: true,
      });
    },
    [onSelectCompany]
  );

  // Auto fly when focused company changes from external trigger
  useEffect(() => {
    if (focusedCompany && focusedCompany.latitude !== null && focusedCompany.longitude !== null) {
      setSelectedCompanyId(focusedCompany.id);
      mapRef.current?.flyTo({
        center: [focusedCompany.longitude, focusedCompany.latitude],
        zoom: 11,
        pitch: 42,
        duration: 1400,
        essential: true,
      });
    }
  }, [focusedCompany]);

  // Auto fly when focused area / city changes
  useEffect(() => {
    if (focusedArea && focusedArea.coordinates) {
      setSelectedCompanyId(null);
      mapRef.current?.flyTo({
        center: focusedArea.coordinates,
        zoom: focusedArea.zoom || 10.5,
        pitch: 36,
        duration: 1500,
        essential: true,
      });
    }
  }, [focusedArea]);

  // Listen for global fly-to-coords events (e.g. from office branch clicks)
  useEffect(() => {
    const handleFlyToCoords = (e: Event) => {
      const customEvent = e as CustomEvent<{ lat: number; lng: number; zoom?: number; pitch?: number }>;
      if (customEvent.detail && customEvent.detail.lat && customEvent.detail.lng) {
        mapRef.current?.flyTo({
          center: [customEvent.detail.lng, customEvent.detail.lat],
          zoom: customEvent.detail.zoom || 11.5,
          pitch: customEvent.detail.pitch || 40,
          duration: 1500,
          essential: true,
        });
      }
    };

    window.addEventListener("fly-to-coords", handleFlyToCoords);
    return () => window.removeEventListener("fly-to-coords", handleFlyToCoords);
  }, []);

  // When user is typing a search query, gently zoom out to overview if previously zoomed in close
  useEffect(() => {
    if (searchQuery.trim().length > 0 && viewState.zoom > 5 && !focusedCompany) {
      mapRef.current?.flyTo({
        zoom: 2.8,
        pitch: 28,
        duration: 1200,
        essential: false,
      });
    }
  }, [searchQuery, focusedCompany]);

  const handleZoomIn = () => {
    setViewState((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 1, 18) }));
  };

  const handleZoomOut = () => {
    setViewState((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 1, 1) }));
  };

  const handleReset = () => {
    mapRef.current?.flyTo({
      center: [-20, 35],
      zoom: 2.3,
      pitch: 32,
      bearing: 0,
      duration: 1400,
    });
    setSelectedCompanyId(null);
  };

  const activeMapStyle = MAP_STYLES[terrainMode] || MAP_STYLES.light;

  return (
    <div className={`relative w-full h-full overflow-hidden select-none font-urbanist ${isDarkMode ? "bg-[#1D2E1B]" : "bg-[#F4F6F5]"}`}>
      {/* 2.5D GPU Map */}
      <Map
        ref={mapRef}
        {...viewState}
        maxZoom={18}
        minZoom={1.5}
        doubleClickZoom={false}
        renderWorldCopies={true}
        onMove={(e) => setViewState(e.viewState)}
        onDblClick={(e) => {
          if (onMapDoubleClick && e.lngLat) {
            onMapDoubleClick({ lat: e.lngLat.lat, lng: e.lngLat.lng });
          }
        }}
        mapStyle={activeMapStyle}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        {validPins.map((pin) => {
          const company = pin.company;
          const hasJobs = pin.roleCount > 0;
          const isSelected = selectedCompanyId === company.id;
          const isHovered = hoveredCompanyId === pin.pinId;

          // Check if company has matching role for the search query
          const matchingRole = searchQuery.trim().length >= 2
            ? company.jobTitles?.find((t: string) =>
                t.toLowerCase().includes(searchQuery.toLowerCase().trim())
              ) || company.roles?.find((r: any) => r.title.toLowerCase().includes(searchQuery.toLowerCase().trim()))?.title
            : null;

          return (
            <Marker
              key={pin.pinId}
              longitude={pin.longitude}
              latitude={pin.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                flyToPin(pin);
              }}
            >
              <div
                className="relative cursor-pointer flex flex-col items-center group"
                onMouseEnter={() => setHoveredCompanyId(pin.pinId)}
                onMouseLeave={() => setHoveredCompanyId(null)}
              >
                {/* Hover Tooltip Card */}
                <AnimatePresence>
                  {isHovered && !isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.92 }}
                      className={`absolute bottom-full mb-3 pointer-events-none z-50 w-64 rounded-2xl p-4 shadow-2xl text-left border backdrop-blur-xl ${
                        isDarkMode
                          ? "bg-[#1D2E1B]/95 border-[#3D543A] text-white"
                          : "bg-white/95 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs truncate text-[#1D2E1B] dark:text-white">
                          {company.name}
                        </span>
                        <span className="text-[10px] font-bold text-[#1D2E1B] dark:text-[#A9C632] bg-[#A9C632]/20 px-2 py-0.5 rounded-full border border-[#A9C632]/40">
                          {pin.isHQ ? "HQ • " : ""}{pin.roleCount} {pin.roleCount === 1 ? "Role" : "Roles"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#546E50] dark:text-[#C8D2A6] mt-1 flex items-center gap-1 truncate font-medium">
                        <MapPin className="w-3 h-3 text-[#A9C632] flex-shrink-0" />
                        {pin.locationName}
                      </p>
                      {company.jobTitles && company.jobTitles.length > 0 && (
                        <div className="mt-2 pt-1.5 border-t border-[#C8D2A6] dark:border-[#3D543A] text-[10px] font-semibold truncate text-[#1D2E1B] dark:text-[#A9C632]">
                          💼 {company.jobTitles[0]}
                        </div>
                      )}
                      <div className="mt-2 pt-1.5 border-t border-[#C8D2A6]/40 dark:border-[#3D543A] flex items-center justify-between text-[9px] font-bold text-[#A9C632]">
                        <span>🏢 {pin.isHQ ? "Global HQ" : "Branch Hub"}</span>
                        <span>Explore ↗</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 2.5D Circular Map Pin with Glowing Tip & Micro-Beacon */}
                <motion.div
                  whileHover={{ scale: 1.18, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex flex-col items-center"
                >
                  {/* Subtle Micro-Beacon Pulse Dot for Search Match */}
                  {matchingRole && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-20">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A9C632] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#A9C632] border-2 border-[#1D2E1B]" />
                    </span>
                  )}

                  {/* Clean Fixed-Size Circular Logo Pin */}
                  <div
                    className={`w-11 h-11 rounded-full p-1 shadow-xl flex items-center justify-center transition-all ${
                      isDarkMode ? "bg-[#1D2E1B] text-white" : "bg-white text-[#1D2E1B]"
                    } ${
                      isSelected
                        ? "ring-4 ring-[#A9C632]/40 scale-115 shadow-2xl border-2 border-[#A9C632]"
                        : matchingRole
                        ? "border-2 border-[#A9C632] ring-2 ring-[#A9C632]/60 shadow-[0_0_12px_rgba(169,198,50,0.4)]"
                        : hasJobs
                        ? "border-2 border-[#A9C632]/80 ring-2 ring-[#A9C632]/20"
                        : "border border-[#C8D2A6] dark:border-white/20 opacity-80"
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-[#F7F9F2] dark:bg-white/10 flex items-center justify-center p-1.5 overflow-hidden shadow-inner">
                      <img
                        src={getCompanyLogoUrl(company.website_url, company.name, company.logo_url || undefined)}
                        alt={company.name}
                        className="w-full h-full object-contain rounded-full"
                        onError={(e) => handleImageError(e, company.name)}
                      />
                    </div>
                  </div>

                  {/* Circular Pin Tip Extrusion */}
                  <div
                    className={`w-2.5 h-2.5 rotate-45 -mt-1.5 shadow-md rounded-[1px] ${
                      isSelected || matchingRole
                        ? "bg-[#A9C632]"
                        : isDarkMode
                        ? "bg-[#1D2E1B]"
                        : "bg-white"
                    }`}
                  />

                  {/* Location Tag - Displayed when actively searching */}
                  {searchQuery && searchQuery.trim().length > 0 && (
                    <span className="mt-1 px-2 py-0.5 rounded-full bg-[#1D2E1B]/95 text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] text-[9px] font-bold shadow-lg border border-[#A9C632]/50 whitespace-nowrap max-w-[120px] truncate flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 shrink-0 text-[#A9C632] dark:text-[#1D2E1B]" />
                      <span className="truncate">{pin.locationName.split(",")[0]}</span>
                    </span>
                  )}

                  {/* ── Slide-Down Under-Drawer / Keyword Match Badge (Clean Micro Badge) ── */}
                  <AnimatePresence>
                    {matchingRole && (
                      <motion.div
                        initial={{ y: -4, opacity: 0, scale: 0.85 }}
                        animate={{ y: 2, opacity: 1, scale: 1 }}
                        exit={{ y: -4, opacity: 0, scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 450, damping: 28 }}
                        className="mt-1 px-2.5 py-0.5 rounded-full bg-[#1D2E1B]/95 text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] text-[8.5px] font-mono font-bold tracking-tight shadow-xl border border-[#A9C632]/60 flex items-center gap-1.5 backdrop-blur-md whitespace-nowrap max-w-[130px] z-10"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A9C632] dark:bg-[#1D2E1B] shrink-0" />
                        <span className="truncate">{matchingRole}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </Marker>
          );
        })}
      </Map>

      {/* ── Top-Right Map Controls: List Toggle Pill (from reference image) ── */}
      {onToggleListDrawer && (
        <div className="absolute right-6 top-6 z-30 flex items-center gap-2">
          <button
            onClick={onToggleListDrawer}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-xl backdrop-blur-2xl transition-all cursor-pointer font-urbanist text-xs font-bold ${
              isListDrawerOpen
                ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] border-[#A9C632] shadow-2xl scale-105"
                : "bg-white/90 dark:bg-[#1D2E1B]/90 text-[#1D2E1B] dark:text-white border-[#C8D2A6] dark:border-[#3D543A] hover:border-[#A9C632]"
            }`}
            title="Toggle interactive Jobs List Drawer"
          >
            <List className="w-4 h-4 text-[#A9C632]" />
            <span>List</span>
          </button>
        </div>
      )}

      {/* ── Bottom Dock: Freshness Filter Bar on Top, Sponsored Live Ticker directly Under It ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2.5 w-[96%] max-w-6xl sm:max-w-7xl pointer-events-none">
        {/* Date Freshness Filter Bar (Frosted Glass & Apple Squircle Tile) */}
        <div className="pointer-events-auto flex items-center gap-2 p-2 bg-white/90 dark:bg-[#1D2E1B]/95 backdrop-blur-2xl rounded-[28px] border border-[#C8D2A6] dark:border-[#3D543A] shadow-2xl text-xs font-semibold select-none">
          <div className="flex items-center gap-2 pr-1 pl-1">
            <div className="w-8 h-8 apple-icon-tile bg-[#1D2E1B] text-[#A9C632] flex items-center justify-center shadow-md p-1 border border-[#C8D2A6]/40 dark:border-white/10 flex-shrink-0">
              <Clock className="w-4 h-4 text-[#A9C632]" />
            </div>
            <span className="text-xs font-bold text-[#1D2E1B] dark:text-white whitespace-nowrap">
              Freshness:
            </span>
          </div>

          {[
            { id: "all", label: "All Time" },
            { id: "24h", label: "⚡ Past 24h" },
            { id: "7d", label: "📅 Past 7d" },
            { id: "30d", label: "🕒 Past 30d" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setDateFilter(f.id as any)}
              className={`px-3.5 py-1.5 text-xs font-bold apple-squircle transition-all cursor-pointer ${
                dateFilter === f.id
                  ? "bg-[#1D2E1B] text-white dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-md scale-102 ring-2 ring-[#A9C632]/50"
                  : "bg-transparent text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Continuous Horizontal Live Advertisement & Sponsored Startup Marquee (Directly Under Freshness Bar) */}
        <SponsoredLiveTicker
          companies={companies}
          onSelectCompany={onSelectCompany}
          onOpenAdModal={onOpenAdModal}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* ── Right-Side Center Modernist Controls Dock (Frosted Glass) ─ */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 bg-white/85 dark:bg-[#1D2E1B]/90 backdrop-blur-2xl p-2 rounded-3xl border border-[#C8D2A6] dark:border-[#546E50] shadow-2xl">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center text-[#1D2E1B] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-colors font-extrabold text-lg cursor-pointer"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center text-[#1D2E1B] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-colors font-extrabold text-lg cursor-pointer"
          title="Zoom out"
        >
          −
        </button>
        <div className="h-px bg-[#C8D2A6] dark:bg-[#546E50] my-0.5" />
        
        {/* Striped Vector Globe Reset Button */}
        <button
          onClick={handleReset}
          className="w-10 h-10 flex items-center justify-center text-[#1D2E1B] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-colors cursor-pointer group"
          title="Reset globe view"
        >
          <svg className="w-5 h-5 text-[#A9C632] group-hover:rotate-45 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
            <path d="M4 7h16" />
            <path d="M4 17h16" />
          </svg>
        </button>

        {/* Terrain Mode Selector Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowTerrainMenu(!showTerrainMenu)}
            className="w-10 h-10 flex items-center justify-center text-[#1D2E1B] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-colors cursor-pointer"
            title="Switch Map Style & Terrain"
          >
            <Layers className="w-5 h-5 text-[#A9C632]" />
          </button>

          {/* Popover Menu for Map Styles */}
          {showTerrainMenu && (
            <div className={`absolute right-12 top-0 w-44 rounded-2xl p-2 shadow-2xl border text-xs z-50 ${
              isDarkMode ? "bg-[#1D2E1B] border-[#546E50] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
            }`}>
              <span className="text-[10px] text-gray-400 uppercase font-mono px-2 py-1 block">Map Basemap</span>
              {[
                { id: "light", label: "Crisp Light", icon: Sun },
                { id: "dark", label: "Obsidian Dark", icon: Moon },
                { id: "terrain", label: "Topographic Terrain", icon: Mountain },
                { id: "satellite", label: "Satellite Imagery", icon: Globe2 },
              ].map((style) => {
                const IconComponent = style.icon;
                return (
                  <button
                    key={style.id}
                    onClick={() => {
                      setTerrainMode(style.id as any);
                      setShowTerrainMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors text-left ${
                      terrainMode === style.id
                        ? "bg-[#A9C632]/20 text-[#A9C632] font-bold"
                        : "hover:bg-black/5 dark:hover:bg-white/10 text-[#546E50] dark:text-[#C8D2A6]"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{style.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Right-Side Center Modernist Controls Dock (Frosted Glass) ─ */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 bg-white/85 dark:bg-[#1D2E1B]/90 backdrop-blur-2xl p-2 rounded-3xl border border-[#C8D2A6] dark:border-[#546E50] shadow-2xl">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center text-[#1D2E1B] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-colors font-extrabold text-lg cursor-pointer"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center text-[#1D2E1B] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-colors font-extrabold text-lg cursor-pointer"
          title="Zoom out"
        >
          −
        </button>
        <div className="h-px bg-[#C8D2A6] dark:bg-[#546E50] my-0.5" />
        
        {/* Striped Vector Globe Reset Button */}
        <button
          onClick={handleReset}
          className="w-10 h-10 flex items-center justify-center text-[#1D2E1B] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-colors cursor-pointer group"
          title="Reset globe view"
        >
          <svg className="w-5 h-5 text-[#A9C632] group-hover:rotate-45 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
            <path d="M4 7h16" />
            <path d="M4 17h16" />
          </svg>
        </button>

        {/* Terrain Mode Selector Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowTerrainMenu(!showTerrainMenu)}
            className="w-10 h-10 flex items-center justify-center text-[#1D2E1B] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-colors cursor-pointer"
            title="Switch Map Style & Terrain"
          >
            <Layers className="w-5 h-5 text-[#A9C632]" />
          </button>

          {/* Popover Menu for Map Styles */}
          {showTerrainMenu && (
            <div className={`absolute right-12 top-0 w-44 rounded-2xl p-2 shadow-2xl border text-xs z-50 ${
              isDarkMode ? "bg-[#1D2E1B] border-[#546E50] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
            }`}>
              <span className="text-[10px] text-gray-400 uppercase font-mono px-2 py-1 block">Map Basemap</span>
              {[
                { id: "light", label: "Crisp Light", icon: Sun },
                { id: "dark", label: "Obsidian Dark", icon: Moon },
                { id: "terrain", label: "Topographic Terrain", icon: Mountain },
                { id: "satellite", label: "Satellite Imagery", icon: Globe2 },
              ].map((style) => {
                const IconComponent = style.icon;
                return (
                  <button
                    key={style.id}
                    onClick={() => {
                      setTerrainMode(style.id as any);
                      setShowTerrainMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors text-left ${
                      terrainMode === style.id
                        ? "bg-[#A9C632]/20 text-[#A9C632] font-bold"
                        : "hover:bg-black/5 dark:hover:bg-white/10 text-[#546E50] dark:text-[#C8D2A6]"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{style.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
