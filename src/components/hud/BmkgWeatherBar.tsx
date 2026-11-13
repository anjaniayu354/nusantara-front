"use client";

import React from "react";
import { CloudSun, Waves, ShieldAlert, ShieldCheck, Radio, AlertTriangle, Wind } from "lucide-react";
import { CULTURAL_EVENTS } from "@/data/culturalEvents";
import { CulturalDestination } from "@/data/destinations";

interface BmkgWeatherBarProps {
  activeDestination?: CulturalDestination | null;
  language: "ID" | "EN";
  onSelectEventLocation?: (coords: [number, number]) => void;
}

export function BmkgWeatherBar({
  activeDestination,
  language,
  onSelectEventLocation,
}: BmkgWeatherBarProps) {
  // Use active destination's BMKG data or standard Yogyakarta/Nusantara baseline
  const weather = activeDestination?.bmkgStation || {
    name: "Stasiun Klimatologi Yogyakarta / DIY",
    temperature: 29,
    condition: "Cerah Berawan",
    humidity: 76,
    windSpeedKmh: 14,
    waveHeightMeters: 1.2,
    safetyStatus: "AMAN" as const,
  };

  const primaryEvent = CULTURAL_EVENTS[0]; // e.g. Labuhan Merapi (Active)

  const getSafetyBadge = (status: "AMAN" | "WASPADA" | "TUNDA") => {
    switch (status) {
      case "AMAN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            🟢 {language === "ID" ? "Indeks Wisata: AMAN" : "Safety: SAFE"}
          </span>
        );
      case "WASPADA":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px]">
            🟡 {language === "ID" ? "Indeks Wisata: WASPADA" : "Safety: CAUTION"}
          </span>
        );
      case "TUNDA":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-[10px]">
            🔴 {language === "ID" ? "Indeks Wisata: TUNDA" : "Safety: DELAY"}
          </span>
        );
    }
  };

  return (
    <aside
      aria-label="Informasi Cuaca BMKG dan Radar Event Budaya"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20 w-[95vw] max-w-4xl select-none"
    >
      <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-2xl p-2.5 sm:px-4 sm:py-2.5 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs">
          {/* Left: BMKG Telemetry */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span>BMKG SATU PETA MKG:</span>
            </div>
            <span className="text-slate-300">
              {weather.name.split("/")[0]}
            </span>
            <span className="font-mono font-bold text-white">
              {weather.temperature}°C
            </span>
            <span className="text-slate-300">
              {weather.condition}
            </span>
            <div className="flex items-center gap-1 text-sky-300">
              <Waves className="w-3.5 h-3.5" />
              <span>Gelombang: {weather.waveHeightMeters}m</span>
            </div>
            {getSafetyBadge(weather.safetyStatus)}
          </div>

          {/* Right: Pulsing Cultural Event Radar */}
          <div
            className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/10 pt-1.5 md:pt-0 md:pl-3 cursor-pointer hover:text-amber-300 transition"
            onClick={() => onSelectEventLocation && onSelectEventLocation(primaryEvent.coordinates)}
            title="Klik untuk pusatkan peta ke event budaya ini"
          >
            <div className="relative flex items-center justify-center">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                📡 Radar:
              </span>
              <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-[280px]">
                {primaryEvent.name}
              </span>
              <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">
                {primaryEvent.daysRemaining === 0 ? "HARI INI" : `${primaryEvent.daysRemaining} HARI LAGI`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
