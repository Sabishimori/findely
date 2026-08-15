"use client";

import { useState } from "react";
import { Building2, MapPin, ExternalLink, Flag } from "lucide-react";
import { CompanyPin } from "./ThreeGlobe";
import { handleImageError, getCompanyLogoUrl } from "@/lib/logoResolver";
import ReportCompanyModal from "./ReportCompanyModal";

export default function ListView({
  companies,
  onSelectCompany,
  onTrackJob,
  onBackToMap,
  isDarkMode = false,
}: {
  companies: CompanyPin[];
  onSelectCompany: (companyId: string) => void;
  onTrackJob?: (job: any, company: CompanyPin) => void;
  onBackToMap?: () => void;
  isDarkMode?: boolean;
}) {
  const [reportingCompany, setReportingCompany] = useState<CompanyPin | null>(null);
  return (
    <div className={`w-full h-full overflow-y-auto pt-24 pb-20 pl-24 md:pl-28 pr-6 md:pr-10 font-urbanist select-none transition-colors ${
      isDarkMode ? "bg-[#131E12] text-white" : "bg-[#F7F9F2] text-[#1D2E1B]"
    }`}>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#C8D2A6] dark:border-[#3D543A]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1D2E1B] dark:text-white">
              Verified Tech Hubs & Roles
            </h2>
            <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] mt-0.5">
              Browsing {companies.length} verified frontier companies hiring worldwide
            </p>
          </div>

          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] border border-[#A9C632] font-bold text-xs shadow-md hover:scale-102 transition-all cursor-pointer"
            >
              <span>🗺️ Back to Map View</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {companies.map((company) => {
            const hasJobs = company.activeJobCount > 0;

            return (
              <div
                key={company.id}
                onClick={() => onSelectCompany(company.id)}
                className={`rounded-[28px] p-5.5 border shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between group ${
                  isDarkMode
                    ? "bg-[#1D2E1B] border-[#3D543A] hover:border-[#A9C632]"
                    : "bg-white border-[#C8D2A6] hover:border-[#A9C632]"
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Row: Logo + Info + Active Job Pill */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#F7F9F2] dark:bg-white/5 border border-[#C8D2A6] dark:border-[#3D543A] flex items-center justify-center p-2 overflow-hidden flex-shrink-0 shadow-2xs">
                        <img
                          src={getCompanyLogoUrl(company.website_url, company.name, company.logo_url || undefined)}
                          alt={company.name}
                          className="w-full h-full object-contain"
                          onError={(e) => handleImageError(e, company.name)}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base group-hover:text-[#A9C632] transition-colors truncate text-[#1D2E1B] dark:text-white leading-snug">
                          {company.name}
                        </h3>
                        <p className="text-xs text-[#546E50] dark:text-[#C8D2A6] flex items-center gap-1 truncate mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#A9C632] flex-shrink-0" />
                          <span className="truncate">{company.location_text || "Global"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Flag / Report Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReportingCompany(company);
                        }}
                        className="p-1.5 rounded-full hover:bg-red-500/10 text-[#546E50] hover:text-red-500 dark:text-[#C8D2A6] dark:hover:text-red-400 transition-colors"
                        title="Report or flag this company"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>

                      {/* Job Count Pill with comfortable padding & no clipping */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs ${
                          hasJobs
                            ? "bg-[#A9C632]/20 text-[#1D2E1B] dark:text-[#A9C632] border border-[#A9C632]/40"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                        }`}
                      >
                        {hasJobs && <span className="w-1.5 h-1.5 rounded-full bg-[#A9C632] animate-pulse" />}
                        <span>{company.activeJobCount} {company.activeJobCount === 1 ? "Job" : "Jobs"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Company Description */}
                  {company.description && (
                    <p className="text-xs text-[#2D442A] dark:text-[#C8D2A6] line-clamp-2 leading-relaxed">
                      {company.description}
                    </p>
                  )}

                  {/* Job Titles Chips */}
                  {company.jobTitles && company.jobTitles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {company.jobTitles.slice(0, 3).map((title, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-xl bg-[#F7F9F2] dark:bg-white/5 text-[#1D2E1B] dark:text-white text-[11px] font-medium border border-[#C8D2A6] dark:border-[#3D543A] truncate max-w-[210px]"
                        >
                          {title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action Strip */}
                <div className="mt-4 pt-3 border-t border-[#C8D2A6] dark:border-[#3D543A] flex items-center justify-between text-xs text-[#1D2E1B] group-hover:text-[#A9C632] font-semibold transition-colors">
                  <span>View Open Positions</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#A9C632]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Company Modal */}
      {reportingCompany && (
        <ReportCompanyModal
          isOpen={!!reportingCompany}
          onClose={() => setReportingCompany(null)}
          companyId={reportingCompany.id}
          companyName={reportingCompany.name}
          companyLogo={reportingCompany.logo_url}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
