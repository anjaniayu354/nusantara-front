export type Category = "pantai" | "gunung" | "budaya" | "desa" | "festival";

export interface LocalTripPackage {
  title: string;
  organizer: string;
  duration: string;
  priceIdr: number;
  priceUsd: number;
  includesGuide: boolean;
  conservationFeePercent: number; // 2.5% dana kelestarian adat
}

export interface CulturalDestination {
  id: string;
  name: string;
  subtitle: string;
  category: Category;
  province: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  historicalSignificance: string;
  etiquette: {
    dressCode: string;
    taboos: string[]; // Pantangan adat
    rituals: string;
  };
  bmkgStation: {
    name: string;
    temperature: number; // Celcius
    condition: "Cerah" | "Cerah Berawan" | "Hujan Ringan" | "Hujan Sedang";
    humidity: number; // %
    windSpeedKmh: number;
    waveHeightMeters: number;
    safetyStatus: "AMAN" | "WASPADA" | "TUNDA";
  };
  tripPackage: LocalTripPackage;
  imageUrl: string;
  tags: string[];
}

export const DESTINATIONS: CulturalDestination[] = [
  {
    id: "borobudur",
    name: "Candi Borobudur & Desa Wanurejo",
    subtitle: "Monumen Buddha Terbesar di Dunia",
    category: "budaya",
    province: "Jawa Tengah",
    coordinates: [-7.6079, 110.2038],
    description: "Mahakarya arsitektur abad ke-8 Dinasti Syailendra dengan 2.672 relief batu dan 504 arca Buddha. Dikelilingi desa-desa wisata kriya gamelan dan gerabah tradisional.",
    historicalSignificance: "Situs Warisan Dunia UNESCO yang melambangkan kosmologi Buddha (Kamadhatu, Rupadhatu, Arupadhatu).",
    etiquette: {
      dressCode: "Mengenakan kain sarung batik (tersedia di pintu masuk), bahu dan lutut tertutup sopan.",
      taboos: [
        "Dilarang memanjat atau duduk di atas stupa batu",
        "Dilarang menyentuh relief dengan tangan basah/berminyak",
        "Wajib menjaga ketenangan di pelataran Arupadhatu"
      ],
      rituals: "Pradaksina (berjalan searah jarum jam mengelilingi candi sambil bermeditasi)."
    },
    bmkgStation: {
      name: "Stasiun Klimatologi Semarang / Magelang",
      temperature: 28,
      condition: "Cerah Berawan",
      humidity: 74,
      windSpeedKmh: 12,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Sunrise Nirvana & Workshop Batik Borobudur",
      organizer: "Komunitas Pemandu Desa Wanurejo",
      duration: "1 Hari Penuh",
      priceIdr: 450000,
      priceUsd: 29,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80",
    tags: ["UNESCO", "Candi", "Spiritual", "Kerajinan"]
  },
  {
    id: "penglipuran",
    name: "Desa Adat Penglipuran & Kintamani",
    subtitle: "Desa Terbersih Ketiga di Dunia",
    category: "desa",
    province: "Bali",
    coordinates: [-8.4239, 115.3582],
    description: "Desa adat berarsitektur bambu khas Bali yang memegang teguh filosofi Tri Hita Karana (harmoni antara manusia, alam, dan Sang Pencipta). Berjarak dekat dari kaldera Batur.",
    historicalSignificance: "Pelopor tata ruang desa tradisional berbasis kosmologi hulu-teben dan hutan bambu suci seluas 75 hektar.",
    etiquette: {
      dressCode: "Kamen (kain adat Bali) dengan selendang/senteng di pinggang bagi pria dan wanita.",
      taboos: [
        "Dilarang masuk ke area suci Pura Penataran saat sedang datang bulan",
        "Dilarang memetik rebung atau menebang pohon bambu tanpa restu Bendesa Adat",
        "Dilarang membuang sampah sembarangan di jalan utama desa"
      ],
      rituals: "Persembahyangan Galungan & Kuningan dengan hiasan penjor di setiap angkul-angkul rumah."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Ngurah Rai / Bangli",
      temperature: 24,
      condition: "Cerah",
      humidity: 68,
      windSpeedKmh: 14,
      waveHeightMeters: 1.2,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Living Bamboo Village & Hutan Suci Walk",
      organizer: "Koperasi Desa Adat Penglipuran",
      duration: "6 Jam",
      priceIdr: 350000,
      priceUsd: 22,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    tags: ["Desa Adat", "Tri Hita Karana", "Bambu", "Tradisi"]
  },
  {
    id: "toraja",
    name: "Tana Toraja (Kete Kesu & Londa)",
    subtitle: "Negeri di Atas Awan & Rumah Tongkonan",
    category: "budaya",
    province: "Sulawesi Selatan",
    coordinates: [-3.0458, 119.8973],
    description: "Pusat kebudayaan megalitik suku Toraja dengan rumah adat Tongkonan beratap perahu, lumbung alang padi, makam tebing gantung, dan patung kayu leluhur (Tau-Tau).",
    historicalSignificance: "Peradaban tertua yang mempertahankan upacara kematian sakral Rambu Solo' dengan pengorbanan kerbau belang (Tedong Bonga).",
    etiquette: {
      dressCode: "Pakaian sopan berwarna gelap/hitam saat menghadiri prosesi Rambu Solo'.",
      taboos: [
        "Dilarang menyentuh peti mati gantung (erong) dan tengkorak di gua Londa",
        "Dilarang mengambil foto jenazah tanpa izin tertulis dari rumpun keluarga adat",
        "Dilarang melangkah melangkahi sesaji persembahan leluhur"
      ],
      rituals: "Prosesi adat Rambu Solo' dan Ma'nene (pembersihan pakaian leluhur)."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Toraja Pongtiku",
      temperature: 22,
      condition: "Cerah Berawan",
      humidity: 80,
      windSpeedKmh: 10,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Jelajah Tongkonan Kuno & Gua Tebing Londa",
      organizer: "Aliansi Pemandu Adat Toraja",
      duration: "2 Hari 1 Malam",
      priceIdr: 850000,
      priceUsd: 55,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?auto=format&fit=crop&w=800&q=80",
    tags: ["Megalitik", "Tongkonan", "Rambu Solo", "Budaya"]
  },
  {
    id: "waerebo",
    name: "Desa Adat Wae Rebo",
    subtitle: "Kampung Tradisional Berbentuk Kerucut di Puncak Lembah",
    category: "desa",
    province: "Nusa Tenggara Timur",
    coordinates: [-8.6983, 120.2872],
    description: "Kampung adat terpencil di ketinggian 1.200 mdpl Manggarai Barat dengan 7 rumah kerucut raksasa (Mbaru Niang) yang telah diakui UNESCO Top Award of Excellence.",
    historicalSignificance: "Peninggalan leluhur suku Manggarai dengan struktur atap ijuk 5 tingkat yang mewakili lapisan spiritual semesta.",
    etiquette: {
      dressCode: "Pakaian trekking sopan, selendang tenun Manggarai wajib disematkan di bahu saat upacara.",
      taboos: [
        "Wajib membunyikan kentongan bambu sebelum masuk dan mengikuti ritual Waelu oleh tetua adat",
        "Dilarang mengambil foto sebelum ritual penerimaan tamu selesai dilaksanakan",
        "Dilarang berteriak atau bersiul di malam hari di pelataran compang"
      ],
      rituals: "Upacara penerimaan tamu Waelu dan cicipi kopi robusta lokal bersama tetua."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Komodo Labuan Bajo",
      temperature: 20,
      condition: "Cerah Berawan",
      humidity: 78,
      windSpeedKmh: 16,
      waveHeightMeters: 1.5,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Trekking Lembah Hijau & Bermalam di Mbaru Niang",
      organizer: "Lembaga Pariwisata Adat Wae Rebo",
      duration: "2 Hari 1 Malam",
      priceIdr: 950000,
      priceUsd: 62,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80",
    tags: ["UNESCO", "Mbaru Niang", "Trekking", "Kopi Adat"]
  },
  {
    id: "bromo",
    name: "Gunung Bromo & Lautan Pasir Tengger",
    subtitle: "Kawah Suci Pemujaan Sang Hyang Widhi",
    category: "gunung",
    province: "Jawa Timur",
    coordinates: [-7.9425, 112.9530],
    description: "Bentang kaldera vulkanik purba di Taman Nasional Bromo Tengger Semeru. Tempat bermukimnya suku Tengger yang menjaga api leluhur Kerajaan Majapahit.",
    historicalSignificance: "Pusat ritual Yadnya Kasada tahunan di mana hasil bumi dilemparkan ke kawah sebagai persembahan syukur kepada Roro Anteng dan Joko Seger.",
    etiquette: {
      dressCode: "Jaket hangat berinsulasi tebal, syal atau sarung tenun Tengger untuk penghormatan.",
      taboos: [
        "Dilarang buang air kecil menghadap kawah atau di sekitar Pura Luhur Poten",
        "Dilarang mengambil batu vulkanik bertuah dari bibir kawah",
        "Wajib menghormati kuda angkut milik warga Tengger"
      ],
      rituals: "Ritual Yadnya Kasada di bibir kawah dan sembahyang subuh di Pura Poten."
    },
    bmkgStation: {
      name: "Stasiun Geofisika Karangkates / Pasuruan",
      temperature: 13,
      condition: "Cerah",
      humidity: 85,
      windSpeedKmh: 20,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Sunrise Penanjakan & Upacara Budaya Kasada",
      organizer: "Paguyuban Jeep & Kuda Tengger",
      duration: "12 Jam",
      priceIdr: 500000,
      priceUsd: 33,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
    tags: ["Vulkanik", "Tengger", "Kasada", "Kaldera"]
  },
  {
    id: "dieng",
    name: "Dataran Tinggi Dieng & Candi Arjuna",
    subtitle: "Kediaman Para Dewa (Dihyang)",
    category: "gunung",
    province: "Jawa Tengah",
    coordinates: [-7.2058, 109.9079],
    description: "Kaldera pegunungan berkabut pada ketinggian 2.093 mdpl dengan kelompok candi Hindu tertua di Jawa, kawah belerang Sikidang, dan fenomena Telaga Warna.",
    historicalSignificance: "Situs pemujaan Siwa abad ke-7 serta tradisi sakral pemotongan rambut gimbal anak bajang (Ruwat Rambut Gimbal).",
    etiquette: {
      dressCode: "Pakaian sopan tertutup tahan dingin.",
      taboos: [
        "Dilarang mengejek atau memotong rambut anak gimbal tanpa izin dan ritual adat",
        "Dilarang mendekati area kawah di luar jalur pembatas saat gas beracun meningkat",
        "Dilarang menduduki yoni dan lingga di kompleks candi"
      ],
      rituals: "Ruwat Rambut Gimbal Dieng Culture Festival di pelataran Candi Arjuna."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Tunggul Wulung / Banjarnegara",
      temperature: 15,
      condition: "Cerah Berawan",
      humidity: 82,
      windSpeedKmh: 14,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Golden Sunrise Sikunir & Eksplorasi Candi Siwa",
      organizer: "Pokdarwis Dieng Pandawa",
      duration: "1 Hari",
      priceIdr: 400000,
      priceUsd: 26,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    tags: ["Candi Arjuna", "Rambut Gimbal", "Telaga Warna", "Sejuk"]
  },
  {
    id: "komodo",
    name: "Taman Nasional Komodo & Pink Beach",
    subtitle: "Habitat Naga Purba & Perairan Karang Dunia",
    category: "pantai",
    province: "Nusa Tenggara Timur",
    coordinates: [-8.5583, 119.4939],
    description: "Kepulauan legendaris cagar biosfer dunia tempat bertualang melihat komodo (Varanus komodoensis), pantai berpasir merah muda, dan terumbu karang segitiga emas.",
    historicalSignificance: "Habitat purbakala yang dijaga kearifan lokal suku Ata Modo yang meyakini komodo adalah saudara kembar manusia.",
    etiquette: {
      dressCode: "Pakaian pantai pelindung matahari, alas kaki trekking berdaya cengkeram.",
      taboos: [
        "Wajib selalu didampingi ranger (naturalist guide) berkayu cabang",
        "Dilarang berlari atau membuat gerakan mengejutkan saat melihat komodo",
        "Wanita yang sedang menstruasi wajib melapor kepada ranger demi keselamatan",
        "Dilarang merusak atau membawa pasir merah muda dan koral"
      ],
      rituals: "Penghormatan legenda Putri Naga oleh para tetua Ata Modo."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Komodo Labuan Bajo",
      temperature: 30,
      condition: "Cerah",
      humidity: 65,
      windSpeedKmh: 18,
      waveHeightMeters: 1.1,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Liveaboard Phinisi Sail Komodo & Padar Trekking",
      organizer: "Asosiasi Kapal Phinisi Labuan Bajo",
      duration: "3 Hari 2 Malam",
      priceIdr: 3200000,
      priceUsd: 210,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
    tags: ["UNESCO", "Komodo", "Pink Beach", "Phinisi"]
  },
  {
    id: "rajaampat",
    name: "Kepulauan Raja Ampat (Wayag & Misool)",
    subtitle: "Ibukota Keanekaragaman Hayati Bawah Laut Dunia",
    category: "pantai",
    province: "Papua Barat Daya",
    coordinates: [-0.5000, 130.5000],
    description: "Gugusan pulau karst zamrud dengan 75% spesies karang dunia. Dikelola dengan kearifan adat Sasi Laut (larangan penangkapan ikan berkala untuk pemulihan ekosistem).",
    historicalSignificance: "Sistem konservasi adat Sasi tertua di Nusantara yang membuktikan kedaulatan masyarakat adat atas laut.",
    etiquette: {
      dressCode: "Pakaian bahari sopan, dilarang memakai tabir surya beroksibenzon yang merusak karang.",
      taboos: [
        "Dilarang memancing atau mengambil kerang di perairan yang sedang dalam masa 'Sasi Tutup'",
        "Dilarang menyentuh karang dan pari manta",
        "Wajib membayar Kartu Pemeliharaan Lingkungan Adat (KPLA)"
      ],
      rituals: "Ritual Buka Sasi dan doa bersama para tetua suku Maya."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Sorong",
      temperature: 29,
      condition: "Cerah Berawan",
      humidity: 78,
      windSpeedKmh: 15,
      waveHeightMeters: 0.9,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Expedisi Karst Wayag & Dive Manta Point Adat",
      organizer: "Konsorsium Homestay Adat Papua",
      duration: "4 Hari 3 Malam",
      priceIdr: 5800000,
      priceUsd: 380,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    tags: ["Sasi Laut", "Karst", "Diving", "Papua"]
  },
  {
    id: "sade",
    name: "Desa Adat Sade & Pantai Mandalika",
    subtitle: "Pusat Tenun Songket Tradisional Sasak",
    category: "desa",
    province: "Nusa Tenggara Barat",
    coordinates: [-8.8398, 116.2917],
    description: "Kampung adat suku Sasak di Lombok Tengah dengan rumah berdinding anyaman bambu, atap alang-alang, serta lantai yang dibersihkan secara tradisional dengan kotoran kerbau.",
    historicalSignificance: "Tradisi tenun ikat songket yang wajib dikuasai wanita Sasak sebelum menikah, serta tradisi lari kawin (Merarik).",
    etiquette: {
      dressCode: "Kain sarung tenun ikat Sasak yang dikaitkan di pinggang.",
      taboos: [
        "Wajib membungkukkan badan saat melewati pintu rumah Bale Tani yang sengaja dibuat rendah",
        "Dilarang masuk ke lumbung padi (Bale Jajar) tanpa izin tetua keluarga",
        "Wajib menyapa dengan ramah penghuni saat melintas di lorong gang sempit"
      ],
      rituals: "Tarian perang tanding Peresean dan alunan musik Gendang Beleq."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Zainuddin Abdul Madjid Lombok",
      temperature: 29,
      condition: "Cerah",
      humidity: 70,
      windSpeedKmh: 16,
      waveHeightMeters: 1.3,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Belajar Tenun Songket & Tarian Peresean Sasak",
      organizer: "Pokdarwis Karang Sasak Sade",
      duration: "5 Jam",
      priceIdr: 280000,
      priceUsd: 18,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
    tags: ["Sasak", "Songket", "Peresean", "Tradisi"]
  },
  {
    id: "yogyakarta",
    name: "Keraton Yogyakarta & Taman Sari",
    subtitle: "Pusat Kebudayaan Mataram Islam & Sumbu Filosofi",
    category: "budaya",
    province: "DI Yogyakarta",
    coordinates: [-7.8053, 110.3642],
    description: "Istana Sri Sultan Hamengku Buwono yang menjadi pusat tata nilai Jawa, gamelan keraton, tarian Bedhaya, serta Sumbu Filosofi Yogyakarta yang telah diakui UNESCO.",
    historicalSignificance: "Garis imajiner keramat yang membentang dari Panggung Krapyak, Keraton, Tugu Yogyakarta hingga Gunung Merapi.",
    etiquette: {
      dressCode: "Pakaian sopan (dilarang celana pendek, tanktop, atau sandal jepit saat masuk Tratag Proboyekso).",
      taboos: [
        "Dilarang memakai pakaian berwarna hijau gadung (warna kebesaran Ratu Kidul)",
        "Dilarang memakai topi atau kacamata hitam di dalam bangsal keraton",
        "Dilarang melangkah di atas undakan pintu gerbang batas keraton"
      ],
      rituals: "Upacara Grebeg Maulud, Sekaten, dan prosesi Labuhan Merapi & Parangkusumo."
    },
    bmkgStation: {
      name: "Stasiun Klimatologi BMKG DIY Yogyakarta",
      temperature: 28,
      condition: "Cerah Berawan",
      humidity: 75,
      windSpeedKmh: 12,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Tur Sumbu Filosofi Keraton & Bengkel Gamelan",
      organizer: "Abdi Dalem & Pemandu Budaya Mataram",
      duration: "6 Jam",
      priceIdr: 320000,
      priceUsd: 21,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=800&q=80",
    tags: ["Keraton", "UNESCO", "Sumbu Filosofi", "Gamelan"]
  },
  {
    id: "toba",
    name: "Danau Toba & Huta Siallagan Samosir",
    subtitle: "Kaldera Vulkanik Raksasa & Jejak Megalitik Batak",
    category: "budaya",
    province: "Sumatera Utara",
    coordinates: [2.6845, 98.8756],
    description: "Kaldera supervolcano terbesar di Asia Tenggara dengan pulau Samosir di tengahnya. Menampilkan rumah adat Bolon, batu persidangan Raja Siallagan, dan tarian boneka Sigale-gale.",
    historicalSignificance: "Pusat hukum adat tertua suku Batak Toba dan tarian magis Sigale-gale untuk mengenang pangeran.",
    etiquette: {
      dressCode: "Mengenakan ulos tenun Batak yang disematkan di bahu saat memasuki area Huta Siallagan.",
      taboos: [
        "Dilarang duduk di kursi batu eksekutor tanpa izin keturunan raja",
        "Dilarang berkata kotor atau mencela patung Sigale-gale saat sedang menari",
        "Wajib menghormati makam raja-raja Sidabutar"
      ],
      rituals: "Tortor Batak bersama patung Sigale-gale dan petikan alat musik hasapi."
    },
    bmkgStation: {
      name: "Stasiun Geofisika Silangit / Toba",
      temperature: 23,
      condition: "Cerah",
      humidity: 76,
      windSpeedKmh: 15,
      waveHeightMeters: 0.4,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Jelajah Pulau Samosir & Belajar Tenun Ulos",
      organizer: "Komunitas Budaya Batak Samosir",
      duration: "1 Hari",
      priceIdr: 420000,
      priceUsd: 27,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    tags: ["Danau Toba", "Batak", "Ulos", "Sigale-gale"]
  },
  {
    id: "bandaneira",
    name: "Banda Neira & Benteng Belgica",
    subtitle: "Kepulauan Rempah Bersejarah Dunia",
    category: "budaya",
    province: "Maluku",
    coordinates: [-4.5238, 129.9042],
    description: "Jantung jalur rempah pala dunia pada abad ke-17 dengan benteng bersejarah Belgica berbentuk pentagonal, perkebunan pala purba, dan perairan terumbu karang jernih di bawah kaki Gunung Api Banda.",
    historicalSignificance: "Satu-satunya penghasil pala dan fuli di dunia pada era perdagangan rempah global yang diperebutkan bangsa Eropa.",
    etiquette: {
      dressCode: "Pakaian santai sopan untuk berkeliling kampung bersejarah.",
      taboos: [
        "Dilarang memetik buah pala langsung dari pohon di kebun adat tanpa izin petani perkenier",
        "Dilarang mencoret-coret dinding benteng kuno Belgica dan Nassau",
        "Wajib menjaga kebersihan laut saat berlayar menaiki belang (perahu adat)"
      ],
      rituals: "Lomba Belang Adat (dayung perahu persemakmuran para datu) dan ritual Cuci Parigi Pusaka."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Banda",
      temperature: 29,
      condition: "Cerah",
      humidity: 73,
      windSpeedKmh: 16,
      waveHeightMeters: 0.8,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Napak Tilas Jalur Pala & Snorkeling Lava Flow",
      organizer: "Banda Heritage Guide Community",
      duration: "3 Hari 2 Malam",
      priceIdr: 2100000,
      priceUsd: 138,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    tags: ["Jalur Rempah", "Pala", "Benteng Belgica", "Maluku"]
  }
];
