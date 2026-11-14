"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Minus, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { DESTINATIONS, CulturalDestination, Category } from "@/data/destinations";
import { BrandWidget } from "@/components/hud/BrandWidget";
import { SearchWidget } from "@/components/hud/SearchWidget";
import { BmkgWeatherBar } from "@/components/hud/BmkgWeatherBar";
import { MusicPlayer } from "@/components/hud/MusicPlayer";
import { DestinationSheet } from "@/components/hud/DestinationSheet";
import { TripPlannerDrawer } from "@/components/hud/TripPlannerDrawer";
import { AiConciergeDrawer } from "@/components/hud/AiConciergeDrawer";
import { MapLayersWidget } from "@/components/hud/MapLayersWidget";
import { MapBaseStyle, MapLayerOptions } from "@/data/mapStyles";
import { detectRegionFromCoordinates } from "@/utils/regionAudioDetector";
import { getStoredUser, subscribeAuth, clearStoredUser, AuthUser } from "@/lib/auth";

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
  const [mapStyle, setMapStyle] = useState<MapBaseStyle>("kontur");
  const [layerOptions, setLayerOptions] = useState<MapLayerOptions>({
    contourOverlay: false,
    labelsOverlay: true,
    seaMarksOverlay: false,
    culturalRadar: true,
  });
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

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

  // Check if any right drawer (Bar Hala Ai chat or Destination detail) is open
  const isRightDrawerOpen = Boolean(isAiConciergeOpen || activeDestination);

  // Toggle item in trip plan
  const handleToggleTripItem = (dest: CulturalDestination) => {
    if (tripItems.some((t) => t.id === dest.id)) {
      setTripItems(tripItems.filter((t) => t.id !== dest.id));
    } else {
      setTripItems([...tripItems, dest]);
    }
  };

  const handleSelectDestination = (dest: CulturalDestination) => {
    // Close Bar Hala Ai chat so destination detail takes right slider smoothly
    setIsAiConciergeOpen(false);
    setActiveDestination(dest);
    setFlyToCoords(dest.coordinates);
  };

  const handleToggleAiConcierge = () => {
    if (!isAiConciergeOpen) {
      // Close destination detail so Bar Hala Ai chat takes right slider smoothly
      setActiveDestination(null);
    }
    setIsAiConciergeOpen((prev) => !prev);
  };

  const handleApplyAiRecommendations = (recommended: CulturalDestination[]) => {
    // Merge recommendations without duplicates
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

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans flex">
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

      {/* Main Content Viewport (shifts & contracts width when either Trip Plan or Right Drawer opens) */}
      <div
        className={`relative h-full transition-all duration-300 ease-in-out ${
          isTripPlannerOpen ? "sm:ml-[420px]" : "ml-0"
        } ${
          isRightDrawerOpen && isTripPlannerOpen
            ? "w-full sm:w-[calc(100%-840px)] lg:w-[calc(100%-880px)]"
            : isRightDrawerOpen
            ? "w-full sm:w-[calc(100%-420px)] lg:w-[calc(100%-460px)]"
            : isTripPlannerOpen
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
        />

        {/* Floating HUD: Top-Left Brand (Kembali ke Portal) */}
        <BrandWidget />

        {/* Floating HUD: Top-Right Trip Plan Icon, Category Dropdown, Search & Bar Hala Ai */}
        <SearchWidget
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          tripItemCount={tripItems.length}
          onOpenTripPlanner={() => setIsTripPlannerOpen((prev) => !prev)}
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
      <footer className="fixed bottom-0 inset-x-0 z-30 h-11 sm:h-12 bg-slate-950/95 backdrop-blur-xl border-t border-amber-500/30 px-3 sm:px-4 flex items-center justify-between gap-3 text-white select-none overflow-x-auto custom-scrollbar">
        {/* Left Functional Group: Music Player & Map Style/Layers */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 1. Background Music Player */}
          <div className="shrink-0">
            <MusicPlayer
              geoTrackId={detectedGeo.trackId}
              geoNextTrackId={detectedGeo.nextTrackId}
              geoRegionName={detectedGeo.regionName}
              isOverview={detectedGeo.isOverview}
            />
          </div>

          {/* Separator between Music Player and Map Style */}
          <div className="w-px h-5 bg-white/20 shrink-0" />

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
        </div>

        {/* Right Functional Group: BMKG Weather Telemetry, Custom Zoom & Session Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 3. BMKG Weather Telemetry & Cultural Event Radar */}
          <div className="shrink-0">
            <BmkgWeatherBar
              activeDestination={activeDestination}
              mapCenterCoords={mapCenterCoords}
              language={language}
              onSelectEventLocation={(coords) => setFlyToCoords(coords)}
            />
          </div>

          {/* Separator between BMKG Bar and Zoom Controls */}
          <div className="w-px h-5 bg-white/20 shrink-0" />

          {/* 4. Custom Map Zoom Controls (+ / -) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setZoomTrigger({ type: "in", id: Date.now() })}
              aria-label="Perbesar peta"
              title="Perbesar peta (+)"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold transition active:scale-90"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomTrigger({ type: "out", id: Date.now() })}
              aria-label="Perkecil peta"
              title="Perkecil peta (-)"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold transition active:scale-90"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Separator between Zoom Controls and Session Buttons */}
          <div className="w-px h-5 bg-white/20 shrink-0" />

          {/* 5. Sesi Login: Tombol "Ke Portal" dan "Logout" jika sudah login, atau "Masuk" jika belum */}
          <div className="shrink-0">
            {authUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Tombol Ke Portal */}
                <Link
                  href="/"
                  aria-label="Kembali ke Portal Dashboard"
                  title={`Kembali ke Dashboard Portal Nusa Antara (Masuk sebagai ${authUser.name})`}
                  className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/30 hover:from-amber-500 hover:to-amber-600 border border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-slate-950 font-bold text-xs shadow-md transition active:scale-95 shrink-0 group"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950 transition-colors shrink-0" />
                  <span className="hidden sm:inline">Ke Portal</span>
                  <span className="sm:hidden">Portal</span>
                </Link>

                {/* Tombol Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Keluar / Logout dari Sesi"
                  title={`Keluar dari sesi akun ${authUser.name}`}
                  className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/40 hover:border-rose-400 text-rose-300 hover:text-rose-100 font-bold text-xs shadow-md transition active:scale-95 shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="Masuk ke Akun Nusa Antara"
                title="Masuk ke Akun Nusa Antara (No HP & Google SSO)"
                className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/30 hover:from-amber-500 hover:to-amber-600 border border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-slate-950 font-bold text-xs shadow-md transition active:scale-95 shrink-0 group"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950 transition-colors shrink-0" />
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
