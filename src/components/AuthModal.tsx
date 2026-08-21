"use client";

import { useState, useEffect } from "react";
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
  AlertCircle,
  KeyRound,
  RotateCcw,
  Edit2
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { playTapSound } from "@/lib/soundFx";
import { signIn } from "next-auth/react";
import { isDisposableEmail } from "@/lib/disposableEmailBlocker";
import { sendEmailOtp, verifyEmailOtp } from "@/app/actions";

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
  const { isAuthModalOpen, closeAuthModal, setVerifiedUser } = useAuth();
  
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Handle Resend Cooldown Timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

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

  // 2. Request OTP Code for Email
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Please enter a valid Gmail or work email address.");
      return;
    }

    if (isDisposableEmail(cleanEmail)) {
      setErrorMsg("Temporary and burner emails are strictly blocked. Please use your genuine Gmail or work email.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    playTapSound();

    try {
      const displayName = cleanName || cleanEmail.split("@")[0];
      const res = await sendEmailOtp({ email: cleanEmail, name: displayName });

      if (res.success) {
        setSuccessMsg(`A 6-digit code was sent to ${cleanEmail}.`);
        setStep("otp");
        setResendCooldown(60); // 60s cooldown
      } else {
        setErrorMsg(res.error || "Failed to dispatch verification code.");
      }
    } catch (err: any) {
      console.error("OTP send error:", err);
      setErrorMsg("Failed to dispatch verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Verify OTP Code and Log In
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = otpCode.trim().replace(/\D/g, "");

    if (cleanCode.length < 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    playTapSound();

    try {
      const displayName = cleanName || cleanEmail.split("@")[0];
      const res = await verifyEmailOtp({
        email: cleanEmail,
        otpCode: cleanCode,
        name: displayName,
      });

      if (res.success && res.user) {
        setSuccessMsg(`Welcome, ${res.user.name}! Authentication verified.`);
        playTapSound();
        setVerifiedUser(res.user);

        setTimeout(() => {
          if (onSuccess) onSuccess();
          closeAuthModal();
        }, 500);
      } else {
        setErrorMsg(res.error || "Invalid verification code. Please try again.");
      }
    } catch (err: any) {
      console.error("OTP verify error:", err);
      setErrorMsg("Failed to verify code. Please try again.");
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
                {step === "otp" ? (
                  <span>Verify Email Code</span>
                ) : cleanName ? (
                  <span>
                    Welcome, <span className="text-[#A9C632]">{cleanName}</span>
                  </span>
                ) : (
                  <span>Join Findely</span>
                )}
              </h2>

              <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] mt-1 font-semibold">
                {step === "otp"
                  ? `Enter the 6-digit security code sent to ${cleanEmail}.`
                  : "Enter your username & Gmail to instantly access 2.5D startup maps & candidate tools."}
              </p>
            </div>
          </div>

          {step === "credentials" ? (
            /* ── Step 1: Credentials / 1-Click Google ── */
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
                  Or Send Verified Email OTP
                </span>
                <div className="flex-1 h-px bg-black/[0.08] dark:bg-white/[0.08]" />
              </div>

              {/* Email Form */}
              <form onSubmit={handleRequestOtp} className="space-y-3.5">
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

                {errorMsg && (
                  <p className="text-xs text-red-500 font-semibold text-center bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                    {errorMsg}
                  </p>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading || !email.includes("@") || isDisposableEmail(email)}
                  aria-label="Send 6-digit verification code"
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-101 flex items-center justify-center gap-2 cursor-pointer bg-[#1D2E1B] text-white hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B] dark:hover:bg-[#96B228] disabled:opacity-50 mt-4"
                >
                  <span>{isLoading ? "Sending 6-Digit Code..." : "Send Verification Code ✉️"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* ── Step 2: 6-Digit OTP Verification ── */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-[#C8D2A6] dark:border-[#3D543A] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#546E50] dark:text-[#C8D2A6] font-medium">
                  <Mail className="w-4 h-4 text-[#A9C632]" />
                  <span className="font-bold text-[#1D2E1B] dark:text-white truncate max-w-[200px]">{cleanEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-[11px] font-bold text-[#A9C632] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="auth-otp-input" className="text-[11px] font-bold text-[#1D2E1B] dark:text-white flex items-center justify-between">
                  <span>6-Digit Verification Code</span>
                  <span className="text-[10px] text-[#A9C632] font-mono">10 min expiry</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#546E50] dark:text-[#C8D2A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-otp-input"
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="123456"
                    className={`w-full pl-10 pr-4 py-3 text-center tracking-[0.35em] text-lg font-black rounded-2xl border transition-all focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode
                        ? "bg-[#243822] border-[#3D543A] text-white placeholder:text-[#A0B28C]"
                        : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B] placeholder:text-[#546E50]"
                    }`}
                  />
                </div>
              </div>

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

              {/* Verify & Enter Button */}
              <button
                type="submit"
                disabled={isLoading || otpCode.length < 6}
                aria-label="Verify and Enter Findely"
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-101 flex items-center justify-center gap-2 cursor-pointer bg-[#1D2E1B] text-white hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B] dark:hover:bg-[#96B228] disabled:opacity-50"
              >
                <span>{isLoading ? "Verifying Security Code..." : "Verify & Enter Findely 🚀"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Resend Code Button */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  disabled={isLoading || resendCooldown > 0}
                  onClick={handleRequestOtp}
                  className="text-xs font-bold text-[#546E50] dark:text-[#C8D2A6] hover:text-[#A9C632] transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend 6-Digit Code"}</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer Security Signals */}
          <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[10px] text-[#546E50] dark:text-[#C8D2A6] font-medium">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#A9C632]" />
              <span>Cryptographic Email OTP</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#A9C632]" />
              <span>Anti-Brute Force Guard</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
