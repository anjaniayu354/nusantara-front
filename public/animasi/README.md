# 👹 Nusa Antara — Bar Hala Ai Animated Bot

> **AI Chatbot Animasi Interaktif Karakter Topeng Barong / Kala Nusantara**
> Dibangun dengan **HTML5, CSS3, dan Vanilla JavaScript (ES6+)** tanpa dependensi framework atau npm build tools.

---

## 🌟 Fitur Utama Animasi

1. **👁️ Natural Eyelid Blinking (Mata Berkedip)**:
   - Interval acak alami antara **2.6 hingga 5.2 detik**.
   - Peluang **22% double-blink** (kedipan ganda seperti refleks mata makhluk hidup).
   - Kedipan instan saat karakter diklik atau saat bot menerima pesan baru.

2. **🎯 Real-Time Gaze Tracking (Pupil Melirik Kursor)**:
   - Bola mata (iris merah, pupil obsidian, dan *specular highlight*) secara dinamis melirik mengikuti posisi kursor mouse atau sentuhan jari di layar sentuh ponsel.
   - Dilengkapi *radial clamping* (maksimal pergeseran 12px) agar pupil tidak keluar dari soket mata.
   - Pergerakan menggunakan interpolasi *lerp* (`0.12`) sehingga lirikan mata terasa halus dan hidup, bukan kaku.
   - Auto-center: Otomatis kembali ke posisi tengah jika kursor tidak bergerak selama 4.5 detik.

3. **🗣️ Speech Lip-Sync & Jaw Animation (Animasi Mulut Bicara)**:
   - Rahang bawah (*lower jaw*) berosilasi naik-turun secara dinamis saat bot mengetikkan pesan (*typewriter stream*).
   - Menampilkan rongga mulut merah gelap saat rahang terbuka, menirukan gerakan hentakan rahang topeng Tari Barong Ket Bali.

4. **✨ Multi-Expression States**:
   - `idle`: Mengapung santai (*floating breathing*) dengan kedipan alami.
   - `thinking`: Bola mata melirik ke atas dan aura berputar saat memproses jawaban.
   - `speaking`: Rahang bergerak, kepala sedikit mengangguk (*bounce*), aura berdenyut.
   - `happy`: Mata menyipit menjadi busur bulan sabit, memancarkan partikel emas (*sparkles*).
   - `surprised`: Mata membesar dan pupil mengecil saat kaget.

5. **🎵 Gamelan Web Audio API Synthesizer**:
   - Synthesizer suara nada gamelan (*pelog/slendro chord*) dan ketukan *speech blip* tanpa memerlukan file audio `.mp3` eksternal. Berjalan 100% offline dan instan.

6. **💬 Cultural Knowledge Engine**:
   - Terintegrasi dengan basis pengetahuan budaya Indonesia (Destinasi Bali, Jogja, Toraja, Flores, Baduy; Festival Nyepi, Kasada, Sekaten; Radar Cuaca & Ombak BMKG; serta Etika Berkunjung).

---

## 📂 Struktur File

```
animasi/
├── index.html                   # Halaman utama aplikasi (Studio & Widget Mode)
├── bot-avatar.jpg               # Gambar referensi asli 980x980
├── README.md                    # Dokumentasi lengkap & panduan integrasi
├── assets/
│   ├── bot-base-transparent.png # Masker Barong transparan resolusi tinggi
│   ├── bot-jaw-lower.png        # Layer rahang bawah untuk animasi bicara
│   └── character-layers.json    # Metadata koordinat anatomi wajah
├── css/
│   ├── character.css            # Styling & keyframes animasi karakter
│   ├── chat.css                 # Styling antarmuka chatbox & balon dialog
│   └── style.css                # Layout studio, tombol kontrol & mode floating
└── js/
    ├── knowledge.js             # Basis data pengetahuan budaya Indonesia
    ├── audio.js                 # Synthesizer Web Audio API (gamelan & blip)
    ├── character.js             # Controller animasi mata, kedip, lirik & rahang
    └── chatbot.js               # Mesin percakapan, typewriter & sinkronisasi
```

---

## 🚀 Cara Menjalankan

### Cara 1: Buka Langsung di Browser
Cukup klik dua kali (atau *double-click*) file `animasi/index.html` pada browser favorit Anda (**Google Chrome, Safari, Edge, Firefox**).

### Cara 2: Menjalankan dengan Local Web Server
Buka terminal dan jalankan:
```bash
cd /Users/kerasakti/Documents/BUDAYAGO/animasi
python3 -m http.server 8080
```
Buka peramban di `http://localhost:8080`.

---

## 🧭 Integrasi ke Next.js (`nusantara-front`)

### Opsi A: Menggunakan Iframe Floating Widget (Paling Cepat & Terisolasi)
Salin folder `animasi` ke dalam `nusantara-front/public/animasi/`, lalu panggil di komponen Next.js:

```tsx
// src/components/BarongWidget.tsx
'use client';
import { useState } from 'react';

export default function BarongWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <iframe
          src="/animasi/index.html"
          className="w-[380px] h-[600px] rounded-3xl border border-amber-400/30 shadow-2xl bg-slate-950/80 backdrop-blur-md mb-4"
        />
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-400 shadow-lg flex items-center justify-center hover:scale-110 transition-transform overflow-hidden"
      >
        <img src="/animasi/assets/bot-base-transparent.png" alt="Bar Hala Ai" className="w-14 h-14" />
      </button>
    </div>
  );
}
```

---

## 🎮 Panel Uji Coba (Test Controls)

Pada mode **Studio**, Anda dapat menguji seluruh animasi secara manual melalui tombol:
- **👁️ Kedip**: Memicu kedipan kelopak mata secara instan.
- **🗣️ Bicara**: Mengaktifkan gerakan mulut dan rahang buka-tutup.
- **✨ Senang**: Menampilkan ekspresi mata tersenyum ceria dan letupan partikel emas.
- **😲 Kaget**: Membesarkan mata dan memicu ekspresi terkejut.
- **💭 Pikir**: Mengarahkan lirikan mata ke atas saat berpikir.

