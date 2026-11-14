"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Plus, Minus } from "lucide-react";
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
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans flex">
      {/* Main Content Viewport (shifts & contracts width when either AI Chat or Destination Detail slider opens) */}
      <div
        className={`relative h-full transition-all duration-300 ease-in-out ${
          isRightDrawerOpen
            ? "w-full md:w-[calc(100%-420px)] lg:w-[calc(100%-460px)]"
            : "w-full"
        }`}
      >
        {/* Fullscreen Interactive OpenStreetMap Canvas */}
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

        {/* Floating HUD: Top-Left Brand (Transparent, Logo & Thin Title) */}
        <BrandWidget />


        {/* Floating HUD: Top-Right Trip Plan Icon, Category Dropdown, Search & Bar Hala Ai */}
        <SearchWidget
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          tripItemCount={tripItems.length}
          onOpenTripPlanner={() => setIsTripPlannerOpen(true)}
          onSelectDestination={handleSelectDestination}
          onOpenAiConcierge={handleToggleAiConcierge}
          isAiConciergeOpen={isAiConciergeOpen}
          language={language}
        />

        {/* Floating HUD: Bottom Bar (Music Player, Map Layers, BMKG Flat Telemetry & Zoom Controls Aligned Horizontally) */}
        <div className="absolute bottom-3 inset-x-0 z-20 px-3 sm:px-4 flex items-center justify-between gap-2.5 pointer-events-none select-none">
          {/* Left: Background Music Player */}
          <div className="pointer-events-auto shrink-0">
            <MusicPlayer
              geoTrackId={detectedGeo.trackId}
              geoNextTrackId={detectedGeo.nextTrackId}
              geoRegionName={detectedGeo.regionName}
              isOverview={detectedGeo.isOverview}
            />
          </div>

          {/* Right: Map Layers Widget, BMKG Flat Telemetry & Zoom In/Out Buttons */}
          <div className="pointer-events-auto flex items-center gap-2">
            <MapLayersWidget
              mapStyle={mapStyle}
              onSelectMapStyle={setMapStyle}
              layerOptions={layerOptions}
              onToggleLayerOption={handleToggleLayerOption}
              language={language}
            />

            <BmkgWeatherBar
              activeDestination={activeDestination}
              mapCenterCoords={mapCenterCoords}
              language={language}
              onSelectEventLocation={(coords) => setFlyToCoords(coords)}
            />

            {/* Custom Map Zoom Controls (+ / -) Matching Height of BMKG Bar */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-full p-1 flex items-center gap-1 shadow-2xl text-white shrink-0">
              <button
                type="button"
                onClick={() => setZoomTrigger({ type: "in", id: Date.now() })}
                aria-label="Perbesar peta"
                title="Perbesar peta (+)"
                className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold transition active:scale-90"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomTrigger({ type: "out", id: Date.now() })}
                aria-label="Perkecil peta"
                title="Perkecil peta (-)"
                className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold transition active:scale-90"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

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
      </div>

      {/* Sliding Destination Detail Sheet (Right Drawer - same sliding column as AI chat) */}
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
    </main>
  );
}
