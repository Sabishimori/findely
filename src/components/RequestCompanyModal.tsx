"use client";

import { useState } from "react";
import { submitCompanyRequest } from "@/app/actions";
import { X, Loader2, Bot, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function RequestCompanyModal({
  isOpen,
  onClose,
  onSubmitted,
  isDarkMode = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  isDarkMode?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      website_url: formData.get("website_url") as string,
      careers_url: formData.get("careers_url") as string,
      location_text: formData.get("location_text") as string,
      description: formData.get("description") as string,
      submitted_by_email: formData.get("email") as string,
    };

    try {
      await submitCompanyRequest(data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSubmitted) onSubmitted();
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Unable to submit company request. Please check details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border ${
              isDarkMode
                ? "bg-[#1D2E1B] border-[#3D543A] text-white"
                : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
            }`}
          >
            {/* Header */}
            <div className={`px-6 py-5 border-b flex items-center justify-between ${
              isDarkMode ? "bg-white/[0.02] border-[#3D543A]" : "bg-[#F7F9F2] border-[#C8D2A6]"
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#A9C632]/20 border border-[#A9C632]/40 flex items-center justify-center text-[#A9C632]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-space-grotesk text-[#1D2E1B] dark:text-white">Request / Ingest Company</h2>
                  <p className="text-xs text-[#546E50] dark:text-[#C8D2A6]">Automated AI verification & careers scanner</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#546E50] hover:text-[#1D2E1B] dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="overflow-y-auto p-6 text-xs">
              {success ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#A9C632]/20 text-[#A9C632] flex items-center justify-center mx-auto border border-[#A9C632]/40 animate-bounce">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold font-space-grotesk text-[#1D2E1B] dark:text-white">Request Ingested!</h3>
                  <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] max-w-sm mx-auto">
                    Our AI crawler has queued this company&apos;s careers portal. Approved listings will automatically appear on the 2.5D map.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#546E50] dark:text-[#C8D2A6] font-mono mb-1.5">
                      Company Name <span className="text-[#A9C632]">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="e.g. Anthropic, Linear, Cohere"
                      className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode
                          ? "bg-[#243822] text-white border-[#3D543A]"
                          : "bg-white text-[#1D2E1B] border-[#C8D2A6]"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#546E50] dark:text-[#C8D2A6] font-mono mb-1.5">
                        Website URL <span className="text-[#A9C632]">*</span>
                      </label>
                      <input
                        required
                        type="url"
                        name="website_url"
                        placeholder="https://example.com"
                        className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:border-[#A9C632] ${
                          isDarkMode
                            ? "bg-[#243822] text-white border-[#3D543A]"
                            : "bg-white text-[#1D2E1B] border-[#C8D2A6]"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#546E50] dark:text-[#C8D2A6] font-mono mb-1.5">
                        Careers Page URL <span className="text-[#A9C632]">*</span>
                      </label>
                      <input
                        required
                        type="url"
                        name="careers_url"
                        placeholder="https://example.com/careers"
                        className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:border-[#A9C632] ${
                          isDarkMode
                            ? "bg-[#243822] text-white border-[#3D543A]"
                            : "bg-white text-[#1D2E1B] border-[#C8D2A6]"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#546E50] dark:text-[#C8D2A6] font-mono mb-1.5">
                      Headquarters / City <span className="text-[#A9C632]">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="location_text"
                      placeholder="e.g. San Francisco, CA or London, UK"
                      className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode
                          ? "bg-[#243822] text-white border-[#3D543A]"
                          : "bg-white text-[#1D2E1B] border-[#C8D2A6]"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#546E50] dark:text-[#C8D2A6] font-mono mb-1.5">
                      Short Description <span className="text-[#546E50] font-normal">(Optional)</span>
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      placeholder="Brief overview of product, mission, and hiring focus..."
                      className={`w-full p-3 rounded-xl border focus:outline-none focus:border-[#A9C632] resize-none leading-relaxed ${
                        isDarkMode
                          ? "bg-[#243822] text-white border-[#3D543A]"
                          : "bg-white text-[#1D2E1B] border-[#C8D2A6]"
                      }`}
                    />
                  </div>

                  {/* Anti-Fraud Notice */}
                  <div className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                    isDarkMode
                      ? "bg-white/[0.02] border-[#3D543A]"
                      : "bg-[#F7F9F2] border-[#C8D2A6]"
                  }`}>
                    <ShieldCheck className="w-5 h-5 text-[#A9C632] flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#546E50] dark:text-[#C8D2A6] leading-relaxed">
                      Our automated AI parser will crawl the provided careers endpoint, verify corporate SSL, and prevent fraudulent duplicate listings.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 text-xs font-bold text-white bg-[#1D2E1B] hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B] dark:hover:bg-[#96B228] rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit for AI Scan"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
