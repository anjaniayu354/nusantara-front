"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  MapPin,
  Route,
  ChevronDown,
  SlidersHorizontal,
  Layers,
  Waves,
  Mountain,
  Trees,
  Sprout,
  Landmark,
  Shirt,
  Home,
  CalendarDays,
} from "lucide-react";
import { DESTINATIONS, CulturalDestination, Category } from "@/data/destinations";
import { BarongAvatar } from "./BarongAvatar";

interface SearchWidgetProps {
  selectedCategory: Category | "all";
  onSelectCategory: (cat: Category | "all") => void;
  tripItemCount: number;
  onOpenTripPlanner: () => void;
  onSelectDestination: (dest: CulturalDestination) => void;
  onOpenAiConcierge: () => void;
  isAiConciergeOpen?: boolean;
  language?: "ID" | "EN";
}

export interface CategoryOption {
  id: Category | "all";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryOption[] = [
  { id: "all", label: "Semua", icon: Layers },
  { id: "laut", label: "Wisata Laut", icon: Waves },
  { id: "darat", label: "Wisata Darat", icon: MapPin },
  { id: "gunung", label: "Wisata Gunung", icon: Mountain },
  { id: "hutan", label: "Wisata Hutan", icon: Trees },
  { id: "pertanian", label: "Hasil Pertanian", icon: Sprout },
  { id: "budaya", label: "Budaya Tradisi", icon: Landmark },
  { id: "pakaian", label: "Pakaian Adat", icon: Shirt },
  { id: "desa", label: "Desa Adat", icon: Home },
  { id: "festival", label: "Event Budaya", icon: CalendarDays },
];

export function SearchWidget({
  selectedCategory,
  onSelectCategory,
  tripItemCount,
  onOpenTripPlanner,
  onSelectDestination,
  onOpenAiConcierge,
  isAiConciergeOpen = false,
  language = "ID",
}: SearchWidgetProps) {
  const [query, setQuery] = useState("");
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  return (
    <div
      ref={containerRef}
      className="absolute top-4 right-4 z-20 flex items-center gap-2 max-w-[95vw] select-none"
    >
      {/* Unified Floating Bar: Trip Icon | Flat Icon Dropdown Filter | Search Bar */}
      <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-2xl px-2.5 py-1.5 shadow-2xl text-white">
        {/* Trip Plan: Icon Only Button */}
        <button
          type="button"
          onClick={onOpenTripPlanner}
          aria-label="Rencana Perjalanan (Trip Plan)"
          title="Rencana Perjalanan (Trip Plan)"
          className="relative p-2 rounded-xl text-amber-300 hover:text-amber-200 hover:bg-white/10 active:scale-95 transition"
        >
          <Route className="w-4 h-4" />
          {tripItemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] shadow-md">
              {tripItemCount}
            </span>
          )}
        </button>

        {/* Separator between Trip Icon and Filter Dropdown */}
        <div className="w-px h-5 bg-white/20 mx-1.5 shrink-0" />

        {/* Dropdown Filter: Flat Icon Only / Crisp Flat UI */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-label="Filter Kategori"
            title={`Filter Kategori: ${activeCategory.label}`}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-white/10 text-xs font-medium text-slate-200 transition group"
          >
            {/* Flat Sliders / Filter Icon */}
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:rotate-180 transition-transform duration-300" />
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <ActiveIcon className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="hidden sm:inline text-xs">{activeCategory.label}</span>
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Flat Icon Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 min-w-[190px] bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-xl p-1.5 shadow-2xl z-30 max-h-80 overflow-y-auto">
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
                      className={`w-4 h-4 shrink-0 ${isSelected ? "text-amber-400" : "text-slate-400"}`}
                    />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Separator between Filter and Search Input */}
        <div className="w-px h-5 bg-white/20 mx-1.5 shrink-0" />

        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
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
                ? "Cari Bulukumba, Lampung, kopi, tapis..."
                : "Search Bulukumba, Lampung, coffee, tapis..."
            }
            className="w-32 sm:w-52 md:w-64 bg-transparent text-xs text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsAutocompleteOpen(false);
              }}
              aria-label="Bersihkan pencarian"
              className="text-slate-400 hover:text-white p-1 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {isAutocompleteOpen && filtered.length > 0 && (
            <div className="absolute top-full mt-3 right-0 w-72 sm:w-80 md:w-96 bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-2xl p-2 shadow-2xl max-h-72 overflow-y-auto z-40">
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
                        <span key={t} className="text-[9px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded">
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
      </div>

      {/* Bar Hala Ai Trigger Button (Barong Character Icon without Box, Animated with Interactive Eyes & 2-Layer Wavy Shadow) */}
      <button
        type="button"
        onClick={onOpenAiConcierge}
        aria-label="Buka Bar Hala Ai"
        title="Bar Hala Ai • Kurasi & Panduan Budaya Nusantara"
        className="relative shrink-0 p-0 m-0 bg-transparent border-0 outline-none cursor-pointer focus:outline-none transition-transform duration-200 active:scale-95 group"
      >
        <BarongAvatar size={72} isActive={isAiConciergeOpen} />
      </button>
    </div>
  );
}
