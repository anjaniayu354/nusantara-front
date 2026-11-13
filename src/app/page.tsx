"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { DESTINATIONS, CulturalDestination, Category } from "@/data/destinations";
import { BrandWidget } from "@/components/hud/BrandWidget";
import { SearchWidget } from "@/components/hud/SearchWidget";
import { BmkgWeatherBar } from "@/components/hud/BmkgWeatherBar";
import { MusicPlayer } from "@/components/hud/MusicPlayer";
import { DestinationSheet } from "@/components/hud/DestinationSheet";
import { TripPlannerDrawer } from "@/components/hud/TripPlannerDrawer";
import { AiConciergeDrawer } from "@/components/hud/AiConciergeDrawer";

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

  // Toggle item in trip plan
  const handleToggleTripItem = (dest: CulturalDestination) => {
    if (tripItems.some((t) => t.id === dest.id)) {
      setTripItems(tripItems.filter((t) => t.id !== dest.id));
    } else {
      setTripItems([...tripItems, dest]);
    }
  };

  const handleSelectDestination = (dest: CulturalDestination) => {
    setActiveDestination(dest);
    setFlyToCoords(dest.coordinates);
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
      {/* Main Content Viewport (shifts & contracts width when AI Concierge slider opens) */}
      <div
        className={`relative h-full transition-all duration-300 ease-in-out ${
          isAiConciergeOpen
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
          onMapMove={setMapCenterCoords}
        />

        {/* Floating HUD: Top-Left Brand (Transparent, Logo & Thin Title) */}
        <BrandWidget />

        {/* Floating HUD: Top-Right Trip Plan Icon, Category Dropdown, Search & AI Concierge (Barong Icon) */}
        <SearchWidget
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          tripItemCount={tripItems.length}
          onOpenTripPlanner={() => setIsTripPlannerOpen(true)}
          onSelectDestination={handleSelectDestination}
          onOpenAiConcierge={() => setIsAiConciergeOpen((prev) => !prev)}
          isAiConciergeOpen={isAiConciergeOpen}
          language={language}
        />

        {/* Floating HUD: Bottom Bar (Music Player & BMKG Flat Telemetry Aligned Horizontally) */}
        <div className="absolute bottom-3 inset-x-0 z-20 px-3 sm:px-4 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none select-none">
          {/* Left: Background Music Player */}
          <div className="pointer-events-auto">
            <MusicPlayer />
          </div>

          {/* Right/Center: BMKG Flat Telemetry & Cultural Radar */}
          <div className="pointer-events-auto">
            <BmkgWeatherBar
              activeDestination={activeDestination}
              mapCenterCoords={mapCenterCoords}
              language={language}
              onSelectEventLocation={(coords) => setFlyToCoords(coords)}
            />
          </div>
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

      {/* Full-Height Column AI Concierge Slider from the Right */}
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
