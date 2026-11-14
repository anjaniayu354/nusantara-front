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
  Menu,
  SlidersHorizontal,
  RotateCcw,
  Leaf,
  Sprout,
  Trees,
  Mountain,
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

// ========================================================
// DAFTAR PROVINSI TERKURASI NUSANTARA
// PENTING: Sesuai instruksi khusus pengguna, provinsi TIDAK BOLEH menggunakan icon / emoji
// ========================================================
export const PROVINCES_LIST = [
  { id: "aceh", name: "Aceh", desc: "Kopi Gayo & Bahari Sabang" },
  { id: "sumatera-barat", name: "Sumatera Barat", desc: "Tambang Ombilin & Nagari Pariangan" },
  { id: "riau", name: "Kepulauan Riau", desc: "Kepulauan Anambas & Laut Natuna" },
  { id: "lampung", name: "Lampung", desc: "Way Kambas, Anak Krakatau & Kain Tapis" },
  { id: "yogyakarta", name: "DI Yogyakarta & Jateng", desc: "Candi Borobudur & Sentra Jamu Nguter" },
  { id: "jawa-timur", name: "Jawa Timur", desc: "Kawah Ijen Blue Fire & TN Baluran" },
  { id: "bali", name: "Bali", desc: "Subak Jatiluwih & Herbal Usada Bedugul" },
  { id: "ntt", name: "Nusa Tenggara Timur", desc: "TN Komodo & Danau Tiga Warna Kelimutu" },
  { id: "kalimantan", name: "Kalimantan Tengah", desc: "TN Tanjung Puting Orangutan" },
  { id: "sulawesi", name: "Sulawesi Selatan", desc: "Pinisi Tana Beru, Tanjung Bira & Adat Kajang" },
  { id: "maluku", name: "Maluku", desc: "Banda Neira & Jalur Rempah Pala" },
  { id: "papua", name: "Papua", desc: "Raja Ampat Segitiga Karang & Herbal Baliem" },
];

export default function PortalLandingPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Language state (defaults to "EN" with instant toggle to "ID")
  const [lang, setLang] = useState<Language>("EN");

  // Province & Category Multi-Check Selection State
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [travelerCount, setTravelerCount] = useState<string>("2");
  const [seasonChoice, setSeasonChoice] = useState<string>("all");

  // Filter Modal State (Multi-check Selection Modal)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Active Main Navigation Tab (Thick bottom underline style)
  const [activeNav, setActiveNav] = useState<string>("beranda");

  // Header Scroll & Frosted Glass States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  // Bar Hala AI Slider State (Slide-in Drawer from Right with Web Push)
  const [isAiSliderOpen, setIsAiSliderOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    {
      sender: "ai",
      text: DICTIONARY.EN.aiModal.greeting,
    },
  ]);
  const [aiInputText, setAiInputText] = useState("");
  const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);

  // Audio preview state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Profile Dropdown state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);

  // Quick helper checks
  const getProvinceCount = (provId: string) => {
    return DESTINATIONS.filter((d) => {
      const p = provId.toLowerCase();
      const dp = d.province.toLowerCase();
      if (p === "sulawesi") return dp.includes("sulawesi");
      if (p === "lampung") return dp.includes("lampung");
      if (p === "yogyakarta") return dp.includes("yogyakarta") || dp.includes("jawa tengah");
      if (p === "jawa-timur") return dp.includes("jawa timur");
      if (p === "bali") return dp.includes("bali");
      if (p === "aceh") return dp.includes("aceh");
      if (p === "sumatera-barat") return dp.includes("sumatera barat");
      if (p === "riau") return dp.includes("riau");
      if (p === "kalimantan") return dp.includes("kalimantan");
      if (p === "ntt") return dp.includes("nusa tenggara timur");
      if (p === "papua") return dp.includes("papua");
      if (p === "maluku") return dp.includes("maluku");
      return dp.includes(p);
    }).length;
  };

  const singleProvinceObj =
    selectedProvinces.length === 1
      ? PROVINCES_LIST.find((p) => p.id === selectedProvinces[0])
      : null;
  const isOnlySulawesi = selectedProvinces.length === 1 && selectedProvinces[0] === "sulawesi";
  const isOnlyLampung = selectedProvinces.length === 1 && selectedProvinces[0] === "lampung";
  const totalActiveFilters = selectedProvinces.length + selectedCategories.length;

  const toggleProvince = (provId: string) => {
    setSelectedProvinces((prev) =>
      prev.includes(provId) ? prev.filter((p) => p !== provId) : [...prev, provId]
    );
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleResetFilters = () => {
    setSelectedProvinces([]);
    setSelectedCategories([]);
  };

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

  // Auto-scroll AI chat messages when new messages arrive or drawer opens
  useEffect(() => {
    if (isAiSliderOpen) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiChatMessages, isAiSliderOpen]);

  // Scroll spy & header scroll direction handler (Glass Mac & Top Bar Collapse)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Trigger Mac frosted glass effect when scrolled > 15px
      setIsScrolled(currentScrollY > 15);

      // Top utility bar: hide on scroll down, show on scroll up
      if (currentScrollY <= 15) {
        setIsTopBarVisible(true);
      } else if (currentScrollY > lastScrollYRef.current + 8) {
        // Scrolling down -> collapse top bar
        setIsTopBarVisible(false);
        setIsMobileNavOpen(false);
      } else if (currentScrollY < lastScrollYRef.current - 8) {
        // Scrolling up -> reveal top bar
        setIsTopBarVisible(true);
      }

      lastScrollYRef.current = currentScrollY;

      // Active section spy
      const scrollPos = currentScrollY + 140;
      const sections = [
        { id: "beranda", tab: "beranda" },
        { id: "destinasi", tab: "destinasi" },
        { id: "radar-event", tab: "radar" },
        { id: "mengapa-kami", tab: "keunggulan" },
        { id: "ulasan", tab: "ulasan" },
        { id: "kontak", tab: "kontak" },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveNav(sections[i].tab);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
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

  // Filtered destinations based on active Province & Category multi-checks
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      // Province multi-check: Jika belum memilih provinsi, otomatis menampilkan seluruh data di Indonesia!
      if (selectedProvinces.length > 0) {
        const matchProv = selectedProvinces.some((p) => {
          const pLower = p.toLowerCase();
          const dProvLower = d.province.toLowerCase();
          if (pLower === "sulawesi") return dProvLower.includes("sulawesi");
          if (pLower === "lampung") return dProvLower.includes("lampung");
          if (pLower === "yogyakarta") return dProvLower.includes("yogyakarta") || dProvLower.includes("jawa tengah");
          if (pLower === "jawa-timur") return dProvLower.includes("jawa timur");
          if (pLower === "bali") return dProvLower.includes("bali");
          if (pLower === "aceh") return dProvLower.includes("aceh");
          if (pLower === "sumatera-barat") return dProvLower.includes("sumatera barat");
          if (pLower === "riau") return dProvLower.includes("riau");
          if (pLower === "kalimantan") return dProvLower.includes("kalimantan");
          if (pLower === "ntt") return dProvLower.includes("nusa tenggara timur");
          if (pLower === "papua") return dProvLower.includes("papua");
          if (pLower === "maluku") return dProvLower.includes("maluku");
          return dProvLower.includes(pLower);
        });
        if (!matchProv) return false;
      }

      // Category multi-check: sumber alam, pertanian, herbal, laut / ikan, flora fauna, budaya, pakaian
      if (selectedCategories.length > 0) {
        const matchCat = selectedCategories.some((c) => {
          if (c === "sumber-alam") {
            return (
              d.category === "sumber-alam" ||
              d.tags?.some((t) => /sumber alam|geologi|mineral|tambang|belerang|vulkanik|kawah/i.test(t))
            );
          }
          if (c === "pertanian") {
            return (
              d.category === "pertanian" ||
              (d.agriculturalProducts && d.agriculturalProducts.length > 0) ||
              d.tags?.some((t) => /tani|kebun|kopi|subak|padi|rempah/i.test(t))
            );
          }
          if (c === "herbal") {
            return (
              d.category === "herbal" ||
              d.tags?.some((t) => /herbal|jamu|obat|usada|buah merah/i.test(t)) ||
              d.agriculturalProducts?.some((p) => /jahe|temulawak|kunyit|kencur|buah merah|sirih|herbal/i.test(p))
            );
          }
          if (c === "laut" || c === "laut-ikan") {
            return (
              d.category === "laut" ||
              d.category === "pantai" ||
              d.tags?.some((t) => /laut|ikan|bahari|karang|snorkeling|perikanan/i.test(t))
            );
          }
          if (c === "flora-fauna") {
            return (
              d.category === "flora-fauna" ||
              d.category === "hutan" ||
              d.tags?.some((t) => /flora|fauna|satwa|orangutan|gajah|badak|komodo|banteng|konservasi/i.test(t))
            );
          }
          if (c === "budaya") return d.category === "budaya" || d.category === "desa";
          if (c === "pakaian") return d.category === "pakaian";
          if (c === "gunung") return d.category === "gunung" || d.category === "darat";
          return d.category === c;
        });
        if (!matchCat) return false;
      }

      // Search keyword
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchesName = d.name.toLowerCase().includes(q);
        const matchesSub = d.subtitle.toLowerCase().includes(q);
        const matchesProv = d.province.toLowerCase().includes(q);
        const matchesDesc = d.description.toLowerCase().includes(q);
        const matchesTags = d.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesSub && !matchesProv && !matchesDesc && !matchesTags) return false;
      }

      return true;
    });
  }, [selectedProvinces, selectedCategories, searchKeyword]);

  // Filtered Cultural Events based on active Province multi-checks
  const filteredEvents = useMemo(() => {
    return CULTURAL_EVENTS.filter((event) => {
      if (selectedProvinces.length > 0) {
        const match = selectedProvinces.some((p) => {
          const pLower = p.toLowerCase();
          const eProvLower = event.province.toLowerCase();
          if (pLower === "sulawesi") return eProvLower.includes("sulawesi");
          if (pLower === "lampung") return eProvLower.includes("lampung");
          if (pLower === "yogyakarta") return eProvLower.includes("yogyakarta") || eProvLower.includes("jawa tengah");
          if (pLower === "jawa-timur") return eProvLower.includes("jawa timur");
          if (pLower === "bali") return eProvLower.includes("bali");
          if (pLower === "aceh") return eProvLower.includes("aceh");
          if (pLower === "sumatera-barat") return eProvLower.includes("sumatera barat");
          if (pLower === "riau") return eProvLower.includes("riau");
          if (pLower === "kalimantan") return eProvLower.includes("kalimantan");
          if (pLower === "ntt") return eProvLower.includes("nusa tenggara timur");
          if (pLower === "papua") return eProvLower.includes("papua");
          if (pLower === "maluku") return eProvLower.includes("maluku");
          return eProvLower.includes(pLower);
        });
        if (!match) return false;
      }
      return true;
    });
  }, [selectedProvinces]);

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

    if (isOnlySulawesi) {
      return allReviews.filter((r) => r.province === "sulawesi");
    }
    if (isOnlyLampung) {
      return allReviews.filter((r) => r.province === "lampung");
    }
    return allReviews.slice(0, 3);
  }, [isOnlySulawesi, isOnlyLampung, lang]);

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
    if (totalActiveFilters === 0) {
      return lang === "ID" ? "Filter Destinasi" : "Filter Destinations";
    }
    if (selectedProvinces.length === 1 && selectedCategories.length === 0) {
      const p = PROVINCES_LIST.find((prov) => prov.id === selectedProvinces[0]);
      return p ? p.name : selectedProvinces[0];
    }
    return lang === "ID" ? `Filter (${totalActiveFilters})` : `Filters (${totalActiveFilters})`;
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--bx-bg)] text-[var(--bx-ink)] overflow-x-hidden selection:bg-[var(--gold)] selection:text-[var(--brand)]">
      {/* Main Page Container: shifts left smoothly when AI slider is open */}
      <div
        className={`min-h-screen w-full flex flex-col font-sans transition-transform duration-300 ease-in-out ${
          isAiSliderOpen ? "sm:-translate-x-[420px] lg:-translate-x-[460px]" : "translate-x-0"
        }`}
      >

      {/* ======================================================== */}
      {/* 2. STICKY HEADER WITH TOP UTILITY BAR & MAC FROSTED GLASS */}
      {/* ======================================================== */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ease-in-out ${
          isScrolled
            ? "glass-mac"
            : "bg-[var(--bx-surface)]/95 backdrop-blur-md border-b border-[var(--bx-border)] shadow-xs"
        }`}
      >
        {/* ======================================================== */}
        {/* 2a. TOP UTILITY BAR (Menu di Atasnya — No Telp/Email, Filter, Bahasa, Tema, Link Adventure Map) */}
        {/* Hilang saat scroll ke bawah, Muncul saat scroll ke atas */}
        {/* ======================================================== */}
        <div
          className={`w-full overflow-hidden transition-all duration-300 ease-in-out border-b border-[var(--bx-border)]/60 text-xs text-[var(--bx-muted)] ${
            isTopBarVisible
              ? "max-h-14 opacity-100 py-1.5 sm:py-2"
              : "max-h-0 opacity-0 py-0 border-b-0 pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-3 sm:gap-6">
            {/* Pojok Kiri: No Telp & Email seperti semula */}
            <div className="flex items-center gap-3 sm:gap-6 shrink-0">
              <a
                href="tel:+6281234567890"
                className="flex items-center gap-1.5 text-[11px] sm:text-xs hover:text-[var(--gold)] transition-colors font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                <span>+62 812-3456-7890</span>
              </a>
              <a
                href="mailto:info@nusa-antara.id"
                className="flex items-center gap-1.5 text-[11px] sm:text-xs hover:text-[var(--gold)] transition-colors font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                <span>info@nusa-antara.id</span>
              </a>
            </div>

            {/* Pojok Kanan: Filter, Bahasa, Tema, Link Adventure Map */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
              {/* Filter Button (Modal Trigger) */}
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(true)}
                className={`h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                  totalActiveFilters > 0
                    ? "bg-[var(--gold)]/15 border-[var(--gold)] text-[var(--bx-ink-bright)]"
                    : "bg-[var(--bx-bg)]/80 hover:bg-[var(--gold)]/10 border-[var(--bx-border)] hover:border-[var(--gold)]/60 text-[var(--bx-ink)]"
                }`}
                title={lang === "ID" ? "Buka Filter Destinasi" : "Open Destination Filters"}
                aria-label={lang === "ID" ? "Filter Destinasi" : "Destination Filters"}
              >
                <SlidersHorizontal className="w-3 h-3 text-[var(--gold)] shrink-0" />
                <span className="truncate max-w-[85px] sm:max-w-none">
                  {getFilterButtonLabel()}
                </span>
                {totalActiveFilters > 0 && (
                  <span className="min-w-4 h-4 px-1 rounded-full bg-[var(--gold)] text-[var(--brand)] font-bold text-[9px] flex items-center justify-center shrink-0">
                    {totalActiveFilters}
                  </span>
                )}
              </button>

              <div className="h-3.5 w-px bg-[var(--bx-border)] hidden sm:block" />

              {/* Bahasa & Tema Mode Toggles */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <LanguageToggle />
                <ThemeToggle />
              </div>

              <div className="h-3.5 w-px bg-[var(--bx-border)] hidden sm:block" />

              {/* Link Adventure Map */}
              <Link
                href="/peta"
                className="portal-submit-btn-gold !h-7 sm:!h-8 !px-2.5 sm:!px-3.5 !text-[11px] sm:!text-xs flex items-center gap-1.5 shrink-0 group shadow-xs font-bold"
                title={t.nav.interactiveMap}
              >
                <Compass className="w-3.5 h-3.5 transition-transform group-hover:rotate-45" />
                <span>{t.nav.adventureMap}</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 hidden sm:inline" />
              </Link>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2b. MAIN NAVBAR (Logo & Nav Menu Sejajar Icon + Profile) */}
        {/* ======================================================== */}
        <div className="max-w-7xl mx-auto h-16 sm:h-18 px-4 sm:px-8 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Brand Identity (Tanpa Kotak, Gambar Murni) */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <img
              src="/mandala.png"
              alt="Logo Mandala Nusa Antara"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform duration-500 group-hover:rotate-45"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[var(--bx-ink-bright)] font-serif leading-none">
                  NUSA ANTARA
                </span>
                <span className="portal-badge-portal !text-[9px] sm:!text-[10px]">
                  PORTAL
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[var(--bx-muted)] font-medium hidden md:inline-block">
                {t.nav.brandSub}
              </span>
            </div>
          </Link>

          {/* Center: Nav Menu Sejajar Icon (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium h-full">
            {/* Beranda */}
            <a
              href="#beranda"
              onClick={() => setActiveNav("beranda")}
              className={`h-full flex items-center gap-1.5 px-2.5 xl:px-3 transition-all cursor-pointer border-b-[3px] ${
                activeNav === "beranda"
                  ? "border-[var(--gold)] text-[var(--gold)] font-bold bg-transparent"
                  : "border-transparent text-[var(--bx-ink)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 font-medium"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t.nav.home}</span>
            </a>

            {/* Destinasi Budaya */}
            <a
              href="#destinasi"
              onClick={() => setActiveNav("destinasi")}
              className={`h-full flex items-center gap-1.5 px-2.5 xl:px-3 transition-all cursor-pointer border-b-[3px] ${
                activeNav === "destinasi"
                  ? "border-[var(--gold)] text-[var(--gold)] font-bold bg-transparent"
                  : "border-transparent text-[var(--bx-ink)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 font-medium"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t.nav.destinations}</span>
            </a>

            {/* Radar Event & Festival */}
            <a
              href="#radar-event"
              onClick={() => setActiveNav("radar")}
              className={`h-full flex items-center gap-1.5 px-2.5 xl:px-3 transition-all cursor-pointer border-b-[3px] ${
                activeNav === "radar"
                  ? "border-[var(--gold)] text-[var(--gold)] font-bold bg-transparent"
                  : "border-transparent text-[var(--bx-ink)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 font-medium"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{t.nav.eventRadar}</span>
            </a>

            {/* Suara Penjelajah */}
            <a
              href="#ulasan"
              onClick={() => setActiveNav("ulasan")}
              className={`h-full flex items-center gap-1.5 px-2.5 xl:px-3 transition-all cursor-pointer border-b-[3px] ${
                activeNav === "ulasan"
                  ? "border-[var(--gold)] text-[var(--gold)] font-bold bg-transparent"
                  : "border-transparent text-[var(--bx-ink)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 font-medium"
              }`}
            >
              <Star className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{t.nav.testimonials}</span>
            </a>

            {/* Kontak & Informasi */}
            <a
              href="#kontak"
              onClick={() => setActiveNav("kontak")}
              className={`h-full flex items-center gap-1.5 px-2.5 xl:px-3 transition-all cursor-pointer border-b-[3px] ${
                activeNav === "kontak"
                  ? "border-[var(--gold)] text-[var(--gold)] font-bold bg-transparent"
                  : "border-transparent text-[var(--bx-ink)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 font-medium"
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{t.nav.contact}</span>
            </a>
          </nav>

          {/* Right: Avatar Profile Button with Dropdown & Mobile Nav Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Avatar Profile Button with Dropdown (Paling Kanan) */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[var(--gold)]/60 hover:border-[var(--gold)] bg-[var(--bx-bg)] p-0.5 transition-all shadow-xs hover:scale-105 active:scale-95 focus:outline-hidden cursor-pointer"
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
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
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
                        setIsAiSliderOpen(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-[var(--bx-ink)] hover:text-[var(--gold)] hover:bg-[var(--bx-bg)] transition flex items-center justify-between group cursor-pointer"
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
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-400/30 transition flex items-center gap-2 active:scale-95 cursor-pointer"
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

            {/* Mobile Menu Hamburger Button (screens < lg) */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl border border-[var(--bx-border)] hover:border-[var(--gold)]/50 bg-[var(--bx-bg)] text-[var(--bx-ink)] hover:text-[var(--gold)] transition cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown (< lg) */}
        {isMobileNavOpen && (
          <div className="lg:hidden w-full border-t border-[var(--bx-border)] bg-[var(--bx-surface)]/98 backdrop-blur-xl px-4 py-3 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150 shadow-lg">
            <a
              href="#beranda"
              onClick={() => {
                setActiveNav("beranda");
                setIsMobileNavOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeNav === "beranda"
                  ? "bg-[var(--gold)]/15 text-[var(--gold)] font-bold"
                  : "text-[var(--bx-ink)] hover:bg-[var(--bx-bg)]"
              }`}
            >
              <Home className="w-4 h-4 text-[var(--gold)]" />
              <span>{t.nav.home}</span>
            </a>
            <a
              href="#destinasi"
              onClick={() => {
                setActiveNav("destinasi");
                setIsMobileNavOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeNav === "destinasi"
                  ? "bg-[var(--gold)]/15 text-[var(--gold)] font-bold"
                  : "text-[var(--bx-ink)] hover:bg-[var(--bx-bg)]"
              }`}
            >
              <Compass className="w-4 h-4 text-[var(--gold)]" />
              <span>{t.nav.destinations}</span>
            </a>
            <a
              href="#radar-event"
              onClick={() => {
                setActiveNav("radar");
                setIsMobileNavOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeNav === "radar"
                  ? "bg-[var(--gold)]/15 text-[var(--gold)] font-bold"
                  : "text-[var(--bx-ink)] hover:bg-[var(--bx-bg)]"
              }`}
            >
              <Calendar className="w-4 h-4 text-[var(--gold)]" />
              <span>{t.nav.eventRadar}</span>
            </a>
            <a
              href="#ulasan"
              onClick={() => {
                setActiveNav("ulasan");
                setIsMobileNavOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeNav === "ulasan"
                  ? "bg-[var(--gold)]/15 text-[var(--gold)] font-bold"
                  : "text-[var(--bx-ink)] hover:bg-[var(--bx-bg)]"
              }`}
            >
              <Star className="w-4 h-4 text-[var(--gold)]" />
              <span>{t.nav.testimonials}</span>
            </a>
            <a
              href="#kontak"
              onClick={() => {
                setActiveNav("kontak");
                setIsMobileNavOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                activeNav === "kontak"
                  ? "bg-[var(--gold)]/15 text-[var(--gold)] font-bold"
                  : "text-[var(--bx-ink)] hover:bg-[var(--bx-bg)]"
              }`}
            >
              <Phone className="w-4 h-4 text-[var(--gold)]" />
              <span>{t.nav.contact}</span>
            </a>
          </div>
        )}
      </header>

      {/* ======================================================== */}
      {/* 3. HERO SECTION (Fit Height, 60% Left Column, Tanpa Shading Kelap-Kelip) */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-[calc(100dvh-5.5rem)] lg:h-[calc(100dvh-5.5rem)] flex items-center justify-center overflow-hidden">
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
              {isOnlySulawesi
                ? t.hero.descSulawesi
                : isOnlyLampung
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
                onClick={() => setIsAiSliderOpen(true)}
                className="h-12 px-5 rounded-xl bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md border border-white/25 hover:border-[var(--gold)] text-white text-sm font-bold transition flex items-center gap-2.5 shadow-md active:scale-95 cursor-pointer"
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
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] font-mono flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{lang === "ID" ? "Pencarian Cepat Destinasi" : "Quick Search"}</span>
            </span>
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="text-xs text-[var(--gold)] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{lang === "ID" ? "Buka Filter Modal (Multi-Pilih)" : "Advanced Filter Modal"}</span>
              {totalActiveFilters > 0 && ` (${totalActiveFilters})`}
            </button>
          </div>

          {/* Form Search Row (5 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
            {/* Column 1: Wilayah / Asal */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--bx-muted)] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{t.searchBox.regionLabel}</span>
              </label>
              <select
                value={
                  selectedProvinces.length === 0
                    ? "all"
                    : selectedProvinces.length === 1
                    ? selectedProvinces[0]
                    : "multi"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "all") setSelectedProvinces([]);
                  else if (val === "multi") setIsFilterModalOpen(true);
                  else setSelectedProvinces([val]);
                }}
                className="w-full h-11 px-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-xs sm:text-sm font-medium text-[var(--bx-ink)] focus:outline-hidden focus:border-[var(--gold)]"
              >
                <option value="all">{t.searchBox.regionAll}</option>
                {PROVINCES_LIST.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
                {selectedProvinces.length > 1 && (
                  <option value="multi">
                    {lang === "ID"
                      ? `${selectedProvinces.length} Provinsi Dipilih`
                      : `${selectedProvinces.length} Provinces Selected`}
                  </option>
                )}
              </select>
            </div>

            {/* Column 2: Kategori Wisata */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--bx-muted)] flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{t.searchBox.categoryLabel}</span>
              </label>
              <select
                value={
                  selectedCategories.length === 0
                    ? "all"
                    : selectedCategories.length === 1
                    ? selectedCategories[0]
                    : "multi"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "all") setSelectedCategories([]);
                  else if (val === "multi") setIsFilterModalOpen(true);
                  else setSelectedCategories([val]);
                }}
                className="w-full h-11 px-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-xs sm:text-sm font-medium text-[var(--bx-ink)] focus:outline-hidden focus:border-[var(--gold)]"
              >
                <option value="all">{t.searchBox.categoryAll}</option>
                <option value="sumber-alam">{lang === "ID" ? "Sumber Alam" : "Natural Resources"}</option>
                <option value="pertanian">{lang === "ID" ? "Pertanian" : "Agriculture"}</option>
                <option value="herbal">{lang === "ID" ? "Herbal" : "Herbal & Medicine"}</option>
                <option value="laut">{lang === "ID" ? "Laut / Ikan" : "Marine & Fisheries"}</option>
                <option value="flora-fauna">{lang === "ID" ? "Flora Fauna" : "Flora & Fauna"}</option>
                <option value="budaya">{lang === "ID" ? "Budaya & Adat" : "Culture & Heritage"}</option>
                <option value="pakaian">{lang === "ID" ? "Wastra & Busana" : "Textile & Attire"}</option>
                {selectedCategories.length > 1 && (
                  <option value="multi">
                    {lang === "ID"
                      ? `${selectedCategories.length} Kategori Dipilih`
                      : `${selectedCategories.length} Categories Selected`}
                  </option>
                )}
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
            <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0">
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
            <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0">
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
            <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0">
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
            <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0">
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
                {singleProvinceObj
                  ? singleProvinceObj.name.toUpperCase()
                  : selectedProvinces.length > 1
                  ? `${selectedProvinces.length} PROVINSI DIPILIH`
                  : t.destinations.badgeAll}
              </span>
              <span className="text-xs font-mono text-[var(--bx-muted)]">
                ({filteredDestinations.length} {t.destinations.available})
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[var(--bx-ink-bright)]">
              {singleProvinceObj
                ? lang === "ID"
                  ? `Destinasi di ${singleProvinceObj.name}`
                  : `Destinations in ${singleProvinceObj.name}`
                : selectedProvinces.length > 1
                ? lang === "ID"
                  ? "Eksplorasi Lintas Wilayah Nusantara"
                  : "Cross-Regional Archipelago Exploration"
                : t.destinations.titleAll}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--bx-muted)] max-w-xl">
              {singleProvinceObj
                ? lang === "ID"
                  ? `Rekomendasi destinasi pilihan di ${singleProvinceObj.name} dengan ${singleProvinceObj.desc}.`
                  : `Curated destination highlights in ${singleProvinceObj.name} featuring ${singleProvinceObj.desc}.`
                : selectedProvinces.length > 1
                ? lang === "ID"
                  ? `Menampilkan ${filteredDestinations.length} destinasi dari ${selectedProvinces.length} provinsi pilihan di Indonesia.`
                  : `Displaying ${filteredDestinations.length} destinations from ${selectedProvinces.length} selected provinces across Indonesia.`
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

        {/* Responsive Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="w-full py-12 text-center rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] p-6 space-y-3">
            <Compass className="w-10 h-10 text-[var(--gold)] mx-auto opacity-70" />
            <p className="text-sm font-bold text-[var(--bx-ink-bright)]">{t.destinations.emptyFilter}</p>
            <button
              type="button"
              onClick={() => {
                handleResetFilters();
                setSearchKeyword("");
              }}
              className="portal-submit-btn-gold !h-9 !px-4 !text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.destinations.resetFilter}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {filteredDestinations.slice(0, selectedProvinces.length === 0 && selectedCategories.length === 0 ? 10 : 25).map((dest) => {
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
                      {dest.province}
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
                {isOnlySulawesi
                  ? t.specialOffer.badgeSulawesi
                  : isOnlyLampung
                  ? t.specialOffer.badgeLampung
                  : t.specialOffer.badgeAll}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-serif font-black leading-tight text-white">
                {isOnlySulawesi
                  ? t.specialOffer.headingSulawesi
                  : isOnlyLampung
                  ? t.specialOffer.headingLampung
                  : t.specialOffer.headingAll}
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-sm">
                {isOnlySulawesi
                  ? t.specialOffer.descSulawesi
                  : isOnlyLampung
                  ? t.specialOffer.descLampung
                  : t.specialOffer.descAll}
              </p>
              <Link
                href={
                  isOnlySulawesi
                    ? "/peta?dest=bulukumba-bira"
                    : isOnlyLampung
                    ? "/peta?dest=lampung-way-kambas"
                    : "/peta"
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm transition shadow-md active:scale-95"
              >
                <span>
                  {t.specialOffer.exploreRoute}{" "}
                  {isOnlySulawesi
                    ? lang === "EN"
                      ? "S. Sulawesi"
                      : "Sulsel"
                    : isOnlyLampung
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
                <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/25 flex items-center justify-center text-[var(--gold)]">
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
                <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/25 flex items-center justify-center text-[var(--gold)]">
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
                <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/25 flex items-center justify-center text-[var(--gold)]">
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
                <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/25 flex items-center justify-center text-[var(--gold)]">
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
                {singleProvinceObj
                  ? singleProvinceObj.name
                  : selectedProvinces.length > 1
                  ? lang === "EN"
                    ? `${selectedProvinces.length} Selected Regions`
                    : `${selectedProvinces.length} Wilayah Pilihan`
                  : lang === "EN"
                  ? "Across Indonesia"
                  : "Seluruh Nusantara"}
              </h3>
              <p className="text-xs text-[var(--bx-muted)] mt-0.5">
                {singleProvinceObj
                  ? lang === "EN"
                    ? `Curated cultural agenda and traditional ceremonies in ${singleProvinceObj.name}.`
                    : `Agenda festival kebudayaan dan upacara adat terkurasi di ${singleProvinceObj.name}.`
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
                    onClick={() => setIsAiSliderOpen(true)}
                    className="hover:text-[var(--gold)] transition-colors text-left cursor-pointer"
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

      </div> {/* End of Shifting Main Page Container */}

      {/* ======================================================== */}
      {/* 12. STICKY FLOATING BAR HALA AI TRIGGER (Kanan Bawah) */}
      {/* Karakter Animasi Murni Tanpa Kotak & Tanpa Wording */}
      {/* ======================================================== */}
      {!isAiSliderOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in zoom-in-75 slide-in-from-bottom-4 duration-300">
          <button
            type="button"
            onClick={() => {
              setIsAiSliderOpen(true);
              setActiveNav("bar-hala");
            }}
            className="relative shrink-0 p-0 m-0 bg-transparent border-0 outline-none cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-110 active:scale-95 group filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
            title={lang === "ID" ? "Buka Bar Hala AI • Tanya Budaya" : "Open Bar Hala AI • Cultural Guide"}
            aria-label="Bar Hala AI"
          >
            <BarongAvatar size={72} isActive={true} />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 13. SLIDE-IN BAR HALA AI CHAT DRAWER (Slider dari Kanan) */}
      {/* Menggeser web ke kiri saat terbuka, dan menutup kembali */}
      {/* ======================================================== */}
      {/* Mobile Backdrop Overlay */}
      {isAiSliderOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 sm:hidden animate-in fade-in duration-200"
          onClick={() => setIsAiSliderOpen(false)}
        />
      )}

      {/* Slider Drawer from Right */}
      <aside
        aria-label="Bar Hala AI Chat"
        className={`fixed top-0 bottom-0 right-0 z-50 w-full sm:w-[420px] lg:w-[460px] bg-[var(--bx-surface)]/98 backdrop-blur-2xl border-l border-[var(--bx-border)] shadow-2xl flex flex-col text-[var(--bx-ink)] transform transition-transform duration-300 ease-in-out ${
          isAiSliderOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-[var(--brand)] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <BarongAvatar size={44} isActive={true} />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[var(--brand)] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-white leading-tight">
                  Bar Hala AI
                </h3>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Aktif
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-tight">
                {lang === "ID" ? "Pemandu Etika & Budaya Nusantara" : "Heritage Guide & Local Etiquette"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setAiChatMessages([
                  {
                    sender: "ai",
                    text: DICTIONARY[lang].aiModal.greeting,
                  },
                ]);
              }}
              title={lang === "ID" ? "Bersihkan Percakapan" : "Clear Chat"}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsAiSliderOpen(false)}
              title={lang === "ID" ? "Tutup Chat" : "Close Chat"}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div className="p-2.5 sm:p-3 bg-[var(--bx-bg)] border-b border-[var(--bx-border)] flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px] shrink-0">
          <button
            type="button"
            onClick={() =>
              handleSendAiMessage(
                lang === "EN"
                  ? "What is the customary etiquette when visiting Ammatoa Kajang village in Bulukumba?"
                  : "Bagaimana etika saat berkunjung ke Desa Adat Kajang Bulukumba?"
              )
            }
            className="px-2.5 py-1 rounded-full bg-[var(--bx-surface)] hover:bg-[var(--gold)]/15 border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] whitespace-nowrap transition cursor-pointer"
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
            className="px-2.5 py-1 rounded-full bg-[var(--bx-surface)] hover:bg-[var(--gold)]/15 border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] whitespace-nowrap transition cursor-pointer"
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
            className="px-2.5 py-1 rounded-full bg-[var(--bx-surface)] hover:bg-[var(--gold)]/15 border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] whitespace-nowrap transition cursor-pointer"
          >
            {t.aiModal.promptPinisi}
          </button>
        </div>

        {/* Scrollable Chat Messages Area */}
        <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
          {aiChatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[var(--gold)] text-[var(--brand)] font-semibold rounded-br-none shadow-xs"
                    : "bg-[var(--bx-bg)] border border-[var(--bx-border)] text-[var(--bx-ink)] rounded-bl-none shadow-xs"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatMessagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-[var(--bx-surface)] border-t border-[var(--bx-border)] flex items-center gap-2 shrink-0">
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
            className="portal-submit-btn-gold !h-10 !px-3.5 !text-xs font-bold cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 14. FILTER MODAL (Bentuk Modal Saja, Multi-Check Ceklis) */}
      {/* ======================================================== */}
      {isFilterModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFilterModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter Destinasi Budaya"
            className="w-full max-w-lg rounded-2xl bg-[var(--bx-surface)] border border-[var(--bx-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[var(--brand)] text-white flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[var(--gold)]">
                  <SlidersHorizontal className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-tight">
                    {lang === "ID" ? "Filter Destinasi Budaya" : "Filter Cultural Destinations"}
                  </h3>
                  <p className="text-[11px] text-amber-200/90 leading-tight">
                    {lang === "ID"
                      ? "Pilih provinsi & kategori (bisa multi-ceklis)"
                      : "Select provinces & categories (multi-check)"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {totalActiveFilters > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-amber-300 hover:text-white underline font-semibold transition cursor-pointer"
                  >
                    {lang === "ID" ? "Reset" : "Clear"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
              {/* Section 1: Wilayah / Provinsi (Multi-check) — Tanpa Icon Sesuai Aturan Khusus */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] font-mono flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>{lang === "ID" ? "Wilayah & Provinsi" : "Region & Province"}</span>
                  </span>
                  <span className="text-[11px] text-[var(--bx-muted)] font-mono">
                    {selectedProvinces.length === 0
                      ? (lang === "ID" ? "Seluruh Indonesia (Semua)" : "All Indonesia")
                      : `${selectedProvinces.length} ${lang === "ID" ? "Dipilih" : "Selected"}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {PROVINCES_LIST.map((prov) => {
                    const isChecked = selectedProvinces.includes(prov.id);
                    const count = getProvinceCount(prov.id);
                    return (
                      <label
                        key={prov.id}
                        className={`p-2.5 sm:p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer select-none ${
                          isChecked
                            ? "bg-[var(--gold)]/15 border-[var(--gold)] shadow-xs"
                            : "bg-[var(--bx-bg)] hover:bg-[var(--gold)]/5 border-[var(--bx-border)] hover:border-[var(--gold)]/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleProvince(prov.id)}
                          className="mt-0.5 w-4 h-4 rounded text-[var(--gold)] focus:ring-[var(--gold)] border-[var(--bx-border)] cursor-pointer accent-[var(--gold)]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            {/* Nama Provinsi Murni Tanpa Ikon Sesuai Instruksi User */}
                            <span className="text-xs font-bold text-[var(--bx-ink-bright)]">
                              {prov.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--bx-surface)] border border-[var(--bx-border)] text-[var(--bx-muted)] font-mono">
                              {count}
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--bx-muted)] mt-0.5 line-clamp-1">
                            {prov.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Kategori Wisata & Warisan (Multi-check) — Termasuk Sumber Alam, Pertanian, Herbal, Laut / Ikan, Flora Fauna */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] font-mono flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>{lang === "ID" ? "Kategori Wisata & Warisan" : "Heritage Categories"}</span>
                  </span>
                  <span className="text-[11px] text-[var(--bx-muted)] font-mono">
                    {selectedCategories.length === 0
                      ? (lang === "ID" ? "Semua Terpilih" : "All Selected")
                      : `${selectedCategories.length} ${lang === "ID" ? "Dipilih" : "Selected"}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: "sumber-alam",
                      label: lang === "ID" ? "Sumber Alam" : "Natural Resources",
                      icon: Mountain,
                      color: "text-[var(--gold)]",
                      desc: lang === "ID" ? "Geologi bumi, mineral, danau vulkanik & lanskap alam" : "Geology, mineral reserves & volcanic lakes",
                    },
                    {
                      id: "pertanian",
                      label: lang === "ID" ? "Pertanian" : "Agriculture",
                      icon: Sprout,
                      color: "text-[var(--gold)]",
                      desc: lang === "ID" ? "Agrowisata, kopi gayo, terasering subak & perkebunan" : "Agrotourism, coffee, subak terraces & crops",
                    },
                    {
                      id: "herbal",
                      label: lang === "ID" ? "Herbal" : "Herbal & Jamu",
                      icon: Leaf,
                      color: "text-[var(--gold)]",
                      desc: lang === "ID" ? "Tanaman obat nusantara, jamu tradisional & usada" : "Medicinal herbs, traditional jamu & usada",
                    },
                    {
                      id: "laut",
                      label: lang === "ID" ? "Laut / Ikan" : "Marine & Fisheries",
                      icon: Waves,
                      color: "text-[var(--gold)]",
                      desc: lang === "ID" ? "Kekayaan laut, ikan karang, pelagis & pesisir bahari" : "Reef fish, marine biodiversity & coastal atolls",
                    },
                    {
                      id: "flora-fauna",
                      label: lang === "ID" ? "Flora Fauna" : "Flora & Fauna",
                      icon: Trees,
                      color: "text-[var(--gold)]",
                      desc: lang === "ID" ? "Suaka margasatwa, satwa liar & konservasi rimba" : "Endemic wildlife, orangutan, komodo & sanctuaries",
                    },
                    {
                      id: "budaya",
                      label: lang === "ID" ? "Budaya & Adat" : "Culture & Heritage",
                      icon: Landmark,
                      color: "text-[var(--gold)]",
                      desc: lang === "ID" ? "Desa adat, cagar budaya Borobudur & Pinisi UNESCO" : "Customary villages, temples & wooden shipbuilding",
                    },
                    {
                      id: "pakaian",
                      label: lang === "ID" ? "Wastra & Busana" : "Textile & Attire",
                      icon: Award,
                      color: "text-[var(--gold)]",
                      desc: lang === "ID" ? "Kain Tapis, Songket, Batik & busana tradisional" : "Traditional handwoven textiles & attire",
                    },
                  ].map((cat) => {
                    const IconComp = cat.icon;
                    const isChecked = selectedCategories.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer select-none ${
                          isChecked
                            ? "bg-[var(--gold)]/15 border-[var(--gold)] shadow-xs"
                            : "bg-[var(--bx-bg)] hover:bg-[var(--gold)]/5 border-[var(--bx-border)] hover:border-[var(--gold)]/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat.id)}
                          className="mt-0.5 w-4 h-4 rounded text-[var(--gold)] focus:ring-[var(--gold)] border-[var(--bx-border)] cursor-pointer accent-[var(--gold)]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <IconComp className={`w-3.5 h-3.5 ${cat.color} shrink-0`} />
                            <span className="text-xs font-semibold text-[var(--bx-ink-bright)] truncate">
                              {cat.label}
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--bx-muted)] mt-0.5 truncate">
                            {cat.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 bg-[var(--bx-bg)] border-t border-[var(--bx-border)] flex items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-[var(--bx-muted)]">
                <span className="font-bold text-[var(--bx-ink-bright)] font-mono">{filteredDestinations.length}</span>{" "}
                {lang === "ID" ? "destinasi cocok" : "destinations match"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[var(--bx-ink)] hover:bg-[var(--bx-surface)] border border-transparent hover:border-[var(--bx-border)] transition cursor-pointer"
                >
                  {lang === "ID" ? "Tutup" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFilterModalOpen(false);
                    const el = document.getElementById("destinasi");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="portal-submit-btn-gold !h-9 !px-4 !text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {lang === "ID"
                      ? `Terapkan (${totalActiveFilters || "Semua"})`
                      : `Apply (${totalActiveFilters || "All"})`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
