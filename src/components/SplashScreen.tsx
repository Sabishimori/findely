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
  Cpu
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
  totalCompaniesCount,
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
          }, 450);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 4;
        const bounded = Math.min(100, next);

        if (bounded < 30) {
          setStatusText("Calibrating 2.5D verified tech nodes...");
        } else if (bounded < 65) {
          setStatusText("Synthesizing live frontier company graphs...");
        } else if (bounded < 90) {
          setStatusText("Establishing low-latency multi-portal workspace...");
        } else {
          setStatusText("Workspace operational · Ready to launch.");
        }

        setAnalogValues({
          freq: Number((430 + (bounded * 0.5)).toFixed(1)),
          nodes: 128 + Math.floor(bounded * 3.4),
          signal: Number((98.5 + (bounded * 0.015)).toFixed(1)),
        });

        return bounded;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onFinish]);

  // Floating stickers/glitters data
  const floatingObjects = [
    { id: 1, icon: Sparkles, text: "LIVE JOBS", color: "text-[#1D2E1B] dark:text-[#A9C632] bg-[#A9C632]/25 border-[#A9C632]/40", x: -160, y: -120, delay: 0 },
    { id: 2, icon: Globe2, text: "2.5D GLOBE", color: "text-[#1D2E1B] dark:text-white bg-white/90 dark:bg-white/10 border-[#C8D2A6]", x: 170, y: -100, delay: 0.2 },
    { id: 3, icon: ShieldCheck, text: "VERIFIED", color: "text-[#1D2E1B] dark:text-[#A9C632] bg-[#A9C632]/20 border-[#A9C632]/40", x: -180, y: 80, delay: 0.4 },
    { id: 4, icon: Satellite, text: "ANALOG 4.8G", color: "text-[#1D2E1B] dark:text-white bg-[#E6D4A6]/50 border-[#E6D4A6]", x: 160, y: 90, delay: 0.6 },
    { id: 5, icon: Zap, text: "MULTI-PORTAL", color: "text-[#1D2E1B] dark:text-[#A9C632] bg-[#A9C632]/20 border-[#A9C632]/40", x: 0, y: -170, delay: 0.3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center font-urbanist select-none overflow-hidden ${
        isDarkMode ? "bg-[#131E12] text-white" : "bg-[#F7F9F2] text-[#1D2E1B]"
      }`}
    >
      {/* ── Background Subtle Ambient Aura ───────────────── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-[500px] h-[500px] rounded-full bg-[#A9C632]/20 blur-[100px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* ── Floating Center Stage ─────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        
        {/* Floating Objects / Stickers / Glitters Around Logo */}
        <div className="relative w-44 h-44 flex items-center justify-center mb-8">
          {/* Central Floating Logo with Gentle Bob */}
          <motion.div
            animate={{
              y: [-8, 8, -8],
              rotate: [-1.5, 1.5, -1.5],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-20 w-32 h-32 rounded-3xl bg-[#1D2E1B] border-2 border-[#C8D2A6] shadow-2xl p-4 flex items-center justify-center overflow-hidden"
          >
            <img
              src="/logofinal.svg"
              alt="Findely Logo"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
            {/* Gloss shine bar */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </motion.div>

          {/* Floating Sticker Badges */}
          {floatingObjects.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                animate={{
                  y: [item.y - 6, item.y + 6, item.y - 6],
                  x: [item.x - 4, item.x + 4, item.x - 4],
                  rotate: [-3, 3, -3],
                }}
                transition={{
                  duration: 3 + item.id * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                }}
                className={`absolute px-2.5 py-1 rounded-xl text-[10px] font-bold border shadow-lg backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap pointer-events-none ${item.color}`}
              >
                <Icon className="w-3 h-3 flex-shrink-0 text-[#A9C632]" />
                <span>{item.text}</span>
              </motion.div>
            );
          })}

          {/* Drifting Sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0.6, 1.2, 0.6],
                opacity: [0.2, 0.9, 0.2],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              className="absolute text-[#A9C632]"
              style={{
                top: `${20 + (i * 15)}%`,
                left: `${15 + (i * 14)}%`,
              }}
            >
              ✦
            </motion.div>
          ))}
        </div>

        {/* Brand Title */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1D2E1B] dark:text-white flex items-center justify-center gap-2">
            <span>FINDELY</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/40">
              v4.2.0
            </span>
          </h1>
          <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] font-medium">
            2.5D GPU Career Navigator & Multi-Portal Workspace
          </p>
        </div>

        {/* ── Sleek Loading Bar Container ─────────────────── */}
        <div className="w-full space-y-2.5 bg-white/70 dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] p-4 rounded-2xl shadow-xs backdrop-blur-md">
          {/* Top Status & Percentage */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-[#1D2E1B] dark:text-white truncate max-w-[260px] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#A9C632] animate-pulse flex-shrink-0" />
              <span>{statusText}</span>
            </span>
            <span className="font-extrabold text-sm text-[#1D2E1B] dark:text-[#A9C632]">
              {progress}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2.5 rounded-full bg-[#E6D4A6]/30 dark:bg-white/10 overflow-hidden p-0.5 border border-[#C8D2A6] dark:border-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#A9C632] via-[#B8D838] to-[#A9C632] shadow-xs"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.1 }}
            />
          </div>

          {/* Analog Telemetry Indicators */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#C8D2A6]/50 dark:border-white/10 text-[10px] font-bold text-[#546E50] dark:text-[#C8D2A6]">
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#A9C632]" />
              <span>FREQ: {analogValues.freq} MHz</span>
            </div>
            <div className="flex items-center gap-1 text-center justify-center">
              <span>NODES: {analogValues.nodes}</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <span>SIG: {analogValues.signal}%</span>
            </div>
          </div>
        </div>

        {/* Skip button if user wants to enter immediately */}
        <button
          onClick={handleDone}
          className="mt-5 text-xs text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-colors px-3 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
        >
          <span>Skip initialization</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
