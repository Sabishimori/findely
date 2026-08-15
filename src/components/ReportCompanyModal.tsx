"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Flag, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { submitCompanyReport } from "@/app/actions";
import { useAuth } from "@/lib/authContext";

const REPORT_REASONS = [
  {
    value: "ghost_jobs",
    label: "Ghost Jobs or Expired Roles",
    desc: "The listed roles are already filled, expired, or non-existent.",
  },
  {
    value: "misleading_comp",
    label: "Misleading Salary or Requirements",
    desc: "Compensation figures or required experience are inaccurate.",
  },
  {
    value: "scam_phishing",
    label: "Phishing, Scam, or Malicious Links",
    desc: "The career portal or apply link looks suspicious or harmful.",
  },
  {
    value: "wrong_location",
    label: "Incorrect Location or Fake HQ",
    desc: "The office city or pin location on the map is wrong.",
  },
  {
    value: "out_of_business",
    label: "Company Closed or Acquired",
    desc: "The startup is no longer operating or has shut down.",
  },
  {
    value: "other",
    label: "Other Issue",
    desc: "Any other problem with this company profile.",
  },
];

export default function ReportCompanyModal({
  isOpen,
  onClose,
  companyId,
  companyName,
  companyLogo,
  jobTitle,
  jobId,
  isDarkMode = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  companyId?: string;
  companyName: string;
  companyLogo?: string | null;
  jobTitle?: string;
  jobId?: string;
  isDarkMode?: boolean;
}) {
  const { user } = useAuth();
  const [reason, setReason] = useState(REPORT_REASONS[0].value);
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const selectedReasonObj = REPORT_REASONS.find((r) => r.value === reason);
      const fullComment = jobTitle ? `[Flagged Role: ${jobTitle}] ${comment}` : comment;
      const res = await submitCompanyReport({
        company_id: companyId,
        company_name: companyName,
        reason: selectedReasonObj ? selectedReasonObj.label : reason,
        comment: fullComment,
        reported_by_email: email || user?.email || undefined,
      });

      if (res.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setComment("");
          onClose();
        }, 2200);
      } else {
        setErrorMessage(res.error || "Failed to submit report. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border transition-colors ${
            isDarkMode
              ? "bg-[#1D2E1B] border-[#3D543A] text-white"
              : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl border border-[#C8D2A6] dark:border-[#3D543A] text-[#546E50] dark:text-[#C8D2A6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-[#A9C632]/20 flex items-center justify-center mx-auto text-[#A9C632]"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <h3 className="text-xl font-black text-[#1D2E1B] dark:text-white">
                Report Submitted
              </h3>
              <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] max-w-sm mx-auto leading-relaxed">
                Thank you for helping protect the Findely community. Our AI and moderation team will review this company listing within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3 pr-8">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1D2E1B] dark:text-white flex items-center gap-2">
                    <span>{jobTitle ? "Report or Flag Role" : "Report or Flag Company"}</span>
                  </h3>
                  <p className="text-xs font-semibold text-[#546E50] dark:text-[#C8D2A6]">
                    {jobTitle ? (
                      <>Reporting <strong className="text-[#1D2E1B] dark:text-white">{jobTitle}</strong> at <strong className="text-[#1D2E1B] dark:text-white">{companyName}</strong></>
                    ) : (
                      <>Help us maintain high quality for <strong className="text-[#1D2E1B] dark:text-white">{companyName}</strong></>
                    )}
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Reason Dropdown / Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#546E50] dark:text-[#C8D2A6]">
                  Select Reason *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={`w-full p-3 text-xs font-semibold rounded-2xl border transition-all focus:outline-none focus:border-[#A9C632] ${
                    isDarkMode
                      ? "bg-[#243822] border-[#3D543A] text-white"
                      : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B]"
                  }`}
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r.value} value={r.value} className="py-2">
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Comment Box / Details Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#546E50] dark:text-[#C8D2A6]">
                  Details & Context *
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe the issue (e.g. 'The founding engineer role was closed last week' or 'The official domain is changed to...')"
                  className={`w-full p-3.5 text-xs rounded-2xl border transition-all resize-none focus:outline-none focus:border-[#A9C632] ${
                    isDarkMode
                      ? "bg-[#243822] border-[#3D543A] text-white placeholder:text-[#A0B28C]"
                      : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B] placeholder:text-[#546E50]"
                  }`}
                />
              </div>

              {/* 3. Optional Contact Email */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#546E50] dark:text-[#C8D2A6]">
                  Your Email (Optional, for status updates)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className={`w-full p-2.5 text-xs rounded-xl border transition-all focus:outline-none focus:border-[#A9C632] ${
                    isDarkMode
                      ? "bg-[#243822] border-[#3D543A] text-white placeholder:text-[#A0B28C]"
                      : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B] placeholder:text-[#546E50]"
                  }`}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs border border-[#C8D2A6] dark:border-[#3D543A] text-[#546E50] dark:text-[#C8D2A6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="px-6 py-2.5 rounded-xl font-black text-xs bg-red-500 hover:bg-red-600 text-white shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{submitting ? "Submitting..." : "Submit Report"}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
