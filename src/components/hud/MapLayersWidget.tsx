"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Layers,
  Navigation,
  Satellite,
  Mountain,
  Spline,
  Moon,
  Waves,
  ChevronUp,
  ChevronDown,
  Check,
  Tag,
  Radio,
  SlidersHorizontal,
  X,
  Compass,
} from "lucide-react";
import {
  MapBaseStyle,
  MapLayerOptions,
  MAP_STYLES,
  MapStyleDefinition,
} from "@/data/mapStyles";

interface MapLayersWidgetProps {
  mapStyle: MapBaseStyle;
  onSelectMapStyle: (style: MapBaseStyle) => void;
  layerOptions: MapLayerOptions;
  onToggleLayerOption: (key: keyof MapLayerOptions) => void;
  language?: "ID" | "EN";
}

function getStyleIcon(iconName: MapStyleDefinition["iconName"]) {
  switch (iconName) {
    case "navigation":
      return <Navigation className="w-4 h-4" />;
    case "satellite":
      return <Satellite className="w-4 h-4" />;
    case "mountain":
      return <Mountain className="w-4 h-4" />;
    case "spline":
      return <Spline className="w-4 h-4" />;
    case "moon":
      return <Moon className="w-4 h-4" />;
    case "waves":
    default:
      return <Waves className="w-4 h-4" />;
  }
}

export function MapLayersWidget({
  mapStyle,
  onSelectMapStyle,
  layerOptions,
  onToggleLayerOption,
  language = "ID",
}: MapLayersWidgetProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close drop-up on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const currentDef =
    MAP_STYLES.find((s) => s.id === mapStyle) || MAP_STYLES[0];

  const activeOverlayCount = Object.values(layerOptions).filter(Boolean).length;

  return (
    <div
      ref={containerRef}
      className="relative select-none pointer-events-auto"
      role="region"
      aria-label="Pilihan Peta dan Lapisan"
    >
      {/* ============================================================ */}
      {/* FLOATING DROP-UP PANEL (Opens Upwards Above Dock)            */}
      {/* ============================================================ */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Panel Pengaturan Peta dan Lapisan"
          className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 w-[340px] sm:w-[410px] bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl text-white z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-amber-100 leading-tight">
                  {language === "ID"
                    ? "Pilihan Gaya Peta"
                    : "Map Style & Layers"}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {language === "ID"
                    ? "Ganti gaya tampilan & aktifkan lapisan kontur"
                    : "Switch base map & activate contour overlays"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Tutup panel"
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Base Map Modes (Peta Dasar) */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 flex items-center gap-1.5">
                <Compass className="w-3 h-3" />
                {language === "ID" ? "Gaya Peta Dasar" : "Base Map Style"}
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                {currentDef.shortName}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
              {MAP_STYLES.map((style) => {
                const isActive = style.id === mapStyle;
                return (
                  <button
                    key={style.id}
                    onClick={() => {
                      onSelectMapStyle(style.id);
                    }}
                    className={`relative p-2 rounded-xl text-left transition-all duration-200 flex flex-col justify-between border cursor-pointer group ${
                      isActive
                        ? "bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/60 shadow-lg shadow-amber-500/10"
                        : "bg-slate-950/70 border-white/10 text-slate-300 hover:bg-slate-800/80 hover:border-amber-500/30 hover:text-white"
                    }`}
                  >
                    {/* Top Row: Icon & Badge */}
                    <div className="flex items-center justify-between w-full mb-1">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                          isActive
                            ? "bg-amber-400 text-slate-950 font-bold"
                            : "bg-slate-800 text-amber-300 group-hover:bg-amber-500/20"
                        }`}
                      >
                        {getStyleIcon(style.iconName)}
                      </div>
                      <span
                        className={`text-[8px] font-mono px-1 py-0.2 rounded border ${
                          isActive
                            ? "border-amber-400/50 text-amber-300 bg-amber-400/10"
                            : "border-white/10 text-slate-400"
                        }`}
                      >
                        {style.badge}
                      </span>
                    </div>

                    {/* Bottom: Name & Active Indicator */}
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`text-[11px] font-bold truncate ${
                          isActive ? "text-amber-300" : "text-slate-200"
                        }`}
                      >
                        {style.shortName}
                      </span>
                      {isActive && (
                        <Check className="w-3 h-3 text-amber-400 shrink-0 ml-1" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Overlays & Extra Features (Lapisan Tambahan) */}
          <div className="pt-2.5 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3 h-3" />
                {language === "ID"
                  ? "Lapisan Tambahan (Overlays)"
                  : "Active Overlays"}
              </span>
              <span className="text-[9px] text-amber-400/80 font-mono">
                {activeOverlayCount} {language === "ID" ? "aktif" : "active"}
              </span>
            </div>

            <div className="space-y-1.5">
              {/* 1. Contour / Isoline Overlay */}
              <button
                type="button"
                onClick={() => onToggleLayerOption("contourOverlay")}
                className={`w-full p-2 rounded-xl transition flex items-center justify-between border cursor-pointer text-left ${
                  layerOptions.contourOverlay
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
                    : "bg-slate-950/50 border-white/5 text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      layerOptions.contourOverlay
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Spline className="w-3 h-3" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-100 truncate">
                      {language === "ID"
                        ? "Garis Kontur & Elevasi"
                        : "Contour & Elevation Lines"}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      {language === "ID"
                        ? "Kurva ketinggian topografi SRTM berulang"
                        : "SRTM topographic isoline curves"}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                    layerOptions.contourOverlay ? "bg-emerald-500" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      layerOptions.contourOverlay ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>

              {/* 2. City & Road Labels Overlay */}
              <button
                type="button"
                onClick={() => onToggleLayerOption("labelsOverlay")}
                className={`w-full p-2 rounded-xl transition flex items-center justify-between border cursor-pointer text-left ${
                  layerOptions.labelsOverlay
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
                    : "bg-slate-950/50 border-white/5 text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      layerOptions.labelsOverlay
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-100 truncate">
                      {language === "ID"
                        ? "Label Tempat, Kota & Jalan"
                        : "Place, City & Road Labels"}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      {language === "ID"
                        ? "Nama wilayah, toponimi & batas administratif"
                        : "Administrative labels & toponyms"}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                    layerOptions.labelsOverlay ? "bg-amber-500" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      layerOptions.labelsOverlay ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>

              {/* 3. Maritime Sea Marks Overlay */}
              <button
                type="button"
                onClick={() => onToggleLayerOption("seaMarksOverlay")}
                className={`w-full p-2 rounded-xl transition flex items-center justify-between border cursor-pointer text-left ${
                  layerOptions.seaMarksOverlay
                    ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-200"
                    : "bg-slate-950/50 border-white/5 text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      layerOptions.seaMarksOverlay
                        ? "bg-cyan-400 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Waves className="w-3 h-3" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-100 truncate">
                      {language === "ID"
                        ? "Navigasi Bahari & Mercusuar"
                        : "Maritime & Seamark Navigation"}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      {language === "ID"
                        ? "OpenSeaMap: tanda suar, terumbu & alur laut"
                        : "OpenSeaMap seamarks & nautical channels"}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                    layerOptions.seaMarksOverlay ? "bg-cyan-500" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      layerOptions.seaMarksOverlay ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>

              {/* 4. Cultural Event Radar */}
              <button
                type="button"
                onClick={() => onToggleLayerOption("culturalRadar")}
                className={`w-full p-2 rounded-xl transition flex items-center justify-between border cursor-pointer text-left ${
                  layerOptions.culturalRadar
                    ? "bg-rose-500/15 border-rose-500/40 text-rose-200"
                    : "bg-slate-950/50 border-white/5 text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      layerOptions.culturalRadar
                        ? "bg-rose-500 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Radio className="w-3 h-3" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-100 truncate">
                      {language === "ID"
                        ? "Radar Event Budaya Berdenyut"
                        : "Pulsing Cultural Event Radar"}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      {language === "ID"
                        ? "Suar festival & upacara adat aktif di peta"
                        : "Active festival & ritual beacons"}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                    layerOptions.culturalRadar ? "bg-rose-500" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      layerOptions.culturalRadar ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* INTEGRATED FOOTER SECTION                                     */}
      {/* ============================================================ */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-white">
        {/* Main Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={
            isOpen ? "Tutup pilihan gaya peta" : "Buka pilihan gaya peta"
          }
          className="flex items-center gap-1.5 sm:gap-2 px-1.5 py-1 rounded-md hover:bg-white/10 transition group cursor-pointer"
          title="Pilihan Gaya Peta & Lapisan Kontur (Buka Menu Atas)"
        >
          <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 group-hover:scale-105 transition shrink-0">
            <Layers className="w-3 h-3" />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold hidden md:inline">
              {language === "ID" ? "Peta:" : "Map:"}
            </span>
            <span className="text-xs font-bold text-amber-200">
              {currentDef.shortName}
            </span>
          </div>

          <div className="text-slate-400 group-hover:text-amber-300 transition">
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </div>
        </button>

        <div className="w-px h-3.5 bg-white/20 shrink-0 hidden sm:block" />

        {/* Quick Flat Icon Buttons for Instant One-Click Switching */}
        <div className="hidden sm:flex items-center gap-1">
          {MAP_STYLES.slice(0, 5).map((style) => {
            const isActive = style.id === mapStyle;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onSelectMapStyle(style.id)}
                title={`Pilih mode ${style.name}`}
                aria-label={`Pilih mode ${style.name}`}
                className={`p-1 sm:px-1.5 sm:py-0.5 rounded-md text-[10px] font-medium transition flex items-center gap-1 ${
                  isActive
                    ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                    : "text-slate-300 hover:text-amber-200 hover:bg-white/10"
                }`}
              >
                {getStyleIcon(style.iconName)}
                <span className="hidden xl:inline">{style.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Contour Overlay Quick Indicator */}
        {layerOptions.contourOverlay && (
          <span
            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hidden lg:inline-flex items-center gap-1"
            title="Lapisan kontur aktif"
          >
            <Spline className="w-2.5 h-2.5" /> Kontur
          </span>
        )}
      </div>
    </div>
  );
}
