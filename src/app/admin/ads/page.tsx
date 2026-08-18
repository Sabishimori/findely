"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  DollarSign, 
  RefreshCw, 
  Lock, 
  Eye, 
  Megaphone,
  ArrowLeft,
  Mail,
  Zap
} from "lucide-react";
import Link from "next/link";
import { handleImageError } from "@/lib/logoResolver";

export default function AdminAdsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessPasscode, setAccessPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pendingCount: 0,
    activeCount: 0,
    rejectedCount: 0,
    expiredCount: 0,
    totalRevenueUsd: "0.00",
  });
  const [allAds, setAllAds] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "all" | "rejected">("pending");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Auto-auth check from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem("findely_admin_auth");
    if (savedAuth === "granted_findely_2026") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessPasscode.trim().toLowerCase() === "findely2026" || accessPasscode.trim().toLowerCase() === "admin" || accessPasscode.trim().toLowerCase() === "sagar") {
      setIsAuthenticated(true);
      localStorage.setItem("findely_admin_auth", "granted_findely_2026");
      setPasscodeError("");
    } else {
      setPasscodeError("Invalid passcode. Try 'findely2026' or 'admin'");
    }
  };

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/ads");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setAllAds(data.ads || []);
      }
    } catch (err) {
      console.error("Failed to load ads in admin", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAds();
    }
  }, [isAuthenticated]);

  const handleApprove = async (adId: string) => {
    setActionLoadingId(adId);
    try {
      const res = await fetch("/api/admin/ads/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ message: data.message || "Ad approved and live!", type: "success" });
        fetchAds();
      } else {
        setNotification({ message: data.error || "Approval failed", type: "error" });
      }
    } catch (err: any) {
      setNotification({ message: err.message || "Approval failed", type: "error" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (adId: string) => {
    if (!confirm("Are you sure you want to reject this ad request?")) return;
    setActionLoadingId(adId);
    try {
      const res = await fetch("/api/admin/ads/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId, reason: "Payment unverified or creative issues" }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ message: "Ad marked as rejected", type: "success" });
        fetchAds();
      }
    } catch (err: any) {
      setNotification({ message: err.message || "Rejection failed", type: "error" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (adId: string) => {
    if (!confirm("Permanently delete this ad record from database?")) return;
    setActionLoadingId(adId);
    try {
      const res = await fetch("/api/admin/ads/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ message: "Ad permanently deleted", type: "success" });
        fetchAds();
      }
    } catch (err: any) {
      setNotification({ message: err.message || "Delete failed", type: "error" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredAds = allAds.filter((ad) => {
    if (activeTab === "pending") return ad.status === "pending_approval" || ad.status === "pending";
    if (activeTab === "active") return ad.status === "active";
    if (activeTab === "rejected") return ad.status === "rejected" || ad.status === "expired";
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F1710] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#1D2E1B]/80 border border-[#3D543A] backdrop-blur-xl shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#A9C632] text-[#1D2E1B] flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">Admin Ads Moderation</h2>
            <p className="text-xs text-[#C8D2A6] mt-1">
              Enter admin passcode to review & approve sponsor spotlight requests.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={accessPasscode}
              onChange={(e) => setAccessPasscode(e.target.value)}
              placeholder="Enter passcode (e.g. findely2026)"
              className="w-full px-4 py-3 rounded-2xl bg-black/30 border border-[#3D543A] text-center font-mono text-sm tracking-widest text-white outline-none focus:border-[#A9C632] focus:ring-2 focus:ring-[#A9C632]/20"
              autoFocus
            />

            {passcodeError && (
              <p className="text-xs text-red-400 font-semibold">{passcodeError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#A9C632] text-[#1D2E1B] font-black text-xs uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              Unlock Dashboard ⚡
            </button>
          </form>

          <div className="pt-2 text-[11px] text-gray-400">
            <Link href="/" className="hover:underline text-[#A9C632]">
              ← Return to Findely Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d140e] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3D543A]">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-2xl bg-[#1D2E1B] border border-[#3D543A] flex items-center justify-center text-[#C8D2A6] hover:text-white hover:border-[#A9C632] transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#A9C632] text-[#1D2E1B] flex items-center justify-center font-black shadow-md">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-black tracking-tight">Sponsor Spotlight Moderation</h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#A9C632] text-[#1D2E1B]">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-[#C8D2A6] mt-0.5">
                Review submitted sponsor placements, verify PayPal payments, and approve ads for 1-click live rotation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchAds}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1D2E1B] border border-[#3D543A] text-xs font-bold hover:bg-[#3D543A]/50 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#A9C632] ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Queue</span>
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("findely_admin_auth");
                setIsAuthenticated(false);
              }}
              className="px-3.5 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all cursor-pointer"
            >
              Lock
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold animate-in fade-in duration-200 ${
            notification.type === "success" 
              ? "bg-[#A9C632]/15 border-[#A9C632] text-[#A9C632]" 
              : "bg-red-500/15 border-red-500 text-red-400"
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Analytics Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-3xl bg-[#1D2E1B]/60 border border-[#3D543A] space-y-1">
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Pending Review
            </span>
            <div className="text-2xl font-black text-white">{stats.pendingCount}</div>
            <span className="text-[10px] text-gray-400">Needs admin approval within 1d</span>
          </div>

          <div className="p-4 rounded-3xl bg-[#1D2E1B]/60 border border-[#3D543A] space-y-1">
            <span className="text-[11px] font-bold text-[#A9C632] flex items-center gap-1.5 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              Active Live Ads
            </span>
            <div className="text-2xl font-black text-[#A9C632]">{stats.activeCount}</div>
            <span className="text-[10px] text-gray-400">Currently in live ticker rotation</span>
          </div>

          <div className="p-4 rounded-3xl bg-[#1D2E1B]/60 border border-[#3D543A] space-y-1">
            <span className="text-[11px] font-bold text-[#0070BA] dark:text-[#45a2e5] flex items-center gap-1.5 uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5" />
              Total Revenue
            </span>
            <div className="text-2xl font-black text-white">${stats.totalRevenueUsd}</div>
            <span className="text-[10px] text-gray-400">USD via PayPal bookings</span>
          </div>

          <div className="p-4 rounded-3xl bg-[#1D2E1B]/60 border border-[#3D543A] space-y-1">
            <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Total Submissions
            </span>
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <span className="text-[10px] text-gray-400">All-time lifetime bookings</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#1D2E1B]/40 border border-[#3D543A] max-w-fit text-xs font-bold">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "pending"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Pending Review ({stats.pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("active")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "active"
                ? "bg-[#A9C632] text-[#1D2E1B] font-black shadow-xs"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Active Live ({stats.activeCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-white/20 text-white font-black shadow-xs"
                : "text-gray-400 hover:text-white"
            }`}
          >
            All ({stats.total})
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "rejected"
                ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow-xs"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Rejected / Ended ({stats.rejectedCount + stats.expiredCount})
          </button>
        </div>

        {/* Ads Cards Listing */}
        {isLoading ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <div className="w-8 h-8 border-2 border-[#A9C632] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Loading sponsor submissions...</p>
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#1D2E1B]/30 border border-[#3D543A] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#A9C632] mx-auto opacity-70" />
            <h3 className="text-base font-bold text-white">No ads in this tab</h3>
            <p className="text-xs text-gray-400">All submissions are currently up to date.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAds.map((ad) => {
              const isPending = ad.status === "pending_approval" || ad.status === "pending";
              const isActive = ad.status === "active";
              const isRejected = ad.status === "rejected";

              return (
                <div
                  key={ad.id}
                  className={`p-5 rounded-3xl border transition-all space-y-4 ${
                    isPending
                      ? "bg-amber-500/5 border-amber-500/40 shadow-lg"
                      : isActive
                      ? "bg-[#1D2E1B]/60 border-[#A9C632]/40"
                      : "bg-[#1D2E1B]/20 border-[#3D543A] opacity-70"
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3D543A]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white p-1 border border-white/20 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                        <img
                          src={ad.logo_url || `https://www.google.com/s2/favicons?domain=${ad.website_url}&sz=128`}
                          alt={ad.company_name}
                          className="w-full h-full object-contain"
                          onError={(e) => handleImageError(e, ad.company_name)}
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-white">{ad.company_name}</h3>
                          <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-[#A9C632] text-[#1D2E1B]">
                            {ad.badge_type || "AD"}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">📍 {ad.location || "Global"}</span>
                        </div>
                        <a
                          href={ad.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#A9C632] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>{ad.website_url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono ${
                        isPending
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                          : isActive
                          ? "bg-[#A9C632]/20 text-[#A9C632] border border-[#A9C632]/40"
                          : "bg-red-500/20 text-red-400 border border-red-500/40"
                      }`}>
                        {isPending ? "⏳ Pending Review" : isActive ? "⚡ Live & Active" : "❌ Rejected / Ended"}
                      </span>
                    </div>
                  </div>

                  {/* Marquee Pitch Preview */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-[#3D543A] flex items-center gap-3">
                    <span className="text-[10px] font-mono text-gray-400 shrink-0">PITCH:</span>
                    <span className="text-xs font-semibold text-white">"{ad.tagline}"</span>
                  </div>

                  {/* Booking & PayPal Meta Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Plan & Duration:</span>
                      <strong className="text-white">{ad.tier || "Sponsor Plan"} ({ad.duration_days} Days)</strong>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Amount:</span>
                      <strong className="text-[#A9C632]">${((ad.amount_paid_cents || 4900) / 100).toFixed(2)} USD</strong>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">PayPal Ref / ID:</span>
                      <span className="font-mono text-white text-[11px] bg-black/30 px-1.5 py-0.5 rounded border border-white/10">
                        {ad.payment_id || "direct_paypal"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Contact Email:</span>
                      <a href={`mailto:${ad.contact_email}`} className="text-[#0070BA] dark:text-[#45a2e5] hover:underline flex items-center gap-1 font-bold">
                        <Mail className="w-3 h-3" />
                        <span>{ad.contact_email}</span>
                      </a>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#3D543A]/60">
                    <span className="text-[10px] text-gray-400">
                      Submitted: {ad.created_at ? new Date(ad.created_at).toLocaleString() : "Recently"}
                    </span>

                    <div className="flex items-center gap-2">
                      {isPending && (
                        <button
                          onClick={() => handleApprove(ad.id)}
                          disabled={actionLoadingId === ad.id}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A9C632] text-[#1D2E1B] text-xs font-black hover:brightness-105 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Go Live 🚀</span>
                        </button>
                      )}

                      {isActive && (
                        <button
                          onClick={() => handleReject(ad.id)}
                          disabled={actionLoadingId === ad.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          <span>Pause / Unpublish</span>
                        </button>
                      )}

                      {isPending && (
                        <button
                          onClick={() => handleReject(ad.id)}
                          disabled={actionLoadingId === ad.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(ad.id)}
                        disabled={actionLoadingId === ad.id}
                        className="p-2 rounded-xl border border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-500/40 transition-all cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
