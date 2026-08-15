"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { getAppliedJobs, updateApplicationStatus, deleteApplication } from "@/app/actions";
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Award, 
  Archive, 
  Trash2, 
  Plus,
  ArrowRight,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Application = {
  id: string;
  job_id: string | null;
  company_id: string | null;
  job_title: string;
  company_name: string;
  company_logo: string | null;
  location_text: string | null;
  apply_url: string | null;
  status: string;
  applied_at: Date | null;
  notes: string | null;
  updated_at: Date | null;
};

const STATUS_COLUMNS = [
  { id: "applied", label: "Applied", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { id: "interviewing", label: "Interviewing", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { id: "offer", label: "Offer Received", color: "text-[#8EAFA0] bg-[#8EAFA0]/15 border-[#8EAFA0]/30" },
  { id: "archived", label: "Archived", color: "text-gray-400 bg-gray-800/40 border-gray-700/40" },
];

export default function AppliedJobsView({ onClose }: { onClose?: () => void }) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const loadData = async () => {
    setLoading(true);
    const data = await getAppliedJobs();
    setApplications(data as Application[]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user?.email]);

  const handleStatusChange = async (appId: string, nextStatus: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: nextStatus } : app))
    );
    await updateApplicationStatus(appId, nextStatus);
  };

  const handleDelete = async (appId: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== appId));
    await deleteApplication(appId);
  };

  const filteredApps = filterStatus === "all" 
    ? applications 
    : applications.filter(a => a.status === filterStatus);

  return (
    <div className="w-full h-full flex flex-col bg-[#090C0B] text-[#F4F7F5] overflow-y-auto p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/[0.07]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#8EAFA0] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#8EAFA0] font-mono font-semibold">Personal Pipeline</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-space-grotesk tracking-tight text-white">
            Applied Jobs Tracker
          </h1>
          <p className="text-sm text-[#8A9A92] mt-1">
            Keep track of all your company outreach, interviews, and job offers in one place.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#121815] p-1 rounded-2xl border border-white/[0.06]">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterStatus === "all"
                ? "bg-[#8EAFA0] text-[#090C0B] font-semibold shadow-md"
                : "text-[#8A9A92] hover:text-white"
            }`}
          >
            All ({applications.length})
          </button>
          {STATUS_COLUMNS.map((col) => {
            const count = applications.filter((a) => a.status === col.id).length;
            return (
              <button
                key={col.id}
                onClick={() => setFilterStatus(col.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filterStatus === col.id
                    ? "bg-[#8EAFA0] text-[#090C0B] font-semibold shadow-md"
                    : "text-[#8A9A92] hover:text-white"
                }`}
              >
                {col.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 border-2 border-[#8EAFA0] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="p-16 text-center bg-[#101513]/60 rounded-3xl border border-white/[0.06] max-w-lg mx-auto mt-8">
            <Briefcase className="w-12 h-12 text-[#8EAFA0] mx-auto mb-4 opacity-75" />
            <h3 className="text-lg font-bold text-white font-space-grotesk mb-2">No applications in this view</h3>
            <p className="text-sm text-[#8A9A92] mb-6">
              When exploring companies on the 3D globe, click "Mark as Applied" on any role to track it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredApps.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#111714] border border-white/[0.08] hover:border-[#8EAFA0]/40 rounded-3xl p-5 shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Company & Status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#16201C] border border-white/[0.08] flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                          {app.company_logo ? (
                            <img
                              src={app.company_logo}
                              alt={app.company_name}
                              className="w-full h-full object-contain rounded-xl"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <Building2 className="w-5 h-5 text-[#8EAFA0]" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-[#8A9A92] uppercase tracking-wider">
                            {app.company_name}
                          </h4>
                          <h3 className="text-base font-bold text-white font-space-grotesk line-clamp-1">
                            {app.job_title}
                          </h3>
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove tracking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Location & Applied Date */}
                    <div className="space-y-1.5 mb-4 text-xs text-[#8A9A92]">
                      {app.location_text && (
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#8EAFA0]" />
                          <span>{app.location_text}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        <span>
                          Applied on{" "}
                          {app.applied_at
                            ? new Date(app.applied_at).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recently"}
                        </span>
                      </p>
                    </div>

                    {/* Notes if any */}
                    {app.notes && (
                      <div className="bg-[#16201C]/70 p-3 rounded-2xl border border-white/[0.04] text-xs text-[#D8E5DF] mb-4 line-clamp-2">
                        {app.notes}
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions & Status Selector */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="bg-[#18231E] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-[#F4F7F5] focus:outline-none focus:border-[#8EAFA0]"
                    >
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offer">Offer Received</option>
                      <option value="archived">Archived</option>
                    </select>

                    {app.apply_url && (
                      <a
                        href={app.apply_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#8EAFA0] hover:text-white flex items-center gap-1 bg-[#8EAFA0]/10 hover:bg-[#8EAFA0]/20 px-3 py-1.5 rounded-xl border border-[#8EAFA0]/20 transition-colors"
                      >
                        <span>Listing</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
