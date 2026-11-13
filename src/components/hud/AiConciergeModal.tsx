"use client";

import React, { useState } from "react";
import { Sparkles, X, Check, ArrowRight, Compass, ShieldCheck } from "lucide-react";
import { DESTINATIONS, CulturalDestination } from "@/data/destinations";

interface AiConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecommendations: (destinations: CulturalDestination[]) => void;
  language: "ID" | "EN";
}

export function AiConciergeModal({
  isOpen,
  onClose,
  onApplyRecommendations,
  language,
}: AiConciergeModalProps) {
  const [step, setStep] = useState<number>(1);
  const [vibe, setVibe] = useState<string>("budaya");
  const [pace, setPace] = useState<string>("petualang");
  const [budgetLevel, setBudgetLevel] = useState<string>("menengah");
  const [recommended, setRecommended] = useState<CulturalDestination[]>([]);

  if (!isOpen) return null;

  const handleGenerate = () => {
    // Curate tailored destinations based on selected preferences
    let matched = DESTINATIONS.filter((d) => {
      if (vibe === "semua") return true;
      return d.category === vibe;
    });

    if (matched.length < 3) {
      matched = DESTINATIONS.slice(0, 3);
    } else {
      matched = matched.slice(0, 3);
    }

    setRecommended(matched);
    setStep(2);
  };

  const handleApply = () => {
    onApplyRecommendations(recommended);
    onClose();
    setStep(1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-5 shadow-2xl text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup AI Concierge"
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 id="ai-modal-title" className="text-base font-black text-white">
              AI Concierge Budaya Nusa Antara
            </h2>
            <p className="text-[11px] text-amber-300">
              {language === "ID"
                ? "Kuis Preferensi 30 Detik untuk Rute Wisata Tradisi"
                : "30-Second Travel Preference Quiz"}
            </p>
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            {/* Question 1: Nuansa Perjalanan */}
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-2">
                1. Nuansa & Destinasi Favorit Anda:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: "budaya", label: "🎭 Candi & Keraton Sakral" },
                  { id: "desa", label: "🌾 Desa Adat & Kearifan Lokal" },
                  { id: "gunung", label: "⛰️ Kaldera & Gunung Suci" },
                  { id: "pantai", label: "🏖️ Pesisir & Konservasi Bahari" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setVibe(item.id)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition ${
                      vibe === item.id
                        ? "bg-amber-500/20 border-amber-400 text-amber-300"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Gaya Wisata */}
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-2">
                2. Gaya Eksplorasi:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: "petualang", label: "🥾 Petualang & Trekking" },
                  { id: "edukasi", label: "📜 Edukasi & Sejarah Adat" },
                  { id: "santai", label: "☕ Santai & Cicip Kuliner Tradisi" },
                  { id: "spiritual", label: "🧘 Meditasi & Upacara Suci" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPace(item.id)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition ${
                      pace === item.id
                        ? "bg-amber-500/20 border-amber-400 text-amber-300"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit quiz */}
            <button
              onClick={handleGenerate}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Susun Rekomendasi Rute Wisata</span>
            </button>
          </div>
        ) : (
          /* Step 2: Recommendations Result */
          <div className="space-y-3">
            <p className="text-xs text-slate-300">
              Berdasarkan preferensi nuansa <span className="text-amber-400 font-bold uppercase">{vibe}</span> dan gaya <span className="text-amber-400 font-bold uppercase">{pace}</span>, berikut rute terbaik Nusa Antara:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {recommended.map((d, idx) => (
                <div key={d.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{d.name}</h4>
                    <p className="text-[10px] text-amber-300/90 truncate">{d.subtitle}</p>
                    <p className="text-[9px] text-slate-400 truncate">{d.etiquette.dressCode}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition"
              >
                Ubah Kuis
              </button>
              <button
                onClick={handleApply}
                className="flex-[2] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-lg flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Terapkan ke Rute Trip</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
