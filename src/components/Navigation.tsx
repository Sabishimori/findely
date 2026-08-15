"use client";

import { useState } from "react";
import { 
  Globe2, 
  Briefcase, 
  ShieldCheck, 
  Plus, 
  Compass, 
  Sparkles, 
  Layers,
  ChevronRight
} from "lucide-react";
import RequestCompanyModal from "./RequestCompanyModal";
import { motion } from "motion/react";

export type NavTab = "globe" | "applied" | "verification" | "profile";

export default function Navigation({
  currentTab,
  onSelectTab,
  appliedCount = 0,
}: {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  appliedCount?: number;
}) {
  const [showRequestModal, setShowRequestModal] = useState(false);

  return (
    <>
      <aside className="w-16 md:w-64 h-full bg-[#0B0F0D] border-r border-white/[0.07] flex flex-col justify-between p-3 md:p-5 z-40 flex-shrink-0 select-none font-sans">
        {/* Top: Brand Header */}
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-white/[0.06]">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6D9482] to-[#A7C9B9] flex items-center justify-center text-[#090C0B] font-extrabold text-base shadow-lg shadow-[#8EAFA0]/20 font-space-grotesk flex-shrink-0">
              F
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight text-white font-space-grotesk">
                  Findely<span className="text-[#8EAFA0]">.</span>
                </h1>
                <span className="text-[10px] font-mono font-bold bg-[#8EAFA0]/15 text-[#8EAFA0] px-1.5 py-0.5 rounded-full border border-[#8EAFA0]/20">
                  3D Globe
                </span>
              </div>
              <p className="text-[11px] text-[#8A9A92]">Open Global Job Map</p>
            </div>
          </div>

          {/* Quick Action: Request Company */}
          <button
            onClick={() => setShowRequestModal(true)}
            className="w-full mb-6 py-2.5 px-3 bg-[#131B17] hover:bg-[#18231E] text-white rounded-2xl border border-[#8EAFA0]/30 shadow-md transition-all flex items-center justify-center md:justify-start gap-2.5 group"
            title="Request / Ingest a company with AI verification"
          >
            <div className="w-6 h-6 rounded-xl bg-[#8EAFA0] text-[#090C0B] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="hidden md:inline text-xs font-bold font-space-grotesk tracking-tight text-[#D8E5DF] group-hover:text-white">
              Request Company
            </span>
          </button>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => onSelectTab("globe")}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                currentTab === "globe"
                  ? "bg-[#16221C] text-white border border-[#8EAFA0]/30 shadow-sm"
                  : "text-[#8A9A92] hover:text-white hover:bg-white/[0.04]"
              }`}
              title="3D Globe Explorer"
            >
              <div className="flex items-center gap-3">
                <Globe2 className={`w-5 h-5 flex-shrink-0 ${currentTab === "globe" ? "text-[#8EAFA0]" : ""}`} />
                <span className="hidden md:inline text-xs font-semibold">3D Sphere Map</span>
              </div>
              {currentTab === "globe" && (
                <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#8EAFA0] animate-pulse" />
              )}
            </button>

            <button
              onClick={() => onSelectTab("applied")}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                currentTab === "applied"
                  ? "bg-[#16221C] text-white border border-[#8EAFA0]/30 shadow-sm"
                  : "text-[#8A9A92] hover:text-white hover:bg-white/[0.04]"
              }`}
              title="Applied Jobs Tracker"
            >
              <div className="flex items-center gap-3">
                <Briefcase className={`w-5 h-5 flex-shrink-0 ${currentTab === "applied" ? "text-[#8EAFA0]" : ""}`} />
                <span className="hidden md:inline text-xs font-semibold">Applied Jobs</span>
              </div>
              {appliedCount > 0 && (
                <span className="hidden md:flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8EAFA0]/20 text-[#8EAFA0] border border-[#8EAFA0]/30">
                  {appliedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab("verification")}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                currentTab === "verification"
                  ? "bg-[#16221C] text-white border border-[#8EAFA0]/30 shadow-sm"
                  : "text-[#8A9A92] hover:text-white hover:bg-white/[0.04]"
              }`}
              title="AI Verification Queue"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className={`w-5 h-5 flex-shrink-0 ${currentTab === "verification" ? "text-[#8EAFA0]" : ""}`} />
                <span className="hidden md:inline text-xs font-semibold">AI Scan Queue</span>
              </div>
              <span className="hidden md:inline text-[10px] text-[#8EAFA0] font-mono">Live</span>
            </button>
          </nav>
        </div>

        {/* Bottom User / Info Footer */}
        <div className="pt-4 border-t border-white/[0.06]">
          <div className="hidden md:flex items-center gap-2.5 p-2 bg-[#121915] rounded-2xl border border-white/[0.04]">
            <div className="w-7 h-7 rounded-xl bg-[#1D2A24] border border-white/[0.06] flex items-center justify-center text-xs font-bold text-[#8EAFA0]">
              OP
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate font-space-grotesk">Open Source Vibe</p>
              <p className="text-[10px] text-[#8EAFA0] flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFA0] animate-pulse" />
                Anti-Fraud Engine Active
              </p>
            </div>
          </div>
        </div>
      </aside>

      <RequestCompanyModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </>
  );
}
