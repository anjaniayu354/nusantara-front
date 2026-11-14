"use client";

import React from "react";
import {
  X,
  MapPin,
  Compass,
  ShieldAlert,
  Sparkles,
  HeartHandshake,
  Plus,
  Check,
  Sprout,
  Shirt,
  Landmark,
  CalendarDays,
} from "lucide-react";
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
  // Retain last active destination so that slide-out transition animates smoothly
  const [cachedDestination, setCachedDestination] = React.useState<CulturalDestination | null>(destination);

  React.useEffect(() => {
    if (destination) {
      setCachedDestination(destination);
    }
  }, [destination]);

  const active = destination || cachedDestination;
  if (!active) return null;

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="dest-sheet-title"
      className={`fixed top-14 bottom-11 sm:bottom-12 right-0 z-30 w-full sm:w-[420px] lg:w-[460px] bg-slate-950/95 backdrop-blur-2xl border-l border-amber-500/30 shadow-2xl flex flex-col text-white transform transition-transform duration-300 ease-in-out ${
        destination ? "translate-x-0" : "translate-x-full pointer-events-none"
      }`}
    >
      {/* Header bar with photo banner */}
      <div className="relative h-48 w-full overflow-hidden shrink-0">
        <img
          src={active.imageUrl}
          alt={active.name}
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

        {/* Badge category & province */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full shadow">
            {active.category}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
            {active.province}
          </span>
          {active.subCategory && (
            <span className="text-[10px] font-medium bg-slate-900/80 text-slate-200 px-2.5 py-1 rounded-full border border-white/10">
              {active.subCategory}
            </span>
          )}
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <h2 id="dest-sheet-title" className="text-lg font-black text-white leading-tight">
            {active.name}
          </h2>
          <p className="text-xs text-amber-300 font-medium">{active.subtitle}</p>
        </div>
      </div>

      {/* Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Cultural Description & Significance */}
        <div>
          <h3 className="text-xs uppercase tracking-wider font-bold text-amber-400 mb-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Cerita Budaya & Sejarah
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed">{active.description}</p>
          <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
            <strong>Nilai Filosofis:</strong> {active.historicalSignificance}
          </div>
        </div>

        {/* Traditional Attire (Pakaian Adat & Wastra) */}
        {active.traditionalAttire && (
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shirt className="w-4 h-4 text-amber-400" />
              Pakaian Adat & Wastra Tradisional
            </h3>
            <div className="text-[11px] space-y-1.5 text-slate-300">
              <div>
                <span className="font-semibold text-white">Nama Busana: </span>
                <span className="text-amber-200 font-medium">{active.traditionalAttire.name}</span>
              </div>
              <div>
                <span className="font-semibold text-white">Wastra / Kain: </span>
                <span>{active.traditionalAttire.wastraType}</span>
              </div>
              {active.traditionalAttire.headgear && (
                <div>
                  <span className="font-semibold text-white">Tutup Kepala / Mahkota: </span>
                  <span className="text-amber-300">{active.traditionalAttire.headgear}</span>
                </div>
              )}
              {active.traditionalAttire.colors && active.traditionalAttire.colors.length > 0 && (
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="font-semibold text-white">Palet Warna Simbolik: </span>
                  <div className="flex gap-1">
                    {active.traditionalAttire.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-white/30 inline-block shadow-sm"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              )}
              <p className="text-[10px] text-slate-400 italic pt-1 border-t border-white/10">
                "{active.traditionalAttire.significance}"
              </p>
            </div>
          </div>
        )}

        {/* Agricultural Products (Hasil Pertanian & Komoditas) */}
        {active.agriculturalProducts && active.agriculturalProducts.length > 0 && (
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-400" />
              Hasil Pertanian & Komoditas Unggulan
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {active.agriculturalProducts.map((prod, i) => (
                <span
                  key={i}
                  className="text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-xl font-medium"
                >
                  {prod}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cultural Traditions (Budaya & Falsafah) */}
        {active.culturalTraditions && active.culturalTraditions.length > 0 && (
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
            <h3 className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-amber-400" />
              Budaya, Ritual & Falsafah Tradisi
            </h3>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              {active.culturalTraditions.map((trad, i) => (
                <li key={i}>{trad}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Associated Cultural Events */}
        {active.culturalEvents && active.culturalEvents.length > 0 && (
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-1.5">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              Event Budaya & Festival Tahunan
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {active.culturalEvents.map((evt, i) => (
                <span
                  key={i}
                  className="text-[11px] bg-indigo-500/15 text-indigo-200 border border-indigo-500/30 px-2.5 py-1 rounded-xl font-medium"
                >
                  {evt}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Etiquette & Taboos (Etika & Pantangan Adat) */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
          <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Etika Kunjungan & Pantangan Adat
          </h3>

          <div className="text-[11px] space-y-1.5">
            <div>
              <span className="font-semibold text-slate-300">Aturan Busana: </span>
              <span className="text-slate-200">{active.etiquette.dressCode}</span>
            </div>
            <div>
              <span className="font-semibold text-rose-300">Pantangan (Tabu):</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
                {active.etiquette.taboos.map((taboo, idx) => (
                  <li key={idx} className="text-rose-200/90">
                    {taboo}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold text-amber-300">Ritual / Tata Cara: </span>
              <span className="text-slate-300">{active.etiquette.rituals}</span>
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

          <p className="text-xs font-bold text-white">{active.tripPackage.title}</p>
          <div className="flex justify-between items-center text-[11px] text-slate-300">
            <span>Penyelenggara: {active.tripPackage.organizer}</span>
            <span className="font-medium text-amber-300">{active.tripPackage.duration}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div>
              <span className="text-[10px] text-slate-400">Harga Paket ({currency}):</span>
              <p className="text-base font-black text-amber-400">
                {formatCurrency(
                  currency === "USD"
                    ? active.tripPackage.priceUsd
                    : active.tripPackage.priceIdr,
                  currency
                )}
              </p>
            </div>

            <button
              onClick={() => onAddToTrip(active)}
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
    </aside>
  );
}
