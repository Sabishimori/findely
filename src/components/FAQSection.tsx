"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Search, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playTapSound } from "@/lib/soundFx";

interface FAQItem {
  question: string;
  answer: string;
  category: "candidates" | "founders" | "general";
}

const FAQS: FAQItem[] = [
  {
    category: "candidates",
    question: "Is Findely really 100% free for job seekers?",
    answer:
      "Yes, completely free forever. There are zero paywalls, no 'premium recruiter message' fees, and no pay-to-unlock filters. You can explore all tech hubs, view salaries, and apply directly to company career portals without ever entering a credit card.",
  },
  {
    category: "candidates",
    question: "How do the direct ATS links work?",
    answer:
      "Every company pin on our 2.5D map links directly to the startup's official applicant tracking system (Ashby, Greenhouse, Lever, Workable, etc.). When you click 'Apply Straight on ATS', your resume goes straight into the hiring team's official pipeline without middleman recruiter markups.",
  },
  {
    category: "general",
    question: "How do you eliminate ghost jobs?",
    answer:
      "Traditional job boards host expired roles for months. Findely's automated data validation system regularly queries official company ATS endpoints and trims postings that have closed or return 404/410 status codes.",
  },
  {
    category: "founders",
    question: "How can founders add their startup to the map?",
    answer:
      "Click '+ Add Your Startup' in the top bar or announcement banner. You can provide your company name, website, tech hub coordinates, and careers URL. Submissions are verified and mapped directly on our GPU globe 100% free.",
  },
  {
    category: "founders",
    question: "How does the bottom Live Sponsored Spotlight ticker work?",
    answer:
      "The live ticker at the bottom of the map provides prime visibility across the entire global audience. We offer instant 30-day spotlight activations where founders can showcase their brand and open engineering roles with instant live deployment.",
  },
  {
    category: "general",
    question: "What tech hubs and locations are currently mapped?",
    answer:
      "We actively cover primary global innovation hubs: San Francisco Bay Area (Mission Bay, SOMA, Silicon Valley), Bengaluru (HSR Layout, Koramangala, Indiranagar), New York City, London (Shoreditch / Silicon Roundabout), Tokyo, Berlin, and remote-first startups.",
  },
  {
    category: "general",
    question: "How can I support Findely's server & scraping infrastructure?",
    answer:
      "Findely is an independent developer project built by Sagar S. You can help keep our geocoding and indexing servers alive by supporting via PayPal (paypal.me/Sagar1502) or by upvoting and sharing our launch on Product Hunt and X (Twitter)!",
  },
];

export default function FAQSection({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]); // First one open by default
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleIndex = (index: number) => {
    playTapSound();
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = filterCategory === "all" || faq.category === filterCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A9C632]/15 border border-[#A9C632]/40 text-xs font-black text-[#1D2E1B] dark:text-[#A9C632]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Got Questions? We Got Answers</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1D2E1B] dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-sm sm:text-base text-[#546E50] dark:text-[#C8D2A6] max-w-2xl mx-auto font-medium">
          Everything you need to know about spatial job discovery, direct ATS pipelines, and founder submissions.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-[#C8D2A6]/40 dark:border-[#3D543A] w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Questions" },
            { id: "candidates", label: "For Candidates" },
            { id: "founders", label: "For Founders" },
            { id: "general", label: "General & Tech" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playTapSound();
                setFilterCategory(tab.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === tab.id
                  ? "bg-[#A9C632] text-[#1D2E1B] shadow-md"
                  : "text-[#546E50] dark:text-[#C8D2A6] hover:text-[#1D2E1B] dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#546E50] dark:text-[#C8D2A6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] bg-white/80 dark:bg-white/10 text-xs font-bold text-[#1D2E1B] dark:text-white focus:outline-none focus:border-[#A9C632]"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 rounded-3xl border border-[#C8D2A6]/50 dark:border-[#3D543A] text-center text-sm font-semibold text-[#546E50] dark:text-[#C8D2A6]">
            No matching questions found. Have a specific question? Email us at{" "}
            <a href="mailto:founder@findely.app" className="text-[#A9C632] font-black underline">
              founder@findely.app
            </a>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className={`rounded-3xl border transition-all overflow-hidden ${
                  isOpen
                    ? isDarkMode
                      ? "bg-[#1D2E1B] border-[#A9C632]/50 shadow-xl"
                      : "bg-white border-[#A9C632] shadow-xl ring-2 ring-[#A9C632]/20"
                    : isDarkMode
                    ? "bg-[#1D2E1B]/60 border-[#3D543A] hover:border-[#A9C632]/40"
                    : "bg-white/80 border-[#C8D2A6] hover:border-[#A9C632]/60"
                }`}
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-black text-[#1D2E1B] dark:text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-[#A9C632] text-[#1D2E1B] rotate-180"
                        : "bg-black/5 dark:bg-white/10 text-[#546E50] dark:text-[#C8D2A6]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-black/[0.04] dark:border-white/[0.06] text-xs sm:text-sm text-[#546E50] dark:text-[#C8D2A6] leading-relaxed font-semibold">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
}
