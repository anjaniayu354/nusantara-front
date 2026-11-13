"use client";

import React from "react";
import { X, MapPin, Compass, ShieldAlert, Sparkles, HeartHandshake, Plus, Check, ExternalLink } from "lucide-react";
import { CulturalDestination } from "@/data/destinations";
import { formatCurrency } from "@/lib/currency";

interface DestinationSheetProps {
  destination: CulturalDestination | null;
  onClose: () => void;
  currency: "IDR" | "USD";
  language: "ID" | "EN";
  onAddToTrip: (dest: CulturalDestination) => void;
  isInTrip: boolean;
}

export function DestinationSheet({
  destination,
  onClose,
  currency,
  language,
  onAddToTrip,
  isInTrip,
}: DestinationSheetProps) {
  if (!destination) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dest-sheet-title"
      className="fixed inset-y-0 right-0 z-30 w-full sm:w-[450px] bg-slate-950/95 backdrop-blur-xl border-l border-amber-500/30 shadow-2xl flex flex-col text-white transform transition-transform duration-300 animate-in slide-in-from-right"
    >
      {/* Header bar with photo banner */}
      <div className="relative h-48 w-full overflow-hidden shrink-0">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup jendela destinasi"
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge category */}
        <div className="absolute top-4 left-4 flex gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full shadow">
            {destination.category}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
            {destination.province}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <h2 id="dest-sheet-title" className="text-lg font-black text-white leading-tight">
            {destination.name}
          </h2>
          <p className="text-xs text-amber-300 font-medium">{destination.subtitle}</p>
        </div>
      </div>

      {/* Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Cultural Description & Significance */}
        <div>
          <h3 className="text-xs uppercase tracking-wider font-bold text-amber-400 mb-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Cerita Budaya & Sejarah
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed">{destination.description}</p>
          <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
            <strong>Nilai Filosofis:</strong> {destination.historicalSignificance}
          </div>
        </div>

        {/* Etiquette & Taboos (Etika & Pantangan Adat) */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
          <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Etika Kunjungan & Pantangan Adat
          </h3>
          
          <div className="text-[11px] space-y-1.5">
            <div>
              <span className="font-semibold text-slate-300">Aturan Busana: </span>
              <span className="text-slate-200">{destination.etiquette.dressCode}</span>
            </div>
            <div>
              <span className="font-semibold text-rose-300">Pantangan (Tabu):</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
                {destination.etiquette.taboos.map((taboo, idx) => (
                  <li key={idx} className="text-rose-200/90">{taboo}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold text-amber-300">Ritual / Tata Cara: </span>
              <span className="text-slate-300">{destination.etiquette.rituals}</span>
            </div>
          </div>
        </div>

        {/* Local EO / Community Tour Package */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              Paket Wisata EO Komunitas Lokal
            </h3>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              2.5% Dana Adat
            </span>
          </div>

          <p className="text-xs font-bold text-white">{destination.tripPackage.title}</p>
          <div className="flex justify-between items-center text-[11px] text-slate-300">
            <span>Penyelenggara: {destination.tripPackage.organizer}</span>
            <span className="font-medium text-amber-300">{destination.tripPackage.duration}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div>
              <span className="text-[10px] text-slate-400">Harga Paket ({currency}):</span>
              <p className="text-base font-black text-amber-400">
                {formatCurrency(
                  currency === "USD" ? destination.tripPackage.priceUsd : destination.tripPackage.priceIdr,
                  currency
                )}
              </p>
            </div>

            <button
              onClick={() => onAddToTrip(destination)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                isInTrip
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
              }`}
            >
              {isInTrip ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Ada di Rute</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah ke Rute</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
