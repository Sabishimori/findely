"use client";

import React from "react";
import { motion } from "motion/react";

interface BorderTrailProps {
  className?: string;
  size?: number;
  duration?: number;
  color?: string;
}

export function BorderTrail({
  className = "",
  size = 60,
  duration = 6,
  color = "#A9C632",
}: BorderTrailProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          border: `1px solid transparent`,
        }}
      />
      <motion.div
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          offsetPath: `rect(0 100% 100% 0 round 24px)`,
          position: "absolute",
        }}
      />
    </div>
  );
}
