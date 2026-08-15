"use client";

import { useState } from "react";
import { submitCompanyRequest } from "@/app/actions";
import { X, Loader2, Bot, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AddCompanyModal({
  isOpen,
  onClose,
  onAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (companyId: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      website_url: formData.get("website_url") as string,
      careers_url: formData.get("careers_url") as string || formData.get("website_url") as string,
      location_text: formData.get("location_text") as string,
      description: formData.get("description") as string,
    };

    try {
      const res = await submitCompanyRequest(data);
      onAdded(res.id);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to add company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B0A]/80 backdrop-blur-md font-sans">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md bg-[#0F1412] border border-white/[0.09] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full"
          >
            <div className="px-6 py-5 border-b border-white/[0.07] flex items-center justify-between bg-[#121A16]/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#8EAFA0]/15 border border-[#8EAFA0]/30 flex items-center justify-center text-[#8EAFA0]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-space-grotesk">Request Company</h2>
                  <p className="text-xs text-[#8A9A92]">Anti-fraud AI validation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[#8A9A92] hover:text-white p-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-2xl text-red-300 text-xs">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                    Company Name <span className="text-[#8EAFA0]">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    id="name"
                    placeholder="e.g. Stripe, Acme Corp"
                    className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="website_url" className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                    Website URL <span className="text-[#8EAFA0]">*</span>
                  </label>
                  <input
                    required
                    type="url"
                    name="website_url"
                    id="website_url"
                    placeholder="https://company.com"
                    className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="location_text" className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                    Headquarters / Main Location <span className="text-[#8EAFA0]">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="location_text"
                    id="location_text"
                    placeholder="e.g. San Francisco, CA or London, UK"
                    className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                    Description <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={2}
                    placeholder="What does the company do?"
                    className="w-full px-4 py-2 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0] text-sm resize-none"
                  />
                </div>

                <div className="flex flex-row items-start gap-2.5 bg-[#141C18]/60 p-3 rounded-2xl border border-white/[0.06]">
                  <ShieldCheck className="w-4 h-4 text-[#8EAFA0] flex-shrink-0 mt-0.5" />
                  <label htmlFor="consent" className="text-[11px] text-[#8A9A92] leading-snug">
                    Submitted links are verified by our anti-fraud engine to ensure legitimate career portals.
                  </label>
                </div>
                
                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs font-semibold text-[#8A9A92] hover:text-white bg-transparent border border-white/[0.08] rounded-2xl hover:bg-white/[0.04] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 text-xs font-bold text-[#090C0B] bg-[#8EAFA0] hover:bg-[#A7C9B9] rounded-2xl transition-all shadow-lg shadow-[#8EAFA0]/20 flex items-center justify-center gap-1.5"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request Company"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
