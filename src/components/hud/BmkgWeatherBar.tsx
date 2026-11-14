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
  MapPin,
} from "lucide-react";
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

  // Flat weather condition icon
  const getWeatherIcon = (cond: string) => {
    switch (cond) {
      case "Cerah":
        return <Sun className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />;
      case "Berawan":
        return <Cloud className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300 shrink-0" />;
      case "Hujan Ringan":
      case "Hujan Sedang":
        return <CloudRain className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" />;
      case "Kabut":
        return <CloudFog className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />;
      case "Cerah Berawan":
      default:
        return <CloudSun className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300 shrink-0" />;
    }
  };

  return (
    <div
      role="region"
      aria-label="Informasi Cuaca BMKG"
      className="select-none text-[var(--bx-ink)]"
    >
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs whitespace-nowrap">
        {/* BMKG Indicator */}
        <div
          className="flex items-center gap-1 text-[var(--gold)] font-bold shrink-0"
          title="BMKG SATU PETA MKG Telemetri Cuaca Geospasial"
        >
          <CloudSun className="w-4 h-4 text-[var(--gold)] shrink-0" />
          <span className="text-[10px] uppercase tracking-wider font-mono">BMKG</span>
        </div>

        <div className="w-px h-3.5 bg-[var(--bx-border)] shrink-0" />

        {/* Region / Map Location Indicator */}
        <div
          className="flex items-center gap-1 shrink-0"
          title={`Stasiun: ${station.name} • Koordinat: [${currentCoords[0].toFixed(2)}, ${currentCoords[1].toFixed(2)}]`}
        >
          <MapPin className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
          <span className="font-semibold text-xs text-[var(--bx-ink-bright)]">{station.shortName}</span>
        </div>

        {/* Weather Condition & Temperature */}
        <div
          className="flex items-center gap-1 shrink-0"
          title={`Kondisi Cuaca: ${station.condition} (${station.temperature}°C)`}
        >
          {getWeatherIcon(station.condition)}
          <Thermometer className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 -mr-0.5" />
          <span className="font-mono font-bold text-xs text-[var(--bx-ink)]">{station.temperature}°</span>
        </div>

        {/* Wind Speed (Flat Icon) - Visible on larger screens */}
        <div
          className="items-center gap-0.5 text-teal-700 dark:text-teal-300 shrink-0 hidden lg:flex"
          title={`Kecepatan Angin: ${station.windSpeedKmh} km/jam`}
        >
          <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="font-mono text-xs">{station.windSpeedKmh}k</span>
        </div>

        {/* Maritime Wave Height (Flat Icon) - Visible on larger screens */}
        <div
          className="items-center gap-0.5 text-sky-700 dark:text-sky-300 shrink-0 hidden lg:flex"
          title={`Tinggi Gelombang Maritim: ${station.waveHeightMeters} meter`}
        >
          <Waves className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
          <span className="font-mono text-xs">{station.waveHeightMeters}m</span>
        </div>
      </div>
    </div>
  );
}
