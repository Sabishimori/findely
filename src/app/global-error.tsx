"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Findely Global Root Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen w-full flex items-center justify-center p-6 bg-[#131E12] text-white font-sans overflow-hidden">
        <div className="relative z-10 max-w-md w-full rounded-3xl p-8 border border-red-500/30 bg-[#1D2E1B]/95 backdrop-blur-2xl shadow-2xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 shadow-inner">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400">
              System Boundary Recovery
            </span>
            <h1 className="text-xl font-black tracking-tight text-white">
              Application Exception
            </h1>
            <p className="text-xs text-[#C8D2A6] leading-relaxed">
              Findely's spatial runtime caught an unexpected error. Your profile data and active sessions are intact.
            </p>
            {error?.digest && (
              <span className="inline-block mt-2 px-2.5 py-1 rounded-lg bg-black/30 border border-white/10 text-[10px] font-mono text-gray-400">
                Error Ref: {error.digest}
              </span>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#A9C632] text-[#1D2E1B] font-black text-xs shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Workspace 🛸</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
