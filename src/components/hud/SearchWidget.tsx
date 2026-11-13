"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Sparkles, X, MapPin, Tag } from "lucide-react";
import { DESTINATIONS, CulturalDestination } from "@/data/destinations";

interface SearchWidgetProps {
  onSelectDestination: (dest: CulturalDestination) => void;
  onOpenAiConcierge: () => void;
  language: "ID" | "EN";
}

export function SearchWidget({
  onSelectDestination,
  onOpenAiConcierge,
  language,
}: SearchWidgetProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filtered = query.trim()
    ? DESTINATIONS.filter((d) => {
        const q = query.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.province.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          d.description.toLowerCase().includes(q)
        );
      })
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-4 right-4 z-20 flex items-center gap-2 max-w-sm sm:max-w-md w-full justify-end"
    >
      <div className="relative flex-1">
        {/* Search Input Bar */}
        <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-2xl px-3 py-2 shadow-2xl text-white">
          <Search className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={
              language === "ID"
                ? "Cari candi, desa adat, pantai, tradisi..."
                : "Search temples, villages, beaches, culture..."
            }
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && filtered.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-2xl p-2 shadow-2xl max-h-72 overflow-y-auto">
            {filtered.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  onSelectDestination(d);
                  setIsOpen(false);
                  setQuery("");
                }}
                className="w-full text-left p-2 rounded-xl hover:bg-white/10 flex items-start gap-2.5 transition text-white"
              >
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-amber-300 truncate">{d.name}</p>
                  <p className="text-[10px] text-slate-300 truncate">{d.province} • {d.subtitle}</p>
                  <div className="flex gap-1 mt-1">
                    {d.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[9px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* AI Concierge Trigger Button */}
      <button
        onClick={onOpenAiConcierge}
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition whitespace-nowrap"
        title="AI Concierge Rekomendasi Budaya"
      >
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">AI Concierge</span>
      </button>
    </div>
  );
}
