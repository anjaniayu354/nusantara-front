"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Search,
  Phone,
  Mail,
  ShieldCheck,
  Bot,
  Sparkles,
  Waves,
  Landmark,
  TreePine,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Star,
  LogIn,
  LogOut,
  UserCheck,
  Play,
  Pause,
  Send,
  CheckCircle2,
  X,
  Shirt,
  Clock,
  Heart,
  Navigation,
  Globe,
  Award,
} from "lucide-react";
import { DESTINATIONS, CulturalDestination, Category } from "@/data/destinations";
import { CULTURAL_EVENTS, CulturalEvent } from "@/data/culturalEvents";
import { AUDIO_TRACKS, AudioTrack } from "@/data/audioTracks";
import { BarongAvatar } from "@/components/hud/BarongAvatar";
import ThemeToggle from "@/components/ThemeToggle";
import { getStoredUser, subscribeAuth, clearStoredUser, AuthUser } from "@/lib/auth";

export default function PortalLandingPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Search & Filter State in the Booking Card
  const [selectedTab, setSelectedTab] = useState<"all" | "laut" | "budaya" | "hutan" | "event">("all");
  const [regionFilter, setRegionFilter] = useState<"all" | "sulawesi" | "lampung">("all");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [travelerCount, setTravelerCount] = useState<string>("2");
  const [seasonChoice, setSeasonChoice] = useState<string>("all");

  // Destination Carousel / Grid Index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Detail Modal State
  const [selectedDestModal, setSelectedDestModal] = useState<CulturalDestination | null>(null);

  // Bar Hala AI Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    {
      sender: "ai",
      text: "Sampurasun! Saya Bar Hala AI, panduan kebudayaan Nusa Antara. Ada yang ingin Anda tanyakan seputar etika adat, filosofi wastra, atau rekomendasi destinasi di Bulukumba & Lampung?",
    },
  ]);
  const [aiInputText, setAiInputText] = useState("");

  // Audio preview state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Subscribe to auth state
  useEffect(() => {
    setAuthUser(getStoredUser());
    const unsub = subscribeAuth((user) => {
      setAuthUser(user);
    });
    return unsub;
  }, []);

  // Audio cleanup on unmount
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
      audio.volume = 0.55;
      audio.play().catch((err) => console.log("Audio autoplay restricted:", err));
      audio.onended = () => setPlayingTrackId(null);
      audioRef.current = audio;
      setPlayingTrackId(track.id);
    }
  };

  const handleLogout = () => {
    clearStoredUser();
  };

  // Filtered destinations
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      // Tab filter
      if (selectedTab === "laut" && d.category !== "laut" && d.category !== "pantai") return false;
      if (selectedTab === "budaya" && d.category !== "budaya" && d.category !== "desa") return false;
      if (selectedTab === "hutan" && d.category !== "hutan" && d.category !== "gunung") return false;

      // Region filter
      if (regionFilter === "sulawesi" && !d.province.toLowerCase().includes("sulawesi")) return false;
      if (regionFilter === "lampung" && !d.province.toLowerCase().includes("lampung")) return false;

      // Category filter
      if (categoryFilter !== "all" && d.category !== categoryFilter) return false;

      // Search keyword
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchesName = d.name.toLowerCase().includes(q);
        const matchesSub = d.subtitle.toLowerCase().includes(q);
        const matchesProv = d.province.toLowerCase().includes(q);
        const matchesDesc = d.description.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesProv && !matchesDesc) return false;
      }

      return true;
    });
  }, [selectedTab, regionFilter, categoryFilter, searchKeyword]);

  // Featured 5 destinations for the main carousel
  const topDestinations = useMemo(() => {
    return [
      DESTINATIONS.find((d) => d.id === "bulukumba-bira") || DESTINATIONS[0],
      DESTINATIONS.find((d) => d.id === "bulukumba-tana-beru") || DESTINATIONS[1],
      DESTINATIONS.find((d) => d.id === "bulukumba-ammatoa-kajang") || DESTINATIONS[2],
      DESTINATIONS.find((d) => d.id === "lampung-way-kambas") || DESTINATIONS[9],
      DESTINATIONS.find((d) => d.id === "lampung-kiluan") || DESTINATIONS[8],
    ];
  }, []);

  const handleSendAiMessage = (customText?: string) => {
    const textToSend = customText || aiInputText;
    if (!textToSend.trim()) return;

    const newMessages = [...aiChatMessages, { sender: "user" as const, text: textToSend }];
    setAiChatMessages(newMessages);
    if (!customText) setAiInputText("");

    setTimeout(() => {
      let reply = "Pertanyaan Anda sangat menarik! ";
      const lower = textToSend.toLowerCase();

      if (lower.includes("bira") || lower.includes("pantai") || lower.includes("laut")) {
        reply += "Pantai Tanjung Bira di Bulukumba terkenal dengan pasir sehalus tepung dan air bergradasi tiga warna. Disarankan memakai pakaian santun saat berada di perkampungan warga sekitar pesisir.";
      } else if (lower.includes("pinisi") || lower.includes("tana beru") || lower.includes("kapal")) {
        reply += "Tana Beru adalah pusat galangan perahu Pinisi UNESCO. Anda dapat menyaksikan Panrita Lopi memahat lambung kapal kayu ulin tanpa gambar teknik rancang bangun tertulis.";
      } else if (lower.includes("kajang") || lower.includes("ammatoa") || lower.includes("hitam")) {
        reply += "Di Kawasan Adat Ammatoa Kajang, berlaku aturan mutlak berpakaian serba hitam (Passapu dan sarung hitam), dilarang membawa alas kaki, kamera elektronik, dan kendaraan bermotor.";
      } else if (lower.includes("kambas") || lower.includes("gajah") || lower.includes("lampung")) {
        reply += "Taman Nasional Way Kambas di Lampung adalah suaka gajah Sumatera dan badak Sumatera. Waktu kunjungan terbaik adalah pagi hari saat cuaca sejuk dan gajah beraktivitas di sabana.";
      } else if (lower.includes("tapis") || lower.includes("wastra") || lower.includes("kain")) {
        reply += "Kain Tapis Lampung disulam dengan benang emas motif pucuk rebung atau kapal jung sariat. Melambangkan keagungan martabat dan kesucian adat Saibatin serta Pepadun.";
      } else {
        reply += "Kearifan lokal di Bulukumba dan Lampung menekankan penghormatan terhadap alam semesta dan tetua adat. Silakan jelajahi titik-titik lokasi langsung melalui Peta Petualangan!";
      }

      setAiChatMessages([...newMessages, { sender: "ai", text: reply }]);
    }, 600);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 5000);
      setNewsletterEmail("");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans bg-[var(--bx-bg)] text-[var(--bx-ink)] selection:bg-[var(--gold)] selection:text-[var(--brand)]">
      {/* ======================================================== */}
      {/* 1. TOP UTILITY BAR (Contact Info & Socials) */}
      {/* ======================================================== */}
      <div className="w-full bg-[var(--bx-surface)] border-b border-[var(--bx-border)] py-2 px-4 sm:px-8 text-xs text-[var(--bx-muted)] transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Contact Info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="tel:+6281234567890"
              className="flex items-center gap-1.5 hover:text-[var(--gold)] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>+62 812-3456-7890</span>
            </a>
            <a
              href="mailto:info@nusa-antara.id"
              className="flex items-center gap-1.5 hover:text-[var(--gold)] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>info@nusa-antara.id</span>
            </a>
            <div className="hidden md:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Sulawesi Selatan & Lampung, Indonesia</span>
            </div>
          </div>

          {/* Right: Social Media, Theme Mode & Quick Language */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <span className="hidden sm:inline-block text-[11px] font-mono text-[var(--gold)]">
              BMKG Telemetri: Cuaca Aman
            </span>
            <div className="h-3 w-px bg-[var(--bx-border)] hidden sm:block" />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN NAVIGATION HEADER (Traveleo Style Sticky Navbar) */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 w-full bg-[var(--bx-surface)]/95 backdrop-blur-md border-b border-[var(--bx-border)] px-4 sm:px-8 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] p-1.5 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shadow-xs">
              <img
                src="/mandala.png"
                alt="Logo Mandala Nusa Antara"
                className="w-full h-full object-contain group-hover:rotate-45 transition-transform duration-700"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--bx-ink-bright)] font-serif leading-none">
                  NUSA ANTARA
                </span>
                <span className="portal-badge-portal !text-[10px]">
                  PORTAL
                </span>
              </div>
              <span className="text-[11px] text-[var(--bx-muted)] font-medium hidden sm:inline-block">
                Pusaka Kebudayaan & Wisata Geospasial
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-[var(--bx-ink)]">
            <Link
              href="/"
              className="text-[var(--gold)] border-b-2 border-[var(--gold)] pb-1 transition-colors"
            >
              Beranda
            </Link>
            <a
              href="#destinasi"
              className="hover:text-[var(--gold)] pb-1 transition-colors"
            >
              Destinasi Budaya
            </a>
            <a
              href="#mengapa-kami"
              className="hover:text-[var(--gold)] pb-1 transition-colors"
            >
              Keunggulan
            </a>
            <a
              href="#radar-event"
              className="hover:text-[var(--gold)] pb-1 transition-colors"
            >
              Radar Event
            </a>
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="hover:text-[var(--gold)] pb-1 transition-colors flex items-center gap-1.5"
            >
              <span>Bar Hala AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
            <a
              href="#ulasan"
              className="hover:text-[var(--gold)] pb-1 transition-colors"
            >
              Suara Penjelajah
            </a>
            <a
              href="#kontak"
              className="hover:text-[var(--gold)] pb-1 transition-colors"
            >
              Kontak
            </a>
          </nav>

          {/* Right Action: Wishlist, Login & Peta CTA Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Wishlist / Trip Plan Link */}
            <Link
              href="/peta"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[var(--bx-bg)] hover:bg-[var(--bx-darker)] border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] text-xs font-bold transition flex items-center gap-1.5"
              title="Rute Petualangan (Trip Plan)"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              <span className="hidden md:inline">Rute Saya</span>
              <span className="w-4 h-4 rounded-full bg-[var(--gold)] text-[var(--brand)] text-[10px] font-mono font-bold flex items-center justify-center">
                2
              </span>
            </Link>

            {/* User Session */}
            {authUser ? (
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bx-surface-card)] border border-[var(--gold)]/40 text-[var(--gold)] text-xs font-bold"
                  title={`Masuk sebagai ${authUser.name}`}
                >
                  <UserCheck className="w-4 h-4 text-[var(--gold)] shrink-0" />
                  <span className="max-w-[90px] truncate hidden sm:inline">{authUser.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-[var(--bx-bg)] hover:bg-rose-500/10 border border-[var(--bx-border)] hover:border-rose-400 text-rose-500 transition active:scale-95"
                  title="Keluar"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bx-bg)] hover:bg-[var(--bx-darker)] border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--gold)] font-bold text-xs transition active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Masuk</span>
              </Link>
            )}

            {/* Primary Action Button: Peta Petualangan 🧭 (Matches Traveleo 'Book Now ✈') */}
            <Link
              href="/peta"
              className="portal-submit-btn-gold !h-10 !px-4 !text-xs sm:!text-sm flex items-center gap-2 shrink-0 group shadow-sm"
            >
              <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
              <span className="font-bold">Peta Petualangan</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 3. HERO SECTION (Traveleo Visual Banner with Round Badge) */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex items-center justify-center overflow-hidden">
        {/* Background Scenic Image with Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=2000&q=85"
            alt="Pusaka Kebudayaan Nusantara"
            className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
          />
          {/* Deep Navy/Black Vignette Overlay for High Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/65 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bx-bg)] via-transparent to-black/30" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-16 sm:py-24 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left Text Column */}
          <div className="max-w-2xl text-left space-y-5">
            {/* Tagline Chip with Airplane/Compass */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
              <span>Waktunya Menjelajah Pusaka Nusantara</span>
              <Navigation className="w-3.5 h-3.5 rotate-45 text-[var(--gold)]" />
            </div>

            {/* Massive Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-serif leading-[1.15] tracking-tight">
              Jelajahi Pusaka Nusantara,{" "}
              <span className="block mt-1 font-serif italic text-amber-400">
                Abadikan Makna Budaya
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-normal">
              Temukan keajaiban 18 destinasi budaya terkurasi di Sulawesi Selatan & Lampung.
              Selami tradisi maritim Panrita Lopi, keelokan kain Tapis bertabur emas, serta kearifan leluhur yang abadi.
            </p>

            {/* Action Buttons Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#destinasi"
                className="portal-submit-btn-gold !h-12 !px-6 !text-sm flex items-center gap-2.5 font-bold shadow-lg"
              >
                <span>Eksplor Destinasi</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="h-12 px-5 rounded-xl bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md border border-white/25 hover:border-[var(--gold)] text-white text-sm font-bold transition flex items-center gap-2.5 shadow-md active:scale-95"
              >
                <div className="w-7 h-7 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)] flex items-center justify-center text-[var(--gold)]">
                  <Play className="w-3.5 h-3.5 fill-[var(--gold)]" />
                </div>
                <span>Tanya Bar Hala AI</span>
              </button>
            </div>
          </div>

          {/* Right Floating Badge (Matches Traveleo 'GET UP TO 30% OFF' Badge) */}
          <div className="hidden lg:flex flex-col items-center justify-center shrink-0">
            <div className="relative w-36 h-36 rounded-full bg-slate-950/80 backdrop-blur-xl border-2 border-dashed border-amber-400/80 flex flex-col items-center justify-center text-center p-4 shadow-2xl animate-bounce duration-[3000ms]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                PUSAKA ADAT
              </span>
              <span className="text-3xl font-black text-white font-serif leading-none my-0.5">
                100%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-300">
                OTENTIK & TERJAGA
              </span>
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center text-[var(--brand)] font-black text-xs shadow-md">
                ★
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. OVERLAPPING BOOKING / SEARCH CARD (Traveleo Style) */}
      {/* ======================================================== */}
      <section className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-8 -mt-16 sm:-mt-20">
        <div className="w-full rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] shadow-2xl p-4 sm:p-6 transition-colors">
          {/* Top Category Tabs (Flights, Hotels, Tours, etc.) */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-4 border-b border-[var(--bx-border)] scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setSelectedTab("all");
                setCategoryFilter("all");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${
                selectedTab === "all"
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "bg-[var(--bx-bg)] hover:bg-[var(--bx-darker)] text-[var(--bx-ink)]"
              }`}
            >
              <Compass className="w-4 h-4 text-[var(--gold)]" />
              <span>Semua Destinasi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedTab("laut");
                setCategoryFilter("laut");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${
                selectedTab === "laut"
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "bg-[var(--bx-bg)] hover:bg-[var(--bx-darker)] text-[var(--bx-ink)]"
              }`}
            >
              <Waves className="w-4 h-4 text-cyan-500" />
              <span>Wisata Bahari & Pesisir</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedTab("budaya");
                setCategoryFilter("budaya");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${
                selectedTab === "budaya"
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "bg-[var(--bx-bg)] hover:bg-[var(--bx-darker)] text-[var(--bx-ink)]"
              }`}
            >
              <Landmark className="w-4 h-4 text-amber-500" />
              <span>Desa Adat & Megalitikum</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedTab("hutan");
                setCategoryFilter("hutan");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition ${
                selectedTab === "hutan"
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "bg-[var(--bx-bg)] hover:bg-[var(--bx-darker)] text-[var(--bx-ink)]"
              }`}
            >
              <TreePine className="w-4 h-4 text-emerald-500" />
              <span>Taman Nasional & Hutan</span>
            </button>

            <a
              href="#radar-event"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[var(--bx-bg)] hover:bg-[var(--bx-darker)] text-[var(--bx-ink)] flex items-center gap-2 whitespace-nowrap transition ml-auto"
            >
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>Radar Event Budaya</span>
            </a>
          </div>

          {/* Form Search Row (5 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
            {/* Column 1: Wilayah / Asal */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--bx-muted)] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Pilih Wilayah</span>
              </label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-xs sm:text-sm font-medium text-[var(--bx-ink)] focus:outline-hidden focus:border-[var(--gold)]"
              >
                <option value="all">Semua Wilayah Nusantara</option>
                <option value="sulawesi">Sulawesi Selatan (Bulukumba)</option>
                <option value="lampung">Lampung (Sumatera)</option>
              </select>
            </div>

            {/* Column 2: Kategori Wisata */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--bx-muted)] flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Kategori Tematik</span>
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-xs sm:text-sm font-medium text-[var(--bx-ink)] focus:outline-hidden focus:border-[var(--gold)]"
              >
                <option value="all">Semua Kategori</option>
                <option value="laut">Wisata Bahari & Pesisir</option>
                <option value="budaya">Desa Adat & Tradisi</option>
                <option value="hutan">Hutan & Konservasi</option>
                <option value="gunung">Vulkanik & Pegunungan</option>
                <option value="pertanian">Agrowisata & Perkebunan</option>
              </select>
            </div>

            {/* Column 3: Waktu / Musim */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--bx-muted)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Musim & Jadwal</span>
              </label>
              <select
                value={seasonChoice}
                onChange={(e) => setSeasonChoice(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-xs sm:text-sm font-medium text-[var(--bx-ink)] focus:outline-hidden focus:border-[var(--gold)]"
              >
                <option value="all">Kapan Saja (Fleksibel)</option>
                <option value="festival">Musim Festival Adat (Nov-Des)</option>
                <option value="maritim">Musim Berlayar Pinisi (Cerah)</option>
                <option value="panen">Musim Panen Kopi & Rempah</option>
              </select>
            </div>

            {/* Column 4: Jumlah Penjelajah */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--bx-muted)] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Penjelajah</span>
              </label>
              <select
                value={travelerCount}
                onChange={(e) => setTravelerCount(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-xs sm:text-sm font-medium text-[var(--bx-ink)] focus:outline-hidden focus:border-[var(--gold)]"
              >
                <option value="1">1 Orang (Solo Explorer)</option>
                <option value="2">2 Orang (Pasangan / Sahabat)</option>
                <option value="4">Keluarga (4-5 Orang)</option>
                <option value="10">Rombongan Ekspedisi (10+)</option>
              </select>
            </div>

            {/* Column 5: Search Action Button */}
            <div>
              <a
                href="#destinasi"
                className="portal-submit-btn-gold !h-11 w-full flex items-center justify-center gap-2 !text-sm font-bold shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>Cari Destinasi</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. VALUE PROPOSITION BAR (4 Key Benefits Strip) */}
      {/* ======================================================== */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Benefit 1 */}
          <div className="p-5 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] flex items-start gap-4 shadow-xs transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[var(--gold)] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-[var(--bx-ink-bright)]">
                Data Terverifikasi
              </h2>
              <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                Informasi adat, wastra, dan sejarah divalidasi langsung oleh pemangku adat lokal.
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="p-5 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] flex items-start gap-4 shadow-xs transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-[var(--bx-ink-bright)]">
                24/7 Bar Hala AI
              </h2>
              <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                Asisten cerdas siaga memandu etika berpakaian, pantangan tabu, dan filosofi kebudayaan.
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="p-5 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] flex items-start gap-4 shadow-xs transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-[var(--bx-ink-bright)]">
                Destinasi Terkurasi
              </h2>
              <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                18 destinasi budaya mendalam di Bulukumba & Lampung dengan nilai sejarah tinggi.
              </p>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="p-5 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] flex items-start gap-4 shadow-xs transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 shrink-0">
              <Waves className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-[var(--bx-ink-bright)]">
                Sains BMKG Maritim
              </h2>
              <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                Pemantauan cuaca maritim, suhu, angin, dan tinggi gelombang real-time untuk keamanan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. POPULAR DESTINATIONS GRID (Traveleo Style 5 Cards) */}
      {/* ======================================================== */}
      <section id="destinasi" className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Header Row */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="portal-badge-gold">
                DESTINASI PILIHAN
              </span>
              <span className="text-xs font-mono text-[var(--bx-muted)]">
                ({filteredDestinations.length} Tersedia)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[var(--bx-ink-bright)]">
              Destinasi Budaya Terpopuler
            </h2>
            <p className="text-xs sm:text-sm text-[var(--bx-muted)] max-w-xl">
              Rekomendasi destinasi paling memesona dengan kekayaan sejarah, wastra tradisional, dan filosofi adat di Sulawesi Selatan & Lampung.
            </p>
          </div>

          {/* View All on Map Link */}
          <Link
            href="/peta"
            className="text-xs sm:text-sm font-bold text-[var(--gold)] hover:underline flex items-center gap-1.5 group shrink-0"
          >
            <span>Lihat Semua di Peta Petualangan</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 5-Card Responsive Grid (Turkey, Maldives, Greece, France, Bali layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {filteredDestinations.slice(0, 5).map((dest) => (
            <div
              key={dest.id}
              className="group rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative w-full h-48 overflow-hidden bg-slate-900">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                {/* Province Pill */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/20">
                  {dest.province.includes("Sulawesi") ? "Sulsel" : "Lampung"}
                </span>

                {/* Weather Badge */}
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-mono font-bold flex items-center gap-1">
                  <span>{dest.bmkgStation.temperature}°C</span>
                </span>

                {/* Title & Location on Image Bottom */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[var(--gold)] shrink-0" />
                    <span className="truncate">{dest.subtitle}</span>
                  </p>
                </div>
              </div>

              {/* Card Meta & Action */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5 text-xs text-[var(--bx-muted)]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
                      <span>{dest.tripPackage.duration}</span>
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      BMKG {dest.bmkgStation.safetyStatus}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--bx-ink)] line-clamp-2">
                    {dest.description}
                  </p>
                </div>

                {/* Price & Action Button */}
                <div className="pt-2 border-t border-[var(--bx-border)] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[var(--bx-muted)] block">Estimasi Paket</span>
                    <span className="text-xs sm:text-sm font-bold text-[var(--gold)] font-mono">
                      Rp {dest.tripPackage.priceIdr.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <Link
                    href={`/peta?dest=${dest.id}`}
                    className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-2)] text-white text-xs font-bold transition flex items-center gap-1 shrink-0"
                    title="Buka Langsung di Peta"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Peta</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. SPECIAL OFFER & WHY CHOOSE US (Traveleo Split 2 Columns) */}
      {/* ======================================================== */}
      <section id="mengapa-kami" className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Special Offer Banner (Like 'Adventure Awaits!') */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl bg-slate-950 text-white min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-8 sm:p-10 group">
            {/* Background Adventurer Photo */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
                alt="Petualangan Nusantara"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            {/* Top Badge */}
            <div className="relative z-10">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider">
                Edisi Khusus Budaya
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-serif font-black leading-tight text-white">
                Petualangan Menanti!
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-sm">
                Dapatkan paket kurasi budaya eksklusif untuk rute pelayaran kapal Pinisi Bira dan penjelajahan kaldera Anak Krakatau.
              </p>
              <Link
                href="/peta"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm transition shadow-md active:scale-95"
              >
                <span>Jelajahi Rute Budaya</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Why Choose Us (4 Feature Blocks in 2x2 Grid) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <span className="portal-badge-gold">
                NILAI KEUNGGULAN
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[var(--bx-ink-bright)]">
                Mengapa Memilih Nusa Antara?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--bx-muted)] leading-relaxed">
                Platform penjelajahan budaya geospasial pertama yang memadukan kearifan lokal leluhur dengan kecerdasan buatan dan telemetri sains.
              </p>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Item 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-[var(--gold)]">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[var(--bx-ink-bright)]">
                  Pemandu Budaya Ahli
                </h4>
                <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                  Didampingi pemangku adat dan pembuat kapal Panrita Lopi berpengalaman secara langsung.
                </p>
              </div>

              {/* Item 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-600">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[var(--bx-ink-bright)]">
                  Rencana Rute Terpadu
                </h4>
                <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                  Simpan destinasi favorit dan buat estimasi biaya serta jadwal perjalanan di Trip Plan.
                </p>
              </div>

              {/* Item 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[var(--bx-ink-bright)]">
                  Pengalaman Otentik
                </h4>
                <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                  Terlibat dalam proses menenun Tapis emas, ritual tolak bala laut, dan pembuatan perahu.
                </p>
              </div>

              {/* Item 4 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[var(--bx-ink-bright)]">
                  Dipercaya Penjelajah
                </h4>
                <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                  Telah dinikmati ribuan pelancong dan peneliti kebudayaan dari seluruh penjuru Nusantara.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. TESTIMONIALS (Traveleo 'What Our Travelers Say') */}
      {/* ======================================================== */}
      <section id="ulasan" className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <span className="portal-badge-gold">
              TESTIMONI
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[var(--bx-ink-bright)]">
              Apa Kata Para Penjelajah?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--bx-muted)] max-w-xl">
              Cerita nyata dari penjelajah yang telah menyelami keajaiban adat dan keindahan alam bersama Nusa Antara.
            </p>
          </div>

          <Link
            href="/peta"
            className="text-xs sm:text-sm font-bold text-[var(--gold)] hover:underline flex items-center gap-1.5 group shrink-0"
          >
            <span>Buka Peta Petualangan</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="p-6 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] space-y-4 shadow-xs relative">
            <div className="flex items-center gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Siti Rahmawati"
                className="w-12 h-12 rounded-full object-cover border-2 border-[var(--gold)]"
              />
              <div>
                <h4 className="text-sm font-bold text-[var(--bx-ink-bright)]">
                  Siti Rahmawati
                </h4>
                <p className="text-xs text-[var(--bx-muted)]">Jakarta, Indonesia</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-xs sm:text-sm text-[var(--bx-ink)] leading-relaxed italic">
              "Pengalaman tak terlupakan di Tanjung Bira dan Tana Beru! Melihat langsung proses pembuatan kapal Pinisi dari kayu ulin memberi saya rasa takjub luar biasa terhadap nenek moyang bangsa pelaut."
            </p>
          </div>

          {/* Review 2 */}
          <div className="p-6 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] space-y-4 shadow-xs relative">
            <div className="flex items-center gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="Dr. Hendra Irawan"
                className="w-12 h-12 rounded-full object-cover border-2 border-[var(--gold)]"
              />
              <div>
                <h4 className="text-sm font-bold text-[var(--bx-ink-bright)]">
                  Dr. Hendra Irawan
                </h4>
                <p className="text-xs text-[var(--bx-muted)]">Yogyakarta, Indonesia</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-xs sm:text-sm text-[var(--bx-ink)] leading-relaxed italic">
              "Kawasan Adat Kajang benar-benar membuka mata saya tentang hidup selaras dengan alam. Panduan etika dari Bar Hala AI sangat akurat dan membantu saya mematuhi pantangan lokal."
            </p>
          </div>

          {/* Review 3 */}
          <div className="p-6 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] space-y-4 shadow-xs relative">
            <div className="flex items-center gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                alt="Kadek Ayu Dewi"
                className="w-12 h-12 rounded-full object-cover border-2 border-[var(--gold)]"
              />
              <div>
                <h4 className="text-sm font-bold text-[var(--bx-ink-bright)]">
                  Kadek Ayu Dewi
                </h4>
                <p className="text-xs text-[var(--bx-muted)]">Denpasar, Bali</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-xs sm:text-sm text-[var(--bx-ink)] leading-relaxed italic">
              "Melihat lumba-lumba melompat bebas di Teluk Kiluan saat matahari terbit adalah salah satu momen terindah dalam hidup saya. Integrasi cuaca BMKG di portal membuat perjalanan terasa sangat aman."
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. RADAR EVENT STRIP (Cultural Agenda) */}
      {/* ======================================================== */}
      <section id="radar-event" className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bx-surface)] border border-[var(--bx-border)] shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="portal-badge-gold">
                AGENDA KEBUDAYAAN
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-[var(--bx-ink-bright)] mt-1">
                Radar Event & Festival Tahunan
              </h3>
            </div>
            <Link
              href="/peta"
              className="text-xs font-bold text-[var(--gold)] hover:underline flex items-center gap-1"
            >
              <span>Buka Radar di Peta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CULTURAL_EVENTS.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] hover:border-[var(--gold)] transition-colors space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 font-bold">
                      {event.province}
                    </span>
                    <span className="text-amber-500 font-mono font-bold">
                      H-{event.daysRemaining}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--bx-ink-bright)] line-clamp-1">
                    {event.name}
                  </h4>
                  <p className="text-xs text-[var(--bx-muted)] line-clamp-2">
                    {event.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-[var(--bx-border)] text-[11px] text-[var(--bx-muted)] flex items-center justify-between">
                  <span>{event.dateRange}</span>
                  <Link
                    href="/peta"
                    className="text-[var(--gold)] font-bold hover:underline"
                  >
                    Lokasi →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. NEWSLETTER SUBSCRIBE STRIP (Traveleo Blue Strip) */}
      {/* ======================================================== */}
      <section className="w-full bg-[var(--brand)] text-white py-12 sm:py-16 px-4 sm:px-8 mt-10 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Envelope & Text */}
          <div className="flex items-center gap-5 max-w-xl text-left">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--gold)]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Berlangganan Warta Budaya Nusantara
              </h3>
              <p className="text-xs sm:text-sm text-slate-200">
                Dapatkan info radar festival adat, rute penjelajahan tersembunyi, dan panduan cuaca BMKG langsung di email Anda.
              </p>
            </div>
          </div>

          {/* Right: Email Input & Submit Button */}
          <form
            onSubmit={handleNewsletterSubmit}
            className="w-full lg:max-w-md flex flex-col sm:flex-row items-center gap-2.5"
          >
            <div className="relative w-full">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Masukkan alamat email Anda..."
                required
                className="w-full h-12 px-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[var(--gold)]"
              />
            </div>
            <button
              type="submit"
              className="portal-submit-btn-gold !h-12 w-full sm:w-auto px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shrink-0 shadow-md"
            >
              <span>Langganan</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {newsletterSubscribed && (
          <div className="max-w-7xl mx-auto mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs text-center font-bold">
            ✓ Terima kasih! Anda telah terdaftar dalam buletin Warta Budaya Nusa Antara.
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 11. MEGA FOOTER (Traveleo 5 Columns on Deep Navy) */}
      {/* ======================================================== */}
      <footer id="kontak" className="w-full bg-[#071E38] text-slate-300 pt-16 pb-8 px-4 sm:px-8 border-t border-[var(--gold)]/20">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* 5-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
            {/* Col 1: Brand & Socials */}
            <div className="space-y-4 lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <img
                  src="/mandala.png"
                  alt="Mandala Logo"
                  className="w-9 h-9 object-contain"
                />
                <span className="text-xl font-bold font-serif text-white tracking-tight">
                  NUSA ANTARA
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mitra penjelajahan budaya terpercaya untuk merawat warisan kearifan lokal Nusantara melalui integrasi geospasial dan kecerdasan buatan.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[var(--gold)]/20 text-slate-200 hover:text-[var(--gold)] flex items-center justify-center transition cursor-pointer text-xs font-bold">
                  FB
                </span>
                <span className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[var(--gold)]/20 text-slate-200 hover:text-[var(--gold)] flex items-center justify-center transition cursor-pointer text-xs font-bold">
                  IG
                </span>
                <span className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[var(--gold)]/20 text-slate-200 hover:text-[var(--gold)] flex items-center justify-center transition cursor-pointer text-xs font-bold">
                  X
                </span>
                <span className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[var(--gold)]/20 text-slate-200 hover:text-[var(--gold)] flex items-center justify-center transition cursor-pointer text-xs font-bold">
                  YT
                </span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
                Tautan Cepat
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/" className="hover:text-[var(--gold)] transition-colors">
                    Beranda Portal
                  </Link>
                </li>
                <li>
                  <Link href="/peta" className="hover:text-[var(--gold)] transition-colors">
                    Peta Petualangan
                  </Link>
                </li>
                <li>
                  <a href="#destinasi" className="hover:text-[var(--gold)] transition-colors">
                    Destinasi Terkurasi
                  </a>
                </li>
                <li>
                  <a href="#radar-event" className="hover:text-[var(--gold)] transition-colors">
                    Radar Event Budaya
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(true)}
                    className="hover:text-[var(--gold)] transition-colors text-left"
                  >
                    Asisten Bar Hala AI
                  </button>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[var(--gold)] transition-colors">
                    Masuk / Autentikasi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Destinasi Unggulan */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
                Destinasi Favorit
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/peta?dest=bulukumba-bira" className="hover:text-[var(--gold)] transition-colors">
                    Pantai Tanjung Bira
                  </Link>
                </li>
                <li>
                  <Link href="/peta?dest=bulukumba-tana-beru" className="hover:text-[var(--gold)] transition-colors">
                    Tana Beru Galangan Pinisi
                  </Link>
                </li>
                <li>
                  <Link href="/peta?dest=bulukumba-ammatoa-kajang" className="hover:text-[var(--gold)] transition-colors">
                    Kawasan Adat Ammatoa Kajang
                  </Link>
                </li>
                <li>
                  <Link href="/peta?dest=lampung-way-kambas" className="hover:text-[var(--gold)] transition-colors">
                    Taman Nasional Way Kambas
                  </Link>
                </li>
                <li>
                  <Link href="/peta?dest=lampung-kiluan" className="hover:text-[var(--gold)] transition-colors">
                    Teluk Kiluan Lumba-lumba
                  </Link>
                </li>
                <li>
                  <Link href="/peta?dest=lampung-krakatau" className="hover:text-[var(--gold)] transition-colors">
                    Kaldera Gunung Krakatau
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Panduan Budaya */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
                Panduan Penjelajah
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <span className="hover:text-[var(--gold)] transition-colors cursor-pointer">
                    Etika & Busana Adat
                  </span>
                </li>
                <li>
                  <span className="hover:text-[var(--gold)] transition-colors cursor-pointer">
                    Pantangan Tabu Lokal
                  </span>
                </li>
                <li>
                  <span className="hover:text-[var(--gold)] transition-colors cursor-pointer">
                    Telemetri Maritim BMKG
                  </span>
                </li>
                <li>
                  <span className="hover:text-[var(--gold)] transition-colors cursor-pointer">
                    Filosofi Wastra & Tapis
                  </span>
                </li>
                <li>
                  <span className="hover:text-[var(--gold)] transition-colors cursor-pointer">
                    FAQ Penjelajahan
                  </span>
                </li>
              </ul>
            </div>

            {/* Col 5: Support & Contact */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
                Layanan & Kemitraan
              </h4>
              <div className="space-y-2 text-xs">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>+62 812-3456-7890</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>info@nusa-antara.id</span>
                </p>
                <p className="text-[11px] text-slate-300">
                  Senin - Minggu: 08.00 - 20.00 WITA
                </p>
              </div>

              {/* Data Partner Badges */}
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] text-slate-300 font-mono uppercase block">
                  Mitra Data Sains:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-emerald-300 border border-emerald-400/30">
                    BMKG SATU PETA
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-amber-300 border border-amber-400/30">
                    OpenStreetMap
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
            <p>© 2026 Nusa Antara. Seluruh Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-white transition-colors cursor-pointer">
                Syarat & Ketentuan
              </span>
              <span>•</span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Kebijakan Privasi
              </span>
              <span>•</span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Pedoman Etika Adat
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* 12. BAR HALA AI MODAL / DRAWER */}
      {/* ======================================================== */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 bg-[var(--brand)] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 p-1 flex items-center justify-center">
                  <BarongAvatar size={34} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base leading-tight">
                    Bar Hala AI
                  </h3>
                  <p className="text-[11px] text-amber-300">
                    Asisten Cerdas Adat & Wisata Geospasial
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt Chips */}
            <div className="p-3 bg-[var(--bx-bg)] border-b border-[var(--bx-border)] flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
              <button
                type="button"
                onClick={() => handleSendAiMessage("Bagaimana etika saat berkunjung ke Desa Adat Kajang Bulukumba?")}
                className="px-2.5 py-1 rounded-full bg-[var(--bx-surface)] hover:bg-[var(--gold)]/15 border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] whitespace-nowrap transition"
              >
                Etika Adat Kajang
              </button>
              <button
                type="button"
                onClick={() => handleSendAiMessage("Apa makna filosofis kain Tapis Lampung?")}
                className="px-2.5 py-1 rounded-full bg-[var(--bx-surface)] hover:bg-[var(--gold)]/15 border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] whitespace-nowrap transition"
              >
                Makna Wastra Tapis
              </button>
              <button
                type="button"
                onClick={() => handleSendAiMessage("Bagaimana tradisi pembuatan perahu Pinisi di Tana Beru?")}
                className="px-2.5 py-1 rounded-full bg-[var(--bx-surface)] hover:bg-[var(--gold)]/15 border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] whitespace-nowrap transition"
              >
                Pembuatan Pinisi
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-80">
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[var(--gold)] text-[var(--brand)] font-semibold rounded-br-none shadow-xs"
                        : "bg-[var(--bx-bg)] border border-[var(--bx-border)] text-[var(--bx-ink)] rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-[var(--bx-surface)] border-t border-[var(--bx-border)] flex items-center gap-2">
              <input
                type="text"
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()}
                placeholder="Tanyakan etika, wastra, atau rute..."
                className="flex-1 h-10 px-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-xs text-[var(--bx-ink)] focus:outline-hidden focus:border-[var(--gold)]"
              />
              <button
                type="button"
                onClick={() => handleSendAiMessage()}
                className="portal-submit-btn-gold !h-10 !px-3.5 !text-xs font-bold"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
