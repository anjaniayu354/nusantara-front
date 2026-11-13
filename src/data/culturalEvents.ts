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
  },
  {
    id: "rambu-solo",
    name: "Ritual Pemakaman Akbar Rambu Solo'",
    location: "Kete Kesu, Tana Toraja",
    province: "Sulawesi Selatan",
    coordinates: [-3.0458, 119.8973],
    dateRange: "28 November - 2 Desember 2026",
    daysRemaining: 15,
    status: "PREPARATION",
    description: "Upacara penyempurnaan kematian suku Toraja yang berlangsung berhari-hari dengan arak-arakan peti jenazah, adu kerbau (Silaga Tedong), dan tarian Ma'badong.",
    culturalEssence: "Mengantar arwah leluhur (To Matedo) menuju alam keabadian (Puya)."
  },
  {
    id: "festival-samosir",
    name: "Pesta Budaya Danau Toba & Karnaval Ulos",
    location: "Tuktuk Siadong, Pulau Samosir",
    province: "Sumatera Utara",
    coordinates: [2.6845, 98.8756],
    dateRange: "5 - 7 Desember 2026",
    daysRemaining: 22,
    status: "UPCOMING",
    description: "Parade tenun ulos sepanjang 1.000 meter, atraksi perahu naga tradisional Solu Bolon, dan simfoni gondang sabangunan di tepi danau.",
    culturalEssence: "Perayaan kelestarian warisan leluhur Batak Toba dan kebangkitan ekonomi perajin tenun perempuan."
  }
];
