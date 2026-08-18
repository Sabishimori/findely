"use client";

import { motion, AnimatePresence } from "motion/react";
import FloatingPortalCard from "./FloatingPortalCard";
import { Building2, X, Layers } from "lucide-react";

export interface OpenPortal {
  companyId: string;
  companyName?: string;
  companyLogo?: string;
  activeJobCount?: number;
  isMinimized: boolean;
  zIndex: number;
  initialPosition: { x: number; y: number };
  initialData?: any;
}

interface FloatingJobPortalsManagerProps {
  portals: OpenPortal[];
  onMinimize: (companyId: string) => void;
  onRestore: (companyId: string) => void;
  onClose: (companyId: string) => void;
  onBringToFront: (companyId: string) => void;
  onApplicationTracked?: () => void;
  onFlyToBranch?: (city: string, lat: number, lng: number) => void;
  highlightJobTitle?: string;
  isDarkMode?: boolean;
}

export default function FloatingJobPortalsManager({
  portals,
  onMinimize,
  onRestore,
  onClose,
  onBringToFront,
  onApplicationTracked,
  onFlyToBranch,
  highlightJobTitle,
  isDarkMode = false,
}: FloatingJobPortalsManagerProps) {
  const visiblePortals = portals.filter((p) => !p.isMinimized);
  const minimizedPortals = portals.filter((p) => p.isMinimized);

  return (
    <>
      {/* ── 1. Floating Draggable Portals Windows ───────────── */}
      <AnimatePresence>
        {visiblePortals.map((portal) => (
          <FloatingPortalCard
            key={portal.companyId}
            companyId={portal.companyId}
            initialData={portal.initialData}
            zIndex={portal.zIndex}
            initialPosition={portal.initialPosition}
            onMinimize={() => onMinimize(portal.companyId)}
            onClose={() => onClose(portal.companyId)}
            onBringToFront={() => onBringToFront(portal.companyId)}
            onApplicationTracked={onApplicationTracked}
            onFlyToBranch={onFlyToBranch}
            highlightJobTitle={highlightJobTitle}
            isDarkMode={isDarkMode}
          />
        ))}
      </AnimatePresence>

      {/* ── 2. Bottom-Right Minimized Chips Taskbar Dock ────── */}
      <AnimatePresence>
        {minimizedPortals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-5 right-6 z-40 flex items-center gap-2 max-w-[80vw] overflow-x-auto p-1.5 rounded-2xl bg-white/90 dark:bg-[#1D2E1B]/95 backdrop-blur-2xl border border-[#C8D2A6] dark:border-[#3D543A] shadow-2xl select-none font-urbanist"
          >
            {/* Dock Label Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-[#546E50] dark:text-[#C8D2A6] border-r border-[#C8D2A6] dark:border-[#3D543A] flex-shrink-0">
              <Layers className="w-3.5 h-3.5 text-[#A9C632]" />
              <span>Minimized ({minimizedPortals.length}/5)</span>
            </div>

            {/* Minimized Company Chips */}
            <div className="flex items-center gap-1.5 flex-nowrap">
              {minimizedPortals.map((portal) => (
                <motion.div
                  key={portal.companyId}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onRestore(portal.companyId)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-xs transition-all cursor-pointer group flex-shrink-0 ${
                    isDarkMode
                      ? "bg-[#243822] hover:bg-[#2E472C] border-[#3D543A] hover:border-[#A9C632] text-white"
                      : "bg-[#F7F9F2] hover:bg-white border-[#C8D2A6] hover:border-[#A9C632] text-[#1D2E1B]"
                  }`}
                  title="Click to reopen floatable portal"
                >
                  {/* Company Logo Icon */}
                  <div className="w-5 h-5 rounded-lg bg-white dark:bg-white/10 border border-[#C8D2A6]/60 p-0.5 flex items-center justify-center flex-shrink-0">
                    {portal.companyLogo ? (
                      <img src={portal.companyLogo} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-3 h-3 text-[#A9C632]" />
                    )}
                  </div>

                  {/* Company Name & Role Pill */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-xs truncate max-w-[110px]">
                      {portal.companyName || "Portal"}
                    </span>
                    {typeof portal.activeJobCount === "number" && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#A9C632]/25 text-[#1D2E1B] dark:text-[#A9C632]">
                        {portal.activeJobCount}
                      </span>
                    )}
                  </div>

                  {/* Quick Close Button on Chip */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose(portal.companyId);
                    }}
                    className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer ml-0.5"
                    title="Close portal"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
