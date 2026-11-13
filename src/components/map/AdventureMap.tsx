"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CulturalDestination, Category } from "@/data/destinations";
import { CULTURAL_EVENTS, CulturalEvent } from "@/data/culturalEvents";

interface AdventureMapProps {
  destinations: CulturalDestination[];
  selectedCategory: Category | "all";
  onSelectDestination: (dest: CulturalDestination) => void;
  activeDestination: CulturalDestination | null;
  tripItems: CulturalDestination[];
  flyToCoords?: [number, number] | null;
  onMapMove?: (coords: [number, number]) => void;
}

export function AdventureMap({
  destinations,
  selectedCategory,
  onSelectDestination,
  activeDestination,
  tripItems,
  flyToCoords,
  onMapMove,
}: AdventureMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const radarMarkersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);

  // Initialize Map instance
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Centered on the Indonesian archipelago
    const map = L.map(mapContainerRef.current, {
      center: [-2.5489, 118.0149],
      zoom: 5,
      zoomControl: false, // Custom position or floating controls
      attributionControl: true,
      minZoom: 4,
      maxZoom: 18,
    });

    // Add zoom control at bottom right (above BMKG bar)
    L.control
      .zoom({
        position: "topright",
      })
      .addTo(map);

    // OpenStreetMap Tile Layer using our Next.js API proxy with custom User-Agent and caching
    const tileLayer = L.tileLayer("/api/tiles/{z}/{x}/{y}", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors | Nusa Antara Live',
      maxZoom: 19,
      crossOrigin: true,
    });

    tileLayer.addTo(map);
    mapRef.current = map;

    // Listen to map center movements to dynamically update BMKG telemetry
    const handleMapMove = () => {
      if (map) {
        const center = map.getCenter();
        if (onMapMove) {
          onMapMove([center.lat, center.lng]);
        }
      }
    };

    map.on("moveend", handleMapMove);
    handleMapMove();

    // Observe container resizing for smooth layout shifting
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      map.off("moveend", handleMapMove);
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Markers when destinations or category filter change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing destination markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const filtered =
      selectedCategory === "all"
        ? destinations
        : destinations.filter((d) => d.category === selectedCategory);

    filtered.forEach((dest) => {
      const isSelected = activeDestination?.id === dest.id;
      const isInTrip = tripItems.some((t) => t.id === dest.id);

      // Icon category mapping
      const categoryIcon =
        dest.category === "budaya"
          ? "🎭"
          : dest.category === "desa"
          ? "🌾"
          : dest.category === "gunung"
          ? "⛰️"
          : "🏖️";

      const iconHtml = `
        <div class="relative group cursor-pointer">
          ${
            isSelected
              ? `<span class="absolute -inset-1 rounded-full bg-amber-400 animate-ping opacity-75"></span>`
              : ""
          }
          <div class="flex items-center justify-center w-9 h-9 rounded-2xl ${
            isSelected
              ? "bg-amber-400 text-slate-950 scale-110 shadow-lg shadow-amber-400/50"
              : isInTrip
              ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
              : "bg-slate-900/90 text-amber-300 border border-amber-500/50 hover:bg-amber-500 hover:text-slate-950"
          } text-sm font-bold shadow-xl transition-all duration-300">
            ${categoryIcon}
          </div>
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap bg-slate-900/95 text-white text-[11px] font-semibold px-2 py-1 rounded-lg border border-amber-500/30 shadow-xl pointer-events-none z-50">
            ${dest.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-dest-pin",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker(dest.coordinates, { icon: customIcon });
      marker.on("click", () => {
        onSelectDestination(dest);
        map.flyTo(dest.coordinates, 10, { duration: 1.2 });
      });

      marker.addTo(map);
      markersRef.current[dest.id] = marker;
    });
  }, [destinations, selectedCategory, activeDestination, tripItems]);

  // Render Radar Event Pulsing Beacons
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    radarMarkersRef.current.forEach((m) => m.remove());
    radarMarkersRef.current = [];

    CULTURAL_EVENTS.forEach((event) => {
      const isToday = event.daysRemaining === 0;
      const beaconColor = isToday ? "bg-emerald-400" : "bg-rose-500";

      const radarHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <span class="absolute w-10 h-10 rounded-full ${beaconColor} opacity-40 animate-ping"></span>
          <span class="absolute w-6 h-6 rounded-full ${beaconColor} opacity-70 animate-pulse"></span>
          <div class="w-4 h-4 rounded-full ${beaconColor} border-2 border-white shadow-lg flex items-center justify-center text-[8px] font-black text-white">
            📡
          </div>
          <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block whitespace-nowrap bg-rose-950 text-rose-100 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-rose-500/40 shadow-xl pointer-events-none z-50">
            ${event.name} (${event.daysRemaining} hari)
          </div>
        </div>
      `;

      const radarIcon = L.divIcon({
        html: radarHtml,
        className: "custom-radar-pin",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker(event.coordinates, { icon: radarIcon });
      marker.bindPopup(`
        <div class="p-1 text-slate-900 font-sans">
          <strong class="text-xs text-rose-800">📡 RADAR EVENT BUDAYA:</strong><br/>
          <span class="font-bold text-sm text-slate-950">${event.name}</span><br/>
          <span class="text-xs text-slate-600">${event.location} • ${event.dateRange}</span>
          <p class="text-xs text-slate-700 mt-1">${event.description}</p>
        </div>
      `);

      marker.addTo(map);
      radarMarkersRef.current.push(marker);
    });
  }, []);

  // Draw Golden Adventure Polyline for Trip Items
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    if (tripItems.length >= 2) {
      const latlngs = tripItems.map((item) => item.coordinates);
      const polyline = L.polyline(latlngs, {
        color: "#f59e0b",
        weight: 3.5,
        dashArray: "6, 8",
        opacity: 0.85,
        lineJoin: "round",
      });
      polyline.addTo(map);
      routeLineRef.current = polyline;
    }
  }, [tripItems]);

  // Handle external flyTo trigger
  useEffect(() => {
    if (flyToCoords && mapRef.current) {
      mapRef.current.flyTo(flyToCoords, 9, { duration: 1.5 });
    }
  }, [flyToCoords]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full absolute inset-0 z-0 bg-slate-950"
    />
  );
}
