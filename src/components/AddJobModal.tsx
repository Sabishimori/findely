"use client";

import { useState } from "react";
import { addJob } from "@/app/actions";
import { X, Loader2, Plus, Building2, MapPin, Link as LinkIcon } from "lucide-react";
import { motion } from "motion/react";

export default function AddJobModal({ 
  companyId, 
  companyName, 
  onClose, 
  onSuccess 
}: { 
  companyId: string; 
  companyName: string; 
  onClose: () => void; 
  onSuccess: () => void; 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const location_text = formData.get("location_text") as string;
    const apply_url = formData.get("apply_url") as string;

    try {
      await addJob({
        company_id: companyId,
        title,
        location_text,
        apply_url,
      });
      onSuccess();
    } catch (err) {
      setError("Failed to add job. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B0A]/80 backdrop-blur-md font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-md bg-[#0F1412] border border-white/[0.09] rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-5 border-b border-white/[0.07] bg-[#121A16]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8EAFA0]/15 border border-[#8EAFA0]/30 flex items-center justify-center text-[#8EAFA0]">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-space-grotesk">Contribute Vacancy</h2>
              <p className="text-xs text-[#8A9A92]">{companyName}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-[#8A9A92] hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-2xl text-red-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
              Role Title <span className="text-[#8EAFA0]">*</span>
            </label>
            <input 
              required
              id="title"
              name="title"
              type="text" 
              placeholder="e.g. Staff Distributed Systems Engineer"
              className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0] text-sm"
            />
          </div>

          <div>
            <label htmlFor="location_text" className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
              Location <span className="text-[#8EAFA0]">*</span>
            </label>
            <input 
              required
              id="location_text"
              name="location_text"
              type="text" 
              placeholder="e.g. San Francisco, CA or Remote"
              className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0] text-sm"
            />
          </div>

          <div>
            <label htmlFor="apply_url" className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
              Direct Application URL <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <input 
              id="apply_url"
              name="apply_url"
              type="url" 
              placeholder="https://company.com/careers/role"
              className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0] text-sm"
            />
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
              className="px-6 py-2.5 bg-[#8EAFA0] hover:bg-[#A7C9B9] text-[#090C0B] font-bold text-xs rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-lg shadow-[#8EAFA0]/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Role'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
