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
  if (!isOpen) return null;

  // Calculate totals
  const totalCostIdr = tripItems.reduce((acc, curr) => acc + curr.tripPackage.priceIdr, 0);
  const totalCostUsd = tripItems.reduce((acc, curr) => acc + curr.tripPackage.priceUsd, 0);
  const totalCost = currency === "USD" ? totalCostUsd : totalCostIdr;

  // 2.5% adat community fee
  const conservationFee = Math.round(totalCost * 0.025);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="trip-drawer-title"
      className="fixed inset-y-0 left-0 z-30 w-full sm:w-[420px] bg-slate-950/95 backdrop-blur-xl border-r border-amber-500/30 shadow-2xl flex flex-col text-white transform transition-transform duration-300 animate-in slide-in-from-left"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 id="trip-drawer-title" className="text-base font-black text-white">
              {language === "ID" ? "Rencana Perjalanan (Trip Plan)" : "Trip Planner Itinerary"}
            </h2>
            <p className="text-[11px] text-slate-400">
              {tripItems.length} {language === "ID" ? "Destinasi Terpilih" : "Destinations Selected"}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Tutup rencana perjalanan"
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Destination Waypoint List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tripItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
            <MapPin className="w-10 h-10 text-amber-500/40" />
            <p className="text-sm font-semibold text-white">
              {language === "ID" ? "Belum Ada Destinasi di Rute" : "No Destinations Added Yet"}
            </p>
            <p className="text-xs text-slate-400 max-w-xs">
              {language === "ID"
                ? "Pilih destinasi di peta atau gunakan fitur Bar Hala Ai untuk menambahkan destinasi adat dan budaya Nusantara."
                : "Select destinations on the map or use Bar Hala Ai to curate your personalized route."}
            </p>
          </div>
        ) : (
          tripItems.map((item, index) => (
            <div
              key={item.id}
              className="group p-3 rounded-xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition flex items-start justify-between gap-3"
            >
              <div
                className="flex items-start gap-2.5 flex-1 cursor-pointer"
                onClick={() => onFocusDestination(item)}
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-slate-400">{item.province} • {item.tripPackage.duration}</p>
                  <p className="text-[11px] font-semibold text-amber-400 mt-1">
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
                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer / Budget Recap & Action */}
      {tripItems.length > 0 && (
        <div className="p-4 border-t border-white/10 bg-slate-900/90 space-y-3">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal Paket EO:</span>
              <span className="font-mono font-semibold">{formatCurrency(totalCost, currency)}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Dana Kelestarian Adat (2.5%):
              </span>
              <span className="font-mono font-semibold">
                {formatCurrency(conservationFee, currency)}
              </span>
            </div>
            <div className="flex justify-between text-white font-black text-sm pt-1 border-t border-white/10">
              <span>Total Estimasi:</span>
              <span className="font-mono text-amber-400">
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
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>{language === "ID" ? "Konfirmasi & Simpan Rute" : "Confirm & Save Itinerary"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
