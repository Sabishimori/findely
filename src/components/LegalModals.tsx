"use client";

import { useState } from "react";
import { ShieldCheck, FileText, Lock, X, ExternalLink, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playTapSound } from "@/lib/soundFx";

export type LegalTab = "privacy" | "terms" | "security";

interface LegalModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  isDarkMode?: boolean;
}

export default function LegalModals({
  isOpen,
  onClose,
  initialTab = "privacy",
  isDarkMode = false,
}: LegalModalsProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`w-full max-w-3xl max-h-[85vh] rounded-[36px] border shadow-2xl flex flex-col overflow-hidden ${
            isDarkMode ? "bg-[#1D2E1B] border-[#3D543A] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
          }`}
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-[#C8D2A6]/40 dark:border-[#3D543A] flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#A9C632]/20 flex items-center justify-center text-[#1D2E1B] dark:text-[#A9C632]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black">Legal, Privacy & Security</h3>
                <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] font-medium">
                  Findely Spatial Career Engine · Effective Date: February 2026
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playTapSound();
                onClose();
              }}
              className="w-9 h-9 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 sm:px-8 pt-4 border-b border-[#C8D2A6]/30 dark:border-[#3D543A] shrink-0 overflow-x-auto">
            {[
              { id: "privacy", label: "Privacy Policy", icon: ShieldCheck },
              { id: "terms", label: "Terms of Service", icon: FileText },
              { id: "security", label: "Security & ATS Integrity", icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playTapSound();
                    setActiveTab(tab.id as LegalTab);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap mb-2 ${
                    isActive
                      ? "bg-[#A9C632] text-[#1D2E1B] shadow-md"
                      : "text-[#546E50] dark:text-[#C8D2A6] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Content Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-[#546E50] dark:text-[#C8D2A6] font-medium">
            {activeTab === "privacy" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#A9C632]/10 border border-[#A9C632]/30 text-[#1D2E1B] dark:text-white font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#A9C632] shrink-0" />
                  <span>Summary: Findely never sells candidate data, never shows third-party ad network trackers, and never paywalls job listings.</span>
                </div>

                <h4 className="text-sm sm:text-base font-black text-[#1D2E1B] dark:text-white">1. Information We Collect</h4>
                <p>
                  Findely collects minimal information necessary to deliver spatial job discovery and authenticated candidate bookmarking:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Account Credentials:</strong> If you sign in via Google OAuth or Magic Email, we store your email address, display name, and profile picture avatar.</li>
                  <li><strong>Candidate Preferences:</strong> Saved job bookmarks, application status pipeline notes, and map camera coordinates.</li>
                  <li><strong>Telemetry:</strong> Anonymous usage metrics for server capacity and tech hub performance monitoring.</li>
                </ul>

                <h4 className="text-sm sm:text-base font-black text-[#1D2E1B] dark:text-white">2. Direct ATS Redirection</h4>
                <p>
                  Findely functions as a spatial discovery index. When you click "Apply Directly", you are redirected to the official applicant tracking system (e.g., Greenhouse, Lever, Ashby, Workable) hosted directly by the hiring company. Findely does not act as an employment agency and does not intercept resume submissions.
                </p>

                <h4 className="text-sm sm:text-base font-black text-[#1D2E1B] dark:text-white">3. Data Retention & Erasure</h4>
                <p>
                  You have the right to request full erasure of your account and saved bookmarks at any time by contacting our direct founder inbox at <strong className="text-[#A9C632]">founder@findely.app</strong>.
                </p>
              </div>
            )}

            {activeTab === "terms" && (
              <div className="space-y-4">
                <h4 className="text-sm sm:text-base font-black text-[#1D2E1B] dark:text-white">1. Acceptance of Terms</h4>
                <p>
                  By accessing or using Findely ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                </p>

                <h4 className="text-sm sm:text-base font-black text-[#1D2E1B] dark:text-white">2. Permitted Use & Free Access</h4>
                <p>
                  Findely is provided free of charge for individual job seekers, software engineers, and founders. You agree not to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use automated bots to scrape or abuse Findely's geocoding APIs.</li>
                  <li>Submit fraudulent company pins or deceptive job listings.</li>
                  <li>Attempt to bypass rate limits or compromise server infrastructure.</li>
                </ul>

                <h4 className="text-sm sm:text-base font-black text-[#1D2E1B] dark:text-white">3. Founder & Sponsored Showcase Listings</h4>
                <p>
                  Founders submitting their companies to the 2.5D map or live spotlight ticker certify that all submitted role titles, salary ranges, and office coordinates are accurate and in active recruitment. Findely reserves the right to unlist outdated or misleading submissions.
                </p>

                <h4 className="text-sm sm:text-base font-black text-[#1D2E1B] dark:text-white">4. Limitation of Liability</h4>
                <p>
                  Findely provides map indexing "as is" without warranty of any kind. Findely does not guarantee employment or the perpetual availability of any third-party job posting.
                </p>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <h4 className="text-sm sm:text-base font-black text-[#1D2E1B] dark:text-white">1. Encryption & Data Protection</h4>
                <p>
                  All network traffic between your browser and Findely is encrypted using TLS 1.3. User session tokens and database queries are secured using modern distributed databases (Turso / LibSQL) with row-level security.
                </p>

                <h4 className="text-sm sm:text-base font-black text-[#1D2E1B] dark:text-white">2. Verified ATS Pipeline Integrity</h4>
                <p>
                  Findely utilizes automated validation pipelines that verify public careers endpoints against known domain ownership records. Inactive postings that return 404 or 410 statuses are pruned automatically to eliminate ghost jobs.
                </p>

                <h4 className="text-sm sm:text-base font-black text-[#1D2E1B] dark:text-white">3. Vulnerability Reporting</h4>
                <p>
                  If you discover a security vulnerability or data discrepancy, please report it directly to <strong className="text-[#A9C632]">founder@findely.app</strong>. We acknowledge responsible disclosures promptly.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-black/[0.02] dark:bg-white/[0.02] border-t border-[#C8D2A6]/40 dark:border-[#3D543A] flex items-center justify-between gap-4 shrink-0">
            <span className="text-xs text-[#546E50] dark:text-[#C8D2A6] font-medium">
              Questions? Reach out directly to Sagar S. at founder@findely.app
            </span>
            <button
              onClick={() => {
                playTapSound();
                onClose();
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#A9C632] text-[#1D2E1B] text-xs font-black hover:brightness-105 transition-all shadow-md cursor-pointer"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
