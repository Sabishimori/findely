"use client";

import { useState, useEffect } from "react";
import { getCompanyVerificationQueue, getCompanyReports, resolveCompanyReport } from "@/app/actions";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Globe, 
  Building2, 
  CheckCircle, 
  ExternalLink, 
  Sparkles,
  Bot,
  Layers,
  Flag,
  Check,
  AlertOctagon,
  Eye,
  Info
} from "lucide-react";
import { motion } from "motion/react";
import { ScribbleUnderline } from "./Scribble";

type RequestItem = {
  id: string;
  name: string;
  website_url: string;
  careers_url: string;
  location_text: string | null;
  description: string | null;
  logo_url: string | null;
  status: string;
  ai_safety_score: number | null;
  ai_analysis: string | null;
  created_at: Date | null;
};

type ReportItem = {
  id: string;
  company_id: string | null;
  company_name: string;
  reason: string;
  comment: string | null;
  reported_by_email: string | null;
  status: string;
  created_at: Date | null;
};

export default function VerificationQueueView({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [activeTab, setActiveTab] = useState<"scans" | "reports">("reports");
  const [queue, setQueue] = useState<RequestItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [queueData, reportsData] = await Promise.all([
        getCompanyVerificationQueue(),
        getCompanyReports(),
      ]);
      setQueue(queueData as RequestItem[]);
      setReports(reportsData as ReportItem[]);
    } catch (e) {
      console.error("Failed to load queue & reports", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolveReport = async (reportId: string, status: "resolved" | "dismissed") => {
    setResolvingId(reportId);
    try {
      await resolveCompanyReport(reportId, status);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
    } catch (e) {
      console.error("Failed to resolve report", e);
    } finally {
      setResolvingId(null);
    }
  };

  const pendingReportsCount = reports.filter((r) => r.status === "pending_review").length;

  return (
    <div className={`w-full h-full flex flex-col overflow-y-auto pt-24 pb-16 pl-24 md:pl-28 pr-6 md:pr-10 font-sans select-none transition-colors ${
      isDarkMode ? "bg-[#1D2E1B] text-white" : "bg-[#F7F9F2] text-[#1D2E1B]"
    }`}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header with Admin & QA Badge */}
        <div className="pb-6 border-b border-[#C8D2A6] dark:border-[#546E50]">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-1.5">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#A9C632]" />
              <span className="text-xs uppercase tracking-widest text-[#A9C632] font-mono font-bold">
                Anti-Fraud & Quality Assurance
              </span>
            </div>

            {/* Access Mode Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#A9C632]/15 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/30">
              <Info className="w-3.5 h-3.5 text-[#A9C632]" />
              <span>Admin / Community Audit Hub</span>
            </div>
          </div>

          <div className="relative inline-block">
            <h1 className="text-2xl md:text-3xl font-bold font-space-grotesk tracking-tight text-[#1D2E1B] dark:text-white">
              AI Verification & Reports Hub
            </h1>
            <div className="absolute -bottom-2.5 left-0">
              <ScribbleUnderline width={180} className="text-[#A9C632]" />
            </div>
          </div>
          <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] mt-3 max-w-2xl leading-relaxed">
            Every requested startup and user-flagged issue is audited here by our Gemini AI engine and moderation pipeline to keep Findely 100% scam-free.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] w-fit shadow-xs">
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "reports"
                ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-md"
                : "text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white"
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Community Reports</span>
            {pendingReportsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-500 text-white ml-1">
                {pendingReportsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("scans")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "scans"
                ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-md"
                : "text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Scans & Submissions ({queue.length})</span>
          </button>
        </div>

        {/* Tab 1: Community Reports */}
        {activeTab === "reports" && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center p-20">
                <div className="w-8 h-8 border-2 border-[#A9C632] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : reports.length === 0 ? (
              <div className={`p-16 text-center rounded-3xl border max-w-lg mx-auto mt-6 ${
                isDarkMode ? "bg-[#1D2E1B] border-[#546E50]" : "bg-white border-[#C8D2A6] shadow-sm"
              }`}>
                <ShieldCheck className="w-12 h-12 text-[#A9C632] mx-auto mb-4 opacity-75" />
                <h3 className="text-base font-bold font-space-grotesk mb-1.5 text-[#1D2E1B] dark:text-white">
                  No active company reports
                </h3>
                <p className="text-xs text-[#546E50] dark:text-[#C8D2A6]">
                  All company profiles on the 2.5D map are currently reported clean by the community.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((r) => {
                  const isPending = r.status === "pending_review";
                  const isResolved = r.status === "resolved";

                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-3xl p-6 border shadow-xs transition-all ${
                        isDarkMode ? "bg-[#1D2E1B] border-[#546E50]" : "bg-white border-[#C8D2A6]"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center p-2 text-red-500 shrink-0 mt-0.5">
                            <AlertOctagon className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold font-space-grotesk text-[#1D2E1B] dark:text-white">
                                {r.company_name}
                              </h3>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
                                <Flag className="w-3 h-3" />
                                {r.reason}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isPending
                                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                                  : isResolved
                                  ? "bg-[#A9C632]/15 text-[#A9C632] border border-[#A9C632]/30"
                                  : "bg-gray-500/15 text-gray-400 border border-gray-500/30"
                              }`}>
                                {isPending ? "Pending Review" : isResolved ? "Resolved" : "Dismissed"}
                              </span>
                            </div>
                            
                            {r.comment && (
                              <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] leading-relaxed pt-1 bg-black/[0.02] dark:bg-white/[0.03] p-3 rounded-xl border border-black/5 dark:border-white/5">
                                <strong className="text-[#1D2E1B] dark:text-white font-bold block mb-0.5">User Feedback:</strong>
                                &ldquo;{r.comment}&rdquo;
                              </p>
                            )}

                            <div className="flex items-center gap-3 text-[11px] text-[#546E50] dark:text-[#C8D2A6] pt-1">
                              <span>Reported on: {r.created_at ? new Date(r.created_at).toLocaleDateString() : "Recently"}</span>
                              {r.reported_by_email && <span>· By: {r.reported_by_email}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Admin Action Buttons */}
                        {isPending && (
                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            <button
                              disabled={resolvingId === r.id}
                              onClick={() => handleResolveReport(r.id, "dismissed")}
                              className="px-3 py-2 rounded-xl text-xs font-bold border border-[#C8D2A6] dark:border-[#546E50] text-[#546E50] dark:text-[#C8D2A6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              Dismiss
                            </button>
                            <button
                              disabled={resolvingId === r.id}
                              onClick={() => handleResolveReport(r.id, "resolved")}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#A9C632] text-[#1D2E1B] hover:bg-[#96B228] shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Audit & Resolve</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: AI Verification Queue */}
        {activeTab === "scans" && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center p-20">
                <div className="w-8 h-8 border-2 border-[#A9C632] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : queue.length === 0 ? (
              <div className={`p-16 text-center rounded-3xl border max-w-lg mx-auto mt-6 ${
                isDarkMode ? "bg-[#1D2E1B] border-[#546E50]" : "bg-white border-[#C8D2A6] shadow-sm"
              }`}>
                <ShieldCheck className="w-12 h-12 text-[#A9C632] mx-auto mb-4 opacity-75" />
                <h3 className="text-base font-bold font-space-grotesk mb-1.5 text-[#1D2E1B] dark:text-white">
                  No pending verification requests
                </h3>
                <p className="text-xs text-[#546E50] dark:text-[#C8D2A6]">
                  All submitted companies have been scanned and vetted.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {queue.map((item) => {
                  let analysis: any = null;
                  try {
                    if (item.ai_analysis) analysis = JSON.parse(item.ai_analysis);
                  } catch (_) {}

                  const isVerified = item.status === "verified";
                  const score = item.ai_safety_score || 95;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-3xl p-6 border shadow-xs transition-all ${
                        isDarkMode ? "bg-[#1D2E1B] border-[#546E50]" : "bg-white border-[#C8D2A6]"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-[#C8D2A6] dark:border-[#546E50] flex items-center justify-center p-2">
                            {item.logo_url ? (
                              <img
                                src={item.logo_url}
                                alt={item.name}
                                className="w-full h-full object-contain rounded-xl"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <Building2 className="w-6 h-6 text-[#A9C632]" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold font-space-grotesk text-[#1D2E1B] dark:text-white">{item.name}</h3>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                  isVerified
                                    ? "bg-[#A9C632]/15 text-[#A9C632] border border-[#A9C632]/30"
                                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                                }`}
                              >
                                {isVerified ? (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    Verified & Ingested
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3" />
                                    Scanning Careers Portal
                                  </>
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] mt-0.5">{item.location_text || "Global"} · {item.website_url}</p>
                          </div>
                        </div>

                        {/* AI Safety Score Badge */}
                        <div className={`border rounded-2xl px-4 py-2 flex items-center gap-3 ${
                          isDarkMode ? "bg-[#243822] border-[#546E50]" : "bg-gray-50 border-[#C8D2A6]"
                        }`}>
                          <div className="text-right">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-mono">
                              Safety Index
                            </span>
                            <span className="text-base font-extrabold text-[#A9C632] font-mono">
                              {score}/100
                            </span>
                          </div>
                          <ShieldCheck className="w-6 h-6 text-[#A9C632]" />
                        </div>
                      </div>

                      {/* AI Analysis Summary */}
                      {analysis && (
                        <div className={`mt-4 pt-4 border-t p-4 rounded-2xl border text-xs ${
                          isDarkMode
                            ? "bg-[#243822] border-[#546E50] text-[#C8D2A6]"
                            : "bg-gray-50 border-[#C8D2A6] text-[#546E50]"
                        }`}>
                          <div className="flex items-center gap-1.5 text-[#A9C632] font-semibold mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Automated Audit Summary</span>
                          </div>
                          <p className="text-[#546E50] dark:text-[#C8D2A6] leading-relaxed mb-3">{analysis.summary}</p>
                          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                            <span className="bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg text-[#A9C632]">
                              Fraud Risk: {analysis.fraud_risk}
                            </span>
                            <span className="bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg text-gray-400">
                              SSL Certified: {analysis.ssl_certified ? "Yes" : "No"}
                            </span>
                            <span className="bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg text-gray-400">
                              Careers HTTP: {analysis.careers_endpoint_status}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
