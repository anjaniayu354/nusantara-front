"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Compass,
  MapPin,
  CalendarDays,
  Music,
  CloudSun,
  Search,
  Sparkles,
  ChevronRight,
  Waves,
  Mountain,
  Trees,
  Sprout,
  Landmark,
  LogIn,
  LogOut,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  Play,
  Pause,
  Clock,
  Shirt,
} from "lucide-react";
import { DESTINATIONS, CulturalDestination, Category } from "@/data/destinations";
import { CULTURAL_EVENTS, CulturalEvent } from "@/data/culturalEvents";
import { AUDIO_TRACKS, AudioTrack } from "@/data/audioTracks";
import { BarongAvatar } from "@/components/hud/BarongAvatar";
import { getStoredUser, subscribeAuth, clearStoredUser, AuthUser } from "@/lib/auth";

export default function PortalDashboard() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState<"all" | "sulawesi" | "lampung">("all");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [activeTab, setActiveTab] = useState<"dashboard" | "destinasi" | "events" | "musik" | "ai" | "bmkg">("dashboard");

  // Mini preview audio player on dashboard
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Subscribe to auth changes
  useEffect(() => {
    setAuthUser(getStoredUser());
    const unsub = subscribeAuth((user) => {
      setAuthUser(user);
    });
    return unsub;
  }, []);

  // Cleanup audio preview on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleTogglePlayAudio = (track: AudioTrack) => {
    if (playingTrackId === track.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(track.src);
      audio.volume = 0.6;
      audio.play().catch((err) => console.log("Audio autoplay restricted:", err));
      audio.onended = () => setPlayingTrackId(null);
      audioRef.current = audio;
      setPlayingTrackId(track.id);
    }
  };

  const handleLogout = () => {
    clearStoredUser();
  };

  // Filter destinations
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      // Region filter
      if (regionFilter === "sulawesi" && !d.province.toLowerCase().includes("sulawesi")) return false;
      if (regionFilter === "lampung" && !d.province.toLowerCase().includes("lampung")) return false;

      // Category filter
      if (categoryFilter !== "all" && d.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = d.name.toLowerCase().includes(q);
        const matchesSub = d.subtitle.toLowerCase().includes(q);
        const matchesProvince = d.province.toLowerCase().includes(q);
        const matchesDesc = d.description.toLowerCase().includes(q);
        const matchesTag = d.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesSub && !matchesProvince && !matchesDesc && !matchesTag) {
          return false;
        }
      }

      return true;
    });
  }, [regionFilter, categoryFilter, searchQuery]);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white flex flex-col font-sans overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Background Ambience & Cultural Ornaments */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-amber-500/10 blur-[130px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-amber-600/10 blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full bg-orange-600/5 blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.025] bg-repeat"
          style={{
            backgroundImage: "radial-gradient(#f59e0b 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ======================================================== */}
      {/* 1. HEADER UTAMA PORTAL */}
      {/* ======================================================== */}
      <header className="fixed top-0 inset-x-0 z-40 h-16 bg-slate-950/90 backdrop-blur-2xl border-b border-amber-500/25 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-2xl">
        {/* Left Section: Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400 text-amber-300 transition active:scale-95 shadow-md"
            title={isSideMenuOpen ? "Tutup Side Menu" : "Buka Side Menu"}
            aria-label="Toggle Side Menu"
          >
            {isSideMenuOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/80 border border-amber-500/40 p-1 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shadow-md">
              <img
                src="/mandala.png"
                alt="Logo Mandala"
                className="w-full h-full object-contain group-hover:rotate-45 transition-transform duration-700"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-widest text-amber-300 font-cinzel leading-none">
                  NUSA ANTARA
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-amber-500/20 border border-amber-400/30 text-amber-300">
                  PORTAL
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden md:inline-block">
                Pusaka Kebudayaan & Wisata Nusantara
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section: Quick Search Input */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari destinasi, adat, kain tapis, pinisi..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-500 text-xs outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Button Ke Peta & Auth Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Main CTA: Buka Peta Petualangan */}
          <Link
            href="/peta"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-[0_2px_15px_rgba(245,158,11,0.35)] hover:shadow-[0_4px_22px_rgba(245,158,11,0.55)] active:scale-95 group shrink-0"
          >
            <Compass className="w-4 h-4 text-slate-950 transition-transform group-hover:rotate-45" />
            <span className="hidden sm:inline">Peta Petualangan</span>
            <span className="sm:hidden">Peta</span>
          </Link>

          {/* User Session Area */}
          {authUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-white/10 shrink-0">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold shadow-md"
                title={`Masuk sebagai ${authUser.name} (${authUser.phone || authUser.email})`}
              >
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="max-w-[80px] sm:max-w-[120px] truncate">{authUser.name}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-rose-100 transition active:scale-95 shadow-md"
                title="Keluar / Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold text-xs transition active:scale-95 shadow-md shrink-0"
              title="Masuk ke Akun Nusa Antara"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Masuk</span>
            </Link>
          )}
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. BODY CONTENT: SIDE MENU + DASHBOARD */}
      {/* ======================================================== */}
      <div className="relative pt-16 flex-1 flex overflow-hidden">
        {/* SIDE MENU (COLLAPSIBLE SIDEBAR) */}
        <aside
          className={`fixed lg:sticky top-16 bottom-0 left-0 z-30 w-72 bg-slate-950/95 backdrop-blur-2xl border-r border-amber-500/20 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
            isSideMenuOpen ? "translate-x-0" : "-translate-x-full lg:-ml-72"
          } shadow-2xl h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar`}
        >
          {/* Top User Status Card in Side Menu */}
          <div className="p-4 border-b border-white/10">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500/15 via-slate-900/90 to-amber-600/15 border border-amber-500/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border border-amber-400/60 overflow-hidden bg-slate-800 flex items-center justify-center shrink-0">
                  {authUser?.avatar ? (
                    <img src={authUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <img src="/mandala.png" alt="Mandala" className="w-7 h-7 object-contain opacity-80" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-white truncate font-cinzel">
                    {authUser ? authUser.name : "Tamu Petualang"}
                  </p>
                  <p className="text-[10px] text-amber-400/90 font-medium">
                    {authUser ? "Sesi Petualang Aktif" : "Mode Penjelajah Terbuka"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
                      {authUser?.provider || "Tamu"}
                    </span>
                  </div>
                </div>
              </div>

              {!authUser && (
                <Link
                  href="/login"
                  className="mt-3 w-full py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk untuk Sinkronisasi</span>
                </Link>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-6 flex-1">
            {/* Group 1: Navigasi Utama */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-2">
                NAVIGASI UTAMA
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "dashboard"
                      ? "bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-md"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-amber-400" />
                    <span>Dashboard Utama</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                </button>

                <Link
                  href="/peta"
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-amber-500/15 hover:text-amber-300 hover:border hover:border-amber-500/30 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45" />
                    <span>Peta Petualangan</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold uppercase tracking-wider">
                    LIVE
                  </span>
                </Link>
              </div>
            </div>

            {/* Group 2: Episentrum Wilayah */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-2">
                EPISENTRUM BUDAYA
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setRegionFilter(regionFilter === "sulawesi" ? "all" : "sulawesi");
                    setActiveTab("destinasi");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    regionFilter === "sulawesi"
                      ? "bg-amber-500/20 border border-amber-400/50 text-amber-300"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Waves className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Bulukumba (Sulsel)</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    8 Lokasi
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRegionFilter(regionFilter === "lampung" ? "all" : "lampung");
                    setActiveTab("destinasi");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    regionFilter === "lampung"
                      ? "bg-amber-500/20 border border-amber-400/50 text-amber-300"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mountain className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lampung (Sumatera)</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    10 Lokasi
                  </span>
                </button>
              </div>
            </div>

            {/* Group 3: Modul & Agenda */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-2">
                MODUL & FITUR
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("events")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === "events"
                      ? "bg-amber-500/20 border border-amber-400/50 text-amber-300"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-orange-400" />
                    <span>Radar Event Kebudayaan</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 font-bold">
                    7 Event
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("musik")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === "musik"
                      ? "bg-amber-500/20 border border-amber-400/50 text-amber-300"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Music className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Warisan Musik Tradisional</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    16 Trek
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === "ai"
                      ? "bg-amber-500/20 border border-amber-400/50 text-amber-300"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Bar Hala AI Concierge</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">
                    AI Topeng
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("bmkg")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === "bmkg"
                      ? "bg-amber-500/20 border border-amber-400/50 text-amber-300"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-3.5 h-3.5 text-blue-400" />
                    <span>Telemetri Cuaca BMKG</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">
                    Live Peta
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Status in Side Menu */}
          <div className="p-4 border-t border-white/10 bg-slate-950/50">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>BMKG SATU PETA MKG</span>
              </span>
              <span className="text-amber-400/80 font-mono">v1.2</span>
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="flex-1 min-w-0 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-10">
          {/* HERO BANNER SECTION */}
          <section className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-slate-950 via-slate-900/90 to-amber-950/40 p-6 sm:p-8 lg:p-10 shadow-2xl">
            {/* Glow Accents */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-orange-600/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide uppercase mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Portal Eksplorasi Pusaka Kebudayaan Digital</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 tracking-tight leading-tight font-cinzel">
                Pusaka Nusantara, Warisan Leluhur Adiluhung
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                Selamat datang di kanvas terintegrasi Nusa Antara. Jelajahi kearifan bahari perahu Pinisi
                Bulukumba, tradisi sakral Bohe Ammatoa Kajang, pesona lumba-lumba Teluk Kiluan, hingga kaldera
                vulkanik Krakatau dengan panduan geospasial real-time, telemetri cuaca maritim BMKG, dan Bar
                Hala AI.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/peta"
                  className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide transition shadow-[0_4px_25px_rgba(245,158,11,0.45)] hover:shadow-[0_6px_30px_rgba(245,158,11,0.6)] active:scale-95 group"
                >
                  <Compass className="w-5 h-5 text-slate-950 transition-transform group-hover:rotate-45" />
                  <span>Jelajahi Peta Petualangan Interaktif</span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveTab("events")}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400 text-amber-300 font-bold text-xs sm:text-sm transition active:scale-95 shadow-md"
                >
                  <CalendarDays className="w-4 h-4 text-orange-400" />
                  <span>Agenda Event Budaya</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-400 text-purple-300 font-bold text-xs sm:text-sm transition active:scale-95 shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Konsultasi Bar Hala AI</span>
                </button>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* KEY METRICS & KPI STATS CARDS */}
          {/* ======================================================== */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-amber-500/20 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Destinasi Terkurasi</span>
                <Landmark className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-amber-300 font-cinzel">18</p>
              <p className="text-[11px] text-slate-400 mt-1">8 Bulukumba • 10 Lampung</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-amber-500/20 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Radar Event Budaya</span>
                <CalendarDays className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-orange-400 font-cinzel">7</p>
              <p className="text-[11px] text-slate-400 mt-1">Festival Pinisi, Sekura, dll.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-amber-500/20 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Warisan Audio Etnik</span>
                <Music className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-cinzel">16</p>
              <p className="text-[11px] text-slate-400 mt-1">Sinkronisasi Musik Wilayah</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-amber-500/20 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Sensor Cuaca BMKG</span>
                <CloudSun className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-blue-400 font-cinzel">2</p>
              <p className="text-[11px] text-slate-400 mt-1">Telemetri Pesisir Maritim</p>
            </div>
          </section>

          {/* ======================================================== */}
          {/* FILTER & EXPLORATION TABS */}
          {/* ======================================================== */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span>Katalog Destinasi Budaya</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Menampilkan {filteredDestinations.length} destinasi budaya berdasar penyaringan aktif
                </p>
              </div>

              {/* Region Pill Filters */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setRegionFilter("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    regionFilter === "all"
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Semua Wilayah ({DESTINATIONS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRegionFilter("sulawesi")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    regionFilter === "sulawesi"
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Bulukumba (8)
                </button>
                <button
                  type="button"
                  onClick={() => setRegionFilter("lampung")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    regionFilter === "lampung"
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Lampung (10)
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {[
                { id: "all", label: "Semua Kategori" },
                { id: "laut", label: "Wisata Laut & Bahari", icon: Waves },
                { id: "budaya", label: "Budaya Tradisi", icon: Landmark },
                { id: "desa", label: "Desa Adat", icon: Landmark },
                { id: "hutan", label: "Hutan & Konservasi", icon: Trees },
                { id: "gunung", label: "Vulkanik & Pegunungan", icon: Mountain },
                { id: "pertanian", label: "Agrowisata & Rempah", icon: Sprout },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id as Category | "all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    categoryFilter === cat.id
                      ? "bg-amber-500/20 border border-amber-400 text-amber-300 shadow-md"
                      : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* DESTINATIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="group rounded-2xl overflow-hidden bg-slate-900/80 border border-amber-500/20 hover:border-amber-400/60 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(245,158,11,0.2)] flex flex-col justify-between"
                >
                  {/* Image & Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                        {dest.province.includes("Sulawesi") ? "Sulawesi Selatan" : "Lampung"}
                      </span>
                      {dest.subCategory && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md border border-white/20 text-slate-300 text-[10px] font-medium">
                          {dest.subCategory}
                        </span>
                      )}
                    </div>

                    {/* BMKG Status Pill */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-950/85 backdrop-blur-md border border-blue-400/40 text-blue-300 text-[10px] font-semibold">
                      <CloudSun className="w-3.5 h-3.5 text-blue-400" />
                      <span>
                        {dest.bmkgStation.temperature}°C • {dest.bmkgStation.safetyStatus}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-amber-400/80 font-medium line-clamp-1">{dest.subtitle}</p>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    {/* Cultural Highlights Tags */}
                    {dest.traditionalAttire && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        <Shirt className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span className="truncate">Wastra: {dest.traditionalAttire.wastraType}</span>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <div className="text-xs">
                        <span className="text-slate-400">Paket Wisata: </span>
                        <span className="font-bold text-amber-300 font-mono">
                          Rp {dest.tripPackage.priceIdr.toLocaleString("id-ID")}
                        </span>
                      </div>

                      {/* Button to Map with Destination Focus Query */}
                      <Link
                        href={`/peta?dest=${encodeURIComponent(dest.id)}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition active:scale-95 shadow-md"
                        title={`Buka ${dest.name} di Peta Petualangan`}
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Buka di Peta</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ======================================================== */}
          {/* RADAR EVENT & FESTIVAL KEBUDAYAAN SECTION */}
          {/* ======================================================== */}
          <section id="events" className="space-y-4 pt-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-orange-400" />
                  <span>Radar Event Kebudayaan Nusantara</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kalender festival maritim, ritual adat, dan pesta topeng tradisi di Bulukumba & Lampung
                </p>
              </div>

              <Link
                href="/peta"
                className="hidden sm:flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold"
              >
                <span>Lihat Radar di Peta</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CULTURAL_EVENTS.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-orange-500/30 hover:border-orange-400 transition shadow-xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-800 text-amber-300 border border-amber-400/30">
                        {evt.province}
                      </span>
                      {evt.status === "ACTIVE_TODAY" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/40 animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          <span>Berlangsung</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>H-{evt.daysRemaining} Hari</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">{evt.name}</h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span>{evt.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-mono">
                      <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                      <span>{evt.dateRange}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/5">
                      {evt.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-200/90 italic">
                      "{evt.culturalEssence}"
                    </div>
                  </div>

                  <Link
                    href={`/peta?dest=${encodeURIComponent(evt.name)}`}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-orange-500 hover:text-slate-950 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md group"
                  >
                    <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
                    <span>Arahkan Peta ke Lokasi Event</span>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* ======================================================== */}
          {/* BAR HALA AI CONCIERGE SPOTLIGHT SECTION */}
          {/* ======================================================== */}
          <section id="ai" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-amber-950/30 border border-purple-500/30 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              {/* Barong Avatar with interactive tracking */}
              <div className="shrink-0 flex flex-col items-center">
                <div className="p-3 rounded-3xl bg-slate-950/80 border border-purple-400/40 shadow-2xl flex items-center justify-center">
                  <BarongAvatar size={80} isActive={true} />
                </div>
                <span className="text-xs font-black text-amber-300 font-cinzel mt-2">Bar Hala Ai</span>
                <span className="text-[10px] text-purple-300 uppercase tracking-widest font-mono">
                  Autonomous Concierge
                </span>
              </div>

              {/* Text & Quick Prompt Chips */}
              <div className="flex-1 space-y-3 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kecerdasan Budaya & Etika Adat Nusantara</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white font-cinzel">
                  Konsultasikan Etika & Filosofi Tradisi dengan Bar Hala AI
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-2xl">
                  Bar Hala Ai siap memandu pantangan adat suku Kajang (larangan baju warna-warni & alas kaki),
                  filosofi ritual penarikan kapal Pinisi (Annyorong Poti), rute terbaik lumba-lumba Teluk
                  Kiluan, hingga rekomendasi wastra tapis Lampung.
                </p>

                {/* Prompt Chips */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {[
                    "Pantangan adat bohe Ammatoa Kajang?",
                    "Filosofi sakral perahu Pinisi Bulukumba?",
                    "Kapan musim lumba-lumba Teluk Kiluan?",
                    "Makna motif sulam emas Kain Tapis?",
                  ].map((prompt, idx) => (
                    <Link
                      key={idx}
                      href="/peta"
                      className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 border border-purple-400/30 text-purple-200 hover:text-white text-xs font-medium transition active:scale-95"
                    >
                      "{prompt}"
                    </Link>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                <Link
                  href="/peta"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm tracking-wide transition shadow-xl active:scale-95 group"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buka Chat di Peta</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* WARISAN MUSIK TRADISIONAL NUSANTARA */}
          {/* ======================================================== */}
          <section id="musik" className="space-y-4 pt-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel flex items-center gap-2">
                  <Music className="w-5 h-5 text-emerald-400" />
                  <span>Galeri Warisan Musik Tradisional Nusantara</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  16 koleksi audio gamelan, sape Dayak, degung Sunda, dan tembang maritim yang sinkron otomatis
                  saat menjelajah peta
                </p>
              </div>

              <Link
                href="/peta"
                className="hidden sm:flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold"
              >
                <span>Dengarkan Auto-DJ di Peta</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {AUDIO_TRACKS.slice(0, 8).map((track) => {
                const isPlaying = playingTrackId === track.id;
                return (
                  <div
                    key={track.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isPlaying
                        ? "bg-emerald-500/15 border-emerald-400/60 shadow-[0_4px_20px_rgba(16,185,129,0.25)]"
                        : "bg-slate-900/70 border-slate-800 hover:border-amber-500/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-800 text-amber-400">
                          {track.region || "Nusantara"}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-1.5 truncate">{track.title}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{track.subtitle}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTogglePlayAudio(track)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-90 shrink-0 ${
                          isPlaying
                            ? "bg-emerald-500 text-slate-950 shadow-lg animate-pulse"
                            : "bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300"
                        }`}
                        title={isPlaying ? "Jeda Lagu" : "Putar Sampel Lagu"}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate">{track.artist}</span>
                      <span className="font-mono">{track.duration || "Audio"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ======================================================== */}
          {/* BMKG STATUS & MARITIME TELEMETRY PREVIEW */}
          {/* ======================================================== */}
          <section id="bmkg" className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/30 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 uppercase">
                    Stasiun Maritim Bulukumba
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>STATUS AMAN</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-2">Laut Flores & Selat Makassar</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Kondisi perairan Tanjung Bira & Tana Beru sangat kondusif untuk pelayaran perahu Pinisi dan
                  snorkeling di Pulau Liukang Loe.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <p className="text-[10px] text-slate-400">Suhu</p>
                  <p className="text-sm font-bold text-white font-mono">29°C</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <p className="text-[10px] text-slate-400">Angin</p>
                  <p className="text-sm font-bold text-cyan-300 font-mono">14 km/j</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <p className="text-[10px] text-slate-400">Gelombang</p>
                  <p className="text-sm font-bold text-emerald-400 font-mono">0.6 m</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 uppercase">
                    Stasiun Meteorologi Lampung
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>STATUS AMAN</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-2">Teluk Semangka & Teluk Lampung</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Visibilitas laut Teluk Kiluan jernih, cuaca cerah berawan ideal untuk pengamatan lumba-lumba
                  hidung botol dan cagar alam Krakatau.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <p className="text-[10px] text-slate-400">Suhu</p>
                  <p className="text-sm font-bold text-white font-mono">28°C</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <p className="text-[10px] text-slate-400">Angin</p>
                  <p className="text-sm font-bold text-cyan-300 font-mono">12 km/j</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <p className="text-[10px] text-slate-400">Gelombang</p>
                  <p className="text-sm font-bold text-emerald-400 font-mono">0.8 m</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ======================================================== */}
      {/* 3. FOOTER BAR PORTAL */}
      {/* ======================================================== */}
      <footer className="relative z-30 h-12 bg-slate-950/95 backdrop-blur-2xl border-t border-amber-500/20 px-4 sm:px-6 flex items-center justify-between text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <img src="/mandala.png" alt="Mandala" className="w-5 h-5 object-contain opacity-70" />
          <span className="hidden sm:inline">
            © 2026 Nusa Antara — Portal Eksplorasi Pusaka Kebudayaan & Wisata Indonesia.
          </span>
          <span className="sm:hidden">© 2026 Nusa Antara</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 text-slate-400">
          <Link href="/peta" className="hover:text-amber-300 transition flex items-center gap-1 font-semibold">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Peta Interaktif</span>
          </Link>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-slate-500">BMKG SATU PETA MKG</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-slate-500">OpenStreetMap</span>
        </div>
      </footer>
    </div>
  );
}
