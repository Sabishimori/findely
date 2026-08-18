"use client";

import { useState } from "react";
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Megaphone, 
  Rocket, 
  ArrowRight, 
  ArrowLeft,
  ExternalLink,
  Lock,
  Eye,
  Gift
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { handleImageError } from "@/lib/logoResolver";

interface AdOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdCreated?: () => void;
  isDarkMode?: boolean;
}

export type AdBadgeType = "AD" | "FEATURED" | "BOOST" | "LAUNCH" | "HIRING";

export default function AdOnboardingModal({
  isOpen,
  onClose,
  onAdCreated,
  isDarkMode = false,
}: AdOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [badgeType, setBadgeType] = useState<AdBadgeType>("LAUNCH");
  const [location, setLocation] = useState("Global");
  const [contactEmail, setContactEmail] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successDetails, setSuccessDetails] = useState<any>(null);

  // Auto-detect logo favicon when websiteUrl changes
  const handleWebsiteChange = (url: string) => {
    setWebsiteUrl(url);
    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        const hostname = new URL(url).hostname;
        if (!logoUrl || logoUrl.includes("google.com/s2/favicons") || logoUrl.includes("clearbit")) {
          setLogoUrl(`https://logo.clearbit.com/${hostname}`);
        }
      } catch {}
    }
  };

  const handleNextStep1 = () => {
    setErrorMessage("");
    if (!companyName.trim()) {
      setErrorMessage("Please enter your company or product name.");
      return;
    }
    if (!websiteUrl.trim() || !websiteUrl.startsWith("http")) {
      setErrorMessage("Please enter a valid URL (e.g. https://yourstartup.com).");
      return;
    }
    if (!tagline.trim()) {
      setErrorMessage("Please write a punchy tagline or pitch for your spotlight.");
      return;
    }
    setCurrentStep(2);
  };

  const handleNextStep2 = () => {
    setCurrentStep(3);
  };

  const handleSubmitFreeSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!contactEmail || !contactEmail.includes("@")) {
      setErrorMessage("Please enter a valid email for confirmation.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/ads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          websiteUrl,
          logoUrl: logoUrl || `https://www.google.com/s2/favicons?domain=${websiteUrl}&sz=128`,
          tagline,
          badgeType,
          location,
          contactEmail,
          tier: "free_spotlight",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create free spotlight.");
      }

      setSuccessDetails(data.details);
      setCurrentStep(4);
      if (onAdCreated) {
        onAdCreated();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAndClose = () => {
    setCurrentStep(1);
    setCompanyName("");
    setWebsiteUrl("");
    setLogoUrl("");
    setTagline("");
    setErrorMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-2xl transition-all ${
            isDarkMode
              ? "bg-[#1D2E1B]/95 border-[#3D543A] text-white"
              : "bg-white/95 border-[#C8D2A6] text-[#1D2E1B]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#C8D2A6]/40 dark:border-[#3D543A]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#A9C632] text-[#1D2E1B] flex items-center justify-center shadow-md">
                <Gift className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                  Claim Free Live Spotlight ⚡
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#A9C632] text-[#1D2E1B] shadow-xs">
                    100% FREE
                  </span>
                </h3>
                <p className="text-[11.5px] text-[#546E50] dark:text-[#C8D2A6] font-medium">
                  Broadcast your startup, developer tool, or hiring surge across the live map
                </p>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#546E50] hover:text-[#1D2E1B] dark:text-[#C8D2A6] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Progress Indicator (Steps 1 to 3) */}
          {currentStep !== 4 && (
            <div className="flex items-center justify-between px-8 py-3 bg-black/5 dark:bg-white/5 border-b border-[#C8D2A6]/30 dark:border-[#3D543A] text-xs font-bold">
              {[
                { step: 1, label: "1. Creative & Logo" },
                { step: 2, label: "2. Live Marquee Preview" },
                { step: 3, label: "3. Launch Free (30 Days)" },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`flex items-center gap-1.5 transition-colors ${
                    currentStep === s.step
                      ? "text-[#1D2E1B] dark:text-[#A9C632] font-black scale-105"
                      : currentStep > s.step
                      ? "text-[#546E50] dark:text-[#C8D2A6]"
                      : "text-gray-400 opacity-60"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                      currentStep === s.step
                        ? "bg-[#A9C632] text-[#1D2E1B] shadow-sm font-black"
                        : currentStep > s.step
                        ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-white/20 dark:text-white"
                        : "bg-gray-200 dark:bg-white/10 text-gray-500"
                    }`}
                  >
                    {currentStep > s.step ? "✓" : s.step}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* ── STEP 1: Ad Creative & Details ────────────────── */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5 text-[#546E50] dark:text-[#C8D2A6]">
                    Company or Product Name *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Supabase, Linear, Resend"
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] bg-transparent text-sm font-semibold outline-none focus:border-[#A9C632] focus:ring-2 focus:ring-[#A9C632]/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5 text-[#546E50] dark:text-[#C8D2A6]">
                      Website / Destination URL *
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => handleWebsiteChange(e.target.value)}
                      placeholder="https://yourstartup.com"
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] bg-transparent text-sm font-semibold outline-none focus:border-[#A9C632] focus:ring-2 focus:ring-[#A9C632]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5 text-[#546E50] dark:text-[#C8D2A6]">
                      Target Hub / Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Global, Bengaluru, SF, Remote"
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] bg-transparent text-sm font-semibold outline-none focus:border-[#A9C632] focus:ring-2 focus:ring-[#A9C632]/20"
                    />
                  </div>
                </div>

                {/* Badge Type Selector */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5 text-[#546E50] dark:text-[#C8D2A6]">
                    Select Spotlight Badge Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: "LAUNCH", label: "LAUNCH", desc: "New Product" },
                      { id: "HIRING", label: "HIRING", desc: "Open Roles" },
                      { id: "BOOST", label: "BOOST", desc: "Top Surge" },
                      { id: "FEATURED", label: "FEATURED", desc: "Partner" },
                      { id: "AD", label: "AD", desc: "Classic" },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBadgeType(b.id as AdBadgeType)}
                        className={`p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                          badgeType === b.id
                            ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] border-[#A9C632] shadow-md scale-102 font-black"
                            : "border-[#C8D2A6]/60 dark:border-[#3D543A] hover:bg-black/5 dark:hover:bg-white/5 font-semibold text-xs"
                        }`}
                      >
                        <div className="text-[11px] font-mono font-black">{b.label}</div>
                        <div className="text-[9px] opacity-70 mt-0.5">{b.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tagline / Value Proposition */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-[#546E50] dark:text-[#C8D2A6]">
                      Punchy Tagline / Pitch (Max 80 chars) *
                    </label>
                    <span className={`text-[10px] font-mono ${tagline.length > 80 ? "text-red-500 font-bold" : "text-gray-400"}`}>
                      {tagline.length}/80
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={80}
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Next-Gen Developer Postgres with Instant Vector Search"
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] bg-transparent text-sm font-semibold outline-none focus:border-[#A9C632] focus:ring-2 focus:ring-[#A9C632]/20"
                  />
                </div>

                {/* Logo URL / Custom Logo */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5 text-[#546E50] dark:text-[#C8D2A6]">
                    Logo Image URL (Auto-fetched from domain)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 p-1 border border-[#C8D2A6] dark:border-[#3D543A] flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                      <img
                        src={logoUrl || (websiteUrl ? `https://www.google.com/s2/favicons?domain=${websiteUrl}&sz=128` : "")}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                        onError={(e) => handleImageError(e, companyName || "Spotlight")}
                      />
                    </div>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://yourstartup.com/logo.png"
                      className="flex-1 px-4 py-2 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] bg-transparent text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Step 1 Actions */}
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleNextStep1}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#A9C632] text-[#1D2E1B] text-xs font-black shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Preview Live Ticker</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Live Ticker Simulation Preview ────────── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-extrabold text-[#1D2E1B] dark:text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#A9C632]" />
                    Interactive Live Ticker Preview
                  </h4>
                  <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] mt-0.5">
                    This is how your free spotlight will display and animate in Findely's live marquee:
                  </p>
                </div>

                {/* Simulated Ticker Box */}
                <div className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] shadow-inner">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block mb-2">
                    Live Marquee Simulation:
                  </span>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1D2E1B] border border-[#C8D2A6] dark:border-[#3D543A] shadow-lg flex items-center justify-between gap-3 overflow-hidden">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-mono font-black bg-[#A9C632] text-[#1D2E1B] shadow-xs shrink-0">
                        {badgeType}
                      </span>

                      <div className="w-6 h-6 rounded-md bg-white dark:bg-white/10 p-0.5 border border-[#C8D2A6]/50 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={logoUrl || `https://www.google.com/s2/favicons?domain=${websiteUrl}&sz=128`}
                          alt={companyName}
                          className="w-full h-full object-contain"
                          onError={(e) => handleImageError(e, companyName)}
                        />
                      </div>

                      <span className="text-xs font-black text-[#1D2E1B] dark:text-white shrink-0">
                        {companyName || "Your Startup"}
                      </span>

                      <span className="text-[11.5px] text-[#546E50] dark:text-[#C8D2A6] font-medium truncate max-w-[320px]">
                        {tagline || "Your punchy value proposition will display here"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-gray-200 dark:border-white/10">
                      <span className="text-[9.5px] font-bold text-[#1D2E1B] dark:text-[#A9C632] bg-[#A9C632]/20 px-2 py-0.5 rounded-full border border-[#A9C632]/40">
                        {location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Destination verification */}
                <div className="p-3 rounded-2xl bg-[#A9C632]/10 border border-[#A9C632]/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A9C632]" />
                    <span>Clicking ad teleports to: <strong className="underline">{websiteUrl}</strong></span>
                  </div>
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1D2E1B] dark:text-[#A9C632] font-bold flex items-center gap-1 hover:underline"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Step 2 Actions */}
                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Edit Creative</span>
                  </button>

                  <button
                    onClick={handleNextStep2}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#A9C632] text-[#1D2E1B] text-xs font-black shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Proceed to Free Launch</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Free Launch Confirmation ────────────── */}
            {currentStep === 3 && (
              <form onSubmit={handleSubmitFreeSpot} className="space-y-4">
                {/* 100% Free Spotlight Plan Card */}
                <div className="p-5 rounded-3xl bg-[#A9C632]/15 border-2 border-[#A9C632] text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B]">
                      Community Plan • 100% Free
                    </span>
                    <span className="text-xl font-black text-[#1D2E1B] dark:text-[#A9C632]">
                      $0.00 USD
                    </span>
                  </div>

                  <div>
                    <h5 className="text-base font-black text-[#1D2E1B] dark:text-white">
                      30-Day Free Live Spotlight Placement
                    </h5>
                    <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] mt-0.5">
                      Promote <strong>{companyName}</strong> across the global live ticker with instant 1-click teleportation.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#A9C632]/40 text-xs font-bold text-[#1D2E1B] dark:text-white">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#A9C632] shrink-0" />
                      <span>Instant Live Marquee Rotation</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#A9C632] shrink-0" />
                      <span>30 Days Guaranteed Visibility</span>
                    </div>
                  </div>
                </div>

                {/* Contact Email Input */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5 text-[#546E50] dark:text-[#C8D2A6]">
                    Your Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="founder@yourstartup.com"
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] bg-transparent text-sm font-semibold outline-none focus:border-[#A9C632] focus:ring-2 focus:ring-[#A9C632]/20"
                  />
                </div>

                {/* Step 3 Actions */}
                <div className="pt-3 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Preview</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#A9C632] text-[#1D2E1B] text-xs font-black shadow-xl hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#1D2E1B] border-t-transparent rounded-full animate-spin" />
                        <span>Activating Free Spot...</span>
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 fill-current" />
                        <span>Launch Free Spotlight (30 Days) 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 4: Success & Confirmation ──────────────── */}
            {currentStep === 4 && (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#A9C632] text-[#1D2E1B] flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div>
                  <h4 className="text-xl font-black text-[#1D2E1B] dark:text-white">
                    🎉 Your Spotlight is Officially LIVE!
                  </h4>
                  <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] mt-1 max-w-md mx-auto">
                    <strong>{successDetails?.companyName || companyName}</strong> is now live in Findely's live spotlight marquee for the next 30 days.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] max-w-md mx-auto text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <strong className="text-[#1D2E1B] dark:text-white">{successDetails?.durationDays || 30} Days</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cost:</span>
                    <strong className="text-[#A9C632] font-black">100% Free ($0)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="font-mono text-xs font-bold text-[#A9C632]">Active on Live Ticker ⚡</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={resetAndClose}
                    className="px-8 py-3 rounded-2xl bg-[#A9C632] text-[#1D2E1B] text-xs font-black shadow-xl hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  >
                    View Spotlight on Live Map 🛸
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
