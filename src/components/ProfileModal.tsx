"use client";

import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "@/app/actions";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Clock, 
  FileText, 
  Globe, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/authContext";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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

export default function ProfileModal({
  isOpen,
  onClose,
  isDarkMode = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.email ? user.email.split("@")[0].toLowerCase() : "",
    email: user?.email || "",
    phone: "",
    location: "San Francisco, CA & Remote",
    employment_status: "actively_looking",
    experience_level: "Builder / Engineer",
    availability: "immediate",
    resume_filename: "",
    resume_url: "",
    bio: "",
    skills: [] as string[],
    linkedin_url: "",
    github_url: "",
    behance_url: "",
    instagram_url: "",
    website_url: "",
    project_url: "",
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getUserProfile();
      if (res) {
        setForm({
          name: res.name || "",
          username: res.username || "",
          email: res.email || "",
          phone: res.phone || "",
          location: res.location || "",
          employment_status: res.employment_status || "actively_looking",
          experience_level: res.experience_level || "Senior (5+ yrs)",
          availability: res.availability || "immediate",
          resume_filename: res.resume_filename || "Resume_2026.pdf",
          resume_url: res.resume_url || "",
          bio: res.bio || "",
          skills: res.skills || [],
          linkedin_url: res.linkedin_url || "",
          github_url: res.github_url || "",
          behance_url: res.behance_url || "",
          instagram_url: res.instagram_url || "",
          website_url: res.website_url || "",
          project_url: res.project_url || "",
        });
      }
      setLoading(false);
    }
    if (isOpen) load();
  }, [isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateUserProfile(form);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (!form.skills.includes(newSkill.trim())) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    }
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border flex flex-col max-h-[90vh] ${
              isDarkMode
                ? "bg-[#0C100E] border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            {/* Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              isDarkMode ? "bg-white/[0.02] border-white/[0.08]" : "bg-gray-50/80 border-gray-200"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#4E9B78]/15 text-[#4E9B78] flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-space-grotesk">Candidate Profile & Portfolio</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Manage credentials, social handles, resume, and availability.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
              {/* Section 1: Basic Identity */}
              <div>
                <h3 className="font-bold uppercase tracking-wider text-[10px] font-mono text-gray-400 mb-3">
                  1. Personal & Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:border-[#4E9B78] font-medium ${
                        isDarkMode
                          ? "bg-[#141B18] text-white border-white/15"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                      Username (@handle)
                    </label>
                    <input
                      type="text"
                      required
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:border-[#4E9B78] font-mono ${
                        isDarkMode
                          ? "bg-[#141B18] text-white border-white/15"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:border-[#4E9B78] font-mono ${
                        isDarkMode
                          ? "bg-[#141B18] text-white border-white/15"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:border-[#4E9B78] font-mono ${
                        isDarkMode
                          ? "bg-[#141B18] text-white border-white/15"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA or Remote"
                      className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:border-[#4E9B78] ${
                        isDarkMode
                          ? "bg-[#141B18] text-white border-white/15"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Career Status & Availability */}
              <div>
                <h3 className="font-bold uppercase tracking-wider text-[10px] font-mono text-gray-400 mb-3">
                  2. Career Status & Availability
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                      Employment Status
                    </label>
                    <select
                      value={form.employment_status}
                      onChange={(e) => setForm({ ...form, employment_status: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border focus:outline-none cursor-pointer font-semibold ${
                        isDarkMode
                          ? "bg-[#141B18] text-white border-white/15"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    >
                      <option value="actively_looking">Actively Looking</option>
                      <option value="freelancer">Freelancer / Contractor</option>
                      <option value="fresher">Fresher / Graduate</option>
                      <option value="employed">Employed (Open to offers)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                      Experience Level
                    </label>
                    <input
                      type="text"
                      value={form.experience_level}
                      onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                        isDarkMode
                          ? "bg-[#141B18] text-white border-white/15"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                      Can Join By
                    </label>
                    <select
                      value={form.availability}
                      onChange={(e) => setForm({ ...form, availability: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border focus:outline-none cursor-pointer font-semibold ${
                        isDarkMode
                          ? "bg-[#141B18] text-white border-white/15"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    >
                      <option value="immediate">Immediately</option>
                      <option value="2_weeks">2 Weeks Notice</option>
                      <option value="1_month">1 Month Notice</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Resume Attachment */}
              <div>
                <h3 className="font-bold uppercase tracking-wider text-[10px] font-mono text-gray-400 mb-2">
                  3. Resume / Curriculum Vitae
                </h3>
                <div className={`flex items-center gap-3 p-3.5 rounded-2xl border ${
                  isDarkMode
                    ? "bg-white/[0.03] border-white/10"
                    : "bg-gray-50 border-gray-200"
                }`}>
                  <FileText className="w-6 h-6 text-[#4E9B78]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate">{form.resume_filename}</p>
                    <p className="text-[10px] text-gray-400 font-mono">PDF Document · Attached for 1-Click Apply</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#4E9B78]/15 text-[#15803D] dark:text-[#4E9B78]">
                    Ready
                  </span>
                </div>
              </div>

              {/* Section 4: Skills */}
              <div>
                <h3 className="font-bold uppercase tracking-wider text-[10px] font-mono text-gray-400 mb-2">
                  4. Core Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 font-medium border ${
                        isDarkMode
                          ? "bg-white/[0.06] border-white/10 text-white"
                          : "bg-gray-100 border-gray-200 text-gray-800"
                      }`}
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. Next.js, AI Models, Figma)..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    className={`flex-1 px-3.5 py-2 rounded-xl border focus:outline-none ${
                      isDarkMode
                        ? "bg-[#141B18] text-white border-white/15"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-black/5 dark:bg-white/10 rounded-xl font-bold hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Section 5: Social & Portfolio Handles */}
              <div>
                <h3 className="font-bold uppercase tracking-wider text-[10px] font-mono text-gray-400 mb-3">
                  5. Social & Portfolio Profiles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* LinkedIn */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                    isDarkMode ? "bg-[#141B18] border-white/15" : "bg-white border-gray-300"
                  }`}>
                    <LinkedinIcon className="w-4 h-4 text-[#0A66C2] flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="LinkedIn URL"
                      value={form.linkedin_url}
                      onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                      className="bg-transparent focus:outline-none flex-1 text-xs font-mono truncate"
                    />
                  </div>

                  {/* GitHub */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                    isDarkMode ? "bg-[#141B18] border-white/15" : "bg-white border-gray-300"
                  }`}>
                    <GithubIcon className="w-4 h-4 text-gray-800 dark:text-gray-200 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      value={form.github_url}
                      onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                      className="bg-transparent focus:outline-none flex-1 text-xs font-mono truncate"
                    />
                  </div>

                  {/* Behance */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                    isDarkMode ? "bg-[#141B18] border-white/15" : "bg-white border-gray-300"
                  }`}>
                    <BehanceIcon className="w-4 h-4 text-[#0057FF] flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Behance / Portfolio URL"
                      value={form.behance_url}
                      onChange={(e) => setForm({ ...form, behance_url: e.target.value })}
                      className="bg-transparent focus:outline-none flex-1 text-xs font-mono truncate"
                    />
                  </div>

                  {/* Instagram */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                    isDarkMode ? "bg-[#141B18] border-white/15" : "bg-white border-gray-300"
                  }`}>
                    <InstagramIcon className="w-4 h-4 text-[#E4405F] flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Instagram URL"
                      value={form.instagram_url}
                      onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                      className="bg-transparent focus:outline-none flex-1 text-xs font-mono truncate"
                    />
                  </div>

                  {/* Personal Website */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                    isDarkMode ? "bg-[#141B18] border-white/15" : "bg-white border-gray-300"
                  }`}>
                    <Globe className="w-4 h-4 text-[#4E9B78] flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Personal Website URL"
                      value={form.website_url}
                      onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                      className="bg-transparent focus:outline-none flex-1 text-xs font-mono truncate"
                    />
                  </div>

                  {/* Live Project URL */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                    isDarkMode ? "bg-[#141B18] border-white/15" : "bg-white border-gray-300"
                  }`}>
                    <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Featured Live Project URL"
                      value={form.project_url}
                      onChange={(e) => setForm({ ...form, project_url: e.target.value })}
                      className="bg-transparent focus:outline-none flex-1 text-xs font-mono truncate"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] font-mono text-gray-400 mb-1">
                  6. Professional Bio / Headline
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className={`w-full p-3 rounded-2xl border focus:outline-none focus:border-[#4E9B78] resize-none leading-relaxed ${
                    isDarkMode
                      ? "bg-[#141B18] text-white border-white/15"
                      : "bg-white text-gray-900 border-gray-300"
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#4E9B78] hover:bg-[#3E8564] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved!</span>
                    </>
                  ) : saving ? (
                    <span>Saving...</span>
                  ) : (
                    <span>Save Profile</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
