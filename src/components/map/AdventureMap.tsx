"use client";

import React, { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CulturalDestination, Category } from "@/data/destinations";
import { CULTURAL_EVENTS, CulturalEvent } from "@/data/culturalEvents";
import { MapBaseStyle, MapLayerOptions } from "@/data/mapStyles";

interface AdventureMapProps {
  destinations: CulturalDestination[];
  selectedCategory: Category | "all";
  onSelectDestination: (dest: CulturalDestination) => void;
  activeDestination: CulturalDestination | null;
  tripItems: CulturalDestination[];
  flyToCoords?: [number, number] | null;
  onMapMove?: (coords: [number, number], zoom: number) => void;
  zoomTrigger?: { type: "in" | "out"; id: number } | null;
  mapStyle?: MapBaseStyle;
  layerOptions?: MapLayerOptions;
}

function getCategoryFlatSvg(category: Category): string {
  switch (category) {
    case "laut":
    case "pantai":
      return `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`;
    case "gunung":
      return `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`;
    case "hutan":
      return `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7l-3.5-4.6a1 1 0 0 0-1.6 0L8.4 7.3A1 1 0 0 0 9.2 9H9.4a1 1 0 0 0 .7 1.7L7.2 14H7.5a1 1 0 0 0 .7 1.7L11 19"/></svg>`;
    case "pertanian":
      return `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>`;
    case "budaya":
      return `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18"/><line x1="10" x2="10" y1="18"/><line x1="14" x2="14" y1="18"/><line x1="18" x2="18" y1="18"/><polygon points="12 2 20 7 4 7"/></svg>`;
    case "pakaian":
      return `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`;
    case "desa":
      return `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
    case "darat":
      return `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`;
    case "festival":
    default:
      return `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>`;
  }
}

export function AdventureMap({
  destinations,
  selectedCategory,
  onSelectDestination,
  activeDestination,
  tripItems,
  flyToCoords,
  onMapMove,
  zoomTrigger,
  mapStyle = "kontur",
  layerOptions,
}: AdventureMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const contourOverlayRef = useRef<L.TileLayer | null>(null);
  const labelsOverlayRef = useRef<L.TileLayer | null>(null);
  const seaMarksOverlayRef = useRef<L.TileLayer | null>(null);
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

    mapRef.current = map;

    // Listen to map center & zoom movements to dynamically update BMKG telemetry and geo-soundtrack
    const handleMapMove = () => {
      if (map) {
        const center = map.getCenter();
        const zoom = map.getZoom();
        if (onMapMove) {
          onMapMove([center.lat, center.lng], zoom);
        }
      }
    };

    map.on("moveend", handleMapMove);
    map.on("zoomend", handleMapMove);
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
      map.off("zoomend", handleMapMove);
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      baseTileLayerRef.current = null;
      contourOverlayRef.current = null;
      labelsOverlayRef.current = null;
      seaMarksOverlayRef.current = null;
    };
  }, []);

  // Switch Base Map Tile Layer dynamically
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
      baseTileLayerRef.current = null;
    }

    let newBaseLayer: L.TileLayer;
    switch (mapStyle) {
      case "satelit":
        newBaseLayer = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19,
            crossOrigin: true,
          }
        );
        break;
      case "gunung":
        newBaseLayer = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              'Tiles &copy; Esri &mdash; DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey',
            maxZoom: 19,
            crossOrigin: true,
          }
        );
        break;
      case "kontur":
        newBaseLayer = L.tileLayer(
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          {
            subdomains: ["a", "b", "c"],
            attribution:
              'Map data: &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org" target="_blank" rel="noopener">OpenTopoMap</a>',
            maxZoom: 17,
            crossOrigin: true,
          }
        );
        break;
      case "malam":
        newBaseLayer = L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          {
            subdomains: ["a", "b", "c", "d"],
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
            maxZoom: 19,
            crossOrigin: true,
          }
        );
        break;
      case "bahari":
        newBaseLayer = L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          {
            subdomains: ["a", "b", "c", "d"],
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com" target="_blank" rel="noopener">CARTO</a>',
            maxZoom: 19,
            crossOrigin: true,
          }
        );
        break;
      case "osm":
      default:
        newBaseLayer = L.tileLayer("/api/tiles/{z}/{x}/{y}", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors | Nusa Antara Live',
          maxZoom: 19,
          crossOrigin: true,
        });
        break;
    }

    newBaseLayer.addTo(map);
    if (typeof (newBaseLayer as any).bringToBack === "function") {
      (newBaseLayer as any).bringToBack();
    }
    baseTileLayerRef.current = newBaseLayer;
  }, [mapStyle]);

  // Handle Contour Overlay (Toggleable isoline curve overlay)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const shouldShowContour =
      Boolean(layerOptions?.contourOverlay) && mapStyle !== "kontur";

    if (shouldShowContour) {
      if (!contourOverlayRef.current) {
        const layer = L.tileLayer(
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          {
            subdomains: ["a", "b", "c"],
            maxZoom: 17,
            opacity: 0.55,
            zIndex: 2,
            crossOrigin: true,
          }
        );
        layer.addTo(map);
        contourOverlayRef.current = layer;
      }
    } else {
      if (contourOverlayRef.current) {
        map.removeLayer(contourOverlayRef.current);
        contourOverlayRef.current = null;
      }
    }
  }, [layerOptions?.contourOverlay, mapStyle]);

  // Handle Place & Road Labels Overlay
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const shouldShowLabels =
      layerOptions?.labelsOverlay ?? (mapStyle === "satelit");

    if (shouldShowLabels) {
      if (!labelsOverlayRef.current) {
        const layer = L.tileLayer(
          "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          {
            maxZoom: 19,
            opacity: 0.9,
            zIndex: 4,
            crossOrigin: true,
          }
        );
        layer.addTo(map);
        labelsOverlayRef.current = layer;
      }
    } else {
      if (labelsOverlayRef.current) {
        map.removeLayer(labelsOverlayRef.current);
        labelsOverlayRef.current = null;
      }
    }
  }, [layerOptions?.labelsOverlay, mapStyle]);

  // Handle Maritime Sea Marks Overlay
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const shouldShowSeaMarks = Boolean(layerOptions?.seaMarksOverlay);

    if (shouldShowSeaMarks) {
      if (!seaMarksOverlayRef.current) {
        const layer = L.tileLayer(
          "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
          {
            maxZoom: 18,
            opacity: 0.85,
            zIndex: 5,
            crossOrigin: true,
          }
        );
        layer.addTo(map);
        seaMarksOverlayRef.current = layer;
      }
    } else {
      if (seaMarksOverlayRef.current) {
        map.removeLayer(seaMarksOverlayRef.current);
        seaMarksOverlayRef.current = null;
      }
    }
  }, [layerOptions?.seaMarksOverlay]);

  // Helper to render a single destination marker on the map
  const renderSingleDestMarker = useCallback(
    (map: L.Map, dest: CulturalDestination, isSelected: boolean, isInTrip: boolean) => {
      const categoryIconSvg = getCategoryFlatSvg(dest.category);
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
          } shadow-xl transition-all duration-300">
            ${categoryIconSvg}
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
    },
    [onSelectDestination]
  );

  // Update Markers when zoom, viewport, destinations, or category filter change
  // "buatkan default jangan menampilkan marker apapun kecuali marker event, fokus data di lampung dan bulukumba saja data2 nya"
  const updateDestinationMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const zoom = map.getZoom();
    const bounds = map.getBounds();

    // Clear existing destination markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // In default wide overview (zoom < 7), do NOT show destination markers unless an active destination is being inspected
    if (zoom < 7) {
      if (activeDestination) {
        renderSingleDestMarker(
          map,
          activeDestination,
          true,
          tripItems.some((t) => t.id === activeDestination.id)
        );
      }
      return;
    }

    const filtered =
      selectedCategory === "all"
        ? destinations
        : destinations.filter(
            (d) =>
              d.category === selectedCategory ||
              (selectedCategory === "laut" && d.category === "pantai")
          );

    // Only render markers that fall within the current padded viewport bounds
    const paddedBounds = bounds.pad(0.15);
    const visibleDestinations = filtered.filter((dest) =>
      paddedBounds.contains(dest.coordinates)
    );

    visibleDestinations.forEach((dest) => {
      const isSelected = activeDestination?.id === dest.id;
      const isInTrip = tripItems.some((t) => t.id === dest.id);
      renderSingleDestMarker(map, dest, isSelected, isInTrip);
    });
  }, [destinations, selectedCategory, activeDestination, tripItems, renderSingleDestMarker]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    updateDestinationMarkers();

    map.on("moveend", updateDestinationMarkers);
    map.on("zoomend", updateDestinationMarkers);

    return () => {
      map.off("moveend", updateDestinationMarkers);
      map.off("zoomend", updateDestinationMarkers);
    };
  }, [updateDestinationMarkers]);

  // Render Radar Event Pulsing Beacons
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    radarMarkersRef.current.forEach((m) => m.remove());
    radarMarkersRef.current = [];

    // Skip if cultural radar is toggled off
    if (layerOptions?.culturalRadar === false) {
      return;
    }

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
  }, [layerOptions?.culturalRadar]);

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

  // Handle external programmatic zoom in / out
  useEffect(() => {
    if (!mapRef.current || !zoomTrigger) return;
    if (zoomTrigger.type === "in") {
      mapRef.current.zoomIn();
    } else if (zoomTrigger.type === "out") {
      mapRef.current.zoomOut();
    }
  }, [zoomTrigger]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full absolute inset-0 z-0 bg-slate-950"
    />
  );
}
