"use client";

import React, { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CulturalDestination, Category } from "@/data/destinations";
import { CULTURAL_EVENTS } from "@/data/culturalEvents";
import { MapBaseStyle, MapLayerOptions } from "@/data/mapStyles";
import { BmkgLayerOptions } from "@/data/bmkgLayers";
import { RouteTrackingResult, RouteWeatherStep } from "@/data/routeTracking";

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
  // BMKG Telemetry & Sensor Layers
  bmkgLayers?: BmkgLayerOptions;
  // Route & Weather Tracker
  isPickingOnMap?: "start" | "end" | null;
  onMapPickWaypoint?: (coords: [number, number]) => void;
  routeTrackingResult?: RouteTrackingResult | null;
  focusedStep?: RouteWeatherStep | null;
  isSimulating?: boolean;
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
  bmkgLayers,
  isPickingOnMap,
  onMapPickWaypoint,
  routeTrackingResult,
  focusedStep,
  isSimulating,
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

  // BMKG Layer references
  const bmkgLightningLayerRef = useRef<L.LayerGroup | null>(null);
  const bmkgRadarLayerRef = useRef<L.TileLayer.WMS | null>(null);
  const bmkgPwxDaratLayerRef = useRef<L.LayerGroup | null>(null);
  const bmkgRailLayerRef = useRef<L.LayerGroup | null>(null);
  const bmkgSatelliteLayerRef = useRef<L.ImageOverlay | null>(null);
  const bmkgWindLayerRef = useRef<L.TileLayer.WMS | null>(null);
  const bmkgAisLayerRef = useRef<L.TileLayer.WMS | null>(null);

  // Route Tracker layer references
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeGlowPolylineRef = useRef<L.Polyline | null>(null);
  const routeWaypointMarkersRef = useRef<L.Marker[]>([]);
  const routeWeatherMarkersRef = useRef<L.Marker[]>([]);
  const travelerMarkerRef = useRef<L.Marker | null>(null);
  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Map instance
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Centered on the Indonesian archipelago
    const map = L.map(mapContainerRef.current, {
      center: [-2.5489, 118.0149],
      zoom: 5,
      zoomControl: false,
      attributionControl: true,
      minZoom: 4,
      maxZoom: 18,
    });

    mapRef.current = map;

    // Listen to map center & zoom movements
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

  // Handle map click for route waypoint picking
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (isPickingOnMap && onMapPickWaypoint) {
        onMapPickWaypoint([e.latlng.lat, e.latlng.lng]);
      }
    };

    if (isPickingOnMap) {
      map.getContainer().style.cursor = "crosshair";
      map.on("click", handleMapClick);
    } else {
      map.getContainer().style.cursor = "";
      map.off("click", handleMapClick);
    }

    return () => {
      map.off("click", handleMapClick);
    };
  }, [isPickingOnMap, onMapPickWaypoint]);

  // Switch Base Map Tile Layer dynamically (using Carto Dark for 'malam' as specified in BMKG source)
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
        // CartoDB Dark Matter as defined in BMKG/peta.php ('carto-dark')
        newBaseLayer = L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
          {
            subdomains: ["a", "b", "c", "d"],
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO Dark</a>',
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

  // Handle Contour Overlay
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

  // ==========================================
  // BMKG TELEMETRY & DATA LAYERS
  // ==========================================

  // 1. BMKG Sambaran Kilat (Lightning GeoJSON)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (bmkgLightningLayerRef.current) {
      map.removeLayer(bmkgLightningLayerRef.current);
      bmkgLightningLayerRef.current = null;
    }

    if (!bmkgLayers?.kilat) return;

    fetch("/api/bmkg/kilat")
      .then((r) => r.json())
      .then((json) => {
        if (!mapRef.current) return;
        const group = L.layerGroup();
        const collections = Array.isArray(json?.geojson)
          ? json.geojson
          : Array.isArray(json)
          ? json
          : [];

        const colorFor = (intensity: number) =>
          intensity >= 8 ? "#ef4444" : intensity >= 4 ? "#f59e0b" : "#22c55e";

        collections.forEach((fc: any) => {
          try {
            const geoLayer = L.geoJSON(fc, {
              pointToLayer: (feat: any, latlng: L.LatLng) => {
                const intensity = Number(feat.properties?.intensity ?? 0);
                const color = colorFor(intensity);
                const size = Math.max(14, Math.min(24, intensity * 2.2));
                const stormIcon = L.divIcon({
                  html: `
                    <div style="color:${color};display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px" class="animate-pulse">
                      <svg viewBox="0 0 24 24" fill="${color}" width="${size}" height="${size}"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                  `,
                  className: "",
                  iconSize: [size, size],
                  iconAnchor: [size / 2, size / 2],
                });

                const popupHtml = `
                  <div class="p-1 text-slate-900 font-sans">
                    <strong style="color:${color};font-size:12px">⚡ SAMBARAN KILAT BMKG</strong><br/>
                    <span style="font-size:11px"><strong>Intensitas:</strong> ${intensity}</span><br/>
                    <span style="font-size:11px"><strong>Waktu:</strong> ${feat.properties?.strike_date ?? "-"}</span><br/>
                    <span style="font-size:10px;color:#6b7280">Asal Sensor: ${feat.properties?.origin ?? "-"}</span>
                  </div>
                `;

                return L.marker(latlng, { icon: stormIcon }).bindPopup(popupHtml);
              },
            });
            geoLayer.addTo(group);
          } catch {}
        });

        group.addTo(map);
        bmkgLightningLayerRef.current = group;
      })
      .catch((err) => console.error("Failed to load BMKG Kilat layer:", err));

    return () => {
      if (bmkgLightningLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(bmkgLightningLayerRef.current);
        bmkgLightningLayerRef.current = null;
      }
    };
  }, [bmkgLayers?.kilat]);

  // 2. BMKG Radar Cuaca & Hujan (Sidarma Mosaic WMS)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (bmkgRadarLayerRef.current) {
      map.removeLayer(bmkgRadarLayerRef.current);
      bmkgRadarLayerRef.current = null;
    }

    if (!bmkgLayers?.radar) return;

    fetch("/api/bmkg/radar")
      .then((r) => r.json())
      .then((json) => {
        if (!mapRef.current) return;
        const base = typeof json?.url === "string" ? json.url.replace(/\/$/, "") : "";
        const latestLayer =
          json?.wmts?.latest?.layer ||
          (Array.isArray(json?.wmts?.last24hr)
            ? (json.wmts.last24hr[json.wmts.last24hr.length - 1] || {}).layer
            : "sidarma_mosaic_cmax:Indonesia");

        const primaryWms = base ? `${base}/wms` : "https://radar.bmkg.go.id/sidarmageoserver/wms";
        const wmsLayer = L.tileLayer.wms(primaryWms, {
          layers: latestLayer,
          format: "image/png",
          transparent: true,
          opacity: 0.65,
          zIndex: 8,
        });

        wmsLayer.addTo(map);
        bmkgRadarLayerRef.current = wmsLayer;
      })
      .catch((err) => console.error("Failed to load BMKG Radar layer:", err));

    return () => {
      if (bmkgRadarLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(bmkgRadarLayerRef.current);
        bmkgRadarLayerRef.current = null;
      }
    };
  }, [bmkgLayers?.radar]);

  // 3. BMKG Titik Pemantauan Cuaca Darat (pwxDarat)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (bmkgPwxDaratLayerRef.current) {
      map.removeLayer(bmkgPwxDaratLayerRef.current);
      bmkgPwxDaratLayerRef.current = null;
    }

    if (!bmkgLayers?.pwxDarat) return;

    fetch("/api/bmkg/pwx-darat")
      .then((r) => r.json())
      .then((data) => {
        if (!mapRef.current) return;
        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
        const group = L.layerGroup();
        const icon = L.divIcon({
          html: `<div style="background:#22c55e;color:#fff;border-radius:50%;width:12px;height:12px;border:2px solid #fff;box-shadow:0 0 8px rgba(34,197,94,0.6)"></div>`,
          className: "",
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        arr.forEach((item: any) => {
          const prov = item[0];
          const kab = item[1];
          const name = item[2];
          const lat = Number(item[3]);
          const lng = Number(item[4]);
          const code = item[5];
          const time = item[6];
          const metrics = Array.isArray(item[7]) ? item[7] : [];
          const hum = metrics[0];
          const temp = metrics[1];
          const cloud = metrics[2];
          const windDir = metrics[3];
          const windSpd = metrics[4];

          if (isFinite(lat) && isFinite(lng)) {
            const popupHtml = `
              <div class="p-1 text-slate-900 font-sans">
                <strong class="text-xs text-emerald-700">📍 STASIUN CUACA BMKG</strong><br/>
                <span class="font-bold text-sm text-slate-950">${name}</span><br/>
                <span class="text-xs text-slate-600">${kab}, ${prov} (Kode: ${code})</span>
                <div class="mt-1 pt-1 border-t border-slate-200 text-xs space-y-0.5">
                  <div>🌡️ <strong>Suhu:</strong> ${temp ?? "-"}°C</div>
                  <div>💧 <strong>Kelembapan:</strong> ${hum ?? "-"}%</div>
                  <div>☁️ <strong>Awan:</strong> ${cloud ?? "-"}</div>
                  <div>💨 <strong>Angin:</strong> ${windDir ?? "-"} ${windSpd ?? ""} m/s</div>
                  <div class="text-[10px] text-slate-500 mt-1">Update: ${time}</div>
                </div>
              </div>
            `;
            L.marker([lat, lng], { icon }).bindPopup(popupHtml).addTo(group);
          }
        });

        group.addTo(map);
        bmkgPwxDaratLayerRef.current = group;
      })
      .catch((err) => console.error("Failed to load BMKG pwxDarat layer:", err));

    return () => {
      if (bmkgPwxDaratLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(bmkgPwxDaratLayerRef.current);
        bmkgPwxDaratLayerRef.current = null;
      }
    };
  }, [bmkgLayers?.pwxDarat]);

  // 4. BMKG Cuaca Jalur Kereta Api (pwxKereta)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (bmkgRailLayerRef.current) {
      map.removeLayer(bmkgRailLayerRef.current);
      bmkgRailLayerRef.current = null;
    }

    if (!bmkgLayers?.pwxKereta) return;

    fetch("/api/bmkg/pwx-kereta")
      .then((r) => r.json())
      .then((data) => {
        if (!mapRef.current) return;
        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
        const group = L.layerGroup();
        const icon = L.divIcon({
          html: `<div style="background:#6366f1;color:#fff;border-radius:50%;width:14px;height:14px;display:flex;align-items:center;justify-content:center;border:1.5px solid #fff;box-shadow:0 0 6px rgba(99,102,241,0.6)"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg></div>`,
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const groups: { [key: string]: [number, number][] } = {};
        arr.forEach((item: any) => {
          const prov = item[0];
          const kab = item[1];
          const name = item[2];
          const lat = Number(item[3]);
          const lng = Number(item[4]);
          const code = item[5];
          const time = item[6];

          if (isFinite(lat) && isFinite(lng)) {
            const popupHtml = `
              <div class="p-1 text-slate-900 font-sans">
                <strong class="text-xs text-indigo-700">🚆 JALUR KERETA BMKG</strong><br/>
                <span class="font-bold text-sm text-slate-950">${name}</span><br/>
                <span class="text-xs text-slate-600">${kab}, ${prov}</span><br/>
                <span class="text-[10px] text-slate-500">Kode: ${code} • ${time}</span>
              </div>
            `;
            L.marker([lat, lng], { icon }).bindPopup(popupHtml).addTo(group);

            const key = `${prov}|${kab}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push([lat, lng]);
          }
        });

        // Draw track lines
        Object.keys(groups).forEach((k) => {
          const pts = groups[k];
          if (pts.length >= 2) {
            const sorted = pts.slice().sort((a, b) => a[1] - b[1]);
            L.polyline(sorted, {
              color: "#6366f1",
              weight: 2.5,
              opacity: 0.75,
              dashArray: "4, 6",
            }).addTo(group);
          }
        });

        group.addTo(map);
        bmkgRailLayerRef.current = group;
      })
      .catch((err) => console.error("Failed to load BMKG pwxKereta layer:", err));

    return () => {
      if (bmkgRailLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(bmkgRailLayerRef.current);
        bmkgRailLayerRef.current = null;
      }
    };
  }, [bmkgLayers?.pwxKereta]);

  // 5. BMKG Citra Satelit Cuaca (Overlay)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (bmkgSatelliteLayerRef.current) {
      map.removeLayer(bmkgSatelliteLayerRef.current);
      bmkgSatelliteLayerRef.current = null;
    }

    if (!bmkgLayers?.satelit) return;

    fetch("/api/bmkg/satelit")
      .then((r) => r.json())
      .then((json) => {
        if (!mapRef.current) return;
        const file = json.file;
        const b = Array.isArray(json.imageBounds) ? json.imageBounds : null;
        if (!file || !b || b.length < 2) return;

        const swLat = Math.min(Number(b[0][0]), Number(b[1][0]));
        const neLat = Math.max(Number(b[0][0]), Number(b[1][0]));
        const swLng = Math.min(Number(b[0][1]), Number(b[1][1]));
        const neLng = Math.max(Number(b[0][1]), Number(b[1][1]));
        const bounds: [[number, number], [number, number]] = [
          [swLat, swLng],
          [neLat, neLng],
        ];

        const overlay = L.imageOverlay(file, bounds, { opacity: 0.55, zIndex: 6 });
        overlay.addTo(map);
        bmkgSatelliteLayerRef.current = overlay;
      })
      .catch((err) => console.error("Failed to load BMKG Satelit layer:", err));

    return () => {
      if (bmkgSatelliteLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(bmkgSatelliteLayerRef.current);
        bmkgSatelliteLayerRef.current = null;
      }
    };
  }, [bmkgLayers?.satelit]);

  // 6. BMKG Arah & Kecepatan Angin (Inawis Maritim WMS)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (bmkgWindLayerRef.current) {
      map.removeLayer(bmkgWindLayerRef.current);
      bmkgWindLayerRef.current = null;
    }

    if (!bmkgLayers?.angin) return;

    const base = "https://maritim.bmkg.go.id/gs/inawis/wms";
    const layer = L.tileLayer.wms(base, {
      layers: "wind_speed_direction",
      format: "image/png",
      transparent: true,
      version: "1.3.0",
      opacity: 0.65,
      zIndex: 7,
    });

    layer.addTo(map);
    bmkgWindLayerRef.current = layer;

    return () => {
      if (bmkgWindLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(bmkgWindLayerRef.current);
        bmkgWindLayerRef.current = null;
      }
    };
  }, [bmkgLayers?.angin]);

  // 7. BMKG Kerapatan Kapal Bahari (AIS WMS)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (bmkgAisLayerRef.current) {
      map.removeLayer(bmkgAisLayerRef.current);
      bmkgAisLayerRef.current = null;
    }

    if (!bmkgLayers?.ais) return;

    const base = "https://maritim.bmkg.go.id/gs/inawis/wms";
    const layer = L.tileLayer.wms(base, {
      layers: "ais_density",
      format: "image/png",
      transparent: true,
      version: "1.3.0",
      opacity: 0.55,
      zIndex: 6,
    });

    layer.addTo(map);
    bmkgAisLayerRef.current = layer;

    return () => {
      if (bmkgAisLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(bmkgAisLayerRef.current);
        bmkgAisLayerRef.current = null;
      }
    };
  }, [bmkgLayers?.ais]);

  // ==========================================
  // ROUTE & WEATHER TRACKER RENDERING
  // ==========================================
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous route layers & markers
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
    if (routeGlowPolylineRef.current) {
      map.removeLayer(routeGlowPolylineRef.current);
      routeGlowPolylineRef.current = null;
    }
    routeWaypointMarkersRef.current.forEach((m) => m.remove());
    routeWaypointMarkersRef.current = [];
    routeWeatherMarkersRef.current.forEach((m) => m.remove());
    routeWeatherMarkersRef.current = [];
    if (travelerMarkerRef.current) {
      map.removeLayer(travelerMarkerRef.current);
      travelerMarkerRef.current = null;
    }
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }

    if (!routeTrackingResult) return;

    const coordinates = routeTrackingResult.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) return;

    // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
    const latlngs: [number, number][] = coordinates.map((c) => [c[1], c[0]]);

    // 1. Glowing background stroke
    const glowPolyline = L.polyline(latlngs, {
      color: "#2563eb",
      weight: 8,
      opacity: 0.45,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);
    routeGlowPolylineRef.current = glowPolyline;

    // 2. Main high-contrast route polyline
    const mainPolyline = L.polyline(latlngs, {
      color: "#f59e0b",
      weight: 4,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);
    routePolylineRef.current = mainPolyline;

    // Fit map bounds to show complete journey
    map.fitBounds(mainPolyline.getBounds(), { padding: [50, 50] });

    // 3. Start Marker (Green Circle with 'A')
    const startIcon = L.divIcon({
      html: `
        <div style="background:#10b981;color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border:2.5px solid #fff;box-shadow:0 0 10px rgba(16,185,129,0.8);font-weight:900;font-size:12px">
          A
        </div>
      `,
      className: "",
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
    const startMarker = L.marker([routeTrackingResult.start.lat, routeTrackingResult.start.lng], {
      icon: startIcon,
      zIndexOffset: 1000,
    })
      .bindPopup(`
        <div class="p-1 text-slate-900 font-sans">
          <strong class="text-xs text-emerald-600">🏁 TITIK AWAL PERJALANAN</strong><br/>
          <span class="font-bold text-sm text-slate-950">${routeTrackingResult.start.name}</span>
        </div>
      `)
      .addTo(map);
    routeWaypointMarkersRef.current.push(startMarker);

    // 4. Destination Marker (Red Circle with 'B')
    const destIcon = L.divIcon({
      html: `
        <div style="background:#ef4444;color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border:2.5px solid #fff;box-shadow:0 0 10px rgba(239,68,68,0.8);font-weight:900;font-size:12px">
          B
        </div>
      `,
      className: "",
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
    const destMarker = L.marker(
      [routeTrackingResult.destination.lat, routeTrackingResult.destination.lng],
      { icon: destIcon, zIndexOffset: 1000 }
    )
      .bindPopup(`
        <div class="p-1 text-slate-900 font-sans">
          <strong class="text-xs text-rose-600">🎯 TITIK TUJUAN</strong><br/>
          <span class="font-bold text-sm text-slate-950">${routeTrackingResult.destination.name}</span><br/>
          <span class="text-xs text-slate-600">Jarak: ${routeTrackingResult.totalDistanceKm} km • Durasi: ${Math.round(routeTrackingResult.totalDurationMinutes)} menit</span>
        </div>
      `)
      .addTo(map);
    routeWaypointMarkersRef.current.push(destMarker);

    // 5. Place BMKG Weather Markers along key waypoints on the route
    routeTrackingResult.steps.forEach((st) => {
      if (st.weather) {
        const stepIcon = L.divIcon({
          html: `
            <div style="background:#0f172a;color:#f59e0b;border-radius:12px;padding:2px 6px;display:flex;align-items:center;gap:3px;border:1px solid #f59e0b;box-shadow:0 2px 6px rgba(0,0,0,0.5);font-size:10px;font-weight:bold;white-space:nowrap">
              <span>${st.weather.temperature}°C</span>
              <span>🌤️</span>
            </div>
          `,
          className: "",
          iconSize: [48, 20],
          iconAnchor: [24, 10],
        });

        const weatherMarker = L.marker([st.lat, st.lng], {
          icon: stepIcon,
          zIndexOffset: 500,
        }).bindPopup(`
          <div class="p-1 text-slate-900 font-sans">
            <strong class="text-xs text-amber-600">🌤️ CUACA BMKG DI RUAS JALAN</strong><br/>
            <span class="font-bold text-sm text-slate-950">${st.streetName || "Ruas Jalan"}</span><br/>
            <span class="text-xs text-slate-600">Kondisi: <strong>${st.weather.condition}</strong> (${st.weather.temperature}°C)</span>
            <div class="mt-1 pt-1 border-t border-slate-200 text-xs space-y-0.5">
              <div>💧 Kelembapan: ${st.weather.humidity}%</div>
              <div>💨 Angin: ${st.weather.windDirection} ${st.weather.windSpeed} m/s</div>
              <div>👁️ Jarak Pandang: ${st.weather.visibility}</div>
            </div>
          </div>
        `).addTo(map);

        routeWeatherMarkersRef.current.push(weatherMarker);
      }
    });
  }, [routeTrackingResult]);

  // Handle focused step trigger (from clicking turn by turn item in drawer)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusedStep) return;

    map.flyTo([focusedStep.lat, focusedStep.lng], Math.max(map.getZoom(), 14), {
      duration: 1.2,
    });
  }, [focusedStep]);

  // Handle Animated Vehicle Simulation along route
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isSimulating || !routeTrackingResult) return;

    const coordinates = routeTrackingResult.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) return;

    const path: [number, number][] = coordinates.map((c) => [c[1], c[0]]);
    let stepIndex = 0;

    const bearing = (a: [number, number], b: [number, number]) => {
      const toRad = (d: number) => (d * Math.PI) / 180;
      const toDeg = (r: number) => (r * 180) / Math.PI;
      const lat1 = toRad(a[0]);
      const lat2 = toRad(b[0]);
      const dLon = toRad(b[1] - a[1]);
      const y = Math.sin(dLon) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
      const brng = toDeg(Math.atan2(y, x));
      return (brng + 360) % 360;
    };

    const makeCarIcon = (deg: number) =>
      L.divIcon({
        html: `
          <div style="background:#0f172a;border:2px solid #f59e0b;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(245,158,11,0.8);transform:rotate(${deg}deg);transition:transform 0.15s">
            <svg viewBox="0 0 24 24" fill="#f59e0b" width="16" height="16"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.1 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
        `,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

    if (travelerMarkerRef.current) {
      map.removeLayer(travelerMarkerRef.current);
    }

    const initDeg = bearing(path[0], path[1]);
    const travelerMarker = L.marker(path[0], {
      icon: makeCarIcon(initDeg),
      zIndexOffset: 2000,
    }).addTo(map);
    travelerMarkerRef.current = travelerMarker;

    const intervalTime = Math.max(120, Math.min(300, 15000 / path.length));

    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
    }

    simulationTimerRef.current = setInterval(() => {
      stepIndex++;
      if (stepIndex >= path.length) {
        if (simulationTimerRef.current) {
          clearInterval(simulationTimerRef.current);
          simulationTimerRef.current = null;
        }
        travelerMarker.bindPopup("🎉 <strong>Perjalanan Selesai!</strong>").openPopup();
        return;
      }

      const currentCoord = path[stepIndex];
      const prevCoord = path[stepIndex - 1] || currentCoord;
      const deg = bearing(prevCoord, currentCoord);

      travelerMarker.setLatLng(currentCoord);
      travelerMarker.setIcon(makeCarIcon(deg));
    }, intervalTime);

    return () => {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
        simulationTimerRef.current = null;
      }
    };
  }, [isSimulating, routeTrackingResult]);

  // Destination Markers handling
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

  const updateDestinationMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const zoom = map.getZoom();
    const bounds = map.getBounds();

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

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

  // Render Cultural Radar Pulsing Beacons
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    radarMarkersRef.current.forEach((m) => m.remove());
    radarMarkersRef.current = [];

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

  // Draw Golden Polyline for standard Trip Planner items
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    if (tripItems.length >= 2 && !routeTrackingResult) {
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
  }, [tripItems, routeTrackingResult]);

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
