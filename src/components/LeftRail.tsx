"use client";

import { Compass, ListTodo, ShieldCheck, FileText, Sparkles } from "lucide-react";
import { NavTab } from "./Navigation";

export default function LeftRail({
  currentTab,
  onSelectTab,
}: {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}) {
  return (
    <aside className="w-16 h-full bg-white border-r border-gray-200 flex flex-col items-center py-5 gap-6 z-30 select-none flex-shrink-0 font-sans">
      {/* Discover Button matching reference */}
      <button
        onClick={() => onSelectTab("globe")}
        className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all w-13 ${
          currentTab === "globe"
            ? "bg-gray-100 text-gray-900 shadow-xs border border-gray-200"
            : "text-gray-400 hover:text-gray-800 hover:bg-gray-50"
        }`}
        title="Discover (3D Globe)"
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center">
          <Compass className={`w-5 h-5 ${currentTab === "globe" ? "text-gray-900" : ""}`} />
        </div>
        <span className="text-[10px] font-semibold">Discover</span>
      </button>

      {/* Track / Applied Button matching reference */}
      <button
        onClick={() => onSelectTab("applied")}
        className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all w-13 ${
          currentTab === "applied"
            ? "bg-gray-100 text-gray-900 shadow-xs border border-gray-200"
            : "text-gray-400 hover:text-gray-800 hover:bg-gray-50"
        }`}
        title="Track Applications"
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center">
          <ListTodo className={`w-5 h-5 ${currentTab === "applied" ? "text-gray-900" : ""}`} />
        </div>
        <span className="text-[10px] font-semibold">Track</span>
      </button>

      {/* Verification / AI Queue Button */}
      <button
        onClick={() => onSelectTab("verification")}
        className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all w-13 ${
          currentTab === "verification"
            ? "bg-gray-100 text-gray-900 shadow-xs border border-gray-200"
            : "text-gray-400 hover:text-gray-800 hover:bg-gray-50"
        }`}
        title="AI Verification Audit"
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center">
          <ShieldCheck className={`w-5 h-5 ${currentTab === "verification" ? "text-[#4E9B78]" : ""}`} />
        </div>
        <span className="text-[10px] font-semibold">Audit</span>
      </button>
    </aside>
  );
}
