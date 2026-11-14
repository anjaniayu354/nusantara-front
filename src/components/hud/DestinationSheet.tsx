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
      className={`fixed top-0 bottom-11 sm:bottom-12 right-0 z-30 w-full sm:w-[420px] lg:w-[460px] bg-[var(--bx-surface-card)]/98 backdrop-blur-2xl border-l border-[var(--bx-border)] shadow-2xl flex flex-col text-[var(--bx-ink)] transform transition-transform duration-300 ease-in-out ${
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup jendela destinasi"
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge category & province */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--gold)] text-white px-2.5 py-1 rounded-full shadow-xs">
            {active.category}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
            {active.province}
          </span>
          {active.subCategory && (
            <span className="text-[10px] font-medium bg-black/50 text-slate-200 px-2.5 py-1 rounded-full border border-white/20">
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
          <h3 className="text-xs uppercase tracking-wider font-bold text-[var(--gold)] mb-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Cerita Budaya & Sejarah
          </h3>
          <p className="text-xs text-[var(--bx-ink)] leading-relaxed">{active.description}</p>
          <div className="mt-2 p-2.5 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/25 text-[11px] text-[var(--bx-ink)]">
            <strong className="text-[var(--bx-ink-bright)]">Nilai Filosofis:</strong> {active.historicalSignificance}
          </div>
        </div>

        {/* Traditional Attire (Pakaian Adat & Wastra) */}
        {active.traditionalAttire && (
          <div className="p-3 rounded-2xl bg-[var(--bx-bg)] border border-[var(--bx-border)] space-y-2 shadow-xs">
            <h3 className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider flex items-center gap-1.5">
              <Shirt className="w-4 h-4" />
              Pakaian Adat & Wastra Tradisional
            </h3>
            <div className="text-[11px] space-y-1.5 text-[var(--bx-muted)]">
              <div>
                <span className="font-semibold text-[var(--bx-ink-bright)]">Nama Busana: </span>
                <span className="text-[var(--gold)] font-medium">{active.traditionalAttire.name}</span>
              </div>
              <div>
                <span className="font-semibold text-[var(--bx-ink-bright)]">Wastra / Kain: </span>
                <span className="text-[var(--bx-ink)]">{active.traditionalAttire.wastraType}</span>
              </div>
              {active.traditionalAttire.headgear && (
                <div>
                  <span className="font-semibold text-[var(--bx-ink-bright)]">Tutup Kepala / Mahkota: </span>
                  <span className="text-[var(--gold)]">{active.traditionalAttire.headgear}</span>
                </div>
              )}
              {active.traditionalAttire.colors && active.traditionalAttire.colors.length > 0 && (
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="font-semibold text-[var(--bx-ink-bright)]">Palet Warna Simbolik: </span>
                  <div className="flex gap-1">
                    {active.traditionalAttire.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-black/20 dark:border-white/30 inline-block shadow-xs"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              )}
              <p className="text-[10px] text-[var(--bx-muted)] italic pt-1 border-t border-[var(--bx-border)]">
                "{active.traditionalAttire.significance}"
              </p>
            </div>
          </div>
        )}

        {/* Agricultural Products (Hasil Pertanian & Komoditas) */}
        {active.agriculturalProducts && active.agriculturalProducts.length > 0 && (
          <div className="p-3 rounded-2xl bg-[var(--bx-bg)] border border-emerald-500/30 space-y-2 shadow-xs">
            <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4 h-4" />
              Hasil Pertanian & Komoditas Unggulan
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {active.agriculturalProducts.map((prod, i) => (
                <span
                  key={i}
                  className="text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-xl font-medium"
                >
                  {prod}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cultural Traditions (Budaya & Falsafah) */}
        {active.culturalTraditions && active.culturalTraditions.length > 0 && (
          <div className="p-3 rounded-2xl bg-[var(--bx-bg)] border border-[var(--bx-border)] space-y-1.5 shadow-xs">
            <h3 className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-4 h-4" />
              Budaya, Ritual & Falsafah Tradisi
            </h3>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[var(--bx-ink)]">
              {active.culturalTraditions.map((trad, i) => (
                <li key={i}>{trad}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Associated Cultural Events */}
        {active.culturalEvents && active.culturalEvents.length > 0 && (
          <div className="p-3 rounded-2xl bg-[var(--bx-bg)] border border-purple-500/30 space-y-1.5 shadow-xs">
            <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              Event Budaya & Festival Tahunan
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {active.culturalEvents.map((evt, i) => (
                <span
                  key={i}
                  className="text-[11px] bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-xl font-medium"
                >
                  {evt}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Etiquette & Taboos (Etika & Pantangan Adat) */}
        <div className="p-3 rounded-2xl bg-[var(--bx-bg)] border border-[var(--bx-border)] space-y-2 shadow-xs">
          <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Etika Kunjungan & Pantangan Adat
          </h3>

          <div className="text-[11px] space-y-1.5">
            <div>
              <span className="font-semibold text-[var(--bx-ink-bright)]">Aturan Busana: </span>
              <span className="text-[var(--bx-ink)]">{active.etiquette.dressCode}</span>
            </div>
            <div>
              <span className="font-semibold text-rose-600 dark:text-rose-400">Pantangan (Tabu):</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[var(--bx-muted)]">
                {active.etiquette.taboos.map((taboo, idx) => (
                  <li key={idx} className="text-rose-600 dark:text-rose-300">
                    {taboo}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold text-[var(--gold)]">Ritual / Tata Cara: </span>
              <span className="text-[var(--bx-ink)]">{active.etiquette.rituals}</span>
            </div>
          </div>
        </div>

        {/* Local EO / Community Tour Package */}
        <div className="p-3 rounded-2xl bg-[var(--bx-surface)] border border-[var(--gold)]/35 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[var(--gold)] flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              Paket Wisata EO Komunitas Lokal
            </h3>
            <span className="text-[9px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              2.5% Dana Adat
            </span>
          </div>

          <p className="text-xs font-bold text-[var(--bx-ink-bright)]">{active.tripPackage.title}</p>
          <div className="flex justify-between items-center text-[11px] text-[var(--bx-muted)]">
            <span>Penyelenggara: {active.tripPackage.organizer}</span>
            <span className="font-medium text-[var(--gold)]">{active.tripPackage.duration}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--bx-border)]">
            <div>
              <span className="text-[10px] text-[var(--bx-muted)]">Harga Paket ({currency}):</span>
              <p className="text-base font-black text-[var(--gold)] font-mono">
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
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                isInTrip
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "portal-submit-btn-gold !h-9 !px-3"
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
