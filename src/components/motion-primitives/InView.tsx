"use client";

import React, { useRef } from "react";
import { useInView, motion, Variants } from "motion/react";

interface InViewProps {
  children: React.ReactNode;
  variants?: Variants;
  transition?: any;
  viewOptions?: Parameters<typeof useInView>[1];
  className?: string;
  delay?: number;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions = { once: true, margin: "-40px" },
  className = "",
  delay = 0,
}: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewOptions);

  const customTransition = transition || {
    duration: 0.6,
    delay,
    ease: [0.21, 0.47, 0.32, 0.98],
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={customTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
