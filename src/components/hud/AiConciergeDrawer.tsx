"use client";

import React, { useState } from "react";
import {
  Sparkles,
  X,
  Check,
  Compass,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  MapPin,
  ShieldCheck,
  Send,
  RotateCcw,
} from "lucide-react";
import { DESTINATIONS, CulturalDestination } from "@/data/destinations";

interface AiConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecommendations: (destinations: CulturalDestination[]) => void;
  onFocusDestination?: (dest: CulturalDestination) => void;
  language: "ID" | "EN";
}

interface QuickQa {
  question: string;
  answer: string;
  category: string;
  source: string;
}

const CULTURAL_QA: QuickQa[] = [
  {
    question: "Etika pakaian berkunjung ke Candi Borobudur & Prambanan?",
    answer:
      "Pengunjung diwajibkan mengenakan kain penutup batik/sarung bila memakai celana/rok di atas lutut, serta pakaian berkerah atau menutup pundak. Alas kaki berstruktur lembut wajib dipakai di zona stupa Borobudur untuk melindungi batuan andesit abad ke-8.",
    category: "Dress Code & Etika",
    source: "Balai Konservasi Borobudur & Kemenkebudayaan",
  },
  {
    question: "Waktu terbaik & pantangan upacara Yadnya Kasada di Bromo?",
    answer:
      "Upacara sakral suku Tengger digelar saat bulan purnama ke-12 (sekitar Juli-Agustus). Dilarang melintasi batas suci kawah saat persembahan dilarung, dan jaga ketenangan saat para Dukun Pandita membaca kidung doa puja.",
    category: "Upacara Sakral",
    source: "Paguyuban Adat Tengger & TN Bromo Tengger Semeru",
  },
  {
    question: "Tata krama dan pantangan adat saat ke Desa Wae Rebo?",
    answer:
      "Wisatawan wajib mengikuti ritual Waelu di Mbaru Tembong (rumah adat utama) oleh tetua adat sebelum berkeliling desa. Dilarang mengambil foto tanpa izin saat upacara berlangsung dan wajib berpakaian sopan.",
    category: "Kearifan Lokal",
    source: "Lembaga Adat Wae Rebo, Manggarai",
  },
  {
    question: "Rute ideal 3 hari jelajah budaya Yogyakarta - Surakarta?",
    answer:
      "Hari 1: Sunrise Candi Borobudur & Desa Wisata Candirejo. Hari 2: Keraton Ngayogyakarta Hadiningrat & Tamansari. Hari 3: Menuju Solo ke Pura Mangkunegaran & Pasar Antik Triwindu.",
    category: "Rekomendasi Rute",
    source: "Kurator Rute Nusa Antara",
  },
];

export function AiConciergeDrawer({
  isOpen,
  onClose,
  onApplyRecommendations,
  onFocusDestination,
  language = "ID",
}: AiConciergeDrawerProps) {
  const [activeTab, setActiveTab] = useState<"quiz" | "chat">("quiz");

  // Quiz state
  const [step, setStep] = useState<number>(1);
  const [vibe, setVibe] = useState<string>("budaya");
  const [pace, setPace] = useState<string>("petualang");
  const [duration, setDuration] = useState<string>("singkat");
  const [recommended, setRecommended] = useState<CulturalDestination[]>([]);

  // Q&A chat state
  const [selectedQa, setSelectedQa] = useState<QuickQa | null>(CULTURAL_QA[0]);
  const [userQuery, setUserQuery] = useState<string>("");
  const [customReply, setCustomReply] = useState<string | null>(null);

  const handleGenerate = () => {
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

  const handleSendCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const lower = userQuery.toLowerCase();
    const foundDest = DESTINATIONS.find(
      (d) =>
        d.name.toLowerCase().includes(lower) ||
        d.province.toLowerCase().includes(lower) ||
        d.tags.some((t) => lower.includes(t.toLowerCase()))
    );

    if (foundDest) {
      setCustomReply(
        `Rekomendasi untuk "${userQuery}": Kami menemukan destinasi budaya unggulan ${foundDest.name} (${foundDest.province}). Nilai budaya: ${foundDest.historicalSignificance}. Etika berkunjung: ${foundDest.etiquette.dressCode}. Hindari: ${foundDest.etiquette.taboos.join(", ")}.`
      );
    } else {
      setCustomReply(
        `Terima kasih telah bertanya tentang "${userQuery}". AI Concierge Nusa Antara merekomendasikan untuk memadukan destinasi bersejarah dengan desa adat setempat, mematuhi panduan berpakaian adat, dan memantau status cuaca BMKG SATU PETA MKG sebelum memulai petualangan.`
      );
    }
    setUserQuery("");
  };

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="AI Concierge Budaya Nusa Antara"
      className={`fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] lg:w-[460px] h-full bg-slate-950/95 backdrop-blur-2xl border-l border-amber-500/30 shadow-2xl flex flex-col text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="barong-radiation-glow scale-90" aria-hidden="true" />
            <div className="relative z-10 w-11 h-11 rounded-2xl bg-slate-950 border border-amber-400/80 flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="/animasi/assets/bot-base-transparent.png"
                alt="Barong AI Avatar"
                className="w-8 h-8 object-contain drop-shadow"
              />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
              Barong AI Concierge
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                Pilar 12
              </span>
            </h2>
            <p className="text-[11px] text-amber-300/90 font-medium">
              {language === "ID"
                ? "Kurasi Cerdas Wisata & Etika Tradisi"
                : "Smart Cultural Curation & Etiquette"}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup AI Concierge"
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Tabs (Kuis Rute vs Tanya Etika) */}
      <div className="px-4 pt-3 pb-1 border-b border-white/5 flex gap-2 shrink-0 bg-slate-900/30">
        <button
          type="button"
          onClick={() => setActiveTab("quiz")}
          className={`flex-1 pb-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 ${
            activeTab === "quiz"
              ? "border-amber-400 text-amber-300"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Kuis Rute 30 Detik</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("chat")}
          className={`flex-1 pb-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 ${
            activeTab === "chat"
              ? "border-amber-400 text-amber-300"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Tanya Etika & Adat</span>
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "quiz" ? (
          step === 1 ? (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                Pilih preferensi petualangan Anda dalam 3 langkah singkat untuk mendapatkan rekomendasi rute budaya terkurasi secara otomatis.
              </div>

              {/* Step 1: Nuansa */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-2">
                  1. Nuansa & Destinasi Favorit:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "budaya", label: "🎭 Candi & Keraton Sakral" },
                    { id: "desa", label: "🌾 Desa Adat & Tradisi" },
                    { id: "gunung", label: "⛰️ Kaldera & Gunung Suci" },
                    { id: "pantai", label: "🏖️ Pesisir & Laut Bahari" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setVibe(item.id)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition active:scale-95 ${
                        vibe === item.id
                          ? "bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/10"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Gaya Wisata */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-2">
                  2. Gaya Eksplorasi:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "petualang", label: "🥾 Petualang & Trekking" },
                    { id: "edukasi", label: "📜 Edukasi & Sejarah" },
                    { id: "santai", label: "☕ Santai & Kuliner" },
                    { id: "spiritual", label: "🧘 Meditasi & Upacara" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPace(item.id)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition active:scale-95 ${
                        pace === item.id
                          ? "bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/10"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Durasi */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-2">
                  3. Rencana Durasi Perjalanan:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: "singkat", label: "1-2 Hari" },
                    { id: "sedang", label: "3-5 Hari" },
                    { id: "panjang", label: "1 Minggu+" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDuration(item.id)}
                      className={`p-2 rounded-xl border text-center font-medium transition active:scale-95 ${
                        duration === item.id
                          ? "bg-amber-500/20 border-amber-400 text-amber-300 font-bold"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Susun Rekomendasi Rute Wisata</span>
              </button>
            </div>
          ) : (
            /* Result Step */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300 font-medium">
                  Rute Terkurasi ({recommended.length} Destinasi):
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Ubah Kuis</span>
                </button>
              </div>

              <div className="space-y-3">
                {recommended.map((d, idx) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-2xl bg-white/5 border border-amber-500/20 hover:border-amber-400/50 transition group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition">
                            {d.name}
                          </h4>
                          <span className="text-[10px] text-amber-400 font-semibold shrink-0">
                            {d.province}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                          {d.subtitle}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-300 bg-black/40 px-2 py-1 rounded-lg">
                          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">Etika: {d.etiquette.dressCode}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-2.5 flex items-center gap-2">
                          {onFocusDestination && (
                            <button
                              type="button"
                              onClick={() => onFocusDestination(d)}
                              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-bold transition flex items-center gap-1"
                            >
                              <MapPin className="w-3 h-3 text-amber-400" />
                              <span>Lihat di Peta</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleApply}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Terapkan Semua ke Rencana Perjalanan</span>
                </button>
              </div>
            </div>
          )
        ) : (
          /* Q&A / Cultural Etiquette Chat Tab */
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Pilar 12: Panduan etika adat, pantangan sakral, dan rekomendasi waktu terbaik berkunjung ke situs cagar budaya Nusantara.
              </span>
            </div>

            {/* Quick Questions Chips */}
            <div>
              <p className="text-xs font-bold text-slate-300 mb-2">Pertanyaan Populer:</p>
              <div className="space-y-2">
                {CULTURAL_QA.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedQa(item);
                      setCustomReply(null);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                      selectedQa?.question === item.question && !customReply
                        ? "bg-amber-500/20 border-amber-400 text-amber-200 font-bold"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{item.category}</span>
                    </div>
                    <p className="line-clamp-2">{item.question}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Answer Card */}
            {(customReply || selectedQa) && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Jawaban AI Concierge</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {customReply || selectedQa?.answer}
                </p>
                {selectedQa && !customReply && (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Rujukan: {selectedQa.source}</span>
                    <span className="text-emerald-400 font-semibold">✓ Terverifikasi</span>
                  </div>
                )}
              </div>
            )}

            {/* Custom Question Form */}
            <form onSubmit={handleSendCustomQuery} className="pt-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Tanyakan adat atau destinasi lain..."
                  className="w-full bg-slate-900/90 border border-amber-500/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 pr-10 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  aria-label="Kirim pertanyaan"
                  className="absolute right-2 p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer Info Pill */}
      <div className="p-3 border-t border-white/10 bg-slate-900/80 shrink-0 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Didukung BMKG SATU PETA MKG & Pilar Budaya Nusa Antara</span>
      </div>
    </aside>
  );
}
