"use client";

import { useState, useEffect } from "react";
import { getUserProfile } from "@/app/actions";
import { 
  X, 
  Mail, 
  ExternalLink, 
  Copy, 
  Check, 
  Edit3, 
  Sparkles, 
  Share2, 
  Download, 
  FileText, 
  MapPin, 
  Briefcase, 
  Clock, 
  Video, 
  Globe, 
  Layers,
  ArrowUpRight,
  Bookmark,
  Paperclip,
  Mic,
  Send,
  Calendar,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Search,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import EditSocialsModal from "./EditSocialsModal";
import ProfileModal from "./ProfileModal";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

function BehanceIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.171 3-3.455 0-5.555-2.477-5.555-5.992 0-3.738 2.378-5.993 5.485-5.993 3.518 0 5.244 2.478 5.244 5.993 0 .393-.03.805-.084 1.233h-7.79c.074 1.761 1.139 2.87 2.696 2.87 1.244 0 2.05-.623 2.355-1.111h2.825zm-2.91-4.241c-.083-1.32-.861-2.227-2.316-2.227-1.381 0-2.257.907-2.43 2.227h4.746zM0 4.5h6.643c2.091 0 3.738.544 4.707 1.603.771.844 1.15 1.905 1.15 3.037 0 1.341-.539 2.457-1.572 3.25 1.488.75 2.272 2.08 2.272 3.725 0 1.345-.487 2.585-1.424 3.535C10.748 20.686 9.07 21 6.848 21H0V4.5zm3.137 6.037h3.042c1.479 0 2.42-.65 2.42-1.745 0-1.12-.916-1.708-2.42-1.708H3.137v3.453zm0 7.426h3.483c1.696 0 2.766-.757 2.766-2.023 0-1.275-1.07-2.052-2.766-2.052H3.137v4.075z"/>
    </svg>
  );
}

export default function CandidateHeroOverlay({
  isOpen,
  onClose,
  isDarkMode = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [showEditSocials, setShowEditSocials] = useState(false);
  const [showFullProfileModal, setShowFullProfileModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);

  // Toggle tasks state (matching reference tasks switches)
  const [tasks, setTasks] = useState([
    { id: "1", title: "Spatial Canvas Concept", time: "2:00 PM", status: "Urgent", active: true },
    { id: "2", title: "Findely Dashboard Spec", time: "16:00 PM", status: "To-do", active: false },
    { id: "3", title: "Shader Performance Review", time: "18:30 PM", status: "In-Progress", active: true },
  ]);

  const loadData = async () => {
    setLoading(true);
    const res = await getUserProfile();
    setProfile(res);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) loadData();
  }, [isOpen]);

  const copyHandle = () => {
    if (profile?.username) {
      navigator.clipboard.writeText(`@${profile.username}`);
      setCopiedHandle(true);
      setTimeout(() => setCopiedHandle(false), 2000);
    }
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySent(true);
    setTimeout(() => {
      setReplySent(false);
      setReplyText("");
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 select-none font-sans overflow-hidden">
          {/* ── Background: Smooth Ethereal Soft Gradient Mesh ─ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 backdrop-blur-2xl transition-colors ${
              isDarkMode
                ? "bg-gradient-to-br from-[#1B3D2E]/40 via-[#060908]/95 to-[#0A0E0C]/98"
                : "bg-gradient-to-br from-[#E2ECE6]/80 via-[#F8FAFA]/95 to-[#EBF3EE]/90"
            }`}
          />

          {/* Close Button Floating */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2.5 rounded-full bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 shadow-lg border border-black/5 dark:border-white/10 text-gray-700 dark:text-white transition-all cursor-pointer"
            title="Close Profile (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ── Outer Shell: Full Width Exact Spatial Canvas ──── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className={`relative z-10 w-full max-w-[1720px] h-[94vh] rounded-[36px] border shadow-2xl p-4 md:p-6 overflow-hidden flex flex-col justify-between ${
              isDarkMode
                ? "bg-[#090D0B]/80 border-white/[0.08] text-white"
                : "bg-white/70 border-white/80 text-gray-900 shadow-gray-200/50"
            }`}
          >
            {/* ── Top Floating Header inside Spatial View ────── */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-black/[0.04] dark:border-white/[0.06] flex-shrink-0">
              {/* Brand icon and candidate search chips */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#4E9B78] text-white flex items-center justify-center font-bold text-base shadow-sm font-space-grotesk">
                  F.
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.05] dark:border-white/[0.08] text-xs">
                  <Search className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-medium text-gray-600 dark:text-gray-300">Alex Rivera</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#4E9B78]/15 text-[#15803D] dark:text-[#4E9B78]">
                    Senior Product Designer
                  </span>
                </div>
              </div>

              {/* Right Action Icons & Add Company / Hire button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditSocials(true)}
                  className="p-2.5 rounded-2xl border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
                  title="Quick Edit Social Links"
                >
                  <Edit3 className="w-4 h-4 text-[#4E9B78]" />
                </button>
                <button
                  onClick={() => setShowFullProfileModal(true)}
                  className="p-2.5 rounded-2xl border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
                  title="Upload Resume & Full Editor"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={copyHandle}
                  className="p-2.5 rounded-2xl border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
                  title="Copy Profile Handle"
                >
                  {copiedHandle ? <Check className="w-4 h-4 text-[#4E9B78]" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href="mailto:alex@findely.app"
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-2xl font-bold text-xs shadow-md hover:scale-102 transition-all cursor-pointer ml-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#4E9B78]" />
                  <span>Hire Candidate</span>
                </a>
              </div>
            </div>

            {/* ── Main 3-Column Body Grid (Exact Reference Anatomy) ─ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto pt-4 pb-2">
              {/* ── LEFT COLUMN: Cards & Timeline (col-span-3) ── */}
              <div className="lg:col-span-3 space-y-4 overflow-y-auto pr-1">
                {/* Left Card 1: Potential Office / Location Focus */}
                <div className={`p-5 rounded-[28px] border shadow-xs transition-all flex flex-col justify-between ${
                  isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200/80 shadow-gray-100"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                        alt="Profile"
                        className="w-8 h-8 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-xs">Brendan Walsh</h4>
                        <span className="text-[10px] text-gray-400 font-mono">Reference · Design VP</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="mt-3">
                    <h3 className="font-bold text-sm font-space-grotesk">Spatial Office Review</h3>
                    <span className="text-[11px] text-gray-400 font-mono">09:45 AM - 10:15 PM</span>
                  </div>

                  {/* Visual Location Snippet Banner */}
                  <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-red-950/20 to-amber-950/20 border border-black/5 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400">Location Base</span>
                      <p className="font-bold text-xs">San Francisco, CA</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-black/80 text-white text-[10px] font-mono font-bold">
                      Route 45m
                    </span>
                  </div>
                </div>

                {/* Left Card 2: Business Offer / Career Status */}
                <div className={`p-5 rounded-[28px] border shadow-xs transition-all ${
                  isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200/80 shadow-gray-100"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center font-bold text-xs">
                        AL
                      </div>
                      <div>
                        <h4 className="font-bold text-xs">Adriana Livingston</h4>
                        <span className="text-[10px] text-gray-400 font-mono">Talent Lead · Stripe</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="mt-3">
                    <h3 className="font-bold text-sm font-space-grotesk">Active Interview Offer</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      Need seasoned expertise in design systems and WebGL components.
                    </p>
                  </div>
                </div>

                {/* Left Card 3: Team Stand Up / Notice */}
                <div className={`p-5 rounded-[28px] border shadow-xs transition-all ${
                  isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200/80 shadow-gray-100"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#4E9B78]/15 text-[#4E9B78] flex items-center justify-center font-bold text-xs">
                        DR
                      </div>
                      <div>
                        <h4 className="font-bold text-xs">Donny Richards</h4>
                        <span className="text-[10px] text-gray-400 font-mono">Founder · Linear</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="mt-3">
                    <h3 className="font-bold text-sm font-space-grotesk">Candidate Stand Up</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Available to join immediately for high-impact frontier challenges.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── CENTER HERO COLUMN: Candidate Bio & Feed (col-span-6) ── */}
              <div className={`lg:col-span-6 rounded-[32px] border shadow-xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-6 ${
                isDarkMode ? "bg-[#0E1311] border-white/[0.1]" : "bg-white border-gray-200 shadow-sm"
              }`}>
                {/* Center Top Header Bar */}
                <div className="flex items-center justify-between text-xs text-gray-400 border-b border-black/[0.04] dark:border-white/[0.06] pb-3">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-semibold font-mono">
                    <ShieldCheck className="w-4 h-4 text-[#4E9B78]" />
                    <span>Verified Frontier Candidate</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span>15 August, 2026</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Candidate Hero Headliner */}
                <div className="text-center space-y-3">
                  <div className="relative inline-block mx-auto">
                    <img
                      src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240"}
                      alt={profile?.name || "Alex Rivera"}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-[#4E9B78]/30 shadow-xl mx-auto"
                    />
                    <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs border-2 border-white dark:border-black shadow-md">
                      C
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold font-space-grotesk tracking-tight">
                      {profile?.name || "Alex Rivera"}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                      {profile?.experience_level || "Product Designer & Full-Stack Architect at Findely"}
                    </p>
                  </div>

                  {/* Action Icon Strip (Matching Reference: Reply, Edit, Copy, Save, etc.) */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => setShowEditSocials(true)}
                      className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-colors"
                      title="Edit Social Handles"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#4E9B78]" />
                    </button>
                    <button
                      onClick={copyHandle}
                      className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-colors"
                      title="Copy @handle"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setShowFullProfileModal(true)}
                      className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-colors"
                      title="Edit Full Profile & Resume"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={copyHandle}
                      className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-colors"
                      title="Bookmark Profile"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-blue-500" />
                    </button>
                  </div>

                  {/* Social Handles Badges */}
                  <div className="flex items-center justify-center flex-wrap gap-2 pt-1">
                    {profile?.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 hover:border-[#0A66C2] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <LinkedinIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
                        <span className="font-mono text-[11px]">LinkedIn</span>
                      </a>
                    )}
                    {profile?.github_url && (
                      <a
                        href={profile.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 hover:border-gray-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span className="font-mono text-[11px]">GitHub</span>
                      </a>
                    )}
                    {profile?.behance_url && (
                      <a
                        href={profile.behance_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 hover:border-[#0057FF] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <BehanceIcon className="w-3.5 h-3.5 text-[#0057FF]" />
                        <span className="font-mono text-[11px]">Behance</span>
                      </a>
                    )}
                    {profile?.website_url && (
                      <a
                        href={profile.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 hover:border-[#4E9B78] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#4E9B78]" />
                        <span className="font-mono text-[11px]">Portfolio</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Candidate Message & Bio Pitch */}
                <div className="space-y-3 text-xs leading-relaxed text-gray-700 dark:text-gray-300 font-sans">
                  <p className="font-bold text-gray-900 dark:text-white">Hey Hiring Team,</p>
                  <p>
                    Here is a comprehensive overview of my experience in design systems, 60fps WebGL interfaces, and developer tooling. Over the past 6+ years, I have architected spatial workspaces for frontier AI startups and high-performance product teams.
                  </p>
                  <p>
                    All my systems prioritize maximum legibility, zero arbitrary layout shifts, and deep mechanical elegance. Looking forward to connecting and discussing high-impact design challenges!
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white pt-1">
                    Best,<br />
                    Alex Rivera
                  </p>
                </div>

                {/* Attached Media Cards (Matching "Video Presentation" & "Reel Showcase") */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDarkMode ? "bg-[#141B18] border-white/10" : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs">Video Presentation</h4>
                        <span className="text-[10px] text-gray-400 font-mono">8.5 MB · MP4</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDarkMode ? "bg-[#141B18] border-white/10" : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#4E9B78]/15 text-[#4E9B78] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs">Alex_Rivera_CV.pdf</h4>
                        <span className="text-[10px] text-gray-400 font-mono">184 KB · Resume</span>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-[#4E9B78]" />
                  </div>
                </div>

                {/* Bottom Interactive Message Bar (Matching "Start typing your reply here") */}
                <form onSubmit={handleSendReply} className={`p-2.5 rounded-2xl border flex items-center gap-2 ${
                  isDarkMode ? "bg-[#141B18] border-white/10" : "bg-gray-50 border-gray-200"
                }`}>
                  <input
                    type="text"
                    placeholder="Start typing your message to Alex..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-1.5 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5 pr-1">
                    <button type="button" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white">
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white">
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="submit"
                      className="w-8 h-8 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 flex items-center justify-center shadow-md hover:scale-105 transition-all"
                    >
                      {replySent ? <Check className="w-4 h-4 text-[#4E9B78]" /> : <Send className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </form>
              </div>

              {/* ── RIGHT COLUMN: Skills, Events & Tasks (col-span-3) ── */}
              <div className="lg:col-span-3 space-y-4 overflow-y-auto pl-1">
                {/* Right Card 1: Webinars / Masterclasses / Skills */}
                <div className={`p-5 rounded-[28px] border shadow-xs transition-all ${
                  isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200/80 shadow-gray-100"
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#4E9B78]" />
                      <h4 className="font-bold text-xs font-space-grotesk">Expertise Modules</h4>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06]">
                      <span className="font-bold text-base font-mono text-[#15803D] dark:text-[#4E9B78]">98%</span>
                      <h5 className="font-bold text-xs mt-1">Design Systems</h5>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">Tokens & Scales</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06]">
                      <span className="font-bold text-base font-mono text-[#2563EB] dark:text-blue-400">96%</span>
                      <h5 className="font-bold text-xs mt-1">React & Next.js</h5>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">Turbopack & GPU</p>
                    </div>
                  </div>
                </div>

                {/* Right Card 2: Events / Experience Timeline */}
                <div className={`p-5 rounded-[28px] border shadow-xs transition-all ${
                  isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200/80 shadow-gray-100"
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <h4 className="font-bold text-xs font-space-grotesk">Career Timeline</h4>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">2021 - 2026</span>
                  </div>

                  <div className="space-y-3 mt-3 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 font-mono block">Staff Product Designer</span>
                      <h5 className="font-bold text-xs">Stripe Inc. · Payments UI</h5>
                      <span className="text-[10px] text-gray-500">09:00 AM - 10:00 AM</span>
                    </div>

                    <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                      <span className="text-[10px] text-gray-400 font-mono block">Lead Frontend Architect</span>
                      <h5 className="font-bold text-xs">Vercel · Next.js Ecosystem</h5>
                      <span className="text-[10px] text-gray-500">Remote · Global</span>
                    </div>
                  </div>
                </div>

                {/* Right Card 3: Tasks & Active Sprint Pipeline (Matching Reference Toggle Switches) */}
                <div className={`p-5 rounded-[28px] border shadow-xs transition-all ${
                  isDarkMode ? "bg-[#0E1311] border-white/[0.08]" : "bg-white border-gray-200/80 shadow-gray-100"
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <h4 className="font-bold text-xs font-space-grotesk">Sprint Deliverables</h4>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="space-y-3 mt-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          {/* Toggle Switch */}
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                              task.active ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white dark:bg-black transition-transform ${
                                task.active ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <div>
                            <p className="font-bold text-[11px] truncate max-w-[120px]">{task.title}</p>
                            <span className="text-[9px] text-gray-400 font-mono">{task.time}</span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                            task.status === "Urgent"
                              ? "bg-red-500/15 text-red-600 dark:text-red-400"
                              : task.status === "In-Progress"
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                              : "bg-black/5 dark:bg-white/10 text-gray-500"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Edit Socials Modal */}
          <EditSocialsModal
            isOpen={showEditSocials}
            onClose={() => setShowEditSocials(false)}
            initialLinks={{
              linkedin_url: profile?.linkedin_url,
              github_url: profile?.github_url,
              behance_url: profile?.behance_url,
              instagram_url: profile?.instagram_url,
              website_url: profile?.website_url,
              project_url: profile?.project_url,
              bio: profile?.bio,
            }}
            onUpdated={(updated) => {
              setProfile((prev: any) => ({ ...prev, ...updated }));
            }}
            isDarkMode={isDarkMode}
          />

          {/* Full Profile Editor Modal */}
          <ProfileModal
            isOpen={showFullProfileModal}
            onClose={() => {
              setShowFullProfileModal(false);
              loadData();
            }}
            isDarkMode={isDarkMode}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
