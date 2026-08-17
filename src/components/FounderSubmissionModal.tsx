"use client";

import { useState } from "react";
import { sendEmailOtp, verifyEmailOtp, submitFounderRoleListing } from "@/app/actions";
import { X, Loader2, Sparkles, Building2, MapPin, Link as LinkIcon, CheckCircle2, ShieldCheck, Mail, ArrowRight, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FounderSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function FounderSubmissionModal({
  isOpen,
  onClose,
  onSuccess,
}: FounderSubmissionModalProps) {
  const [step, setStep] = useState<"otp" | "details">("otp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // OTP state
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [officeCity, setOfficeCity] = useState("San Francisco, CA");
  const [companyDesc, setCompanyDesc] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [salaryRange, setSalaryRange] = useState("$160,000 - $220,000");
  const [jobType, setJobType] = useState<string>("Full-time · Onsite");
  const [techStackInput, setTechStackInput] = useState("TypeScript, React, Node.js");
  const [applyUrl, setApplyUrl] = useState("");
  const [founderName, setFounderName] = useState("");
  const [founderLinkedin, setFounderLinkedin] = useState("");

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please provide a valid founder or work email address.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await sendEmailOtp({ email, name: founderName || undefined });
      if (res.success) {
        setOtpSent(true);
        setSuccessMessage(res.message || "Verification code dispatched to your inbox.");
      } else {
        setError(res.error || "Failed to dispatch verification code.");
      }
    } catch (err: any) {
      setError(err.message || "Error sending code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await verifyEmailOtp({ email, otpCode });
      if (res.success) {
        setIsEmailVerified(true);
        setStep("details");
        setSuccessMessage("");
      } else {
        setError(res.error || "Invalid verification code.");
      }
    } catch (err: any) {
      setError(err.message || "Error verifying code.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const techStack = techStackInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await submitFounderRoleListing({
        email,
        otpCode,
        companyName,
        websiteUrl,
        officeCity,
        roleTitle,
        department,
        salaryRange,
        jobType,
        techStack,
        applyUrl,
        founderName,
        founderLinkedin,
        companyDescription: companyDesc,
      });

      if (res.success) {
        setSuccessMessage(res.message || "Listing successfully created!");
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1800);
      } else {
        setError(res.error || "Failed to publish listing.");
      }
    } catch (err: any) {
      setError(err.message || "Error submitting listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B0A]/85 backdrop-blur-md font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-[#0F1412] border border-white/[0.09] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/[0.07] bg-[#121A16]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#8EAFA0]/15 border border-[#8EAFA0]/30 flex items-center justify-center text-[#8EAFA0]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-space-grotesk tracking-tight">
                  Founder Self-Submission Portal
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8EAFA0]/15 text-[#8EAFA0] border border-[#8EAFA0]/30 font-mono font-medium">
                  Track B
                </span>
              </div>
              <p className="text-xs text-[#8A9A92]">
                Publish frontier engineering & founding roles directly to Findely's live spatial map
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8A9A92] hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#8A9A92]">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-2xl text-red-300 text-xs">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-[#8EAFA0]/10 border border-[#8EAFA0]/30 rounded-2xl text-[#8EAFA0] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === "otp" ? (
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#8EAFA0] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-white">Anti-Spam Founder Verification</p>
                    <p className="text-[#8A9A92] leading-relaxed">
                      To prevent duplicate or malicious postings, please verify your work email address with a 6-digit OTP code before submitting.
                    </p>
                  </div>
                </div>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                        Founder / Work Email <span className="text-[#8EAFA0]">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="founder@yourstartup.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#8EAFA0] hover:bg-[#A1C2B3] text-[#080B0A] font-semibold rounded-2xl transition-all shadow-lg hover:shadow-[#8EAFA0]/20 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Request Verification Code <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                        Enter 6-Digit Code sent to <span className="text-white">{email}</span>
                      </label>
                      <input
                        required
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        className="w-full px-4 py-3 bg-[#141C18] border border-[#8EAFA0]/40 rounded-2xl text-white text-center text-lg tracking-[0.3em] font-mono focus:outline-none focus:border-[#8EAFA0]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="flex-1 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-white rounded-2xl text-xs font-semibold transition-colors"
                      >
                        Change Email
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-2 flex items-center justify-center gap-2 py-2.5 bg-[#8EAFA0] hover:bg-[#A1C2B3] text-[#080B0A] font-semibold rounded-2xl transition-all disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Continue"}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.form
                key="step-details"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSubmitRole}
                className="space-y-4"
              >
                {/* Company & Founder section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                      Company Name <span className="text-[#8EAFA0]">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Anthropic, Linear, Cursor"
                      className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                      Website URL <span className="text-[#8EAFA0]">*</span>
                    </label>
                    <input
                      required
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourstartup.com"
                      className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0]"
                    />
                  </div>
                </div>

                {/* Office Location & Job Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                      Office City / Region <span className="text-[#8EAFA0]">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={officeCity}
                      onChange={(e) => setOfficeCity(e.target.value)}
                      placeholder="e.g. San Francisco, CA or Remote"
                      className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                      Workplace Type
                    </label>
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white focus:outline-none focus:border-[#8EAFA0]"
                    >
                      <option value="Full-time · Onsite">Full-time · Onsite</option>
                      <option value="Full-time · Hybrid">Full-time · Hybrid</option>
                      <option value="Full-time · Remote">Full-time · Remote</option>
                      <option value="Contract / Intern">Contract / Intern</option>
                    </select>
                  </div>
                </div>

                {/* Role Title & Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                      Role Title <span className="text-[#8EAFA0]">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="e.g. Founding AI Engineer"
                      className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Engineering, Research, Product"
                      className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0]"
                    />
                  </div>
                </div>

                {/* Salary Range & Tech Stack */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                      Salary Range (Optional)
                    </label>
                    <input
                      type="text"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      placeholder="e.g. $160,000 - $220,000"
                      className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                      Tech Stack (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      placeholder="e.g. Rust, PyTorch, Next.js"
                      className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0]"
                    />
                  </div>
                </div>

                {/* Direct Apply URL (Validated live) */}
                <div>
                  <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                    Direct Apply Link <span className="text-[#8EAFA0]">*</span>
                  </label>
                  <input
                    required
                    type="url"
                    value={applyUrl}
                    onChange={(e) => setApplyUrl(e.target.value)}
                    placeholder="https://yourstartup.com/careers/apply or form link"
                    className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0]"
                  />
                  <p className="text-[11px] text-[#8A9A92]/70 mt-1">
                    Findely automatically checks that this URL returns HTTP 200 and matches the job title.
                  </p>
                </div>

                {/* Founder Info (Optional opt-in) */}
                <div className="pt-2 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                      Founder Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8A9A92] uppercase tracking-wider mb-1.5">
                      Founder LinkedIn (Optional)
                    </label>
                    <input
                      type="url"
                      value={founderLinkedin}
                      onChange={(e) => setFounderLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-2.5 bg-[#141C18] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8EAFA0]"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#8EAFA0] hover:bg-[#A1C2B3] text-[#080B0A] font-semibold rounded-2xl transition-all shadow-lg hover:shadow-[#8EAFA0]/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Listing to Map"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
