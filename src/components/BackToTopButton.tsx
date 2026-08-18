"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playTapSound } from "@/lib/soundFx";

interface BackToTopButtonProps {
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  isDarkMode?: boolean;
}

export default function BackToTopButton({
  scrollContainerRef,
  isDarkMode = false,
}: BackToTopButtonProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = scrollContainerRef?.current || window;

    const handleScroll = () => {
      let scrollY = 0;
      if (scrollContainerRef?.current) {
        scrollY = scrollContainerRef.current.scrollTop;
      } else {
        scrollY = window.scrollY;
      }
      setShow(scrollY > 400);
    };

    if (scrollContainerRef?.current) {
      const el = scrollContainerRef.current;
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [scrollContainerRef]);

  const scrollToTop = () => {
    playTapSound();
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          aria-label="Back to Top"
          className={`fixed bottom-6 left-6 z-40 w-11 h-11 rounded-2xl border shadow-xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-xl ${
            isDarkMode
              ? "bg-[#1D2E1B]/90 border-[#3D543A] text-[#A9C632] hover:bg-[#1D2E1B]"
              : "bg-white/90 border-[#C8D2A6] text-[#1D2E1B] hover:bg-white"
          }`}
          title="Back to Top ↑"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
