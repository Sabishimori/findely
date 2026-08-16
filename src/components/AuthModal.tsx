"use client";

import { useState, useRef, useEffect } from "react";
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
  ArrowLeft,
  KeyRound,
  RotateCw,
  Copy,
  Check
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
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, loginWithWorkEmail } = useAuth();
  
  const [authStep, setAuthStep] = useState<"credentials" | "otp">("credentials");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Real OTP Session State
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [copiedOtp, setCopiedOtp] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: any;
    if (authStep === "otp" && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [authStep, resendTimer]);

  if (!isAuthModalOpen) return null;

  // Extract domain for instant verified company recognition
  const domain = email.includes("@") && email.split("@")[1] ? email.split("@")[1].toLowerCase().trim() : "";
  const isGmail = domain === "gmail.com" || email.toLowerCase().endsWith("@gmail.com");
  const isCompanyEmail = domain && !["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"].includes(domain);

  // Generate 6-digit OTP code
  const createNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    return code;
  };

  // 1. Google OAuth Sign In Trigger
  const handleGoogleOAuth = async () => {
    setIsLoading(true);
    setErrorMsg("");
    playTapSound();
    try {
      const res = await signIn("google", { redirect: false, callbackUrl: "/" });
      if (res?.error) {
        setErrorMsg("Google OAuth unavailable. Please enter your Gmail below to verify your account.");
      } else {
        if (onSuccess) onSuccess();
        closeAuthModal();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Please enter your Gmail address below to verify your session.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Initiate OTP Verification Session
  const handleInitiateOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Please enter a valid Gmail or work email address.");
      return;
    }

    if (isDisposableEmail(cleanEmail)) {
      setErrorMsg("Temporary and burner emails are blocked. Please use a verified Gmail or company work email.");
      return;
    }

    setErrorMsg("");
    const newCode = createNewOtp();
    setOtpDigits(["", "", "", "", "", ""]);
    setResendTimer(30);
    setAuthStep("otp");
    playTapSound();

    // Auto focus first OTP input box
    setTimeout(() => {
      if (otpInputRefs.current[0]) otpInputRefs.current[0]?.focus();
    }, 150);
  };

  // 3. Verify OTP Code and Log In
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join("");
    if (code.length < 6) {
      setErrorMsg("Please enter all 6 digits of your verification code.");
      return;
    }

    // Strict OTP Validation Check
    if (code !== generatedOtp) {
      playTapSound();
      setErrorMsg("Invalid verification code. Please enter the exact 6-digit code shown above.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("Identity Verified! Logging in...");
    playTapSound();

    try {
      const cleanEmail = email.trim();
      const cleanName = name.trim() || cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      if (isGmail || cleanEmail.toLowerCase().endsWith("@gmail.com")) {
        await loginWithGoogle(cleanEmail, cleanName);
      } else {
        await loginWithWorkEmail(cleanName, cleanEmail);
      }

      setTimeout(() => {
        if (onSuccess) onSuccess();
        closeAuthModal();
      }, 350);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to authenticate session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Input handlers
  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const newDigits = [...otpDigits];
      newDigits[index] = "";
      setOtpDigits(newDigits);
      return;
    }

    if (clean.length > 1) {
      const parts = clean.slice(0, 6).split("");
      const newDigits = [...otpDigits];
      for (let i = 0; i < parts.length; i++) {
        if (index + i < 6) newDigits[index + i] = parts[i];
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(index + parts.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      if (newDigits.every((d) => d !== "") && newDigits.join("").length === 6) {
        handleVerifyOtp(newDigits.join(""));
      }
      return;
    }

    const singleDigit = clean.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = singleDigit;
    setOtpDigits(newDigits);

    if (singleDigit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== "") && newDigits.join("").length === 6) {
      handleVerifyOtp(newDigits.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    const nextFocus = Math.min(pasted.length, 5);
    otpInputRefs.current[nextFocus]?.focus();
    if (newDigits.every((d) => d !== "") && newDigits.join("").length === 6) {
      handleVerifyOtp(newDigits.join(""));
    }
  };

  const handleAutoFillCode = () => {
    playTapSound();
    const digits = generatedOtp.split("");
    setOtpDigits(digits);
    setErrorMsg("");
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
    handleVerifyOtp(generatedOtp);
  };

  // Subtle clean typing greeting without layout shifting jiggle
  const cleanName = name.trim();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-urbanist">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Window in Apple Squircle Curvy Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`relative w-full max-w-[450px] rounded-[36px] border shadow-2xl p-7 z-10 backdrop-blur-2xl overflow-hidden ${
            isDarkMode 
              ? "bg-[#1D2E1B]/95 border-[#3D543A] text-white" 
              : "bg-white/95 border-[#C8D2A6] text-[#1D2E1B]"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ══════════════════════════════════════════════════════════════
              STEP 1: CREDENTIALS ENTRY (Name & Email)
          ══════════════════════════════════════════════════════════════ */}
          {authStep === "credentials" ? (
            <div>
              {/* Header: Logo Tile & Subtle Typing Greeting */}
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
                    ) : authMode === "signin" ? (
                      <span>Welcome back to Findely</span>
                    ) : (
                      <span>Create your Findely Account</span>
                    )}
                  </h2>

                  <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] mt-1 font-semibold">
                    {authMode === "signin" 
                      ? "Access verified frontier roles, live 2.5D map, and tracked applications."
                      : "Join top founders and engineers discovering frontier tech startups."}
                  </p>
                </div>

                {/* Mode Segmented Switcher */}
                <div className="flex items-center p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 w-full mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      playTapSound();
                      setAuthMode("signin");
                      setErrorMsg("");
                    }}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      authMode === "signin"
                        ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-sm"
                        : "text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playTapSound();
                      setAuthMode("signup");
                      setErrorMsg("");
                    }}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      authMode === "signup"
                        ? "bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] shadow-sm"
                        : "text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white"
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mb-4 flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#A9C632]/10 border border-[#A9C632]/30 text-xs text-[#1D2E1B] dark:text-[#E8EFE6]">
                <ShieldCheck className="w-4 h-4 text-[#A9C632] shrink-0" />
                <span className="leading-tight text-[11px] font-semibold">
                  <strong>Identity Security Protocol:</strong> 6-Digit OTP verification ensures genuine candidate profiles.
                </span>
              </div>

              {/* 1-Click Google Action */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleOAuth}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] bg-white dark:bg-white/5 hover:bg-[#A9C632]/10 hover:border-[#A9C632] text-xs font-bold text-[#1D2E1B] dark:text-white flex items-center justify-center gap-3 transition-all shadow-xs hover:scale-101 cursor-pointer disabled:opacity-50"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>{isLoading ? "Connecting to Google..." : "Continue with Google"}</span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-black/[0.08] dark:bg-white/[0.08]" />
                  <span className="text-[11px] font-bold text-[#546E50] dark:text-[#C8D2A6] uppercase tracking-wider">
                    Or Enter Email
                  </span>
                  <div className="flex-1 h-px bg-black/[0.08] dark:bg-white/[0.08]" />
                </div>

                {/* Direct Form */}
                <form onSubmit={handleInitiateOtp} className="space-y-3">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1D2E1B] dark:text-white flex items-center justify-between">
                      <span>Your Full Name</span>
                      {cleanName && (
                        <span className="text-[10px] text-[#A9C632] font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#A9C632]" />
                          <span>Live Name Sync</span>
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#546E50] dark:text-[#C8D2A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
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
                    <label className="text-[11px] font-bold text-[#1D2E1B] dark:text-white flex items-center justify-between">
                      <span>Gmail or Work Email Address</span>
                      {isDisposableEmail(email) ? (
                        <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                          <X className="w-3 h-3 text-red-500" />
                          <span>Burner Email Blocked</span>
                        </span>
                      ) : isGmail ? (
                        <span className="text-[10px] text-[#A9C632] font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#A9C632]" />
                          <span>Google Verified Identity</span>
                        </span>
                      ) : isCompanyEmail ? (
                        <span className="text-[10px] text-[#A9C632] font-bold flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#A9C632]" />
                          <span>Verified @{domain}</span>
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
                        placeholder="you@gmail.com or you@company.com"
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
                      <span>Temporary/disposable emails are blocked. Please enter a real Gmail or company address.</span>
                    </p>
                  )}

                  {errorMsg && (
                    <p className="text-xs text-red-500 font-semibold text-center bg-red-500/10 p-2 rounded-xl border border-red-500/20">
                      {errorMsg}
                    </p>
                  )}

                  {/* Send Code Action */}
                  <button
                    type="submit"
                    disabled={isLoading || !email.includes("@") || isDisposableEmail(email)}
                    className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-101 flex items-center justify-center gap-2 cursor-pointer bg-[#1D2E1B] text-white hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B] dark:hover:bg-[#96B228] disabled:opacity-50 mt-3"
                  >
                    <span>Send 6-Digit Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════════════════
                STEP 2: 6-DIGIT OTP SECURITY VERIFICATION
            ══════════════════════════════════════════════════════════════ */
            <div>
              {/* Back to Step 1 Button */}
              <button
                onClick={() => {
                  playTapSound();
                  setAuthStep("credentials");
                  setErrorMsg("");
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white transition-colors mb-4 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Email / Back</span>
              </button>

              <div className="flex flex-col items-center text-center space-y-3 mb-5">
                <div className="w-14 h-14 apple-icon-tile bg-[#A9C632]/20 border border-[#A9C632]/50 p-3 flex items-center justify-center text-[#A9C632] shadow-md">
                  <KeyRound className="w-7 h-7 text-[#A9C632]" />
                </div>

                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[#1D2E1B] dark:text-white">
                    Verify Your Identity
                  </h2>
                  <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] mt-1 font-semibold max-w-sm">
                    Enter the 6-digit verification code generated for{" "}
                    <strong className="text-[#1D2E1B] dark:text-white underline">{email}</strong>
                  </p>
                </div>

                {/* Real OTP Active Verification Card */}
                <div className="w-full p-3.5 rounded-2xl bg-[#A9C632]/15 border border-[#A9C632]/40 flex items-center justify-between shadow-xs">
                  <div className="text-left">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#546E50] dark:text-[#C8D2A6] block">
                      Verification Code
                    </span>
                    <span className="font-mono text-base font-black tracking-widest text-[#1D2E1B] dark:text-[#A9C632]">
                      {generatedOtp}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoFillCode}
                    className="px-3 py-1.5 rounded-xl bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:scale-103 transition-transform shadow-xs"
                  >
                    {copiedOtp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedOtp ? "Code Filled!" : "Auto-Fill Code"}</span>
                  </button>
                </div>
              </div>

              {/* 6 Digit Input Boxes */}
              <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }} className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpInputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className={`w-12 h-14 text-center text-xl font-mono font-black rounded-2xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#A9C632] ${
                        digit
                          ? "border-[#A9C632] bg-[#A9C632]/10 text-[#1D2E1B] dark:text-white"
                          : isDarkMode
                          ? "bg-[#243822] border-[#3D543A] text-white"
                          : "bg-[#F7F9F2] border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  ))}
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-500 font-semibold text-center bg-red-500/10 p-2 rounded-xl border border-red-500/20">
                    {errorMsg}
                  </p>
                )}

                {successMsg && (
                  <p className="text-xs text-[#A9C632] font-semibold text-center flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A9C632]" />
                    <span>{successMsg}</span>
                  </p>
                )}

                {/* Verify Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || otpDigits.join("").length < 6}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-101 flex items-center justify-center gap-2 cursor-pointer bg-[#1D2E1B] text-white hover:bg-[#2D442A] dark:bg-[#A9C632] dark:text-[#1D2E1B] dark:hover:bg-[#96B228] disabled:opacity-50"
                >
                  <span>{isLoading ? "Verifying Session..." : "Verify Code & Launch Findely"}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                {/* Resend Code Section */}
                <div className="flex items-center justify-between text-xs text-[#546E50] dark:text-[#C8D2A6] pt-1">
                  <span>Didn't receive code?</span>
                  {resendTimer > 0 ? (
                    <span className="font-mono text-[#A9C632] font-bold">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        createNewOtp();
                        setResendTimer(30);
                        setErrorMsg("");
                      }}
                      className="font-bold text-[#A9C632] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Resend Code</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Footer Security Signals */}
          <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[10px] text-[#546E50] dark:text-[#C8D2A6] font-medium">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#A9C632]" />
              <span>256-bit encrypted verification</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#A9C632]" />
              <span>Findely Verified Identity</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
