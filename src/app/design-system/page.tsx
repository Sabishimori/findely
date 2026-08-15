"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Building2, 
  Briefcase, 
  Bookmark, 
  ExternalLink, 
  Layers, 
  GripHorizontal,
  Mail,
  SlidersHorizontal,
  Clock
} from "lucide-react";
import { motion } from "motion/react";
import { ScribbleUnderline, ScribbleCircle, ScribbleArrow } from "@/components/Scribble";
import AnimatedLogo from "@/components/AnimatedLogo";

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

export default function DesignSystemPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState("Find your next frontier tech role.");

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const COLOR_TOKENS = [
    { name: "Matcha Lime", hex: "#A9C632", rgb: "169, 198, 50", role: "Brand Action / Primary Accent / Active Badges" },
    { name: "Forest Brew", hex: "#1D2E1B", rgb: "29, 46, 27", role: "Primary Text Only / High-Contrast Typography" },
    { name: "Tea Mist", hex: "#C8D2A6", rgb: "200, 210, 166", role: "Card Borders / Subtle Surfaces / Dividers" },
    { name: "Bamboo Beige", hex: "#E6D4A6", rgb: "230, 212, 166", role: "Warm Highlights / Accent Pills / Badges" },
    { name: "Clean Canvas", hex: "#F7F9F2", rgb: "247, 249, 242", role: "Light Canvas Background" },
    { name: "Pristine Surface", hex: "#FFFFFF", rgb: "255, 255, 255", role: "Elevated Card Container" },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors select-none ${isDarkMode ? "dark bg-[#060908] text-white" : "bg-[#F8FAFA] text-gray-900"}`}>
      {/* ── Top Navigation Bar ─────────────────────────────── */}
      <header className={`sticky top-0 z-50 px-6 py-4 border-b backdrop-blur-xl flex items-center justify-between ${
        isDarkMode ? "bg-[#060908]/90 border-white/[0.08]" : "bg-white/90 border-gray-200"
      }`}>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Map</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1D2E1B] p-1 flex items-center justify-center overflow-hidden border border-[#C8D2A6]">
              <img src="/main-logo.svg" alt="Findely" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-base font-bold font-space-grotesk tracking-tight text-[#1D2E1B] dark:text-white">
              Findely Design System & Tokens
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632]">
              v4.0.0
            </span>
          </div>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-gray-700" />}
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </header>

      {/* ── Main Content Container ─────────────────────────── */}
      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-12">
        {/* ── 1. Color Palette & Tokens Matrix ──────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold font-space-grotesk flex items-center gap-2">
              <span>1. Calibrated Color Palette & Tokens</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              High-contrast tokens engineered for crisp legibility in both Light and Dark themes. Click any token to copy its Hex code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {COLOR_TOKENS.map((token) => (
              <div
                key={token.hex}
                onClick={() => copyToClipboard(token.hex)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:scale-102 flex items-center gap-3.5 shadow-xs ${
                  isDarkMode
                    ? "bg-[#0E1311] border-white/[0.08] hover:border-white/20"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className="w-12 h-12 rounded-xl shadow-xs border border-black/10 flex-shrink-0"
                  style={{ backgroundColor: token.hex }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs truncate">{token.name}</p>
                    {copiedHex === token.hex ? (
                      <span className="text-[10px] font-bold text-[#4E9B78] flex items-center gap-1 font-mono">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <Copy className="w-3 h-3 text-gray-400 hover:text-gray-700" />
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">{token.hex}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{token.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. Apple SF Pro Typography System ─────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-space-grotesk">2. Apple SF Pro Typography Scale</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Precision letter-spacing, line-heights, and responsive weights.
              </p>
            </div>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className={`px-3 py-1.5 rounded-xl text-xs border ${
                isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
              }`}
              placeholder="Type to test fonts..."
            />
          </div>

          <div className={`p-6 rounded-3xl border space-y-6 ${
            isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200 shadow-sm"
          }`}>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-gray-400">Display XL · 32px / 700</span>
              <h1 className="text-3xl font-bold tracking-tight">{previewText}</h1>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-gray-400">Headline · 22px / 700</span>
              <h2 className="text-xl font-bold tracking-tight font-space-grotesk">{previewText}</h2>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-gray-400">Title Medium · 16px / 600</span>
              <h3 className="text-base font-semibold">{previewText}</h3>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-gray-400">Body · 13px / 400</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                Findely aggregates verified engineering, AI, and design openings directly from frontier companies with real leadership LinkedIn profiles.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-gray-400">Code Mono · 11px / 600</span>
              <p className="text-xs font-mono text-[#4E9B78]">
                const role = await getJob(&quot;Senior UI/UX Designer&quot;);
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. Scribble & Hand-Drawn Micro-Animations ─────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold font-space-grotesk">3. Scribble Micro-Animations</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Organic vector flourishes for headlines, callouts, and interactive highlights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Underline Scribble */}
            <div className={`p-6 rounded-3xl border flex flex-col items-center justify-center text-center space-y-3 ${
              isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200 shadow-sm"
            }`}>
              <div className="relative inline-block">
                <span className="font-bold text-lg">Verified Hiring Hubs</span>
                <div className="absolute -bottom-2 left-0 w-full flex justify-center">
                  <ScribbleUnderline width={140} className="text-[#4E9B78]" />
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-400 mt-2 block">ScribbleUnderline</span>
            </div>

            {/* Loop Circle Scribble */}
            <div className={`p-6 rounded-3xl border flex flex-col items-center justify-center text-center space-y-3 ${
              isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200 shadow-sm"
            }`}>
              <div className="relative inline-block py-1 px-3">
                <span className="font-bold text-lg">100% Free</span>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <ScribbleCircle className="text-[#4E9B78]" />
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-400 mt-2 block">ScribbleCircle</span>
            </div>

            {/* Arrow Pointer Scribble */}
            <div className={`p-6 rounded-3xl border flex flex-col items-center justify-center text-center space-y-3 ${
              isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200 shadow-sm"
            }`}>
              <div className="flex items-center gap-3">
                <ScribbleArrow className="text-[#4E9B78]" />
                <span className="font-bold text-sm">Direct Apply Link</span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 mt-2 block">ScribbleArrow</span>
            </div>
          </div>
        </section>

        {/* ── 4. Interactive Component Gallery ───────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold font-space-grotesk">4. Component Catalog & Variants</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Live interactive demonstration of 2.5D pins, floating inspector, job cards, and profile badges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Component 1: 2.5D Map Pins */}
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200 shadow-sm"
            }`}>
              <h3 className="font-bold text-sm font-space-grotesk">2.5D Marker Pins</h3>
              
              <div className="flex items-center justify-around py-4 bg-black/[0.02] dark:bg-white/[0.03] rounded-2xl">
                {/* Active Hiring Pin */}
                <div className="flex flex-col items-center">
                  <div className="bg-white dark:bg-[#0C100E] border-2 border-[#4E9B78] rounded-2xl p-1.5 shadow-xl flex flex-col items-center relative">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 p-1 flex items-center justify-center">
                      <span className="font-bold text-xs">F</span>
                    </div>
                    <span className="text-[10px] font-bold mt-0.5">Figma</span>
                    <div className="absolute -top-2 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#4E9B78] text-white shadow-xs">
                      2
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 mt-2">Active Hiring</span>
                </div>

                {/* Query Matched Pin */}
                <div className="flex flex-col items-center">
                  <div className="bg-white dark:bg-[#0C100E] border-2 border-[#4E9B78] rounded-2xl p-1.5 shadow-xl flex flex-col items-center relative ring-4 ring-[#4E9B78]/20">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 p-1 flex items-center justify-center">
                      <span className="font-bold text-xs">L</span>
                    </div>
                    <span className="text-[10px] font-bold mt-0.5">Linear</span>
                    <div className="absolute -bottom-4 bg-gray-900 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                      UI/UX
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 mt-5">Query Match</span>
                </div>
              </div>
            </div>

            {/* Component 2: Candidate Profile Card */}
            <div className={`p-6 rounded-3xl border space-y-3 ${
              isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200 shadow-sm"
            }`}>
              <h3 className="font-bold text-sm font-space-grotesk">Candidate Profile Pill & Handles</h3>
              
              <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                  alt="Avatar"
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#4E9B78]/30"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm">Alex Rivera</h4>
                  <p className="text-xs text-emerald-500 font-mono">● Actively Looking · Immediate</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-[10px] font-medium">
                      Senior Designer
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-[10px] font-medium">
                      React & Next.js
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Component 3: Animated Sprite Logo Showcase */}
            <div className={`p-6 rounded-3xl border space-y-4 md:col-span-2 ${
              isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200 shadow-sm"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base font-space-grotesk">Animated Vector Sprite Sheet Logo</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Continuous 4-frame animation extracted directly from vector logo.svg sprite sheet</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/30">
                  4 Frames · Vector Crisp
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#F7F9F2] dark:bg-white/5 border border-[#C8D2A6] dark:border-white/10 flex flex-col items-center justify-center text-center space-y-2">
                  <AnimatedLogo size={56} fps={4} autoPlay={true} fillPrimary="#1D2E1B" fillSecondary="#A9C632" fillAccent="#C8D2A6" />
                  <span className="text-[11px] font-bold font-mono">Standard 4 FPS</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#1D2E1B] text-white border border-[#3D543A] flex flex-col items-center justify-center text-center space-y-2">
                  <AnimatedLogo size={56} fps={6} autoPlay={true} fillPrimary="#A9C632" fillSecondary="#FFFFFF" fillAccent="#E6D4A6" />
                  <span className="text-[11px] font-bold font-mono text-[#A9C632]">Matcha Glow 6 FPS</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#F7F9F2] dark:bg-white/5 border border-[#C8D2A6] dark:border-white/10 flex flex-col items-center justify-center text-center space-y-2">
                  <AnimatedLogo size={56} fps={8} autoPlay={true} fillPrimary="#1D2E1B" fillSecondary="#A9C632" fillAccent="#E6D4A6" />
                  <span className="text-[11px] font-bold font-mono">Turbo 8 FPS</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#F7F9F2] dark:bg-white/5 border border-[#C8D2A6] dark:border-white/10 flex flex-col items-center justify-center text-center space-y-2">
                  <AnimatedLogo size={56} fps={5} autoPlay={false} animateOnHover={true} fillPrimary="#1D2E1B" fillSecondary="#A9C632" fillAccent="#C8D2A6" />
                  <span className="text-[11px] font-bold font-mono">Hover to Animate</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
