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
import { AiConciergeModal } from "@/components/hud/AiConciergeModal";

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
    DESTINATIONS[0], // Candi Borobudur default
    DESTINATIONS[9], // Keraton Yogyakarta default
  ]);
  const [currency, setCurrency] = useState<"IDR" | "USD">("IDR");
  const [language, setLanguage] = useState<"ID" | "EN">("ID");
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState<boolean>(false);
  const [isAiConciergeOpen, setIsAiConciergeOpen] = useState<boolean>(false);
  const [flyToCoords, setFlyToCoords] = useState<[number, number] | null>(null);

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
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* Fullscreen Interactive OpenStreetMap Canvas */}
      <AdventureMap
        destinations={DESTINATIONS}
        selectedCategory={selectedCategory}
        onSelectDestination={handleSelectDestination}
        activeDestination={activeDestination}
        tripItems={tripItems}
        flyToCoords={flyToCoords}
      />

      {/* Floating HUD: Top-Left Brand, Filters, Language & Currency */}
      <BrandWidget
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        currency={currency}
        onToggleCurrency={() => setCurrency(currency === "IDR" ? "USD" : "IDR")}
        language={language}
        onToggleLanguage={() => setLanguage(language === "ID" ? "EN" : "ID")}
        tripItemCount={tripItems.length}
        onOpenTripPlanner={() => setIsTripPlannerOpen(true)}
      />

      {/* Floating HUD: Top-Right Search & AI Concierge Trigger */}
      <SearchWidget
        onSelectDestination={handleSelectDestination}
        onOpenAiConcierge={() => setIsAiConciergeOpen(true)}
        language={language}
      />

      {/* Floating HUD: Background Music Player with Continuous Loop */}
      <MusicPlayer />

      {/* Floating HUD: Bottom Telemetry BMKG SATU PETA MKG & Cultural Radar */}
      <BmkgWeatherBar
        activeDestination={activeDestination}
        language={language}
        onSelectEventLocation={(coords) => setFlyToCoords(coords)}
      />

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

      {/* AI Concierge Preference Quiz Modal */}
      <AiConciergeModal
        isOpen={isAiConciergeOpen}
        onClose={() => setIsAiConciergeOpen(false)}
        onApplyRecommendations={handleApplyAiRecommendations}
        language={language}
      />
    </main>
  );
}
