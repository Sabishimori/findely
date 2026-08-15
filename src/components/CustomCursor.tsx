"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";
import { 
  playTapSound, 
  playGrabSound, 
  playReleaseSound, 
  playHoverTick 
} from "@/lib/soundFx";

export default function CustomCursor({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);

  // High performance hardware cursor coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Snappy, organic Apple iPadOS spring physics
  const springConfig = { damping: 30, stiffness: 600, mass: 0.22 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const isDraggingRef = useRef(false);
  const dragThresholdTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Track last hovered interactive parent to prevent sounds when hovering text inside cards
  const lastHoveredElementRef = useRef<Element | null>(null);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
      setIsClicking(false);
      setIsDragging(false);
      lastHoveredElementRef.current = null;
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // ── Optimized Interactive Hover Boundary Detection ────────
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Text Inputs / Textareas -> let native text cursor take over
      const textEl = target.closest("input, textarea");
      if (textEl) {
        setIsTextInput(true);
        setIsHovered(false);
        setCursorLabel(null);
        lastHoveredElementRef.current = textEl;
        return;
      }
      setIsTextInput(false);

      // 2. Genuine Interactive Controls (Buttons, links, tabs, card boundaries)
      const interactiveEl = target.closest(
        'button, a, select, [role="button"], .apple-icon-tile, [data-cursor], .interactive-card'
      );

      // Deduplicate: If still hovering inside the same interactive container, DO NOT re-trigger!
      if (interactiveEl) {
        if (lastHoveredElementRef.current !== interactiveEl) {
          lastHoveredElementRef.current = interactiveEl;
          setIsHovered(true);
          playHoverTick(12); // subtle physical micro-delay

          // Optional contextual cursor badge
          const label = interactiveEl.getAttribute("data-cursor-label");
          setCursorLabel(label || null);
        }
      } else {
        if (lastHoveredElementRef.current !== null) {
          lastHoveredElementRef.current = null;
          setIsHovered(false);
          setCursorLabel(null);
        }
      }
    };

    // ── Click & Drag Sound Handling with Tactile Delay ────────
    const handlePointerDown = (e: PointerEvent) => {
      setIsClicking(true);
      playTapSound(10); // 10ms realistic micro-contact delay

      const target = e.target as HTMLElement | null;
      const isDraggableEl = target?.closest(
        '.drag-handle, [data-drag-handle], [draggable="true"], .maplibregl-canvas, .leaflet-container'
      );

      dragThresholdTimer.current = setTimeout(() => {
        if (isDraggableEl) {
          isDraggingRef.current = true;
          setIsDragging(true);
          playGrabSound(12);
        }
      }, 100);
    };

    const handlePointerUp = () => {
      setIsClicking(false);
      if (dragThresholdTimer.current) {
        clearTimeout(dragThresholdTimer.current);
      }

      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        playReleaseSound(8);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible || isTextInput) return null;

  return (
    <aside aria-hidden="true" className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
      {/* ── Single Unified Apple iPadOS Tactile Cursor Orb ── */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isDragging ? 1.4 : isClicking ? 0.78 : isHovered ? 1.85 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 550,
          damping: 30,
        }}
        className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors pointer-events-none ${
          isDragging
            ? "border-2 border-[#A9C632] bg-[#A9C632]/40 shadow-[0_0_20px_rgba(169,198,50,0.6)] backdrop-blur-xs"
            : isHovered
            ? isDarkMode
              ? "border border-[#A9C632] bg-[#A9C632]/25 shadow-[0_0_18px_rgba(169,198,50,0.45)] backdrop-blur-xs"
              : "border border-[#1D2E1B] bg-[#A9C632]/35 shadow-[0_0_16px_rgba(169,198,50,0.4)] backdrop-blur-xs"
            : isDarkMode
            ? "border border-white/30 bg-[#A9C632] shadow-[0_0_12px_rgba(169,198,50,0.5)]"
            : "border border-[#C8D2A6] bg-[#1D2E1B] shadow-[0_0_10px_rgba(29,46,27,0.3)]"
        }`}
      >
        {/* Subtle center specular core */}
        <span
          className={`w-1.5 h-1.5 rounded-full transition-all ${
            isHovered
              ? isDarkMode ? "bg-white" : "bg-[#1D2E1B]"
              : isDarkMode ? "bg-[#1D2E1B]" : "bg-[#A9C632]"
          }`}
        />

        {/* Optional Micro Action Label on Hover (e.g., "Fly", "Drag") */}
        {cursorLabel && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -bottom-5 px-1.5 py-0.5 rounded-md bg-[#1D2E1B] text-[#A9C632] text-[8px] font-extrabold uppercase tracking-wider font-urbanist shadow-md"
          >
            {cursorLabel}
          </motion.span>
        )}
      </motion.div>
    </aside>
  );
}
