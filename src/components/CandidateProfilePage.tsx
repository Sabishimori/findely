"use client";

import { useState, useEffect, useRef } from "react";
import { getUserProfile, updateUserProfile } from "@/app/actions";
import { 
  GraduationCap, 
  Briefcase, 
  Wrench, 
  Award, 
  Target, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  Edit3, 
  Plus, 
  Trash2, 
  ExternalLink, 
  FileText, 
  Video, 
  Download, 
  Globe, 
  Eye, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Upload, 
  X, 
  Camera,
  Play,
  CheckCircle2,
  FileUp,
  Save,
  Link as LinkIcon,
  Tag,
  Building,
  Clock,
  User,
  LogIn,
  LogOut,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import EditSocialsModal from "./EditSocialsModal";
import { useAuth } from "@/lib/authContext";
import { playTapSound } from "@/lib/soundFx";

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

export default function CandidateProfilePage({
  isDarkMode = false,
}: {
  isDarkMode?: boolean;
}) {
  const { user, openAuthModal, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showEditSocials, setShowEditSocials] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState<"video" | "cv" | null>(null);

  // 👤 Candidate Core Identity State (Dynamic to User)
  const [candidateName, setCandidateName] = useState(user?.name || "Your Name");
  const [candidateRole, setCandidateRole] = useState(user?.role || "Software Engineer / Product Builder");
  const [candidateActivity, setCandidateActivity] = useState("Actively Looking · Open to Opportunities");
  const [candidateLocation, setCandidateLocation] = useState("San Francisco, CA & Remote");

  const [identityForm, setIdentityForm] = useState({
    name: user?.name || "Your Name",
    role: user?.role || "Software Engineer / Product Builder",
    activity: "Actively Looking · Open to Opportunities",
    location: "San Francisco, CA & Remote",
  });

  // Sync with active authenticated user
  useEffect(() => {
    if (user?.name) {
      setCandidateName(user.name);
      setIdentityForm((prev) => ({ ...prev, name: user.name }));
    }
    if (user?.avatar) {
      setAvatarSrc(user.avatar);
    }
  }, [user]);

  // File Upload Refs & State
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [avatarSrc, setAvatarSrc] = useState<string>(
    user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || "Candidate")}&backgroundColor=1D2E1B&textColor=A9C632`
  );
  const [videoData, setVideoData] = useState<{
    name: string;
    url: string;
    size: string;
    duration: string;
  } | null>(null);
  const [resumeData, setResumeData] = useState<{
    name: string;
    url: string;
    size: string;
    uploadedAt: string;
  } | null>(null);

  const [uploadToast, setUploadToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setUploadToast(msg);
    setTimeout(() => setUploadToast(null), 3000);
  };

import { validateUploadFile } from "@/lib/security/fileUploadSecurity";

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateUploadFile(file, "AVATAR");
      if (!validation.valid) {
        triggerToast(`⚠️ Security Block: ${validation.error}`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setAvatarSrc(result);
          setProfile((prev: any) => ({ ...prev, avatar_url: result }));
          triggerToast("Profile photo validated & uploaded securely!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateUploadFile(file, "VIDEO");
      if (!validation.valid) {
        triggerToast(`⚠️ Security Block: ${validation.error}`);
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      setVideoData({
        name: validation.sanitizedFilename || file.name,
        url: blobUrl,
        size: sizeMb,
        duration: "0:45",
      });
      triggerToast(`Video pitch validated & uploaded securely!`);
    }
  };

  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateUploadFile(file, "RESUME");
      if (!validation.valid) {
        triggerToast(`⚠️ Security Block: ${validation.error}`);
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      const sizeKb = Math.round(file.size / 1024) + " KB";
      setResumeData({
        name: validation.sanitizedFilename || file.name,
        url: blobUrl,
        size: sizeKb,
        uploadedAt: "Just now",
      });
      triggerToast(`Resume validated & attached securely!`);
    }
  };

  // Active Pop-up Editorial Modal State
  const [activeEditorialModal, setActiveEditorialModal] = useState<
    "identity" | "education" | "experience" | "skills" | "certifications" | "expectations" | "projects" | "bio" | null
  >(null);

  // 🎓 Education State
  const [educations, setEducations] = useState([
    {
      id: "1",
      school: "Stanford University",
      course: "B.S. in Computer Science & Human-Computer Interaction",
      location: "Stanford, CA",
      year: "2019 - 2023",
      cgp: "3.9 GPA · Dean's List",
      importance: "Focus on Spatial Computation & High-Performance Graphics"
    },
    {
      id: "2",
      school: "Design Academy Eindhoven",
      course: "Spatial Systems & Interaction Architecture",
      location: "Eindhoven, Netherlands",
      year: "2023",
      cgp: "Summa Cum Laude",
      importance: "Mastered 60fps Micro-interactions and Tactile Token Systems"
    }
  ]);
  const [eduForm, setEduForm] = useState({ id: "", school: "", course: "", location: "", year: "", cgp: "", importance: "" });

  // 💼 Career Experience State
  const [experiences, setExperiences] = useState([
    {
      id: "1",
      role: "Staff Product Designer",
      company: "Stripe Inc.",
      employmentType: "Full-Time",
      location: "San Francisco, CA (Hybrid)",
      timeline: "Jan 2024 - Present",
      description: "Architecting developer dashboards, global billing surfaces, and 60fps spatial data visualizers used by millions."
    },
    {
      id: "2",
      role: "Lead Frontend Architect",
      company: "Vercel",
      employmentType: "Full-Time",
      location: "San Francisco, CA & Remote",
      timeline: "Feb 2022 - Dec 2023",
      description: "Spearheaded Next.js dashboard components and Turbopack rendering pipeline benchmarks with zero arbitrary layout shifts."
    },
    {
      id: "3",
      role: "Senior UI/UX Engineer",
      company: "Linear",
      employmentType: "Full-Time",
      location: "San Francisco, CA",
      timeline: "Aug 2020 - Jan 2022",
      description: "Engineered keyboard-first issue workflows, dark obsidian tokens, and micro-motion curves."
    }
  ]);
  const [expForm, setExpForm] = useState({ id: "", role: "", company: "", employmentType: "Full-Time", location: "", timeline: "", description: "" });

  // 🛠️ Skills State
  const [skillsList, setSkillsList] = useState<string[]>([
    "UI/UX Design", "Figma", "Design Systems", "React", "Next.js", "TypeScript", "TailwindCSS", "WebGL", "Three.js", "Spatial Interfaces"
  ]);
  const [customSkillInput, setCustomSkillInput] = useState("");

  // 📜 Certifications State
  const [certifications, setCertifications] = useState([
    { id: "1", title: "Figma Certified Design Systems Master", issuer: "Figma Academy", year: "2025", link: "https://figma.com", badge: "Verified" },
    { id: "2", title: "Advanced WebGL & GLSL Shaders Specialist", issuer: "Three.js Journey", year: "2024", link: "https://threejs-journey.com", badge: "Accredited" },
    { id: "3", title: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2023", link: "https://aws.amazon.com", badge: "Active" }
  ]);
  const [certForm, setCertForm] = useState({ id: "", title: "", issuer: "", year: "", link: "", badge: "Verified" });

  // 🎯 Expectations State
  const [expectations, setExpectations] = useState({
    targetRole: "Staff Product Designer / Principal Frontend Architect",
    targetComp: "$195,000 - $250,000 + Meaningful Equity",
    preferredLocation: "San Francisco, CA or 100% Remote",
    noticePeriod: "Immediate Availability (Can start within 2 weeks)",
    employmentType: "Full-Time or High-Impact Advisory",
    workStyle: "Autonomous, 60fps mechanical craft, developer-focused"
  });
  const [expExpectForm, setExpExpectForm] = useState({ ...expectations });

  // 🚀 Featured Projects State
  const [featuredProjects, setFeaturedProjects] = useState([
    { id: "1", title: "Spatial Canvas V3", desc: "Generative 60fps design canvas with dynamic GPU shaders and spatial autolayout.", url: "https://spatial-canvas.app", tags: ["Next.js", "WebGL", "TypeScript"] },
    { id: "2", title: "Findely 2.5D GPU Engine", desc: "Global frontier job discovery map with zero-latency basemaps and interactive inspectors.", url: "https://findely.app", tags: ["MapLibre", "React", "Drizzle"] },
  ]);
  const [projForm, setProjForm] = useState({ id: "", title: "", desc: "", url: "", tags: "" });

  // 📝 Bio Pitch State
  const [aboutBio, setAboutBio] = useState(
    "Staff Product Designer & Full-Stack Engineer crafting fluid 60fps design systems, spatial interfaces, and developer tooling. Over the past 6+ years, I have architected high-performance applications with deep mechanical elegance and zero arbitrary layout shifts."
  );
  const [bioInput, setBioInput] = useState(aboutBio);

  const loadData = async () => {
    const res = await getUserProfile(user?.email || undefined);
    if (res) {
      setProfile(res);
      if (res.name) {
        setCandidateName(res.name);
      }
      if (res.experience_level) {
        setCandidateRole(res.experience_level);
      }
      if (res.employment_status) {
        setCandidateActivity(res.employment_status);
      }
      if (res.location) {
        setCandidateLocation(res.location);
      }
      if (res.avatar_url) {
        setAvatarSrc(res.avatar_url);
      }
      if (res.bio) {
        setAboutBio(res.bio);
        setBioInput(res.bio);
      }
      if (res.skills && res.skills.length > 0) {
        setSkillsList(res.skills);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.email]);

  const handleCopyProfileLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // 👤 Identity Handlers
  const handleOpenIdentityModal = () => {
    setIdentityForm({
      name: candidateName,
      role: candidateRole,
      activity: candidateActivity,
      location: candidateLocation,
    });
    setActiveEditorialModal("identity");
  };

  const handleSaveIdentity = async () => {
    if (!identityForm.name.trim()) return;
    setCandidateName(identityForm.name);
    setCandidateRole(identityForm.role);
    setCandidateActivity(identityForm.activity);
    setCandidateLocation(identityForm.location);

    if (profile) {
      await updateUserProfile({
        ...profile,
        name: identityForm.name,
        experience_level: identityForm.role,
        employment_status: identityForm.activity,
        location: identityForm.location,
      } as any);
    }
    setActiveEditorialModal(null);
    triggerToast("Candidate profile info & location updated!");
  };

  const handleLoadStarterTemplate = () => {
    playTapSound();
    setCandidateName(user?.name || "Alex Rivera");
    setCandidateRole("Senior AI Systems & Product Architect");
    setCandidateLocation("San Francisco, CA (Hybrid)");
    setCandidateActivity("Actively Interviewing");
    setAboutBio("Building high-throughput spatial visualization engines, real-time AI agents, and frictionless developer experiences. Passionate about 60fps micro-interactions and tactile systems.");
    setSkillsList(["Next.js 15", "TypeScript", "TailwindCSS", "MapLibre GL", "PostgreSQL", "Drizzle ORM", "Python", "PyTorch"]);
    setEducations([
      {
        id: "1",
        school: "Stanford University",
        course: "B.S. in Computer Science & HCI",
        location: "Stanford, CA",
        year: "2019 - 2023",
        cgp: "3.9 GPA · Dean's List",
        importance: "Focus on Spatial Computation & High-Performance Graphics"
      }
    ]);
    setExperiences([
      {
        id: "1",
        role: "Staff Product Designer & AI Engineer",
        company: "Stripe Inc.",
        employmentType: "Full-Time",
        location: "San Francisco, CA (Hybrid)",
        timeline: "Jan 2024 - Present",
        description: "Architecting developer dashboards, global billing surfaces, and 60fps spatial data visualizers."
      }
    ]);
    triggerToast("Starter template loaded!");
  };

  const handleClearToClean = () => {
    playTapSound();
    setCandidateName(user?.name || "Candidate Profile");
    setCandidateRole("Frontier Engineer / Founder");
    setCandidateLocation("Remote / Global");
    setCandidateActivity("Open to Frontier Roles");
    setAboutBio("Welcome! Click 'Edit Bio' or any section to build your candidate portfolio.");
    setSkillsList(["TypeScript", "React", "Next.js", "AI / LLMs"]);
    setEducations([]);
    setExperiences([]);
    triggerToast("Reset to clean profile!");
  };

  // 🎓 Education Handlers
  const handleOpenEducationModal = (edu?: any) => {
    if (edu) {
      setEduForm(edu);
    } else {
      setEduForm({ id: "", school: "", course: "", location: "", year: "", cgp: "", importance: "" });
    }
    setActiveEditorialModal("education");
  };

  const handleSaveEducation = () => {
    if (!eduForm.school.trim() || !eduForm.course.trim()) return;
    if (eduForm.id) {
      setEducations((prev) => prev.map((e) => (e.id === eduForm.id ? { ...eduForm } : e)));
    } else {
      setEducations((prev) => [...prev, { ...eduForm, id: Date.now().toString() }]);
    }
    setActiveEditorialModal(null);
  };

  const handleDeleteEducation = (id: string) => {
    setEducations((prev) => prev.filter((e) => e.id !== id));
    setActiveEditorialModal(null);
  };

  // 💼 Career Experience Handlers
  const handleOpenExperienceModal = (exp?: any) => {
    if (exp) {
      setExpForm(exp);
    } else {
      setExpForm({ id: "", role: "", company: "", employmentType: "Full-Time", location: "", timeline: "", description: "" });
    }
    setActiveEditorialModal("experience");
  };

  const handleSaveExperience = () => {
    if (!expForm.role.trim() || !expForm.company.trim()) return;
    if (expForm.id) {
      setExperiences((prev) => prev.map((e) => (e.id === expForm.id ? { ...expForm } : e)));
    } else {
      setExperiences((prev) => [...prev, { ...expForm, id: Date.now().toString() }]);
    }
    setActiveEditorialModal(null);
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    setActiveEditorialModal(null);
  };

  // 🛠️ Skills Handlers
  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList((prev) => [...prev, trimmed]);
    }
    setCustomSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList((prev) => prev.filter((s) => s !== skill));
  };

  // 📜 Certification Handlers
  const handleOpenCertModal = (cert?: any) => {
    if (cert) {
      setCertForm(cert);
    } else {
      setCertForm({ id: "", title: "", issuer: "", year: "", link: "", badge: "Verified" });
    }
    setActiveEditorialModal("certifications");
  };

  const handleSaveCert = () => {
    if (!certForm.title.trim() || !certForm.issuer.trim()) return;
    if (certForm.id) {
      setCertifications((prev) => prev.map((c) => (c.id === certForm.id ? { ...certForm } : c)));
    } else {
      setCertifications((prev) => [...prev, { ...certForm, id: Date.now().toString() }]);
    }
    setActiveEditorialModal(null);
  };

  const handleDeleteCert = (id: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
    setActiveEditorialModal(null);
  };

  // 🚀 Project Handlers
  const handleOpenProjectModal = (proj?: any) => {
    if (proj) {
      setProjForm({
        id: proj.id,
        title: proj.title,
        desc: proj.desc,
        url: proj.url,
        tags: proj.tags.join(", "),
      });
    } else {
      setProjForm({ id: "", title: "", desc: "", url: "", tags: "" });
    }
    setActiveEditorialModal("projects");
  };

  const handleSaveProject = () => {
    if (!projForm.title.trim()) return;
    const tagsArray = projForm.tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (projForm.id) {
      setFeaturedProjects((prev) =>
        prev.map((p) => (p.id === projForm.id ? { ...projForm, tags: tagsArray } : p))
      );
    } else {
      setFeaturedProjects((prev) => [
        ...prev,
        { id: Date.now().toString(), title: projForm.title, desc: projForm.desc, url: projForm.url, tags: tagsArray },
      ]);
    }
    setActiveEditorialModal(null);
  };

  const handleDeleteProject = (id: string) => {
    setFeaturedProjects((prev) => prev.filter((p) => p.id !== id));
    setActiveEditorialModal(null);
  };

  // 📝 Bio Handlers
  const handleSaveBio = async () => {
    setAboutBio(bioInput);
    if (profile) {
      await updateUserProfile({ ...profile, bio: bioInput } as any);
    }
    setActiveEditorialModal(null);
  };

  return (
    <div className={`w-full h-full h-screen overflow-hidden flex flex-col justify-between pt-4 pb-4 pl-22 md:pl-26 pr-6 font-urbanist select-none transition-colors ${
      isDarkMode ? "bg-[#1D2E1B] text-white" : "bg-[#F7F9F2] text-[#1D2E1B]"
    }`}>
      
      {/* ── Toast Notification Pill ─────────────────────────── */}
      <AnimatePresence>
        {uploadToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-8 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#1D2E1B] text-white border border-[#A9C632] shadow-2xl text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4 text-[#A9C632]" />
            <span>{uploadToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={avatarInputRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleAvatarFileUpload}
      />
      <input
        type="file"
        ref={videoInputRef}
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleVideoFileUpload}
      />
      <input
        type="file"
        ref={resumeInputRef}
        accept=".pdf,.doc,.docx,application/pdf"
        className="hidden"
        onChange={handleResumeFileUpload}
      />

      {/* ── Top Header Strip ─────────────────────────────────── */}
      <div className="flex items-center justify-between pb-3 border-b border-[#C8D2A6] dark:border-[#546E50] flex-shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#1D2E1B] dark:text-white">
              {candidateName} · Candidate Portfolio & Resume
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#A9C632]/15 text-[#A9C632] border border-[#A9C632]/30">
              ● Verified Candidate 2026
            </span>
          </div>
          <p className="text-sm text-[#546E50] dark:text-[#C8D2A6] mt-0.5">
            Single-frame spatial candidate dossier. Click any section or pencil icon to customize via structured pop-up editorials.
          </p>
        </div>

        {/* Profile Actions: Template Toggle, Sign In / Out & Share Profile */}
        <div className="flex items-center gap-2.5">
          {/* Template Loader / Reset Button */}
          <button
            onClick={educations.length > 0 ? handleClearToClean : handleLoadStarterTemplate}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-[#A9C632]/50 hover:bg-[#A9C632]/10 text-[#1D2E1B] dark:text-[#A9C632] font-bold text-xs transition-all cursor-pointer shadow-xs"
            title={educations.length > 0 ? "Clear to Clean Slate Profile" : "Load Starter Profile Template"}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A9C632]" />
            <span>{educations.length > 0 ? "Reset to Clean" : "Load Starter Template"}</span>
          </button>

          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-red-500/30 hover:bg-red-500/10 text-red-500 font-bold text-xs transition-all cursor-pointer shadow-xs"
              title="Sign out of current account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-[#A9C632] bg-[#A9C632]/15 text-[#1D2E1B] dark:text-[#A9C632] font-bold text-xs transition-all cursor-pointer shadow-xs"
              title="Sign in with Google or Work Email"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Share Profile Action */}
          <button
            onClick={handleCopyProfileLink}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-[#C8D2A6] dark:border-[#546E50] hover:bg-black/5 dark:hover:bg-white/10 font-bold text-sm transition-all cursor-pointer shadow-xs text-[#1D2E1B] dark:text-white"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#A9C632]" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
          </button>
        </div>
      </div>

      {/* ── 1920x1080 Single-Frame 3-Column Matrix (NO Scroll) ── */}
      <main className="grid grid-cols-12 gap-5 flex-1 min-h-0 py-3 overflow-hidden">
        
        {/* ── LEFT COLUMN (col-span-3 - Compact Cards) ─────────── */}
        <div className="col-span-3 flex flex-col justify-between gap-3.5 min-h-0 overflow-hidden">
          
          {/* Card 1: Education */}
          <div className={`p-4.5 rounded-[28px] border shadow-xs flex-1 flex flex-col justify-between min-h-0 overflow-hidden ${
            isDarkMode ? "bg-[#1D2E1B] border-[#546E50]" : "bg-white border-[#C8D2A6] shadow-sm"
          }`}>
            <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.05] dark:border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 apple-squircle bg-[#A9C632]/15 flex items-center justify-center text-[#A9C632] border border-[#A9C632]/30">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm">Education</h3>
              </div>
              <button
                onClick={() => handleOpenEducationModal()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.12] text-xs font-semibold text-[#A9C632] transition-colors cursor-pointer"
                title="Add / Edit Education"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1 my-1">
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  onClick={() => handleOpenEducationModal(edu)}
                  className="p-2 rounded-2xl hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[#1D2E1B] dark:text-white group-hover:text-[#A9C632] transition-colors truncate">
                        {edu.school}
                      </h4>
                      <p className="text-[#546E50] dark:text-[#C8D2A6] text-[11px] truncate mt-0.5">{edu.course}</p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 flex-shrink-0">{edu.year}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#A9C632]/10 text-[10px] font-bold text-[#A9C632]">
                      {edu.cgp}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate">{edu.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Career Experience */}
          <div className={`p-4.5 rounded-[28px] border shadow-xs flex-1 flex flex-col justify-between min-h-0 overflow-hidden ${
            isDarkMode ? "bg-[#1D2E1B] border-[#546E50]" : "bg-white border-[#C8D2A6] shadow-sm"
          }`}>
            <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.05] dark:border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 apple-squircle bg-[#A9C632]/15 flex items-center justify-center text-[#A9C632] border border-[#A9C632]/30">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm">Experience</h3>
              </div>
              <button
                onClick={() => handleOpenExperienceModal()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.12] text-xs font-semibold text-[#A9C632] transition-colors cursor-pointer"
                title="Add / Edit Career Experience"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1 my-1">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => handleOpenExperienceModal(exp)}
                  className="p-2 rounded-2xl hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[#1D2E1B] dark:text-white group-hover:text-[#A9C632] transition-colors truncate">
                        {exp.role}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#A9C632] truncate mt-0.5">
                        {exp.company} · <span className="text-[#546E50] dark:text-[#C8D2A6] font-normal">{exp.employmentType}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 flex-shrink-0">{exp.timeline}</span>
                  </div>
                  <p className="text-[11px] text-[#546E50] dark:text-[#C8D2A6] truncate mt-0.5">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Skills & Technologies */}
          <div className={`p-4.5 rounded-[28px] border shadow-xs flex-1 flex flex-col justify-between min-h-0 overflow-hidden ${
            isDarkMode ? "bg-[#1D2E1B] border-[#546E50]" : "bg-white border-[#C8D2A6] shadow-sm"
          }`}>
            <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.05] dark:border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 apple-squircle bg-[#A9C632]/15 flex items-center justify-center text-[#A9C632] border border-[#A9C632]/30">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm">Skills & Stack</h3>
              </div>
              <button
                onClick={() => setActiveEditorialModal("skills")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.12] text-xs font-semibold text-[#A9C632] transition-colors cursor-pointer"
                title="Edit Skills & Chips"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 overflow-y-auto my-1">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-xl text-xs font-medium border bg-black/[0.02] dark:bg-white/[0.04] border-[#C8D2A6] dark:border-[#546E50] text-[#1D2E1B] dark:text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── CENTER COLUMN (col-span-6 - Prominent Hero Centerpiece) ─ */}
        <div className={`col-span-6 rounded-[36px] border shadow-2xl p-7 flex flex-col justify-between min-h-0 overflow-hidden ${
          isDarkMode ? "bg-[#1D2E1B] border-[#546E50] text-white" : "bg-white border-[#C8D2A6] shadow-md text-[#1D2E1B]"
        }`}>
          
          {/* Top Identity, Avatar & Interactive Upload Trigger */}
          <div className="text-center space-y-3">
            <div className="relative inline-block mx-auto group">
              {/* Apple Squircle Curvy Profile Picture Container */}
              <div 
                onClick={() => avatarInputRef.current?.click()}
                className="relative w-26 h-26 rounded-[28px] overflow-hidden ring-4 ring-[#A9C632]/40 border-2 border-[#A9C632]/50 shadow-2xl mx-auto cursor-pointer bg-[#1D2E1B]"
                title="Click to Upload Profile Photo"
              >
                <img
                  src={avatarSrc}
                  alt={candidateName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                
                {/* Hover Overlay with Camera Icon */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1">
                  <Camera className="w-5 h-5 text-[#A9C632]" />
                  <span>Upload</span>
                </div>
              </div>

              {/* Upload Badge Button */}
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#A9C632] hover:bg-[#96B228] text-[#1D2E1B] font-bold shadow-md cursor-pointer transition-transform hover:scale-110 border-2 border-white dark:border-[#1D2E1B]"
                title="Upload Profile Picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              {/* Editable Name & Pencil Button */}
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  {candidateName}
                </h2>
                <button
                  onClick={handleOpenIdentityModal}
                  className="p-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-[#A9C632]/20 text-[#A9C632] transition-colors cursor-pointer border border-[#A9C632]/30"
                  title="Edit Name, Role, Activity & Location"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Editable Role / Headline */}
              <p className="text-sm text-[#546E50] dark:text-[#C8D2A6] mt-0.5 font-medium">
                {candidateRole}
              </p>

              {/* Verified Gmail Identity Badge */}
              {user?.email ? (
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#A9C632]/15 border border-[#A9C632]/40 text-xs font-bold text-[#1D2E1B] dark:text-[#E8EFE6] shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A9C632]" />
                    <span>{user.email}</span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#A9C632] text-[#1D2E1B] font-black">
                      Verified {user.authProvider === "google" ? "Google" : "Email"}
                    </span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  <button
                    onClick={openAuthModal}
                    className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer transition-colors"
                  >
                    <Mail className="w-3 h-3 text-amber-500" />
                    <span>Click to Link & Verify Your Gmail</span>
                  </button>
                </div>
              )}

              {/* Editable Activity & Location Pill */}
              <button
                onClick={handleOpenIdentityModal}
                className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-[#A9C632]/10 hover:bg-[#A9C632]/20 border border-[#A9C632]/30 cursor-pointer transition-colors"
                title="Click to edit activity, availability & location"
              >
                <span className="w-2 h-2 rounded-full bg-[#A9C632] animate-pulse" />
                <span className="text-xs text-[#1D2E1B] dark:text-[#A9C632] font-bold">
                  {candidateActivity}
                </span>
                <span className="text-[11px] text-[#546E50] dark:text-[#C8D2A6]">
                  · {candidateLocation}
                </span>
                <Edit3 className="w-3 h-3 text-[#A9C632] ml-1 opacity-70" />
              </button>
            </div>

            {/* Social Handles Ribbon with Linked Gmail Action & click-to-edit */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {/* Linked Gmail Button */}
              {user?.email && (
                <a 
                  href={`mailto:${user.email}`} 
                  className="p-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-[#C8D2A6] dark:border-[#546E50] hover:border-[#A9C632] hover:bg-[#A9C632]/10 transition-colors"
                  title={`Send email to ${user.email}`}
                >
                  <Mail className="w-4.5 h-4.5 text-[#EA4335]" />
                </a>
              )}

              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-[#C8D2A6] dark:border-[#546E50] hover:border-[#A9C632] transition-colors">
                  <LinkedinIcon className="w-4.5 h-4.5 text-[#0A66C2]" />
                </a>
              )}
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-[#C8D2A6] dark:border-[#546E50] hover:border-[#A9C632] transition-colors">
                  <GithubIcon className="w-4.5 h-4.5 text-[#1D2E1B] dark:text-white" />
                </a>
              )}
              {profile?.behance_url && (
                <a href={profile.behance_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-[#C8D2A6] dark:border-[#546E50] hover:border-[#A9C632] transition-colors">
                  <BehanceIcon className="w-4.5 h-4.5 text-[#0057FF]" />
                </a>
              )}
              {profile?.website_url && (
                <a href={profile.website_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-[#C8D2A6] dark:border-[#546E50] hover:border-[#A9C632] transition-colors">
                  <Globe className="w-4.5 h-4.5 text-[#A9C632]" />
                </a>
              )}
              <button
                onClick={() => setShowEditSocials(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-[#A9C632]/50 hover:bg-[#A9C632]/10 text-xs font-bold text-[#A9C632] transition-colors cursor-pointer"
                title="Edit Social Handles & Portfolio URLs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Links</span>
              </button>
            </div>
          </div>

          {/* About Me Section with Pop-up Editorial Trigger */}
          <div className="space-y-2 pt-3 border-t border-[#C8D2A6] dark:border-[#546E50]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase text-[#546E50] dark:text-[#C8D2A6] font-bold tracking-wider">
                About Me / Design Philosophy
              </span>
              <button
                onClick={() => {
                  setBioInput(aboutBio);
                  setActiveEditorialModal("bio");
                }}
                className="text-xs text-[#A9C632] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Bio</span>
              </button>
            </div>

            <p className="text-sm text-[#546E50] dark:text-[#C8D2A6] leading-relaxed line-clamp-3">
              {aboutBio}
            </p>
          </div>

          {/* ── Interactive Video & Resume Upload Showcase ──────── */}
          <div className="space-y-2.5 pt-3 border-t border-[#C8D2A6] dark:border-[#546E50]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase text-[#546E50] dark:text-[#C8D2A6] font-bold tracking-wider">
                Candidate Media & Credentials (Upload & Preview)
              </span>
              <span className="text-[10px] font-bold text-[#A9C632] bg-[#A9C632]/15 px-2 py-0.5 rounded-md">
                Direct Upload Enabled
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Card 1: Video Pitch & Upload */}
              <div className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                isDarkMode ? "bg-[#243822] border-[#546E50]" : "bg-gray-50 border-[#C8D2A6]"
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#A9C632]/15 text-[#A9C632] flex items-center justify-center flex-shrink-0">
                      <Video className="w-4.5 h-4.5" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-xs truncate">
                        {videoData ? videoData.name : "Upload Video Pitch"}
                      </h4>
                      <span className="text-[10px] text-gray-400 block">
                        {videoData ? `${videoData.duration} · ${videoData.size}` : "MP4, WebM (Max 50MB)"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-black/[0.04] dark:border-white/[0.06]">
                  {videoData ? (
                    <button
                      onClick={() => setActiveMediaModal("video")}
                      className="flex-1 py-1.5 rounded-xl bg-[#1D2E1B] text-white dark:bg-[#A9C632] dark:text-[#1D2E1B] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:scale-102 transition-transform"
                    >
                      <Play className="w-3 h-3" />
                      <span>Watch</span>
                    </button>
                  ) : null}
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="flex-1 py-1.5 rounded-xl border border-[#C8D2A6] hover:border-[#A9C632] hover:bg-[#A9C632]/10 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-[#1D2E1B] dark:text-white"
                  >
                    <FileUp className="w-3 h-3 text-[#A9C632]" />
                    <span>{videoData ? "Replace" : "Upload"}</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Resume / CV & Upload */}
              <div className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                isDarkMode ? "bg-[#243822] border-[#546E50]" : "bg-gray-50 border-[#C8D2A6]"
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#A9C632]/15 text-[#A9C632] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-xs truncate">
                        {resumeData ? resumeData.name : "Upload PDF Resume"}
                      </h4>
                      <span className="text-[10px] text-gray-400 block">
                        {resumeData ? `${resumeData.size} · ${resumeData.uploadedAt}` : "PDF, DOCX (Max 10MB)"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-black/[0.04] dark:border-white/[0.06]">
                  {resumeData ? (
                    <button
                      onClick={() => setActiveMediaModal("cv")}
                      className="flex-1 py-1.5 rounded-xl bg-[#1D2E1B] text-white dark:bg-[#A9C632] dark:text-[#1D2E1B] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:scale-102 transition-transform"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                  ) : null}
                  <button
                    onClick={() => resumeInputRef.current?.click()}
                    className="flex-1 py-1.5 rounded-xl border border-[#C8D2A6] hover:border-[#A9C632] hover:bg-[#A9C632]/10 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-[#1D2E1B] dark:text-white"
                  >
                    <FileUp className="w-3 h-3 text-[#A9C632]" />
                    <span>{resumeData ? "Replace" : "Upload"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Asset Quick Upload Strip ───────────────── */}
          <div className="pt-3 border-t border-[#C8D2A6] dark:border-[#546E50] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#546E50] dark:text-[#C8D2A6]">
              <ShieldCheck className="w-4 h-4 text-[#A9C632]" />
              <span>100% Dossier Complete & Verified for 2026 Recruiter Indexing</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => videoInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] hover:bg-[#A9C632]/15 text-[#1D2E1B] dark:text-white text-xs font-bold transition-colors cursor-pointer border border-[#C8D2A6] dark:border-[#546E50]"
              >
                <Video className="w-3.5 h-3.5 text-[#A9C632]" />
                <span>Upload Video</span>
              </button>
              <button
                onClick={() => resumeInputRef.current?.click()}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#A9C632] hover:bg-[#96B228] text-white text-xs font-bold shadow-md transition-transform hover:scale-102 cursor-pointer"
              >
                <FileUp className="w-3.5 h-3.5 text-[#1D2E1B]" />
                <span className="text-[#1D2E1B]">Upload Resume</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (col-span-3 - Compact Cards) ────────── */}
        <div className="col-span-3 flex flex-col justify-between gap-3.5 min-h-0 overflow-hidden">
          
          {/* Card 1: Certifications */}
          <div className={`p-4.5 rounded-[28px] border shadow-xs flex-1 flex flex-col justify-between min-h-0 overflow-hidden ${
            isDarkMode ? "bg-[#1D2E1B] border-[#546E50]" : "bg-white border-[#C8D2A6] shadow-sm"
          }`}>
            <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.05] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-[#A9C632]" />
                <h3 className="font-bold text-sm">Certifications</h3>
              </div>
              <button
                onClick={() => handleOpenCertModal()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.12] text-xs font-semibold text-[#A9C632] transition-colors cursor-pointer"
                title="Add / Edit Certification"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1 my-1">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => handleOpenCertModal(cert)}
                  className="p-2 rounded-2xl hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors cursor-pointer group flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs truncate group-hover:text-[#A9C632] transition-colors text-[#1D2E1B] dark:text-white">
                      {cert.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{cert.issuer}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#A9C632]/15 text-[#A9C632] flex-shrink-0">
                    {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Career Expectations */}
          <div className={`p-4.5 rounded-[28px] border shadow-xs flex-1 flex flex-col justify-between min-h-0 overflow-hidden ${
            isDarkMode ? "bg-[#1D2E1B] border-[#546E50]" : "bg-white border-[#C8D2A6] shadow-sm"
          }`}>
            <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.05] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Target className="w-4.5 h-4.5 text-[#A9C632]" />
                <h3 className="font-bold text-sm">Career Expectations</h3>
              </div>
              <button
                onClick={() => {
                  setExpExpectForm(expectations);
                  setActiveEditorialModal("expectations");
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.12] text-xs font-semibold text-[#A9C632] transition-colors cursor-pointer"
                title="Edit Career Expectations"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-2 text-xs my-1">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block font-bold">Target Comp</span>
                <p className="font-bold text-xs text-[#A9C632] mt-0.5">{expectations.targetComp}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase block font-bold">Location</span>
                <p className="font-bold text-xs mt-0.5 text-[#1D2E1B] dark:text-white">{expectations.preferredLocation}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase block font-bold">Notice & Mode</span>
                <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] mt-0.5">{expectations.noticePeriod} · {expectations.employmentType}</p>
              </div>
            </div>
          </div>

          {/* Card 3: Featured Live Projects */}
          <div className={`p-4.5 rounded-[28px] border shadow-xs flex-1 flex flex-col justify-between min-h-0 overflow-hidden ${
            isDarkMode ? "bg-[#1D2E1B] border-[#546E50]" : "bg-white border-[#C8D2A6] shadow-sm"
          }`}>
            <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.05] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-[#A9C632]" />
                <h3 className="font-bold text-sm">Live Projects</h3>
              </div>
              <button
                onClick={() => handleOpenProjectModal()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.12] text-xs font-semibold text-[#A9C632] transition-colors cursor-pointer"
                title="Add / Edit Live Project"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1 my-1">
              {featuredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => handleOpenProjectModal(proj)}
                  className="p-2 rounded-2xl hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors cursor-pointer group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs group-hover:text-[#A9C632] transition-colors truncate text-[#1D2E1B] dark:text-white">{proj.title}</h4>
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#A9C632] hover:underline flex items-center gap-1 text-[10px] font-bold"
                    >
                      <span>Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-[11px] text-[#546E50] dark:text-[#C8D2A6] truncate">{proj.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════
          POP-UP EDITORIAL MODALS (PRECISE 3-4 FIELD STRUCTURE)
         ══════════════════════════════════════════════════════════ */}

      {/* 👤 0. Identity Pop-up Editorial Modal */}
      <AnimatePresence>
        {activeEditorialModal === "identity" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md font-urbanist">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl rounded-3xl shadow-2xl border p-6 ${
                isDarkMode ? "bg-[#1D2E1B] border-[#546E50] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#C8D2A6] dark:border-[#546E50]">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#A9C632]" />
                  <h3 className="font-bold text-base">Edit Candidate Name, Role & Location</h3>
                </div>
                <button onClick={() => setActiveEditorialModal(null)} className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 py-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Candidate Full Name</label>
                  <input
                    type="text"
                    value={identityForm.name}
                    onChange={(e) => setIdentityForm({ ...identityForm, name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Primary Role / Headline</label>
                  <input
                    type="text"
                    value={identityForm.role}
                    onChange={(e) => setIdentityForm({ ...identityForm, role: e.target.value })}
                    placeholder="e.g. Staff Product Designer & Full-Stack Architect"
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Activity / Search Status</label>
                    <input
                      type="text"
                      value={identityForm.activity}
                      onChange={(e) => setIdentityForm({ ...identityForm, activity: e.target.value })}
                      placeholder="e.g. Actively Looking · Immediate"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Location & Remote Policy</label>
                    <input
                      type="text"
                      value={identityForm.location}
                      onChange={(e) => setIdentityForm({ ...identityForm, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA & Remote"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#C8D2A6] dark:border-[#546E50]">
                <button
                  onClick={() => setActiveEditorialModal(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveIdentity}
                  className="px-5 py-2 rounded-xl bg-[#A9C632] hover:bg-[#96B228] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Save Profile Info
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🎓 1. Education Pop-up Editorial Modal */}
      <AnimatePresence>
        {activeEditorialModal === "education" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl rounded-3xl shadow-2xl border p-6 font-urbanist ${
                isDarkMode ? "bg-[#1D2E1B] border-[#546E50] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#C8D2A6] dark:border-[#546E50]">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#A9C632]" />
                  <h3 className="font-bold text-base">
                    {eduForm.id ? "Edit Education" : "Add Education Record"}
                  </h3>
                </div>
                <button onClick={() => setActiveEditorialModal(null)} className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 py-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">University / Institute</label>
                  <input
                    type="text"
                    value={eduForm.school}
                    onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
                    placeholder="e.g. Stanford University"
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Degree & Major</label>
                  <input
                    type="text"
                    value={eduForm.course}
                    onChange={(e) => setEduForm({ ...eduForm, course: e.target.value })}
                    placeholder="e.g. B.S. in Computer Science & Human-Computer Interaction"
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={eduForm.year}
                      onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                      placeholder="e.g. 2019 - 2023"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">GPA / Honors</label>
                    <input
                      type="text"
                      value={eduForm.cgp}
                      onChange={(e) => setEduForm({ ...eduForm, cgp: e.target.value })}
                      placeholder="e.g. 3.9 GPA · Honors"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Location</label>
                    <input
                      type="text"
                      value={eduForm.location}
                      onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
                      placeholder="e.g. Stanford, CA"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#C8D2A6] dark:border-[#546E50]">
                {eduForm.id ? (
                  <button
                    onClick={() => handleDeleteEducation(eduForm.id)}
                    className="text-red-500 hover:text-red-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveEditorialModal(null)}
                    className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEducation}
                    className="px-5 py-2 rounded-xl bg-[#A9C632] hover:bg-[#96B228] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 💼 2. Career Experience Pop-up Editorial Modal */}
      <AnimatePresence>
        {activeEditorialModal === "experience" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl rounded-3xl shadow-2xl border p-6 font-urbanist ${
                isDarkMode ? "bg-[#1D2E1B] border-[#546E50] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#C8D2A6] dark:border-[#546E50]">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#A9C632]" />
                  <h3 className="font-bold text-base">
                    {expForm.id ? "Edit Career Experience" : "Add Career Role"}
                  </h3>
                </div>
                <button onClick={() => setActiveEditorialModal(null)} className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 py-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Role / Job Title</label>
                    <input
                      type="text"
                      value={expForm.role}
                      onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                      placeholder="e.g. Staff Product Designer"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={expForm.company}
                      onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                      placeholder="e.g. Stripe Inc."
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Timeline</label>
                    <input
                      type="text"
                      value={expForm.timeline}
                      onChange={(e) => setExpForm({ ...expForm, timeline: e.target.value })}
                      placeholder="e.g. Jan 2024 - Present"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Employment Type</label>
                    <input
                      type="text"
                      value={expForm.employmentType}
                      onChange={(e) => setExpForm({ ...expForm, employmentType: e.target.value })}
                      placeholder="e.g. Full-Time / Contract"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Location</label>
                    <input
                      type="text"
                      value={expForm.location}
                      onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA (Hybrid)"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Impact & Responsibilities</label>
                  <textarea
                    rows={3}
                    value={expForm.description}
                    onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                    placeholder="Describe high-impact systems, spatial interfaces, or architectural milestones delivered..."
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] resize-none ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#C8D2A6] dark:border-[#546E50]">
                {expForm.id ? (
                  <button
                    onClick={() => handleDeleteExperience(expForm.id)}
                    className="text-red-500 hover:text-red-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveEditorialModal(null)}
                    className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveExperience}
                    className="px-5 py-2 rounded-xl bg-[#A9C632] hover:bg-[#96B228] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🛠️ 3. Skills Pop-up Editorial Modal */}
      <AnimatePresence>
        {activeEditorialModal === "skills" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl rounded-3xl shadow-2xl border p-6 font-urbanist ${
                isDarkMode ? "bg-[#1D2E1B] border-[#546E50] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#C8D2A6] dark:border-[#546E50]">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[#A9C632]" />
                  <h3 className="font-bold text-base">Manage Skills & Tech Stacks</h3>
                </div>
                <button onClick={() => setActiveEditorialModal(null)} className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 py-4 text-xs">
                {/* Active Selected Skills */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Active Candidate Skills (Click × to remove)</label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[#C8D2A6] dark:border-[#546E50]">
                    {skillsList.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/40 flex items-center gap-1.5"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-500 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Add Custom Skill */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill(customSkillInput)}
                    placeholder="Type custom skill (e.g. Shaders, Rust, Go, Prompt Engineering)..."
                    className={`flex-1 p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                  <button
                    onClick={() => handleAddSkill(customSkillInput)}
                    className="px-4 py-3 rounded-xl bg-[#A9C632] hover:bg-[#96B228] text-white font-bold text-xs cursor-pointer shadow-sm flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-[#C8D2A6] dark:border-[#546E50]">
                <button
                  onClick={() => setActiveEditorialModal(null)}
                  className="px-5 py-2 rounded-xl bg-[#A9C632] hover:bg-[#96B228] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📜 4. Certifications Pop-up Editorial Modal */}
      <AnimatePresence>
        {activeEditorialModal === "certifications" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl rounded-3xl shadow-2xl border p-6 font-urbanist ${
                isDarkMode ? "bg-[#1D2E1B] border-[#546E50] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#C8D2A6] dark:border-[#546E50]">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#A9C632]" />
                  <h3 className="font-bold text-base">
                    {certForm.id ? "Edit Certification" : "Add Certification"}
                  </h3>
                </div>
                <button onClick={() => setActiveEditorialModal(null)} className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 py-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Certification Name</label>
                  <input
                    type="text"
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder="e.g. Figma Certified Design Systems Master"
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Issuer / Authority</label>
                    <input
                      type="text"
                      value={certForm.issuer}
                      onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                      placeholder="e.g. Figma Academy / AWS"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Year of Issue</label>
                    <input
                      type="text"
                      value={certForm.year}
                      onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                      placeholder="e.g. 2025"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Verification / Certificate URL</label>
                  <input
                    type="text"
                    value={certForm.link}
                    onChange={(e) => setCertForm({ ...certForm, link: e.target.value })}
                    placeholder="https://..."
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#C8D2A6] dark:border-[#546E50]">
                {certForm.id ? (
                  <button
                    onClick={() => handleDeleteCert(certForm.id)}
                    className="text-red-500 hover:text-red-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveEditorialModal(null)}
                    className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCert}
                    className="px-5 py-2 rounded-xl bg-[#A9C632] hover:bg-[#96B228] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🎯 5. Career Expectations Pop-up Editorial Modal */}
      <AnimatePresence>
        {activeEditorialModal === "expectations" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl rounded-3xl shadow-2xl border p-6 font-urbanist ${
                isDarkMode ? "bg-[#1D2E1B] border-[#546E50] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#C8D2A6] dark:border-[#546E50]">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#A9C632]" />
                  <h3 className="font-bold text-base">Edit Career Expectations</h3>
                </div>
                <button onClick={() => setActiveEditorialModal(null)} className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 py-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Target Compensation Range</label>
                  <input
                    type="text"
                    value={expExpectForm.targetComp}
                    onChange={(e) => setExpExpectForm({ ...expExpectForm, targetComp: e.target.value })}
                    placeholder="e.g. $195,000 - $250,000 + Equity"
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Preferred Work Locations & Remote Policy</label>
                  <input
                    type="text"
                    value={expExpectForm.preferredLocation}
                    onChange={(e) => setExpExpectForm({ ...expExpectForm, preferredLocation: e.target.value })}
                    placeholder="e.g. San Francisco, CA or 100% Remote"
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Notice Period & Availability</label>
                    <input
                      type="text"
                      value={expExpectForm.noticePeriod}
                      onChange={(e) => setExpExpectForm({ ...expExpectForm, noticePeriod: e.target.value })}
                      placeholder="e.g. Immediate (2 Weeks)"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Employment Type</label>
                    <input
                      type="text"
                      value={expExpectForm.employmentType}
                      onChange={(e) => setExpExpectForm({ ...expExpectForm, employmentType: e.target.value })}
                      placeholder="e.g. Full-Time"
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                        isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#C8D2A6] dark:border-[#546E50]">
                <button
                  onClick={() => setActiveEditorialModal(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setExpectations(expExpectForm);
                    setActiveEditorialModal(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#A9C632] hover:bg-[#96B228] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🚀 6. Live Projects Pop-up Editorial Modal */}
      <AnimatePresence>
        {activeEditorialModal === "projects" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl rounded-3xl shadow-2xl border p-6 font-urbanist ${
                isDarkMode ? "bg-[#1D2E1B] border-[#546E50] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#C8D2A6] dark:border-[#546E50]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#A9C632]" />
                  <h3 className="font-bold text-base">
                    {projForm.id ? "Edit Live Project" : "Add Live Project"}
                  </h3>
                </div>
                <button onClick={() => setActiveEditorialModal(null)} className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 py-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Project Name</label>
                  <input
                    type="text"
                    value={projForm.title}
                    onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                    placeholder="e.g. Spatial Canvas V3"
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Live Demo / Repository URL</label>
                  <input
                    type="text"
                    value={projForm.url}
                    onChange={(e) => setProjForm({ ...projForm, url: e.target.value })}
                    placeholder="https://..."
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Tech Stack Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={projForm.tags}
                    onChange={(e) => setProjForm({ ...projForm, tags: e.target.value })}
                    placeholder="e.g. Next.js, WebGL, TypeScript, Tailwind"
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Project Summary</label>
                  <textarea
                    rows={3}
                    value={projForm.desc}
                    onChange={(e) => setProjForm({ ...projForm, desc: e.target.value })}
                    placeholder="Summary of the project architectural breakthroughs..."
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#A9C632] resize-none ${
                      isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#C8D2A6] dark:border-[#546E50]">
                {projForm.id ? (
                  <button
                    onClick={() => handleDeleteProject(projForm.id)}
                    className="text-red-500 hover:text-red-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveEditorialModal(null)}
                    className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProject}
                    className="px-5 py-2 rounded-xl bg-[#A9C632] hover:bg-[#96B228] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📝 7. Bio Pop-up Editorial Modal */}
      <AnimatePresence>
        {activeEditorialModal === "bio" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl rounded-3xl shadow-2xl border p-6 font-urbanist ${
                isDarkMode ? "bg-[#1D2E1B] border-[#546E50] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#C8D2A6] dark:border-[#546E50]">
                <h3 className="font-bold text-base">Edit About Me / Narrative Bio</h3>
                <button onClick={() => setActiveEditorialModal(null)} className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4">
                <textarea
                  rows={5}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Share your philosophy, spatial engineering milestones, and what inspires your craft..."
                  className={`w-full p-4 rounded-2xl border text-xs focus:outline-none focus:border-[#A9C632] leading-relaxed resize-none ${
                    isDarkMode ? "bg-[#243822] border-[#546E50] text-white" : "bg-gray-50 border-[#C8D2A6] text-[#1D2E1B]"
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#C8D2A6] dark:border-[#546E50]">
                <button
                  onClick={() => setActiveEditorialModal(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBio}
                  className="px-5 py-2 rounded-xl bg-[#A9C632] hover:bg-[#96B228] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Save Bio
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Media Viewer Modal (Video Intro / Resume Preview) ── */}
      <AnimatePresence>
        {activeMediaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md font-urbanist">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border p-6 ${
                isDarkMode ? "bg-[#1D2E1B] border-[#546E50] text-white" : "bg-white border-[#C8D2A6] text-[#1D2E1B]"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#C8D2A6] dark:border-[#546E50]">
                <div className="flex items-center gap-2.5">
                  {activeMediaModal === "video" ? (
                    <Video className="w-5 h-5 text-[#A9C632]" />
                  ) : (
                    <FileText className="w-5 h-5 text-[#A9C632]" />
                  )}
                  <h3 className="font-bold text-base">
                    {activeMediaModal === "video" ? "Candidate Video Pitch" : "Candidate Curriculum Vitae (CV)"}
                  </h3>
                </div>
                <button onClick={() => setActiveMediaModal(null)} className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-5">
                {activeMediaModal === "video" ? (
                  <div className="space-y-4">
                    {videoData?.url ? (
                      <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-[#C8D2A6]">
                        <video controls autoPlay className="w-full h-full object-cover">
                          <source src={videoData.url} />
                          Your browser does not support HTML video.
                        </video>
                      </div>
                    ) : (
                      <div className="aspect-video rounded-2xl bg-[#131E12] border border-[#3D543A] flex flex-col items-center justify-center text-white relative overflow-hidden p-6 text-center">
                        <Video className="w-12 h-12 text-[#A9C632] mb-3 animate-pulse" />
                        <p className="font-bold text-base">{videoData?.name || "No Video Uploaded Yet"}</p>
                        <p className="text-xs text-[#C8D2A6] mt-1">Record a quick 60s pitch to showcase your projects & strengths</p>
                        <span className="mt-3 px-3 py-1 rounded-full bg-[#A9C632]/20 text-[#A9C632] text-xs font-bold border border-[#A9C632]/30">
                          {videoData?.duration || "Ready for Upload"}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => videoInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl border border-[#C8D2A6] hover:bg-black/5 dark:hover:bg-white/5 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#A9C632]" />
                        <span>Upload Video Pitch</span>
                      </button>
                      <button
                        onClick={() => setActiveMediaModal(null)}
                        className="px-5 py-2 rounded-xl bg-[#A9C632] hover:bg-[#96B228] text-[#1D2E1B] font-bold text-xs shadow-md cursor-pointer"
                      >
                        Close Player
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#243822] border border-[#C8D2A6] dark:border-[#546E50] space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#A9C632]" />
                        <span className="font-bold text-sm">{resumeData?.name || "No Resume PDF Attached"}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#A9C632]/15 text-[#A9C632] font-bold text-[10px]">
                        ATS & Recruiter Ready
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-black/20 border border-[#C8D2A6]/50 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span>File Size: {resumeData?.size || "0 KB"}</span>
                        <span>Status: {resumeData?.uploadedAt || "Pending Upload"}</span>
                      </div>
                      <p className="text-[#546E50] dark:text-[#C8D2A6] leading-relaxed">
                        Attach your resume PDF so frontier startup founders can review your work experience and credentials.
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-between">
                      <button
                        onClick={() => resumeInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl border border-[#C8D2A6] hover:bg-black/5 dark:hover:bg-white/5 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#A9C632]" />
                        <span>Upload PDF Resume</span>
                      </button>

                      {resumeData ? (
                        <a
                          href={resumeData.url || "#"}
                          download={resumeData.name}
                          className="px-5 py-2 bg-[#A9C632] hover:bg-[#96B228] text-[#1D2E1B] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF ({resumeData.size})</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => setActiveMediaModal(null)}
                          className="px-5 py-2 rounded-xl bg-[#1D2E1B] text-white dark:bg-white/10 font-bold text-xs"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
    </div>
  );
}
