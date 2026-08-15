"use client";

import { useState } from "react";
import { X, Send, Paperclip, Sparkles, Building2, User, Check, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/authContext";

export default function EmailOutreachModal({
  isOpen,
  onClose,
  companyName,
  jobTitle,
  recipientEmail,
  hrName,
  isDarkMode = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  jobTitle: string;
  recipientEmail?: string;
  hrName?: string;
  isDarkMode?: boolean;
}) {
  const { user } = useAuth();
  const senderName = user?.name || "Candidate";
  const senderEmail = user?.email || "candidate@email.com";

  const [subject, setSubject] = useState(
    `Application: ${jobTitle} — ${senderName}`
  );
  const [body, setBody] = useState(
    `Hi ${hrName || "Hiring Team"},\n\nI came across the ${jobTitle} opening at ${companyName} on Findely and wanted to express my strong interest in joining the team.\n\nWith extensive experience in high-performance product development and modern engineering systems, I would love the opportunity to contribute to ${companyName}'s mission.\n\nI have attached my resume and dossier for your review. Looking forward to connecting!\n\nBest regards,\n${senderName}\n${senderEmail}`
  );
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendDraft = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border ${
              isDarkMode
                ? "bg-[#0C100E] border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            {/* Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              isDarkMode ? "bg-white/[0.02] border-white/[0.08]" : "bg-gray-50/80 border-gray-200"
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#4E9B78]/15 text-[#4E9B78] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base font-space-grotesk">Quick Outreach Email</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Draft direct message to {companyName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto">
              {sentSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#4E9B78]/15 text-[#4E9B78] flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-bold text-lg font-space-grotesk">Outreach Prepared!</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                    Your application message has been generated and ready for direct forwarding to {companyName}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendDraft} className="space-y-4 text-xs">
                  {/* Recipient */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[10px] font-mono text-gray-400 mb-1">
                      To
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={`${hrName ? `${hrName} · ` : ""}${recipientEmail || `careers@${companyName.toLowerCase().replace(/\s+/g, '')}.com`}`}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono select-all focus:outline-none ${
                        isDarkMode
                          ? "bg-[#141B18] text-gray-300 border-white/10"
                          : "bg-gray-50 text-gray-800 border-gray-200"
                      }`}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[10px] font-mono text-gray-400 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#4E9B78] ${
                        isDarkMode
                          ? "bg-[#141B18] text-white border-white/15"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>

                  {/* Message Body */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold uppercase tracking-wider text-[10px] font-mono text-gray-400">
                        Message Body
                      </label>
                      <span className="text-[10px] text-[#4E9B78] font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Auto-Formatted
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className={`w-full p-3.5 rounded-2xl border text-xs focus:outline-none focus:border-[#4E9B78] resize-none leading-relaxed font-sans ${
                        isDarkMode
                          ? "bg-[#141B18] text-white border-white/15"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>

                  {/* Attachment Pill */}
                  <div className={`flex items-center gap-2 p-2.5 rounded-2xl border ${
                    isDarkMode
                      ? "bg-white/[0.03] border-white/10 text-gray-300"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}>
                    <Paperclip className="w-4 h-4 text-[#4E9B78]" />
                    <span className="font-semibold">Alex_Rivera_Resume_2026.pdf</span>
                    <span className="text-[10px] text-gray-400 font-mono ml-auto">184 KB</span>
                  </div>

                  {/* Notice */}
                  <p className="text-[11px] text-gray-400 italic">
                    Note: Email dispatcher integration preview mode. Direct transmission is staged.
                  </p>

                  <div className="pt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#4E9B78] hover:bg-[#3E8564] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Prepare Outreach</span>
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
