"use client";

import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Plus, Minus, LogIn, UserCheck } from "lucide-react";
import { DESTINATIONS, CulturalDestination, Category } from "@/data/destinations";
import { AppHeader } from "@/components/hud/AppHeader";
import { SideMenuTree } from "@/components/hud/SideMenuTree";
import { BmkgWeatherBar } from "@/components/hud/BmkgWeatherBar";
import { MusicPlayer } from "@/components/hud/MusicPlayer";
import { DestinationSheet } from "@/components/hud/DestinationSheet";
import { TripPlannerDrawer } from "@/components/hud/TripPlannerDrawer";
import { AiConciergeDrawer } from "@/components/hud/AiConciergeDrawer";
import { MapLayersWidget } from "@/components/hud/MapLayersWidget";
import { MapBaseStyle, MapLayerOptions } from "@/data/mapStyles";
import { detectRegionFromCoordinates } from "@/utils/regionAudioDetector";
import { getStoredUser, subscribeAuth, AuthUser } from "@/lib/auth";

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

export default function Home() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(true);
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

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 1. TOP HEADER (Fixed at top, edge-to-edge, with minimize menu button) */}
      <AppHeader
        isSideMenuOpen={isSideMenuOpen}
        onToggleSideMenu={() => setIsSideMenuOpen((prev) => !prev)}
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

      {/* 2. SIDE MENU (Tree Menu - located below header and above footer) */}
      <SideMenuTree
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        onSelectDestination={handleSelectDestination}
        activeDestination={activeDestination}
        tripItems={tripItems}
        onToggleTripItem={handleToggleTripItem}
        onFlyToCoords={(coords) => setFlyToCoords(coords)}
        language={language}
      />

      {/* Sliding Trip Planner Drawer (Left Drawer, below header and above footer) */}
      <TripPlannerDrawer
        isOpen={isTripPlannerOpen}
        onClose={() => setIsTripPlannerOpen(false)}
        tripItems={tripItems}
        onRemoveItem={(id) => setTripItems(tripItems.filter((t) => t.id !== id))}
        currency={currency}
        language={language}
        onFocusDestination={handleSelectDestination}
      />

      {/* 3. MAIN MAP VIEWPORT (Strictly positioned between header and footer) */}
      <div
        className={`absolute top-14 bottom-11 sm:bottom-12 inset-x-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isSideMenuOpen ? "sm:left-[320px] lg:left-[352px]" : "left-0"
        } ${
          isRightDrawerOpen
            ? "right-0 sm:right-[420px] lg:right-[460px]"
            : "right-0"
        }`}
      >
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
      </div>

      {/* Sliding Destination Detail Sheet (Right Drawer, below header and above footer) */}
      <DestinationSheet
        destination={activeDestination}
        onClose={() => setActiveDestination(null)}
        currency={currency}
        language={language}
        onAddToTrip={handleToggleTripItem}
        isInTrip={activeDestination ? tripItems.some((t) => t.id === activeDestination.id) : false}
      />

      {/* Full-Height Column Bar Hala Ai Slider from the Right (below header and above footer) */}
      <AiConciergeDrawer
        isOpen={isAiConciergeOpen}
        onClose={() => setIsAiConciergeOpen(false)}
        onApplyRecommendations={handleApplyAiRecommendations}
        onFocusDestination={handleSelectDestination}
        language={language}
      />

      {/* 4. UNIFIED BOTTOM FOOTER BAR (Solid Edge-to-Edge with Vertical Separators and Login Button at Right Corner) */}
      <footer className="fixed bottom-0 inset-x-0 z-30 h-11 sm:h-12 bg-slate-950/95 backdrop-blur-xl border-t border-amber-500/30 px-3 sm:px-4 flex items-center justify-between gap-3 text-white select-none overflow-x-auto custom-scrollbar">
        {/* Left Functional Group: Music Player & Map Style/Layers */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 1. Background Music Player (Clean, title hidden when minimized, drop-up available) */}
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

        {/* Right Functional Group: BMKG Weather Telemetry, Custom Zoom & Login Button */}
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

          {/* Separator between Zoom Controls and Login Button */}
          <div className="w-px h-5 bg-white/20 shrink-0" />

          {/* 5. Tombol Login di Kanan Pojok Footer ("buat tombol login di kanan pojok footer") */}
          <div className="shrink-0">
            {authUser ? (
              <Link
                href="/login"
                aria-label={`Akun ${authUser.name}`}
                title={`Masuk sebagai ${authUser.name} (${authUser.phone || authUser.email}). Klik untuk kelola akun.`}
                className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 hover:border-emerald-400 text-emerald-300 font-bold text-xs shadow-md transition active:scale-95 shrink-0"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="max-w-[70px] sm:max-w-[110px] truncate">{authUser.name}</span>
              </Link>
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
