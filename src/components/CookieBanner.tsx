"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Cookie, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playTapSound } from "@/lib/soundFx";

interface CookieBannerProps {
  onOpenPrivacy?: () => void;
  isDarkMode?: boolean;
}

export default function CookieBanner({
  onOpenPrivacy,
  isDarkMode = false,
}: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("findely_cookie_consent");
      if (!consent) {
        // Show after a brief non-intrusive delay
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleAccept = () => {
    playTapSound();
    try {
      localStorage.setItem("findely_cookie_consent", "accepted");
    } catch (e) {}
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-[92vw] sm:w-auto p-4 rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all"
          style={{
            backgroundColor: isDarkMode ? "rgba(29, 46, 27, 0.95)" : "rgba(255, 255, 255, 0.95)",
            borderColor: isDarkMode ? "rgba(61, 84, 58, 0.8)" : "rgba(200, 210, 166, 0.9)",
          }}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#A9C632]/20 flex items-center justify-center text-[#1D2E1B] dark:text-[#A9C632] shrink-0 mt-0.5">
              <Cookie className="w-4 h-4" />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-black text-[#1D2E1B] dark:text-white">
                  Privacy & Cookie Notice
                </h4>
                <button
                  onClick={handleAccept}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-[#546E50] dark:text-[#C8D2A6] leading-relaxed font-medium">
                We use essential cookies & local storage for map coordinates, theme settings, and direct ATS routing. No tracker cookies or third-party ads.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleAccept}
                  className="px-3.5 py-1.5 rounded-xl bg-[#A9C632] text-[#1D2E1B] text-[11px] font-black hover:brightness-105 transition-all shadow-xs cursor-pointer"
                >
                  Got It!
                </button>

                {onOpenPrivacy && (
                  <button
                    onClick={() => {
                      playTapSound();
                      onOpenPrivacy();
                    }}
                    className="px-2.5 py-1.5 text-[11px] font-bold text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Privacy Policy</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
