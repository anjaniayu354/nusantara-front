"use client";

import React from "react";
import { Compass, Globe, Sparkles, MapPin, Calendar, Layers, ShieldCheck } from "lucide-react";
import { Category } from "@/data/destinations";

interface BrandWidgetProps {
  selectedCategory: Category | "all";
  onSelectCategory: (cat: Category | "all") => void;
  currency: "IDR" | "USD";
  onToggleCurrency: () => void;
  language: "ID" | "EN";
  onToggleLanguage: () => void;
  tripItemCount: number;
  onOpenTripPlanner: () => void;
}

export function BrandWidget({
  selectedCategory,
  onSelectCategory,
  currency,
  onToggleCurrency,
  language,
  onToggleLanguage,
  tripItemCount,
  onOpenTripPlanner,
}: BrandWidgetProps) {
  const categories: { id: Category | "all"; label: string; icon: string }[] = [
    { id: "all", label: language === "ID" ? "Semua" : "All", icon: "🧭" },
    { id: "budaya", label: language === "ID" ? "Budaya" : "Culture", icon: "🎭" },
    { id: "desa", label: language === "ID" ? "Desa Adat" : "Heritage Village", icon: "🌾" },
    { id: "gunung", label: language === "ID" ? "Gunung" : "Mountain", icon: "⛰️" },
    { id: "pantai", label: language === "ID" ? "Pantai" : "Coast & Beach", icon: "🏖️" },
  ];

  return (
    <div className="fixed top-4 left-4 z-20 flex flex-col gap-2 max-w-sm sm:max-w-md select-none">
      {/* Brand Card with Glassmorphic Gradient */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-2xl p-3.5 shadow-2xl text-white">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
              <Compass className="w-6 h-6 text-slate-950 animate-spin" style={{ animationDuration: "25s" }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                  Nusa Antara
                </h1>
                <span className="text-[9px] uppercase tracking-wider bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded-full border border-amber-500/30">
                  OSM Live
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                {language === "ID"
                  ? "Peta Petualangan Budaya Nusantara"
                  : "Nusantara Cultural Adventure Map"}
              </p>
            </div>
          </div>

          {/* Quick Language & Currency Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleLanguage}
              title="Alih Bahasa (ID / EN)"
              className="text-[11px] font-bold px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 transition"
            >
              {language}
            </button>
            <button
              onClick={onToggleCurrency}
              title="Alih Mata Uang (IDR / USD)"
              className="text-[11px] font-bold px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition"
            >
              {currency}
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((c) => {
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCategory(c.id)}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30"
                    : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Trip Planner Trigger Pill */}
      <button
        onClick={onOpenTripPlanner}
        className="self-start flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-slate-800 transition shadow-xl"
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black">
          {tripItemCount}
        </span>
        <span>
          {language === "ID" ? "Rencana Perjalanan (Trip Plan)" : "Trip Planner Itinerary"}
        </span>
      </button>
    </div>
  );
}
