# 🧭 Nusa Antara — Portal Peta Petualangan Budaya Nusantara

> **Portal Peta Petualangan Wisata & Trip Plan Interaktif Nusantara**  
> Dibangun dengan **Next.js 16 (App Router)**, **OpenStreetMap (OSM)**, **Leaflet**, integrasi telemetri cuaca **BMKG**, dan pemutar musik latar (*backsound player*) sinematik gamelan modern.

---

## 🌟 Fitur Unggulan

1. **Kanvas Peta Petualangan Fullscreen (Headerless Adventure HUD)**:
   - Tampilan imersif 100vw x 100vh tanpa navbar statis tradisional.
   - Seluruh instrumen kontrol melayang (*floating HUD*) dengan estetika *dark mode glassmorphism*.

2. **Kepatuhan Regulasi OpenStreetMap (OSM) & Multi-Tier Caching**:
   - Proxy API route `/api/tiles/[z]/[x]/[y]` dengan header resmi `User-Agent: nusa-antara-adventure-portal/1.0`.
   - Atribusi persisten `© OpenStreetMap contributors`.
   - Penyimpanan cache tile luring (*offline*) bertingkat menggunakan `idb-keyval` (IndexedDB) dengan retensi TTL 14 hari dan eliminasi LRU.

3. **Pemutar Musik Latar (*Backsound Music Player*)**:
   - Pemutar audio berulang (*infinite loop*) terintegrasi.
   - Lagu default: *"Rising of Nusantara Musik Gamelan Modern Indonesia Cocok Untuk Video Sinematik & Backsound.mp3"*.
   - Fitur visualizer equalizer animasi berdenyut, volume slider, dan kontrol mute.

4. **Telemetri Cuaca BMKG SATU PETA MKG**:
   - Pemantauan real-time suhu, kondisi cuaca, dan tinggi gelombang maritim.
   - Indikator Indeks Kelayakan Wisata 3-tingkat (🟢 Aman / 🟡 Waspada / 🔴 Tunda).
   - *Pulsing radar ticker* untuk festival dan agenda budaya terdekat.

5. **AI Concierge & Kuis Preferensi 30 Detik**:
   - Kuis kurasi gaya perjalanan cepat (Pantai, Gunung, Desa Adat, Budaya).
   - Personalisasi rute otomatis ke dalam *Trip Planner*.

6. **Interactive Trip Planner & Multi-Currency**:
   - Penyusun urutan rute perjalanan (*waypoint*) dengan polyline petualangan emas.
   - Rekapitulasi estimasi anggaran transparan dalam IDR (Rp) dan USD ($).
   - Jaminan dana kelestarian adat 2,5% untuk komunitas lokal.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Mapping**: Leaflet 1.9, OpenStreetMap Tiles, idb-keyval (IndexedDB)
- **Audio**: HTML5 Audio API dengan persistent state & audio wave equalizer

---

## 🚀 Memulai (Getting Started)

### Prasyarat
- Node.js 18+ atau 20+
- npm / pnpm / yarn

### Instalasi & Menjalankan Dev Server

```bash
# Clone repository
git clone https://github.com/anjaniayu354/nusantara-front.git
cd nusantara-front

# Install dependencies
npm install

# Jalankan server pengembangan
npm run dev
```

Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 📜 Lisensi & Atribusi

- Peta data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).
- Data telemetri cuaca merujuk pada standar terbuka BMKG SATU PETA MKG.
- Musik latar © Komposisi gamelan modern sinematik Nusantara.
