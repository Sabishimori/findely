"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getCompanyWithJobs, trackJobApplication, toggleSaveJob, getAppliedJobs } from "@/app/actions";
import { getCompanyIntelligence, CompanyIntelligence } from "@/lib/companyIntelligence";
import { resolveExactJobApplyUrl, resolveFounderLinkedinUrl, resolveCompanyLinkedinUrl } from "@/lib/applyUrlResolver";
import EmailOutreachModal from "./EmailOutreachModal";
import ReportCompanyModal from "./ReportCompanyModal";
import { 
  X, 
  ExternalLink, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  Building2, 
  Bookmark,
  BookmarkCheck,
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  Sparkles,
  ChevronRight,
  Briefcase,
  DollarSign,
  Share2,
  FileText,
  TrendingUp,
  Landmark,
  BarChart3,
  Check,
  ChevronDown,
  ChevronUp,
  Flag
} from "lucide-react";

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

type CompanyDetails = Awaited<ReturnType<typeof getCompanyWithJobs>>;

export default function CompanySheet({ 
  companyId, 
  onClose,
  onApplicationTracked,
  highlightJobTitle,
  isDarkMode = false,
}: { 
  companyId: string; 
  onClose: () => void;
  onApplicationTracked?: () => void;
  highlightJobTitle?: string;
  isDarkMode?: boolean;
}) {
  const [data, setData] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"details" | "jobs">("details");
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

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

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [res, trackerApps] = await Promise.all([
          getCompanyWithJobs(companyId),
          getAppliedJobs(),
        ]);
        setData(res);

        const saved = new Set<string>();
        const applied = new Set<string>();
        for (const a of trackerApps) {
          if (a.status === "saved" && a.job_id) saved.add(a.job_id);
          if (a.status === "applied" && a.job_id) applied.add(a.job_id);
        }
        setSavedJobIds(saved);
        setAppliedJobIds(applied);
      } catch (err) {
        console.error("Failed to load company sheet data", err);
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

  const handleTrackApplication = (job: any) => {
    if (!data) return;
    setAppliedJobIds((prev) => new Set([...prev, job.id]));

    const directUrl = resolveExactJobApplyUrl({
      companyName: data.name,
      websiteUrl: data.website_url,
      applyUrl: job.apply_url,
      jobTitle: job.title,
    });

    trackJobApplication({
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
    }).catch(console.error);

    if (onApplicationTracked) onApplicationTracked();
  };

  const handleToggleSave = (job: any) => {
    if (!data) return;
    const isSaved = savedJobIds.has(job.id);
    const newSavedState = !isSaved;

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

  const rawJobs = data?.jobs || [];
  const filteredJobs = rawJobs.filter((job: any) => {
    if (!selectedDepartment) return true;
    return (
      job.title.toLowerCase().includes(selectedDepartment.toLowerCase()) ||
      (job.location_text && job.location_text.toLowerCase().includes(selectedDepartment.toLowerCase()))
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
    <>
      <AnimatePresence>
        {companyId && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className={`fixed inset-y-0 right-0 w-full sm:w-[500px] border-l shadow-2xl z-50 flex flex-col font-urbanist select-none overflow-hidden ${
              isDarkMode 
                ? "bg-[#152216] border-white/10 text-white" 
                : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
            }`}
          >
            {loading ? (
              <div className="p-20 flex flex-col justify-center items-center gap-3 flex-1">
                <div className="w-8 h-8 border-2 border-[#A9C632] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-[#546E50] dark:text-[#D2E0CC]">Loading company intelligence...</span>
              </div>
            ) : data && intel ? (
              <div className="relative flex-1 overflow-hidden flex flex-col">
                
                {/* Top Right Action Buttons */}
                <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5">
                  <button
                    onClick={() => setShowReportModal(true)}
                    aria-label="Report or flag this company"
                    className="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-red-500/10 text-[#546E50] hover:text-red-500 dark:text-[#D2E0CC] dark:hover:text-red-400 transition-colors cursor-pointer"
                    title="Report or flag this company"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    aria-label="Close company drawer"
                    className="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[#546E50] hover:text-[#1D2E1B] dark:text-[#D2E0CC] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable Container with padding bottom for floating pill */}
                <div className="flex-1 overflow-y-auto pb-24 flex flex-col">
                  {/* Header Top Profile Section */}
                  <div className="p-6 border-b border-[#C8D2A6] dark:border-white/10 bg-[#F7F9F2]/70 dark:bg-white/[0.02]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/10 border border-[#C8D2A6] dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 p-2 shadow-xs">
                          {data.logo_url ? (
                            <img
                              src={data.logo_url}
                              alt={data.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <Building2 className="w-7 h-7 text-[#A9C632]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold tracking-tight">
                              {data.name}
                            </h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/40 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-[#A9C632]" />
                              Verified
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {data.website_url && (
                              <a
                                href={data.website_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-[#546E50] hover:text-[#1D2E1B] dark:text-[#C8D2A6] dark:hover:text-[#A9C632] flex items-center gap-1 font-semibold transition-colors"
                              >
                                <span>{new URL(data.website_url).hostname.replace("www.", "")}</span>
                                <ExternalLink className="w-3 h-3 text-[#A9C632]" />
                              </a>
                            )}
                            <span className="text-[#C8D2A6] dark:text-white/20">•</span>
                            <a
                              href={resolveCompanyLinkedinUrl(data.name, data.website_url)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-[#0A66C2] hover:text-[#004182] dark:text-[#70B5F9] dark:hover:text-white flex items-center gap-1 font-semibold transition-colors"
                              title="View Company LinkedIn"
                            >
                              <LinkedinIcon className="w-3.5 h-3.5" />
                              <span>LinkedIn</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Quick Attributes Ribbon */}
                    <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
                      <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A]">
                        <span className="text-[9px] text-[#546E50] dark:text-[#C8D2A6] uppercase font-bold block">Founded</span>
                        <span className="font-bold text-xs mt-0.5 block">{intel.founded}</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A]">
                        <span className="text-[9px] text-[#546E50] dark:text-[#C8D2A6] uppercase font-bold block">Work Mode</span>
                        <span className="font-bold text-xs mt-0.5 block truncate">{intel.workMode}</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A]">
                        <span className="text-[9px] text-[#546E50] dark:text-[#C8D2A6] uppercase font-bold block">Team Size</span>
                        <span className="font-bold text-xs mt-0.5 block truncate">{intel.teamSize}</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A]">
                        <span className="text-[9px] text-[#546E50] dark:text-[#C8D2A6] uppercase font-bold block">Open Roles</span>
                        <span className="font-bold text-[#A9C632] text-xs mt-0.5 block">{data.jobs?.length || intel.openPositionsCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* ── TAB 1: DETAILS ── */}
                  {activeTab === "details" ? (
                    <div className="p-6 space-y-5 text-xs">
                      {/* Leadership & Founders Section with LinkedIn */}
                      {data.founders && data.founders.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-bold uppercase tracking-wider text-[11px] text-[#1D2E1B] dark:text-white">
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

                      {/* Industry & Model */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-bold mr-1">Industry:</span>
                          {intel.industry.map((ind, i) => (
                            <span key={i} className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#A9C632]/15 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/30">
                              {ind}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-bold mr-1">Business Model:</span>
                          {intel.businessModel.map((model, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/[0.04] dark:bg-white/[0.08] text-[#546E50] dark:text-[#C8D2A6] border border-[#C8D2A6] dark:border-[#3D543A]">
                              {model}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* About Description */}
                      <div className="space-y-1.5">
                        <h3 className="font-bold uppercase tracking-wider text-[11px]">About</h3>
                        <p className="leading-relaxed text-[#2D442A] dark:text-[#C8D2A6] bg-[#F7F9F2] dark:bg-white/[0.03] p-3.5 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A]">
                          {intel.about}
                        </p>
                      </div>

                      {/* Financial Metrics */}
                      <div className="space-y-2">
                        <h3 className="font-bold uppercase tracking-wider text-[11px]">Funding & Valuation</h3>
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="p-3 bg-[#F7F9F2] dark:bg-white/[0.03] rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A]">
                            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                              <TrendingUp className="w-3.5 h-3.5 text-[#A9C632]" />
                              <span className="text-[10px] uppercase font-bold text-[#546E50] dark:text-[#C8D2A6]">Stage</span>
                            </div>
                            <span className="font-extrabold text-sm">{intel.fundingStage}</span>
                          </div>

                          <div className="p-3 bg-[#F7F9F2] dark:bg-white/[0.03] rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A]">
                            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                              <Landmark className="w-3.5 h-3.5 text-[#A9C632]" />
                              <span className="text-[10px] uppercase font-bold text-[#546E50] dark:text-[#C8D2A6]">Total</span>
                            </div>
                            <span className="font-extrabold text-sm">{intel.totalFunding}</span>
                          </div>

                          <div className="p-3 bg-[#F7F9F2] dark:bg-white/[0.03] rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A]">
                            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                              <BarChart3 className="w-3.5 h-3.5 text-[#A9C632]" />
                              <span className="text-[10px] uppercase font-bold text-[#546E50] dark:text-[#C8D2A6]">Valuation</span>
                            </div>
                            <span className="font-extrabold text-sm text-[#A9C632]">{intel.valuation}</span>
                          </div>
                        </div>
                      </div>

                      {/* Key Investors */}
                      <div className="space-y-2">
                        <h3 className="font-bold uppercase tracking-wider text-[11px]">Key Investors ({intel.keyInvestors.length})</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {intel.keyInvestors.map((investor, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] shadow-2xs">
                              {investor}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Benefits (9) */}
                      <div className="space-y-2.5">
                        <h3 className="font-bold uppercase tracking-wider text-[11px]">Benefits ({intel.benefits.length})</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {intel.benefits.map((benefit, i) => (
                            <div key={i} className="p-2.5 rounded-xl bg-[#F7F9F2] dark:bg-white/[0.03] border border-[#C8D2A6] dark:border-[#3D543A] flex flex-col justify-between gap-1">
                              <span className="font-bold text-xs leading-tight">{benefit.name}</span>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-[#A9C632]">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>{benefit.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Office Network */}
                      <div className="space-y-2.5">
                        <h3 className="font-bold uppercase tracking-wider text-[11px]">
                          Office Network (i.e. hiring in {intel.totalLocationsCount} locations)
                        </h3>
                        <div className="p-3 rounded-xl bg-[#F7F9F2] dark:bg-white/[0.03] border border-[#C8D2A6] dark:border-[#3D543A] flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#A9C632] flex-shrink-0" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Office address</span>
                            <span className="text-xs font-bold">{intel.officeAddress}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          {(showAllLocations ? intel.officeNetwork : intel.officeNetwork.slice(0, 3)).map((loc, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (loc.lat && loc.lng) {
                                  window.dispatchEvent(
                                    new CustomEvent("fly-to-coords", {
                                      detail: { lat: loc.lat, lng: loc.lng, zoom: 12, pitch: 42 },
                                    })
                                  );
                                }
                              }}
                              className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-[#A9C632]/10 border border-[#C8D2A6] dark:border-[#3D543A] hover:border-[#A9C632] flex items-center justify-between shadow-2xs transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{loc.flag}</span>
                                <span className="font-semibold text-xs group-hover:text-[#A9C632] transition-colors">{loc.city}, {loc.country}</span>
                                {loc.isHQ && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/40">
                                    HQ
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] font-bold text-[#546E50] dark:text-[#C8D2A6]">({loc.jobs} jobs)</span>
                                <MapPin className="w-3 h-3 text-[#A9C632] opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </button>
                          ))}

                          {intel.officeNetwork.length > 3 && (
                            <button
                              onClick={() => setShowAllLocations(!showAllLocations)}
                              className="w-full py-2 rounded-xl border border-dashed border-[#A9C632]/50 hover:bg-[#A9C632]/10 text-xs font-bold text-[#A9C632] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              {showAllLocations ? (
                                <><span>Show less</span><ChevronUp className="w-3.5 h-3.5" /></>
                              ) : (
                                <><span>Show all {intel.totalLocationsCount} locations</span><ChevronDown className="w-3.5 h-3.5" /></>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Departments */}
                      <div className="space-y-2">
                        <h3 className="font-bold uppercase tracking-wider text-[11px]">Departments ({intel.departments.length})</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {intel.departments.map((dept, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setSelectedDepartment(dept);
                                setActiveTab("jobs");
                              }}
                              className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-black/[0.03] dark:bg-white/[0.05] hover:bg-[#A9C632]/20 hover:border-[#A9C632] border border-[#C8D2A6] dark:border-[#3D543A] transition-colors cursor-pointer"
                            >
                              {dept}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Report / Flag Company Section */}
                      <div className="pt-4 border-t border-[#C8D2A6] dark:border-[#3D543A] flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-[#1D2E1B] dark:text-white">Flag or Report Company</p>
                          <p className="text-[10px] text-[#546E50] dark:text-[#C8D2A6]">Report expired roles, fake info, or suspicious links</p>
                        </div>
                        <button
                          onClick={() => setShowReportModal(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 hover:border-red-500/60 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-bold text-[11px] transition-colors cursor-pointer shrink-0"
                        >
                          <Flag className="w-3 h-3" />
                          <span>Report</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── TAB 2: JOBS ── */
                    <div className="p-6 space-y-4 text-xs">
                      {selectedDepartment && (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#A9C632]/15 border border-[#A9C632]/40 text-xs">
                          <span className="font-bold text-[#1D2E1B] dark:text-[#A9C632]">
                            Filtered by: {selectedDepartment}
                          </span>
                          <button
                            onClick={() => setSelectedDepartment(null)}
                            className="text-xs font-bold underline hover:text-[#1D2E1B] cursor-pointer"
                          >
                            Clear Filter
                          </button>
                        </div>
                      )}

                      <h3 className="font-bold uppercase tracking-wider text-[11px]">
                        Open positions ({sortedJobs.length || intel.openPositionsCount})
                      </h3>

                      {sortedJobs.length > 0 ? (
                        <div className="space-y-3">
                          {sortedJobs.map((job: any) => {
                            const isTracked = appliedJobIds.has(job.id);
                            return (
                              <div
                                key={job.id}
                                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                                  isDarkMode ? "bg-[#243822] border-[#3D543A]" : "bg-white border-[#C8D2A6]"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-bold text-sm leading-snug">{job.title}</h4>
                                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#546E50] dark:text-[#C8D2A6]">
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-[#A9C632]" />
                                        {job.location_text || "San Francisco, CA"}
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
                                </div>

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
                                    className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 ${
                                      isTracked
                                        ? "bg-[#2D442A] text-[#A9C632] border border-[#A9C632]/50"
                                        : "bg-[#1D2E1B] text-white hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B]"
                                    }`}
                                  >
                                    <span>{isTracked ? "Applied & Tracked" : "Apply Directly"}</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>

                                  {/* Save Job Button */}
                                  <button
                                    onClick={() => handleToggleSave(job)}
                                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                                      savedJobIds.has(job.id)
                                        ? "bg-[#A9C632]/20 border-[#A9C632] text-[#A9C632]"
                                        : "border-[#C8D2A6] dark:border-[#3D543A] hover:bg-[#A9C632]/10 text-[#546E50] dark:text-[#C8D2A6]"
                                    }`}
                                    title={savedJobIds.has(job.id) ? "Saved to tracker (Click to remove)" : "Save job"}
                                  >
                                    <Bookmark className={`w-3.5 h-3.5 ${savedJobIds.has(job.id) ? "fill-[#A9C632]" : ""}`} />
                                  </button>

                                  {/* Flag / Report Role */}
                                  <button
                                    onClick={() => {
                                      setReportingJob({ id: job.id, title: job.title });
                                      setShowReportModal(true);
                                    }}
                                    className="p-2.5 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A] hover:border-red-500/50 hover:bg-red-500/10 text-[#546E50] hover:text-red-500 dark:text-[#C8D2A6] dark:hover:text-red-400 transition-colors cursor-pointer"
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
                                    className="px-3.5 py-2 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-[#A9C632]/10 text-xs font-bold flex items-center gap-1.5"
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
                  )}
                </div>

                {/* ── 3. FLOATING PILL TOGGLE DOCKED AT BOTTOM CENTER ─────── */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center p-1 rounded-full bg-white/90 dark:bg-[#1D2E1B]/95 backdrop-blur-xl border border-[#C8D2A6] dark:border-[#3D543A] shadow-xl">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "details"
                        ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-md scale-102"
                        : "text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("jobs")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "jobs"
                        ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-md scale-102"
                        : "text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Jobs ({data.jobs?.length || intel.openPositionsCount})</span>
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
        )}
      </AnimatePresence>
    </>
  );
}
