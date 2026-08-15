"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getCompanyWithJobs, trackJobApplication, toggleSaveJob, getAppliedJobs } from "@/app/actions";
import EmailOutreachModal from "./EmailOutreachModal";
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
  Briefcase,
  Minus,
  Maximize2,
  GripHorizontal,
  Flag
} from "lucide-react";
import ReportCompanyModal from "./ReportCompanyModal";

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

type CompanyDetails = Awaited<ReturnType<typeof getCompanyWithJobs>>;

export default function DraggableCompanyCard({
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
  const [isMinimized, setIsMinimized] = useState(false);

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
        console.error("Failed to load draggable card data", err);
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

  const handleTrackApplication = async (job: any) => {
    if (!data) return;
    setAppliedJobIds((prev) => new Set([...prev, job.id]));

    await trackJobApplication({
      job_id: job.id,
      company_id: data.id,
      job_title: job.title,
      company_name: data.name,
      company_logo: data.logo_url,
      location_text: job.location_text,
      salary_range: job.salary_range,
      apply_url: job.apply_url || data.website_url,
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

    toggleSaveJob({
      job_id: job.id,
      company_id: data.id,
      job_title: job.title,
      company_name: data.name,
      company_logo: data.logo_url,
      location_text: job.location_text,
      salary_range: job.salary_range,
      apply_url: job.apply_url || data.website_url,
    }).catch(console.error);

    if (onApplicationTracked) onApplicationTracked();
  };

  const sortedJobs = data?.jobs
    ? [...data.jobs].sort((a, b) => {
        if (!highlightJobTitle) return 0;
        const aMatch = a.title.toLowerCase().includes(highlightJobTitle.toLowerCase());
        const bMatch = b.title.toLowerCase().includes(highlightJobTitle.toLowerCase());
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      })
    : [];

  return (
    <>
      <AnimatePresence>
        {companyId && (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.08}
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed top-20 right-8 z-50 w-full sm:w-[460px] rounded-3xl shadow-2xl overflow-hidden border backdrop-blur-xl font-sans select-none flex flex-col ${
              isDarkMode
                ? "bg-[#0C100E]/95 border-white/[0.12] text-white"
                : "bg-white/95 border-gray-200 text-gray-900"
            }`}
            style={{ maxHeight: isMinimized ? "72px" : "calc(88vh - 4rem)" }}
          >
            {/* ── Tactile Draggable Grip Bar ───────────────────── */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/5 dark:bg-white/5 border-b border-black/[0.06] dark:border-white/[0.08] cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-2">
                <GripHorizontal className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-bold font-mono tracking-widest text-gray-400 uppercase">
                  Draggable Inspector
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title={isMinimized ? "Expand Card" : "Minimize Card"}
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                  title="Close Card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-16 flex flex-col justify-center items-center gap-3">
                <div className="w-7 h-7 border-2 border-[#4E9B78] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-400 font-mono">Loading company data...</span>
              </div>
            ) : data ? (
              <>
                {/* Header Top Profile */}
                <div className="p-5 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 p-1.5 shadow-xs">
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
                        <Building2 className="w-6 h-6 text-[#4E9B78]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold font-space-grotesk tracking-tight truncate">
                          {data.name}
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4E9B78]/15 text-[#306C52] dark:text-[#8EAFA0] border border-[#4E9B78]/25 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                      <a
                        href={data.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#4E9B78] hover:underline flex items-center gap-1 font-mono font-semibold"
                      >
                        {new URL(data.website_url).hostname.replace("www.", "")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {!isMinimized && (
                    <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                      <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08]">
                        <span className="text-[9px] text-gray-400 uppercase font-mono block">Founded</span>
                        <span className="font-bold flex items-center gap-1 mt-0.5 text-[11px]">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {data.founded_year || "2018"}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08]">
                        <span className="text-[9px] text-gray-400 uppercase font-mono block">Team Size</span>
                        <span className="font-bold flex items-center gap-1 mt-0.5 text-[11px]">
                          <Users className="w-3 h-3 text-gray-400" />
                          {data.company_size || "100-500"}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08]">
                        <span className="text-[9px] text-gray-400 uppercase font-mono block">Open Roles</span>
                        <span className="font-bold text-[#4E9B78] flex items-center gap-1 mt-0.5 text-[11px]">
                          <Briefcase className="w-3 h-3 text-[#4E9B78]" />
                          {data.jobs.length} Active
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Body Content (if not minimized) */}
                {!isMinimized && (
                  <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
                    {/* Location & Contact Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-[#4E9B78] flex-shrink-0" />
                        <span>{data.location_text || "Global Headquarters"}</span>
                      </div>
                      {data.contact_email && (
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="font-mono text-[11px]">{data.contact_email}</span>
                        </div>
                      )}
                      {data.contact_phone && (
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="font-mono text-[11px]">{data.contact_phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    {data.description && (
                      <p className="leading-relaxed text-gray-600 dark:text-gray-300 bg-black/[0.02] dark:bg-white/[0.03] p-3 rounded-2xl border border-black/[0.05] dark:border-white/[0.06]">
                        {data.description}
                      </p>
                    )}

                    {/* Founders with LinkedIn */}
                    {data.founders && data.founders.length > 0 && (
                      <div>
                        <h3 className="font-bold uppercase tracking-wider text-[10px] mb-2 font-mono text-gray-400">
                          Leadership & Founders
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {data.founders.map((founder: any, i: number) => (
                            <div
                              key={i}
                              className="p-2.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={founder.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"}
                                  alt={founder.name}
                                  className="w-7 h-7 rounded-full object-cover border border-gray-300 dark:border-white/10"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold truncate text-[11px]">{founder.name}</p>
                                  <p className="text-[10px] text-gray-400 truncate">{founder.role}</p>
                                </div>
                              </div>
                              {founder.linkedin_url && (
                                <a
                                  href={founder.linkedin_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#0A66C2] hover:text-[#004182] p-1 rounded-lg hover:bg-blue-500/10 transition-colors"
                                  title="View LinkedIn Profile"
                                >
                                  <LinkedinIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* HR Leads with LinkedIn */}
                    {data.hrLeads && data.hrLeads.length > 0 && (
                      <div>
                        <h3 className="font-bold uppercase tracking-wider text-[10px] mb-2 font-mono text-gray-400">
                          Talent & Recruiting Team
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {data.hrLeads.map((hr: any, i: number) => (
                            <div
                              key={i}
                              className="p-2.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={hr.avatar_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80"}
                                  alt={hr.name}
                                  className="w-7 h-7 rounded-full object-cover border border-gray-300 dark:border-white/10"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold truncate text-[11px]">{hr.name}</p>
                                  <p className="text-[10px] text-gray-400 truncate">{hr.role}</p>
                                </div>
                              </div>
                              {hr.linkedin_url && (
                                <a
                                  href={hr.linkedin_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#0A66C2] hover:text-[#004182] p-1 rounded-lg hover:bg-blue-500/10 transition-colors"
                                  title="Connect on LinkedIn"
                                >
                                  <LinkedinIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Open Roles */}
                    <div>
                      <h3 className="font-bold uppercase tracking-wider text-[10px] mb-2 font-mono text-gray-400">
                        Open Vacancies ({data.jobs.length})
                      </h3>

                      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                        {sortedJobs.map((job) => {
                          const isTracked = appliedJobIds.has(job.id);
                          const isSaved = savedJobIds.has(job.id);
                          const isHighlighted = highlightJobTitle && job.title.toLowerCase().includes(highlightJobTitle.toLowerCase());

                          return (
                            <div
                              key={job.id}
                              className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                                isHighlighted
                                  ? "bg-[#4E9B78]/10 border-[#4E9B78] ring-2 ring-[#4E9B78]/25"
                                  : "bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.05] dark:border-white/[0.06]"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-xs font-space-grotesk">{job.title}</h4>
                                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
                                    <span>{job.location_text}</span>
                                    {job.salary_range && (
                                      <>
                                        <span>·</span>
                                        <span className="font-bold font-mono text-gray-800 dark:text-gray-200">
                                          {job.salary_range}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleToggleSave(job)}
                                  className={`p-1.5 rounded-xl border transition-colors ${
                                    isSaved
                                      ? "bg-[#4E9B78] text-white border-[#4E9B78]"
                                      : "bg-black/5 dark:bg-white/5 border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                  }`}
                                  title={isSaved ? "Saved" : "Save Job"}
                                >
                                  {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                                </button>
                              </div>

                              <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed line-clamp-2">
                                {job.full_description || job.description}
                              </p>

                              <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center gap-1.5">
                                {job.apply_url && (
                                  <a
                                    href={job.apply_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 py-1.5 px-3 bg-[#4E9B78] hover:bg-[#3D8565] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs"
                                  >
                                    <span>Apply</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}

                                <button
                                  onClick={() =>
                                    setOutreachModalState({
                                      isOpen: true,
                                      jobTitle: job.title,
                                      recipientEmail: data.contact_email || undefined,
                                      hrName: data.hrLeads?.[0]?.name || undefined,
                                    })
                                  }
                                  className="py-1.5 px-2.5 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors flex items-center gap-1"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Email</span>
                                </button>

                                {/* Flag / Report Role */}
                                <button
                                  onClick={() => {
                                    setReportingJob({ id: job.id, title: job.title });
                                    setShowReportModal(true);
                                  }}
                                  className="py-1.5 px-2.5 rounded-xl text-xs font-semibold border border-transparent hover:border-red-500/50 hover:bg-red-500/10 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors flex items-center justify-center cursor-pointer"
                                  title="Report or flag this role"
                                >
                                  <Flag className="w-3 h-3" />
                                </button>

                                <button
                                  onClick={() => handleTrackApplication(job)}
                                  disabled={isTracked}
                                  className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                                    isTracked
                                      ? "bg-green-500/15 text-[#4E9B78] border-green-500/30"
                                      : "bg-black/5 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-300"
                                  }`}
                                >
                                  {isTracked ? (
                                    <>
                                      <BookmarkCheck className="w-3 h-3 text-[#4E9B78]" />
                                      <span>Tracked</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3 h-3" />
                                      <span>Track</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Outreach Modal */}
      <EmailOutreachModal
        isOpen={outreachModalState.isOpen}
        onClose={() => setOutreachModalState((prev) => ({ ...prev, isOpen: false }))}
        companyName={data?.name || "Company"}
        jobTitle={outreachModalState.jobTitle}
        recipientEmail={outreachModalState.recipientEmail}
        hrName={outreachModalState.hrName}
        isDarkMode={isDarkMode}
      />

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
    </>
  );
}
