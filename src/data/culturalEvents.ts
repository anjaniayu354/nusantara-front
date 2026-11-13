export interface CulturalEvent {
  id: string;
  name: string;
  location: string;
  province: string;
  coordinates: [number, number]; // [lat, lng]
  dateRange: string;
  daysRemaining: number;
  status: "ACTIVE_TODAY" | "UPCOMING" | "PREPARATION";
  description: string;
  culturalEssence: string;
}

export const CULTURAL_EVENTS: CulturalEvent[] = [
  {
    id: "festival-pinisi",
    name: "Festival Pinisi Bulukumba & Annyorong Poti",
    location: "Pantai Tanjung Bira & Tana Beru",
    province: "Sulawesi Selatan",
    coordinates: [-5.5412, 120.3789],
    dateRange: "18 - 21 November 2026",
    daysRemaining: 5,
    status: "ACTIVE_TODAY",
    description: "Perhelatan akbar maritim Nusantara yang menampilkan prosesi sakral Annyorong Poti (menarik kapal Pinisi ratusan ton ke laut), parade perahu layar Pinisi berlayar di Tanjung Bira, dan karnaval Panrita Lopi.",
    culturalEssence: "Perayaan keluhuran keahlian perkapalan kayu UNESCO dan penghormatan kepada roh penjaga samudera leluhur Bugis-Konjo."
  },
  {
    id: "pesta-sekura",
    name: "Pesta Budaya Sekura Cakak Buah Lampung Barat",
    location: "Kecamatan Liwa & Sekincau",
    province: "Lampung",
    coordinates: [-5.0350, 104.0500],
    dateRange: "24 - 27 November 2026",
    daysRemaining: 11,
    status: "UPCOMING",
    description: "Pesta topeng kayu tradisional pasca Idulfitri di mana ribuan warga mengenakan topeng Sekura Betik dan Sekura Kamak berbusana kain Celugam, berarak keliling desa, dan memanjat pohon pinang bergantungan hasil bumi dan rempah.",
    culturalEssence: "Ungkapan rasa syukur atas limpahan panen kopi robusta dan perekat silaturahmi sakral antar marga adat Saibatin."
  },
  {
    id: "festival-krakatau",
    name: "Lampung Krakatau Festival (LKF) & Parade Tapis",
    location: "Teluk Lampung & Gunung Anak Krakatau",
    province: "Lampung",
    coordinates: [-5.4500, 105.2800],
    dateRange: "2 - 5 Desember 2026",
    daysRemaining: 19,
    status: "UPCOMING",
    description: "Karnaval busana adat Tapis sulam emas akbar, tari kolosal Bedana Krakatau, serta pelayaran kapal pesiar ekspedisi menyusuri Selat Sunda menuju cagar alam kaldera Anak Krakatau.",
    culturalEssence: "Kebangkitan kebudayaan Lampung Ruwa Jurai dan peringatan kesadaran mitigasi bencana alam gunung berapi laut dunia."
  },
  {
    id: "ritual-andingingi",
    name: "Ritual Adat Andingingi Borong Karamaka",
    location: "Kawasan Adat Ammatoa Kajang",
    province: "Sulawesi Selatan",
    coordinates: [-5.3347, 120.1256],
    dateRange: "10 - 12 Desember 2026",
    daysRemaining: 27,
    status: "PREPARATION",
    description: "Upacara sakral mendinginkan alam dan hutan lindung adat Kajang oleh Bohe Ammatoa bersama pemangku adat Gantarang untuk memohon keharmonisan iklim bumi dan perlindungan dari mara bahaya.",
    culturalEssence: "Manifestasi ketaatan mutlak terhadap Pasang ri Kajang demi kelestarian hutan dan keseimbangan semesta."
  },
  {
    id: "festival-waykambas",
    name: "Festival Pesona Way Kambas & Parade Gajah",
    location: "Pusat Konservasi Gajah Way Kambas",
    province: "Lampung",
    coordinates: [-5.0833, 105.7833],
    dateRange: "18 - 20 Desember 2026",
    daysRemaining: 35,
    status: "PREPARATION",
    description: "Atraksi parade gajah konservasi jinak, lomba sepak bola gajah, tari Gamolan Pekhing bambu tradisional, serta pelepasan satwa burung liar ke habitat rimba alami.",
    culturalEssence: "Edukasi kesadaran pelestarian satwa langka Gajah Sumatera dan keharmonisan interaksi manusia dengan alam liar."
  },
  {
    id: "labuhan-merapi",
    name: "Upacara Labuhan Merapi & Parangkusumo",
    location: "Lereng Gunung Merapi & Pantai Parangkusumo",
    province: "DI Yogyakarta",
    coordinates: [-7.5407, 110.4457],
    dateRange: "15 - 17 November 2026",
    daysRemaining: 2,
    status: "ACTIVE_TODAY",
    description: "Prosesi persembahan ubo rampe sakral dari Keraton Ngayogyakarta Hadiningrat kepada penguasa Gunung Merapi (Kyai Sapu Jagad) dan Ratu Laut Selatan.",
    culturalEssence: "Harmonisasi kosmik dan permohonan keselamatan bagi seluruh rakyat Yogyakarta dari bahaya erupsi."
  },
  {
    id: "yadnya-kasada",
    name: "Upacara Yadnya Kasada Bromo",
    location: "Lautan Pasir & Kawah Gunung Bromo",
    province: "Jawa Timur",
    coordinates: [-7.9425, 112.9530],
    dateRange: "22 - 24 November 2026",
    daysRemaining: 9,
    status: "UPCOMING",
    description: "Masyarakat suku Tengger berbondong-bondong melempar sesaji hasil bumi, ternak, dan bunga ke dalam kawah Bromo pada malam bulan purnama.",
    culturalEssence: "Penggenapan janji suci Roro Anteng dan Joko Seger atas kelahiran 25 putera kepada Sang Hyang Widhi."
  }
];
