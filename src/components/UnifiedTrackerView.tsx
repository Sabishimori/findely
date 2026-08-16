"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/authContext";
import { 
  getAppliedJobs, 
  deleteApplication, 
  updateApplicationStatus,
  updateApplicationNotes 
} from "@/app/actions";
import { 
  Bookmark, 
  Send, 
  Calendar, 
  Award, 
  ExternalLink, 
  Trash2, 
  Plus, 
  Building2, 
  MapPin, 
  Sparkles,
  ArrowUpRight,
  Clock,
  DollarSign,
  ChevronRight,
  Briefcase,
  CheckCircle2,
  X,
  FileText,
  Share2,
  Check,
  MoveHorizontal,
  Flag
} from "lucide-react";
import ReportCompanyModal from "./ReportCompanyModal";

export type ApplicationStatus = "saved" | "applied" | "interviewing" | "offered" | "rejected";

export interface ApplicationCardItem {
  id: string;
  jobId?: string | null;
  companyId?: string | null;
  jobTitle: string;
  companyName: string;
  companyLogo?: string | null;
  location?: string | null;
  salary?: string | null;
  applyUrl: string;
  status: ApplicationStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UnifiedTrackerView({
  isDarkMode = false,
}: {
  isDarkMode?: boolean;
}) {
  const { user, loginWithGoogle } = useAuth();
  const [appsList, setAppsList] = useState<ApplicationCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<"all" | ApplicationStatus>("all");
  const [selectedApp, setSelectedApp] = useState<ApplicationCardItem | null>(null);
  const [reportingJob, setReportingJob] = useState<ApplicationCardItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ApplicationStatus | null>(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getAppliedJobs();
      const mapped: ApplicationCardItem[] = data.map((item: any) => ({
        id: item.id,
        jobId: item.job_id,
        companyId: item.company_id,
        jobTitle: item.job_title,
        companyName: item.company_name,
        companyLogo: item.company_logo,
        location: item.location_text,
        salary: item.salary_range,
        applyUrl: item.apply_url || "#",
        status: (item.status as ApplicationStatus) || "saved",
        notes: item.notes,
        createdAt: item.applied_at ? new Date(item.applied_at).toLocaleDateString() : "Recent",
        updatedAt: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "Recent",
      }));
      setAppsList(mapped);
    } catch (err) {
      console.error("Failed to load applications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [user?.email]);

  const handleUpdateStatus = async (id: string, newStatus: ApplicationStatus) => {
    setAppsList((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    await updateApplicationStatus(id, newStatus);
  };

  const handleUpdateNotes = async (id: string, newNotes: string) => {
    setAppsList((prev) =>
      prev.map((app) => (app.id === id ? { ...app, notes: newNotes } : app))
    );
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp((prev) => (prev ? { ...prev, notes: newNotes } : null));
    }
    await updateApplicationNotes(id, newNotes);
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const appToDelete = appsList.find((app) => app.id === id);
    setAppsList((prev) => prev.filter((app) => app.id !== id));
    if (selectedApp?.id === id) setSelectedApp(null);

    // Broadcast inactive saved state so any open job cards deactivate immediately
    if (appToDelete?.jobId) {
      window.dispatchEvent(
        new CustomEvent("saved-jobs-changed", {
          detail: { jobId: appToDelete.jobId, isSaved: false },
        })
      );
    }

    await deleteApplication(id);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, colStatus: ApplicationStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCol !== colStatus) {
      setDragOverCol(colStatus);
    }
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    if (!id) return;

    const targetApp = appsList.find((a) => a.id === id);
    if (targetApp && targetApp.status !== targetStatus) {
      handleUpdateStatus(id, targetStatus);
    }
    setDraggingId(null);
  };

  const statusColumns: {
    id: ApplicationStatus;
    label: string;
    icon: any;
    color: string;
    bg: string;
    badgeColor: string;
  }[] = [
    {
      id: "saved",
      label: "Saved Roles",
      icon: Bookmark,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/30",
      badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    },
    {
      id: "applied",
      label: "Applications Sent",
      icon: Send,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/30",
      badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    },
    {
      id: "interviewing",
      label: "Interviews",
      icon: Calendar,
      color: "text-purple-500",
      bg: "bg-purple-500/10 border-purple-500/30",
      badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    },
    {
      id: "offered",
      label: "Offers Extended",
      icon: Award,
      color: "text-[#A9C632]",
      bg: "bg-[#A9C632]/10 border-[#A9C632]/30",
      badgeColor: "bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632]",
    },
  ];

  const filteredApps = appsList.filter((app) => {
    if (activeSubTab === "all") return true;
    return app.status === activeSubTab;
  });

  return (
    <div className={`w-full h-full overflow-y-auto pt-24 pb-20 pl-24 md:pl-28 pr-6 md:pr-10 font-urbanist select-none transition-colors ${
      isDarkMode ? "bg-[#0C140D] text-white" : "bg-[#F7F9F2] text-[#1D2E1B]"
    }`}>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* ── Header & Sub-Tab Switcher ─────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#C8D2A6] dark:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[#1D2E1B] dark:text-white">
                Application & Saved Roles Tracker
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/40">
                {appsList.length} Active Pipeline
              </span>
            </div>
            <p className="text-xs text-[#546E50] dark:text-[#D2E0CC] mt-0.5">
              Drag & drop cards to move between stages, or click any card to inspect full role details and notes
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/5 dark:bg-[#152216] border border-[#C8D2A6] dark:border-white/10 text-xs">
            {[
              { id: "all", label: `All (${appsList.length})` },
              { id: "saved", label: `Saved (${appsList.filter(a => a.status === "saved").length})` },
              { id: "applied", label: `Applied (${appsList.filter(a => a.status === "applied").length})` },
              { id: "interviewing", label: `Interviewing (${appsList.filter(a => a.status === "interviewing").length})` },
              { id: "offered", label: `Offers (${appsList.filter(a => a.status === "offered").length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? "bg-[#1D2E1B] text-white dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-xs font-bold"
                    : "text-[#546E50] dark:text-[#D2E0CC] hover:text-[#1D2E1B] dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Empty State ───────────────────────────────────── */}
        {filteredApps.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-3 rounded-3xl border border-dashed border-[#C8D2A6] dark:border-white/10 bg-white/60 dark:bg-white/5">
            <div className="w-14 h-14 rounded-3xl bg-[#A9C632]/20 flex items-center justify-center text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/30">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-[#1D2E1B] dark:text-white">No roles in this stage yet</h3>
            <p className="text-xs text-[#546E50] dark:text-[#D2E0CC] max-w-sm">
              Explore the 2.5D GPU Globe or Grid List to bookmark positions and track your pipeline.
            </p>
          </div>
        ) : (
          /* ── Full-Height 4-Column Drag & Drop Stream ───────── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 min-h-[560px]">
            {statusColumns.map((col) => {
              const colApps = appsList.filter(a => a.status === col.id);
              if (activeSubTab !== "all" && activeSubTab !== col.id) return null;

              const isDropTarget = dragOverCol === col.id;

              return (
                <div 
                  key={col.id}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`flex flex-col rounded-[28px] p-4 border transition-all ${
                    activeSubTab !== "all" ? "col-span-full md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4 md:p-0 md:border-0" : ""
                  } ${
                    isDropTarget 
                      ? "ring-2 ring-[#A9C632] bg-[#A9C632]/10 border-[#A9C632]" 
                      : isDarkMode 
                      ? "bg-[#152216]/90 border-white/10" 
                      : "bg-white/70 border-[#C8D2A6] shadow-xs"
                  }`}
                >
                  {/* Column Header */}
                  {activeSubTab === "all" && (
                    <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[#C8D2A6] dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-xl border ${col.bg}`}>
                          <col.icon className={`w-3.5 h-3.5 ${col.color}`} />
                        </span>
                        <span className="font-bold text-xs text-[#1D2E1B] dark:text-white">{col.label}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${col.badgeColor}`}>
                        {colApps.length}
                      </span>
                    </div>
                  )}

                  {/* Cards List with Drag Support */}
                  <div className="space-y-3 flex-1 flex flex-col">
                    {colApps.map((app) => (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        onClick={() => setSelectedApp(app)}
                        className={`p-4.5 rounded-[22px] border shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between group ${
                          draggingId === app.id ? "opacity-40 scale-98" : ""
                        } ${
                          isDarkMode 
                            ? "bg-[#1C2C1D] border-white/10 hover:border-[#A9C632]" 
                            : "bg-white border-[#C8D2A6] hover:border-[#A9C632]"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm group-hover:text-[#A9C632] transition-colors truncate text-[#1D2E1B] dark:text-white leading-snug">
                                {app.jobTitle}
                              </h4>
                              <p className="text-xs font-semibold text-[#1D2E1B] dark:text-[#A9C632] truncate mt-0.5">
                                {app.companyName}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReportingJob(app);
                                }}
                                className="p-1 rounded-lg text-[#546E50] hover:text-red-500 hover:bg-red-50 dark:text-[#D2E0CC] dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                title="Report or flag this role"
                              >
                                <Flag className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(app.id, e)}
                                className="p-1 rounded-lg text-[#546E50] hover:text-red-500 hover:bg-red-50 dark:text-[#D2E0CC] dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                title="Remove from tracker"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {app.location && (
                            <p className="text-[11px] text-[#546E50] dark:text-[#D2E0CC] flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-[#A9C632] flex-shrink-0" />
                              <span className="truncate">{app.location}</span>
                            </p>
                          )}

                          {app.salary && (
                            <p className="text-[11px] text-[#1D2E1B] dark:text-[#A9C632] flex items-center gap-1 font-bold">
                              <DollarSign className="w-3 h-3 text-[#A9C632] flex-shrink-0" />
                              <span>{app.salary}</span>
                            </p>
                          )}

                          {app.notes && (
                            <p className={`text-[11px] line-clamp-1 italic p-1.5 rounded-lg border ${
                              isDarkMode 
                                ? "bg-white/10 text-white border-white/10" 
                                : "bg-[#F7F9F2] text-[#546E50] border-[#C8D2A6]/50"
                            }`}>
                              &ldquo;{app.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Status Stage Quick Actions */}
                        <div className="mt-3 pt-3 border-t border-[#C8D2A6] dark:border-white/10 flex items-center justify-between text-xs gap-2">
                          <select
                            value={app.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border cursor-pointer ${
                              isDarkMode ? "bg-[#152216] border-white/15 text-white" : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B]"
                            }`}
                          >
                            <option value="saved">Saved</option>
                            <option value="applied">Applied</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="offered">Offered</option>
                            <option value="rejected">Archived</option>
                          </select>

                          <a
                            href={app.applyUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-[11px] font-bold text-[#1D2E1B] dark:text-[#A9C632] hover:text-[#A9C632] transition-colors"
                          >
                            <span>Apply</span>
                            <ArrowUpRight className="w-3 h-3 text-[#A9C632]" />
                          </a>
                        </div>
                      </div>
                    ))}

                    {/* Drag Drop Hint Container */}
                    {colApps.length === 0 && (
                      <div className="flex-1 min-h-[140px] rounded-2xl border-2 border-dashed border-[#C8D2A6]/60 dark:border-[#3D543A] flex flex-col items-center justify-center text-center p-4">
                        <MoveHorizontal className="w-5 h-5 text-[#546E50]/40 mb-1" />
                        <span className="text-xs text-[#546E50] dark:text-[#C8D2A6] font-medium">Drop role here</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 🔍 Role Detail Inspector Modal ("Click it and we know") ─ */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-urbanist">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border ${
                isDarkMode ? "bg-[#1D2E1B] border-[#3D543A] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
              }`}
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#C8D2A6] dark:border-[#3D543A] flex items-center justify-between bg-[#F7F9F2] dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#A9C632]/20 border border-[#A9C632]/40 flex items-center justify-center text-[#1D2E1B] dark:text-[#A9C632]">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1D2E1B] dark:text-white">
                      {selectedApp.jobTitle}
                    </h3>
                    <p className="text-xs font-semibold text-[#546E50] dark:text-[#C8D2A6]">
                      {selectedApp.companyName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#546E50] hover:text-[#1D2E1B] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-6 space-y-5 text-xs">
                
                {/* Meta Attributes Grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-[#F7F9F2] dark:bg-white/[0.03] border border-[#C8D2A6] dark:border-[#3D543A]">
                    <span className="text-[10px] uppercase font-bold text-[#546E50] dark:text-[#C8D2A6] block mb-1">
                      Compensation Range
                    </span>
                    <p className="font-bold text-sm text-[#1D2E1B] dark:text-[#A9C632]">
                      {selectedApp.salary || "Competitive Market Rate"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F7F9F2] dark:bg-white/[0.03] border border-[#C8D2A6] dark:border-[#3D543A]">
                    <span className="text-[10px] uppercase font-bold text-[#546E50] dark:text-[#C8D2A6] block mb-1">
                      Location & Mode
                    </span>
                    <p className="font-bold text-sm text-[#1D2E1B] dark:text-white truncate">
                      {selectedApp.location || "Remote / Worldwide"}
                    </p>
                  </div>
                </div>

                {/* Interactive Stage Stepper */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#546E50] dark:text-[#C8D2A6] block mb-2">
                    Move Pipeline Stage
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {statusColumns.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => handleUpdateStatus(selectedApp.id, col.id)}
                        className={`p-2.5 rounded-xl font-bold text-xs flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                          selectedApp.status === col.id
                            ? "bg-[#1D2E1B] text-[#A9C632] border-[#1D2E1B] shadow-sm dark:bg-[#A9C632] dark:text-[#1D2E1B]"
                            : "bg-[#F7F9F2] border-[#C8D2A6] text-[#546E50] hover:border-[#A9C632] hover:text-[#1D2E1B]"
                        }`}
                      >
                        <col.icon className="w-3.5 h-3.5" />
                        <span>{col.label.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Candidate Notes & Interview Log */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#546E50] dark:text-[#C8D2A6]">
                      Interview Log & Strategy Notes
                    </label>
                    <span className="text-[10px] text-gray-400">Auto-saved</span>
                  </div>
                  <textarea
                    rows={4}
                    value={selectedApp.notes || ""}
                    onChange={(e) => handleUpdateNotes(selectedApp.id, e.target.value)}
                    placeholder="Log recruiter names, screening questions, portfolio feedback, or next interview milestones..."
                    className={`w-full p-3.5 rounded-2xl border text-xs focus:outline-none focus:border-[#A9C632] leading-relaxed resize-none ${
                      isDarkMode ? "bg-[#243822] border-[#3D543A] text-white" : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>

                {/* Timestamps & Info */}
                <div className="flex items-center justify-between pt-2 text-[11px] text-[#546E50]">
                  <span>Created: {selectedApp.createdAt}</span>
                  <span>Last Update: {selectedApp.updatedAt}</span>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 border-t border-[#C8D2A6] dark:border-[#3D543A] flex items-center justify-between bg-[#F7F9F2] dark:bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(selectedApp.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    onClick={() => setReportingJob(selectedApp)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold transition-colors cursor-pointer"
                    title="Report or flag this role"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedApp.applyUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#C8D2A6] hover:bg-black/5 text-xs font-semibold cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#A9C632]" /> : <Share2 className="w-3.5 h-3.5 text-[#546E50] dark:text-[#C8D2A6]" />}
                    <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                  </button>

                  <a
                    href={selectedApp.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1D2E1B] hover:bg-[#2D442A] text-white dark:bg-[#A9C632] dark:text-[#1D2E1B] font-bold text-xs shadow-md cursor-pointer transition-transform hover:scale-102"
                  >
                    <span>Open Application</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#A9C632] dark:text-[#1D2E1B]" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Role Modal */}
      {reportingJob && (
        <ReportCompanyModal
          isOpen={!!reportingJob}
          onClose={() => setReportingJob(null)}
          companyId={reportingJob.companyId || undefined}
          companyName={reportingJob.companyName}
          companyLogo={reportingJob.companyLogo}
          jobTitle={reportingJob.jobTitle}
          jobId={reportingJob.jobId || undefined}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
