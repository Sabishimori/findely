"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useDragControls } from "motion/react";
import { getCompanyWithJobs, trackJobApplication, toggleSaveJob } from "@/app/actions";
import { getCompanyIntelligence, CompanyIntelligence } from "@/lib/companyIntelligence";
import { resolveExactJobApplyUrl, resolveFounderLinkedinUrl, resolveCompanyLinkedinUrl } from "@/lib/applyUrlResolver";
import { playTapSound } from "@/lib/soundFx";
import { handleImageError, getCompanyLogoUrl } from "@/lib/logoResolver";
import { matchesLocation } from "@/lib/locationMatcher";
import EmailOutreachModal from "./EmailOutreachModal";
import ReportCompanyModal from "./ReportCompanyModal";
import { 
  X, 
  ExternalLink, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  Bookmark, 
  BookmarkCheck, 
  Mail, 
  Briefcase, 
  Minus, 
  Maximize2, 
  Minimize2, 
  GripHorizontal, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Check,
  Flag,
  Clock
} from "lucide-react";
import { formatRelativeTime } from "@/lib/smartSearch";

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

type CompanyDetails = Awaited<ReturnType<typeof getCompanyWithJobs>>;

export interface FloatingPortalCardProps {
  companyId: string;
  zIndex: number;
  initialPosition?: { x: number; y: number };
  onMinimize: () => void;
  onClose: () => void;
  onBringToFront: () => void;
  onApplicationTracked?: () => void;
  onFlyToBranch?: (city: string, lat: number, lng: number) => void;
  highlightJobTitle?: string;
  isDarkMode?: boolean;
}

export default function FloatingPortalCard({
  companyId,
  zIndex,
  initialPosition = { x: 120, y: 100 },
  onMinimize,
  onClose,
  onBringToFront,
  onApplicationTracked,
  onFlyToBranch,
  highlightJobTitle,
  isDarkMode = false,
}: FloatingPortalCardProps) {
  const [data, setData] = useState<CompanyDetails>(null);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);

  // Single-Page Navigation Section State: "overview" | "jobs"
  const [activeSection, setActiveSection] = useState<"overview" | "jobs">("overview");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const jobsSectionRef = useRef<HTMLDivElement>(null);

  const [showAllLocations, setShowAllLocations] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingJob, setReportingJob] = useState<{ id: string; title: string } | null>(null);

  // Email Outreach Modal State
  const [outreachModalState, setOutreachModalState] = useState<{
    isOpen: boolean;
    jobTitle: string;
    recipientEmail?: string;
    hrName?: string;
  }>({
    isOpen: false,
    jobTitle: "",
  });

  const dragControls = useDragControls();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getCompanyWithJobs(companyId);
        setData(res);
      } catch (err) {
        console.error("Failed to load company portal", err);
      } finally {
        setLoading(false);
      }
    }
    if (companyId) load();

    const handleSync = (e: any) => {
      const { jobId, isSaved } = e.detail || {};
      if (jobId) {
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          if (isSaved) next.add(jobId);
          else next.delete(jobId);
          return next;
        });
      }
    };

    window.addEventListener("saved-jobs-changed", handleSync);
    return () => window.removeEventListener("saved-jobs-changed", handleSync);
  }, [companyId]);

  // Smooth Jump to Top (Overview)
  const scrollToOverview = () => {
    playTapSound();
    setActiveSection("overview");
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Smooth Jump to Bottom (Open Roles)
  const scrollToJobs = () => {
    playTapSound();
    setActiveSection("jobs");
    jobsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Active section tracking as user scrolls
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!jobsSectionRef.current) return;
    const containerTop = e.currentTarget.scrollTop;
    const jobsTop = jobsSectionRef.current.offsetTop - 140;
    if (containerTop >= jobsTop) {
      setActiveSection("jobs");
    } else {
      setActiveSection("overview");
    }
  };

  const handleTrackApplication = async (job: any) => {
    if (!data) return;
    setAppliedJobIds((prev) => new Set([...prev, job.id]));

    const directUrl = resolveExactJobApplyUrl({
      companyName: data.name,
      websiteUrl: data.website_url,
      applyUrl: job.apply_url,
      jobTitle: job.title,
    });

    await trackJobApplication({
      job_id: job.id,
      company_id: data.id,
      job_title: job.title,
      company_name: data.name,
      company_logo: data.logo_url,
      location_text: job.location_text,
      salary_range: job.salary_range,
      apply_url: directUrl,
      status: "applied",
      notes: `Applied via Findely on ${new Date().toLocaleDateString()}`,
    });

    if (onApplicationTracked) onApplicationTracked();
  };

  const handleToggleSave = (job: any) => {
    if (!data) return;
    const isCurrentlySaved = savedJobIds.has(job.id);
    const newSavedState = !isCurrentlySaved;

    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (newSavedState) next.add(job.id);
      else next.delete(job.id);
      return next;
    });

    // Broadcast change across all open views
    window.dispatchEvent(
      new CustomEvent("saved-jobs-changed", {
        detail: { jobId: job.id, isSaved: newSavedState },
      })
    );

    const directUrl = resolveExactJobApplyUrl({
      companyName: data.name,
      websiteUrl: data.website_url,
      applyUrl: job.apply_url,
      jobTitle: job.title,
    });

    toggleSaveJob({
      job_id: job.id,
      job_title: job.title,
      company_id: data.id,
      company_name: data.name,
      company_logo: data.logo_url,
      location_text: job.location_text,
      salary_range: job.salary_range,
      apply_url: directUrl,
    }).catch(console.error);

    if (onApplicationTracked) onApplicationTracked();
  };

  const intel: CompanyIntelligence = data 
    ? getCompanyIntelligence({
        name: data.name,
        description: data.description,
        founded_year: data.founded_year,
        company_size: data.company_size,
        location_text: data.location_text,
        jobs: data.jobs || [],
      })
    : (null as any);

  const rawJobs: any[] = data?.jobs || [];
  const directBranchMatches = rawJobs.filter((job: any) => {
    let matchesDept = true;
    if (selectedDepartment) {
      matchesDept =
        job.title.toLowerCase().includes(selectedDepartment.toLowerCase()) ||
        !!(job.location_text && job.location_text.toLowerCase().includes(selectedDepartment.toLowerCase()));
    }

    let matchesBranch = true;
    if (selectedBranch) {
      matchesBranch = matchesLocation(job.location_text, selectedBranch, job.job_type);
    }

    return matchesDept && matchesBranch;
  });

  const isBranchFallback = selectedBranch && directBranchMatches.length === 0 && rawJobs.length > 0;

  const filteredJobs = directBranchMatches.length > 0 
    ? directBranchMatches 
    : rawJobs.filter((job: any) => {
        if (!selectedDepartment) return true;
        return (
          job.title.toLowerCase().includes(selectedDepartment.toLowerCase()) ||
          !!(job.location_text && job.location_text.toLowerCase().includes(selectedDepartment.toLowerCase()))
        );
      });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (!highlightJobTitle) return 0;
    const aMatch = a.title.toLowerCase().includes(highlightJobTitle.toLowerCase());
    const bMatch = b.title.toLowerCase().includes(highlightJobTitle.toLowerCase());
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, scale: 0.95, x: initialPosition.x, y: initialPosition.y + 10 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        x: initialPosition.x, 
        y: initialPosition.y,
        transition: { type: "spring", stiffness: 350, damping: 30 }
      }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      onMouseDown={onBringToFront}
      style={{ zIndex }}
      className={`fixed top-0 left-0 w-[94vw] max-w-[calc(100vw-24px)] max-h-[calc(100vh-32px)] ${
        isExpanded ? "sm:w-[640px] h-[780px]" : "sm:w-[520px] h-[680px]"
      } rounded-[28px] border shadow-2xl backdrop-blur-2xl flex flex-col font-urbanist select-none overflow-hidden ${
        isDarkMode 
          ? "bg-[#1D2E1B]/95 border-[#3D543A] text-white" 
          : "bg-white/95 border-[#C8D2A6] text-[#1D2E1B]"
      }`}
    >
      {/* ── 1. Top Draggable Section (Clean Header with Drag Grip, Controls) ─── */}
      <div className="px-4 py-3 border-b border-[#C8D2A6] dark:border-[#3D543A] flex items-center justify-between bg-[#F7F9F2] dark:bg-white/[0.04] flex-shrink-0">
        {/* Drag Grip Handle */}
        <div 
          onPointerDown={(e) => dragControls.start(e)}
          className="flex items-center gap-2.5 min-w-0 cursor-grab active:cursor-grabbing flex-1 mr-2 select-none"
        >
          <GripHorizontal className="w-4 h-4 text-[#546E50] dark:text-[#C8D2A6] flex-shrink-0" />
          <div className="w-8 h-8 apple-icon-tile bg-white dark:bg-white/10 p-1 flex items-center justify-center flex-shrink-0 shadow-xs border border-[#C8D2A6]/40 dark:border-white/10">
            {data?.logo_url ? (
              <img src={data.logo_url} alt={data.name} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-4 h-4 text-[#A9C632]" />
            )}
          </div>
          <span className="font-bold text-xs truncate text-[#1D2E1B] dark:text-white">
            {data?.name || "Company Portal"}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/40 whitespace-nowrap">
            {data?.jobs ? `${data.jobs.length} ${data.jobs.length === 1 ? "Job" : "Jobs"}` : `${intel?.openPositionsCount || 0} Jobs`}
          </span>
        </div>

        {/* Top Controls: Minimize, Expand, Close (Isolated from Drag Controls) */}
        <div 
          className="flex items-center gap-1.5 flex-shrink-0" 
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            aria-label="Minimize company portal"
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-[#546E50] hover:text-[#1D2E1B] dark:hover:text-white transition-colors cursor-pointer"
            title="Minimize to bottom dock"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-label={isExpanded ? "Restore portal size" : "Expand portal window"}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-[#546E50] hover:text-[#1D2E1B] dark:hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? "Restore standard size" : "Expand window"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close company portal"
            className="p-1.5 rounded-lg hover:bg-red-500/15 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Close portal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── 2. Continuous Single-Page Content Body ─── */}
      {loading ? (
        <div className="p-16 flex flex-col justify-center items-center gap-3 flex-1">
          <div className="w-8 h-8 border-2 border-[#A9C632] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#546E50] dark:text-[#C8D2A6]">Loading company intelligence...</span>
        </div>
      ) : data && intel ? (
        <div className="relative flex-1 overflow-hidden flex flex-col">
          
          {/* Scrollable Container with padding bottom for floating jump pill */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto pb-24 flex flex-col"
          >
            
            {/* Header Top Profile Section */}
            <div className="p-5 border-b border-[#C8D2A6] dark:border-[#3D543A] bg-[#F7F9F2]/60 dark:bg-white/[0.02] flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-white dark:bg-white/10 border border-[#C8D2A6] dark:border-[#3D543A] flex items-center justify-center overflow-hidden flex-shrink-0 p-2 shadow-xs">
                    <img
                      src={getCompanyLogoUrl(data.website_url, data.name, data.logo_url || undefined)}
                      alt={data.name}
                      className="w-full h-full object-contain"
                      onError={(e) => handleImageError(e, data.name)}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-[#1D2E1B] dark:text-white tracking-tight">
                        {data.name}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/40 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#A9C632]" />
                        <span>Verified 2026</span>
                      </span>
                    </div>
                    {data.website_url && (
                      <a
                        href={data.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#546E50] hover:text-[#1D2E1B] dark:text-[#C8D2A6] dark:hover:text-[#A9C632] flex items-center gap-1 mt-0.5 font-semibold transition-colors"
                      >
                        <span>{new URL(data.website_url).hostname.replace("www.", "")}</span>
                        <ExternalLink className="w-3 h-3 text-[#A9C632]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Quick Attributes Ribbon */}
              <div className="grid grid-cols-4 gap-2 mt-3.5 text-xs">
                <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A]">
                  <span className="text-[9px] text-[#546E50] dark:text-[#C8D2A6] uppercase font-bold block">Founded</span>
                  <span className="font-bold text-[#1D2E1B] dark:text-white text-xs mt-0.5 block">
                    {intel.founded}
                  </span>
                </div>
                <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A]">
                  <span className="text-[9px] text-[#546E50] dark:text-[#C8D2A6] uppercase font-bold block">Work Mode</span>
                  <span className="font-bold text-[#1D2E1B] dark:text-white text-xs mt-0.5 block truncate">
                    {intel.workMode}
                  </span>
                </div>
                <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A]">
                  <span className="text-[9px] text-[#546E50] dark:text-[#C8D2A6] uppercase font-bold block">Stage</span>
                  <span className="font-bold text-[#1D2E1B] dark:text-white text-xs mt-0.5 block truncate">
                    {intel.fundingStage}
                  </span>
                </div>
                <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A]">
                  <span className="text-[9px] text-[#546E50] dark:text-[#C8D2A6] uppercase font-bold block">Valuation</span>
                  <span className="font-bold text-[#A9C632] text-xs mt-0.5 block truncate">
                    {intel.valuation}
                  </span>
                </div>
              </div>
            </div>

            {/* ── SECTION 1: COMPANY INTELLIGENCE & OVERVIEW ─── */}
            <div className="p-5 space-y-5 text-xs">
              
              {/* About Paragraph */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-[#1D2E1B] dark:text-white uppercase tracking-wider text-[11px]">
                  About
                </h3>
                <p className="text-[#546E50] dark:text-[#C8D2A6] leading-relaxed text-xs">
                  {intel.about}
                </p>
              </div>

              {/* Industry & Business Model Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#546E50] dark:text-[#C8D2A6] uppercase font-bold">
                    Industry Verticals
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {intel.industry.map((ind, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-black/[0.04] dark:bg-white/5 border border-black/[0.06] dark:border-white/10 text-[11px] font-medium"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#546E50] dark:text-[#C8D2A6] uppercase font-bold">
                    Business Model
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {intel.businessModel.map((model, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-[#A9C632]/10 border border-[#A9C632]/30 text-[#1D2E1B] dark:text-[#A9C632] text-[11px] font-bold"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Financials & Investors Card */}
              <div className="p-4 rounded-2xl bg-[#F7F9F2] dark:bg-white/[0.03] border border-[#C8D2A6] dark:border-[#3D543A] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#A9C632]" />
                    <span className="font-bold text-xs text-[#1D2E1B] dark:text-white">Capital & Backing</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#A9C632] bg-[#A9C632]/10 px-2 py-0.5 rounded-md">
                    Total Raised: {intel.totalFunding}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-[#546E50] dark:text-[#C8D2A6] uppercase font-bold block">
                    Key Investors
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {intel.keyInvestors.map((inv, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] text-xs font-semibold text-[#1D2E1B] dark:text-white shadow-2xs"
                      >
                        {inv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verified Benefits Strip */}
              {intel.benefits && intel.benefits.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#1D2E1B] dark:text-white uppercase tracking-wider text-[11px]">
                      Benefits & Perks ({intel.benefits.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {intel.benefits.map((b, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] flex items-center justify-between gap-1 shadow-2xs"
                      >
                        <span className="font-semibold text-xs text-[#1D2E1B] dark:text-white truncate">
                          {b.name}
                        </span>
                        <span className="text-[10px] font-bold text-[#A9C632] bg-[#A9C632]/10 px-1.5 py-0.2 rounded flex-shrink-0">
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Office Address & Interactive Branch Jumper */}
              {intel.officeNetwork && intel.officeNetwork.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#1D2E1B] dark:text-white uppercase tracking-wider text-[11px]">
                      Global Offices & Branches ({intel.totalLocationsCount})
                    </h3>
                    <span className="text-[10px] text-[#A9C632] font-semibold">Click to teleport map & filter</span>
                  </div>

                  <div className="space-y-1.5">
                    {(showAllLocations ? intel.officeNetwork : intel.officeNetwork.slice(0, 4)).map((loc, idx) => {
                      const isBranchActive = selectedBranch === loc.city;

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            playTapSound();
                            if (isBranchActive) {
                              setSelectedBranch(null);
                            } else {
                              setSelectedBranch(loc.city);
                              if (loc.lat && loc.lng) {
                                window.dispatchEvent(
                                  new CustomEvent("fly-to-coords", {
                                    detail: { lat: loc.lat, lng: loc.lng, zoom: 12, pitch: 42 },
                                  })
                                );
                              }
                              if (onFlyToBranch) {
                                onFlyToBranch(loc.city, loc.lat, loc.lng);
                              }
                              scrollToJobs();
                            }
                          }}
                          className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between shadow-2xs cursor-pointer group ${
                            isBranchActive
                              ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] border-[#A9C632] ring-2 ring-[#A9C632]/40"
                              : "bg-white dark:bg-white/5 border-[#C8D2A6] dark:border-[#3D543A] hover:border-[#A9C632] hover:bg-[#A9C632]/5"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm">{loc.flag}</span>
                            <div className="min-w-0">
                              <span className={`font-bold text-xs truncate block ${isBranchActive ? "text-white dark:text-[#1D2E1B]" : "text-[#1D2E1B] dark:text-white group-hover:text-[#A9C632]"}`}>
                                {loc.city}, {loc.country}
                              </span>
                              {loc.isHQ && (
                                <span className="text-[9px] font-extrabold uppercase tracking-wide text-[#A9C632]">
                                  Global Headquarters
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-[11px] font-bold ${isBranchActive ? "text-[#A9C632] dark:text-[#1D2E1B]" : "text-[#546E50] dark:text-[#C8D2A6]"}`}>
                              {loc.jobs} roles
                            </span>
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold transition-all ${
                              isBranchActive 
                                ? "bg-white/20 text-white dark:bg-black/20 dark:text-[#1D2E1B]" 
                                : "bg-[#A9C632]/15 text-[#1D2E1B] dark:text-[#A9C632] group-hover:bg-[#A9C632] group-hover:text-[#1D2E1B]"
                            }`}>
                              {isBranchActive ? "Active View" : "Teleport 📍"}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {intel.officeNetwork.length > 4 && (
                      <button
                        onClick={() => setShowAllLocations(!showAllLocations)}
                        className="w-full py-2 rounded-xl border border-dashed border-[#A9C632]/50 hover:bg-[#A9C632]/10 text-xs font-bold text-[#A9C632] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        {showAllLocations ? (
                          <>
                            <span>Show less</span>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Show all {intel.totalLocationsCount} office branches</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Department Fast Filter */}
              {intel.departments && intel.departments.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#1D2E1B] dark:text-white uppercase tracking-wider text-[11px]">
                      Departments ({intel.departments.length})
                    </h3>
                    <span className="text-[10px] text-gray-400">Click to filter & jump</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {intel.departments.map((dept, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedDepartment(dept);
                          scrollToJobs();
                        }}
                        className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-black/[0.03] dark:bg-white/[0.05] hover:bg-[#A9C632]/20 hover:border-[#A9C632] border border-[#C8D2A6] dark:border-[#3D543A] text-[#1D2E1B] dark:text-white transition-colors cursor-pointer"
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Ribbon */}
              {intel.techStack && intel.techStack.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-[#1D2E1B] dark:text-white uppercase tracking-wider text-[11px]">
                    Engineering & AI Stack
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {intel.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] text-xs font-mono font-medium text-[#1D2E1B] dark:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Leadership & Founders Section */}
              {data.founders && data.founders.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-[#1D2E1B] dark:text-white uppercase tracking-wider text-[11px]">
                    Leadership & Founders
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {data.founders.map((founder: any, i: number) => {
                      const linkedinUrl = resolveFounderLinkedinUrl(founder.name, data.name, founder.linkedin_url);
                      return (
                        <div
                          key={i}
                          className="p-3 bg-[#F7F9F2] dark:bg-white/5 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={founder.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(founder.name)}&backgroundColor=1D2E1B&textColor=A9C632`}
                              alt={founder.name}
                              className="w-8 h-8 rounded-full object-cover border border-[#C8D2A6] dark:border-white/10"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-[#1D2E1B] dark:text-white truncate text-[11px]">{founder.name}</p>
                              <p className="text-[10px] text-[#546E50] dark:text-[#C8D2A6] truncate">{founder.role}</p>
                            </div>
                          </div>
                          <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#0A66C2] hover:text-[#004182] dark:text-[#70B5F9] dark:hover:text-white p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors flex items-center gap-1 shrink-0 font-bold text-[11px]"
                            title={`Connect with ${founder.name} on LinkedIn`}
                          >
                            <LinkedinIcon className="w-3.5 h-3.5" />
                            <span>Profile</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 2: OPEN POSITIONS & ROLES (CONTINUOUS SCROLL) ─ */}
            <div 
              ref={jobsSectionRef}
              id="company-jobs-section" 
              className="p-5 border-t border-[#C8D2A6] dark:border-[#3D543A] space-y-4 text-xs bg-[#F7F9F2]/30 dark:bg-white/[0.01]"
            >
              
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#A9C632]" />
                  <h3 className="font-bold text-sm text-[#1D2E1B] dark:text-white tracking-tight">
                    Open Positions ({sortedJobs.length || intel.openPositionsCount})
                  </h3>
                </div>
                <span className="text-[11px] text-[#546E50] dark:text-[#C8D2A6] font-semibold">
                  Verified Directly
                </span>
              </div>

              {/* Department & Branch Filter Banners */}
              {selectedDepartment && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#A9C632]/15 border border-[#A9C632]/40 text-xs">
                  <span className="font-bold text-[#1D2E1B] dark:text-[#A9C632]">
                    Filtered by Department: {selectedDepartment}
                  </span>
                  <button
                    onClick={() => setSelectedDepartment(null)}
                    className="text-xs font-bold underline hover:text-[#1D2E1B] cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}

              {selectedBranch && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2.5 rounded-xl bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] border border-[#A9C632] text-xs shadow-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {isBranchFallback 
                      ? `Viewing all ${data?.name || "company"} positions (Eligible for ${selectedBranch} / Remote candidates)`
                      : `Branch Filter: ${selectedBranch}`}
                  </span>
                  <button
                    onClick={() => setSelectedBranch(null)}
                    className="text-xs font-bold underline cursor-pointer hover:opacity-80 shrink-0 self-end sm:self-auto"
                  >
                    Show All Locations
                  </button>
                </div>
              )}

              {sortedJobs.length > 0 ? (
                <div className="space-y-3">
                  {sortedJobs.map((job: any) => {
                    const isTracked = appliedJobIds.has(job.id);
                    const isSaved = savedJobIds.has(job.id);
                    const isHighlighted = highlightJobTitle && job.title.toLowerCase().includes(highlightJobTitle.toLowerCase());

                    return (
                      <div
                        key={job.id}
                        className={`p-4 rounded-2xl border transition-all space-y-3 ${
                          isHighlighted
                            ? "bg-[#A9C632]/10 border-[#A9C632] ring-2 ring-[#A9C632]/30 shadow-xs"
                            : isDarkMode
                            ? "bg-[#243822] border-[#3D543A] hover:border-[#A9C632]/60"
                            : "bg-white border-[#C8D2A6] hover:border-[#A9C632] shadow-xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-sm text-[#1D2E1B] dark:text-white leading-snug">
                                {job.title}
                              </h4>
                              {isHighlighted && (
                                <span className="text-[10px] font-bold bg-[#A9C632] text-[#1D2E1B] px-1.5 py-0.2 rounded">
                                  Matched Query
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#546E50] dark:text-[#C8D2A6] font-medium">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#A9C632]" />
                                {job.location_text || "San Francisco, CA"}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 font-mono text-[#546E50] dark:text-[#C8D2A6]">
                                <Clock className="w-3 h-3 text-[#A9C632]" />
                                <span>{formatRelativeTime(job.posted_at || (data as any)?.latestPostDate || (data as any)?.updated_at)}</span>
                              </span>
                              {job.salary_range && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 text-[#A9C632] font-semibold">
                                    <DollarSign className="w-3 h-3" />
                                    {job.salary_range}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Bookmark Save Button */}
                          <button
                            onClick={() => handleToggleSave(job)}
                            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                              isSaved
                                ? "bg-[#A9C632] text-[#1D2E1B] border-[#A9C632]"
                                : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 border-[#C8D2A6] dark:border-[#3D543A]"
                            }`}
                            title={isSaved ? "Saved to Tracker" : "Save Job"}
                          >
                            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-black/[0.05] dark:border-white/[0.06]">
                          <a
                            href={resolveExactJobApplyUrl({
                              companyName: data.name,
                              websiteUrl: data.website_url,
                              applyUrl: job.apply_url,
                              jobTitle: job.title,
                            })}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => handleTrackApplication(job)}
                            className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                              isTracked
                                ? "bg-[#2D442A] text-[#A9C632] border border-[#A9C632]/50"
                                : "bg-[#1D2E1B] text-white hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B]"
                            }`}
                          >
                            <span>{isTracked ? "Applied & Tracked" : "Apply Directly"}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Flag / Report Role */}
                          <button
                            onClick={() => {
                              setReportingJob({ id: job.id, title: job.title });
                              setShowReportModal(true);
                            }}
                            className="p-2 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A] hover:border-red-500/50 hover:bg-red-500/10 text-[#546E50] hover:text-red-500 dark:text-[#C8D2A6] dark:hover:text-red-400 transition-colors cursor-pointer"
                            title="Report or flag this role"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() =>
                              setOutreachModalState({
                                isOpen: true,
                                jobTitle: job.title,
                                recipientEmail: data.contact_email || `recruiting@${new URL(data.website_url).hostname.replace("www.", "")}`,
                                hrName: data.hrLeads?.[0]?.name || "Talent Partner",
                              })
                            }
                            className="px-3.5 py-2 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-[#A9C632]/10 hover:border-[#A9C632] text-xs font-bold text-[#1D2E1B] dark:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Generate AI Outreach Email"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#A9C632]" />
                            <span>Outreach</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center border rounded-2xl border-dashed border-[#C8D2A6] dark:border-[#3D543A] text-gray-400">
                  <p className="text-xs font-semibold">No open roles found in this category.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── 3. FLOATING SCROLL JUMP PILL DOCKED AT BOTTOM CENTER ─── */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center p-1 rounded-full bg-white/90 dark:bg-[#1D2E1B]/95 backdrop-blur-xl border border-[#C8D2A6] dark:border-[#3D543A] shadow-xl">
            <button
              onClick={scrollToOverview}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeSection === "overview"
                  ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-md scale-102"
                  : "text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={scrollToJobs}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeSection === "jobs"
                  ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-md scale-102"
                  : "text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>
                Open Roles ({(data.jobs?.length || intel.openPositionsCount) > 99 ? "99+" : (data.jobs?.length || intel.openPositionsCount)})
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Direct Email Outreach Modal */}
      {data && (
        <EmailOutreachModal
          isOpen={outreachModalState.isOpen}
          onClose={() => setOutreachModalState({ ...outreachModalState, isOpen: false })}
          companyName={data.name}
          jobTitle={outreachModalState.jobTitle}
          recipientEmail={outreachModalState.recipientEmail}
          hrName={outreachModalState.hrName}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Report / Flag Company Modal */}
      {data && (
        <ReportCompanyModal
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setReportingJob(null);
          }}
          companyId={data.id}
          companyName={data.name}
          companyLogo={data.logo_url}
          jobTitle={reportingJob?.title}
          jobId={reportingJob?.id}
          isDarkMode={isDarkMode}
        />
      )}
    </motion.div>
  );
}
