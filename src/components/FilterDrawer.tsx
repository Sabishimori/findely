"use client";

import { useState } from "react";
import { X, SlidersHorizontal, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type FilterOptions = {
  roles: string[];
  locationType: string;
  onlyHiring: boolean;
  minJobs: number;
};

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  isDarkMode = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (f: FilterOptions) => void;
  onResetFilters: () => void;
  isDarkMode?: boolean;
}) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const toggleRole = (role: string) => {
    setLocalFilters((prev) => {
      const exists = prev.roles.includes(role);
      return {
        ...prev,
        roles: exists ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
      };
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  const ROLE_OPTIONS = [
    "Software Engineering",
    "AI & Machine Learning",
    "Product Management",
    "UI / UX Design",
    "Infrastructure & Cloud",
    "Developer Relations",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs font-sans">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh] border ${
              isDarkMode
                ? "bg-[#1D2E1B] border-[#3D543A] text-white"
                : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#C8D2A6] dark:border-[#3D543A]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#A9C632]" />
                <h3 className="font-bold text-base font-space-grotesk text-[#1D2E1B] dark:text-white">Filter Roles & Companies</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#546E50] hover:text-[#1D2E1B] dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="py-4 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* Only Hiring Toggle */}
              <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                isDarkMode ? "bg-white/[0.03] border-[#3D543A]" : "bg-[#F7F9F2] border-[#C8D2A6]"
              }`}>
                <div>
                  <h4 className="font-bold text-[#1D2E1B] dark:text-white">Only Show Active Openings</h4>
                  <p className="text-[#546E50] dark:text-[#C8D2A6] text-[11px]">Hide companies with zero current vacancies</p>
                </div>
                <input
                  type="checkbox"
                  checked={localFilters.onlyHiring}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({ ...prev, onlyHiring: e.target.checked }))
                  }
                  className="w-4 h-4 rounded accent-[#A9C632] cursor-pointer"
                />
              </div>

              {/* Roles Chips */}
              <div>
                <label className="font-bold uppercase tracking-wider text-[10px] font-mono text-[#546E50] dark:text-[#C8D2A6] block mb-2">
                  Specialization / Domain
                </label>
                <div className="flex flex-wrap gap-2">
                  {ROLE_OPTIONS.map((role) => {
                    const isSelected = localFilters.roles.includes(role);
                    return (
                      <button
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`px-3 py-1.5 rounded-xl transition-all font-medium flex items-center gap-1.5 border cursor-pointer ${
                          isSelected
                            ? "bg-[#1D2E1B] text-[#A9C632] border-[#1D2E1B] shadow-xs dark:bg-[#A9C632] dark:text-[#1D2E1B]"
                            : isDarkMode
                            ? "bg-white/[0.04] border-[#3D543A] text-gray-300 hover:bg-white/[0.08]"
                            : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B] hover:border-[#A9C632]"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{role}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location Type */}
              <div>
                <label className="font-bold uppercase tracking-wider text-[10px] font-mono text-[#546E50] dark:text-[#C8D2A6] block mb-2">
                  Workplace Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["all", "remote", "in-office"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setLocalFilters((prev) => ({ ...prev, locationType: type }))}
                      className={`py-2 px-3 rounded-xl font-semibold capitalize text-center transition-all border cursor-pointer ${
                        localFilters.locationType === type
                          ? "bg-[#1D2E1B] text-white dark:bg-[#A9C632] dark:text-[#1D2E1B] border-transparent shadow-xs"
                          : isDarkMode
                          ? "bg-white/[0.04] border-[#3D543A] text-gray-300 hover:bg-white/[0.08]"
                          : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B] hover:border-[#A9C632]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-[#C8D2A6] dark:border-[#3D543A] flex items-center justify-between gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl text-[#546E50] hover:text-[#1D2E1B] dark:hover:text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2.5 px-5 bg-[#1D2E1B] hover:bg-[#2D442A] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] dark:hover:bg-[#96B228] font-bold rounded-xl shadow-md transition-all text-center cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
