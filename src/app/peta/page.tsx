"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Minus, LogIn, LogOut, LayoutDashboard, Route as RouteIcon } from "lucide-react";
import { DESTINATIONS, CulturalDestination, Category } from "@/data/destinations";
import { BrandWidget } from "@/components/hud/BrandWidget";
import { SearchWidget } from "@/components/hud/SearchWidget";
import { BmkgWeatherBar } from "@/components/hud/BmkgWeatherBar";
import { MusicPlayer } from "@/components/hud/MusicPlayer";
import { DestinationSheet } from "@/components/hud/DestinationSheet";
import { TripPlannerDrawer } from "@/components/hud/TripPlannerDrawer";
import { AiConciergeDrawer } from "@/components/hud/AiConciergeDrawer";
import { MapLayersWidget } from "@/components/hud/MapLayersWidget";
import { BmkgFilterWidget } from "@/components/hud/BmkgFilterWidget";
import { RouteTrackerDrawer } from "@/components/hud/RouteTrackerDrawer";
import { MapBaseStyle, MapLayerOptions } from "@/data/mapStyles";
import { BmkgLayerOptions, DEFAULT_BMKG_LAYERS } from "@/data/bmkgLayers";
import {
  RouteWaypoint,
  RouteTrackingResult,
  RouteWeatherStep,
  SavedTravelRoute,
} from "@/data/routeTracking";
import { detectRegionFromCoordinates } from "@/utils/regionAudioDetector";
import { getStoredUser, subscribeAuth, clearStoredUser, AuthUser } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";

// Dynamically import Leaflet AdventureMap with SSR disabled
const AdventureMap = dynamic(
  () => import("@/components/map/AdventureMap").then((mod) => mod.AdventureMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-amber-400">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mb-3"></div>
        <p className="text-xs uppercase tracking-widest font-black">
          Memuat Peta Petualangan Nusa Antara...
        </p>
      </div>
    ),
  }
);

function PetaContent() {
  const searchParams = useSearchParams();
  const destParam = searchParams.get("dest");

  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [activeDestination, setActiveDestination] = useState<CulturalDestination | null>(null);
  const [tripItems, setTripItems] = useState<CulturalDestination[]>([
    DESTINATIONS[0], // Pantai Tanjung Bira (Bulukumba)
    DESTINATIONS[8], // Teluk Kiluan (Lampung)
  ]);
  const [currency, setCurrency] = useState<"IDR" | "USD">("IDR");
  const [language, setLanguage] = useState<"ID" | "EN">("ID");
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState<boolean>(false);
  const [isAiConciergeOpen, setIsAiConciergeOpen] = useState<boolean>(false);
  const [flyToCoords, setFlyToCoords] = useState<[number, number] | null>(null);
  const [mapCenterCoords, setMapCenterCoords] = useState<[number, number]>([-2.5489, 118.0149]);
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [zoomTrigger, setZoomTrigger] = useState<{ type: "in" | "out"; id: number } | null>(null);

  // Map Base Style & Theme sync
  const [mapStyle, setMapStyle] = useState<MapBaseStyle>("kontur");
  const [layerOptions, setLayerOptions] = useState<MapLayerOptions>({
    contourOverlay: false,
    labelsOverlay: true,
    seaMarksOverlay: false,
    culturalRadar: true,
  });

  // BMKG Telemetry & Sensor Layers State
  const [bmkgLayers, setBmkgLayers] = useState<BmkgLayerOptions>(DEFAULT_BMKG_LAYERS);
  const [isBmkgLoading, setIsBmkgLoading] = useState(false);

  // Route & Weather Tracker State
  const [isRouteTrackerOpen, setIsRouteTrackerOpen] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<RouteWaypoint | null>({
    lat: DESTINATIONS[0].coordinates[0],
    lng: DESTINATIONS[0].coordinates[1],
    name: DESTINATIONS[0].name,
  });
  const [endPoint, setEndPoint] = useState<RouteWaypoint | null>({
    lat: DESTINATIONS[8].coordinates[0],
    lng: DESTINATIONS[8].coordinates[1],
    name: DESTINATIONS[8].name,
  });
  const [isPickingOnMap, setIsPickingOnMap] = useState<"start" | "end" | null>(null);
  const [routeTrackingResult, setRouteTrackingResult] = useState<RouteTrackingResult | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);
  const [focusedStep, setFocusedStep] = useState<RouteWeatherStep | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Auto-sync Carto Dark theme if dark mode is active in the document
  useEffect(() => {
    const savedTheme = localStorage.getItem("nusantara_theme");
    const docTheme = document.documentElement.getAttribute("data-theme");
    if (savedTheme === "dark" || docTheme === "dark") {
      setMapStyle("malam"); // Carto Dark (from BMKG key 'carto-dark')
    }
  }, []);

  // Subscribe to authentication state changes
  useEffect(() => {
    setAuthUser(getStoredUser());
    const unsubscribe = subscribeAuth((user) => {
      setAuthUser(user);
    });
    return unsubscribe;
  }, []);

  // Check if destination query param is provided to focus on mount
  useEffect(() => {
    if (destParam) {
      const found = DESTINATIONS.find(
        (d) => d.id === destParam || d.name.toLowerCase().includes(destParam.toLowerCase())
      );
      if (found) {
        setActiveDestination(found);
        setFlyToCoords(found.coordinates);
      }
    }
  }, [destParam]);

  // Calculate live geographic region and associated cultural soundtrack
  const detectedGeo = useMemo(() => {
    return detectRegionFromCoordinates(mapCenterCoords, mapZoom);
  }, [mapCenterCoords, mapZoom]);

  const handleMapMove = (coords: [number, number], zoom: number) => {
    setMapCenterCoords(coords);
    setMapZoom(zoom);
  };

  const handleToggleLayerOption = (key: keyof MapLayerOptions) => {
    setLayerOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleBmkgLayer = (key: keyof BmkgLayerOptions) => {
    setIsBmkgLoading(true);
    setBmkgLayers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setTimeout(() => setIsBmkgLoading(false), 800);
  };

  const handleSetAllBmkgLayers = (active: boolean) => {
    setIsBmkgLoading(true);
    setBmkgLayers({
      radar: active,
      kilat: active,
      pwxDarat: active,
      pwxKereta: active,
      satelit: active,
      angin: active,
      ais: active,
    });
    setTimeout(() => setIsBmkgLoading(false), 1200);
  };

  // Check if any right drawer is open
  const isRightDrawerOpen = Boolean(isAiConciergeOpen || activeDestination);
  const isLeftDrawerOpen = Boolean(isTripPlannerOpen || isRouteTrackerOpen);

  // Toggle item in trip plan
  const handleToggleTripItem = (dest: CulturalDestination) => {
    if (tripItems.some((t) => t.id === dest.id)) {
      setTripItems(tripItems.filter((t) => t.id !== dest.id));
    } else {
      setTripItems([...tripItems, dest]);
    }
  };

  const handleSelectDestination = (dest: CulturalDestination) => {
    setIsAiConciergeOpen(false);
    setActiveDestination(dest);
    setFlyToCoords(dest.coordinates);
  };

  const handleToggleAiConcierge = () => {
    if (!isAiConciergeOpen) {
      setActiveDestination(null);
    }
    setIsAiConciergeOpen((prev) => !prev);
  };

  const handleApplyAiRecommendations = (recommended: CulturalDestination[]) => {
    const newItems = [...tripItems];
    recommended.forEach((rec) => {
      if (!newItems.some((item) => item.id === rec.id)) {
        newItems.push(rec);
      }
    });
    setTripItems(newItems);
    setIsTripPlannerOpen(true);
    if (recommended.length > 0) {
      setFlyToCoords(recommended[0].coordinates);
      setActiveDestination(recommended[0]);
    }
  };

  const handleLogout = () => {
    clearStoredUser();
  };

  // Route & Weather Tracker logic
  const handleStartPickingWaypoint = (type: "start" | "end") => {
    setIsPickingOnMap(type);
  };

  const handleMapPickWaypoint = (coords: [number, number]) => {
    // Check if clicked near an existing cultural destination
    const thresholdKm = 15;
    let closestDest: CulturalDestination | null = null;
    let minDistance = Infinity;

    DESTINATIONS.forEach((d) => {
      const dLat = (d.coordinates[0] - coords[0]) * 111;
      const dLng = (d.coordinates[1] - coords[1]) * 111 * Math.cos((coords[0] * Math.PI) / 180);
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      if (dist < minDistance) {
        minDistance = dist;
        closestDest = d;
      }
    });

    const name =
      minDistance < thresholdKm && closestDest
        ? (closestDest as CulturalDestination).name
        : `Titik (${coords[0].toFixed(3)}, ${coords[1].toFixed(3)})`;

    const point: RouteWaypoint = {
      lat: coords[0],
      lng: coords[1],
      name,
    };

    if (isPickingOnMap === "start") {
      setStartPoint(point);
    } else if (isPickingOnMap === "end") {
      setEndPoint(point);
    }

    setIsPickingOnMap(null);
  };

  const handleCalculateRoute = async () => {
    if (!startPoint || !endPoint) return;
    setIsCalculatingRoute(true);

    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson&alternatives=true&steps=true`;
      const res = await fetch(osrmUrl);
      const json = await res.json();
      const firstRoute = Array.isArray(json.routes) && json.routes.length ? json.routes[0] : null;

      if (!firstRoute) {
        throw new Error("Rute jalan tidak dapat dihitung untuk kedua titik ini.");
      }

      const totalDist = Number((firstRoute.distance / 1000).toFixed(1));
      const totalDur = Math.round(firstRoute.duration / 60);
      const rawSteps = firstRoute.legs?.[0]?.steps || [];

      // Fetch live BMKG weather for start and end
      const [startWxRes, endWxRes] = await Promise.allSettled([
        fetch(`/api/bmkg/presentwx?lon=${startPoint.lng}&lat=${startPoint.lat}`).then((r) => r.json()),
        fetch(`/api/bmkg/presentwx?lon=${endPoint.lng}&lat=${endPoint.lat}`).then((r) => r.json()),
      ]);

      const startWx = startWxRes.status === "fulfilled" ? startWxRes.value : null;
      const endWx = endWxRes.status === "fulfilled" ? endWxRes.value : null;

      const sampledSteps: RouteWeatherStep[] = [];
      const weatherObservations: any[] = [];

      // Sample steps and attach BMKG weather
      for (let i = 0; i < rawSteps.length; i++) {
        const st = rawSteps[i];
        const mv = st.maneuver || {};
        const loc = Array.isArray(mv.location) ? mv.location : [0, 0];
        const lng = Number(loc[0]);
        const lat = Number(loc[1]);
        const distKm = Number((st.distance / 1000).toFixed(2));
        const durMins = Number((st.duration / 60).toFixed(1));

        let weatherDetail = undefined;

        if (i === 0 && startWx?.data?.cuaca) {
          weatherDetail = {
            condition: startWx.data.cuaca.weather_desc || "Cerah Berawan",
            temperature: startWx.data.cuaca.t ?? 28,
            humidity: startWx.data.cuaca.hu ?? 75,
            windSpeed: startWx.data.cuaca.ws ?? 3.5,
            windDirection: startWx.data.cuaca.wd || "SE",
            visibility: startWx.data.cuaca.vs_text || "> 10 km",
          };
          weatherObservations.push(weatherDetail);
        } else if (i === rawSteps.length - 1 && endWx?.data?.cuaca) {
          weatherDetail = {
            condition: endWx.data.cuaca.weather_desc || "Cerah Berawan",
            temperature: endWx.data.cuaca.t ?? 28,
            humidity: endWx.data.cuaca.hu ?? 75,
            windSpeed: endWx.data.cuaca.ws ?? 3.5,
            windDirection: endWx.data.cuaca.wd || "SE",
            visibility: endWx.data.cuaca.vs_text || "> 10 km",
          };
          weatherObservations.push(weatherDetail);
        } else if (i % 4 === 0 && isFinite(lat) && isFinite(lng) && lat !== 0) {
          try {
            const midRes = await fetch(`/api/bmkg/presentwx?lon=${lng}&lat=${lat}`);
            const midJson = await midRes.json();
            if (midJson?.data?.cuaca) {
              weatherDetail = {
                condition: midJson.data.cuaca.weather_desc || "Cerah Berawan",
                temperature: midJson.data.cuaca.t ?? 28,
                humidity: midJson.data.cuaca.hu ?? 75,
                windSpeed: midJson.data.cuaca.ws ?? 3.5,
                windDirection: midJson.data.cuaca.wd || "SE",
                visibility: midJson.data.cuaca.vs_text || "> 10 km",
              };
              weatherObservations.push(weatherDetail);
            }
          } catch {}
        }

        sampledSteps.push({
          index: i + 1,
          instruction: `${mv.type || "manuver"} ${mv.modifier ? `ke ${mv.modifier}` : ""}`,
          streetName: st.name || "",
          distanceKm: distKm,
          durationMinutes: durMins,
          lat,
          lng,
          bearing: mv.bearing_after || 0,
          type: mv.type || "continue",
          modifier: mv.modifier || "",
          weather: weatherDetail,
        });
      }

      const allTemps = weatherObservations.map((w) => w.temperature);
      const avgTemp = allTemps.length
        ? Math.round(allTemps.reduce((a, b) => a + b, 0) / allTemps.length)
        : 28;

      const hasRain = weatherObservations.some((w) =>
        w.condition?.toLowerCase().includes("hujan")
      );
      const hasSevere = weatherObservations.some(
        (w) =>
          w.condition?.toLowerCase().includes("petir") ||
          w.condition?.toLowerCase().includes("lebat")
      );

      const safetyIndex = hasSevere ? "WASPADA" : hasRain ? "WASPADA" : "AMAN";
      const safetyReason = hasSevere
        ? "Peringatan BMKG: Terdeteksi potensi hujan petir/lebat di beberapa ruas rute perjalanan. Nyalakan lampu kabut & jaga jarak."
        : hasRain
        ? "Info BMKG: Potensi aspal licin dan hujan lokal di sebagian koridor jalan. Kurangi kecepatan saat berkendara."
        : "Kondisi cuaca BMKG cerah berawan merata sepanjang jalur. Sangat aman dan ideal untuk perjalanan wisata budaya.";

      const result: RouteTrackingResult = {
        id: `route_${Date.now()}`,
        start: startPoint,
        destination: endPoint,
        totalDistanceKm: totalDist,
        totalDurationMinutes: totalDur,
        summary: firstRoute.legs?.[0]?.summary || `${startPoint.name} ke ${endPoint.name}`,
        geometry: firstRoute.geometry,
        steps: sampledSteps,
        safetyIndex,
        safetyReason,
        avgTemperature: avgTemp,
        dominantCondition: hasRain ? "Hujan Lokal di Ruas Tertentu" : "Cerah Berawan",
        createdAt: new Date().toISOString(),
      };

      setRouteTrackingResult(result);
      setIsRouteTrackerOpen(true);
      setIsTripPlannerOpen(false); // Close trip planner to focus on route tracking
    } catch (err: any) {
      console.error("Route calculation error:", err);
      alert(err?.message || "Gagal menghubungkan rute perjalanan");
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const handleStartSimulation = () => {
    setIsSimulating(false);
    setTimeout(() => setIsSimulating(true), 50);
  };

  const handleLoadSavedRoute = (saved: SavedTravelRoute) => {
    setStartPoint(saved.routeData.start);
    setEndPoint(saved.routeData.destination);
    setRouteTrackingResult(saved.routeData);
  };

  const handleClearRoute = () => {
    setRouteTrackingResult(null);
    setIsSimulating(false);
    setFocusedStep(null);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[var(--bx-bg)] text-[var(--bx-ink)] font-sans flex">
      {/* Sliding Trip Planner Drawer (Left Drawer) */}
      <TripPlannerDrawer
        isOpen={isTripPlannerOpen}
        onClose={() => setIsTripPlannerOpen(false)}
        tripItems={tripItems}
        onRemoveItem={(id) => setTripItems(tripItems.filter((t) => t.id !== id))}
        currency={currency}
        language={language}
        onFocusDestination={handleSelectDestination}
      />

      {/* Sliding Route & Weather Tracker Drawer (Left Drawer) */}
      <RouteTrackerDrawer
        isOpen={isRouteTrackerOpen}
        onClose={() => {
          setIsRouteTrackerOpen(false);
          setIsPickingOnMap(null);
        }}
        authUser={authUser}
        startPoint={startPoint}
        endPoint={endPoint}
        routeResult={routeTrackingResult}
        isPickingOnMap={isPickingOnMap}
        onStartPicking={handleStartPickingWaypoint}
        onCancelPicking={() => setIsPickingOnMap(null)}
        onSelectWaypoint={(type, point) => {
          if (type === "start") setStartPoint(point);
          else setEndPoint(point);
        }}
        onCalculateRoute={handleCalculateRoute}
        isCalculating={isCalculatingRoute}
        onStartSimulation={handleStartSimulation}
        isSimulating={isSimulating}
        onFocusStep={setFocusedStep}
        onLoadSavedRoute={handleLoadSavedRoute}
        onClearRoute={handleClearRoute}
      />

      {/* Main Content Viewport (shifts & contracts width when left or right drawers open) */}
      <div
        className={`relative h-full transition-all duration-300 ease-in-out ${
          isLeftDrawerOpen ? "sm:ml-[420px]" : "ml-0"
        } ${
          isRightDrawerOpen && isLeftDrawerOpen
            ? "w-full sm:w-[calc(100%-840px)] lg:w-[calc(100%-880px)]"
            : isRightDrawerOpen
            ? "w-full sm:w-[calc(100%-420px)] lg:w-[calc(100%-460px)]"
            : isLeftDrawerOpen
            ? "w-full sm:w-[calc(100%-420px)]"
            : "w-full"
        }`}
      >
        {/* Fullscreen Interactive Leaflet Adventure Map */}
        <AdventureMap
          destinations={DESTINATIONS}
          selectedCategory={selectedCategory}
          onSelectDestination={handleSelectDestination}
          activeDestination={activeDestination}
          tripItems={tripItems}
          flyToCoords={flyToCoords}
          onMapMove={handleMapMove}
          zoomTrigger={zoomTrigger}
          mapStyle={mapStyle}
          layerOptions={layerOptions}
          bmkgLayers={bmkgLayers}
          isPickingOnMap={isPickingOnMap}
          onMapPickWaypoint={handleMapPickWaypoint}
          routeTrackingResult={routeTrackingResult}
          focusedStep={focusedStep}
          isSimulating={isSimulating}
        />

        {/* Floating HUD: Top-Left Brand (Kembali ke Portal) */}
        <BrandWidget />

        {/* Floating HUD: Top-Right Trip Plan Icon, Category Dropdown, Search & Bar Hala Ai */}
        <SearchWidget
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          tripItemCount={tripItems.length}
          onOpenTripPlanner={() => {
            setIsRouteTrackerOpen(false);
            setIsTripPlannerOpen((prev) => !prev);
          }}
          isTripPlannerOpen={isTripPlannerOpen}
          onSelectDestination={handleSelectDestination}
          onOpenAiConcierge={handleToggleAiConcierge}
          isAiConciergeOpen={isAiConciergeOpen}
          language={language}
        />
      </div>

      {/* Sliding Destination Detail Sheet (Right Drawer) */}
      <DestinationSheet
        destination={activeDestination}
        onClose={() => setActiveDestination(null)}
        currency={currency}
        language={language}
        onAddToTrip={handleToggleTripItem}
        isInTrip={activeDestination ? tripItems.some((t) => t.id === activeDestination.id) : false}
      />

      {/* Full-Height Column Bar Hala Ai Slider from the Right */}
      <AiConciergeDrawer
        isOpen={isAiConciergeOpen}
        onClose={() => setIsAiConciergeOpen(false)}
        onApplyRecommendations={handleApplyAiRecommendations}
        onFocusDestination={handleSelectDestination}
        language={language}
      />

      {/* UNIFIED BOTTOM FOOTER BAR */}
      <footer className="fixed bottom-0 inset-x-0 z-50 h-11 sm:h-12 bg-[var(--bx-surface)]/95 backdrop-blur-xl border-t border-[var(--bx-border)] px-2 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-3 text-[var(--bx-ink)] select-none">
        {/* Left Functional Group: Music Player, Map Style, BMKG Filter Drop-Up & Route Weather Tracker */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* 1. Background Music Player */}
          <div className="shrink-0">
            <MusicPlayer
              geoTrackId={detectedGeo.trackId}
              geoNextTrackId={detectedGeo.nextTrackId}
              geoRegionName={detectedGeo.regionName}
              isOverview={detectedGeo.isOverview}
            />
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-[var(--bx-border)] shrink-0" />

          {/* 2. Map Style & Layer Options */}
          <div className="shrink-0">
            <MapLayersWidget
              mapStyle={mapStyle}
              onSelectMapStyle={setMapStyle}
              layerOptions={layerOptions}
              onToggleLayerOption={handleToggleLayerOption}
              language={language}
            />
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-[var(--bx-border)] shrink-0" />

          {/* 3. BMKG Data Layers Filter (Drop-up list) */}
          <div className="shrink-0">
            <BmkgFilterWidget
              bmkgLayers={bmkgLayers}
              onToggleLayer={handleToggleBmkgLayer}
              onSetAllLayers={handleSetAllBmkgLayers}
              language={language}
              isLoading={isBmkgLoading}
            />
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-[var(--bx-border)] shrink-0" />

          {/* 4. Travel Route & Weather Tracker Button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsTripPlannerOpen(false);
                setIsRouteTrackerOpen((prev) => !prev);
              }}
              aria-label="Buka Pelacak Rute & Cuaca Perjalanan"
              title="Cek Rute & Prakiraan Cuaca Perjalanan BMKG"
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all duration-200 active:scale-95 ${
                isRouteTrackerOpen || routeTrackingResult
                  ? "bg-amber-500/15 border-amber-500 text-amber-400 font-bold shadow-xs"
                  : "bg-[var(--bx-bg)] hover:bg-[var(--bx-surface-card)] border-[var(--bx-border)] text-[var(--bx-ink)]"
              }`}
            >
              <RouteIcon className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Cek Rute & Cuaca</span>
              <span className="sm:hidden hidden xs:inline">Rute</span>
              {routeTrackingResult && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          </div>
        </div>

        {/* Right Functional Group: BMKG Weather Telemetry, Custom Zoom, Theme & Session Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* 5. BMKG Weather Telemetry (compact / hidden on very narrow mobile screens) */}
          <div className="shrink-0 hidden md:flex">
            <BmkgWeatherBar
              activeDestination={activeDestination}
              mapCenterCoords={mapCenterCoords}
              language={language}
            />
          </div>

          {/* Separator between BMKG Bar and Zoom Controls */}
          <div className="w-px h-5 bg-[var(--bx-border)] shrink-0 hidden md:block" />

          {/* 6. Custom Map Zoom Controls (+ / -) */}
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setZoomTrigger({ type: "in", id: Date.now() })}
              aria-label="Perbesar peta"
              title="Perbesar peta (+)"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--bx-bg)] hover:bg-[var(--gold)] hover:text-white text-[var(--gold)] border border-[var(--bx-border)] font-bold transition active:scale-90"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomTrigger({ type: "out", id: Date.now() })}
              aria-label="Perkecil peta"
              title="Perkecil peta (-)"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--bx-bg)] hover:bg-[var(--gold)] hover:text-white text-[var(--gold)] border border-[var(--bx-border)] font-bold transition active:scale-90"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Separator between Zoom Controls and Theme Toggle */}
          <div className="w-px h-5 bg-[var(--bx-border)] shrink-0 hidden sm:block" />

          {/* 7. Theme Toggle */}
          <div className="shrink-0">
            <ThemeToggle />
          </div>

          {/* Separator between Theme Toggle and Session Buttons */}
          <div className="w-px h-5 bg-[var(--bx-border)] shrink-0" />

          {/* 8. Sesi Login: Tombol "Ke Portal" dan "Logout" jika sudah login, atau "Masuk" jika belum */}
          <div className="shrink-0">
            {authUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Link
                  href="/"
                  aria-label="Kembali ke Portal Dashboard"
                  title={`Kembali ke Dashboard Portal Nusa Antara (Masuk sebagai ${authUser.name})`}
                  className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-[var(--gold)]/15 hover:bg-[var(--gold)] border border-[var(--gold)]/40 hover:border-[var(--gold)] text-[var(--gold)] hover:text-white font-bold text-xs shadow-xs transition active:scale-95 shrink-0 group"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[var(--gold)] group-hover:text-white transition-colors shrink-0" />
                  <span className="hidden sm:inline">Ke Portal</span>
                  <span className="sm:hidden">Portal</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Keluar / Logout dari Sesi"
                  title={`Keluar dari sesi akun ${authUser.name}`}
                  className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-[var(--bx-bg)] hover:bg-rose-500/15 border border-[var(--bx-border)] hover:border-rose-400 text-rose-600 dark:text-rose-400 font-bold text-xs shadow-xs transition active:scale-95 shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="Masuk ke Akun Nusa Antara"
                title="Masuk ke Akun Nusa Antara"
                className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-[var(--gold)]/15 hover:bg-[var(--gold)] border border-[var(--gold)]/40 hover:border-[var(--gold)] text-[var(--gold)] hover:text-white font-bold text-xs shadow-xs transition active:scale-95 shrink-0 group"
              >
                <LogIn className="w-3.5 h-3.5 text-[var(--gold)] group-hover:text-white transition-colors shrink-0" />
                <span>Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function PetaPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-amber-400">
          <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mb-3"></div>
          <p className="text-xs uppercase tracking-widest font-black">
            Menyiapkan Peta Petualangan...
          </p>
        </div>
      }
    >
      <PetaContent />
    </Suspense>
  );
}
