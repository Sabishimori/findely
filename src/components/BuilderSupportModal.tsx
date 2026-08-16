"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Zap,
  Gift
} from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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

function PayPalIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.006.417 5.421.05 5.91.05h6.666c3.486 0 5.617 1.637 5.093 5.485-.45 3.308-2.483 5.21-5.32 5.21H8.718l-1.026 8.358a.64.64 0 0 1-.616.534z" />
    </svg>
  );
}

interface BuilderSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export default function BuilderSupportModal({
  isOpen,
  onClose,
  isDarkMode = false,
}: BuilderSupportModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPledge, setSelectedPledge] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>("");

  const paypalUsername = "Sagar1502";
  const paypalUrl = "https://paypal.me/Sagar1502";

  // Calculate active donation amount
  const activeAmount = customAmount && !isNaN(Number(customAmount)) && Number(customAmount) > 0
    ? Number(customAmount)
    : selectedPledge;

  const dynamicPaypalUrl = `https://paypal.me/${paypalUsername}/${activeAmount}`;

  const handleCopyPaypal = () => {
    navigator.clipboard.writeText(paypalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md font-urbanist select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border p-6 ${
              isDarkMode 
                ? "bg-[#1D2E1B] border-[#546E50] text-white" 
                : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#C8D2A6] dark:border-[#546E50]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#A9C632]/20 border border-[#A9C632]/40 flex items-center justify-center text-[#1D2E1B] dark:text-[#A9C632]">
                  <Heart className="w-5 h-5 text-[#A9C632] fill-[#A9C632]/40" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight text-[#1D2E1B] dark:text-white flex items-center gap-2">
                    <span>Support the Builder</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/40">
                      100% Free Tool
                    </span>
                  </h3>
                  <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] mt-0.5">
                    Keeping Findely open, ad-free, and accessible for everyone
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#546E50] hover:text-[#1D2E1B] dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4 text-xs">
              
              {/* Creator Bio & Mission Card */}
              <div className="p-4 rounded-2xl bg-[#F7F9F2] dark:bg-white/[0.03] border border-[#C8D2A6] dark:border-[#546E50] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A9C632] animate-ping" />
                    <span className="font-bold text-xs">Direct Creator Line</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0070BA] bg-[#0070BA]/10 dark:text-[#45a2e5] px-2 py-0.5 rounded-md flex items-center gap-1">
                    <PayPalIcon className="w-3 h-3" />
                    <span>Verified PayPal</span>
                  </span>
                </div>
                <p className="text-[#546E50] dark:text-[#C8D2A6] leading-relaxed">
                  Findely is built with 60fps mechanical shaders, live startup discovery engines, and multi-tenant telemetry. If Findely helped you find interviews or build your startup, any contribution helps fuel server infrastructure and database costs!
                </p>

                {/* Fun Open-to-Work Callout */}
                <div className="p-2.5 rounded-xl bg-[#A9C632]/10 border border-[#A9C632]/30 text-[11px] text-[#1D2E1B] dark:text-white leading-snug">
                  <span className="font-extrabold text-[#A9C632] block">👀 Fun note: Yes, I'm open to work!</span>
                  Want to hire me? I do UI/UX design, understand product deeply, and vibe code fast full-stack apps from scratch. Let's chat!
                </div>

                {/* Social Connect Links */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://github.com/Sabishimori"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#C8D2A6] dark:border-[#546E50] hover:border-[#A9C632] text-xs font-semibold transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href="https://x.com/sagar__ux"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#C8D2A6] dark:border-[#546E50] hover:border-[#A9C632] text-xs font-semibold transition-colors"
                  >
                    <TwitterIcon className="w-3.5 h-3.5" />
                    <span>Twitter / X</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/sagar-s-510aa4232/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#C8D2A6] dark:border-[#546E50] hover:border-[#A9C632] text-xs font-semibold transition-colors"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* PayPal Contribution Card */}
              <div className="space-y-3.5 p-4 rounded-2xl border border-[#C8D2A6] dark:border-[#546E50] bg-white/60 dark:bg-white/[0.02]">
                
                {/* Preset Amount Grid */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">
                    Choose Your Contribution Amount
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { amount: 1, label: "$1 · Micro" },
                      { amount: 3, label: "$3 · Matcha" },
                      { amount: 5, label: "$5 · Coffee" },
                      { amount: 10, label: "$10 · Server" },
                    ].map((item) => (
                      <button
                        key={item.amount}
                        onClick={() => {
                          setSelectedPledge(item.amount);
                          setCustomAmount("");
                        }}
                        className={`p-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer text-center ${
                          selectedPledge === item.amount && !customAmount
                            ? "bg-[#A9C632] text-[#1D2E1B] border-[#A9C632] shadow-sm scale-102"
                            : "bg-[#F7F9F2] dark:bg-white/5 border-[#C8D2A6] text-[#546E50] hover:border-[#A9C632]"
                        }`}
                      >
                        <span className="block font-extrabold text-sm">${item.amount}</span>
                        <span className="text-[10px] block opacity-80">{item.label.split(" · ")[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Section */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">
                    Or Enter Any Custom Amount ($)
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-[#546E50] dark:text-[#C8D2A6] font-bold text-sm">
                      $
                    </div>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Enter custom amount (e.g. 2, 7, 25, 50, 100)"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#C8D2A6] dark:border-[#546E50] bg-white dark:bg-white/5 text-xs font-bold focus:outline-none focus:border-[#A9C632] placeholder:text-[#546E50]/50"
                    />
                  </div>
                </div>

                {/* 1-Click Action & Copy PayPal Link */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <a
                    href={dynamicPaypalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-102"
                  >
                    <PayPalIcon className="w-4 h-4" />
                    <span>Proceed with ${activeAmount} on PayPal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>

                  <button
                    onClick={handleCopyPaypal}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#C8D2A6] hover:bg-black/5 dark:hover:bg-white/10 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    title="Copy PayPal Handle"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#A9C632]" />
                        <span className="text-[#A9C632]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#546E50] dark:text-[#C8D2A6]" />
                        <span>Copy PayPal Link</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-center text-[#546E50] dark:text-[#C8D2A6] font-mono">
                  Direct Handle: <span className="font-bold text-[#0070BA] dark:text-[#45a2e5]">paypal.me/{paypalUsername}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#C8D2A6] dark:border-[#546E50]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#546E50] dark:text-[#C8D2A6]">
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span>Thank you for supporting open career tools</span>
              </div>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 font-bold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
