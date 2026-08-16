"use client";

import { useState } from "react";
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Mail, 
  User, 
  Send,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/authContext";
import { playTapSound } from "@/lib/soundFx";

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
  const senderEmail = user?.email || "candidate@gmail.com";

  // Target contact email
  const targetEmail = recipientEmail || `careers@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  const [subject, setSubject] = useState(
    `Application: ${jobTitle} — ${senderName}`
  );
  
  const [body, setBody] = useState(
    `Hi ${hrName || `${companyName} Hiring Team`},\n\nI discovered the ${jobTitle} role at ${companyName} on Findely and wanted to reach out directly to express my strong interest in joining your team.\n\nI specialize in building scalable, high-impact products and have been following ${companyName}'s recent developments closely. I would love the chance to discuss how my skill set and background can help accelerate your engineering and product goals.\n\nYou can find more about my past work and projects on my portfolio/LinkedIn. Looking forward to connecting!\n\nBest regards,\n${senderName}\n${senderEmail}`
  );

  // Copy Feedback State
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: "email" | "subject" | "body" | "all") => {
    playTapSound();
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else if (type === "subject") {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else if (type === "body") {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    } else if (type === "all") {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    }
  };

  const handleCopyAll = () => {
    const fullText = `To: ${targetEmail}\nSubject: ${subject}\n\n${body}`;
    handleCopy(fullText, "all");
  };

  const handleOpenGmail = () => {
    playTapSound();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md font-urbanist select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`w-full max-w-xl rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border backdrop-blur-2xl ${
            isDarkMode
              ? "bg-[#1D2E1B]/95 border-[#3D543A] text-white"
              : "bg-white/95 border-[#C8D2A6] text-[#1D2E1B]"
          }`}
        >
          {/* Header */}
          <div className={`px-7 py-5 border-b flex items-center justify-between ${
            isDarkMode ? "border-[#3D543A] bg-white/[0.02]" : "border-[#C8D2A6]/60 bg-[#F7F9F2]"
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 apple-icon-tile bg-[#1D2E1B] text-[#A9C632] border border-[#C8D2A6]/40 dark:border-white/10 flex items-center justify-center shadow-md">
                <Mail className="w-5 h-5 text-[#A9C632]" />
              </div>
              <div>
                <h3 className="font-black text-lg text-[#1D2E1B] dark:text-white">
                  Direct Outreach & Cold Email
                </h3>
                <p className="text-xs font-semibold text-[#546E50] dark:text-[#C8D2A6]">
                  Personalized pitch for <strong className="text-[#1D2E1B] dark:text-white">{companyName}</strong>
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-7 overflow-y-auto space-y-4 text-xs">
            
            {/* 1. Recipient Email Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold uppercase tracking-wider text-[11px] text-[#546E50] dark:text-[#C8D2A6] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#A9C632]" />
                  <span>Send To ({hrName ? `${hrName}` : "Hiring Lead"})</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleCopy(targetEmail, "email")}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#A9C632] hover:underline cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-[#A9C632]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmail ? "Copied Email!" : "Copy Email"}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={targetEmail}
                  className={`w-full px-4 py-2.5 rounded-2xl border text-xs font-mono select-all focus:outline-none ${
                    isDarkMode
                      ? "bg-[#243822] border-[#3D543A] text-white"
                      : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B]"
                  }`}
                />
              </div>
            </div>

            {/* 2. Subject Line Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold uppercase tracking-wider text-[11px] text-[#546E50] dark:text-[#C8D2A6] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#A9C632]" />
                  <span>Subject Line</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleCopy(subject, "subject")}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#A9C632] hover:underline cursor-pointer"
                >
                  {copiedSubject ? <Check className="w-3 h-3 text-[#A9C632]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSubject ? "Copied Subject!" : "Copy Subject"}</span>
                </button>
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs font-semibold focus:outline-none focus:border-[#A9C632] ${
                  isDarkMode
                    ? "bg-[#243822] border-[#3D543A] text-white"
                    : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B]"
                }`}
              />
            </div>

            {/* 3. Editable Message Body */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold uppercase tracking-wider text-[11px] text-[#546E50] dark:text-[#C8D2A6] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A9C632]" />
                  <span>Email Body (Editable)</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleCopy(body, "body")}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#A9C632] hover:underline cursor-pointer"
                >
                  {copiedBody ? <Check className="w-3 h-3 text-[#A9C632]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedBody ? "Copied Body!" : "Copy Body"}</span>
                </button>
              </div>
              <textarea
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={`w-full p-4 rounded-2xl border text-xs leading-relaxed font-sans focus:outline-none focus:border-[#A9C632] resize-none ${
                  isDarkMode
                    ? "bg-[#243822] border-[#3D543A] text-white"
                    : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B]"
                }`}
              />
            </div>

            {/* Bottom Actions: Copy Everything or Open in Gmail */}
            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyAll}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl font-bold text-xs border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-[#A9C632]/15 text-[#1D2E1B] dark:text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                {copiedAll ? <Check className="w-4 h-4 text-[#A9C632]" /> : <Copy className="w-4 h-4 text-[#A9C632]" />}
                <span>{copiedAll ? "Entire Message Copied!" : "Copy Entire Pitch for Gmail"}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenGmail}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer bg-[#1D2E1B] text-white hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B] dark:hover:bg-[#96B228]"
              >
                <span>Open in Gmail</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
