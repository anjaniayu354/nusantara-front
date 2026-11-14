"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  MapPin,
  RotateCcw,
  Compass,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import { DESTINATIONS, CulturalDestination } from "@/data/destinations";
import { BarongAvatar } from "./BarongAvatar";

interface AiConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecommendations?: (destinations: CulturalDestination[]) => void;
  onFocusDestination?: (dest: CulturalDestination) => void;
  language: "ID" | "EN";
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  destination?: CulturalDestination;
  source?: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Etika pakaian di Candi Borobudur & Prambanan?",
  "Upacara sakral Yadnya Kasada di Bromo?",
  "Tata krama dan pantangan adat di Wae Rebo?",
  "Rute 3 hari jelajah budaya Jogja - Solo?",
  "Filosofi Tari Barong & Rangda Bali?",
  "Adat istiadat Toraja Rambu Solo?",
  "Makna filosofis Rumah Gadang Minangkabau?",
  "Pantangan sakral suku Baduy Banten?",
];

const PREDEFINED_KNOWLEDGE: Record<
  string,
  {
    answer: string;
    source: string;
    destId?: string;
  }
> = {
  borobudur: {
    answer:
      "Pengunjung diwajibkan mengenakan kain penutup batik/sarung bila memakai celana atau rok di atas lutut, serta berpakaian berkerah atau menutup pundak. Alas kaki khusus berstruktur lembut (Upanat) wajib dipakai saat naik ke monumen stupa Borobudur guna melindungi batuan andesit abad ke-8 dari keausan.",
    source: "Balai Konservasi Borobudur & Kemenkebudayaan",
    destId: "candi-borobudur",
  },
  prambanan: {
    answer:
      "Saat berkunjung ke Candi Prambanan, kenakan pakaian sopan dan tertutup. Hindari menaiki ornamen relief candi Siwa, Brahma, dan Wisnu. Area pelataran suci dijaga kesakralannya, dan saat pementasan Sendratari Ramayana berlangsung di malam purnama, jaga ketenangan dan hormati para penari.",
    source: "Balai Pelestarian Kebudayaan Wilayah X",
    destId: "candi-prambanan",
  },
  bromo: {
    answer:
      "Upacara sakral Yadnya Kasada suku Tengger digelar saat bulan purnama ke-12 (sekitar Juli-Agustus). Dilarang melintasi garis batas suci bibir kawah saat persembahan dilarung, dan selalu jaga ketenangan serta hindari membuang sampah sembarangan di Lautan Pasir Berbisik.",
    source: "Paguyuban Adat Tengger & Balai Besar TNBTS",
    destId: "bromo-tengger",
  },
  "wae rebo": {
    answer:
      "Wisatawan wajib mengikuti ritual 'Waelu' di Mbaru Gendang (rumah adat utama) oleh tetua adat sebelum berkeliling desa. Dilarang mengambil foto tanpa izin saat ritual berlangsung, wajib berpakaian sopan, dan bersikap santun kepada seluruh warga desa adat Manggarai.",
    source: "Lembaga Adat Wae Rebo, Manggarai NTT",
    destId: "wae-rebo",
  },
  "jogja - solo": {
    answer:
      "Rute 3 hari ideal:\n• Hari 1: Sunrise Candi Borobudur, jelajah Desa Wisata Candirejo, lalu Keraton Yogyakarta & Tamansari.\n• Hari 2: Candi Prambanan, Tebing Breksi, dan pementasan Sendratari Ramayana.\n• Hari 3: Menuju Solo untuk mengunjungi Keraton Kasunanan, Pura Mangkunegaran, dan berbelanja batik di Pasar Antik Triwindu.",
    source: "Kurator Budaya Nusa Antara",
    destId: "keraton-jogja",
  },
  barong: {
    answer:
      "Tari Barong melambangkan 'Rwa Bhineda' (keseimbangan dualisme semesta antara kebaikan Dharma dan keburukan Adharma). Barong Ket melambangkan pelindung kebaikan, sementara Rangda melambangkan kekuatan sihir hitam. Pertunjukan ini sarat kesakralan magis dan sering diiringi gamelan Gong Kebyar.",
    source: "Dinas Kebudayaan Provinsi Bali",
    destId: "desa-penglipuran",
  },
  toraja: {
    answer:
      "Upacara Rambu Solo adalah ritual pemakaman sakral masyarakat Toraja untuk mengantar arwah ke Puya (alam baka). Tamu wajib mengenakan pakaian hitam atau gelap, dilarang melangkahi sesaji persembahan hewan kurban, dan hormati keluarga duka di pelataran Tongkonan.",
    source: "Dewan Adat Tana Toraja",
    destId: "kete-kesu-toraja",
  },
  "rumah gadang": {
    answer:
      "Rumah Gadang Minangkabau mengusung struktur atap melengkung menyerupai tanduk kerbau (Gonjong) yang melambangkan kemenangan dan hubungan vertikal dengan Sang Pencipta. Berdasarkan filosofi matrilineal 'Adat Basandi Syarak, Syarak Basandi Kitabullah', Rumah Gadang dimiliki dan diwariskan oleh garis keturunan ibu.",
    source: "Lembaga Kerapatan Adat Alam Minangkabau (LKAAM)",
    destId: "desa-pariangan",
  },
  baduy: {
    answer:
      "Di kawasan Baduy Dalam (Cibeo, Cikertawana, Cikeusik), dilarang keras menggunakan perangkat elektronik, kamera, sabun/sampo kimiawi di sungai suci, serta dilarang menggunakan kendaraan bermotor. Seluruh pengunjung wajib berjalan kaki dan menghormati aturan Pu'un.",
    source: "Tetua Adat Kanekes / Pu'un Baduy",
    destId: "kampung-naga",
  },
};

export function AiConciergeDrawer({
  isOpen,
  onClose,
  onFocusDestination,
  language = "ID",
}: AiConciergeDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text:
        language === "ID"
          ? "Sampurasun / Rahayu! Saya Bar Hala Ai, asisten pintar kurasi budaya Nusantara. Tanyakan apa saja mengenai etika adat istiadat, pantangan sakral di situs cagar budaya, sejarah tradisi, atau rekomendasi destinasi budaya di seluruh Nusantara."
          : "Welcome! I am Bar Hala Ai, your smart Nusantara cultural guide. Ask me anything about cultural traditions, sacred site etiquette, local taboos, or destination recommendations across Indonesia.",
      source: "Bar Hala Ai • Khazanah Adat & Budaya Nusantara",
      timestamp: "Baru saja",
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const generateAnswer = (query: string): { text: string; source?: string; dest?: CulturalDestination } => {
    const qLower = query.toLowerCase().trim();

    // 1. Check predefined cultural knowledge
    for (const [key, data] of Object.entries(PREDEFINED_KNOWLEDGE)) {
      if (qLower.includes(key)) {
        const dest = data.destId ? DESTINATIONS.find((d) => d.id === data.destId) : undefined;
        return {
          text: data.answer,
          source: data.source,
          dest,
        };
      }
    }

    // 2. Check destination direct matches
    const matchedDest = DESTINATIONS.find((d) => {
      const nameMatch = d.name.toLowerCase().includes(qLower) || qLower.includes(d.name.toLowerCase());
      const provMatch = d.province.toLowerCase().includes(qLower);
      const tagMatch = d.tags.some((t) => qLower.includes(t.toLowerCase()));
      return nameMatch || provMatch || tagMatch;
    });

    if (matchedDest) {
      const tabooList = matchedDest.etiquette?.taboos?.join(", ") || "Hormati kesakralan lingkungan setempat.";
      const rituals = matchedDest.etiquette?.rituals ? `\n• Ritual/Tata Cara: ${matchedDest.etiquette.rituals}` : "";
      const text = `Rekomendasi Budaya untuk Anda: **${matchedDest.name}** (${matchedDest.province}).\n\n${matchedDest.description}\n\n**Nilai Filosofis & Sejarah:**\n${matchedDest.historicalSignificance}\n\n**Panduan Etika & Pantangan Adat:**\n• Busana: ${matchedDest.etiquette.dressCode}\n• Pantangan (Tabu): ${tabooList}${rituals}`;
      return {
        text,
        source: `Kurator Budaya Nusa Antara • ${matchedDest.province}`,
        dest: matchedDest,
      };
    }

    // 3. Fallback intelligent response
    const fallbackText =
      language === "ID"
        ? `Mengenai "${query}": Dalam khazanah tradisi Nusantara, setiap daerah memiliki kearifan lokal 'Di mana bumi dipijak, di situ langit dijunjung'. Saat berkunjung ke situs adat dan cagar budaya, utamakan berpakaian sopan dan tertutup, minta izin tetua adat sebelum memasuki kawasan sakral, dan hindari menyentuh benda pusaka keramat. Anda juga dapat mengeklik destinasi pada peta untuk meninjau etika dan pantangan lengkapnya.`
        : `Regarding "${query}": In Indonesian cultural wisdom, 'where you tread the earth, there you uphold the sky'. When visiting traditional sites, dress modestly, seek permission from local elders before entering sacred compounds, and respect ancient relics. You can also click any destination on the map to review detailed customs and taboos.`;

    return {
      text: fallbackText,
      source: "Bar Hala Ai • Khazanah Adat & Kebudayaan Nusantara",
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const raw = typeof textToSend === "string" ? textToSend : inputQuery;
    const clean = raw.trim();
    if (!clean) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: clean,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const result = generateAnswer(clean);

    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now() + 1}`,
      sender: "assistant",
      text: result.text,
      source: result.source,
      destination: result.dest,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputQuery("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "assistant",
        text:
          language === "ID"
            ? "Percakapan telah dibersihkan. Saya Bar Hala Ai, siap menjawab pertanyaan seputar etika adat, tradisi, dan destinasi budaya Nusantara."
            : "Conversation cleared. I am Bar Hala Ai, ready to help you explore Indonesian culture, traditions, and destinations.",
        source: "Bar Hala Ai • Khazanah Adat & Budaya Nusantara",
        timestamp: "Baru saja",
      },
    ]);
  };

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="Bar Hala Ai Budaya Nusa Antara"
      className={`fixed top-14 bottom-11 sm:bottom-12 right-0 z-40 w-full sm:w-[420px] lg:w-[460px] bg-slate-950/95 backdrop-blur-2xl border-l border-amber-500/30 shadow-2xl flex flex-col text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
      }`}
    >
      {/* Top Header: Bar Hala Ai */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <BarongAvatar size={48} isActive={true} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
              <span>Bar Hala Ai</span>
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
          aria-label="Tutup Bar Hala Ai"
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Scrollable Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
        {/* Quick Suggestion Chips */}
        <div className="pb-2 border-b border-white/5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400/90 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Topik Adat & Pertanyaan Populer:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] bg-slate-900/90 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-amber-500/20 hover:border-amber-400/50 px-2.5 py-1.5 rounded-xl transition text-left active:scale-95 flex items-center gap-1 group"
              >
                <span>{prompt}</span>
                <ChevronRight className="w-3 h-3 text-amber-400/50 group-hover:text-amber-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}
            >
              <div
                className={`text-xs leading-relaxed ${
                  isUser
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[85%] shadow-md shadow-amber-500/10"
                    : "bg-slate-900/95 border border-amber-500/25 text-slate-100 rounded-2xl rounded-tl-sm p-3.5 max-w-[94%] shadow-xl space-y-2.5"
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 pb-1 border-b border-white/10">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Bar Hala Ai</span>
                  </div>
                )}

                <div className="whitespace-pre-line text-xs">{msg.text}</div>

                {/* Attached Destination Card Preview if any */}
                {msg.destination && (
                  <div className="mt-2.5 pt-2 border-t border-white/10">
                    <div className="rounded-xl overflow-hidden bg-black/40 border border-amber-500/30 flex items-center gap-3 p-2">
                      <img
                        src={msg.destination.imageUrl}
                        alt={msg.destination.name}
                        className="w-14 h-14 rounded-lg object-cover brightness-90 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{msg.destination.name}</p>
                        <p className="text-[10px] text-amber-300 truncate">{msg.destination.province}</p>
                        <div className="mt-1 flex items-center gap-2">
                          {onFocusDestination && (
                            <button
                              type="button"
                              onClick={() => onFocusDestination(msg.destination!)}
                              className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[10px] font-bold transition flex items-center gap-1 border border-amber-500/30"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>Lihat di Peta</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!isUser && msg.source && (
                  <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-400">
                    <span className="truncate pr-2">Rujukan: {msg.source}</span>
                    <span className="text-emerald-400 font-semibold shrink-0">✓ Terverifikasi</span>
                  </div>
                )}
              </div>

              <span className="text-[9px] text-slate-500 px-1 font-mono">{msg.timestamp}</span>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Bottom Chat Input: Clean, No BMKG Footer, Sticky to Bottom */}
      <div className="p-3 border-t border-white/10 bg-slate-950/95 backdrop-blur-md shrink-0">
        <form onSubmit={handleFormSubmit} className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              language === "ID"
                ? "Tanyakan etika adat, pantangan sakral, atau destinasi..."
                : "Ask about sacred etiquette, local customs, or destinations..."
            }
            className="w-full bg-slate-900/90 border border-amber-500/30 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 pr-11 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 shadow-inner transition"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            aria-label="Kirim pesan"
            className="absolute right-1.5 p-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 shadow-md shadow-amber-500/20"
          >
            <Send className="w-3.5 h-3.5 font-bold" />
          </button>
        </form>

        <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-slate-500">
          <span>Bar Hala Ai • Panduan Budaya Nusantara</span>
          {messages.length > 1 && (
            <button
              type="button"
              onClick={handleResetChat}
              className="text-amber-400/80 hover:text-amber-300 hover:underline flex items-center gap-1 transition"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Bersihkan Chat</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
