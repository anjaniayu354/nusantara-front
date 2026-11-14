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
import ThemeToggle from "@/components/ThemeToggle";
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
      if (regionFilter === "sulawesi" && !d.province.toLowerCase().includes("sulawesi")) return false;
      if (regionFilter === "lampung" && !d.province.toLowerCase().includes("lampung")) return false;

      if (categoryFilter !== "all" && d.category !== categoryFilter) return false;

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
    <div className="relative min-h-screen w-full flex flex-col font-sans bg-[var(--bx-bg)] text-[var(--bx-ink)] overflow-x-hidden selection:bg-[var(--gold)] selection:text-[var(--brand)]">
      {/* Blackbox Architectural Rails Background Overlay */}
      <div className="blackbox-rails" aria-hidden="true">
        <div className="blackbox-rail-inner">
          <span className="blackbox-rail-hatch blackbox-rail-hatch-left" />
          <span className="blackbox-rail-hatch blackbox-rail-hatch-right" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. HEADER UTAMA PORTAL (AUI INSTITUTIONAL HEADER) */}
      {/* ======================================================== */}
      <header className="fixed top-0 inset-x-0 z-40 h-15 bg-[var(--bx-surface)]/95 backdrop-blur-xl border-b border-[var(--bx-border)] px-4 sm:px-6 flex items-center justify-between gap-3 shadow-sm transition-colors">
        {/* Left Section: Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
            className="p-2 rounded-lg bg-[var(--bx-bg)] hover:bg-[var(--bx-darker)] border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--gold)] transition active:scale-95"
            title={isSideMenuOpen ? "Tutup Side Menu" : "Buka Side Menu"}
            aria-label="Toggle Side Menu"
          >
            {isSideMenuOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[var(--bx-bg)] border border-[var(--bx-border)] p-1 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <img
                src="/mandala.png"
                alt="Logo Mandala"
                className="w-full h-full object-contain group-hover:rotate-45 transition-transform duration-700"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[var(--bx-ink-bright)] font-serif leading-none">
                  NUSA ANTARA
                </span>
                <span className="portal-badge-portal">
                  PORTAL
                </span>
              </div>
              <span className="text-[11px] text-[var(--bx-muted)] font-medium hidden md:inline-block">
                Pusaka Kebudayaan & Wisata Geospasial
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section: Quick Search Input (AUI Search) */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="portal-input-wrap w-full">
            <Search className="absolute left-3 w-4 h-4 text-[var(--bx-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari destinasi, tradisi adat, kain tapis, kapal pinisi..."
              className="portal-input !h-9 text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-[var(--bx-muted)] hover:text-[var(--gold)] text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Theme Toggle, CTA Peta & User Session */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* AUI Theme Mode Toggle (Light / Dark) */}
          <ThemeToggle />

          {/* Main CTA: Buka Peta Petualangan */}
          <Link
            href="/peta"
            className="portal-submit-btn-gold !h-9 !px-3.5 !text-xs shrink-0 group"
          >
            <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
            <span className="hidden sm:inline font-bold">Peta Petualangan</span>
            <span className="sm:hidden font-bold">Peta</span>
          </Link>

          {/* User Session Area */}
          {authUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-[var(--bx-border)] shrink-0">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bx-surface-card)] border border-[var(--gold)]/40 text-[var(--gold)] text-xs font-bold"
                title={`Masuk sebagai ${authUser.name} (${authUser.phone || authUser.email})`}
              >
                <UserCheck className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <span className="max-w-[80px] sm:max-w-[120px] truncate">{authUser.name}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-[var(--bx-bg)] hover:bg-rose-500/10 border border-[var(--bx-border)] hover:border-rose-400 text-rose-500 transition active:scale-95"
                title="Keluar / Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bx-surface)] hover:bg-[var(--bx-darker)] border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--gold)] font-bold text-xs transition active:scale-95 shrink-0"
              title="Masuk ke Akun Nusa Antara"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </Link>
          )}
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. BODY CONTENT: SIDE MENU + DASHBOARD */}
      {/* ======================================================== */}
      <div className="relative pt-15 flex-1 flex overflow-hidden">
        {/* SIDE MENU (AUI INSTITUTIONAL SIDEBAR) */}
        <aside
          className={`fixed lg:sticky top-15 bottom-0 left-0 z-30 w-72 bg-[var(--bx-surface)] border-r border-[var(--bx-border)] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
            isSideMenuOpen ? "translate-x-0" : "-translate-x-full lg:-ml-72"
          } h-[calc(100vh-3.75rem)] overflow-y-auto custom-scrollbar`}
        >
          {/* Top User Status Card in Side Menu */}
          <div className="p-4 border-b border-[var(--bx-border)]">
            <div className="p-3.5 rounded-xl bg-[var(--bx-surface-card)] border border-[var(--bx-border)] shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-[var(--gold)]/40 overflow-hidden bg-[var(--bx-bg)] flex items-center justify-center shrink-0">
                  {authUser?.avatar ? (
                    <img src={authUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <img src="/mandala.png" alt="Mandala" className="w-6 h-6 object-contain opacity-80" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--bx-ink-bright)] truncate font-serif">
                    {authUser ? authUser.name : "Tamu Penjelajah"}
                  </p>
                  <p className="text-[10px] text-[var(--gold)] font-medium">
                    {authUser ? "Sesi Petualang Aktif" : "Eksplorasi Publik"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-[var(--bx-muted)] uppercase tracking-wider font-mono">
                      {authUser?.provider || "Tamu"}
                    </span>
                  </div>
                </div>
              </div>

              {!authUser && (
                <Link
                  href="/login"
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-[var(--bx-bg)] hover:bg-[var(--gold)]/10 border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--gold)] text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk untuk Sinkronisasi</span>
                </Link>
              )}
            </div>
          </div>

          {/* Navigation Items (AUI Sidebar Items) */}
          <div className="p-4 space-y-6 flex-1">
            {/* Group 1: Navigasi Utama */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--bx-muted)] mb-2 px-2 font-mono">
                NAVIGASI UTAMA
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === "dashboard"
                      ? "bg-[var(--gold)]/15 border border-[var(--gold)] text-[var(--gold)] font-bold shadow-xs"
                      : "text-[var(--bx-ink)] hover:bg-[var(--bx-bg)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-[var(--gold)]" />
                    <span>Dashboard Utama</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                </button>

                <Link
                  href="/peta"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[var(--bx-ink)] hover:bg-[var(--bx-bg)] hover:text-[var(--gold)] transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-[var(--gold)] transition-transform group-hover:rotate-45" />
                    <span>Peta Petualangan</span>
                  </div>
                  <span className="portal-badge-gold !text-[8px] !px-1.5 !py-0.5">
                    LIVE
                  </span>
                </Link>
              </div>
            </div>

            {/* Group 2: Episentrum Wilayah */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--bx-muted)] mb-2 px-2 font-mono">
                EPISENTRUM BUDAYA
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setRegionFilter(regionFilter === "sulawesi" ? "all" : "sulawesi");
                    setActiveTab("destinasi");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    regionFilter === "sulawesi"
                      ? "bg-[var(--gold)]/15 border border-[var(--gold)] text-[var(--gold)] font-bold"
                      : "text-[var(--bx-ink)] hover:bg-[var(--bx-bg)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Waves className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Bulukumba (Sulsel)</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bx-bg)] text-[var(--bx-muted)] font-mono">
                    8 Lokasi
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRegionFilter(regionFilter === "lampung" ? "all" : "lampung");
                    setActiveTab("destinasi");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    regionFilter === "lampung"
                      ? "bg-[var(--gold)]/15 border border-[var(--gold)] text-[var(--gold)] font-bold"
                      : "text-[var(--bx-ink)] hover:bg-[var(--bx-bg)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mountain className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>Lampung (Sumatera)</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bx-bg)] text-[var(--bx-muted)] font-mono">
                    10 Lokasi
                  </span>
                </button>
              </div>
            </div>

            {/* Group 3: Modul & Fitur */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--bx-muted)] mb-2 px-2 font-mono">
                MODUL & FITUR
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("events")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    activeTab === "events"
                      ? "bg-[var(--gold)]/15 border border-[var(--gold)] text-[var(--gold)] font-bold"
                      : "text-[var(--bx-ink)] hover:bg-[var(--bx-bg)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-orange-500" />
                    <span>Radar Event Budaya</span>
                  </div>
                  <span className="portal-badge-gold !text-[8px] !px-1.5 !py-0.5">
                    7 Event
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("musik")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    activeTab === "musik"
                      ? "bg-[var(--gold)]/15 border border-[var(--gold)] text-[var(--gold)] font-bold"
                      : "text-[var(--bx-ink)] hover:bg-[var(--bx-bg)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Music className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Warisan Musik Audio</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bx-bg)] text-[var(--bx-muted)] font-mono">
                    16 Trek
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    activeTab === "ai"
                      ? "bg-[var(--gold)]/15 border border-[var(--gold)] text-[var(--gold)] font-bold"
                      : "text-[var(--bx-ink)] hover:bg-[var(--bx-bg)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Bar Hala AI Concierge</span>
                  </div>
                  <span className="portal-badge-blue !text-[8px] !px-1.5 !py-0.5">
                    AI Topeng
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("bmkg")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    activeTab === "bmkg"
                      ? "bg-[var(--gold)]/15 border border-[var(--gold)] text-[var(--gold)] font-bold"
                      : "text-[var(--bx-ink)] hover:bg-[var(--bx-bg)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Telemetri Cuaca BMKG</span>
                  </div>
                  <span className="portal-badge-green !text-[8px] !px-1.5 !py-0.5">
                    Live Peta
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Status in Side Menu */}
          <div className="p-4 border-t border-[var(--bx-border)] bg-[var(--bx-bg)]/50">
            <div className="flex items-center justify-between text-[11px] text-[var(--bx-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>BMKG SATU PETA MKG</span>
              </span>
              <span className="text-[var(--gold)] font-mono font-bold">v1.2</span>
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="flex-1 min-w-0 h-[calc(100vh-3.75rem)] overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-10">
          {/* HERO BANNER SECTION (AUI EDITORIAL SHOWCASE) */}
          <section className="portal-card-wrap !p-6 sm:!p-8 lg:!p-10 relative overflow-hidden">
            {/* Subtle glow in corner */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="portal-badge-gold">
                  <Sparkles className="w-3 h-3" />
                  Eksplorasi Pusaka Kebudayaan Digital
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--bx-ink-bright)] tracking-tight leading-tight font-serif">
                Pusaka Nusantara, Warisan Leluhur Adiluhung
              </h1>

              <p className="mt-3 text-sm sm:text-base text-[var(--bx-prose-ink)] leading-relaxed font-sans font-normal">
                Selamat datang di kanvas terintegrasi Nusa Antara. Jelajahi kearifan bahari perahu Pinisi
                Bulukumba, tradisi sakral Bohe Ammatoa Kajang, pesona lumba-lumba Teluk Kiluan, hingga kaldera
                vulkanik Krakatau dengan panduan geospasial real-time, telemetri cuaca maritim BMKG, dan asisten cerdas Bar Hala AI.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/peta"
                  className="portal-submit-btn-gold group !h-11"
                >
                  <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
                  <span>Jelajahi Peta Petualangan Interaktif</span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveTab("events")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--bx-bg)] hover:bg-[var(--bx-darker)] border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] font-bold text-xs sm:text-sm transition active:scale-95"
                >
                  <CalendarDays className="w-4 h-4 text-orange-500" />
                  <span>Agenda Event Budaya</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--bx-bg)] hover:bg-[var(--bx-darker)] border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] font-bold text-xs sm:text-sm transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Konsultasi Bar Hala AI</span>
                </button>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* KEY METRICS & KPI STATS CARDS (AUI STATS CARDS) */}
          {/* ======================================================== */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="portal-card-wrap !p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--bx-muted)] font-medium font-sans">Destinasi Terkurasi</span>
                <Landmark className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[var(--bx-ink-bright)] font-serif">18</p>
              <p className="text-[11px] text-[var(--bx-muted)] mt-1 font-mono">8 Bulukumba • 10 Lampung</p>
            </div>

            <div className="portal-card-wrap !p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--bx-muted)] font-medium font-sans">Radar Event Budaya</span>
                <CalendarDays className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 font-serif">7</p>
              <p className="text-[11px] text-[var(--bx-muted)] mt-1 font-mono">Festival Pinisi, Sekura, dll.</p>
            </div>

            <div className="portal-card-wrap !p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--bx-muted)] font-medium font-sans">Warisan Audio Etnik</span>
                <Music className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-serif">16</p>
              <p className="text-[11px] text-[var(--bx-muted)] mt-1 font-mono">Sinkronisasi Musik Wilayah</p>
            </div>

            <div className="portal-card-wrap !p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--bx-muted)] font-medium font-sans">Sensor Cuaca BMKG</span>
                <CloudSun className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-serif">2</p>
              <p className="text-[11px] text-[var(--bx-muted)] mt-1 font-mono">Telemetri Pesisir Maritim</p>
            </div>
          </section>

          {/* ======================================================== */}
          {/* FILTER & EXPLORATION TABS */}
          {/* ======================================================== */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--bx-border)]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--bx-ink-bright)] font-serif flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--gold)]" />
                  <span>Katalog Destinasi Budaya</span>
                </h2>
                <p className="text-xs text-[var(--bx-muted)] mt-0.5 font-sans">
                  Menampilkan {filteredDestinations.length} destinasi budaya berdasar penyaringan aktif
                </p>
              </div>

              {/* Region Pill Filters */}
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[var(--bx-surface)] border border-[var(--bx-border)]">
                <button
                  type="button"
                  onClick={() => setRegionFilter("all")}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                    regionFilter === "all"
                      ? "bg-[var(--gold)] text-white shadow-xs"
                      : "text-[var(--bx-muted)] hover:text-[var(--bx-ink)]"
                  }`}
                >
                  Semua ({DESTINATIONS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRegionFilter("sulawesi")}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                    regionFilter === "sulawesi"
                      ? "bg-[var(--gold)] text-white shadow-xs"
                      : "text-[var(--bx-muted)] hover:text-[var(--bx-ink)]"
                  }`}
                >
                  Bulukumba (8)
                </button>
                <button
                  type="button"
                  onClick={() => setRegionFilter("lampung")}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                    regionFilter === "lampung"
                      ? "bg-[var(--gold)] text-white shadow-xs"
                      : "text-[var(--bx-muted)] hover:text-[var(--bx-ink)]"
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
                      ? "bg-[var(--gold)]/15 border border-[var(--gold)] text-[var(--gold)] font-bold shadow-xs"
                      : "bg-[var(--bx-surface)] border border-[var(--bx-border)] text-[var(--bx-muted)] hover:border-[var(--gold)]/50 hover:text-[var(--bx-ink)]"
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
                  className="portal-card-wrap !p-0 group hover:border-[var(--gold)] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image & Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-[var(--bx-darker)]">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bx-surface-card)] via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className="portal-badge-gold">
                        {dest.province.includes("Sulawesi") ? "Bulukumba" : "Lampung"}
                      </span>
                      {dest.subCategory && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--bx-surface)]/90 backdrop-blur-md border border-[var(--bx-border)] text-[var(--bx-muted)] font-medium">
                          {dest.subCategory}
                        </span>
                      )}
                    </div>

                    {/* BMKG Status Pill */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--bx-surface)]/90 backdrop-blur-md border border-blue-500/30 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                      <CloudSun className="w-3.5 h-3.5" />
                      <span>
                        {dest.bmkgStation.temperature}°C • {dest.bmkgStation.safetyStatus}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-[var(--bx-ink-bright)] font-serif group-hover:text-[var(--gold)] transition-colors line-clamp-1">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-[var(--gold)] font-medium line-clamp-1">{dest.subtitle}</p>
                      <p className="text-xs text-[var(--bx-prose-ink)] mt-2 line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    {/* Cultural Highlights Tags */}
                    {dest.traditionalAttire && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[var(--gold)] bg-[var(--gold)]/10 px-2.5 py-1 rounded-md border border-[var(--gold)]/20">
                        <Shirt className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Wastra: {dest.traditionalAttire.wastraType}</span>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-[var(--bx-border)] flex items-center justify-between gap-2">
                      <div className="text-xs">
                        <span className="text-[var(--bx-muted)]">Paket: </span>
                        <span className="font-bold text-[var(--gold)] font-mono">
                          Rp {dest.tripPackage.priceIdr.toLocaleString("id-ID")}
                        </span>
                      </div>

                      {/* Button to Map with Destination Focus Query */}
                      <Link
                        href={`/peta?dest=${encodeURIComponent(dest.id)}`}
                        className="portal-submit-btn-gold !h-8 !px-3 !text-xs shrink-0"
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
            <div className="flex items-center justify-between pb-2 border-b border-[var(--bx-border)]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--bx-ink-bright)] font-serif flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-orange-500" />
                  <span>Radar Event Kebudayaan Nusantara</span>
                </h2>
                <p className="text-xs text-[var(--bx-muted)] mt-0.5">
                  Kalender festival maritim, ritual adat, dan pesta tradisi di Bulukumba & Lampung
                </p>
              </div>

              <Link
                href="/peta"
                className="hidden sm:flex items-center gap-1 text-xs text-[var(--gold)] hover:underline font-bold"
              >
                <span>Lihat Radar di Peta</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CULTURAL_EVENTS.map((evt) => (
                <div
                  key={evt.id}
                  className="portal-card-wrap hover:border-orange-500/50 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="portal-badge-gold">
                        {evt.province}
                      </span>
                      {evt.status === "ACTIVE_TODAY" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>Berlangsung</span>
                        </span>
                      ) : (
                        <span className="portal-badge-gold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>H-{evt.daysRemaining} Hari</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[var(--bx-ink-bright)] font-serif leading-snug">{evt.name}</h3>

                    <div className="flex items-center gap-1.5 text-xs text-[var(--bx-muted)] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{evt.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[var(--gold)] font-mono">
                      <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                      <span>{evt.dateRange}</span>
                    </div>

                    <p className="text-xs text-[var(--bx-prose-ink)] leading-relaxed pt-2 border-t border-[var(--bx-border)]">
                      {evt.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/20 text-[11px] text-[var(--gold)] italic">
                      "{evt.culturalEssence}"
                    </div>
                  </div>

                  <Link
                    href={`/peta?dest=${encodeURIComponent(evt.name)}`}
                    className="w-full py-2 px-3 rounded-lg bg-[var(--bx-surface)] hover:bg-[var(--gold)] hover:text-white border border-[var(--bx-border)] text-[var(--gold)] text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs group"
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
          <section id="ai" className="portal-card-wrap !p-6 sm:!p-8">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              {/* Barong Avatar with interactive tracking */}
              <div className="shrink-0 flex flex-col items-center">
                <div className="p-3 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] shadow-md flex items-center justify-center">
                  <BarongAvatar size={80} isActive={true} />
                </div>
                <span className="text-xs font-bold text-[var(--gold)] font-serif mt-2">Bar Hala Ai</span>
                <span className="text-[10px] text-[var(--bx-muted)] uppercase tracking-wider font-mono">
                  Autonomous Concierge
                </span>
              </div>

              {/* Text & Quick Prompt Chips */}
              <div className="flex-1 space-y-3 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5">
                  <span className="portal-badge-blue">
                    <Sparkles className="w-3 h-3" />
                    Kecerdasan Budaya & Etika Adat Nusantara
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[var(--bx-ink-bright)] font-serif">
                  Konsultasikan Etika & Filosofi Tradisi dengan Bar Hala AI
                </h3>

                <p className="text-xs sm:text-sm text-[var(--bx-prose-ink)] leading-relaxed max-w-2xl">
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
                      className="px-3 py-1.5 rounded-lg bg-[var(--bx-bg)] hover:bg-[var(--gold)]/15 border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] text-xs font-medium transition active:scale-95"
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
                  className="portal-submit-btn-gold group !h-11"
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
            <div className="flex items-center justify-between pb-2 border-b border-[var(--bx-border)]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--bx-ink-bright)] font-serif flex items-center gap-2">
                  <Music className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Galeri Warisan Musik Tradisional Nusantara</span>
                </h2>
                <p className="text-xs text-[var(--bx-muted)] mt-0.5">
                  16 koleksi audio gamelan, sape Dayak, degung Sunda, dan tembang maritim yang sinkron otomatis
                  saat menjelajah peta
                </p>
              </div>

              <Link
                href="/peta"
                className="hidden sm:flex items-center gap-1 text-xs text-[var(--gold)] hover:underline font-bold"
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
                    className={`portal-card-wrap !p-3.5 transition-all flex flex-col justify-between ${
                      isPlaying
                        ? "!border-[var(--gold)] ring-2 ring-[var(--gold)]/20 shadow-md"
                        : "hover:border-[var(--gold)]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="portal-badge-gold !text-[8px] !px-1.5 !py-0.5">
                          {track.region || "Nusantara"}
                        </span>
                        <h4 className="text-xs font-bold text-[var(--bx-ink-bright)] mt-1.5 truncate">{track.title}</h4>
                        <p className="text-[10px] text-[var(--bx-muted)] truncate">{track.subtitle}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTogglePlayAudio(track)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-90 shrink-0 ${
                          isPlaying
                            ? "bg-[var(--gold)] text-white shadow-md animate-pulse"
                            : "bg-[var(--bx-bg)] hover:bg-[var(--gold)] hover:text-white text-[var(--gold)] border border-[var(--bx-border)]"
                        }`}
                        title={isPlaying ? "Jeda Lagu" : "Putar Sampel Lagu"}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[var(--bx-border)] flex items-center justify-between text-[10px] text-[var(--bx-muted)]">
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
            <div className="portal-card-wrap !p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="portal-badge-blue">
                    Stasiun Maritim Bulukumba
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>STATUS AMAN</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-[var(--bx-ink-bright)] font-serif mt-2">Laut Flores & Selat Makassar</h3>
                <p className="text-xs text-[var(--bx-prose-ink)] mt-1 leading-relaxed">
                  Kondisi perairan Tanjung Bira & Tana Beru sangat kondusif untuk pelayaran perahu Pinisi dan
                  snorkeling di Pulau Liukang Loe.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--bx-border)] text-center">
                <div className="p-2 rounded-lg bg-[var(--bx-bg)] border border-[var(--bx-border)]">
                  <p className="text-[10px] text-[var(--bx-muted)] font-medium">Suhu</p>
                  <p className="text-sm font-bold text-[var(--bx-ink-bright)] font-mono">29°C</p>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bx-bg)] border border-[var(--bx-border)]">
                  <p className="text-[10px] text-[var(--bx-muted)] font-medium">Angin</p>
                  <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-mono">14 km/j</p>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bx-bg)] border border-[var(--bx-border)]">
                  <p className="text-[10px] text-[var(--bx-muted)] font-medium">Gelombang</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">0.6 m</p>
                </div>
              </div>
            </div>

            <div className="portal-card-wrap !p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="portal-badge-gold">
                    Stasiun Meteorologi Lampung
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>STATUS AMAN</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-[var(--bx-ink-bright)] font-serif mt-2">Teluk Semangka & Teluk Lampung</h3>
                <p className="text-xs text-[var(--bx-prose-ink)] mt-1 leading-relaxed">
                  Visibilitas laut Teluk Kiluan jernih, cuaca cerah berawan ideal untuk pengamatan lumba-lumba
                  hidung botol dan cagar alam Krakatau.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--bx-border)] text-center">
                <div className="p-2 rounded-lg bg-[var(--bx-bg)] border border-[var(--bx-border)]">
                  <p className="text-[10px] text-[var(--bx-muted)] font-medium">Suhu</p>
                  <p className="text-sm font-bold text-[var(--bx-ink-bright)] font-mono">28°C</p>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bx-bg)] border border-[var(--bx-border)]">
                  <p className="text-[10px] text-[var(--bx-muted)] font-medium">Angin</p>
                  <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-mono">12 km/j</p>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bx-bg)] border border-[var(--bx-border)]">
                  <p className="text-[10px] text-[var(--bx-muted)] font-medium">Gelombang</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">0.8 m</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ======================================================== */}
      {/* 3. FOOTER BAR PORTAL (AUI INSTITUTIONAL BOTTOM BAR) */}
      {/* ======================================================== */}
      <footer className="relative z-30 h-12 bg-[var(--bx-surface)] border-t border-[var(--bx-border)] px-4 sm:px-6 flex items-center justify-between text-xs text-[var(--bx-muted)] select-none">
        <div className="flex items-center gap-2">
          <img src="/mandala.png" alt="Mandala" className="w-5 h-5 object-contain opacity-70" />
          <span className="hidden sm:inline">
            © 2026 Nusa Antara — Portal Eksplorasi Pusaka Kebudayaan & Wisata Indonesia.
          </span>
          <span className="sm:hidden">© 2026 Nusa Antara</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 text-[var(--bx-muted)]">
          <Link href="/peta" className="hover:text-[var(--gold)] transition flex items-center gap-1 font-semibold">
            <Compass className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Peta Interaktif</span>
          </Link>
          <span className="text-[var(--bx-border)] hidden sm:inline">•</span>
          <span className="hidden sm:inline">BMKG SATU PETA MKG</span>
          <span className="text-[var(--bx-border)] hidden sm:inline">•</span>
          <span className="hidden sm:inline">OpenStreetMap</span>
        </div>
      </footer>
    </div>
  );
}
