"use client";

import { useState } from "react";
import { updateUserProfile } from "@/app/actions";
import { X, Check, Globe, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

function BehanceIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.171 3-3.455 0-5.555-2.477-5.555-5.992 0-3.738 2.378-5.993 5.485-5.993 3.518 0 5.244 2.478 5.244 5.993 0 .393-.03.805-.084 1.233h-7.79c.074 1.761 1.139 2.87 2.696 2.87 1.244 0 2.05-.623 2.355-1.111h2.825zm-2.91-4.241c-.083-1.32-.861-2.227-2.316-2.227-1.381 0-2.257.907-2.43 2.227h4.746zM0 4.5h6.643c2.091 0 3.738.544 4.707 1.603.771.844 1.15 1.905 1.15 3.037 0 1.341-.539 2.457-1.572 3.25 1.488.75 2.272 2.08 2.272 3.725 0 1.345-.487 2.585-1.424 3.535C10.748 20.686 9.07 21 6.848 21H0V4.5zm3.137 6.037h3.042c1.479 0 2.42-.65 2.42-1.745 0-1.12-.916-1.708-2.42-1.708H3.137v3.453zm0 7.426h3.483c1.696 0 2.766-.757 2.766-2.023 0-1.275-1.07-2.052-2.766-2.052H3.137v4.075z"/>
    </svg>
  );
}

export default function EditSocialsModal({
  isOpen,
  onClose,
  initialLinks,
  onUpdated,
  isDarkMode = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialLinks: {
    linkedin_url?: string;
    github_url?: string;
    behance_url?: string;
    instagram_url?: string;
    website_url?: string;
    project_url?: string;
    bio?: string;
  };
  onUpdated?: (updated: any) => void;
  isDarkMode?: boolean;
}) {
  const [form, setForm] = useState(initialLinks);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateUserProfile(form as any);
    setSaving(false);
    setSaved(true);
    if (onUpdated) onUpdated(form);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col border ${
              isDarkMode ? "bg-[#1D2E1B] border-[#3D543A] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
            }`}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between border-[#C8D2A6] dark:border-[#3D543A]">
              <h3 className="font-bold text-sm font-space-grotesk text-[#1D2E1B] dark:text-white">Edit Socials & Portfolio Links</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-[#546E50] hover:text-[#1D2E1B] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
              <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border ${
                isDarkMode ? "bg-[#243822] border-[#3D543A]" : "bg-[#F7F9F2] border-[#C8D2A6]"
              }`}>
                <LinkedinIcon className="w-4 h-4 text-[#0A66C2] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="LinkedIn Profile URL"
                  value={form.linkedin_url || ""}
                  onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                  className="bg-transparent focus:outline-none flex-1 font-mono text-xs text-[#1D2E1B] dark:text-white"
                />
              </div>

              <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border ${
                isDarkMode ? "bg-[#243822] border-[#3D543A]" : "bg-[#F7F9F2] border-[#C8D2A6]"
              }`}>
                <GithubIcon className="w-4 h-4 text-[#1D2E1B] dark:text-gray-200 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="GitHub Profile URL"
                  value={form.github_url || ""}
                  onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                  className="bg-transparent focus:outline-none flex-1 font-mono text-xs text-[#1D2E1B] dark:text-white"
                />
              </div>

              <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border ${
                isDarkMode ? "bg-[#243822] border-[#3D543A]" : "bg-[#F7F9F2] border-[#C8D2A6]"
              }`}>
                <BehanceIcon className="w-4 h-4 text-[#0057FF] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Behance / Portfolio URL"
                  value={form.behance_url || ""}
                  onChange={(e) => setForm({ ...form, behance_url: e.target.value })}
                  className="bg-transparent focus:outline-none flex-1 font-mono text-xs text-[#1D2E1B] dark:text-white"
                />
              </div>

              <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border ${
                isDarkMode ? "bg-[#243822] border-[#3D543A]" : "bg-[#F7F9F2] border-[#C8D2A6]"
              }`}>
                <InstagramIcon className="w-4 h-4 text-[#E4405F] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Instagram URL"
                  value={form.instagram_url || ""}
                  onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                  className="bg-transparent focus:outline-none flex-1 font-mono text-xs text-[#1D2E1B] dark:text-white"
                />
              </div>

              <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border ${
                isDarkMode ? "bg-[#243822] border-[#3D543A]" : "bg-[#F7F9F2] border-[#C8D2A6]"
              }`}>
                <Globe className="w-4 h-4 text-[#A9C632] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Live Personal Website URL"
                  value={form.website_url || ""}
                  onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                  className="bg-transparent focus:outline-none flex-1 font-mono text-xs text-[#1D2E1B] dark:text-white"
                />
              </div>

              <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border ${
                isDarkMode ? "bg-[#243822] border-[#3D543A]" : "bg-[#F7F9F2] border-[#C8D2A6]"
              }`}>
                <Sparkles className="w-4 h-4 text-[#A9C632] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Featured Project Demo URL"
                  value={form.project_url || ""}
                  onChange={(e) => setForm({ ...form, project_url: e.target.value })}
                  className="bg-transparent focus:outline-none flex-1 font-mono text-xs text-[#1D2E1B] dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-[#546E50] hover:text-[#1D2E1B] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-1.5 bg-[#1D2E1B] hover:bg-[#2D442A] text-white dark:bg-[#A9C632] dark:text-[#1D2E1B] font-bold rounded-xl shadow-md flex items-center gap-1 cursor-pointer"
                >
                  {saved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#A9C632]" />
                      <span>Updated!</span>
                    </>
                  ) : saving ? (
                    <span>Saving...</span>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
