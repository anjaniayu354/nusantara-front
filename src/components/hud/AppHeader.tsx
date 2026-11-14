"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Route,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  ChevronDown,
  Search,
  X,
  MapPin,
  Waves,
  Mountain,
  Trees,
  Sprout,
  Landmark,
  Shirt,
  Home,
  CalendarDays,
  Layers,
  Sparkles,
  Leaf,
} from "lucide-react";
import { DESTINATIONS, CulturalDestination, Category } from "@/data/destinations";
import { BarongAvatar } from "./BarongAvatar";

export interface CategoryOption {
  id: Category | "all";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryOption[] = [
  { id: "all", label: "Semua Kategori", icon: Layers },
  { id: "sumber-alam", label: "Sumber Alam", icon: Mountain },
  { id: "pertanian", label: "Pertanian", icon: Sprout },
  { id: "herbal", label: "Herbal & Jamu", icon: Leaf },
  { id: "laut", label: "Laut / Ikan", icon: Waves },
  { id: "flora-fauna", label: "Flora Fauna", icon: Trees },
  { id: "budaya", label: "Budaya Tradisi", icon: Landmark },
  { id: "pakaian", label: "Pakaian Adat", icon: Shirt },
  { id: "desa", label: "Desa Adat", icon: Home },
  { id: "festival", label: "Event Budaya", icon: CalendarDays },
];

interface AppHeaderProps {
  isSideMenuOpen: boolean;
  onToggleSideMenu: () => void;
  selectedCategory: Category | "all";
  onSelectCategory: (cat: Category | "all") => void;
  tripItemCount: number;
  onOpenTripPlanner: () => void;
  isTripPlannerOpen?: boolean;
  onSelectDestination: (dest: CulturalDestination) => void;
  onOpenAiConcierge: () => void;
  isAiConciergeOpen?: boolean;
  language?: "ID" | "EN";
}

export function AppHeader({
  isSideMenuOpen,
  onToggleSideMenu,
  selectedCategory,
  onSelectCategory,
  tripItemCount,
  onOpenTripPlanner,
  isTripPlannerOpen = false,
  onSelectDestination,
  onOpenAiConcierge,
  isAiConciergeOpen = false,
  language = "ID",
}: AppHeaderProps) {
  const [query, setQuery] = useState("");
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const activeCategory =
    CATEGORIES.find((c) => c.id === selectedCategory) ||
    CATEGORIES.find((c) => (selectedCategory === "pantai" ? c.id === "laut" : false)) ||
    CATEGORIES[0];

  const ActiveIcon = activeCategory.icon;

  const filtered = query.trim()
    ? DESTINATIONS.filter((d) => {
        const q = query.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.subtitle.toLowerCase().includes(q) ||
          d.province.toLowerCase().includes(q) ||
          (d.subCategory && d.subCategory.toLowerCase().includes(q)) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          d.description.toLowerCase().includes(q) ||
          (d.agriculturalProducts && d.agriculturalProducts.some((p) => p.toLowerCase().includes(q))) ||
          (d.traditionalAttire &&
            (d.traditionalAttire.name.toLowerCase().includes(q) ||
              d.traditionalAttire.wastraType.toLowerCase().includes(q))) ||
          (d.culturalTraditions && d.culturalTraditions.some((t) => t.toLowerCase().includes(q))) ||
          (d.culturalEvents && d.culturalEvents.some((e) => e.toLowerCase().includes(q)))
        );
      })
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsAutocompleteOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync fullscreen state
  useEffect(() => {
    const updateFullscreenState = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    updateFullscreenState();
    document.addEventListener("fullscreenchange", updateFullscreenState);
    document.addEventListener("webkitfullscreenchange", updateFullscreenState);
    document.addEventListener("mozfullscreenchange", updateFullscreenState);
    document.addEventListener("MSFullscreenChange", updateFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenState);
      document.removeEventListener("webkitfullscreenchange", updateFullscreenState);
      document.removeEventListener("mozfullscreenchange", updateFullscreenState);
      document.removeEventListener("MSFullscreenChange", updateFullscreenState);
    };
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      const isCurrentlyFs = Boolean(
        document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
      );

      if (!isCurrentlyFs) {
        const docEl = document.documentElement as any;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        }
      } else {
        const doc = document as any;
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle failed:", err);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-30 h-14 bg-slate-950/95 backdrop-blur-xl border-b border-amber-500/30 px-3 sm:px-4 flex items-center justify-between text-white select-none">
      {/* Left Group: Minimize Menu Button, Divider & Logo Branding */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Minimize / Toggle Side Menu Button ("di header ada minimize menu") */}
        <button
          type="button"
          onClick={onToggleSideMenu}
          aria-label={isSideMenuOpen ? "Minimize menu navigasi" : "Buka menu navigasi pohon"}
          title={isSideMenuOpen ? "Minimize Menu" : "Buka Tree Menu"}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition active:scale-95 shadow-md ${
            isSideMenuOpen
              ? "bg-amber-500/20 border-amber-400 text-amber-300 hover:bg-amber-500/30"
              : "bg-slate-900/90 border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white"
          }`}
        >
          {isSideMenuOpen ? (
            <PanelLeftClose className="w-4 h-4 text-amber-400" />
          ) : (
            <PanelLeftOpen className="w-4 h-4 text-amber-400" />
          )}
          <span className="hidden sm:inline text-xs font-bold">
            {isSideMenuOpen ? "Minimize" : "Menu"}
          </span>
        </button>

        {/* Vertical Separator */}
        <div className="w-px h-5 bg-white/20 shrink-0 hidden xs:block" />

        {/* Brand Logo & Title */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group cursor-pointer"
          title="Nusa Antara — Peta Petualangan Budaya"
        >
          <img
            src="/mandala.png"
            alt="Logo Mandala Nusa Antara"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)] transition-transform duration-700 ease-out group-hover:rotate-90 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <h1 className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-wider font-sans">
              NUSA ANTARA
            </h1>
            <span className="text-[10px] text-slate-400 hidden md:block -mt-0.5 font-medium">
              Peta Petualangan & Budaya
            </span>
          </div>
        </Link>
      </div>

      {/* Right Group: Fullscreen, Trip Plan, Category Filter, Search Bar & Bar Hala Ai Avatar */}
      <div
        ref={containerRef}
        className="flex items-center gap-2 shrink-0 max-w-[70vw] sm:max-w-none"
      >
        {/* Full Screen Mode Button */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          aria-label={isFullscreen ? "Keluar Mode Layar Penuh" : "Mode Layar Penuh (Full Screen)"}
          title={isFullscreen ? "Keluar Layar Penuh (Esc)" : "Mode Layar Penuh (Full Screen)"}
          className={`relative flex items-center justify-center p-2 rounded-xl active:scale-95 shadow-md transition shrink-0 ${
            isFullscreen
              ? "bg-amber-500/25 border border-amber-400 text-amber-200"
              : "bg-slate-900/90 border border-amber-500/30 text-amber-300 hover:text-amber-200 hover:bg-slate-800/90 hover:border-amber-400"
          }`}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        {/* 1. Trip Plan Button */}
        <button
          type="button"
          onClick={onOpenTripPlanner}
          aria-label="Rencana Perjalanan (Trip Plan)"
          title="Rencana Perjalanan (Trip Plan)"
          className={`relative flex items-center justify-center p-2 rounded-xl active:scale-95 shadow-md transition shrink-0 ${
            isTripPlannerOpen
              ? "bg-amber-500/25 border border-amber-400 text-amber-200"
              : "bg-slate-900/90 border border-amber-500/30 text-amber-300 hover:text-amber-200 hover:bg-slate-800/90 hover:border-amber-400"
          }`}
        >
          <Route className="w-4 h-4" />
          {tripItemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] shadow-md">
              {tripItemCount}
            </span>
          )}
        </button>

        {/* 2. Dropdown Filter Button */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-label="Filter Kategori"
            title={`Filter Kategori: ${activeCategory.label}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/90 border border-amber-500/30 rounded-xl hover:bg-slate-800/90 hover:border-amber-400 text-xs font-medium text-slate-200 shadow-md transition group"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:rotate-180 transition-transform duration-300" />
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <ActiveIcon className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="hidden lg:inline text-xs">{activeCategory.label}</span>
            </span>
            <ChevronDown
              className={`w-3 h-3 text-slate-400 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Flat Icon Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 sm:left-0 min-w-[190px] bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-xl p-1.5 shadow-2xl z-40 max-h-80 overflow-y-auto">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected =
                  selectedCategory === cat.id ||
                  (cat.id === "laut" && selectedCategory === "pantai");

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-left transition ${
                      isSelected
                        ? "bg-amber-500/20 text-amber-300 font-bold"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? "text-amber-400" : "text-slate-400"
                      }`}
                    />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Search Bar with Autocomplete */}
        <div className="relative flex items-center bg-slate-900/90 border border-amber-500/30 rounded-xl px-2.5 py-1.5 shadow-md text-white shrink-0">
          <Search className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsAutocompleteOpen(true);
            }}
            onFocus={() => setIsAutocompleteOpen(true)}
            placeholder={
              language === "ID"
                ? "Cari Bulukumba, Lampung, kopi..."
                : "Search Bulukumba, Lampung, coffee..."
            }
            className="w-24 sm:w-36 md:w-48 bg-transparent text-xs text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsAutocompleteOpen(false);
              }}
              aria-label="Bersihkan pencarian"
              className="text-slate-400 hover:text-white p-0.5 ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {isAutocompleteOpen && filtered.length > 0 && (
            <div className="absolute top-full mt-2.5 right-0 w-72 sm:w-80 md:w-96 bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-2xl p-2 shadow-2xl max-h-72 overflow-y-auto z-50">
              {filtered.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onSelectDestination(d);
                    setIsAutocompleteOpen(false);
                    setQuery("");
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-white/10 flex items-start gap-2.5 transition text-white"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-amber-300 truncate">{d.name}</p>
                    <p className="text-[10px] text-slate-300 truncate">
                      {d.province} • {d.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {d.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[9px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Bar Hala Ai Avatar (Interactive eyes, 2-layer waves, click opens chat) */}
        <button
          type="button"
          onClick={onOpenAiConcierge}
          aria-label="Buka Bar Hala Ai"
          title="Bar Hala Ai • Panduan Budaya Nusantara"
          className="relative shrink-0 p-0 m-0 bg-transparent border-0 outline-none cursor-pointer focus:outline-none transition-transform duration-200 active:scale-95 group"
        >
          <BarongAvatar size={56} isActive={isAiConciergeOpen} />
        </button>
      </div>
    </header>
  );
}
