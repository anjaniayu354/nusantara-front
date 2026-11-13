"use client";

import React, { useMemo } from "react";
import {
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudFog,
  Thermometer,
  Waves,
  Wind,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  MapPin,
  Radio,
} from "lucide-react";
import { CULTURAL_EVENTS, CulturalEvent } from "@/data/culturalEvents";
import { CulturalDestination } from "@/data/destinations";
import { findNearestBmkgStation, BmkgWeatherStation } from "@/data/bmkgStations";

interface BmkgWeatherBarProps {
  activeDestination?: CulturalDestination | null;
  mapCenterCoords?: [number, number];
  language?: "ID" | "EN";
  onSelectEventLocation?: (coords: [number, number]) => void;
}

export function BmkgWeatherBar({
  activeDestination,
  mapCenterCoords,
  language = "ID",
  onSelectEventLocation,
}: BmkgWeatherBarProps) {
  // Determine current effective coordinates (from active destination or live map center)
  const currentCoords: [number, number] = useMemo(() => {
    if (activeDestination?.coordinates) {
      return activeDestination.coordinates;
    }
    if (mapCenterCoords) {
      return mapCenterCoords;
    }
    return [-7.8053, 110.3642]; // Default: Yogyakarta
  }, [activeDestination, mapCenterCoords]);

  // Find dynamic nearest BMKG station based on active coordinates
  const station: BmkgWeatherStation = useMemo(() => {
    if (activeDestination?.bmkgStation) {
      return {
        id: activeDestination.id,
        name: activeDestination.bmkgStation.name,
        shortName: activeDestination.province || activeDestination.name,
        province: activeDestination.province,
        coordinates: activeDestination.coordinates,
        temperature: activeDestination.bmkgStation.temperature,
        condition: activeDestination.bmkgStation.condition,
        humidity: activeDestination.bmkgStation.humidity,
        windSpeedKmh: activeDestination.bmkgStation.windSpeedKmh,
        waveHeightMeters: activeDestination.bmkgStation.waveHeightMeters,
        safetyStatus: activeDestination.bmkgStation.safetyStatus,
      };
    }
    return findNearestBmkgStation(currentCoords);
  }, [activeDestination, currentCoords]);

  // Find nearest cultural event to coordinates
  const nearestEvent: CulturalEvent = useMemo(() => {
    let minDistance = Infinity;
    let selected = CULTURAL_EVENTS[0];

    for (const ev of CULTURAL_EVENTS) {
      const dLat = ev.coordinates[0] - currentCoords[0];
      const dLng = ev.coordinates[1] - currentCoords[1];
      const dist = dLat * dLat + dLng * dLng;
      if (dist < minDistance) {
        minDistance = dist;
        selected = ev;
      }
    }
    return selected;
  }, [currentCoords]);

  // Flat weather condition icon
  const getWeatherIcon = (cond: string) => {
    switch (cond) {
      case "Cerah":
        return <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case "Berawan":
        return <Cloud className="w-3.5 h-3.5 text-slate-300 shrink-0" />;
      case "Hujan Ringan":
      case "Hujan Sedang":
        return <CloudRain className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case "Kabut":
        return <CloudFog className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case "Cerah Berawan":
      default:
        return <CloudSun className="w-3.5 h-3.5 text-amber-300 shrink-0" />;
    }
  };

  // Flat safety status icon
  const getSafetyIcon = (status: "AMAN" | "WASPADA" | "TUNDA") => {
    switch (status) {
      case "AMAN":
        return (
          <div
            className="flex items-center gap-1 text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-full border border-emerald-500/30"
            title={language === "ID" ? "Indeks Wisata: AMAN" : "Tourism Safety: SAFE"}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
        );
      case "WASPADA":
        return (
          <div
            className="flex items-center gap-1 text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded-full border border-amber-500/30"
            title={language === "ID" ? "Indeks Wisata: WASPADA" : "Tourism Safety: CAUTION"}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          </div>
        );
      case "TUNDA":
        return (
          <div
            className="flex items-center gap-1 text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded-full border border-rose-500/30"
            title={language === "ID" ? "Indeks Wisata: TUNDA" : "Tourism Safety: DELAY"}
          >
            <ShieldX className="w-3.5 h-3.5 text-rose-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          </div>
        );
    }
  };

  return (
    <div
      role="region"
      aria-label="Informasi Cuaca BMKG dan Radar Event Budaya"
      className="select-none"
    >
      <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-full px-3 sm:px-4 py-2 shadow-2xl text-white">
        {/* Flat Icon Bar: Strictly Minimal Wording, Flat Icons All */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-xs whitespace-nowrap overflow-x-auto scrollbar-none">
          {/* BMKG Flat Branding Indicator */}
          <div
            className="flex items-center gap-1 text-amber-400 font-bold shrink-0"
            title="BMKG SATU PETA MKG Telemetri Cuaca Geospasial"
          >
            <CloudSun className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] uppercase tracking-wider font-mono">BMKG</span>
          </div>

          <div className="w-px h-3.5 bg-white/20 shrink-0" />

          {/* Region / Map Location Indicator */}
          <div
            className="flex items-center gap-1 text-slate-200 shrink-0"
            title={`Stasiun: ${station.name} • Koordinat: [${currentCoords[0].toFixed(2)}, ${currentCoords[1].toFixed(2)}]`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-xs text-amber-100">{station.shortName}</span>
          </div>

          {/* Weather Condition & Temperature */}
          <div
            className="flex items-center gap-1 shrink-0"
            title={`Kondisi Cuaca: ${station.condition} (${station.temperature}°C)`}
          >
            {getWeatherIcon(station.condition)}
            <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0 -mr-0.5" />
            <span className="font-mono font-bold text-xs text-white">{station.temperature}°</span>
          </div>

          {/* Wind Speed (Flat Icon) */}
          <div
            className="flex items-center gap-0.5 text-teal-300 shrink-0"
            title={`Kecepatan Angin: ${station.windSpeedKmh} km/jam`}
          >
            <Wind className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="font-mono text-xs">{station.windSpeedKmh}k</span>
          </div>

          {/* Maritime Wave Height (Flat Icon) */}
          <div
            className="flex items-center gap-0.5 text-sky-300 shrink-0"
            title={`Tinggi Gelombang Maritim: ${station.waveHeightMeters} meter`}
          >
            <Waves className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-mono text-xs">{station.waveHeightMeters}m</span>
          </div>

          {/* Safety Status (Flat Icon) */}
          <div className="shrink-0">
            {getSafetyIcon(station.safetyStatus)}
          </div>

          <div className="w-px h-3.5 bg-white/20 shrink-0" />

          {/* Pulsing Cultural Event Radar (Flat Icon) */}
          <div
            className="flex items-center gap-1.5 shrink-0 cursor-pointer hover:text-amber-300 transition"
            onClick={() => onSelectEventLocation?.(nearestEvent.coordinates)}
            title={`📡 Radar Event: ${nearestEvent.name} (${nearestEvent.daysRemaining === 0 ? "HARI INI" : `${nearestEvent.daysRemaining} hari lagi`}) • Klik untuk pusatkan peta`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
            <span className="text-xs font-medium text-rose-200 max-w-[120px] sm:max-w-[180px] truncate shrink-0">
              {nearestEvent.name}
            </span>
            <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded font-mono font-bold shrink-0">
              {nearestEvent.daysRemaining === 0 ? "HARI INI" : `${nearestEvent.daysRemaining}h`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
