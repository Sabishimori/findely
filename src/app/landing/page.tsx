"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LandingPage from "@/components/LandingPage";
import AuthModal from "@/components/AuthModal";
import CustomCursor from "@/components/CustomCursor";
import { getAllMapData } from "@/app/actions";

export default function DedicatedLandingPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [liveCounts, setLiveCounts] = useState<{ jobs: number; companies: number }>({
    jobs: 176,
    companies: 850,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAllMapData();
        if (data && data.length > 0) {
          const totalJobs = data.reduce((acc: number, c: any) => acc + (c.jobs?.length || c.activeJobCount || 0), 0);
          setLiveCounts({
            jobs: totalJobs || 176,
            companies: Math.max(850, data.length),
          });
        }
      } catch (e) {
        console.error("Failed to load live landing stats:", e);
      }
    }
    loadStats();
  }, []);

  return (
    <div className={`w-screen h-screen overflow-hidden ${isDarkMode ? "dark bg-[#131E12]" : "bg-[#F7F9F2]"}`}>
      <LandingPage
        onLaunchWorkspace={(companyName?: string) => {
          if (companyName) {
            router.push(`/?company=${encodeURIComponent(companyName)}`);
          } else {
            router.push("/");
          }
        }}
        totalJobsCount={liveCounts.jobs}
        totalCompaniesCount={liveCounts.companies}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      <AuthModal 
        isDarkMode={isDarkMode} 
        onSuccess={() => router.push("/")} 
      />
    </div>
  );
}
