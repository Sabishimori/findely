"use client";

import React from "react";
import { motion, Variants } from "motion/react";

interface TextEffectProps {
  children: string;
  per?: "word" | "char" | "line";
  as?: keyof React.JSX.IntrinsicElements;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  delay?: number;
}

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 18,
      stiffness: 140,
    },
  },
};

export function TextEffect({
  children,
  per = "word",
  as: Component = "span",
  variants,
  className = "",
  delay = 0,
}: TextEffectProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: per === "char" ? 0.02 : 0.05,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = variants?.item || defaultItemVariants;

  if (per === "char") {
    const chars = Array.from(children);
    return (
      <motion.span
        variants={variants?.container || containerVariants}
        initial="hidden"
        animate="visible"
        className={`inline-block ${className}`}
      >
        {chars.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            variants={itemVariants}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  // Default: per word
  const words = children.split(" ");
  return (
    <motion.span
      variants={variants?.container || containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-flex flex-wrap ${className}`}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={itemVariants}
          className="inline-block mr-[0.25em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
