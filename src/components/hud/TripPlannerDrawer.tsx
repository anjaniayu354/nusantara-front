"use client";

import React from "react";
import { X, Trash2, MapPin, Calendar, Clock, DollarSign, ShieldCheck, ArrowRight, Share2 } from "lucide-react";
import { CulturalDestination } from "@/data/destinations";
import { formatCurrency } from "@/lib/currency";

interface TripPlannerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tripItems: CulturalDestination[];
  onRemoveItem: (id: string) => void;
  currency: "IDR" | "USD";
  language: "ID" | "EN";
  onFocusDestination: (dest: CulturalDestination) => void;
}

export function TripPlannerDrawer({
  isOpen,
  onClose,
  tripItems,
  onRemoveItem,
  currency,
  language,
  onFocusDestination,
}: TripPlannerDrawerProps) {
  // Calculate totals
  const totalCostIdr = tripItems.reduce((acc, curr) => acc + curr.tripPackage.priceIdr, 0);
  const totalCostUsd = tripItems.reduce((acc, curr) => acc + curr.tripPackage.priceUsd, 0);
  const totalCost = currency === "USD" ? totalCostUsd : totalCostIdr;

  // 2.5% adat community fee
  const conservationFee = Math.round(totalCost * 0.025);

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="trip-drawer-title"
      className={`fixed top-0 bottom-11 sm:bottom-12 left-0 z-30 w-full sm:w-[420px] bg-[var(--bx-surface-card)]/98 backdrop-blur-2xl border-r border-[var(--bx-border)] shadow-2xl flex flex-col text-[var(--bx-ink)] transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--bx-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--gold)]/20 text-[var(--gold)] flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 id="trip-drawer-title" className="text-base font-black text-[var(--bx-ink-bright)]">
              {language === "ID" ? "Rencana Perjalanan (Trip Plan)" : "Trip Planner Itinerary"}
            </h2>
            <p className="text-[11px] text-[var(--bx-muted)]">
              {tripItems.length} {language === "ID" ? "Destinasi Terpilih" : "Destinations Selected"}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Tutup rencana perjalanan"
          className="p-1.5 rounded-lg bg-[var(--bx-bg)] hover:bg-[var(--bx-surface)] text-[var(--bx-muted)] hover:text-[var(--bx-ink)] transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Destination Waypoint List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tripItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--bx-muted)] space-y-2">
            <MapPin className="w-10 h-10 text-[var(--gold)]/40" />
            <p className="text-sm font-semibold text-[var(--bx-ink-bright)]">
              {language === "ID" ? "Belum Ada Destinasi di Rute" : "No Destinations Added Yet"}
            </p>
            <p className="text-xs text-[var(--bx-muted)] max-w-xs">
              {language === "ID"
                ? "Pilih destinasi di peta atau gunakan fitur Bar Hala Ai untuk menambahkan destinasi adat dan budaya Nusantara."
                : "Select destinations on the map or use Bar Hala Ai to curate your personalized route."}
            </p>
          </div>
        ) : (
          tripItems.map((item, index) => (
            <div
              key={item.id}
              className="group p-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] hover:border-[var(--gold)]/40 transition flex items-start justify-between gap-3 shadow-xs"
            >
              <div
                className="flex items-start gap-2.5 flex-1 cursor-pointer"
                onClick={() => onFocusDestination(item)}
              >
                <div className="w-6 h-6 rounded-full bg-[var(--gold)] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[var(--bx-ink-bright)] group-hover:text-[var(--gold)] transition">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-[var(--bx-muted)]">{item.province} • {item.tripPackage.duration}</p>
                  <p className="text-[11px] font-semibold text-[var(--gold)] mt-1">
                    {formatCurrency(
                      currency === "USD" ? item.tripPackage.priceUsd : item.tripPackage.priceIdr,
                      currency
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onRemoveItem(item.id)}
                aria-label={`Hapus ${item.name} dari trip`}
                className="p-1 rounded text-[var(--bx-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer / Budget Recap & Action */}
      {tripItems.length > 0 && (
        <div className="p-4 border-t border-[var(--bx-border)] bg-[var(--bx-surface)] space-y-3">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[var(--bx-muted)]">
              <span>Subtotal Paket:</span>
              <span className="font-mono font-semibold text-[var(--bx-ink)]">{formatCurrency(totalCost, currency)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Dana Kelestarian Adat (2.5%):
              </span>
              <span className="font-mono font-semibold">
                {formatCurrency(conservationFee, currency)}
              </span>
            </div>
            <div className="flex justify-between text-[var(--bx-ink-bright)] font-black text-sm pt-1 border-t border-[var(--bx-border)]">
              <span>Total Estimasi:</span>
              <span className="font-mono text-[var(--gold)]">
                {formatCurrency(totalCost + conservationFee, currency)}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              alert(
                language === "ID"
                  ? "Rencana perjalanan tersimpan! Siap diberangkatkan bersama komunitas pemandu lokal."
                  : "Itinerary saved! Ready to embark with local cultural guides."
              );
            }}
            className="w-full py-2.5 rounded-xl portal-submit-btn-gold font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{language === "ID" ? "Konfirmasi & Simpan Rute" : "Confirm & Save Itinerary"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
