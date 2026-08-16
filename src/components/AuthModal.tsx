"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Mail, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Lock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { playTapSound } from "@/lib/soundFx";
import { signIn } from "next-auth/react";
import { isDisposableEmail } from "@/lib/disposableEmailBlocker";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"
      />
    </svg>
  );
}

export default function AuthModal({ 
  isDarkMode = false,
  onSuccess,
}: { 
  isDarkMode?: boolean;
  onSuccess?: () => void;
}) {
  const { isAuthModalOpen, closeAuthModal, loginWithWorkEmail } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isAuthModalOpen) return null;

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const domain = cleanEmail.includes("@") && cleanEmail.split("@")[1] ? cleanEmail.split("@")[1].toLowerCase().trim() : "";
  const isGmail = domain === "gmail.com" || cleanEmail.endsWith("@gmail.com");
  const isCompanyEmail = domain && !["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"].includes(domain);

  // 1. Google OAuth Sign In
  const handleGoogleOAuth = async () => {
    setIsLoading(true);
    setErrorMsg("");
    playTapSound();
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err: any) {
      console.error("Google OAuth redirect error:", err);
      setErrorMsg("Google OAuth redirect failed. Please enter your name and Gmail below.");
      setIsLoading(false);
    }
  };

  // 2. Direct Passwordless Login with Name & Gmail
  const handleDirectLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Please enter a valid Gmail or email address.");
      return;
    }

    if (isDisposableEmail(cleanEmail)) {
      setErrorMsg("Temporary and burner emails are strictly blocked. Please use your genuine Gmail or work email.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    playTapSound();

    try {
      const displayName = cleanName || cleanEmail.split("@")[0];
      setSuccessMsg(`Welcome, ${displayName}! Logging into Findely...`);
      playTapSound();

      await loginWithWorkEmail(displayName, cleanEmail);

      setTimeout(() => {
        if (onSuccess) onSuccess();
        closeAuthModal();
      }, 400);
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg("Failed to complete login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-urbanist">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window in Apple Squircle Curvy Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`relative w-full max-w-[440px] rounded-[36px] border shadow-2xl p-7 z-10 backdrop-blur-2xl overflow-hidden ${
            isDarkMode 
              ? "bg-[#1D2E1B]/95 border-[#3D543A] text-white" 
              : "bg-white/95 border-[#C8D2A6] text-[#1D2E1B]"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            aria-label="Close authentication modal"
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-3 mb-5">
            <div className="w-14 h-14 apple-icon-tile bg-[#1D2E1B] p-1.5 flex items-center justify-center shadow-md border border-[#C8D2A6]/50 dark:border-white/10 overflow-hidden">
              <img src="/logofinal.svg" alt="Findely Logo" className="w-full h-full object-contain" />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#1D2E1B] dark:text-white min-h-[32px] flex items-center justify-center gap-1.5 transition-all">
                {cleanName ? (
                  <span>
                    Welcome, <span className="text-[#A9C632]">{cleanName}</span>
                  </span>
                ) : (
                  <span>Join Findely</span>
                )}
              </h2>

              <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] mt-1 font-semibold">
                Enter your username & Gmail to instantly access 2.5D startup maps & candidate tools.
              </p>
            </div>
          </div>

          {/* 1-Click Google Action */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleOAuth}
              disabled={isLoading}
              aria-label="Continue with Google"
              className="w-full py-3 px-4 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] bg-white dark:bg-white/5 hover:bg-[#A9C632]/10 hover:border-[#A9C632] text-xs font-bold text-[#1D2E1B] dark:text-white flex items-center justify-center gap-3 transition-all shadow-xs hover:scale-101 cursor-pointer disabled:opacity-50"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>{isLoading ? "Connecting to Google..." : "Continue with Google (1-Click)"}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-black/[0.08] dark:bg-white/[0.08]" />
              <span className="text-[11px] font-bold text-[#546E50] dark:text-[#C8D2A6] uppercase tracking-wider">
                Or Enter Username & Gmail
              </span>
              <div className="flex-1 h-px bg-black/[0.08] dark:bg-white/[0.08]" />
            </div>

            {/* Direct Passwordless Form */}
            <form onSubmit={handleDirectLogin} className="space-y-3.5">
              {/* Full Name / Username */}
              <div className="space-y-1">
                <label htmlFor="auth-name-input" className="text-[11px] font-bold text-[#1D2E1B] dark:text-white flex items-center justify-between">
                  <span>Your Username / Name</span>
                  {cleanName && (
                    <span className="text-[10px] text-[#A9C632] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#A9C632]" />
                      <span>Live Profile</span>
                    </span>
                  )}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#546E50] dark:text-[#C8D2A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sagar Sharma"
                    className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border transition-all focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode
                        ? "bg-[#243822] border-[#3D543A] text-white placeholder:text-[#A0B28C]"
                        : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B] placeholder:text-[#546E50]"
                    }`}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label htmlFor="auth-email-input" className="text-[11px] font-bold text-[#1D2E1B] dark:text-white flex items-center justify-between">
                  <span>Gmail or Work Email Address</span>
                  {isDisposableEmail(email) ? (
                    <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                      <X className="w-3 h-3 text-red-500" />
                      <span>Burner Email Blocked</span>
                    </span>
                  ) : isGmail ? (
                    <span className="text-[10px] text-[#A9C632] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#A9C632]" />
                      <span>Verified Google Account</span>
                    </span>
                  ) : isCompanyEmail ? (
                    <span className="text-[10px] text-[#A9C632] font-bold flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#A9C632]" />
                      <span>@{domain}</span>
                    </span>
                  ) : null}
                </label>
                <div className="relative">
                  <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDisposableEmail(email) ? "text-red-500" : "text-[#546E50] dark:text-[#C8D2A6]"}`} />
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="you@gmail.com"
                    className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border transition-all focus:outline-none ${
                      isDisposableEmail(email)
                        ? "border-red-500/80 bg-red-500/10 text-red-600 dark:text-red-400 focus:border-red-500"
                        : isDarkMode
                        ? "bg-[#243822] border-[#3D543A] text-white placeholder:text-[#A0B28C] focus:border-[#A9C632]"
                        : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B] placeholder:text-[#546E50] focus:border-[#A9C632]"
                    }`}
                  />
                </div>
              </div>

              {isDisposableEmail(email) && (
                <p className="text-[11px] text-red-500 font-bold text-center bg-red-500/10 p-2 rounded-xl border border-red-500/30 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Temporary/disposable emails are blocked. Please enter a genuine Gmail or company address.</span>
                </p>
              )}

              {errorMsg && (
                <p className="text-xs text-red-500 font-semibold text-center bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                  {errorMsg}
                </p>
              )}

              {successMsg && (
                <p className="text-xs text-[#A9C632] font-semibold text-center flex items-center justify-center gap-1.5 bg-[#A9C632]/15 p-2.5 rounded-xl border border-[#A9C632]/30">
                  <CheckCircle2 className="w-4 h-4 text-[#A9C632]" />
                  <span>{successMsg}</span>
                </p>
              )}

              {/* Direct Submit Action */}
              <button
                type="submit"
                disabled={isLoading || !email.includes("@") || isDisposableEmail(email)}
                aria-label="Continue to Findely"
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-101 flex items-center justify-center gap-2 cursor-pointer bg-[#1D2E1B] text-white hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B] dark:hover:bg-[#96B228] disabled:opacity-50 mt-4"
              >
                <span>{isLoading ? "Signing in..." : "Continue to Findely"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Footer Security Signals */}
          <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[10px] text-[#546E50] dark:text-[#C8D2A6] font-medium">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#A9C632]" />
              <span>Passwordless Instant Access</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#A9C632]" />
              <span>Zero Spam Guarantee</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
