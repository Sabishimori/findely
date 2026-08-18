"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Video, 
  Play, 
  Square, 
  Download, 
  Sparkles, 
  Globe2, 
  CheckCircle2, 
  X,
  Compass,
  Film
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CompanyMapItem } from "./MapComponent";

interface CinematicTourModeProps {
  mapRef: any;
  companies: CompanyMapItem[];
  onSelectCompany?: (company: CompanyMapItem) => void;
  isDarkMode?: boolean;
}

export default function CinematicTourMode({
  mapRef,
  companies = [],
  onSelectCompany,
  isDarkMode = false,
}: CinematicTourModeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const tourTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cinematic Tour Keyframes / Stops
  const TOUR_SCENES = [
    {
      name: "Global 2.5D Orbit",
      duration: 3500,
      center: [0, 20] as [number, number],
      zoom: 2.2,
      pitch: 20,
      bearing: 15,
      companyQuery: null,
    },
    {
      name: "San Francisco Bay Area Hub",
      duration: 4500,
      center: [-122.4194, 37.7749] as [number, number],
      zoom: 11.2,
      pitch: 45,
      bearing: -20,
      companyQuery: "Anthropic",
    },
    {
      name: "Bengaluru Tech Corridor",
      duration: 4500,
      center: [77.5946, 12.9716] as [number, number],
      zoom: 11.5,
      pitch: 48,
      bearing: 30,
      companyQuery: "Postman",
    },
    {
      name: "London European Fintech Hub",
      duration: 4000,
      center: [-0.1276, 51.5074] as [number, number],
      zoom: 11.0,
      pitch: 40,
      bearing: -10,
      companyQuery: "Monzo",
    },
    {
      name: "Tokyo AI & Robotics Hub",
      duration: 4000,
      center: [139.6917, 35.6895] as [number, number],
      zoom: 11.2,
      pitch: 45,
      bearing: 25,
      companyQuery: "Mercari",
    },
    {
      name: "Panoramic Global Overview",
      duration: 3500,
      center: [10, 15] as [number, number],
      zoom: 2.5,
      pitch: 25,
      bearing: 0,
      companyQuery: null,
    },
  ];

  // Run tour step by step
  const executeScene = (index: number) => {
    if (!mapRef.current || index >= TOUR_SCENES.length) {
      stopTour();
      return;
    }

    setCurrentSceneIndex(index);
    const scene = TOUR_SCENES[index];

    mapRef.current.flyTo({
      center: scene.center,
      zoom: scene.zoom,
      pitch: scene.pitch,
      bearing: scene.bearing,
      duration: scene.duration - 500,
      essential: true,
    });

    if (scene.companyQuery && onSelectCompany && companies.length > 0) {
      const match = companies.find((c) =>
        c.name.toLowerCase().includes(scene.companyQuery!.toLowerCase())
      );
      if (match) {
        setTimeout(() => {
          onSelectCompany(match);
        }, 1200);
      }
    }

    tourTimeoutRef.current = setTimeout(() => {
      executeScene(index + 1);
    }, scene.duration);
  };

  const startTour = async (withRecording = false) => {
    setIsPlaying(true);
    setRecordedBlobUrl(null);
    recordedChunksRef.current = [];

    if (withRecording) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 60 },
          audio: false,
        });

        const recorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
            ? "video/webm;codecs=vp9"
            : "video/webm",
        });

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setRecordedBlobUrl(url);
          setIsRecording(false);
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (err) {
        console.warn("[Screen Recorder Cancelled]:", err);
      }
    }

    executeScene(0);
  };

  const stopTour = () => {
    setIsPlaying(false);
    if (tourTimeoutRef.current) {
      clearTimeout(tourTimeoutRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  // Keyboard shortcut: Press Shift + D to toggle cinematic bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "D" || e.key === "d")) {
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Mini Top-Right Trigger Pill */}
      <div className="absolute top-20 right-6 z-30 pointer-events-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xl backdrop-blur-2xl text-xs font-bold transition-all cursor-pointer ${
            isOpen
              ? "bg-[#A9C632] text-[#1D2E1B] border-[#A9C632] shadow-lg scale-105"
              : isDarkMode
              ? "bg-[#1D2E1B]/90 hover:bg-[#1D2E1B] border-[#3D543A] text-white"
              : "bg-white/90 hover:bg-white border-[#C8D2A6] text-[#1D2E1B]"
          }`}
          title="Video Demo & Cinematic Auto Flight (Shift + D)"
        >
          <Film className="w-3.5 h-3.5 text-[#A9C632] fill-current" />
          <span className="hidden sm:inline">Auto Video Tour</span>
        </button>
      </div>

      {/* Floating Cinematic Studio Controls Modal / Banner */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className={`fixed top-28 right-6 z-40 w-80 p-4 rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all ${
              isDarkMode
                ? "bg-[#1D2E1B]/95 border-[#3D543A] text-white"
                : "bg-white/95 border-[#C8D2A6] text-[#1D2E1B]"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#C8D2A6]/40 dark:border-[#3D543A]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#A9C632] text-[#1D2E1B] flex items-center justify-center font-black">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black">Cinematic Demo Studio</h4>
                  <p className="text-[10px] text-[#546E50] dark:text-[#C8D2A6]">
                    Automated 60fps flight tour across global hubs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Current Scene Badge */}
            {isPlaying && (
              <div className="my-3 p-2.5 rounded-2xl bg-[#A9C632]/15 border border-[#A9C632]/40 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-[#A9C632] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#A9C632] animate-ping" />
                  <span>Scene {currentSceneIndex + 1}/{TOUR_SCENES.length}</span>
                </div>
                <div className="text-xs font-bold text-[#1D2E1B] dark:text-white">
                  {TOUR_SCENES[currentSceneIndex]?.name}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-3">
              {!isPlaying ? (
                <>
                  <button
                    onClick={() => startTour(true)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-[#A9C632] text-[#1D2E1B] text-xs font-black shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Record Video Demo (Screen Capture)</span>
                  </button>

                  <button
                    onClick={() => startTour(false)}
                    className="w-full py-2 px-4 rounded-2xl border border-[#C8D2A6] dark:border-[#3D543A] text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-[#A9C632] fill-current" />
                    <span>Run Camera Flight Only</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={stopTour}
                  className="w-full py-2.5 px-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Tour & Save Recording</span>
                </button>
              )}

              {/* Download Recorded Video */}
              {recordedBlobUrl && (
                <a
                  href={recordedBlobUrl}
                  download="findely-product-demo.webm"
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#1D2E1B] text-[#A9C632] dark:bg-[#A9C632] dark:text-[#1D2E1B] text-xs font-black shadow-xl flex items-center justify-center gap-2 transition-all mt-2 animate-bounce"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Video (HD .WebM)</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
