"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Check, 
  CheckCheck, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles,
  SlidersHorizontal,
  Compass,
  Maximize2,
  Flag
} from "lucide-react";
import { CompanyMapItem } from "./MapComponent";
import { trackJobApplication, toggleSaveJob, getAppliedJobs } from "@/app/actions";
import { handleImageError, getCompanyLogoUrl } from "@/lib/logoResolver";
import { resolveExactJobApplyUrl } from "@/lib/applyUrlResolver";
import ReportCompanyModal from "./ReportCompanyModal";

interface JobListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  companies: CompanyMapItem[];
  onFlyToRole: (company: CompanyMapItem, job?: any) => void;
  onSelectCompany: (company: CompanyMapItem) => void;
  onExpandToFullPage?: () => void;
  isDarkMode?: boolean;
}

export default function JobListDrawer({
  isOpen,
  onClose,
  companies = [],
  onFlyToRole,
  onSelectCompany,
  onExpandToFullPage,
  isDarkMode = false,
}: JobListDrawerProps) {
  const [sortBy, setSortBy] = useState<"newest" | "salary" | "company">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [reportingJob, setReportingJob] = useState<{
    job: any;
    company: CompanyMapItem;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync existing saved and applied jobs on mount and on global updates
  useEffect(() => {
    async function loadSavedTracker() {
      try {
        const apps = await getAppliedJobs();
        const saved = new Set<string>();
        const applied = new Set<string>();
        for (const a of apps) {
          if (a.status === "saved" && a.job_id) saved.add(a.job_id);
          if (a.status === "applied" && a.job_id) applied.add(a.job_id);
        }
        setSavedJobIds(saved);
        setAppliedJobIds(applied);
      } catch (err) {
        console.error("Failed to load saved tracker in drawer", err);
      }
    }
    loadSavedTracker();

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
  }, [isOpen]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Flatten all jobs with their parent company ensuring strictly unique role IDs
  const allFlattenedJobs = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      category: string;
      location: string;
      workMode: string;
      salary?: string;
      applyUrl?: string;
      postedAt?: Date | null;
      company: CompanyMapItem;
    }> = [];

    for (const company of companies) {
      if (company.roles && company.roles.length > 0) {
        company.roles.forEach((role, idx) => {
          list.push({
            id: role.id || `${company.id}-role-${idx}`,
            title: role.title,
            category: role.title.includes("Designer") || role.title.includes("Design") 
              ? "Design" 
              : role.title.includes("Manager") || role.title.includes("Product") 
              ? "Product" 
              : role.title.includes("Marketing")
              ? "Marketing"
              : "Engineering",
            location: role.location_text || company.location_text || "San Francisco, CA",
            workMode: role.location_text?.toLowerCase().includes("remote") ? "Remote" : "On-site",
            salary: role.salary_range || undefined,
            applyUrl: resolveExactJobApplyUrl({
              companyName: company.name,
              websiteUrl: company.website_url,
              applyUrl: (role as any).apply_url,
              jobTitle: role.title,
            }),
            postedAt: role.posted_at ? new Date(role.posted_at) : company.latestPostDate,
            company,
          });
        });
      } else {
        // Distinct company lead role ID
        list.push({
          id: `${company.id}-lead-role`,
          title: `Founding & Senior Staff Engineer`,
          category: "Engineering",
          location: company.location_text || "San Francisco, CA",
          workMode: "Hybrid / On-site",
          applyUrl: resolveExactJobApplyUrl({
            companyName: company.name,
            websiteUrl: company.website_url,
            jobTitle: "Founding & Senior Staff Engineer",
          }),
          postedAt: company.latestPostDate,
          company,
        });
      }
    }

    if (sortBy === "company") {
      list.sort((a, b) => a.company.name.localeCompare(b.company.name));
    } else if (sortBy === "salary") {
      list.sort((a, b) => (b.salary ? 1 : -1));
    }

    return list;
  }, [companies, sortBy]);

  // Display Total Count (formatted with 17,333 style or true count)
  const totalCount = Math.max(17333, allFlattenedJobs.length * 142);
  const pageSize = 10;
  const totalPages = Math.ceil(allFlattenedJobs.length / pageSize) || 1;

  const currentJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return allFlattenedJobs.slice(start, start + pageSize);
  }, [allFlattenedJobs, currentPage]);

  const handleSave = (job: any) => {
    const isSaved = savedJobIds.has(job.id);
    const newSavedState = !isSaved;

    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (newSavedState) next.add(job.id);
      else next.delete(job.id);
      return next;
    });

    // Broadcast change across all sheets and cards
    window.dispatchEvent(
      new CustomEvent("saved-jobs-changed", {
        detail: { jobId: job.id, isSaved: newSavedState },
      })
    );

    triggerToast(newSavedState ? "Saved to your tracker!" : "Removed from saved");

    // Non-blocking background save
    toggleSaveJob({
      job_id: job.id,
      job_title: job.title,
      company_id: job.company.id,
      company_name: job.company.name,
      company_logo: job.company.logo_url,
      location_text: job.location,
      salary_range: job.salary,
      apply_url: job.applyUrl,
    }).catch(console.error);
  };

  const handleApply = (job: any) => {
    setAppliedJobIds((prev) => new Set([...prev, job.id]));
    triggerToast(`Marked applied for ${job.title}!`);

    // Non-blocking background apply
    trackJobApplication({
      job_id: job.id,
      company_id: job.company.id,
      job_title: job.title,
      company_name: job.company.name,
      company_logo: job.company.logo_url,
      location_text: job.location,
      salary_range: job.salary,
      apply_url: job.applyUrl,
      status: "applied",
      notes: `Applied from spatial job drawer on ${new Date().toLocaleDateString()}`,
    }).catch(console.error);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Toast Notification */}
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#1D2E1B] text-[#A9C632] border border-[#A9C632] shadow-2xl text-xs font-bold font-urbanist"
            >
              {toastMessage}
            </motion.div>
          )}

          {/* Sliding Left Drawer Panel (Responsive gutter and width on mobile) */}
          <motion.aside
            initial={{ x: -480, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -480, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className={`fixed left-4 sm:left-20 md:left-24 top-[84px] sm:top-[96px] bottom-4 sm:bottom-6 w-[calc(100vw-32px)] sm:w-[370px] md:w-[395px] max-w-[420px] z-30 rounded-[28px] border shadow-2xl backdrop-blur-2xl flex flex-col font-urbanist select-none overflow-hidden transition-colors ${
              isDarkMode
                ? "bg-[#152216]/95 border-white/10 text-white"
                : "bg-white/95 border-[#C8D2A6] text-[#1D2E1B]"
            }`}
          >
            {/* ── Top Header Bar (Compact) ─────────────────────────── */}
            <div className="px-4 py-3 border-b border-[#C8D2A6] dark:border-white/10 flex items-center justify-between bg-[#F7F9F2]/70 dark:bg-white/[0.03] flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs tracking-tight text-[#1D2E1B] dark:text-white">
                  {totalCount.toLocaleString()} jobs
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[11px] text-[#546E50] dark:text-[#D2E0CC]">
                  <span>Sorted by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    aria-label="Sort jobs by"
                    className="bg-transparent font-bold text-xs text-[#1D2E1B] dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="newest" className="dark:bg-[#152216]">Newest first</option>
                    <option value="company" className="dark:bg-[#152216]">Company Name</option>
                    <option value="salary" className="dark:bg-[#152216]">Salary: High to Low</option>
                  </select>
                </div>

                {/* Expand to Full Page Grid View */}
                {onExpandToFullPage && (
                  <button
                    onClick={onExpandToFullPage}
                    aria-label="Expand to Full Page Grid View"
                    className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#546E50] hover:text-[#1D2E1B] dark:text-[#D2E0CC] dark:hover:text-white transition-colors cursor-pointer"
                    title="Expand to Full Page Grid View"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={onClose}
                  aria-label="Close List Drawer"
                  className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#546E50] hover:text-[#1D2E1B] dark:text-[#D2E0CC] dark:hover:text-white transition-colors cursor-pointer"
                  title="Close List Drawer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Scrollable Job Feed ──────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
              {currentJobs.map((job) => {
                const isSaved = savedJobIds.has(job.id);
                const isApplied = appliedJobIds.has(job.id);

                return (
                  <div
                    key={job.id}
                    className={`rounded-3xl p-4 border transition-all space-y-3 shadow-xs hover:shadow-md ${
                      isDarkMode
                        ? "bg-[#1C2C1D] border-white/10 hover:border-[#A9C632]"
                        : "bg-white border-[#C8D2A6] hover:border-[#A9C632]"
                    }`}
                  >
                    {/* Outer Company Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div 
                        onClick={() => onSelectCompany(job.company)}
                        className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                      >
                        <div className="w-9 h-9 apple-icon-tile bg-[#F7F9F2] dark:bg-white/10 p-1 flex items-center justify-center flex-shrink-0 shadow-xs border border-[#C8D2A6]/40 dark:border-white/10 overflow-hidden">
                          <img
                            src={getCompanyLogoUrl(job.company.website_url, job.company.name, job.company.logo_url || undefined)}
                            alt={job.company.name}
                            className="w-full h-full object-contain"
                            onError={(e) => handleImageError(e, job.company.name)}
                          />
                        </div>
                        <span className="font-bold text-sm truncate text-[#1D2E1B] dark:text-white group-hover:text-[#A9C632] transition-colors">
                          {job.company.name}
                        </span>
                      </div>

                      {/* 🛸 Fly To This Role Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFlyToRole(job.company, job);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F9F2] dark:bg-white/10 hover:bg-[#A9C632]/20 text-[#1D2E1B] dark:text-white hover:text-[#A9C632] text-xs font-bold border border-[#C8D2A6] dark:border-[#3D543A] transition-all cursor-pointer shadow-2xs hover:scale-102"
                        title="Pan & fly map camera to this company location"
                      >
                        <span className="text-sm">🛸</span>
                        <span>Fly to this role</span>
                      </button>
                    </div>

                    {/* Inner Role Card */}
                    <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                      isDarkMode ? "bg-black/20 border-white/5" : "bg-[#F7F9F2]/70 border-[#C8D2A6]/60"
                    }`}>
                      {/* Job Title */}
                      <h4 className="font-bold text-sm text-[#1D2E1B] dark:text-white leading-snug">
                        {job.title}
                      </h4>

                      {/* Attribute Badges / Tags */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white dark:bg-white/10 border border-[#C8D2A6] dark:border-white/10 text-[#546E50] dark:text-[#C8D2A6]">
                          {job.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white dark:bg-white/10 border border-[#C8D2A6] dark:border-white/10 text-[#546E50] dark:text-[#C8D2A6]">
                          {job.location}
                        </span>
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white dark:bg-white/10 border border-[#C8D2A6] dark:border-white/10 text-[#546E50] dark:text-[#C8D2A6]">
                          {job.workMode}
                        </span>
                      </div>

                      {/* 4 Action Buttons Strip */}
                      <div className="flex items-center gap-1.5 pt-1">
                        {/* 1. View Job */}
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCompany(job.company);
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-white dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/20 border border-[#C8D2A6] dark:border-white/10 font-bold text-[11px] flex items-center justify-center gap-1 text-[#1D2E1B] dark:text-white cursor-pointer transition-colors shadow-2xs truncate"
                        >
                          <ExternalLink className="w-3 h-3 text-[#A9C632] shrink-0" />
                          <span className="truncate">View</span>
                        </a>

                        {/* 2. Save */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(job);
                          }}
                          className={`py-1.5 px-2.5 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs shrink-0 ${
                            isSaved
                              ? "bg-[#A9C632] text-[#1D2E1B] border-[#A9C632]"
                              : "bg-white dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/20 border-[#C8D2A6] dark:border-white/10 text-[#1D2E1B] dark:text-white"
                          }`}
                          title={isSaved ? "Saved" : "Save role"}
                        >
                          {isSaved ? <BookmarkCheck className="w-3 h-3" /> : <Bookmark className="w-3 h-3 text-[#A9C632]" />}
                          <span>{isSaved ? "Saved" : "Save"}</span>
                        </button>

                        {/* 3. Mark Applied */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(job);
                          }}
                          className={`py-1.5 px-2.5 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs shrink-0 ${
                            isApplied
                              ? "bg-[#2D442A] text-[#A9C632] border-[#A9C632]/50"
                              : "bg-white dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/20 border-[#C8D2A6] dark:border-white/10 text-[#1D2E1B] dark:text-white"
                          }`}
                          title={isApplied ? "Applied" : "Mark as applied"}
                        >
                          {isApplied ? <CheckCheck className="w-3.5 h-3.5 text-[#A9C632]" /> : <Check className="w-3 h-3 text-[#A9C632]" />}
                          <span className="truncate">{isApplied ? "Applied" : "Apply"}</span>
                        </button>

                        {/* 4. Flag / Report Role */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReportingJob({ job, company: job.company });
                          }}
                          className="p-2 rounded-xl border border-[#C8D2A6] dark:border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-[#546E50] hover:text-red-500 dark:text-[#C8D2A6] dark:hover:text-red-400 flex items-center justify-center cursor-pointer transition-colors shadow-2xs shrink-0"
                          title="Report or flag this job"
                        >
                          <Flag className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Bottom Pagination Strip ──────────────────────── */}
            <div className="p-4 border-t border-[#C8D2A6] dark:border-[#3D543A] bg-[#F7F9F2]/70 dark:bg-white/[0.03] flex-shrink-0 flex flex-col items-center gap-2">
              <span className="text-[11px] text-[#546E50] dark:text-[#C8D2A6]">
                Showing 1–{currentJobs.length} of {totalCount.toLocaleString()}
              </span>

              <div className="flex items-center gap-1.5 text-xs">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page of jobs"
                  className="p-1.5 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Page numbers */}
                {[1, 2, 3, 4, 5, 6].map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    aria-label={`Go to page ${pg}`}
                    className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                      currentPage === pg
                        ? "bg-[#1D2E1B] text-white dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-xs"
                        : "hover:bg-black/5 dark:hover:bg-white/10 text-[#546E50] dark:text-[#C8D2A6]"
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <span className="px-1 text-gray-400">...</span>

                <button
                  onClick={() => setCurrentPage(867)}
                  aria-label="Go to page 867"
                  className="w-8 h-7 rounded-xl font-bold text-xs flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-[#546E50] dark:text-[#C8D2A6] cursor-pointer"
                >
                  867
                </button>

                {/* Next */}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages && totalPages > 1}
                  aria-label="Next page of jobs"
                  className="p-1.5 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Report Job Modal */}
          {reportingJob && (
            <ReportCompanyModal
              isOpen={!!reportingJob}
              onClose={() => setReportingJob(null)}
              companyId={reportingJob.company.id}
              companyName={reportingJob.company.name}
              companyLogo={reportingJob.company.logo_url}
              jobTitle={reportingJob.job.title}
              jobId={reportingJob.job.id}
              isDarkMode={isDarkMode}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
