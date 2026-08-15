"use client";

import React from "react";
import { motion } from "motion/react";

interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  direction?: "left" | "right";
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 24,
  duration = 25,
  direction = "left",
  className = "",
}: InfiniteSliderProps) {
  return (
    <div className={`overflow-hidden select-none flex ${className}`}>
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex shrink-0 items-center"
        style={{ gap: `${gap}px` }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
