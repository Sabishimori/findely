"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Globe2, 
  Satellite, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Activity, 
  Cpu,
  Layers,
  Compass,
  Radar,
  Radio
} from "lucide-react";

interface SplashScreenProps {
  onFinish?: () => void;
  onComplete?: () => void;
  totalCompaniesCount?: number;
  isDarkMode?: boolean;
}

export default function SplashScreen({ 
  onFinish, 
  onComplete,
  totalCompaniesCount = 850,
  isDarkMode = false 
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Findely Geospatial Engine...");
  const [analogValues, setAnalogValues] = useState({
    freq: 432.4,
    nodes: 128,
    signal: 99.4,
  });

  const handleDone = () => {
    if (onFinish) onFinish();
    else if (onComplete) onComplete();
  };

  useEffect(() => {
    // Progress counter animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            handleDone();
          }, 350);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 4;
        const bounded = Math.min(100, next);

        if (bounded < 25) {
          setStatusText("Calibrating 2.5D verified tech clusters across global hubs...");
        } else if (bounded < 55) {
          setStatusText("Synthesizing live frontier company graphs & ATS pipelines...");
        } else if (bounded < 85) {
          setStatusText("Establishing zero-latency multi-portal workspace & candidate passports...");
        } else {
          setStatusText("Spatial workspace operational · Ready to launch.");
        }

        setAnalogValues({
          freq: Number((430 + (bounded * 0.5)).toFixed(1)),
          nodes: 128 + Math.floor(bounded * 7.2),
          signal: Number((98.5 + (bounded * 0.015)).toFixed(1)),
        });

        return bounded;
      });
    }, 75);

    return () => clearInterval(interval);
  }, [onFinish]);

  // Wide 1440px-1920px spatial satellite badges floating across the canvas
  const wideSatellites = [
    { id: 1, icon: Globe2, title: "2.5D GPU BASEMAP", subtitle: "SF, NYC, London, Tokyo, Bengaluru", x: -440, y: -120, delay: 0 },
    { id: 2, icon: Zap, title: "DIRECT ATS PIPELINES", subtitle: "Greenhouse · Lever · Ashby", x: 440, y: -110, delay: 0.2 },
    { id: 3, icon: ShieldCheck, title: "VERIFIED PROTOCOL", subtitle: "Zero Ghost Roles · Real Startups", x: -480, y: 110, delay: 0.4 },
    { id: 4, icon: Radar, title: "MULTI-PORTAL WORKSPACE", subtitle: "Simultaneous Career Dossiers", x: 460, y: 100, delay: 0.6 },
    { id: 5, icon: Sparkles, title: "CANDIDATE PASSPORT", subtitle: "Single-Frame Portfolio Sharing", x: 0, y: -180, delay: 0.3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className={`fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-10 lg:p-12 font-urbanist select-none overflow-hidden ${
        isDarkMode ? "bg-[#0C140B] text-white" : "bg-[#F7F9F2] text-[#1D2E1B]"
      }`}
    >
      {/* ── Background Subtle 1920px Ambient Light Aura ───────────────── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1100px] h-[750px] rounded-full bg-[#A9C632]/18 blur-[160px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.02)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* ── Top Widescreen Header Bar (Spanning across 1440px / 1920px) ── */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Left: Brand Tile */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1D2E1B] p-2 flex items-center justify-center border border-[#C8D2A6]/50 dark:border-white/15 shadow-md">
            <img src="/logofinal.svg" alt="Findely Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-[#1D2E1B] dark:text-white">FINDELY</span>
              <span className="text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/40">
                v4.2.0 SPATIAL
              </span>
            </div>
            <span className="text-xs text-[#546E50] dark:text-[#C8D2A6] font-semibold block">
              2.5D Frontier Career Navigator
            </span>
          </div>
        </div>

        {/* Center: Realtime Status */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A9C632] animate-pulse" />
          <span className="text-xs font-extrabold text-[#1D2E1B] dark:text-white">
            {statusText}
          </span>
        </div>

        {/* Right: Live Telemetry Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono font-bold text-[#546E50] dark:text-[#C8D2A6]">
          <div className="hidden sm:flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#A9C632]" />
            <span>FREQ: {analogValues.freq} MHz</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A9C632]" />
            <span>850+ STARTUPS LIVE</span>
          </div>
        </div>
      </div>

      {/* ── Center Expansive 1440px Widescreen Arena ───────────────── */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col items-center justify-center my-auto py-8">
        
        <div className="relative w-full max-w-4xl h-72 sm:h-80 flex items-center justify-center">
          {/* Central Expansive Floating Logo Squircle */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              rotate: [-1, 1, -1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-20 w-44 h-44 sm:w-52 sm:h-52 rounded-[42px] bg-[#1D2E1B] border-2 border-[#C8D2A6] dark:border-[#3D543A] shadow-2xl p-7 flex items-center justify-center overflow-hidden"
          >
            <img
              src="/logofinal.svg"
              alt="Findely Logo"
              className="w-full h-full object-contain filter drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
          </motion.div>

          {/* Orbiting Spatial Badges Spread Across Widescreen */}
          {wideSatellites.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                animate={{
                  y: [item.y - 8, item.y + 8, item.y - 8],
                  x: [item.x - 5, item.x + 5, item.x - 5],
                }}
                transition={{
                  duration: 3.5 + item.id * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                }}
                className="hidden lg:flex absolute items-center gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-xl bg-white/90 dark:bg-[#1D2E1B]/90 border-[#C8D2A6] dark:border-[#3D543A] pointer-events-none min-w-[240px]"
              >
                <div className="w-9 h-9 rounded-xl bg-[#A9C632]/20 flex items-center justify-center text-[#1D2E1B] dark:text-[#A9C632] shrink-0 font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <span className="text-xs font-black text-[#1D2E1B] dark:text-white block tracking-wide">
                    {item.title}
                  </span>
                  <span className="text-[11px] font-semibold text-[#546E50] dark:text-[#C8D2A6] block truncate">
                    {item.subtitle}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Ambient Sparkles Array */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0.7, 1.3, 0.7],
                opacity: [0.2, 0.9, 0.2],
              }}
              transition={{
                duration: 2.2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.35,
              }}
              className="absolute text-[#A9C632]"
              style={{
                top: `${10 + (i * 12)}%`,
                left: `${15 + (i * 10)}%`,
              }}
            >
              <Sparkles className="w-4 h-4 opacity-75" />
            </motion.div>
          ))}
        </div>

        {/* Subtitle */}
        <div className="text-center mt-4 space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1D2E1B] dark:text-white">
            Synthesizing Frontier Geospatial Graph
          </h2>
          <p className="text-sm font-semibold text-[#546E50] dark:text-[#C8D2A6]">
            Mapping direct verified opportunities across world technology corridors
          </p>
        </div>
      </div>

      {/* ── Bottom Widescreen Command Console (Full 1440px / 1600px Width) ── */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto space-y-4">
        <div className="p-6 sm:p-8 rounded-[36px] bg-white/85 dark:bg-[#1D2E1B]/90 border border-[#C8D2A6] dark:border-[#3D543A] shadow-2xl backdrop-blur-2xl space-y-4">
          {/* Header Row: Status & Live Percentage */}
          <div className="flex items-center justify-between text-sm sm:text-base font-bold">
            <div className="flex items-center gap-2.5 text-[#1D2E1B] dark:text-white">
              <Activity className="w-5 h-5 text-[#A9C632] animate-pulse shrink-0" />
              <span className="truncate max-w-xl">{statusText}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#1D2E1B] dark:text-[#A9C632]">
                {progress}%
              </span>
            </div>
          </div>

          {/* Expansive Full-Width Progress Track */}
          <div className="w-full h-4 rounded-full bg-[#E6D4A6]/30 dark:bg-white/10 overflow-hidden p-0.5 border border-[#C8D2A6] dark:border-white/15">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#A9C632] via-[#C8E842] to-[#A9C632] shadow-md"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.1 }}
            />
          </div>

          {/* 4-Column Widescreen Telemetry Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] text-xs font-bold text-[#546E50] dark:text-[#C8D2A6]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#A9C632]" />
              <span>CORE FREQ: {analogValues.freq} MHz</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#A9C632]" />
              <span>NODES: {analogValues.nodes} MAPPED</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#A9C632]" />
              <span>SIGNAL: {analogValues.signal}% STABLE</span>
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={handleDone}
                className="text-xs sm:text-sm font-black text-[#1D2E1B] dark:text-[#A9C632] hover:underline flex items-center gap-1 cursor-pointer transition-transform hover:translate-x-1"
              >
                <span>Skip Initialization</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
