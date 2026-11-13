/**
 * Nusa Antara — Cultural Knowledge Base
 * Curated cultural intelligence for Bar Hala Ai.
 */

const NUSA_ANTARA_KNOWLEDGE = {
  profile: {
    name: "Bar Hala Ai",
    title: "Penjaga Budaya & Pemandu Petualangan Nusa Antara",
    role: "Pemandu Petualangan & Asisten Budaya Nusantara",
    avatar: "assets/bot-base-transparent.png",
    greetings: [
      "Rahajeng! Saya Bar Hala Ai, penjaga gerbang petualangan budaya Nusa Antara. Ada tradisi atau destinasi yang ingin kamu jelajahi?",
      "Om Swastyastu! Selamat datang di Nusa Antara. Bar Hala Ai siap memandu perjalananmu mengarungi kekayaan budaya Indonesia!",
      "Sampurasun! Wah, senang bertemu denganmu. Mau cari rekomendasi festival adat, candi megah, atau tips cuaca wisata hari ini?"
    ]
  },

  quickSuggestions: [
    { label: "Rekomendasi Budaya", query: "rekomendasi wisata budaya nusantara" },
    { label: "Festival & Adat", query: "festival dan upacara adat terpopuler" },
    { label: "Cek Cuaca BMKG", query: "tips cuaca dan keselamatan wisata BMKG" },
    { label: "Kuis Rute 30 Detik", query: "kuis preferensi trip nusa antara" },
    { label: "Etika & Pantangan", query: "etika dan pantangan berkunjung ke situs adat" }
  ],

  topics: [
    {
      id: "greeting",
      keywords: ["halo", "hai", "selamat", "pagi", "siang", "sore", "malam", "siapa kamu", "perkenalkan", "bar hala", "barhala", "barong"],
      response: `Rahajeng! Saya **Bar Hala Ai**, roh pelindung dan pemandu cerdasmu di portal **Nusa Antara**! 

Saya terinspirasi dari simbol kebajikan (*Dharma*) dalam kosmologi budaya Bali dan Nusantara. Saya siap membantu kamu:
- Merencanakan rute perjalanan wisata budaya (*Trip Planner*)
- Mengenal upacara sakral & kalender festival adat
- Meninjau prakiraan cuaca & gelombang maritim BMKG
- Mempelajari etika luhur di kampung adat dan pura/candi

Ada destinasi impian yang ingin kamu tanyakan?`,
      expression: "happy"
    },
    {
      id: "destinasi_populer",
      keywords: ["destinasi", "rekomendasi", "tempat", "wisata budaya", "kunjungi", "objek", "liburan"],
      response: `Berikut 4 Destinasi Pusaka Budaya Nusantara unggulan yang wajib masuk trip plan kamu:

1. **Desa Adat Penglipuran (Bali)**
   - Desa terbersih di dunia dengan arsitektur bambu berkonsep *Tri Hita Karana*.
2. **Kawasan Candi Borobudur & Prambanan (Jawa Tengah & D.I. Yogyakarta)**
   - Mahakarya candi Buddha dan Hindu terbesar di Asia Tenggara dengan relief relief filosofi kehidupan.
3. **Desa Adat Wae Rebo (Flores, NTT)**
   - Desa di atas awan dengan 7 rumah kerucut pusaka *Mbaru Niang*.
4. **Tana Toraja (Sulawesi Selatan)**
   - Kompleks rumah adat *Tongkonan* dan makam tebing batu purba di Lemo & Londa.

Kamu paling tertarik menjelajahi pulau mana terlebih dahulu?`,
      expression: "speaking"
    },
    {
      id: "festival_adat",
      keywords: ["festival", "upacara", "ritual", "adat", "nyepi", "kasada", "sekaten", "rambu solo", "bau nyale"],
      response: `Kalender Budaya Nusantara sarat akan perayaan agung yang penuh makna:

- **Upacara Yadnya Kasada (Bromo, Jawa Timur)**: Persembahan hasil bumi ke kawah Bromo oleh suku Tengger setiap bulan Kasada.
- **Tawur Kesanga & Pawai Ogoh-ogoh (Bali)**: Ritus penyucian alam semesta sehari menjelang heningnya Catur Brata Penyepian.
- **Rambu Solo' (Tana Toraja)**: Upacara pemakaman akbar termegah di dunia dengan tarian Ma'badong dan kerbau belang Tedong Bonga.
- **Festival Bau Nyale (Lombok, NTB)**: Tradisi menangkap cacing laut jelmaan Putri Mandalika di pesisir Kuta Mandalika.
- **Grebeg Maulud & Sekaten (Yogyakarta & Solo)**: Iring-iringan gunungan hasil bumi dan alunan gamelan Kyai Gunturmadu.`,
      expression: "happy"
    },
    {
      id: "bmkg_cuaca",
      keywords: ["bmkg", "cuaca", "ombak", "gelombang", "hujan", "angin", "maritim", "laut", "aman"],
      response: `**Integrasi BMKG SATU PETA MKG — Nusa Antara Safety Radar**:

Kenyamanan perjalanan budaya sangat bergantung pada kearifan membaca alam:
- **Penyeberangan Laut (Feri / Fast Boat)**: Waspadai tinggi gelombang > 1.5 meter di Selat Bali, Selat Lombok, dan Selat Sunda. Selalu cek status *Indeks Keselamatan Maritim*.
- **Wisata Dataran Tinggi (Dieng, Bromo, Toraja)**: Siapkan jaket termal tahan angin dan perhatikan potensi kabut tebal setelah pukul 14.00 WIB.
- **Peta Petualangan**: Di portal Nusa Antara, radar cuaca BMKG terpasang di bar bawah layar dan memantau koordinat secara *real-time*.

Pastikan kamu selalu mengecek status hijau (AMAN) sebelum menyeberang pulau!`,
      expression: "thinking"
    },
    {
      id: "etika_pantangan",
      keywords: ["etika", "aturan", "pantangan", "larangan", "sopan", "pakaian", "kamen", "adat", "suci"],
      response: `**Panduan Kehormatan Adat (Etika Berkunjung)**:

Menghormati tradisi setempat adalah esensi sejati wisatawan berbudaya:
1. **Pakaian Sopan**: Kenakan kain sarung/kamen dan selendang kuning saat memasuki area suci Pura di Bali atau Candi di Jawa.
2. **Jangan Menginjak Sesajen**: Di Bali, perhatikan langkah kakimu agar tidak menginjak *Canang Sari* di pelataran jalan.
3. **Kearifan Baduy Dalam**: Dilarang keras mengambil foto, menyalakan ponsel/gadget, serta dilarang menggunakan sabun/kimiawi di sungai keramat.
4. **Minta Izin Tetua Adat**: Sebelum memotret upacara duka atau ritual sakral, selalu haturkan salam dan izin pada pemangku adat.`,
      expression: "speaking"
    },
    {
      id: "kuis_trip",
      keywords: ["kuis", "preferensi", "trip", "rute", "itinerary", "jalan", "hari", "budget"],
      response: `**Kuis Kilat Rute Petualangan Budaya (Pilih Salah Satu)**:

1. **Pesisir & Bahari Mistis**: Sunset Pura Luhur Uluwatu, Tari Kecak, dan Pantai Pandawa.
2. **Gunung & Peradaban Kuno**: Sunrise Candi Borobudur, Dataran Tinggi Dieng, dan Candi Sukuh.
3. **Desa Adat & Etnik Otentik**: Menenun di Baduy, Desa Sade Lombok, atau Tongkonan Toraja.

Ketikkan angka pilihanmu (1, 2, atau 3), dan aku akan siapkan rekomendasi rutenya!`,
      expression: "happy"
    },
    {
      id: "kuis_jawaban_1",
      keywords: ["1", "pesisir", "bahari", "pantai"],
      response: `**Rekomendasi Rute 3 Hari 2 Malam (Pesisir & Bahari Mistis)**:
- **Hari 1**: Tiba di Bali, eksplorasi Desa Adat Penglipuran & hutan bambu lestari.
- **Hari 2**: Pagi di Tirta Empul (melukat suci), sore di Pura Luhur Uluwatu menonton pagelaran Tari Kecak berlatar samudra Hindia.
- **Hari 3**: Wisata kuliner khas Jimbaran dan belanja cinderamata karya perajin lokal Sukawati.
*Estimasi Budget*: Rp 2.400.000 / $155 USD per orang.`,
      expression: "happy"
    },
    {
      id: "kuis_jawaban_2",
      keywords: ["2", "gunung", "peradaban", "candi"],
      response: `**Rekomendasi Rute 3 Hari 2 Malam (Gunung & Peradaban Pusaka)**:
- **Hari 1**: Yogyakarta — Menelusuri Kraton Jogja, Taman Sari, dan perajin perak Kotagede.
- **Hari 2**: Sunrise Manohara Borobudur, dilanjutkan ziarah Candi Mendut & Pawon, lalu sore ke Candi Prambanan.
- **Hari 3**: Lava tour Merapi & napak tilas museum petilasan Mbah Maridjan.
*Estimasi Budget*: Rp 1.850.000 / $120 USD per orang.`,
      expression: "speaking"
    },
    {
      id: "kuis_jawaban_3",
      keywords: ["3", "desa", "desa adat", "etnik"],
      response: `**Rekomendasi Rute 4 Hari 3 Malam (Eksplorasi Desa Adat Otentik)**:
- **Hari 1-2**: Ekspedisi jalan kaki menyusuri Desa Kanekes Baduy Luar hingga Baduy Dalam, belajar hidup selaras alam tanpa listrik dan polusi.
- **Hari 3-4**: Mengunjungi perkampungan tenun Baduy dan membeli madu hutan murni hasil panen suku Baduy.
*Estimasi Budget*: Rp 1.250.000 / $80 USD per orang.`,
      expression: "happy"
    }
  ],

  fallbackResponses: [
    "Pertanyaan yang sangat menarik tentang kebudayaan kita! Kamu bisa bertanya lebih spesifik seputar rekomendasi destinasi, festival adat, etika berkunjung, atau prakiraan cuaca BMKG.",
    "Sebagai Bar Hala Ai, aku terus mendalami seluruh pusaka tradisi Nusantara. Coba tanyakan misalnya: 'rekomendasi wisata di Bali', 'kapan festival kasada', atau 'etika masuk pura'.",
    "Pikiran bijak dari petualang budaya! Mau aku bantu buatkan rekomendasi trip harian atau cek keselamatan maritim BMKG?"
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NUSA_ANTARA_KNOWLEDGE;
} else {
  window.NUSA_ANTARA_KNOWLEDGE = NUSA_ANTARA_KNOWLEDGE;
}

