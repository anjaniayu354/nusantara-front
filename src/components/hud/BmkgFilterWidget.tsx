"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Zap,
  Radio,
  MapPin,
  Train,
  Satellite,
  Wind,
  Ship,
  ChevronUp,
  Check,
  Layers,
  X,
  Info,
} from "lucide-react";
import {
  BMKG_LAYERS,
  BmkgLayerOptions,
  BmkgLayerDefinition,
} from "@/data/bmkgLayers";

interface BmkgFilterWidgetProps {
  bmkgLayers: BmkgLayerOptions;
  onToggleLayer: (key: keyof BmkgLayerOptions) => void;
  onSetAllLayers?: (active: boolean) => void;
  language?: "ID" | "EN";
  isLoading?: boolean;
}

export function BmkgFilterWidget({
  bmkgLayers,
  onToggleLayer,
  onSetAllLayers,
  language = "ID",
  isLoading = false,
}: BmkgFilterWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close drop-up on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Count active layers
  const activeCount = Object.values(bmkgLayers).filter(Boolean).length;

  const renderLayerIcon = (iconName: BmkgLayerDefinition["iconName"], colorHex: string) => {
    const className = "w-4 h-4 shrink-0";
    switch (iconName) {
      case "zap":
        return <Zap className={className} style={{ color: colorHex }} />;
      case "radio":
        return <Radio className={className} style={{ color: colorHex }} />;
      case "mapPin":
        return <MapPin className={className} style={{ color: colorHex }} />;
      case "train":
        return <Train className={className} style={{ color: colorHex }} />;
      case "satellite":
        return <Satellite className={className} style={{ color: colorHex }} />;
      case "wind":
        return <Wind className={className} style={{ color: colorHex }} />;
      case "ship":
        return <Ship className={className} style={{ color: colorHex }} />;
      default:
        return <Layers className={className} style={{ color: colorHex }} />;
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Footer Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Filter Lapisan Cuaca BMKG"
        aria-expanded={isOpen}
        title="Buka Filter Data Cuaca & Sensor BMKG SATU PETA"
        className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all duration-200 active:scale-95 ${
          isOpen || activeCount > 0
            ? "bg-[var(--gold)]/15 border-[var(--gold)] text-[var(--gold)] shadow-xs"
            : "bg-[var(--bx-bg)] hover:bg-[var(--bx-surface-card)] border-[var(--bx-border)] text-[var(--bx-ink)]"
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          {isLoading && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          )}
        </div>

        <span className="font-bold tracking-tight text-[11px] sm:text-xs">
          Filter BMKG
        </span>

        {activeCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full bg-[var(--gold)] text-slate-950 font-black text-[10px] leading-tight">
            {activeCount}
          </span>
        )}

        <ChevronUp
          className={`w-3.5 h-3.5 text-[var(--bx-muted)] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROP-UP MENU (extends upward from footer) */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Filter Cuaca BMKG"
          className="absolute bottom-full mb-2.5 left-0 sm:left-auto sm:right-0 w-[300px] xs:w-[330px] sm:w-[360px] max-h-[80vh] overflow-hidden rounded-2xl bg-[var(--bx-surface-card)]/98 backdrop-blur-2xl border border-[var(--bx-border-bright)] shadow-2xl z-50 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200 select-none text-[var(--bx-ink)]"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-[var(--bx-border)] flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-transparent to-sky-500/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--gold)]/20 border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)]">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--bx-ink-bright)]">
                    Filter BMKG SATU PETA
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold uppercase">
                    Live Telemetry
                  </span>
                </div>
                <p className="text-[10px] text-[var(--bx-muted)]">
                  Pilih lapisan data cuaca & keselamatan di peta
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-[var(--bx-muted)] hover:text-[var(--bx-ink-bright)] hover:bg-[var(--bx-border)] transition"
              aria-label="Tutup Filter"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Category Summary / Status bar */}
          <div className="px-3 py-1.5 bg-[var(--bx-bg)]/80 border-b border-[var(--bx-border)] flex items-center justify-between text-[10px]">
            <span className="text-[var(--bx-muted)]">
              Aktif:{" "}
              <strong className="text-[var(--gold)]">{activeCount}</strong> dari{" "}
              {BMKG_LAYERS.length} lapisan
            </span>
            <div className="flex items-center gap-2">
              {onSetAllLayers && (
                <>
                  <button
                    type="button"
                    onClick={() => onSetAllLayers(true)}
                    className="text-sky-500 hover:text-sky-400 font-semibold transition"
                  >
                    Semua
                  </button>
                  <span className="text-[var(--bx-border-bright)]">•</span>
                  <button
                    type="button"
                    onClick={() => onSetAllLayers(false)}
                    className="text-[var(--bx-muted)] hover:text-rose-400 font-semibold transition"
                  >
                    Matikan
                  </button>
                </>
              )}
            </div>
          </div>

          {/* List of BMKG Layers with Toggles */}
          <div className="p-2 sm:p-2.5 overflow-y-auto space-y-1.5 max-h-[340px] custom-scrollbar">
            {BMKG_LAYERS.map((layer) => {
              const isEnabled = bmkgLayers[layer.id];

              return (
                <div
                  key={layer.id}
                  onClick={() => onToggleLayer(layer.id)}
                  className={`group relative p-2.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-2.5 ${
                    isEnabled
                      ? "bg-[var(--bx-bg)]/90 border-[var(--gold)]/70 shadow-xs"
                      : "bg-[var(--bx-bg)]/40 hover:bg-[var(--bx-bg)]/80 border-[var(--bx-border)] opacity-85 hover:opacity-100"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${layer.colorHex}20`,
                      borderColor: `${layer.colorHex}40`,
                      borderWidth: 1,
                    }}
                  >
                    {renderLayerIcon(layer.iconName, layer.colorHex)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-[var(--bx-ink-bright)] truncate">
                        {layer.name}
                      </span>
                      <span
                        className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold shrink-0"
                        style={{
                          backgroundColor: `${layer.colorHex}15`,
                          color: layer.colorHex,
                        }}
                      >
                        {layer.badge}
                      </span>
                    </div>
                    <p className="text-[10.5px] leading-snug text-[var(--bx-muted)] mt-0.5 line-clamp-2">
                      {layer.description}
                    </p>
                  </div>

                  {/* Switch indicator */}
                  <div
                    className={`mt-1 w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                      isEnabled ? "bg-[var(--gold)] justify-end" : "bg-slate-700/60 justify-start"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform ${
                        isEnabled ? "text-[var(--gold)]" : "text-transparent"
                      }`}
                    >
                      {isEnabled && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-2.5 border-t border-[var(--bx-border)] bg-[var(--bx-bg)]/60 flex items-center gap-1.5 text-[10px] text-[var(--bx-muted)]">
            <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              Data sinkron dari BMKG SATU PETA MKG & Inawis Maritim.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
