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
  ChevronDown,
  ArrowRight,
  Star,
  User,
  LogIn,
  LogOut,
  Play,
  Send,
  Check,
  X,
  Clock,
  Navigation,
  Award,
  Plane,
  Home,
  SlidersHorizontal,
} from "lucide-react";
import { DESTINATIONS, CulturalDestination, Category } from "@/data/destinations";
import { CULTURAL_EVENTS, CulturalEvent } from "@/data/culturalEvents";
import { AUDIO_TRACKS, AudioTrack } from "@/data/audioTracks";
import { BarongAvatar } from "@/components/hud/BarongAvatar";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import {
  getStoredLanguage,
  subscribeLanguage,
  DICTIONARY,
  DESTINATION_TRANSLATIONS_EN,
  EVENT_TRANSLATIONS_EN,
  Language,
} from "@/lib/i18n";
import { getStoredUser, subscribeAuth, clearStoredUser, AuthUser } from "@/lib/auth";

export default function PortalLandingPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Language state (defaults to "EN" with instant toggle to "ID")
  const [lang, setLang] = useState<Language>("EN");

  // Province Selection & Content Filtering State
  const [selectedProvince, setSelectedProvince] = useState<"all" | "sulawesi" | "lampung">("all");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [travelerCount, setTravelerCount] = useState<string>("2");
  const [seasonChoice, setSeasonChoice] = useState<string>("all");

  // Bar Hala AI Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    {
      sender: "ai",
      text: DICTIONARY.EN.aiModal.greeting,
    },
  ]);
  const [aiInputText, setAiInputText] = useState("");

  // Audio preview state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filter Dropdown state (in Header)
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);

  // Profile Dropdown state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);

  // Sync language with persistent store
  useEffect(() => {
    setLang(getStoredLanguage());
    const unsub = subscribeLanguage((newLang) => {
      setLang(newLang);
    });
    return unsub;
  }, []);

  // Update initial AI greeting when language changes (if conversation hasn't started)
  useEffect(() => {
    setAiChatMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            sender: "ai",
            text: DICTIONARY[lang].aiModal.greeting,
          },
        ];
      }
      return prev;
    });
  }, [lang]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

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

  const handleLogout = () => {
    clearStoredUser();
  };

  // Active translation dictionary
  const t = DICTIONARY[lang];

  // Filtered destinations based on active Province & Category filters
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      // Province filter (from Header session & Search Box)
      if (selectedProvince === "sulawesi" && !d.province.toLowerCase().includes("sulawesi")) return false;
      if (selectedProvince === "lampung" && !d.province.toLowerCase().includes("lampung")) return false;

      // Category filter
      if (categoryFilter !== "all") {
        if (categoryFilter === "laut" && d.category !== "laut" && d.category !== "pantai") return false;
        if (categoryFilter === "budaya" && d.category !== "budaya" && d.category !== "desa" && d.category !== "pakaian") return false;
        if (categoryFilter === "hutan" && d.category !== "hutan" && d.category !== "gunung") return false;
        if (categoryFilter !== "laut" && categoryFilter !== "budaya" && categoryFilter !== "hutan" && d.category !== categoryFilter) return false;
      }

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
  }, [selectedProvince, categoryFilter, searchKeyword]);

  // Filtered Cultural Events based on active Province
  const filteredEvents = useMemo(() => {
    return CULTURAL_EVENTS.filter((event) => {
      if (selectedProvince === "sulawesi" && !event.province.toLowerCase().includes("sulawesi")) return false;
      if (selectedProvince === "lampung" && !event.province.toLowerCase().includes("lampung")) return false;
      return true;
    });
  }, [selectedProvince]);

  // Testimonials dynamically reflecting active Province & Language
  const testimonials = useMemo(() => {
    const allReviews =
      lang === "EN"
        ? [
            {
              id: "rev-bira",
              name: "Siti Rahmawati",
              location: "Jakarta, Indonesia",
              avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
              province: "sulawesi",
              highlight: "Tanjung Bira Beach & Tana Beru",
              text: "An unforgettable experience in Tanjung Bira and Tana Beru! Seeing the Pinisi shipbuilding process directly from ironwood gave me immense reverence for our ancestral mariners.",
            },
            {
              id: "rev-kajang",
              name: "Dr. Hendra Irawan",
              location: "Yogyakarta, Indonesia",
              avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
              province: "sulawesi",
              highlight: "Ammatoa Kajang Indigenous Area",
              text: "The Kajang Indigenous Area truly opened my eyes to living in harmony with nature. Bar Hala AI's cultural guidance was remarkably accurate in respecting local taboos.",
            },
            {
              id: "rev-kiluan",
              name: "Kadek Ayu Dewi",
              location: "Denpasar, Bali",
              avatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
              province: "lampung",
              highlight: "Kiluan Bay & Sunda Strait",
              text: "Watching wild dolphins leap freely in Kiluan Bay at sunrise was one of the most magical moments of my life. The BMKG weather integration on the portal made the voyage feel completely safe.",
            },
            {
              id: "rev-waykambas",
              name: "Bambang Sudiro",
              location: "Bandung, West Java",
              avatar:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
              province: "lampung",
              highlight: "Way Kambas NP & Tapis Weaving",
              text: "Way Kambas wildlife sanctuary and the majesty of gold Tapis weaving in Lampung are truly world-class. Exploring with Nusa Antara was remarkably well-guided thanks to verified data.",
            },
          ]
        : [
            {
              id: "rev-bira",
              name: "Siti Rahmawati",
              location: "Jakarta, Indonesia",
              avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
              province: "sulawesi",
              highlight: "Pantai Tanjung Bira & Tana Beru",
              text: "Pengalaman tak terlupakan di Tanjung Bira dan Tana Beru! Melihat langsung proses pembuatan kapal Pinisi dari kayu ulin memberi saya rasa takjub luar biasa terhadap nenek moyang bangsa pelaut.",
            },
            {
              id: "rev-kajang",
              name: "Dr. Hendra Irawan",
              location: "Yogyakarta, Indonesia",
              avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
              province: "sulawesi",
              highlight: "Kawasan Adat Ammatoa Kajang",
              text: "Kawasan Adat Kajang benar-benar membuka mata saya tentang hidup selaras dengan alam. Panduan etika dari Bar Hala AI sangat akurat dan membantu saya mematuhi pantangan lokal.",
            },
            {
              id: "rev-kiluan",
              name: "Kadek Ayu Dewi",
              location: "Denpasar, Bali",
              avatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
              province: "lampung",
              highlight: "Teluk Kiluan & Selat Sunda",
              text: "Melihat lumba-lumba melompat bebas di Teluk Kiluan saat matahari terbit adalah salah satu momen terindah dalam hidup saya. Integrasi cuaca BMKG di portal membuat perjalanan terasa sangat aman.",
            },
            {
              id: "rev-waykambas",
              name: "Bambang Sudiro",
              location: "Bandung, Jawa Barat",
              avatar:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
              province: "lampung",
              highlight: "TN Way Kambas & Tenun Tapis",
              text: "Konservasi Way Kambas dan keagungan tenun Tapis Negeri Katon di Lampung sungguh berkelas dunia. Eksplorasi bersama Nusa Antara sangat terarah berkat data terverifikasi.",
            },
          ];

    if (selectedProvince === "sulawesi") {
      return allReviews.filter((r) => r.province === "sulawesi");
    }
    if (selectedProvince === "lampung") {
      return allReviews.filter((r) => r.province === "lampung");
    }
    return allReviews.slice(0, 3);
  }, [selectedProvince, lang]);

  const handleSendAiMessage = (customText?: string) => {
    const textToSend = customText || aiInputText;
    if (!textToSend.trim()) return;

    const newMessages = [...aiChatMessages, { sender: "user" as const, text: textToSend }];
    setAiChatMessages(newMessages);
    if (!customText) setAiInputText("");

    setTimeout(() => {
      let reply = lang === "EN" ? "That is a fascinating inquiry! " : "Pertanyaan Anda sangat menarik! ";
      const lower = textToSend.toLowerCase();

      if (
        lower.includes("bira") ||
        lower.includes("beach") ||
        lower.includes("pantai") ||
        lower.includes("laut") ||
        lower.includes("sea")
      ) {
        reply +=
          lang === "EN"
            ? "Tanjung Bira Beach in Bulukumba is famed for flour-like white sand and three-tone ocean hues. Modest dress is warmly advised when strolling through nearby coastal fishing settlements."
            : "Pantai Tanjung Bira di Bulukumba terkenal dengan pasir sehalus tepung dan air bergradasi tiga warna. Disarankan memakai pakaian santun saat berada di perkampungan warga sekitar pesisir.";
      } else if (
        lower.includes("pinisi") ||
        lower.includes("tana beru") ||
        lower.includes("ship") ||
        lower.includes("boat") ||
        lower.includes("kapal")
      ) {
        reply +=
          lang === "EN"
            ? "Tana Beru is the world-renowned center of UNESCO Pinisi shipbuilding. You can witness master Panrita Lopi carving ironwood hulls by hand without written blueprints."
            : "Tana Beru adalah pusat galangan perahu Pinisi UNESCO. Anda dapat menyaksikan Panrita Lopi memahat lambung kapal kayu ulin tanpa gambar teknik rancang bangun tertulis.";
      } else if (
        lower.includes("kajang") ||
        lower.includes("ammatoa") ||
        lower.includes("black") ||
        lower.includes("hitam")
      ) {
        reply +=
          lang === "EN"
            ? "In the Ammatoa Kajang Indigenous Area, strict rules mandate wearing solid black clothing (Passapu and black sarong), walking barefoot, and prohibiting electronic devices or motorized vehicles."
            : "Di Kawasan Adat Ammatoa Kajang, berlaku aturan mutlak berpakaian serba hitam (Passapu dan sarung hitam), dilarang membawa alas kaki, kamera elektronik, dan kendaraan bermotor.";
      } else if (
        lower.includes("kambas") ||
        lower.includes("elephant") ||
        lower.includes("gajah") ||
        lower.includes("lampung")
      ) {
        reply +=
          lang === "EN"
            ? "Way Kambas National Park in Lampung is a sanctuary for endangered Sumatran elephants and rhinos. The best visiting time is early morning when elephants roam the cool savanna."
            : "Taman Nasional Way Kambas di Lampung adalah suaka gajah Sumatera dan badak Sumatera. Waktu kunjungan terbaik adalah pagi hari saat cuaca sejuk dan gajah beraktivitas di sabana.";
      } else if (
        lower.includes("tapis") ||
        lower.includes("textile") ||
        lower.includes("wastra") ||
        lower.includes("kain")
      ) {
        reply +=
          lang === "EN"
            ? "Lampung Tapis cloth is hand-embroidered with pure gold threads featuring bamboo shoot (pucuk rebung) or ship motifs. It symbolizes dignity and customary purity in Saibatin and Pepadun traditions."
            : "Kain Tapis Lampung disulam dengan benang emas motif pucuk rebung atau kapal jung sariat. Melambangkan keagungan martabat dan kesucian adat Saibatin serta Pepadun.";
      } else {
        reply +=
          lang === "EN"
            ? "Ancestral wisdom in Bulukumba and Lampung emphasizes deep respect for mother nature and indigenous elders. Feel free to explore specific heritage sites on the Adventure Map!"
            : "Kearifan lokal di Bulukumba dan Lampung menekankan penghormatan terhadap alam semesta dan tetua adat. Silakan jelajahi titik-titik lokasi langsung melalui Peta Petualangan!";
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

  const getFilterButtonLabel = () => {
    if (selectedProvince === "all" && categoryFilter === "all") {
      return t.nav.allProvinces;
    }
    const provLabel =
      selectedProvince === "sulawesi"
        ? lang === "ID"
          ? "Sulsel"
          : "Sulawesi"
        : selectedProvince === "lampung"
        ? "Lampung"
        : "";

    const catLabel =
      categoryFilter === "laut"
        ? lang === "ID"
          ? "Bahari"
          : "Marine"
        : categoryFilter === "budaya"
        ? lang === "ID"
          ? "Budaya"
          : "Culture"
        : categoryFilter === "hutan"
        ? lang === "ID"
          ? "Hutan"
          : "Forest"
        : "";

    if (provLabel && catLabel) return `${provLabel} • ${catLabel}`;
    if (provLabel) return selectedProvince === "sulawesi" ? t.nav.sulawesi : t.nav.lampung;
    if (catLabel) return catLabel;
    return t.nav.allProvinces;
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans bg-[var(--bx-bg)] text-[var(--bx-ink)] selection:bg-[var(--gold)] selection:text-[var(--brand)]">

      {/* ======================================================== */}
      {/* 2. MAIN NAVIGATION HEADER (Institutional Sticky Navbar) */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 w-full bg-[var(--bx-surface)]/95 backdrop-blur-md border-b border-[var(--bx-border)] px-4 sm:px-8 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Brand Identity (Tanpa Kotak, Gambar Murni) */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <img
              src="/mandala.png"
              alt="Logo Mandala Nusa Antara"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain transition-transform duration-500 group-hover:rotate-45"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--bx-ink-bright)] font-serif leading-none">
                  NUSA ANTARA
                </span>
                <span className="portal-badge-portal !text-[10px]">
                  PORTAL
                </span>
              </div>
              <span className="text-[11px] text-[var(--bx-muted)] font-medium hidden md:inline-block">
                {t.nav.brandSub}
              </span>
            </div>
          </Link>

          {/* Right Action: Filter Dropdown + Language/Theme + Peta Petualangan + Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Filter Dropdown (Wilayah & Kategori) */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
                className="h-10 px-2.5 sm:px-3 rounded-xl bg-[var(--bx-bg)] hover:bg-[var(--gold)]/10 border border-[var(--bx-border)] hover:border-[var(--gold)]/60 text-[var(--bx-ink)] transition-all flex items-center gap-1.5 sm:gap-2 shadow-xs group"
                title={lang === "ID" ? "Filter Destinasi" : "Filter Destinations"}
                aria-label={lang === "ID" ? "Filter Destinasi" : "Filter Destinations"}
              >
                <div className="w-6 h-6 rounded-lg bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--gold)]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--gold)] leading-none hidden sm:block">
                    {lang === "ID" ? "Filter" : "Filter"}
                  </span>
                  <span className="text-xs sm:text-sm font-bold font-serif text-[var(--bx-ink-bright)] leading-tight truncate max-w-[85px] sm:max-w-[130px] xl:max-w-none">
                    {getFilterButtonLabel()}
                  </span>
                </div>
                {(selectedProvince !== "all" || categoryFilter !== "all") && (
                  <span className="w-2 h-2 rounded-full bg-[var(--gold)] shrink-0 animate-pulse" />
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[var(--bx-muted)] transition-transform duration-200 shrink-0 ${
                    isFilterDropdownOpen ? "rotate-180 text-[var(--gold)]" : "group-hover:text-[var(--gold)]"
                  }`}
                />
              </button>

              {/* Dropdown Menu Filter */}
              {isFilterDropdownOpen && (
                <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-76 sm:w-88 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-2 py-2 border-b border-[var(--bx-border)] mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--gold)]" />
                      <span className="text-[11px] uppercase font-bold tracking-wider text-[var(--gold)] font-mono">
                        {lang === "ID" ? "Filter Destinasi" : "Destination Filter"}
                      </span>
                    </div>
                    {(selectedProvince !== "all" || categoryFilter !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProvince("all");
                          setCategoryFilter("all");
                        }}
                        className="text-[11px] text-[var(--gold)] hover:underline font-semibold"
                      >
                        {lang === "ID" ? "Reset Semua" : "Reset All"}
                      </button>
                    )}
                  </div>

                  {/* Section 1: Wilayah / Provinsi */}
                  <div className="mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--bx-muted)] px-2 mb-1 block">
                      {lang === "ID" ? "Pilih Provinsi" : "Select Province"}
                    </span>
                    <div className="space-y-1">
                      {/* Option 1: Semua Provinsi */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProvince("all");
                          setIsFilterDropdownOpen(false);
                          const el = document.getElementById("destinasi");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`w-full p-2 rounded-xl text-left transition flex items-center justify-between gap-2.5 ${
                          selectedProvince === "all"
                            ? "bg-[var(--gold)]/15 border border-[var(--gold)]/60 text-[var(--bx-ink-bright)] font-semibold"
                            : "hover:bg-[var(--bx-bg)] text-[var(--bx-ink)] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0">🇮🇩</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate font-serif">{t.nav.allProvinces}</p>
                            <p className="text-[10px] text-[var(--bx-muted)] truncate">{t.nav.allProvincesSub}</p>
                          </div>
                        </div>
                        {selectedProvince === "all" && (
                          <Check className="w-4 h-4 text-[var(--gold)] shrink-0" />
                        )}
                      </button>

                      {/* Option 2: Sulawesi Selatan */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProvince("sulawesi");
                          setIsFilterDropdownOpen(false);
                          const el = document.getElementById("destinasi");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`w-full p-2 rounded-xl text-left transition flex items-center justify-between gap-2.5 ${
                          selectedProvince === "sulawesi"
                            ? "bg-[var(--gold)]/15 border border-[var(--gold)]/60 text-[var(--bx-ink-bright)] font-semibold"
                            : "hover:bg-[var(--bx-bg)] text-[var(--bx-ink)] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0">⛵</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate font-serif">{t.nav.sulawesi}</p>
                            <p className="text-[10px] text-[var(--bx-muted)] truncate">{t.nav.sulawesiSub}</p>
                          </div>
                        </div>
                        {selectedProvince === "sulawesi" && (
                          <Check className="w-4 h-4 text-[var(--gold)] shrink-0" />
                        )}
                      </button>

                      {/* Option 3: Lampung */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProvince("lampung");
                          setIsFilterDropdownOpen(false);
                          const el = document.getElementById("destinasi");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`w-full p-2 rounded-xl text-left transition flex items-center justify-between gap-2.5 ${
                          selectedProvince === "lampung"
                            ? "bg-[var(--gold)]/15 border border-[var(--gold)]/60 text-[var(--bx-ink-bright)] font-semibold"
                            : "hover:bg-[var(--bx-bg)] text-[var(--bx-ink)] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0">🌋</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate font-serif">{t.nav.lampung}</p>
                            <p className="text-[10px] text-[var(--bx-muted)] truncate">{t.nav.lampungSub}</p>
                          </div>
                        </div>
                        {selectedProvince === "lampung" && (
                          <Check className="w-4 h-4 text-[var(--gold)] shrink-0" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Section 2: Kategori Wisata */}
                  <div className="pt-2 border-t border-[var(--bx-border)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--bx-muted)] px-2 mb-1 block">
                      {lang === "ID" ? "Kategori Wisata" : "Travel Category"}
                    </span>
                    <div className="grid grid-cols-2 gap-1">
                      {/* Semua Kategori */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryFilter("all");
                          setIsFilterDropdownOpen(false);
                          const el = document.getElementById("destinasi");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`p-2 rounded-xl text-left transition flex items-center justify-between gap-1.5 ${
                          categoryFilter === "all"
                            ? "bg-[var(--gold)]/15 border border-[var(--gold)]/60 text-[var(--bx-ink-bright)] font-semibold"
                            : "hover:bg-[var(--bx-bg)] text-[var(--bx-ink)] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Compass className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                          <span className="text-xs font-medium truncate">{lang === "ID" ? "Semua" : "All"}</span>
                        </div>
                        {categoryFilter === "all" && <Check className="w-3 h-3 text-[var(--gold)] shrink-0" />}
                      </button>

                      {/* Bahari */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryFilter("laut");
                          setIsFilterDropdownOpen(false);
                          const el = document.getElementById("destinasi");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`p-2 rounded-xl text-left transition flex items-center justify-between gap-1.5 ${
                          categoryFilter === "laut"
                            ? "bg-cyan-500/15 border border-cyan-500/60 text-cyan-600 dark:text-cyan-400 font-semibold"
                            : "hover:bg-[var(--bx-bg)] text-[var(--bx-ink)] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Waves className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span className="text-xs font-medium truncate">{lang === "ID" ? "Bahari" : "Marine"}</span>
                        </div>
                        {categoryFilter === "laut" && <Check className="w-3 h-3 text-cyan-500 shrink-0" />}
                      </button>

                      {/* Budaya */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryFilter("budaya");
                          setIsFilterDropdownOpen(false);
                          const el = document.getElementById("destinasi");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`p-2 rounded-xl text-left transition flex items-center justify-between gap-1.5 ${
                          categoryFilter === "budaya"
                            ? "bg-amber-500/15 border border-amber-500/60 text-amber-600 dark:text-amber-400 font-semibold"
                            : "hover:bg-[var(--bx-bg)] text-[var(--bx-ink)] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Landmark className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="text-xs font-medium truncate">{lang === "ID" ? "Budaya" : "Culture"}</span>
                        </div>
                        {categoryFilter === "budaya" && <Check className="w-3 h-3 text-amber-500 shrink-0" />}
                      </button>

                      {/* Hutan */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryFilter("hutan");
                          setIsFilterDropdownOpen(false);
                          const el = document.getElementById("destinasi");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`p-2 rounded-xl text-left transition flex items-center justify-between gap-1.5 ${
                          categoryFilter === "hutan"
                            ? "bg-emerald-500/15 border border-emerald-500/60 text-emerald-600 dark:text-emerald-400 font-semibold"
                            : "hover:bg-[var(--bx-bg)] text-[var(--bx-ink)] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <TreePine className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-xs font-medium truncate">{lang === "ID" ? "Hutan" : "Forest"}</span>
                        </div>
                        {categoryFilter === "hutan" && <Check className="w-3 h-3 text-emerald-500 shrink-0" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-[var(--bx-border)] hidden sm:block" />

            {/* Language & Theme Mode Toggles */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            {/* Primary Action Button: Peta Petualangan 🧭 */}
            <Link
              href="/peta"
              className="portal-submit-btn-gold !h-10 !px-3 sm:!px-4 !text-xs sm:!text-sm flex items-center gap-1.5 sm:gap-2 shrink-0 group shadow-sm"
              title={t.nav.interactiveMap}
            >
              <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
              <span className="font-bold hidden sm:inline">{t.nav.adventureMap}</span>
              <span className="font-bold sm:hidden">{t.nav.mapShort}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 hidden sm:inline" />
            </Link>

            {/* Avatar Profile Button with Dropdown (Paling Kanan) */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--gold)]/60 hover:border-[var(--gold)] bg-[var(--bx-bg)] p-0.5 transition-all shadow-xs hover:scale-105 active:scale-95 focus:outline-hidden"
                title={authUser ? `Profil: ${authUser.name}` : t.nav.guestUser}
                aria-label="User Profile Menu"
              >
                {authUser?.avatar ? (
                  <img
                    src={authUser.avatar}
                    alt={authUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : authUser ? (
                  <div className="w-full h-full rounded-full bg-[var(--gold)]/20 text-[var(--gold)] font-bold text-xs flex items-center justify-center font-serif">
                    {authUser.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-[var(--bx-surface)] text-[var(--bx-muted)] hover:text-[var(--gold)] flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                )}
                {authUser && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bx-surface)]" />
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-72 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Profile Info Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[var(--bx-border)]">
                    <div className="w-11 h-11 rounded-full border border-[var(--gold)]/50 overflow-hidden bg-[var(--bx-bg)] flex items-center justify-center shrink-0">
                      {authUser?.avatar ? (
                        <img src={authUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <img src="/mandala.png" alt="Mandala" className="w-7 h-7 object-contain opacity-90" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--bx-ink-bright)] truncate font-serif">
                        {authUser ? authUser.name : t.nav.guestUser}
                      </p>
                      <p className="text-xs text-[var(--bx-muted)] truncate">
                        {authUser ? authUser.phone || authUser.email || "Explorer" : t.nav.notLoggedIn}
                      </p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          authUser
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                            : "bg-[var(--bx-bg)] text-[var(--bx-muted)]"
                        }`}
                      >
                        {authUser ? t.nav.activeSession : t.nav.guestMode}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Quick Navigation */}
                  <div className="py-2.5 space-y-1">
                    <Link
                      href="/peta"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-[var(--bx-ink)] hover:text-[var(--gold)] hover:bg-[var(--bx-bg)] transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className="w-4 h-4 text-[var(--gold)]" />
                        <span>{t.nav.interactiveMap}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--bx-muted)] group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsAiModalOpen(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-[var(--bx-ink)] hover:text-[var(--gold)] hover:bg-[var(--bx-bg)] transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bot className="w-4 h-4 text-emerald-500" />
                        <span>{t.nav.consultAi}</span>
                      </div>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                  </div>

                  {/* Dropdown Footer: Logout / Login */}
                  <div className="pt-2.5 border-t border-[var(--bx-border)]">
                    {authUser ? (
                      <button
                        type="button"
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-400/30 transition flex items-center gap-2 active:scale-95"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t.nav.logout}</span>
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="portal-submit-btn-gold !h-9 !text-xs w-full flex items-center justify-center gap-2"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>{t.nav.login}</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2b. MAIN MENU ROW (Menu Utama Navigasi di Bawah Logo) */}
      {/* ======================================================== */}
      <div className="sticky top-18 sm:top-20 z-30 w-full bg-[var(--bx-surface)]/95 backdrop-blur-md border-b border-[var(--bx-border)] px-4 sm:px-8 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto h-11 sm:h-12 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold whitespace-nowrap">
            {/* Beranda */}
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-[var(--gold)] font-bold bg-[var(--gold)]/10 border border-[var(--gold)]/40 shadow-xs"
            >
              <Home className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{t.nav.home}</span>
            </Link>

            {/* Destinasi Budaya */}
            <a
              href="#destinasi"
              className="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 text-[var(--bx-ink)] border border-transparent hover:border-[var(--gold)]/30"
            >
              <Compass className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{t.nav.destinations}</span>
            </a>

            {/* Radar Event & Festival */}
            <a
              href="#radar-event"
              className="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 text-[var(--bx-ink)] border border-transparent hover:border-[var(--gold)]/30"
            >
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>{t.nav.eventRadar}</span>
            </a>

            {/* Bar Hala AI */}
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 text-[var(--bx-ink)] border border-transparent hover:border-[var(--gold)]/30"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.nav.barHalaAi}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Keunggulan */}
            <a
              href="#mengapa-kami"
              className="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 text-[var(--bx-ink)] border border-transparent hover:border-[var(--gold)]/30"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.nav.highlights}</span>
            </a>

            {/* Suara Penjelajah */}
            <a
              href="#ulasan"
              className="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 text-[var(--bx-ink)] border border-transparent hover:border-[var(--gold)]/30"
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.nav.testimonials}</span>
            </a>

            {/* Kontak & Informasi */}
            <a
              href="#kontak"
              className="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 text-[var(--bx-ink)] border border-transparent hover:border-[var(--gold)]/30"
            >
              <Phone className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{t.nav.contact}</span>
            </a>
          </nav>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. HERO SECTION (Fit Height, 60% Left Column, Tanpa Shading Kelap-Kelip) */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-[calc(100dvh-7.5rem)] lg:h-[calc(100dvh-7.5rem)] flex items-center justify-center overflow-hidden">
        {/* Background Scenic Image (Solid & Statis, Tanpa Shading Kelap-Kelip) */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=2000&q=85"
            alt="Pusaka Kebudayaan Nusantara"
            className="w-full h-full object-cover object-center"
          />
          {/* Deep Navy/Black Statis Vignette Overlay untuk Kontras & Keterbacaan Teks */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bx-bg)] via-transparent to-black/25" />
        </div>

        {/* Hero Content Container (Left-Aligned, Kolom Kiri 60% Lebar) */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-16 flex items-center justify-start">
          {/* Left Text Column: 60% Width */}
          <div className="w-full lg:w-[60%] text-left space-y-5 sm:space-y-6">
            {/* Tagline / Badge: "Time To Explore" with Flight Path & Airplane */}
            <div className="inline-flex items-center gap-2 select-none pt-1">
              <span className="font-handwriting text-2xl sm:text-3xl text-white font-medium tracking-wide -rotate-2 inline-block drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                {t.hero.tagline}
              </span>
              <div className="flex items-center -mt-1 pl-0.5 text-white/90">
                <svg
                  className="w-12 sm:w-16 h-5 overflow-visible text-white/80"
                  viewBox="0 0 52 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 15 C 16 15, 30 11, 46 3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeDasharray="2.5 3"
                    strokeLinecap="round"
                  />
                </svg>
                <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-white rotate-45 -ml-1 fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
              </div>
            </div>

            {/* Massive Hero Headline: Bold White Sans + Golden Script "Memories" */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black text-white font-sans leading-[1.18] tracking-tight">
              <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                {t.hero.title1}
              </span>{" "}
              <span className="inline-block sm:inline whitespace-normal">
                <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {t.hero.titleCreate}
                </span>{" "}
                <span className="font-script text-amber-400 font-normal italic inline-block drop-shadow-[0_2px_10px_rgba(245,158,11,0.55)] text-[1.15em] tracking-normal -rotate-1 ml-0.5">
                  {t.hero.titleHighlight}
                </span>
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
              {selectedProvince === "sulawesi"
                ? t.hero.descSulawesi
                : selectedProvince === "lampung"
                ? t.hero.descLampung
                : t.hero.descAll}
            </p>

            {/* Action Buttons Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#destinasi"
                className="portal-submit-btn-gold !h-12 !px-6 !text-sm flex items-center gap-2.5 font-bold shadow-lg"
              >
                <span>{t.hero.exploreBtn}</span>
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
                <span>{t.hero.askAiBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. OVERLAPPING BOOKING / SEARCH CARD (Traveleo Style) */}
      {/* ======================================================== */}
      <section className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-8 -mt-16 sm:-mt-20">
        <div className="w-full rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] shadow-2xl p-4 sm:p-6 transition-colors">
          {/* Form Search Row (5 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
            {/* Column 1: Wilayah / Asal */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--bx-muted)] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{t.searchBox.regionLabel}</span>
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-xs sm:text-sm font-medium text-[var(--bx-ink)] focus:outline-hidden focus:border-[var(--gold)]"
              >
                <option value="all">{t.searchBox.regionAll}</option>
                <option value="sulawesi">{t.searchBox.regionSulawesi}</option>
                <option value="lampung">{t.searchBox.regionLampung}</option>
              </select>
            </div>

            {/* Column 2: Kategori Wisata */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--bx-muted)] flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{t.searchBox.categoryLabel}</span>
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-xs sm:text-sm font-medium text-[var(--bx-ink)] focus:outline-hidden focus:border-[var(--gold)]"
              >
                <option value="all">{t.searchBox.categoryAll}</option>
                <option value="laut">{t.searchBox.categorySea}</option>
                <option value="budaya">{t.searchBox.categoryCulture}</option>
                <option value="hutan">{t.searchBox.categoryForest}</option>
                <option value="gunung">{t.searchBox.categoryMountain}</option>
                <option value="pertanian">{t.searchBox.categoryAgro}</option>
              </select>
            </div>

            {/* Column 3: Waktu / Musim */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--bx-muted)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{t.searchBox.seasonLabel}</span>
              </label>
              <select
                value={seasonChoice}
                onChange={(e) => setSeasonChoice(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-xs sm:text-sm font-medium text-[var(--bx-ink)] focus:outline-hidden focus:border-[var(--gold)]"
              >
                <option value="all">{t.searchBox.seasonAll}</option>
                <option value="festival">{t.searchBox.seasonFestival}</option>
                <option value="maritim">{t.searchBox.seasonMaritime}</option>
                <option value="panen">{t.searchBox.seasonHarvest}</option>
              </select>
            </div>

            {/* Column 4: Jumlah Penjelajah */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--bx-muted)] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{t.searchBox.travelersLabel}</span>
              </label>
              <select
                value={travelerCount}
                onChange={(e) => setTravelerCount(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-xs sm:text-sm font-medium text-[var(--bx-ink)] focus:outline-hidden focus:border-[var(--gold)]"
              >
                <option value="1">{t.searchBox.traveler1}</option>
                <option value="2">{t.searchBox.traveler2}</option>
                <option value="4">{t.searchBox.traveler4}</option>
                <option value="10">{t.searchBox.traveler10}</option>
              </select>
            </div>

            {/* Column 5: Search Action Button */}
            <div>
              <a
                href="#destinasi"
                className="portal-submit-btn-gold !h-11 w-full flex items-center justify-center gap-2 !text-sm font-bold shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>{t.searchBox.searchBtn}</span>
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
                {t.valueProps.prop1Title}
              </h2>
              <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                {t.valueProps.prop1Desc}
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
                {t.valueProps.prop2Title}
              </h2>
              <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                {t.valueProps.prop2Desc}
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
                {t.valueProps.prop3Title}
              </h2>
              <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                {t.valueProps.prop3Desc}
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
                {t.valueProps.prop4Title}
              </h2>
              <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                {t.valueProps.prop4Desc}
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
                {selectedProvince === "sulawesi"
                  ? t.destinations.badgeSulawesi
                  : selectedProvince === "lampung"
                  ? t.destinations.badgeLampung
                  : t.destinations.badgeAll}
              </span>
              <span className="text-xs font-mono text-[var(--bx-muted)]">
                ({filteredDestinations.length} {t.destinations.available})
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[var(--bx-ink-bright)]">
              {selectedProvince === "sulawesi"
                ? t.destinations.titleSulawesi
                : selectedProvince === "lampung"
                ? t.destinations.titleLampung
                : t.destinations.titleAll}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--bx-muted)] max-w-xl">
              {selectedProvince === "sulawesi"
                ? t.destinations.descSulawesi
                : selectedProvince === "lampung"
                ? t.destinations.descLampung
                : t.destinations.descAll}
            </p>
          </div>

          {/* View All on Map Link */}
          <Link
            href="/peta"
            className="text-xs sm:text-sm font-bold text-[var(--gold)] hover:underline flex items-center gap-1.5 group shrink-0"
          >
            <span>{t.destinations.viewAllOnMap}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 5-Card Responsive Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="w-full py-12 text-center rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] p-6 space-y-3">
            <Compass className="w-10 h-10 text-[var(--gold)] mx-auto opacity-70" />
            <p className="text-sm font-bold text-[var(--bx-ink-bright)]">{t.destinations.emptyFilter}</p>
            <button
              type="button"
              onClick={() => {
                setSelectedProvince("all");
                setCategoryFilter("all");
                setSearchKeyword("");
              }}
              className="portal-submit-btn-gold !h-9 !px-4 !text-xs inline-flex items-center gap-1.5"
            >
              <span>{t.destinations.resetFilter}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {filteredDestinations.slice(0, selectedProvince === "all" ? 5 : 10).map((dest) => {
              const localized = lang === "EN" && DESTINATION_TRANSLATIONS_EN[dest.id] ? DESTINATION_TRANSLATIONS_EN[dest.id] : null;
              const destName = localized?.name || dest.name;
              const destSubtitle = localized?.subtitle || dest.subtitle;
              const destDescription = localized?.description || dest.description;
              const destDuration = localized?.duration || dest.tripPackage.duration;

              return (
                <div
                  key={dest.id}
                  className="group rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image & Badges */}
                  <div className="relative w-full h-48 overflow-hidden bg-slate-900">
                    <img
                      src={dest.imageUrl}
                      alt={destName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                    {/* Province Pill */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/20">
                      {dest.province.includes("Sulawesi") ? t.destinations.sulselPill : t.destinations.lampungPill}
                    </span>

                    {/* Weather Badge */}
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-mono font-bold flex items-center gap-1">
                      <span>{dest.bmkgStation.temperature}°C</span>
                    </span>

                    {/* Title & Location on Image Bottom */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-sm font-bold text-white leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {destName}
                      </h3>
                      <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[var(--gold)] shrink-0" />
                        <span className="truncate">{destSubtitle}</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Meta & Action */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5 text-xs text-[var(--bx-muted)]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
                          <span>{destDuration}</span>
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          BMKG {dest.bmkgStation.safetyStatus}
                        </span>
                      </div>

                      <p className="text-[11px] text-[var(--bx-ink)] line-clamp-2">
                        {destDescription}
                      </p>
                    </div>

                    {/* Price & Action Button */}
                    <div className="pt-2 border-t border-[var(--bx-border)] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-[var(--bx-muted)] block">{t.destinations.estPackage}</span>
                        <span className="text-xs sm:text-sm font-bold text-[var(--gold)] font-mono">
                          Rp {dest.tripPackage.priceIdr.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <Link
                        href={`/peta?dest=${dest.id}`}
                        className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-2)] text-white text-xs font-bold transition flex items-center gap-1 shrink-0"
                        title={t.destinations.mapBtn}
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>{t.destinations.mapBtn}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 7. SPECIAL OFFER & WHY CHOOSE US (Traveleo Split 2 Columns) */}
      {/* ======================================================== */}
      <section id="mengapa-kami" className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Special Offer Banner */}
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
                {selectedProvince === "sulawesi"
                  ? t.specialOffer.badgeSulawesi
                  : selectedProvince === "lampung"
                  ? t.specialOffer.badgeLampung
                  : t.specialOffer.badgeAll}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-serif font-black leading-tight text-white">
                {selectedProvince === "sulawesi"
                  ? t.specialOffer.headingSulawesi
                  : selectedProvince === "lampung"
                  ? t.specialOffer.headingLampung
                  : t.specialOffer.headingAll}
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-sm">
                {selectedProvince === "sulawesi"
                  ? t.specialOffer.descSulawesi
                  : selectedProvince === "lampung"
                  ? t.specialOffer.descLampung
                  : t.specialOffer.descAll}
              </p>
              <Link
                href={
                  selectedProvince === "sulawesi"
                    ? "/peta?dest=bulukumba-bira"
                    : selectedProvince === "lampung"
                    ? "/peta?dest=lampung-way-kambas"
                    : "/peta"
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm transition shadow-md active:scale-95"
              >
                <span>
                  {t.specialOffer.exploreRoute}{" "}
                  {selectedProvince === "sulawesi"
                    ? lang === "EN"
                      ? "S. Sulawesi"
                      : "Sulsel"
                    : selectedProvince === "lampung"
                    ? "Lampung"
                    : lang === "EN"
                    ? "Cultural"
                    : "Budaya"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Why Choose Us (4 Feature Blocks in 2x2 Grid) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <span className="portal-badge-gold">{t.whyChooseUs.badge}</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[var(--bx-ink-bright)]">
                {t.whyChooseUs.title}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--bx-muted)] leading-relaxed">
                {t.whyChooseUs.desc}
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
                  {t.whyChooseUs.feature1Title}
                </h4>
                <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                  {t.whyChooseUs.feature1Desc}
                </p>
              </div>

              {/* Item 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-600">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[var(--bx-ink-bright)]">
                  {t.whyChooseUs.feature2Title}
                </h4>
                <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                  {t.whyChooseUs.feature2Desc}
                </p>
              </div>

              {/* Item 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[var(--bx-ink-bright)]">
                  {t.whyChooseUs.feature3Title}
                </h4>
                <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                  {t.whyChooseUs.feature3Desc}
                </p>
              </div>

              {/* Item 4 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[var(--bx-ink-bright)]">
                  {t.whyChooseUs.feature4Title}
                </h4>
                <p className="text-xs text-[var(--bx-muted)] leading-relaxed">
                  {t.whyChooseUs.feature4Desc}
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
            <span className="portal-badge-gold">{t.reviews.badge}</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[var(--bx-ink-bright)]">
              {t.reviews.title}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--bx-muted)] max-w-xl">
              {t.reviews.desc}
            </p>
          </div>

          <Link
            href="/peta"
            className="text-xs sm:text-sm font-bold text-[var(--gold)] hover:underline flex items-center gap-1.5 group shrink-0"
          >
            <span>{t.reviews.openMap}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Testimonials Grid (Filtered by Active Province) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] space-y-4 shadow-xs relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[var(--gold)]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[var(--bx-ink-bright)]">
                      {review.name}
                    </h4>
                    <p className="text-xs text-[var(--bx-muted)]">{review.location}</p>
                    <span className="text-[10px] text-[var(--gold)] font-medium block mt-0.5 font-serif">
                      📍 {review.highlight}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[var(--bx-ink)] leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--bx-border)] flex items-center justify-between text-[11px] text-[var(--bx-muted)]">
                <span className="font-mono">{t.reviews.verified}</span>
                <span className="text-[var(--gold)] font-semibold">
                  {review.province === "sulawesi"
                    ? lang === "EN"
                      ? "South Sulawesi"
                      : "Sulawesi Selatan"
                    : "Lampung"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. RADAR EVENT STRIP (Cultural Agenda) */}
      {/* ======================================================== */}
      <section id="radar-event" className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bx-surface)] border border-[var(--bx-border)] shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="portal-badge-gold">{t.radarEvent.badge}</span>
                <span className="text-xs font-mono text-[var(--bx-muted)]">
                  ({filteredEvents.length} {t.radarEvent.scheduled})
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-[var(--bx-ink-bright)] mt-1">
                {t.radarEvent.title}{" "}
                {selectedProvince === "sulawesi"
                  ? lang === "EN"
                    ? "South Sulawesi"
                    : "Sulawesi Selatan"
                  : selectedProvince === "lampung"
                  ? "Lampung"
                  : lang === "EN"
                  ? "Archipelago"
                  : "Nusantara"}
              </h3>
              <p className="text-xs text-[var(--bx-muted)] mt-0.5">
                {selectedProvince === "sulawesi"
                  ? t.radarEvent.descSulawesi
                  : selectedProvince === "lampung"
                  ? t.radarEvent.descLampung
                  : t.radarEvent.descAll}
              </p>
            </div>
            <Link
              href="/peta"
              className="text-xs font-bold text-[var(--gold)] hover:underline flex items-center gap-1"
            >
              <span>{t.radarEvent.openRadarMap}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--bx-muted)]">
              {t.radarEvent.empty}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => {
                const localizedEvt =
                  lang === "EN" && EVENT_TRANSLATIONS_EN[event.id]
                    ? EVENT_TRANSLATIONS_EN[event.id]
                    : null;
                const eventName = localizedEvt?.name || event.name;
                const eventDescription = localizedEvt?.description || event.description;
                const eventDate = localizedEvt?.dateRange || event.dateRange;

                return (
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
                          {event.daysRemaining} {t.radarEvent.daysLeft}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[var(--bx-ink-bright)] line-clamp-1">
                        {eventName}
                      </h4>
                      <p className="text-xs text-[var(--bx-muted)] line-clamp-2">
                        {eventDescription}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[var(--bx-border)] text-[11px] text-[var(--bx-muted)] flex items-center justify-between">
                      <span>{eventDate}</span>
                      <Link
                        href="/peta"
                        className="text-[var(--gold)] font-bold hover:underline"
                      >
                        {t.radarEvent.locationOnMap}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                {t.newsletter.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200">
                {t.newsletter.desc}
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
                placeholder={t.newsletter.placeholder}
                required
                className="w-full h-12 px-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[var(--gold)]"
              />
            </div>
            <button
              type="submit"
              className="portal-submit-btn-gold !h-12 w-full sm:w-auto px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shrink-0 shadow-md"
            >
              <span>{t.newsletter.subscribeBtn}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {newsletterSubscribed && (
          <div className="max-w-7xl mx-auto mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs text-center font-bold">
            {t.newsletter.success}
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
                {t.footer.brandDesc}
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
                {t.footer.quickLinks}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/" className="hover:text-[var(--gold)] transition-colors">
                    {t.footer.portalHome}
                  </Link>
                </li>
                <li>
                  <Link href="/peta" className="hover:text-[var(--gold)] transition-colors">
                    {t.footer.adventureMap}
                  </Link>
                </li>
                <li>
                  <a href="#destinasi" className="hover:text-[var(--gold)] transition-colors">
                    {t.footer.curatedDest}
                  </a>
                </li>
                <li>
                  <a href="#radar-event" className="hover:text-[var(--gold)] transition-colors">
                    {t.footer.culturalRadar}
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(true)}
                    className="hover:text-[var(--gold)] transition-colors text-left"
                  >
                    {t.footer.aiAssistant}
                  </button>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[var(--gold)] transition-colors">
                    {t.footer.loginAuth}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Destinasi Unggulan */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
                {t.footer.favDest}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/peta?dest=bulukumba-bira" className="hover:text-[var(--gold)] transition-colors">
                    {lang === "EN" ? "Tanjung Bira Beach" : "Pantai Tanjung Bira"}
                  </Link>
                </li>
                <li>
                  <Link href="/peta?dest=bulukumba-tana-beru" className="hover:text-[var(--gold)] transition-colors">
                    {lang === "EN" ? "Tana Beru Pinisi Shipyard" : "Tana Beru Galangan Pinisi"}
                  </Link>
                </li>
                <li>
                  <Link href="/peta?dest=bulukumba-ammatoa-kajang" className="hover:text-[var(--gold)] transition-colors">
                    {lang === "EN" ? "Ammatoa Kajang Forest" : "Kawasan Adat Ammatoa Kajang"}
                  </Link>
                </li>
                <li>
                  <Link href="/peta?dest=lampung-way-kambas" className="hover:text-[var(--gold)] transition-colors">
                    {lang === "EN" ? "Way Kambas National Park" : "Taman Nasional Way Kambas"}
                  </Link>
                </li>
                <li>
                  <Link href="/peta?dest=lampung-kiluan" className="hover:text-[var(--gold)] transition-colors">
                    {lang === "EN" ? "Kiluan Dolphin Bay" : "Teluk Kiluan Lumba-lumba"}
                  </Link>
                </li>
                <li>
                  <Link href="/peta?dest=lampung-krakatau" className="hover:text-[var(--gold)] transition-colors">
                    {lang === "EN" ? "Anak Krakatau Caldera" : "Kaldera Gunung Krakatau"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Panduan Budaya */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
                {t.footer.travelerGuide}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <span className="hover:text-[var(--gold)] transition-colors cursor-pointer">
                    {t.footer.guideEtiquette}
                  </span>
                </li>
                <li>
                  <span className="hover:text-[var(--gold)] transition-colors cursor-pointer">
                    {t.footer.guideTaboos}
                  </span>
                </li>
                <li>
                  <span className="hover:text-[var(--gold)] transition-colors cursor-pointer">
                    {t.footer.guideBmkg}
                  </span>
                </li>
                <li>
                  <span className="hover:text-[var(--gold)] transition-colors cursor-pointer">
                    {t.footer.guideWastra}
                  </span>
                </li>
                <li>
                  <span className="hover:text-[var(--gold)] transition-colors cursor-pointer">
                    {t.footer.guideFaq}
                  </span>
                </li>
              </ul>
            </div>

            {/* Col 5: Support & Contact */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
                {t.footer.supportPartners}
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
                  {t.footer.supportHours}
                </p>
              </div>

              {/* Data Partner Badges */}
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] text-slate-300 font-mono uppercase block">
                  {t.footer.sciencePartners}
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
            <p>{t.footer.copyright}</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-white transition-colors cursor-pointer">
                {t.footer.terms}
              </span>
              <span>•</span>
              <span className="hover:text-white transition-colors cursor-pointer">
                {t.footer.privacy}
              </span>
              <span>•</span>
              <span className="hover:text-white transition-colors cursor-pointer">
                {t.footer.customaryCode}
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
                    {t.aiModal.title}
                  </h3>
                  <p className="text-[11px] text-amber-300">
                    {t.aiModal.sub}
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
                onClick={() =>
                  handleSendAiMessage(
                    lang === "EN"
                      ? "What is the customary etiquette when visiting Ammatoa Kajang village in Bulukumba?"
                      : "Bagaimana etika saat berkunjung ke Desa Adat Kajang Bulukumba?"
                  )
                }
                className="px-2.5 py-1 rounded-full bg-[var(--bx-surface)] hover:bg-[var(--gold)]/15 border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] whitespace-nowrap transition"
              >
                {t.aiModal.promptKajang}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendAiMessage(
                    lang === "EN"
                      ? "What is the philosophical meaning behind Lampung Tapis weaving?"
                      : "Apa makna filosofis kain Tapis Lampung?"
                  )
                }
                className="px-2.5 py-1 rounded-full bg-[var(--bx-surface)] hover:bg-[var(--gold)]/15 border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] whitespace-nowrap transition"
              >
                {t.aiModal.promptTapis}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendAiMessage(
                    lang === "EN"
                      ? "How are Pinisi wooden schooners constructed in Tana Beru?"
                      : "Bagaimana tradisi pembuatan perahu Pinisi di Tana Beru?"
                  )
                }
                className="px-2.5 py-1 rounded-full bg-[var(--bx-surface)] hover:bg-[var(--gold)]/15 border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] whitespace-nowrap transition"
              >
                {t.aiModal.promptPinisi}
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
                placeholder={t.aiModal.placeholder}
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
