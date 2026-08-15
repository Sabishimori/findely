"use client";

import { motion } from "motion/react";

export function ScribbleUnderline({
  className = "text-[#4E9B78]",
  width = 120,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
      width={width}
      height="12"
      viewBox="0 0 120 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M2 8.5C28 2.5 75 1.5 118 6.5C85 10 35 11.5 14 9.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

export function ScribbleCircle({
  className = "text-[#4E9B78]",
}: {
  className?: string;
}) {
  return (
    <svg
      width="64"
      height="36"
      viewBox="0 0 64 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M32 3C14 3 3 10 3 18C3 26 16 33 34 33C52 33 61 25 61 18C61 9 45 3 30 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function ScribbleArrow({
  className = "text-[#4E9B78]",
}: {
  className?: string;
}) {
  return (
    <svg
      width="48"
      height="28"
      viewBox="0 0 48 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M4 22C16 10 32 6 42 12M42 12L36 6M42 12L37 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </svg>
  );
}
