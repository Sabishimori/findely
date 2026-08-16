"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Compass, 
  MapPin, 
  Briefcase, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe2,
  Users,
  Flame,
  Clock,
  Heart,
  Copy,
  Check,
  Radar,
  Lock,
  Sun,
  Moon,
  Mail,
  Send
} from "lucide-react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import { playTapSound } from "@/lib/soundFx";
import { useAuth } from "@/lib/authContext";

// ── Motion Utility Components ─────────────────────────────────────
function InView({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.5 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {value.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

function InfiniteSlider({ children, gap = 24, duration = 25 }: { children: React.ReactNode; gap?: number; duration?: number }) {
  return (
    <div className="overflow-hidden w-full select-none py-2">
      <motion.div
        className="flex shrink-0 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        style={{ gap: `${gap}px` }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// ── Hand-Drawn SVG Accents ─────────────────────────────────────────
// ── Hand-Drawn SVG Accents (Lottie-Style Organic Animated Scribbles) ──
function HandDrawnUnderline({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 340 24" 
      fill="none" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Primary Smooth Hand Swoosh */}
      <motion.path
        d="M 4,13 C 58,6 178,3 336,8 C 250,15 128,17 28,15 C 102,14 228,11 312,13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{
          duration: 1.25,
          delay: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </svg>
  );
}

function HandDrawnCircle({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block px-2.5 py-0.5">
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 260 70"
        fill="none"
        preserveAspectRatio="none"
        className="absolute -inset-x-3 -inset-y-1.5 w-[calc(100%+24px)] h-[calc(100%+12px)] text-[#A9C632] pointer-events-none -z-0 overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Fluid Loop */}
        <motion.path
          d="M 28,34 C 25,18 58,11 130,8 C 205,5 246,14 250,33 C 254,51 210,63 128,64 C 52,65 14,54 11,35 C 8,16 52,9 122,7 C 178,5 235,11 246,24"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.88 }}
          transition={{
            duration: 1.2,
            delay: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
        {/* Soft Organic Micro-Accent */}
        <motion.path
          d="M 38,40 C 72,56 182,58 228,44"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{
            duration: 0.9,
            delay: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </svg>
    </span>
  );
}

function HandDrawnArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 50" fill="none" className={`w-14 h-10 ${className}`} xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M 6,10 C 22,22 38,33 58,37"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 0.7, delay: 1.0, ease: "easeOut" }}
      />
      <motion.path
        d="M 45,41 L 58,37 L 53,24"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 0.45, delay: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
}

function WarpSpearIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 3L14.5 21L10 14L3 9.5L21 3Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14L21 3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Main Responsive Landing Page Component ─────────────────────────
export default function LandingPage({
  onLaunchWorkspace,
  totalJobsCount = 176,
  totalCompaniesCount = 850,
  isDarkMode = false,
  onToggleDarkMode,
}: {
  onLaunchWorkspace: (companyName?: string) => void;
  totalJobsCount?: number;
  totalCompaniesCount?: number;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}) {
  const { openAuthModal, user } = useAuth();
  const [activeTabPreview, setActiveTabPreview] = useState<"map" | "dossier" | "tracker">("map");
  const [copiedPaypal, setCopiedPaypal] = useState(false);
  const [landingDonationAmount, setLandingDonationAmount] = useState<string>("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [countdown, setCountdown] = useState("03h : 42m : 18s");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const nextCrawl = new Date();
      nextCrawl.setUTCHours(24, 0, 0, 0); // Next midnight UTC
      const diffMs = nextCrawl.getTime() - now.getTime();
      if (diffMs <= 0) {
        setCountdown("Sync In Progress...");
      } else {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setCountdown(
          `${String(hours).padStart(2, "0")}h : ${String(minutes).padStart(2, "0")}m : ${String(seconds).padStart(2, "0")}s`
        );
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll Container Ref for Parallax
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 24,
    restDelta: 0.001,
  });

  // Parallax Transformations
  const heroY = useTransform(smoothProgress, [0, 0.35], [0, -70]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.28], [1, 0.25]);

  // Mockup Parallax
  const mockupRotateX = useTransform(smoothProgress, [0, 0.35], [10, 0]);
  const mockupScale = useTransform(smoothProgress, [0, 0.35], [0.94, 1]);
  const mockupY = useTransform(smoothProgress, [0, 0.45], [50, -20]);

  // Floating Badges Parallax Offsets
  const badge2Y = useTransform(smoothProgress, [0, 0.5], [40, -140]);

  const handleLaunchClick = (e?: React.MouseEvent | string) => {
    playTapSound();
    if (!user) {
      openAuthModal();
      return;
    }
    if (typeof e === "string") {
      onLaunchWorkspace(e);
    } else {
      onLaunchWorkspace();
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    playTapSound();
    setNewsletterSubscribed(true);
  };

  return (
    <div 
      ref={scrollContainerRef}
      className={`w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth font-urbanist selection:bg-[#A9C632] selection:text-[#1D2E1B] relative ${
        isDarkMode ? "bg-[#0C140B] text-white" : "bg-[#F7F9F2] text-[#1D2E1B]"
      }`}
    >
      
      {/* ── Background Blueprint Dot Grid ───────────── */}
      <div 
        className="fixed inset-0 pointer-events-none -z-20 opacity-20"
        style={{
          backgroundImage: isDarkMode
            ? `radial-gradient(circle at 1px 1px, rgba(169, 198, 50, 0.5) 1.2px, transparent 0)`
            : `radial-gradient(circle at 1px 1px, rgba(29, 46, 27, 0.4) 1.2px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Ambient Floating Blobs ─────────────────────────────────── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#A9C632]/12 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-10 w-[450px] h-[450px] bg-[#34A853]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* ── 1. Floating Header Navigation ─────────────────────────── */}
      <header className="sticky top-4 z-40 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`flex items-center justify-between px-5 py-3 rounded-[26px] backdrop-blur-2xl border shadow-xl transition-colors ${
            isDarkMode 
              ? "bg-[#1D2E1B]/90 border-[#3D543A] text-white" 
              : "bg-white/90 border-[#C8D2A6] text-[#1D2E1B]"
          }`}
        >
          {/* Brand Logo & Name */}
          <div 
            onClick={() => handleLaunchClick()}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#1D2E1B] p-1 flex items-center justify-center border border-[#C8D2A6]/50 shadow-md group-hover:scale-105 transition-transform overflow-hidden relative">
              <img src="/findely cool with a bg.svg" alt="Findely Cool Mascot" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight block leading-none">
                  FINDELY
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/40 tracking-wider">
                  <span>COOL</span>
                  <span>🕶️</span>
                </span>
              </div>
              <span className="text-[11px] font-extrabold text-[#546E50] dark:text-[#C8D2A6] tracking-wider uppercase mt-0.5 block">
                Spatial Career Engine
              </span>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-extrabold text-[#546E50] dark:text-[#C8D2A6]">
            <a href="#how-it-works" className="hover:text-[#1D2E1B] dark:hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-[#1D2E1B] dark:hover:text-white transition-colors">
              The Experience
            </a>
            <a href="#why-i-built-this" className="hover:text-[#1D2E1B] dark:hover:text-white transition-colors">
              The Story
            </a>
            <a href="#donate" className="hover:text-[#1D2E1B] dark:hover:text-white transition-colors">
              Support Free Tier
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {onToggleDarkMode && (
              <Magnetic strength={0.2}>
                <button
                  onClick={onToggleDarkMode}
                  className="p-2.5 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-[#A9C632]/10 text-[#546E50] dark:text-[#C8D2A6] transition-colors cursor-pointer"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-[#A9C632]" /> : <Moon className="w-4 h-4 text-[#1D2E1B]" />}
                </button>
              </Magnetic>
            )}

            {!user && (
              <Magnetic strength={0.2}>
                <button
                  onClick={() => {
                    playTapSound();
                    openAuthModal();
                  }}
                  className="px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border border-[#C8D2A6] dark:border-[#3D543A] hover:bg-[#A9C632]/10 text-[#1D2E1B] dark:text-white transition-all cursor-pointer"
                >
                  Sign In
                </button>
              </Magnetic>
            )}

            <Magnetic strength={0.25}>
              <button
                onClick={handleLaunchClick}
                className="group flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all hover:scale-102 cursor-pointer bg-[#1D2E1B] text-white hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B] dark:hover:bg-[#96B228]"
              >
                <span>{user ? "Enter Workspace" : "Launch App"}</span>
                <WarpSpearIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Magnetic>
          </div>
        </motion.div>
      </header>

      {/* ── 2. Hero Section: Modern 20's Tech Tone ─────────── */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-20 pb-12 px-4 sm:px-6 max-w-6xl mx-auto text-center"
      >
        {/* Floater 1: Anthropic SF Floater Badge */}
        <motion.div
          animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#1D2E1B]/90 border border-[#C8D2A6] dark:border-[#3D543A] shadow-xl absolute top-12 -left-8 z-20 text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-[#A9C632]/20 flex items-center justify-center font-black text-xs text-[#1D2E1B] dark:text-[#A9C632]">
            SF
          </div>
          <div>
            <div className="text-xs font-extrabold text-[#1D2E1B] dark:text-white">Anthropic • Mission Bay</div>
            <div className="text-[11px] font-bold text-[#A9C632]">14 Frontier Roles Open</div>
          </div>
        </motion.div>

        {/* Floater 2: Postman BLR Floater Badge */}
        <motion.div
          animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#1D2E1B]/90 border border-[#C8D2A6] dark:border-[#3D543A] shadow-xl absolute top-20 -right-6 z-20 text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center font-black text-xs text-orange-500">
            IN
          </div>
          <div>
            <div className="text-xs font-extrabold text-[#1D2E1B] dark:text-white">Postman • Bengaluru Hub</div>
            <div className="text-[11px] font-bold text-orange-400">48 Eng Positions Hiring</div>
          </div>
        </motion.div>

        {/* Top Badges & Live Countdown */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A9C632]/15 border border-[#A9C632]/40 text-xs sm:text-sm font-extrabold text-[#1D2E1B] dark:text-[#A9C632] shadow-xs"
          >
            <Flame className="w-4 h-4 text-[#A9C632]" />
            <span>100% Direct ATS Pipelines · No Ghost Roles</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-[#1D2E1B]/90 border border-[#C8D2A6] dark:border-[#3D543A] text-xs font-bold text-[#1D2E1B] dark:text-white shadow-xs backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A9C632] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A9C632]"></span>
            </span>
            <span><strong className="text-[#1D2E1B] dark:text-[#A9C632] font-black">+24 Startups</strong> Found Today</span>
            <span className="text-[#C8D2A6] dark:text-[#3D543A]">•</span>
            <span className="font-mono text-[11px] text-[#546E50] dark:text-[#C8D2A6]">Next Sync: <strong className="text-[#A9C632]">{countdown}</strong></span>
          </motion.div>
        </div>

        {/* Hero Title */}
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-[#1D2E1B] dark:text-white">
            Find where the{" "}
            <HandDrawnCircle>
              <span className="text-[#1D2E1B] dark:text-white">real work</span>
            </HandDrawnCircle>{" "}
            is actually getting built.
          </h1>
          <div className="mt-2 flex justify-center">
            <HandDrawnUnderline className="w-80 sm:w-[420px] text-[#A9C632]" />
          </div>
        </div>

        {/* Hero Description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-[#546E50] dark:text-[#C8D2A6] max-w-3xl mx-auto font-semibold leading-relaxed"
        >
          Stop doomscrolling 40-page job boards full of ghost roles that expired two months ago. Teleport directly into tech hubs across SF, NYC, London, Tokyo & Bengaluru — click a pin, inspect their stack, and apply straight on their ATS.
        </motion.p>

        {/* Hero CTA & Pointer Arrow */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex flex-col items-center justify-center gap-3.5 relative"
        >
          <div className="hidden md:flex items-center gap-2 absolute -left-32 top-3 text-[#A9C632]">
            <span className="font-extrabold text-xs tracking-tight text-[#546E50] dark:text-[#A9C632] italic rotate-[-6deg]">
              Click to teleport 🚀
            </span>
            <HandDrawnArrow className="text-[#A9C632]" />
          </div>

          <Magnetic strength={0.25}>
            <button
              onClick={handleLaunchClick}
              className="group w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-base sm:text-lg shadow-2xl transition-all hover:scale-104 flex items-center justify-center gap-3 cursor-pointer bg-[#1D2E1B] text-white hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B] dark:hover:bg-[#96B228]"
            >
              <span>{user ? "Open Live Map Workspace" : "Explore the 2.5D Map — It's Free"}</span>
              <WarpSpearIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </Magnetic>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#546E50] dark:text-[#C8D2A6] bg-black/[0.03] dark:bg-white/[0.04] px-5 py-2 rounded-full border border-black/5 dark:border-white/5">
            <ShieldCheck className="w-4 h-4 text-[#A9C632]" />
            <span>Zero paywalls · Verified Gmail login · No recruiters spamming your inbox</span>
          </div>
        </motion.div>

        {/* ── Key Metrics Ribbon ───────── */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
        >
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-[#1D2E1B] dark:text-white block">
              <AnimatedNumber value={totalJobsCount} suffix="+" />
            </span>
            <span className="text-xs font-extrabold text-[#546E50] dark:text-[#C8D2A6] uppercase tracking-wider block mt-1">
              Live Roles
            </span>
          </div>
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-[#1D2E1B] dark:text-white block">
              <AnimatedNumber value={totalCompaniesCount} suffix="+" />
            </span>
            <span className="text-xs font-extrabold text-[#546E50] dark:text-[#C8D2A6] uppercase tracking-wider block mt-1">
              Mapped Startups
            </span>
          </div>
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-[#1D2E1B] dark:text-white block">0%</span>
            <span className="text-xs font-extrabold text-[#546E50] dark:text-[#C8D2A6] uppercase tracking-wider block mt-1">
              Recruiter Spam
            </span>
          </div>
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-[#A9C632] block">$0 Cost</span>
            <span className="text-xs font-extrabold text-[#546E50] dark:text-[#C8D2A6] uppercase tracking-wider block mt-1">
              Open to All
            </span>
          </div>
        </motion.div>

        {/* ── Marquee of Verified Startups ── */}
        <div className="mt-16 max-w-6xl mx-auto pt-8 border-t border-black/10 dark:border-white/10">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#546E50] dark:text-[#C8D2A6] block mb-5">
            Live Verified Roles from Frontier Teams
          </span>
          <InfiniteSlider gap={20} duration={30}>
            {[
              { name: "OpenAI", domain: "openai.com", roles: "42 Open Roles", logo: "https://www.google.com/s2/favicons?domain=openai.com&sz=128" },
              { name: "Anthropic", domain: "anthropic.com", roles: "14 Open Roles", logo: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128" },
              { name: "Stripe", domain: "stripe.com", roles: "185 Open Roles", logo: "https://www.google.com/s2/favicons?domain=stripe.com&sz=128" },
              { name: "Linear", domain: "linear.app", roles: "9 Open Roles", logo: "https://www.google.com/s2/favicons?domain=linear.app&sz=128" },
              { name: "Postman", domain: "postman.com", roles: "48 Open Roles", logo: "https://www.google.com/s2/favicons?domain=postman.com&sz=128" },
              { name: "Vercel", domain: "vercel.com", roles: "22 Open Roles", logo: "https://www.google.com/s2/favicons?domain=vercel.com&sz=128" },
              { name: "Supabase", domain: "supabase.com", roles: "16 Open Roles", logo: "https://www.google.com/s2/favicons?domain=supabase.com&sz=128" },
              { name: "Cursor", domain: "cursor.com", roles: "11 Open Roles", logo: "https://www.google.com/s2/favicons?domain=cursor.com&sz=128" },
              { name: "Figma", domain: "figma.com", roles: "38 Open Roles", logo: "https://www.google.com/s2/favicons?domain=figma.com&sz=128" },
              { name: "Perplexity AI", domain: "perplexity.ai", roles: "19 Open Roles", logo: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128" },
              { name: "Scale AI", domain: "scale.com", roles: "65 Open Roles", logo: "https://www.google.com/s2/favicons?domain=scale.com&sz=128" },
              { name: "ElevenLabs", domain: "elevenlabs.io", roles: "24 Open Roles", logo: "https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128" },
              { name: "Resend", domain: "resend.com", roles: "7 Open Roles", logo: "https://www.google.com/s2/favicons?domain=resend.com&sz=128" },
              { name: "Modal Labs", domain: "modal.com", roles: "8 Open Roles", logo: "https://www.google.com/s2/favicons?domain=modal.com&sz=128" },
            ].map((company) => (
              <div
                key={company.name}
                onClick={() => handleLaunchClick(company.name)}
                className="flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-white/85 dark:bg-white/[0.06] border border-[#C8D2A6] dark:border-white/15 shadow-md backdrop-blur-md hover:scale-104 hover:border-[#A9C632] dark:hover:border-[#A9C632] transition-all cursor-pointer select-none shrink-0"
                title={`Explore ${company.name} on the live map`}
              >
                <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#1D2E1B] p-2 flex items-center justify-center border border-black/10 dark:border-white/15 shadow-inner shrink-0 overflow-hidden">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company.name)}&backgroundColor=1D2E1B&textColor=A9C632&fontWeight=800`;
                    }}
                  />
                </div>
                <div className="text-left">
                  <span className="text-base font-black text-[#1D2E1B] dark:text-white block leading-tight whitespace-nowrap">
                    {company.name}
                  </span>
                  <span className="text-xs font-extrabold text-[#A9C632] block mt-0.5 whitespace-nowrap">
                    {company.roles}
                  </span>
                </div>
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </motion.section>

      {/* ── 3. Interactive Showcase ─ */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative perspective-[1200px]">
        <motion.div 
          style={{ y: badge2Y }}
          animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="hidden lg:flex items-center gap-3 p-4 rounded-2xl bg-white/90 dark:bg-[#1D2E1B]/95 border border-[#C8D2A6] dark:border-[#3D543A] shadow-xl absolute top-12 -right-4 z-20 backdrop-blur-xl"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center font-black text-xs text-blue-400">
            ST
          </div>
          <div>
            <div className="font-extrabold text-xs text-[#1D2E1B] dark:text-white">Stripe Infrastructure</div>
            <div className="text-[11px] text-[#A9C632] font-bold">$195k - $250k Base · San Francisco</div>
          </div>
        </motion.div>

        <div className="text-center mb-10">
          <span className="text-xs sm:text-sm font-extrabold text-[#A9C632] uppercase tracking-wider block">How It Feels</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#1D2E1B] dark:text-white mt-1">
            Zero fluff. Direct spatial interface.
          </h2>
        </div>

        {/* Feature Pill Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            <button
              onClick={() => setActiveTabPreview("map")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTabPreview === "map"
                  ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-sm"
                  : "text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white"
              }`}
            >
              🗺️ 2.5D Spatial Map
            </button>
            <button
              onClick={() => setActiveTabPreview("dossier")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTabPreview === "dossier"
                  ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-sm"
                  : "text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white"
              }`}
            >
              📄 Single-Frame Dossier
            </button>
            <button
              onClick={() => setActiveTabPreview("tracker")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTabPreview === "tracker"
                  ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-sm"
                  : "text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white"
              }`}
            >
              📊 Live Application Tracker
            </button>
          </div>
        </div>

        {/* Clean Static Glass Card */}
        <motion.div 
          style={{ 
            rotateX: mockupRotateX, 
            scale: mockupScale, 
            y: mockupY 
          }}
          className={`p-7 sm:p-10 rounded-[36px] border shadow-2xl transition-all relative overflow-hidden transform-gpu ${
            isDarkMode 
              ? "bg-[#1D2E1B]/95 border-[#3D543A]" 
              : "bg-white/95 border-[#C8D2A6]"
          }`}
        >
          {activeTabPreview === "map" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <Globe2 className="w-5 h-5 text-[#A9C632]" />
                  <span className="font-black text-sm sm:text-base text-[#1D2E1B] dark:text-white">
                    Live Tech Hubs • San Francisco, London, Tokyo, Bengaluru
                  </span>
                </div>
                <button
                  onClick={handleLaunchClick}
                  className="text-xs sm:text-sm font-bold text-[#A9C632] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Canvas</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Startup Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-[#F7F9F2] dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] space-y-2 hover:border-[#A9C632] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-[#1D2E1B] dark:text-white">Anthropic</span>
                    <span className="text-xs font-extrabold text-[#A9C632] bg-[#A9C632]/15 px-2.5 py-1 rounded-full">14 Roles</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#546E50] dark:text-[#C8D2A6] leading-relaxed">Frontier AI safety and LLM intelligence team in SF.</p>
                  <div className="flex items-center gap-1.5 text-xs text-[#A9C632] font-bold pt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#F7F9F2] dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] space-y-2 hover:border-[#A9C632] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-[#1D2E1B] dark:text-white">Linear</span>
                    <span className="text-xs font-extrabold text-[#A9C632] bg-[#A9C632]/15 px-2.5 py-1 rounded-full">9 Roles</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#546E50] dark:text-[#C8D2A6] leading-relaxed">High-performance issue tracker built for modern software teams.</p>
                  <div className="flex items-center gap-1.5 text-xs text-[#A9C632] font-bold pt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>San Francisco & Remote</span>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#F7F9F2] dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] space-y-2 hover:border-[#A9C632] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-[#1D2E1B] dark:text-white">Postman</span>
                    <span className="text-xs font-extrabold text-[#A9C632] bg-[#A9C632]/15 px-2.5 py-1 rounded-full">48 Roles</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#546E50] dark:text-[#C8D2A6] leading-relaxed">The global API platform powering 30M+ developers worldwide.</p>
                  <div className="flex items-center gap-1.5 text-xs text-[#A9C632] font-bold pt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Bengaluru & SF</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTabPreview === "dossier" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-[#A9C632]" />
                  <span className="font-black text-sm sm:text-base text-[#1D2E1B] dark:text-white">Single-Frame Spatial Candidate Passport</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#A9C632]">No More PDF Resending</span>
              </div>
              <p className="text-sm sm:text-base text-[#546E50] dark:text-[#C8D2A6] leading-relaxed">
                Your public passport combines your video intro, live code projects, verified skills, target compensation, and city availability in 1 responsive link. Founders can review your full context in under 30 seconds.
              </p>
            </div>
          )}

          {activeTabPreview === "tracker" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <Radar className="w-5 h-5 text-[#A9C632]" />
                  <span className="font-black text-sm sm:text-base text-[#1D2E1B] dark:text-white">Personal Application Kanban Tracker</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#A9C632]">Real-Time Sync</span>
              </div>
              <p className="text-sm sm:text-base text-[#546E50] dark:text-[#C8D2A6] leading-relaxed">
                Every time you apply or bookmark a job on Findely, it drops straight into your private Kanban board. Keep track of interviews, salary notes, and outreach status with zero manual spreadsheets.
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* ── 4. "What We Do" 4-Grid ── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <InView>
          <div className="text-center mb-12">
            <span className="text-xs sm:text-sm font-extrabold text-[#A9C632] uppercase tracking-wider block">The Difference</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#1D2E1B] dark:text-white mt-1">
              Why traditional job boards feel terrible.
            </h2>
          </div>
        </InView>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1 */}
          <InView delay={0.1}>
            <div className={`p-8 rounded-[32px] border space-y-3 transition-all h-full ${
              isDarkMode ? "bg-[#1D2E1B]/80 border-[#3D543A]" : "bg-white border-[#C8D2A6]"
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-[#A9C632]/15 flex items-center justify-center text-[#A9C632]">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1D2E1B] dark:text-white">1. Real 2.5D City Clustering</h3>
              <p className="text-sm text-[#546E50] dark:text-[#C8D2A6] leading-relaxed font-medium">
                Explore real technology corridors (Mission Bay SF, Soho NYC, Shoreditch London, Indiranagar Bengaluru) with GPU-rendered company buildings, branch teleportation, and remote filters.
              </p>
            </div>
          </InView>

          {/* Card 2 */}
          <InView delay={0.2}>
            <div className={`p-8 rounded-[32px] border space-y-3 transition-all h-full ${
              isDarkMode ? "bg-[#1D2E1B]/80 border-[#3D543A]" : "bg-white border-[#C8D2A6]"
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-[#A9C632]/15 flex items-center justify-center text-[#A9C632]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1D2E1B] dark:text-white">2. Direct ATS Verification</h3>
              <p className="text-sm text-[#546E50] dark:text-[#C8D2A6] leading-relaxed font-medium">
                Zero agency spam and no third-party data scraping middlemen. Every single role links directly to official Greenhouse, Lever, Ashby, or Workable hiring portals.
              </p>
            </div>
          </InView>

          {/* Card 3 */}
          <InView delay={0.3}>
            <div className={`p-8 rounded-[32px] border space-y-3 transition-all h-full ${
              isDarkMode ? "bg-[#1D2E1B]/80 border-[#3D543A]" : "bg-white border-[#C8D2A6]"
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-[#A9C632]/15 flex items-center justify-center text-[#A9C632]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1D2E1B] dark:text-white">3. Single-Frame Candidate Passport</h3>
              <p className="text-sm text-[#546E50] dark:text-[#C8D2A6] leading-relaxed font-medium">
                A clean public profile showing your video intro, live GitHub demos, target comp, and timeline. No more retyping your entire work history into 50 different application forms.
              </p>
            </div>
          </InView>

          {/* Card 4 */}
          <InView delay={0.4}>
            <div className={`p-8 rounded-[32px] border space-y-3 transition-all h-full ${
              isDarkMode ? "bg-[#1D2E1B]/80 border-[#3D543A]" : "bg-white border-[#C8D2A6]"
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-[#A9C632]/15 flex items-center justify-center text-[#A9C632]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1D2E1B] dark:text-white">4. Direct Line to Founders</h3>
              <p className="text-sm text-[#546E50] dark:text-[#C8D2A6] leading-relaxed font-medium">
                Founders and hiring leads can see candidate locations, open roles, and reach out directly without paying thousands of dollars for recruiter seat licenses.
              </p>
            </div>
          </InView>
        </div>
      </section>

      {/* ── 5. "Why I Built This" Founder Story ── */}
      <section id="why-i-built-this" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <InView>
          <div className={`p-8 sm:p-12 lg:p-14 rounded-[36px] border shadow-2xl relative overflow-hidden ${
            isDarkMode 
              ? "bg-[#1D2E1B] border-[#3D543A]" 
              : "bg-white border-[#C8D2A6]"
          }`}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#A9C632] animate-pulse" />
                <span className="text-xs sm:text-sm font-extrabold text-[#A9C632] uppercase tracking-wider">
                  Founder's Manifesto & Story
                </span>
              </div>
              <div className="flex items-center gap-2 bg-[#A9C632]/10 border border-[#A9C632]/30 px-3 py-1 rounded-full">
                <img src="/findely cool with a bg.svg" alt="Cool Findely" className="w-5 h-5 rounded-md" />
                <span className="text-[11px] font-bold text-[#1D2E1B] dark:text-[#A9C632]">Meet Cool Findely 🕶️</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-[#1D2E1B] dark:text-white tracking-tight leading-snug">
              Why I built Findely.
            </h2>

            <div className="mt-6 space-y-5 text-sm sm:text-base text-[#546E50] dark:text-[#C8D2A6] leading-relaxed font-semibold">
              <p>
                Navigating modern job boards in 2026 feels like <span className="text-[#1D2E1B] dark:text-white font-bold">trying to order a pizza on a site that asks for your 5-year high school GPA, redirects you to Workday to re-type your resume 4 times, only to find out the pizza was eaten 3 months ago by a phantom recruiter.</span> 🍕👻
              </p>

              <p>
                Traditional platforms treat candidates like lab mice in a paywalled cheese maze — charging $40 to $80 a month just to unlock basic search filters, while tossing your applications into a cosmic black hole of zero replies.
              </p>

              <p>
                I got tired of the corporate obstacle course. So, fueled by late-night caffeine, spite, and zero tolerance for ghost jobs, I engineered <span className="text-[#A9C632] font-black">Findely</span>: a 2.5D spatial warp-drive map that lets you bypass the recruiter toll booths and teleport straight to where the real engineers are pushing code. 100% free and open-source for everyone.
              </p>

              {/* Fun Hiring Note from Sagar */}
              <div className="p-6 rounded-3xl bg-[#A9C632]/10 border border-[#A9C632]/30 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🕶️</span>
                    <span className="font-extrabold text-xs sm:text-sm text-[#1D2E1B] dark:text-[#A9C632] uppercase tracking-wider">
                      Plot Twist: Yes, The Builder is Open to Work Too!
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold bg-[#A9C632] text-[#1D2E1B] px-2 py-0.5 rounded-full uppercase">
                    Available
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#1D2E1B] dark:text-white font-medium leading-relaxed">
                  While building an entire spatial job discovery platform so other humans don't get ghosted, I realized an inconvenient truth: <em>I also need to pay my Wi-Fi bill.</em>
                </p>
                <p className="text-xs sm:text-sm text-[#1D2E1B] dark:text-white font-medium leading-relaxed">
                  Need a fast-moving product builder? I design sharp UI/UX, understand product instincts, and vibe code full-stack apps with spatial physics and AI at hyper-speed. If your startup is building something ambitious, let’s talk before I accidentally build an AI that applies to your jobs for me!
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold">
                  <a
                    href="https://www.linkedin.com/in/sagar-s-510aa4232/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0070BA] dark:text-[#45a2e5] hover:underline flex items-center gap-1.5"
                  >
                    <span>DM me on LinkedIn</span>
                    <span>↗</span>
                  </a>
                  <span className="opacity-30">•</span>
                  <a
                    href="https://x.com/sabishimor1"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1D2E1B] dark:text-[#A9C632] hover:underline flex items-center gap-1.5"
                  >
                    <span>Slide into X DMs (@sabishimor1)</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t border-black/[0.08] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1D2E1B] p-1 flex items-center justify-center border border-[#C8D2A6] shadow-sm overflow-hidden shrink-0">
                    <img src="/findely cool with a bg.svg" alt="Cool Findely" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="font-extrabold text-base text-[#1D2E1B] dark:text-white block">Sagar S · The Findely Builder</span>
                    <div className="flex items-center gap-3.5 mt-1 text-xs sm:text-sm">
                    <a
                      href="https://github.com/Sabishimori"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#546E50] dark:text-[#C8D2A6] hover:text-[#A9C632] transition-colors"
                    >
                      GitHub (Sabishimori) ↗
                    </a>
                    <span className="opacity-30">•</span>
                    <a
                      href="https://x.com/sabishimor1"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#546E50] dark:text-[#C8D2A6] hover:text-[#A9C632] transition-colors"
                    >
                      X (@sabishimor1) ↗
                    </a>
                    <span className="opacity-30">•</span>
                    <a
                      href="https://www.linkedin.com/in/sagar-s-510aa4232/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#0070BA] dark:text-[#45a2e5] hover:underline"
                    >
                      LinkedIn ↗
                    </a>
                  </div>
                </div>
              </div>
              <Magnetic strength={0.3}>
                  <button
                    onClick={handleLaunchClick}
                    className="group px-6 py-3 rounded-2xl bg-[#A9C632] text-[#1D2E1B] font-black text-xs sm:text-sm hover:bg-[#96B228] transition-all cursor-pointer shadow-md flex items-center gap-2 shrink-0"
                  >
                    <span>Launch Workspace</span>
                    <WarpSpearIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Magnetic>
              </div>
            </div>
          </div>
        </InView>
      </section>

      {/* ── 6. Support & Free Tier Donation ───────────────────────── */}
      <section id="donate" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <InView>
          <div className={`p-8 sm:p-12 lg:p-16 rounded-[40px] border shadow-2xl relative overflow-hidden transition-all ${
            isDarkMode 
              ? "bg-[#1D2E1B]/95 border-[#3D543A] shadow-black/40" 
              : "bg-white border-[#C8D2A6] shadow-black/[0.04]"
          }`}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-14">
              {/* Left Column */}
              <div className="space-y-5 max-w-xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A9C632]/15 border border-[#A9C632]/40 text-xs sm:text-sm font-extrabold text-[#A9C632]">
                  <Heart className="w-4 h-4 text-[#A9C632] fill-[#A9C632]" />
                  <span>Keep Findely 100% Free</span>
                </div>

                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1D2E1B] dark:text-white tracking-tight leading-[1.15]">
                  Support Server & Scraping Infrastructure
                </h3>

                <p className="text-sm sm:text-base text-[#546E50] dark:text-[#C8D2A6] leading-relaxed font-semibold">
                  Findely will always remain 100% free for job seekers. If this platform helped you discover a cool team or land an interview, consider helping fuel our database, geocoding servers, and scraping pipeline.
                </p>

                {/* Micro Value Props */}
                <div className="flex flex-wrap items-center gap-5 pt-2 text-xs sm:text-sm font-bold text-[#1D2E1B] dark:text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A9C632]" />
                    <span>0% Recruiter Paywalls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A9C632]" />
                    <span>Direct Founder Backed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A9C632]" />
                    <span>Zero Ad Clutter</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Donation Hub */}
              <div className="w-full lg:max-w-md space-y-5 p-6 sm:p-8 rounded-3xl bg-black/[0.02] dark:bg-white/[0.03] border border-[#C8D2A6]/70 dark:border-[#3D543A] shrink-0">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#546E50] dark:text-[#C8D2A6]">
                    <span>Select an amount:</span>
                    {landingDonationAmount && (
                      <span className="text-[#A9C632] font-black">${landingDonationAmount} selected</span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 5, 10].map((preset) => {
                      const isSelected = landingDonationAmount === String(preset);
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            playTapSound();
                            setLandingDonationAmount(String(preset));
                          }}
                          className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#A9C632] text-[#1D2E1B] border-[#A9C632] shadow-sm scale-105"
                              : "bg-white dark:bg-white/5 border-[#C8D2A6] dark:border-[#3D543A] text-[#1D2E1B] dark:text-white hover:border-[#A9C632]"
                          }`}
                        >
                          ${preset}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Amount Input & PayPal Checkout Button */}
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-3 text-base font-black text-[#546E50] dark:text-[#C8D2A6]">$</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Custom amount"
                      value={landingDonationAmount}
                      onChange={(e) => setLandingDonationAmount(e.target.value)}
                      className="w-full h-12 pl-9 pr-4 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] bg-white dark:bg-white/10 text-sm font-bold text-[#1D2E1B] dark:text-white focus:outline-none focus:border-[#A9C632] placeholder:text-[#546E50]/50 shadow-inner"
                    />
                  </div>

                  <Magnetic strength={0.3}>
                    <a
                      href={landingDonationAmount && Number(landingDonationAmount) > 0 ? `https://paypal.me/Sagar1502/${landingDonationAmount}` : "https://paypal.me/Sagar1502"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => playTapSound()}
                      className="h-12 px-6 rounded-2xl bg-[#0070BA] hover:bg-[#005ea6] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-xl cursor-pointer whitespace-nowrap active:scale-98"
                    >
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.006.417 5.421.05 5.91.05h6.666c3.486 0 5.617 1.637 5.093 5.485-.45 3.308-2.483 5.21-5.32 5.21H8.718l-1.026 8.358a.64.64 0 0 1-.616.534z" />
                      </svg>
                      <span>Give {landingDonationAmount ? `$${landingDonationAmount}` : "via PayPal"}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                    </a>
                  </Magnetic>
                </div>

                {/* 1-Click Copy Cards */}
                <div className="space-y-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <div className="p-4 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] bg-white/80 dark:bg-white/[0.02] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-2xl bg-[#0070BA]/10 flex items-center justify-center text-[#0070BA] shrink-0">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.006.417 5.421.05 5.91.05h6.666c3.486 0 5.617 1.637 5.093 5.485-.45 3.308-2.483 5.21-5.32 5.21H8.718l-1.026 8.358a.64.64 0 0 1-.616.534z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-[#546E50] dark:text-[#C8D2A6] block uppercase tracking-wider">PayPal Handle</span>
                        <span className="text-xs sm:text-sm font-mono font-bold text-[#1D2E1B] dark:text-white truncate block">paypal.me/Sagar1502</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playTapSound();
                        navigator.clipboard.writeText("https://paypal.me/Sagar1502");
                        setCopiedPaypal(true);
                        setTimeout(() => setCopiedPaypal(false), 2200);
                      }}
                      className="px-4 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-[#0070BA] hover:text-white text-xs font-black text-[#1D2E1B] dark:text-white flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
                      title="Copy PayPal Handle"
                    >
                      {copiedPaypal ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#A9C632]" />
                          <span className="text-[#A9C632]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#546E50] dark:text-[#C8D2A6]" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </InView>
      </section>

      {/* ── 7. Newsletter ─────────────────────────────────────────── */}
      <section className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className={`p-8 sm:p-12 rounded-[36px] border shadow-xl relative overflow-hidden text-center ${
          isDarkMode ? "bg-[#1D2E1B]/90 border-[#3D543A]" : "bg-white border-[#C8D2A6]"
        }`}>
          <div className="max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#A9C632]/15 mx-auto flex items-center justify-center text-[#A9C632] mb-2">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1D2E1B] dark:text-white">
              Stay in the loop
            </h3>
            <p className="text-sm text-[#546E50] dark:text-[#C8D2A6] leading-relaxed font-medium">
              Get notified when new tech hubs, verified salary bands, or new frontier companies go live.
            </p>

            {newsletterSubscribed ? (
              <div className="p-4 rounded-2xl bg-[#A9C632]/15 border border-[#A9C632]/40 text-[#1D2E1B] dark:text-[#A9C632] font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A9C632]" />
                <span>You're on the early builder list! Welcome to Findely ✨</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-4 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your.email@frontier.com"
                  required
                  className="flex-1 px-4 py-3 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] bg-transparent text-sm font-semibold placeholder:text-[#546E50]/60 dark:placeholder:text-[#C8D2A6]/50 focus:outline-none focus:border-[#A9C632]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#1D2E1B] text-white hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B] dark:hover:bg-[#96B228] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}

            <div className="pt-3 text-xs text-[#546E50] dark:text-[#C8D2A6] font-semibold">
              Direct founder inbox: <a href="mailto:founder@findely.app" className="font-bold text-[#A9C632] hover:underline">founder@findely.app</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Footer ─────────────────────────────────────────────── */}
      <footer className="py-8 px-4 sm:px-6 border-t border-[#C8D2A6] dark:border-[#3D543A] max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#546E50] dark:text-[#C8D2A6]">
        <div className="flex items-center gap-2.5">
          <img src="/logofinal.svg" alt="Findely Logo" className="w-6 h-6 rounded-lg" />
          <span className="font-black text-sm sm:text-base text-[#1D2E1B] dark:text-white">Findely</span>
          <span>© 2026 Sagar S. Built for builders worldwide.</span>
        </div>

        <div className="flex items-center gap-5 font-bold text-xs sm:text-sm">
          <a href="https://github.com/Sabishimori" target="_blank" rel="noreferrer" className="hover:text-[#A9C632] transition-colors">GitHub</a>
          <a href="https://x.com/sabishimor1" target="_blank" rel="noreferrer" className="hover:text-[#A9C632] transition-colors">X / Twitter</a>
          <a href="https://www.linkedin.com/in/sagar-s-510aa4232/" target="_blank" rel="noreferrer" className="hover:text-[#0070BA] transition-colors">LinkedIn</a>
          <a href="#why-i-built-this" className="hover:text-[#A9C632] transition-colors">Manifesto</a>
          <a href="#donate" className="hover:text-[#A9C632] transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}
