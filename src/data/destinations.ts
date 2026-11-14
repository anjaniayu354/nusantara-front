export type Category =
  | "laut"
  | "darat"
  | "gunung"
  | "hutan"
  | "pertanian"
  | "budaya"
  | "pakaian"
  | "desa"
  | "festival"
  | "pantai"
  | "sumber-alam"
  | "herbal"
  | "flora-fauna"; // Alias kompatibilitas

export interface LocalTripPackage {
  title: string;
  organizer: string;
  duration: string;
  priceIdr: number;
  priceUsd: number;
  includesGuide: boolean;
  conservationFeePercent: number; // 2.5% dana kelestarian adat
}

export interface TraditionalAttire {
  name: string; // Nama pakaian adat
  wastraType: string; // Kain tenun / wastra tradisional (misal: Kain Tapis Jung Sarat, Tenun Tarum Hitam Kajang)
  headgear?: string; // Tutup kepala / mahkota (misal: Mahkota Siger 9 Lekuk Pepadun, Passapu Hitam)
  colors: string[]; // Warna dominan / palet simbolik
  significance: string; // Makna filosofis pakaian
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
  subCategory?: string;
  agriculturalProducts?: string[]; // Hasil pertanian, perkebunan & komoditas unggulan
  traditionalAttire?: TraditionalAttire; // Pakaian adat & wastra daerah
  culturalTraditions?: string[]; // Tradisi, ritual & falsafah adat
  culturalEvents?: string[]; // Event & festival tahunan terkait
  etiquette: {
    dressCode: string;
    taboos: string[]; // Pantangan adat
    rituals: string;
  };
  bmkgStation: {
    name: string;
    temperature: number; // Celcius
    condition: "Cerah" | "Cerah Berawan" | "Berawan" | "Hujan Ringan" | "Hujan Sedang" | "Kabut";
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
  // ==========================================
  // BULUKUMBA (SULAWESI SELATAN) — BUMI PANRITA LOPI
  // ==========================================
  {
    id: "bulukumba-bira",
    name: "Pantai Tanjung Bira & Tebing Bonto Bahari",
    subtitle: "Wisata Bahari Pasir Tepung & Gerbang Pelaut Panrita Lopi",
    category: "laut",
    province: "Sulawesi Selatan",
    coordinates: [-5.6186, 120.4578],
    subCategory: "Wisata Bahari & Pesisir",
    agriculturalProducts: [
      "Rumput Laut (Eucheuma cottonii) Ekspor",
      "Kelapa Dalam Pesisir",
      "Ikan Cakalang & Kerapu Asap",
      "Gula Merah Aren Bonto Bahari"
    ],
    traditionalAttire: {
      name: "Baju Bodo & Sarung Sabbe Pesisir Bulukumba",
      wastraType: "Kain Sutra Sabbe Tenun Tangan Khas Selatan",
      headgear: "Bando Emas Saloko & Tusuk Konde Kembang Goyang",
      colors: ["#d97706", "#dc2626", "#059669"],
      significance: "Baju Bodo merupakan salah satu busana tertua di dunia yang mencerminkan status sosial, kemurnian budi pekerti, dan keanggunan perempuan Bugis-Makassar."
    },
    culturalTraditions: [
      "Ritual Songkabala Laut (Tolak Bala Bahari Nelayan)",
      "Tradisi Berlayar Perahu Layar Tradisional Lopi Sandeq",
      "Seni Tutur Sinrilik & Musik Kelong Pelaut Konjo"
    ],
    culturalEvents: [
      "Festival Pinisi Bulukumba (September/November)",
      "Parade Layar Bira & Pesta Nelayan Bonto Bahari"
    ],
    description: "Pantai dengan pasir putih sehalus tepung terigu berpadu gradasi air laut tiga warna (toska, biru muda, dan biru safir). Berada di semenanjung paling selatan Sulawesi Selatan, Bira merupakan gerbang maritim legendaris tempat para pelaut Konjo dan Bugis menguji kapal Pinisi sebelum mengarungi samudera.",
    historicalSignificance: "Pangkalan armada laut suku Konjo-Bugis sejak abad ke-14 yang menghubungkan jalur perdagangan rempah kepulauan Maluku dengan Selat Makassar dan Batavia.",
    etiquette: {
      dressCode: "Pakaian santun dan sopan, tutupi pundak saat berada di sekitar pemukiman nelayan lokal.",
      taboos: [
        "Dilarang mencemari terumbu karang karang Bira atau mengambil biota laut hidup",
        "Dilarang membuang sisa makanan langsung ke suaka penangkaran penyu",
        "Wajib menjaga etika tutur kata sopan saat berada di tanjung batu sakral"
      ],
      rituals: "Upacara syukuran laut Songkabala sebelum mengawali musim angin barat."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Bulukumba / Bira",
      temperature: 29,
      condition: "Cerah Berawan",
      humidity: 75,
      windSpeedKmh: 14,
      waveHeightMeters: 1.1,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Bira Underwater Snorkeling & Pinisi Culture Experience",
      organizer: "Komunitas Pemandu Bahari Tanjung Bira",
      duration: "1 Hari Penuh",
      priceIdr: 650000,
      priceUsd: 42,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    tags: ["Wisata Laut", "Bulukumba", "Pantai Bira", "Snorkeling", "Budaya Maritim"]
  },
  {
    id: "bulukumba-tanaberu",
    name: "Galangan Kapal Pinisi Tana Beru",
    subtitle: "Warisan Budaya Takbenda Dunia UNESCO Panrita Lopi",
    category: "budaya",
    province: "Sulawesi Selatan",
    coordinates: [-5.5412, 120.3789],
    subCategory: "Kriya Perkapalan Kayu Tradisional",
    agriculturalProducts: [
      "Kayu Ulin / Kayu Besi Hutan Pesisir",
      "Minyak Damar Alami Penyemat Lambung Kapal",
      "Kelapa Tua Bahan Tali Sabut Tradisional"
    ],
    traditionalAttire: {
      name: "Busana Pengrajin Pinisi & Sarung Lipa Saqbe",
      wastraType: "Sarung Tenun Motif Kotak Saqbe Bugis",
      headgear: "Passapu Patonro (Destar Kepala Tegak)",
      colors: ["#b45309", "#1e293b", "#dc2626"],
      significance: "Passapu yang diikat tegak melambangkan keberanian, keteguhan martabat (Siri' na Pacce), dan ketajaman intuisi Panrita Lopi dalam menaklukkan kayu besi."
    },
    culturalTraditions: [
      "Ritual Sakral Na'runtung Lopi (Peluncuran Kapal ke Laut)",
      "Upacara Annyorong Poti (Gotong Royong Ratusan Warga Menarik Kapal)",
      "Penghitungan Hari Baik Kitab Lontara Pabbura Lopi",
      "Mantra Doa Sambutan Kayu Pertama (Kalabiseang)"
    ],
    culturalEvents: [
      "Festival Pinisi Bulukumba (Prosesi Akbar Annyorong Poti)",
      "Karnaval Maestro Kayu Panrita Lopi"
    ],
    description: "Sentra pembuatan perahu layar Pinisi kayu terbesar di dunia. Para maestro perahu (Panrita Lopi) merakit kapal kayu megah seberat ratusan ton tanpa gambar teknik arsitektur dan tanpa paku besi, hanya berbekal perhitungan intuisi mistis, pasak kayu ulin, serta tradisi lisan turun-temurun berabad-abad.",
    historicalSignificance: "Ditetapkan UNESCO sebagai Warisan Budaya Takbenda Dunia (2017), saksi kejayaan maritim Nusantara yang mampu menjelajah hingga Madagaskar dan Vancouver.",
    etiquette: {
      dressCode: "Pakaian sopan tertutup, celana panjang atau kain sarung rapi.",
      taboos: [
        "Dilarang melangkahi lunas kapal (kalabiseang) yang sedang dirakit",
        "Dilarang memaku bahan perahu dengan sembarang logam besi",
        "Dilarang bersiul atau berkata kotor di atas galangan perahu"
      ],
      rituals: "Penyembelihan ayam jantan putih dan pemotongan lunas awal saat peletakan kayu perahu pertama."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Bulukumba / Bira",
      temperature: 29,
      condition: "Cerah Berawan",
      humidity: 74,
      windSpeedKmh: 12,
      waveHeightMeters: 0.8,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Masterclass Panrita Lopi & Galangan Pinisi Tana Beru",
      organizer: "Yayasan Pelestari Perahu Pinisi Nusantara",
      duration: "Setengah Hari",
      priceIdr: 450000,
      priceUsd: 29,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    tags: ["UNESCO", "Galangan Pinisi", "Bulukumba", "Panrita Lopi", "Budaya Tradisi"]
  },
  {
    id: "bulukumba-kajang",
    name: "Kawasan Adat Ammatoa Kajang & Hutan Borong Karamaka",
    subtitle: "Desa Adat Bersahaja Tanpa Listrik & Hutan Keramat",
    category: "desa",
    province: "Sulawesi Selatan",
    coordinates: [-5.3347, 120.1256],
    subCategory: "Masyarakat Adat & Konservasi Hutan",
    agriculturalProducts: [
      "Padi Ladang Organik Ase Pulu",
      "Pewarna Alami Daun Tarum (Indigofera Tinctoria)",
      "Kopi Tradisional Kajang Robusta",
      "Madu Hutan Rimba Karamaka",
      "Gula Aren Organik Tana Toa"
    ],
    traditionalAttire: {
      name: "Pakaian Serba Hitam Ilalang Embayya",
      wastraType: "Kain Tenun Tarum Hitam Tradisional Kajang",
      headgear: "Passapu Hitam Lipat Khas Kajang",
      colors: ["#000000"],
      significance: "Warna hitam polos melambangkan kesederhanaan mutlak, kesetaraan seluruh manusia di hadapan Turiek Akrana (Tuhan), dan pengingat bahwa manusia diciptakan dari tanah hitam serta akan kembali ke tanah."
    },
    culturalTraditions: [
      "Filosofi Pasang ri Kajang (Ajaran Konservasi Hutan & Moral Luhur)",
      "Prinsip Hidup Tallasa Kamase-mase (Hidup Sederhana Tanpa Keserakahan)",
      "Ritual Adat Andingingi (Mendinginkan dan Mensucikan Rimba Bumi)",
      "Hukum Adat Babbalasa (Denda Adat Pelanggaran Hutan)",
      "Larangan Penggunaan Listrik, Alas Kaki & Kendaraan Bermotor"
    ],
    culturalEvents: [
      "Upacara Adat Sakral Andingingi Borong Karamaka",
      "Musyawarah Adat Ammatoa Tanah Toa"
    ],
    description: "Masyarakat adat tertua di Sulawesi Selatan yang teguh menjaga kemurnian tradisi leluhur di dalam Hutan Keramat Borong Karamaka. Seluruh kawasan dalam terbebas dari jaringan listrik, jalan aspal, kendaraan bermotor, dan alas kaki. Dipimpin oleh pemimpin spiritual tertinggi bergelar Ammatoa.",
    historicalSignificance: "Kearifan konservasi hutan lindung tertua di Nusantara. Konsep hukum adat Pasang ri Kajang melarang pemotongan sebatang ranting pun di hutan larangan demi menjaga keseimbangan iklim dan sumber air bumi.",
    etiquette: {
      dressCode: "WAJIB mengenakan pakaian serba hitam (baju, celana/sarung hitam polos) dan MELEPAS ALAS KAKI sebelum melewati gerbang batu adat.",
      taboos: [
        "Dilarang membawa perangkat elektronik, kamera, handphone, atau lampu sorot ke kawasan dalam",
        "Dilarang menebang pohon, mencabut tanaman, atau berburu fauna di Hutan Borong Karamaka",
        "Dilarang mengenakan pakaian selain warna hitam pekat polos",
        "Dilarang mengenakan sandal atau sepatu jenis apapun di kawasan inti"
      ],
      rituals: "Memohon izin kepada Bohe Ammatoa dan meminum air kendi penerimaan tamu adat di rumah panggung Ammatoa."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Bulukumba / Bira",
      temperature: 26,
      condition: "Berawan",
      humidity: 82,
      windSpeedKmh: 9,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Spiritual Pilgrimage Ammatoa Kajang & Hutan Borong Karamaka",
      organizer: "Lembaga Adat Tanah Toa Kajang",
      duration: "1 Hari Penuh",
      priceIdr: 450000,
      priceUsd: 30,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    tags: ["Desa Adat", "Ammatoa Kajang", "Hutan Keramat", "Bulukumba", "Wastra Hitam"]
  },
  {
    id: "bulukumba-kahayya",
    name: "Puncak Donggia & Dataran Tinggi Kahayya",
    subtitle: "Wisata Gunung di Atas Awan & Sentra Kopi Arabika Lompobattang",
    category: "gunung",
    province: "Sulawesi Selatan",
    coordinates: [-5.3215, 119.9850],
    subCategory: "Dataran Tinggi & Agrowisata Kopi",
    agriculturalProducts: [
      "Kopi Arabika Kahayya Speciality (Single Origin)",
      "Kopi Robusta Lereng Gunung Lompobattang",
      "Sayur Mayur Dataran Tinggi Organik",
      "Madu Hutan Liar Kahayya"
    ],
    traditionalAttire: {
      name: "Busana Petani Kopi Dataran Tinggi & Sarung Lipa Bugis",
      wastraType: "Sarung Tenun Tebal Bugis Bonto Bahari",
      colors: ["#1e293b", "#0f766e", "#f59e0b"],
      significance: "Sarung tebal penghangat tubuh saat memetik buah ceri kopi merah di tengah dinginnya kabut lereng Lompobattang."
    },
    culturalTraditions: [
      "Tradisi Petik Merah Bersama Petani Kopi Kahayya",
      "Pesta Panen Doa Syukur Barzanji Lembah Bialo",
      "Sedekah Mata Air Pegunungan Lompobattang"
    ],
    culturalEvents: [
      "Kahayya Coffee Camp & Cultural Festival",
      "Gowes Jelajah Lembah Donggia"
    ],
    description: "Kawasan dataran tinggi berketinggian 1.400 mdpl di lereng selatan Gunung Lompobattang. Menyuguhkan panorama ngarai sungai Lembah Bialo yang spektakuler, lautan awan putih bergulung di pagi hari, serta hamparan kebun kopi organik yang sejuk.",
    historicalSignificance: "Sentra perkebunan kopi specialty yang dikembangkan dengan sistem agroforestri ramah lingkungan demi menjaga daerah tangkapan air hulu sungai utama Kabupaten Bulukumba.",
    etiquette: {
      dressCode: "Pakaian hangat / jaket gunung (suhu malam 15-18°C), celana trekking tertutup.",
      taboos: [
        "Dilarang membuang puntung rokok sembarangan di areal kebun kopi dan hutan pinus",
        "Dilarang memetik buah kopi yang masih hijau muda",
        "Dilarang mendirikan tenda di dekat tebing rawan longsor tanpa izin warga"
      ],
      rituals: "Doa syukur bersama petani kopi saat mengawali musim panen raya petik merah."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Bulukumba / Bira",
      temperature: 20,
      condition: "Cerah Berawan",
      humidity: 78,
      windSpeedKmh: 10,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Kahayya Highland Trekking, Cloud Sunrise & Coffee Cupping",
      organizer: "Koperasi Tani Kopi Kahayya",
      duration: "2 Hari 1 Malam",
      priceIdr: 520000,
      priceUsd: 34,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    tags: ["Wisata Gunung", "Kopi Kahayya", "Bulukumba", "Puncak Donggia", "Awan"]
  },
  {
    id: "bulukumba-apparalang",
    name: "Tebing Karang Apparalang & Gua Passea",
    subtitle: "Wisata Darat Tebing Karang Megah & Situs Peti Mati Kuno",
    category: "darat",
    province: "Sulawesi Selatan",
    coordinates: [-5.5684, 120.5052],
    subCategory: "Geoheritage & Arkeologi Goa",
    agriculturalProducts: [
      "Jambu Mete Bonto Bahari",
      "Kelapa Pesisir Kering",
      "Cengkeh Perbukitan Pesisir"
    ],
    traditionalAttire: {
      name: "Baju Adat Nelayan Pesisir Konjo",
      wastraType: "Kain Sarung Katun Corak Petak Laut",
      colors: ["#0284c7", "#1e293b"],
      significance: "Mencerminkan ketangguhan fisik dan kelincahan gerak masyarakat pesisir di atas tebing karang terjal."
    },
    culturalTraditions: [
      "Kearifan Menjaga Batuan Karang Tebing Keramat",
      "Legenda Cerita Rakyat Putri Apparalang",
      "Penghormatan Roh Leluhur Gua Passea (Duni Kayu Kuno)"
    ],
    culturalEvents: [
      "Atraksi Lompat Tebing Tradisional Bonto Bahari",
      "Pesta Nelayan Apparalang"
    ],
    description: "Gugusan tebing karang terjal dramatis yang menjulang 15-20 meter di atas laut toska kristal Laut Flores, berpadu dengan Gua Purba Passea yang menyimpan peti mati kayu kuno (duni) serta fosil prasejarah berumur ribuan tahun.",
    historicalSignificance: "Situs geo-heritage dan pemakaman purba megalitikum masyarakat Konjo purba sebelum masuknya pengaruh Islam ke Sulawesi Selatan.",
    etiquette: {
      dressCode: "Pakaian outdoor tertutup dan alas kaki anti-selip yang mencengkeram batu karang tajam.",
      taboos: [
        "Dilarang memanjat batuan karang terjal tanpa tali pengaman resmi",
        "Dilarang memindahkan atau merusak artefak peti mati kayu kuno di dalam Gua Passea",
        "Dilarang melompat ke laut saat ombak pasang tinggi"
      ],
      rituals: "Mengucapkan salam 'Tabe' Puang' saat memasuki kawasan gua keramat Passea."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Bulukumba / Bira",
      temperature: 30,
      condition: "Cerah",
      humidity: 72,
      windSpeedKmh: 15,
      waveHeightMeters: 1.3,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Apparalang Cliff Walking & Ancient Cave Discovery",
      organizer: "Kelompok Sadar Wisata Apparalang",
      duration: "Setengah Hari",
      priceIdr: 350000,
      priceUsd: 23,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
    tags: ["Wisata Darat", "Tebing Karang", "Apparalang", "Gua Passea", "Bulukumba"]
  },
  {
    id: "bulukumba-liukang",
    name: "Pulau Liukang Loe & Konservasi Terumbu Karang",
    subtitle: "Wisata Laut Suaka Penyu Hijau & Kerajinan Tenun Pesisir",
    category: "laut",
    province: "Sulawesi Selatan",
    coordinates: [-5.6120, 120.4285],
    subCategory: "Konservasi Bahari & Pulau Terluar",
    agriculturalProducts: [
      "Rumput Laut Kering Jemur Alami",
      "Ikan Kerapu Sunu Budidaya Karamba",
      "Kepiting Bakau Pesisir"
    ],
    traditionalAttire: {
      name: "Sarung Tenun Pesisir Liukang Loe",
      wastraType: "Tenun Gedogan Tradisional Benang Kapas",
      colors: ["#0284c7", "#059669", "#fbbf24"],
      significance: "Corak ombak laut dan lumba-lumba melambangkan jalinan erat antara perempuan perajin tenun dan mata pencaharian bahari keluarga."
    },
    culturalTraditions: [
      "Penangkaran dan Perlindungan Swadaya Sarang Penyu Hijau",
      "Transplantasi Terumbu Karang Berkelanjutan",
      "Tradisi Makan Bersama Ikan Bakar Parape di Tepi Pantai"
    ],
    culturalEvents: [
      "Pelepasliaran Tukik Penyu Hijau Liukang Loe",
      "Festival Bahari Liukang Loe"
    ],
    description: "Pulau kecil berpasir putih selembut sutra di seberang Tanjung Bira, suaka penangkaran penyu hijau, taman terumbu karang warna-warni, serta sentra perempuan penenun sarung tradisional pesisir.",
    historicalSignificance: "Titik persinggahan armada kapal saudagar laut Nusantara dan benteng alami penghalau gelombang badai ke teluk Bira.",
    etiquette: {
      dressCode: "Pakaian renang / rashguard sopan, kenakan baju saat menyusuri kampung pemukiman nelayan pulau.",
      taboos: [
        "Dilarang menginjak atau memegang karang hidup dan anemon laut",
        "Dilarang mengganggu atau menyentuh penyu liar saat berenang bebas",
        "Dilarang membawa cangkang kerang atau karang mati keluar dari pulau"
      ],
      rituals: "Doa pelepasan tukik ke laut lepas bersama sesepuh pulau."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Bulukumba / Bira",
      temperature: 29,
      condition: "Cerah Berawan",
      humidity: 73,
      windSpeedKmh: 12,
      waveHeightMeters: 1.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Liukang Loe Coral Snorkeling & Green Turtle Encounter",
      organizer: "Komunitas Konservasi Penyu Liukang",
      duration: "1 Hari Penuh",
      priceIdr: 480000,
      priceUsd: 31,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    tags: ["Wisata Laut", "Liukang Loe", "Penyu Hijau", "Bulukumba", "Terumbu Karang"]
  },
  {
    id: "bulukumba-tarum",
    name: "Sentra Wastra Tenun Tarum & Baju Bodo Bulukumba",
    subtitle: "Pakaian Adat Wastra Alami & Pewarnaan Daun Tarum Hitam",
    category: "pakaian",
    province: "Sulawesi Selatan",
    coordinates: [-5.4500, 120.2500],
    subCategory: "Sentra Kriya Wastra & Busana Tradisional",
    agriculturalProducts: [
      "Tanaman Nila Daun Tarum (Indigofera Tinctoria)",
      "Kapas Organik Kebun Rakyat",
      "Kulit Kayu Mahoni Pewarna Alami",
      "Kunyit & Daun Mangga Pewarna Kuning Tradisional"
    ],
    traditionalAttire: {
      name: "Baju Bodo Klasik & Sarung Tenun Tarum Hitam",
      wastraType: "Kain Tenun Gedogan Asli Pewarna Alami Daun Tarum",
      headgear: "Hiasan Sanggul Kembang Goyang Emas & Passapu Hitam",
      colors: ["#000000", "#1e3a8a", "#991b1b", "#d97706"],
      significance: "Warna pekat daun tarum yang difermentasi berhari-hari mencerminkan ketekunan, ketenangan batin, dan keagungan wastra tertua di tanah Sulawesi."
    },
    culturalTraditions: [
      "Teknik Menenun Tradisional Alat Gedogan Duduk",
      "Fermentasi Nabati Ekstrak Daun Tarum Segar",
      "Upacara Menenun Helai Pertama Gadis Desa"
    ],
    culturalEvents: [
      "Pameran Wastra Tenun Pewarna Alami Nusantara",
      "Parade Busana Baju Bodo Klasik Bulukumba"
    ],
    description: "Pusat edukasi dan pelestarian wastra tenun tradisional menggunakan pewarna nabati daun tarum dan tanaman hutan lokal. Mempertahankan alat tenun bukan mesin (gedogan) warisan leluhur yang menghasilkan kain berkilau eksotis dan tahan ratusan tahun.",
    historicalSignificance: "Jejak peradaban tekstil tertua di kawasan timur Indonesia yang telah dipakai kaum bangsawan Kerajaan Bone, Gowa, dan konfederasi Tellu Limpoe sejak abad ke-16.",
    etiquette: {
      dressCode: "Pakaian rapi dan sopan, hormati para ibu penenun yang sedang berkonsentrasi bekerja.",
      taboos: [
        "Dilarang melangkahi benang pakan tenun yang sedang diregangkan di alat gedogan",
        "Dilarang meneteskan bahan kimia atau cairan asam ke gentong fermentasi tarum alami"
      ],
      rituals: "Doa keselamatan dan pembakaran kemenyan wangi sebelum memasang gulungan benang tenun baru."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Bulukumba / Bira",
      temperature: 28,
      condition: "Cerah Berawan",
      humidity: 76,
      windSpeedKmh: 11,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Natural Indigo Tarum Weaving & Baju Bodo Heritage Workshop",
      organizer: "Sentra Penenun Wastra Alami Bulukumba",
      duration: "Setengah Hari",
      priceIdr: 320000,
      priceUsd: 21,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80",
    tags: ["Pakaian Adat", "Tenun Tarum", "Baju Bodo", "Bulukumba", "Wastra"]
  },
  {
    id: "bulukumba-perkebunan",
    name: "Agrowisata Perkebunan Karet & Kakao Palangisang",
    subtitle: "Hasil Pertanian Komoditas Ekspor & Sejarah Perkebunan Rakyat",
    category: "pertanian",
    province: "Sulawesi Selatan",
    coordinates: [-5.4120, 120.2180],
    subCategory: "Perkebunan & Agrowisata Komoditas",
    agriculturalProducts: [
      "Getah Karet Lateks Alami Kualitas Ekspor",
      "Biji Kakao Fermentasi Super",
      "Cengkeh Kering Bonto Bahari",
      "Kopi Robusta Rakyat"
    ],
    traditionalAttire: {
      name: "Pakaian Lapangan Penderes Karet Bugis",
      wastraType: "Kain Celana Sarung Penderes Bugis",
      headgear: "Caping Anyaman Daun Lontar",
      colors: ["#78350f", "#475569"],
      significance: "Praktis dan melindungi para pekebun dari tetesan getah lateks dan terik matahari di perkebunan rindang."
    },
    culturalTraditions: [
      "Tradisi Menyadap Lateks Subuh Hari",
      "Fermentasi Biji Kakao Alami Kotak Kayu",
      "Pesta Syukuran Panen Komoditas Mappadendang"
    ],
    culturalEvents: [
      "Festival Panen Kakao & Karet Bulukumba",
      "Pasar Tani Komoditas Rakyat Palangisang"
    ],
    description: "Kawasan perkebunan karet dan kakao seluas ribuan hektar yang memadukan jejak sejarah perkebunan dengan perkebunan rakyat produktif. Barisan pohon karet tua yang menjulang simetris membentuk terowongan hijau teduh yang fotogenik.",
    historicalSignificance: "Pilar ekonomi agraria Kabupaten Bulukumba sejak awal abad ke-20 yang menghubungkan komoditas perkebunan Sulawesi Selatan ke pasar komoditas dunia.",
    etiquette: {
      dressCode: "Pakaian lapangan berlengan panjang dan sepatu tertutup anti-selip.",
      taboos: [
        "Dilarang menyalakan api atau membuang puntung rokok sembarangan di areal kebun karet",
        "Dilarang merusak mangkuk penampung getah lateks sadapan petani"
      ],
      rituals: "Doa tolak bala bersama para pekerja kebun sebelum musim sadap getah raya."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Bulukumba / Bira",
      temperature: 28,
      condition: "Cerah Berawan",
      humidity: 75,
      windSpeedKmh: 10,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Rubber Tapping & Cocoa Bean to Bar Artisan Experience",
      organizer: "Kelompok Tani Perkebunan Palangisang",
      duration: "Setengah Hari",
      priceIdr: 280000,
      priceUsd: 18,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d69102a56?auto=format&fit=crop&w=800&q=80",
    tags: ["Hasil Pertanian", "Karet", "Kakao", "Bulukumba", "Agrowisata"]
  },

  // ==========================================
  // LAMPUNG (SUMATERA) — PINTU GERBANG SUMATERA & BUMI RUWA JURAI
  // ==========================================
  {
    id: "lampung-kiluan",
    name: "Teluk Kiluan & Laguna Karang Gayau",
    subtitle: "Wisata Bahari Ratusan Lumba-Lumba Samudera & Kolam Alami",
    category: "laut",
    province: "Lampung",
    coordinates: [-5.7719, 105.0886],
    subCategory: "Wisata Bahari & Suaka Lumba-Lumba",
    agriculturalProducts: [
      "Kopi Robusta Lereng Pegunungan Tanggamus",
      "Pisang Mas Tanggamus Organik",
      "Kakao Rakyat Kualitas Ekspor",
      "Kelapa Pesisir Segar"
    ],
    traditionalAttire: {
      name: "Pakaian Adat Pesisir Saibatin Lampung",
      wastraType: "Kain Inuh Tenun Ikat Sutra Pakan Pesisir",
      headgear: "Kikat Pesisir Saibatin Belanga Emas",
      colors: ["#dc2626", "#d97706", "#1e293b"],
      significance: "Kain Inuh dengan motif perahu dan cumi melambangkan peradaban agung masyarakat adat pesisir Saibatin yang hidup selaras dengan gelombang samudra."
    },
    culturalTraditions: [
      "Tradisi Ngambur Lumba-Lumba (Menghormati Mamalia Laut)",
      "Upacara Sedekah Laut Saibatin Teluk Semaka",
      "Tarian Pesisir Hadra & Kesenian Melinting"
    ],
    culturalEvents: [
      "Festival Teluk Semaka Tanggamus",
      "Parade Jukung Nelayan Kiluan"
    ],
    description: "Teluk eksotis di barat daya Lampung, habitat alami kawanan ratusan lumba-lumba paruh panjang (spinner dolphin) dan lumba-lumba hidung botol yang melompat bebas di laut lepas menyambut matahari terbit. Di balik bukit karang tersembunyi kolam laguna alami Laguna Gayau berair jernih toska yang diapit karang terjal.",
    historicalSignificance: "Jalur migrasi mamalia laut penting di Selat Sunda dan Samudera Hindia yang dijaga kearifan lokal nelayan Saibatin tanpa perburuan komersial.",
    etiquette: {
      dressCode: "Life-jacket wajib dikenakan di perahu jukung tradisional nelayan, kenakan pakaian santun saat di darat.",
      taboos: [
        "Dilarang memberi makan buatan atau melompat menyentuh lumba-lumba liar",
        "Dilarang membuang sampah plastik atau botol air ke perairan teluk",
        "Dilarang memutar musik keras di perahu saat berada di dekat kawanan lumba-lumba"
      ],
      rituals: "Doa keselamatan laut bersama juru mudi jukung sebelum bertolak mengejar sunrise."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Panjang / Tanggamus",
      temperature: 29,
      condition: "Cerah Berawan",
      humidity: 74,
      windSpeedKmh: 14,
      waveHeightMeters: 1.4,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Wild Dolphin Safari, Jukung Cruise & Gayau Lagoon Trek",
      organizer: "Kelompok Sadar Wisata Teluk Kiluan",
      duration: "1 Hari Penuh",
      priceIdr: 580000,
      priceUsd: 38,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    tags: ["Wisata Laut", "Teluk Kiluan", "Lumba-Lumba", "Lampung", "Laguna Gayau"]
  },
  {
    id: "lampung-waykambas",
    name: "Taman Nasional Way Kambas & Suaka Gajah",
    subtitle: "Wisata Hutan Konservasi Gajah Sumatera & Badak Bercula Dua",
    category: "hutan",
    province: "Lampung",
    coordinates: [-5.0833, 105.7833],
    subCategory: "Taman Nasional & Konservasi Rimba",
    agriculturalProducts: [
      "Lada Hitam Lampung Timur Super (Black Gold)",
      "Singkong Gajah Industri Organik",
      "Madu Hutan Lebah Odeng Way Kambas",
      "Beras Organik Way Jepara"
    ],
    traditionalAttire: {
      name: "Busana Pembina Satwa & Tapis Lampung Timur",
      wastraType: "Kain Tapis Motif Gajah & Belah Ketupat",
      headgear: "Kikat Belanga Lampung Pepadun",
      colors: ["#78350f", "#d97706", "#047857"],
      significance: "Motif gajah pada kain tapis melambangkan kebijaksanaan, ketenangan, dan kekuatan pelindung rimba raya Sumatera."
    },
    culturalTraditions: [
      "Kearifan Mahout (Pawang Gajah) Tradisional Sumatera",
      "Upacara Ruwat Hutan Lindung Way Kambas",
      "Tari Tradisional Cetik & Gamolan Pekhing Lampung"
    ],
    culturalEvents: [
      "Festival Way Kambas (Tahunan)",
      "Pawai Konservasi Gajah Sumatera"
    ],
    description: "Hutan hujan tropis dataran rendah seluas 125.000 hektar di pesisir timur Lampung. Benteng perlindungan utama Gajah Sumatera (Elephas maximus sumatranus), Badak Sumatera bercula dua di Suaka Rhino Sumatera (SRS), Harimau Sumatera, tapir, serta ratusan spesies burung langka.",
    historicalSignificance: "Taman nasional tertua di Sumatera (ditetapkan sejak 1937) dan Pusat Pelatihan Gajah pertama di Indonesia yang kini bertransformasi menjadi suaka konservasi dan penyelamatan satwa endemik dunia.",
    etiquette: {
      dressCode: "Pakaian safari lapangan warna bumi (khaki/hijau tua), sepatu trekking tertutup tahan lumpur.",
      taboos: [
        "Dilarang menaiki punggung gajah tanpa instruksi resmi dokter hewan/pawang",
        "Dilarang merokok atau menyalakan api di zona hutan rawa dataran rendah",
        "Dilarang mendekati gajah liar tanpa didampingi mahout resmi"
      ],
      rituals: "Penghormatan kepada sesepuh rimba sebelum ekspedisi observasi gajah malam hari."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Radin Inten II Lampung",
      temperature: 28,
      condition: "Berawan",
      humidity: 78,
      windSpeedKmh: 10,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Elephant Conservation Experience & Savannah Jungle Safari",
      organizer: "Sahabat Way Kambas & Balai Taman Nasional",
      duration: "1 Hari Penuh",
      priceIdr: 600000,
      priceUsd: 39,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80",
    tags: ["Wisata Hutan", "Way Kambas", "Gajah Sumatera", "Lampung", "Konservasi"]
  },
  {
    id: "lampung-krakatau",
    name: "Cagar Alam Vulkanik Gunung Anak Krakatau",
    subtitle: "Wisata Gunung Api Laut Legendaris Dunia & Laboratorium Alam",
    category: "gunung",
    province: "Lampung",
    coordinates: [-6.1025, 105.4230],
    subCategory: "Vulkanologi Bahari & Geowisata",
    agriculturalProducts: [
      "Kelapa Laut Pulau Sebesi",
      "Ikan Tenggiri Segar Selat Sunda",
      "Pisang Raja Pesisir Rajabasa"
    ],
    traditionalAttire: {
      name: "Busana Pelaut Selat Sunda & Selendang Tapis Laut",
      wastraType: "Selendang Tapis Kapal Berornamen Emas",
      headgear: "Destar Tali Emas Pesisir",
      colors: ["#991b1b", "#d97706", "#1e293b"],
      significance: "Menggambarkan ketangguhan jiwa manusia dalam menghadapi amarah deburan vulkanik dan gelombang laut Selat Sunda."
    },
    culturalTraditions: [
      "Ekspedisi Sejarah Mengenang Letusan Kataklismik 1883",
      "Ruwat Laut Selat Sunda Masyarakat Pesisir Rajabasa",
      "Tari Bedana Krakatau"
    ],
    culturalEvents: [
      "Lampung Krakatau Festival (LKF)",
      "Tour de Krakatau Bahari Selat Sunda"
    ],
    description: "Gunung api aktif yang muncul dari kaldera laut raksasa sisa letusan dahsyat 1883 di Selat Sunda. Dikelilingi Pulau Rakata, Sertung, dan Pulau Panjang dengan pantai berpasir vulkanik hitam eksotis, terumbu karang laut vulkanik, dan kepulan asap kawah magis.",
    historicalSignificance: "Monumen vulkanologi dunia saksi letusan kataklismik 1883 yang dentumannya terdengar hingga 4.800 km di Australia dan menurunkan suhu atmosfer bumi hingga 1,2°C.",
    etiquette: {
      dressCode: "Pakaian outdoor ringan anti-angin, kacamata pelindung debu belerang, masker, dan sepatu trekking tahan panas.",
      taboos: [
        "Dilarang mendekati bibir kawah aktif bila status PVMBG/BMKG berada di level Waspada/Siaga",
        "Dilarang mengambil batu apung atau batuan vulkanik cagar alam untuk cinderamata",
        "Dilarang menyalakan api unggun sembarangan di pulau konservasi"
      ],
      rituals: "Doa tolak bala bersama nakhoda saat kapal melintasi Selat Sunda menuju kaldera Krakatau."
    },
    bmkgStation: {
      name: "Stasiun Geofisika Kalianda / Selat Sunda",
      temperature: 29,
      condition: "Cerah Berawan",
      humidity: 76,
      windSpeedKmh: 16,
      waveHeightMeters: 1.5,
      safetyStatus: "WASPADA"
    },
    tripPackage: {
      title: "Krakatau Volcanic Boat Expedition & Coral Snorkeling",
      organizer: "Krakatau Sea Expedition Team",
      duration: "1 Hari Penuh",
      priceIdr: 950000,
      priceUsd: 62,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tags: ["Wisata Gunung", "Krakatau", "Selat Sunda", "Lampung", "Vulkanik"]
  },
  {
    id: "lampung-pugung",
    name: "Taman Purbakala Pugung Raharjo",
    subtitle: "Wisata Darat Punden Berundak Megalitikum & Benteng Parit Purba",
    category: "darat",
    province: "Lampung",
    coordinates: [-5.1956, 105.5786],
    subCategory: "Situs Sejarah & Arkeologi Megalitikum",
    agriculturalProducts: [
      "Lada Hitam Pugung Raharjo",
      "Kopi Robusta Dataran Rendah",
      "Kelapa Hibrida",
      "Singkong Manis Lampung Timur"
    ],
    traditionalAttire: {
      name: "Pakaian Adat Kebesaran Pepadun Lampung Timur",
      wastraType: "Kain Tapis Balak Bertabur Manik Kaca Kuno",
      headgear: "Kopiah Emas Pepadun Khas Tetua Adat",
      colors: ["#d97706", "#ffffff", "#000000"],
      significance: "Kain Tapis Balak dikenakan oleh tetua adat dalam musyawarah Sesat Agung, melambangkan kebijaksanaan dan kemurnian hukum adat."
    },
    culturalTraditions: [
      "Musyawarah Kerapatan Adat Marga Sekampung",
      "Ritual Bersih Desa Sedekah Bumi Megalitikum",
      "Tari Tradisional Melinting Klasik Lampung"
    ],
    culturalEvents: [
      "Festival Megalitikum Pugung Raharjo",
      "Pesta Panen Raya Lampung Timur"
    ],
    description: "Situs arkeologi prasejarah terluas di Sumatera (30 hektar) yang memuat punden berundak dari era megalitikum 2500 SM, menhir batu kandang, arca megalitik, dolmen meja sesaji, serta benteng tanah parit purba peninggalan era klasik Hindu-Buddha dan Islam.",
    historicalSignificance: "Bukti kesinambungan peradaban tertua di Lampung yang memperlihatkan keharmonisan peradaban zaman batu besar, kerajaan Hindu-Buddha, hingga masa Islam.",
    etiquette: {
      dressCode: "Pakaian sopan rapi dan tertutup, gunakan sepatu jalan yang nyaman.",
      taboos: [
        "Dilarang memanjat atau menduduki batuan punden berundak dan menhir megalitik",
        "Dilarang mencoret-coret batuan atau menggali tanah benteng purba",
        "Dilarang berkata sombong atau mencemari kolam mata air bertuah purba"
      ],
      rituals: "Membasuh wajah di kolam pemandian batu bertuah purbakala untuk membersihkan energi negatif."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Radin Inten II Lampung",
      temperature: 30,
      condition: "Cerah Berawan",
      humidity: 73,
      windSpeedKmh: 11,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Ancient Megalithic Trail & Cultural Heritage Discovery",
      organizer: "Kelompok Sadar Sejarah Pugung Raharjo",
      duration: "Setengah Hari",
      priceIdr: 320000,
      priceUsd: 21,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80",
    tags: ["Wisata Darat", "Megalitikum", "Pugung Raharjo", "Lampung", "Sejarah"]
  },
  {
    id: "lampung-tapis",
    name: "Sentra Kriya Kain Tapis & Mahkota Siger Olok Gading",
    subtitle: "Pakaian Adat Wastra Sulam Benang Emas & Mahkota 9 Lekuk",
    category: "pakaian",
    province: "Lampung",
    coordinates: [-5.4412, 105.2420],
    subCategory: "Sentra Kriya Wastra & Busana Tradisional",
    agriculturalProducts: [
      "Kapas Alami",
      "Pewarna Kulit Kayu Bakau & Kayu Secang Alami",
      "Benang Emas & Manik Kaca Tradisional"
    ],
    traditionalAttire: {
      name: "Busana Agung Pengantin Lampung dengan Mahkota Siger",
      wastraType: "Kain Tapis Jung Sarat Benang Emas Asli",
      headgear: "Mahkota Emas Siger 9 Lekuk (Pepadun) / 7 Lekuk (Saibatin)",
      colors: ["#d97706", "#ffffff", "#dc2626", "#000000"],
      significance: "Siger 9 lekuk melambangkan sembilan marga Abung Siwo Mego. Tapis Jung Sarat yang disulam benang emas dengan teknik cucuk melambangkan kemewahan, kesucian budi pekerti, dan martabat luhur perempuan Lampung (Piil Pesenggiri)."
    },
    culturalTraditions: [
      "Tradisi Menyulam Tapis dengan Teknik Cucuk Tangan",
      "Penempaan Tradisional Kuningan Mahkota Emas Siger",
      "Tarian Sembah Penyambutan Tamu Kehormatan Sigeh Penguten"
    ],
    culturalEvents: [
      "Parade Wastra Tapis Lampung Nusantara",
      "Pameran Kriya Kencana Siger Lampung"
    ],
    description: "Pusat pelestarian dan penenunan wastra tenun sulam benang emas legendaris khas Lampung. Setiap lembar kain Tapis dikerjakan secara teliti dengan tangan selama 2 hingga 6 bulan menggunakan benang emas murni dengan ragam motif perahu kosmis dan flora alam Sumatera.",
    historicalSignificance: "Wastra agung bernilai tinggi yang menjadi simbol strata kehormatan bangsawan, pusaka keluarga turun-temurun, serta mahakarya Warisan Budaya Takbenda Indonesia.",
    etiquette: {
      dressCode: "Pakaian sopan rapi, hormati para ibu perajin yang sedang menyulam benang emas halus.",
      taboos: [
        "Dilarang meletakkan kain Tapis dan Mahkota Siger di lantai tanpa alas kain suci",
        "Dilarang menarik atau menyentuh benang emas dengan tangan basah atau berminyak"
      ],
      rituals: "Doa kelancaran menenun sebelum mengawali sulaman helai pertama motif Jung Sarat."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Radin Inten II Lampung",
      temperature: 30,
      condition: "Cerah",
      humidity: 71,
      windSpeedKmh: 12,
      waveHeightMeters: 0.8,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Royal Tapis Weaving Masterclass & Siger Studio Experience",
      organizer: "Sanggar Wastra Tapis Olok Gading",
      duration: "Setengah Hari",
      priceIdr: 450000,
      priceUsd: 30,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80",
    tags: ["Pakaian Adat", "Kain Tapis", "Siger", "Lampung", "Wastra Emas"]
  },
  {
    id: "lampung-liwa",
    name: "Kebun Kopi Robusta Liwa & Lembah Sekincau",
    subtitle: "Hasil Pertanian Kopi Robusta Terbaik & Wisata Dataran Tinggi",
    category: "pertanian",
    province: "Lampung",
    coordinates: [-5.0350, 104.0500],
    subCategory: "Perkebunan & Agrowisata Kopi",
    agriculturalProducts: [
      "Kopi Robusta Liwa Indikasi Geografis (IG)",
      "Kopi Luwak Liar Liwa",
      "Lada Hitam Lampung Barat",
      "Sayur Mayur Dingin Sekincau"
    ],
    traditionalAttire: {
      name: "Pakaian Petani Kopi Liwa & Sarung Celugam",
      wastraType: "Kain Celugam Tradisional Lampung Barat",
      headgear: "Kikat Songkok Khas Liwa",
      colors: ["#dc2626", "#000000", "#d97706"],
      significance: "Kain Celugam dengan motif geometris kotak jingga-merah-hitam melambangkan ketahanan hidup, semangat membara, dan kegigihan petani di kaki Bukit Barisan."
    },
    culturalTraditions: [
      "Pesta Budaya Topeng Kayu Sekura Cakak Buah",
      "Tradisi Nyambang Kopi Bersama Warga Kampung",
      "Petik Merah Ceri Kopi Robusta Lembah Sekincau"
    ],
    culturalEvents: [
      "Pesta Budaya Sekura Lampung Barat (Setiap Pekan Syawal)",
      "Festival Kopi Lampung Barat (Liwa Coffee Festival)"
    ],
    description: "Kawasan perbukitan sejuk berketinggian 900–1.200 mdpl di Lampung Barat. Pusat perkebunan kopi robusta terbesar di Indonesia dengan aroma harum cokelat, rempah, dan body tebal yang memenangkan penghargaan cita rasa kopi internasional.",
    historicalSignificance: "Lumbung penghasil lebih dari 60% pasokan kopi robusta ekspor Indonesia yang dibudidayakan secara turun-temurun oleh masyarakat adat Saibatin sejak zaman kolonial.",
    etiquette: {
      dressCode: "Pakaian hangat / jaket nyaman untuk iklim pegunungan berkabut (18–22°C).",
      taboos: [
        "Dilarang memetik buah kopi yang masih hijau muda",
        "Dilarang merusak pohon penaung alami seperti lamtoro dan dadap di kebun kopi"
      ],
      rituals: "Upacara syukuran panen raya bersama tetua adat Marga Liwa."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Radin Inten II Lampung",
      temperature: 21,
      condition: "Cerah Berawan",
      humidity: 80,
      windSpeedKmh: 9,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Liwa Robusta Coffee Harvest, Cupping & Sekura Mask Trail",
      organizer: "Koperasi Kopi Robusta Liwa Lestari",
      duration: "1 Hari Penuh",
      priceIdr: 480000,
      priceUsd: 32,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    tags: ["Hasil Pertanian", "Kopi Liwa", "Lampung Barat", "Kain Celugam", "Sekura"]
  },
  {
    id: "lampung-gigahiu",
    name: "Pantai Gigi Hiu & Karang Pegadungan",
    subtitle: "Wisata Bahari Gugusan Karang Runcing Samudera Hindia",
    category: "laut",
    province: "Lampung",
    coordinates: [-5.7583, 105.0483],
    subCategory: "Geoheritage Pesisir & Lanskap Alami",
    agriculturalProducts: [
      "Kelapa Pesisir Kelumbayan Tanggamus",
      "Ikan Karang Kerapu & Kakap Merah",
      "Cengkeh Tanggamus Pesisir"
    ],
    traditionalAttire: {
      name: "Pakaian Nelayan Tanggamus & Kain Ikat Pesisir",
      wastraType: "Kain Pesisir Sabuk Hitam Emas",
      headgear: "Kikat Destar Pelaut Tanggamus",
      colors: ["#1e293b", "#d97706"],
      significance: "Melambangkan keteguhan jiwa menghadapi deburan ombak Samudera Hindia yang ganas."
    },
    culturalTraditions: [
      "Kearifan Bahari Tradisional Nelayan Kelumbayan",
      "Cerita Rakyat Batu Layar Pegadungan Tanggamus"
    ],
    culturalEvents: [
      "Festival Bahari Teluk Pegadungan",
      "Ekspedisi Fotografi Lanskap Gigi Hiu"
    ],
    description: "Pantai dengan formasi batuan geologis paling dramatis di Indonesia. Ratusan gugusan batu karang menjulang runcing setinggi 5 hingga 10 meter menyerupai deretan gigi ikan hiu purba yang dihantam deburan ombak Samudera Hindia.",
    historicalSignificance: "Formasi geologis batuan vulkanik sedimen purba hasil gesekan lempeng tektonik Indo-Australia jutaan tahun lampau.",
    etiquette: {
      dressCode: "Sepatu trekking outdoor kuat dan anti-licin, celana panjang praktis.",
      taboos: [
        "SANGAT DILARANG BERENANG karena ombak Samudera Hindia sangat ganas dan memiliki arus bawah yang kuat",
        "Dilarang memanjat karang runcing saat gelombang laut sedang pasang tinggi",
        "Dilarang membuang sampah sisa makanan di celah batuan karang"
      ],
      rituals: "Menyapa juru kunci pantai dan memanjatkan doa keselamatan sebelum menyusuri bibir karang."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Panjang / Tanggamus",
      temperature: 29,
      condition: "Cerah Berawan",
      humidity: 75,
      windSpeedKmh: 18,
      waveHeightMeters: 2.2,
      safetyStatus: "WASPADA"
    },
    tripPackage: {
      title: "Gigi Hiu Dramatic Photography & Coastal Geology Trail",
      organizer: "Pokdarwis Pantai Gigi Hiu Tanggamus",
      duration: "1 Hari Penuh",
      priceIdr: 520000,
      priceUsd: 34,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    tags: ["Wisata Laut", "Gigi Hiu", "Tanggamus", "Lampung", "Geowisata"]
  },
  {
    id: "lampung-desaadatsesat",
    name: "Kampung Tua Adat Kesugihan & Nuwo Sesat",
    subtitle: "Desa Adat Rumah Panggung Kayu & Falsafah Piil Pesenggiri",
    category: "desa",
    province: "Lampung",
    coordinates: [-5.1500, 105.2000],
    subCategory: "Perkampungan Adat & Arsitektur Vernakular",
    agriculturalProducts: [
      "Lada Perdu Lampung",
      "Kopi Robusta Rumah Panggung",
      "Ketan Hitam Tradisional",
      "Gula Merah Aren Murni"
    ],
    traditionalAttire: {
      name: "Pakaian Kebesaran Adat Begawi Cakak Pepadun",
      wastraType: "Kain Tapis Kuno & Selempang Jung Sarat",
      headgear: "Siger Emas 9 Lekuk & Kopiah Mas Berambu Emas",
      colors: ["#d97706", "#ffffff", "#dc2626"],
      significance: "Melambangkan martabat luhur, keluhuran budi, dan tanggung jawab memimpin masyarakat adat dalam koridor nilai Piil Pesenggiri."
    },
    culturalTraditions: [
      "Upacara Adat Agung Begawi Cakak Pepadun (Kenaikan Tahta Gelar Adat)",
      "Falsafah Piil Pesenggiri (Nemui Nyimah, Nengah Nyappur, Sakai Sambayan)",
      "Tari Cangget Pepadun & Tabuhan Gamelan Tala Balak"
    ],
    culturalEvents: [
      "Begawi Adat Penganugerahan Gelar Sutan",
      "Festival Budaya Cangget Agung Lampung"
    ],
    description: "Desa adat perkampungan tua yang melestarikan puluhan rumah panggung kayu bertiang kokoh (Nuwo Sesat dan Nuwo Balak) dengan ukiran ornamen tradisional Lampung. Pusat penyelenggaraan upacara Begawi Cakak Pepadun untuk penganugerahan gelar kehormatan adat.",
    historicalSignificance: "Pusat tata musyawarah adat Pepadun yang demokratis, di mana setiap warga berkesempatan meraih gelar kehormatan adat melalui karya baktinya kepada masyarakat.",
    etiquette: {
      dressCode: "Pakaian sopan tertutup, wajib membuka alas kaki sebelum menaiki tangga panggung Nuwo Sesat.",
      taboos: [
        "Dilarang melangkah mendahului tetua adat Sutan di balai musyawarah sesat",
        "Dilarang merokok di dalam rumah kayu panggung bersejarah",
        "Dilarang mengambil foto saat prosesi penganugerahan gelar rahasia tanpa izin"
      ],
      rituals: "Prosesi penyerahan sirih pinang (nemui nyimah) kepada pemangku adat saat awal bertamu."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Radin Inten II Lampung",
      temperature: 29,
      condition: "Cerah",
      humidity: 73,
      windSpeedKmh: 11,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Living Heritage: Begawi Culture & Nuwo Sesat Homestay",
      organizer: "Lembaga Adat Pepadun Kesugihan",
      duration: "1 Hari Penuh",
      priceIdr: 420000,
      priceUsd: 28,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    tags: ["Desa Adat", "Nuwo Sesat", "Lampung", "Pepadun", "Begawi"]
  },
  {
    id: "lampung-ladahitam",
    name: "Sentra Lada Hitam Sukadana (The Black Gold)",
    subtitle: "Hasil Pertanian Rempah Legendaris & Agrowisata Lada Lampung",
    category: "pertanian",
    province: "Lampung",
    coordinates: [-5.0800, 105.5400],
    subCategory: "Perkebunan Rempah Sejarah",
    agriculturalProducts: [
      "Lada Hitam Lampung (Black Pepper) Super",
      "Lada Putih Olahan Alami",
      "Minyak Atsiri Lada Hitam Murni",
      "Pala & Cengkeh Sukadana"
    ],
    traditionalAttire: {
      name: "Pakaian Panen Rempah Lampung Timur",
      wastraType: "Kain Celana Sarung Pesisir Sabuk Emas",
      headgear: "Kikat Anyaman Daun Rumbia",
      colors: ["#78350f", "#000000", "#d97706"],
      significance: "Menghormati kerja keras petani yang menjaga kemasyhuran rempah hitam Lampung sejak ratusan tahun silam."
    },
    culturalTraditions: [
      "Tradisi Panen Raya Lada Hitam Sukadana",
      "Penjemuran Alami Biji Lada di Bawah Matahari Terik",
      "Kesenian Musik Tradisional Bambu Gamolan"
    ],
    culturalEvents: [
      "Festival Lada Hitam Lampung (Black Pepper Fest)",
      "Pameran Jalur Rempah Nusantara"
    ],
    description: "Kawasan perkebunan lada hitam terluas di pesisir timur Lampung. Komoditas rempah legendaris 'The Black Gold' yang memiliki tingkat kepedasan piperin tinggi serta aroma tajam khas yang diperebutkan saudagar rempah Venesia, Arab, dan Eropa sejak abad ke-16.",
    historicalSignificance: "Ikon identitas agraria bersejarah Lampung yang tercatat dalam peta perdagangan rempah maritim dunia sebagai produsen lada hitam terbaik di kawasan Asia.",
    etiquette: {
      dressCode: "Pakaian lapangan katun sejuk berlengan panjang dan topi pelindung matahari.",
      taboos: [
        "Dilarang mematahkan tiang panjat sulur pohon lada saat menyusuri kebun",
        "Dilarang menginjak hamparan biji lada yang sedang dijemur di pelataran"
      ],
      rituals: "Doa tolak hama bersama kelompok tani sebelum musim pembungaan pohon lada."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Radin Inten II Lampung",
      temperature: 30,
      condition: "Cerah",
      humidity: 72,
      windSpeedKmh: 12,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Black Pepper Spice Trail: Harvest to Peppercorn Cupping",
      organizer: "Asosiasi Petani Lada Hitam Sukadana",
      duration: "Setengah Hari",
      priceIdr: 300000,
      priceUsd: 20,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d69102a56?auto=format&fit=crop&w=800&q=80",
    tags: ["Hasil Pertanian", "Lada Hitam", "Lampung Timur", "Black Pepper", "Rempah"]
  },
  {
    id: "lampung-hutanbukitbarisan",
    name: "Taman Nasional Bukit Barisan Selatan (TNBBS)",
    subtitle: "Wisata Hutan Hujan Tropis UNESCO & Konservasi Damar Krui",
    category: "hutan",
    province: "Lampung",
    coordinates: [-5.4500, 104.3500],
    subCategory: "Warisan Dunia UNESCO & Konservasi Rimba",
    agriculturalProducts: [
      "Getah Damar Mata Kucing Asli Krui (Agroforestri Repong Damar)",
      "Kayu Gaharu Alami",
      "Madu Rimba Liar Bukit Barisan"
    ],
    traditionalAttire: {
      name: "Pakaian Penjelajah Rimba Adat Pesisir Barat",
      wastraType: "Kain Tenun Pesisir Barat",
      headgear: "Tudung Pelindung Anyaman Daun Pandan Rimba",
      colors: ["#065f46", "#78350f"],
      significance: "Melambangkan harmoni abadi antara manusia dan rimba belantara Bukit Barisan."
    },
    culturalTraditions: [
      "Tradisi Panjat Pohon Damar 30 Meter Tanpa Tali Pengaman (Repong Damar)",
      "Kearifan Adat Hutan Larangan Saibatin",
      "Hukum Adat Perlindungan Satwa Belang (Harimau Sumatera)"
    ],
    culturalEvents: [
      "Festival Damar Krui Pesisir Barat",
      "Jambore Konservasi Hutan Tropis TNBBS"
    ],
    description: "Kawasan konservasi hutan hujan tropis terluas di selatan Pulau Sumatera yang masuk dalam jajaran UNESCO Tropical Rainforest Heritage of Sumatra. Suaka alami Harimau Sumatera, tapir, gajah, serta habitat mekarnya bunga raksasa langka Rafflesia arnoldii dan Amorphophallus titanum.",
    historicalSignificance: "Pusat ekosistem hutan hujan primer dunia dan rumah bagi budidaya agroforestri damar tertua di dunia (Repong Damar) yang diakui FAO dan UNESCO.",
    etiquette: {
      dressCode: "Pakaian jungle trekking lengkap, gaiter anti-pacet/lintah, dan sepatu trekking tahan lumpur.",
      taboos: [
        "Dilarang berburu satwa liar atau menebang pohon damar repong adat",
        "Dilarang membuang sampah anorganik sekecil apapun di dalam jalur rimba",
        "Dilarang membuat suara bising atau memisahkan diri dari ranger resmi"
      ],
      rituals: "Ritual permisi 'Tabik Pun' kepada leluhur rimba sebelum memasuki pos patroli hutan primer."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Panjang / Tanggamus",
      temperature: 24,
      condition: "Hujan Ringan",
      humidity: 84,
      windSpeedKmh: 9,
      waveHeightMeters: 0.0,
      safetyStatus: "WASPADA"
    },
    tripPackage: {
      title: "TNBBS Deep Jungle Trek & Giant Rafflesia Flower Hunt",
      organizer: "Ranger Konservasi TNBBS Pesisir Barat",
      duration: "1 Hari Penuh",
      priceIdr: 750000,
      priceUsd: 49,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    tags: ["Wisata Hutan", "TNBBS", "Rafflesia", "Repong Damar", "Lampung", "Flora Fauna"]
  },

  // ==========================================
  // BALI — PULAU DEWATA (SUBAK & USADA HERBAL)
  // ==========================================
  {
    id: "bali-jatiluwih",
    name: "Sawah Terasering Jatiluwih & Subak",
    subtitle: "Sistem Agrikultur Organik Warisan Dunia UNESCO",
    category: "pertanian",
    province: "Bali",
    coordinates: [-8.3697, 115.1311],
    subCategory: "Pertanian & Perkebunan Organik",
    agriculturalProducts: [
      "Beras Merah Organik Jatiluwih (Oryza sativa)",
      "Kopi Robusta Pupuan",
      "Cengkih & Bunga Jepun Bali",
      "Kakao Fermentasi Tabanan"
    ],
    traditionalAttire: {
      name: "Busana Adat Madya Petani Subak Bali",
      wastraType: "Kain Kamen Endek Bali & Selendang Senteng",
      headgear: "Udeng Putih Lembaran Leluhur",
      colors: ["#ffffff", "#b45309", "#047857"],
      significance: "Kain putih dan udeng melambangkan kejernihan pikiran dalam memelihara keseimbangan air dan bumi berdasarkan Tri Hita Karana."
    },
    culturalTraditions: [
      "Sistem Tata Kelola Air Pertanian Subak Sejak Abad ke-9",
      "Ritual Ngusaba Nini di Pura Ulun Danu Beratan",
      "Falsafah Tri Hita Karana (Harmoni Tuhan, Manusia, dan Alam)"
    ],
    culturalEvents: [
      "Jatiluwih Agriculture Festival",
      "Pesta Kesenian Bali (PKB)"
    ],
    description: "Bentang terasering persawahan seluas ratusan hektar di lereng Gunung Batukaru yang menerapkan sistem irigasi demokratis Subak warisan dunia UNESCO. Sentra penghasil beras merah organik kualitas ekspor dan percontohan pertanian berkelanjutan Nusantara.",
    historicalSignificance: "Ditetapkan sebagai Warisan Budaya Dunia UNESCO pada 2012 atas kelestarian sistem irigasi Subak yang telah bertahan lebih dari 1.000 tahun.",
    etiquette: {
      dressCode: "Mengenakan selendang kain Kamen saat melintasi area pura subak.",
      taboos: [
        "Dilarang merusak pematang sawah dan saluran irigasi subak",
        "Dilarang membuang sampah sisa konsumsi ke mata air suci",
        "Dilarang melangkah di atas sesajen canang sari yang diletakkan di persawahan"
      ],
      rituals: "Ritual persembahan Bhatari Sri sebelum prosesi pembibitan padi."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Ngurah Rai / Tabanan",
      temperature: 26,
      condition: "Cerah Berawan",
      humidity: 78,
      windSpeedKmh: 12,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Jatiluwih Subak Trekking & Organic Harvest Experience",
      organizer: "Koperasi Tani Desa Adat Jatiluwih",
      duration: "1 Hari Penuh",
      priceIdr: 450000,
      priceUsd: 29,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    tags: ["Pertanian", "Subak", "Jatiluwih", "Bali", "Sawah Terasering", "Beras Merah", "Sumber Alam"]
  },
  {
    id: "bali-bedugul-usada",
    name: "Kebun Raya Bedugul & Konservasi Usada Bali",
    subtitle: "Pusat Konservasi Botani & Naskah Herbal Lontar Tradisional",
    category: "herbal",
    province: "Bali",
    coordinates: [-8.2755, 115.1561],
    subCategory: "Herbal & Tanaman Obat Tradisional",
    agriculturalProducts: [
      "Koleksi 500+ Spesies Tanaman Obat Lontar Usada Bali",
      "Daun Sirih Hitam & Kunyit Putih",
      "Temulawak Pegunungan & Rimpang Jahe Gajah",
      "Minyak Atsiri Bunga Kenanga & Melati"
    ],
    traditionalAttire: {
      name: "Busana Sangging & Pengusada Herbal Bali",
      wastraType: "Kain Poleng Hitam Putih & Saput Kuning",
      headgear: "Destar Udeng Poleng Catur Warna",
      colors: ["#1e293b", "#f59e0b", "#ffffff"],
      significance: "Kain poleng melambangkan dualisme alam (Rwa Bhineda) yang diseimbangkan oleh daya penyembuh tanaman obat bumi nusantara."
    },
    culturalTraditions: [
      "Pengobatan Holistik Berbasis Lontar Usada Taru Pramana",
      "Ritual Tumpek Wariga (Penghormatan Sakral untuk Tumbuh-Tumbuhan)",
      "Tradisi Meracik Boreh Hangat Penghangat Tubuh Pegunungan"
    ],
    culturalEvents: [
      "Festival Tanaman Obat Nusantara Bedugul",
      "Upacara Tumpek Wariga Kebun Raya"
    ],
    description: "Kawasan kebun raya terluas di Indonesia di dataran tinggi Bedugul yang menjadi benteng konservasi ratusan flora obat tradisional Bali (Taru Pramana). Pengunjung dapat mempelajari naskah kuno Lontar Usada tentang khasiat rimpang dan dedaunan nusantara untuk kesehatan.",
    historicalSignificance: "Pusat rujukan botani dan etnofarmakologi Asia Tenggara yang mengkodifikasi ribuan formula pengobatan leluhur kepulauan Nusantara.",
    etiquette: {
      dressCode: "Pakaian sopan tertutup, bawa jaket hangat dataran tinggi.",
      taboos: [
        "Dilarang memetik dedaunan atau merusak spesimen tanaman koleksi herbal",
        "Dilarang menginjak bedengan persemaian bibit langka",
        "Dilarang merokok di area hutan konservasi"
      ],
      rituals: "Doa permisi kepada Bhatara Hyang Danu sebelum memasuki taman anggrek dan herbal."
    },
    bmkgStation: {
      name: "Stasiun Geofisika Sanglah / Baturiti Bedugul",
      temperature: 20,
      condition: "Berawan",
      humidity: 86,
      windSpeedKmh: 10,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Bedugul Usada Herbal & Botanical Healing Trail",
      organizer: "Komunitas Etnobotani Usada Nusantara",
      duration: "1 Hari Penuh",
      priceIdr: 400000,
      priceUsd: 26,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    tags: ["Herbal", "Usada Bali", "Tanaman Obat", "Kebun Raya", "Bedugul", "Flora Fauna", "Pertanian"]
  },

  // ==========================================
  // JAWA TIMUR — BUMI MAJAPAHIT & BLAMBANGAN
  // ==========================================
  {
    id: "jatim-kawah-ijen",
    name: "Kawah Ijen & Blue Fire Banyuwangi",
    subtitle: "Geowisata Api Biru Alami & Sumber Daya Alam Belerang Solfatara",
    category: "sumber-alam",
    province: "Jawa Timur",
    coordinates: [-8.0583, 114.2425],
    subCategory: "Sumber Alam & Geologi Vulkanik",
    agriculturalProducts: [
      "Belerang Alami Kawah Kaldera Murni",
      "Kopi Arabika Java Ijen-Raung (Indikasi Geografis)",
      "Cengkih Pegunungan Ijen"
    ],
    traditionalAttire: {
      name: "Busana Penambang Adat Suku Osing Banyuwangi",
      wastraType: "Batik Gajah Oling Khas Banyuwangi",
      headgear: "Udeng Jawa Timur Corak Semanggi",
      colors: ["#1e293b", "#0284c7", "#f59e0b"],
      significance: "Batik Gajah Oling melambangkan kesadaran akan kebesaran Sang Pencipta dan ketangguhan masyarakat lereng Ijen."
    },
    culturalTraditions: [
      "Tradisi Pikul Belerang Tradisional Penambang Ijen",
      "Kidung Mantra Suku Osing Banyuwangi",
      "Upacara Selamatan Kawah Ijen Masyarakat Desa Tamansari"
    ],
    culturalEvents: [
      "Festival Ijen Caldera Banyuwangi",
      "Gandrung Sewu Banyuwangi"
    ],
    description: "Fenomena geologi spektakuler kawah danau asam terbesar di dunia dengan kawah solfatara yang menghasilkan fenomena langka Api Biru (Blue Fire) yang hanya ada dua di muka bumi. Kawasan ini merupakan sumber daya alam tambang belerang vulkanik aktif Nusantara.",
    historicalSignificance: "Situs UNESCO Global Geopark Ijen yang menjadi saksi sejarah evolusi vulkanik cincin api pasifik Pulau Jawa.",
    etiquette: {
      dressCode: "Masker respirator gas asam standar N95/K95, jaket hangat polar, sepatu trekking anti-selip.",
      taboos: [
        "Dilarang mendekati pipa kondensasi belerang tanpa izin penambang",
        "Dilarang mendahului jalur troli angkut penambang belerang di jalan setapak",
        "Dilarang turun ke bibir danau asam saat konsentrasi gas sulfida pekat"
      ],
      rituals: "Selamatan tumpeng sewu di kaki lereng sebelum musim penambangan raya."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Banyuwangi / Blimbingsari",
      temperature: 17,
      condition: "Cerah",
      humidity: 82,
      windSpeedKmh: 14,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Midnight Blue Fire Expedition & Ijen Geopark Tour",
      organizer: "Himpunan Pemandu Geowisata Kawah Ijen",
      duration: "1 Hari Penuh",
      priceIdr: 550000,
      priceUsd: 36,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
    tags: ["Sumber Alam", "Kawah Ijen", "Blue Fire", "Banyuwangi", "Geologi", "Belerang", "Jawa Timur"]
  },
  {
    id: "jatim-tn-baluran",
    name: "Taman Nasional Baluran (Afrika van Java)",
    subtitle: "Suaka Savana Alami, Konservasi Banteng Jawa & Merak Hijau",
    category: "flora-fauna",
    province: "Jawa Timur",
    coordinates: [-7.8389, 114.3917],
    subCategory: "Flora & Fauna Suaka Alam",
    agriculturalProducts: [
      "Madu Lebah Hutan Akasia Baluran",
      "Kacang Mete Organik Pesisir Bama",
      "Ikan Kerapu & Rumput Laut Teluk Air Tawar"
    ],
    traditionalAttire: {
      name: "Pakaian Penjelajah Savana Nusantara",
      wastraType: "Kain Tenun Sabang-Merauke",
      headgear: "Topi Rimba Safari Khas Ranger",
      colors: ["#78350f", "#047857"],
      significance: "Warna tanah dan dedaunan menyatu dengan bentang savana bekol."
    },
    culturalTraditions: [
      "Kearifan Konservasi Banteng Jawa (Bos javanicus)",
      "Pesta Petik Laut Nelayan Pantai Bama",
      "Patroli Partisipatif Masyarakat Mitra Polhut"
    ],
    culturalEvents: [
      "Baluran Birdwatching Festival",
      "Parade Ekowisata Savana Jawa Timur"
    ],
    description: "Kawasan suaka margasatwa dengan padang savana terluas di Pulau Jawa (Savana Bekol) berlatar megah Gunung Baluran. Habitat alami populasi Banteng Jawa, merak hijau, rusa timor, macan tutul Jawa, serta hutan mangrove pesisir Pantai Bama.",
    historicalSignificance: "Kawasan suaka margasatwa cagar biosfer yang ditetapkan sejak era 1937 untuk menyelamatkan mamalia besar asli Jawa.",
    etiquette: {
      dressCode: "Pakaian safari bernuansa warna tanah (khaki/hijau tua), teropong binokular, dan topi matahari.",
      taboos: [
        "Dilarang memberi makan kawanan monyet ekor panjang atau satwa liar",
        "Dilarang membunyikan klakson keras di tengah padang savana bekol",
        "Dilarang menyalakan api unggun di area semak kering"
      ],
      rituals: "Lapor diri ke pos ranger serta taati batas kecepatan kendaraan 20 km/jam."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Banyuwangi / Situbondo",
      temperature: 30,
      condition: "Cerah",
      humidity: 68,
      windSpeedKmh: 16,
      waveHeightMeters: 0.8,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Savana Bekol Safari & Bama Mangrove Adventure",
      organizer: "Baluran Wildlife Ranger Service",
      duration: "1 Hari Penuh",
      priceIdr: 480000,
      priceUsd: 31,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    tags: ["Flora Fauna", "Baluran", "Banteng Jawa", "Satwa", "Savana", "Jawa Timur", "Konservasi"]
  },

  // ==========================================
  // DI YOGYAKARTA & JAWA TENGAH — IBUKOTA JAMU & CANDI
  // ==========================================
  {
    id: "yogya-jamu-nguter",
    name: "Sentra Jamu Tradisional & Tanaman Obat Nguter",
    subtitle: "Ibukota Jamu Nusantara & Budidaya Rimpang Herbal Leluhur",
    category: "herbal",
    province: "DI Yogyakarta",
    coordinates: [-7.6833, 110.8953],
    subCategory: "Herbal & Rimpang Kesehatan Tradisional",
    agriculturalProducts: [
      "Temulawak (Curcuma zanthorrhiza) Standar Etnofarmasi",
      "Jahe Merah Instan & Segar Organik",
      "Kencur, Kunyit Asam, & Sambiloto Obat",
      "Madu Hutan Klanceng Trigona"
    ],
    traditionalAttire: {
      name: "Kebaya Mbok Jamu Gendong & Jarik Batik Mataram",
      wastraType: "Kain Batik Tulis Motif Sidomukti & Parang Rusak",
      headgear: "Sanggul Tekuk Yogyakarta Berhias Melati",
      colors: ["#78350f", "#b45309", "#ffffff"],
      significance: "Melambangkan dedikasi kaum perempuan Nusantara dalam meramu tanaman obat demi kebugaran dan keselamatan keluarga."
    },
    culturalTraditions: [
      "Tradisi Minum Jamu Gendong Berbasis Empu Rimpang Sejak Abad ke-8",
      "Falsafah 'Jampi Oesodo' Kesehatan Raga Mataram Kuno",
      "Pasar Herbal Jamu Terbesar Nusantara Pasar Nguter"
    ],
    culturalEvents: [
      "Festival Jamu Gendong Nusantara",
      "Pekan Herbal Rimpang Nusantara Solo-Yogya"
    ],
    description: "Kawasan sentra budidaya rimpang tanaman obat keluarga (TOGA) dan ibukota industri jamu tradisional tertua di Indonesia. Rumah bagi ribuan perajin jamu gendong yang mengolah rimpang jahe, temulawak, kencur, dan sirih menjadi ramuan penyembuh warisan keraton Jawa.",
    historicalSignificance: "Pusat konservasi tradisi Jamu Tradisional Indonesia yang resmi diakui UNESCO sebagai Warisan Budaya Takbenda Dunia pada Desember 2023.",
    etiquette: {
      dressCode: "Pakaian santun dan rapi, nyaman untuk praktik menumbuk rimpang tradisional.",
      taboos: [
        "Dilarang mencemari kebun rimpang herbal dengan bahan kimia anorganik",
        "Wajib mencuci tangan sebelum memegang bahan rimpang jamu fermentasi"
      ],
      rituals: "Doa syukur keselamatan raga sebelum meminum jamu racikan empu."
    },
    bmkgStation: {
      name: "Stasiun Klimatologi Jawa Tengah / Yogyakarta",
      temperature: 28,
      condition: "Cerah Berawan",
      humidity: 76,
      windSpeedKmh: 11,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Jamu Herbal Brewing Masterclass & Rimpang Plantation Tour",
      organizer: "Paguyuban Jamu Lestari Nusantara",
      duration: "1 Hari Penuh",
      priceIdr: 350000,
      priceUsd: 23,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80",
    tags: ["Herbal", "Jamu Tradisional", "Nguter", "Tanaman Obat", "Yogyakarta", "Jawa Tengah", "Pertanian"]
  },
  {
    id: "yogya-borobudur",
    name: "Candi Borobudur & Desa Wisata Candirejo",
    subtitle: "Mahakarya Cagar Budaya Dunia UNESCO & Kearifan Desa Agraris",
    category: "budaya",
    province: "DI Yogyakarta",
    coordinates: [-7.6079, 110.2038],
    subCategory: "Budaya, Adat & Sejarah",
    agriculturalProducts: [
      "Gula Semut Nira Kelapa Candirejo",
      "Ubi Cilembu & Singkong Organik Magelang",
      "Kopi Menoreh Robusta-Arabika"
    ],
    traditionalAttire: {
      name: "Beskap Jawa & Jarik Surjan Lurik Mataraman",
      wastraType: "Kain Tenun Lurik Garis Prasojo & Batik Truntum",
      headgear: "Blangkon Gaya Yogyakarta Mondolan",
      colors: ["#1e293b", "#78350f", "#d97706"],
      significance: "Kain lurik garis lurus bermakna keteguhan jalan kebenaran dan kerendahan hati manusia di hadapan semesta."
    },
    culturalTraditions: [
      "Prosesi Waisak Internasional di Candi Borobudur",
      "Tradisi Nyadran Desa Candirejo Menghormati Mata Air",
      "Seni Karawitan Gamelan Perunggu Jawa"
    ],
    culturalEvents: [
      "Borobudur Cultural Feast",
      "Festival Seni Budaya Lembah Menoreh"
    ],
    description: "Monumen candi Buddha terbesar di dunia yang dibangun abad ke-8 dengan 2.672 panel relief dan 504 arca Buddha. Dikelilingi desa-desa wisata agraris seperti Candirejo yang menjaga tradisi bertani organik, delman andong tradisional, dan kerajinan batu candi.",
    historicalSignificance: "Situs Warisan Budaya Dunia UNESCO yang menjadi pusat spiritualitas, ilmu pengetahuan arsitektur batu andesit, dan falsafah hidup damai Nusantara.",
    etiquette: {
      dressCode: "Menggunakan sandal Upanat resmi untuk naik struktur candi demi menjaga kelestarian batu andesit purba.",
      taboos: [
        "Dilarang memanjat, menduduki, atau menyentuh relief dan stupa candi",
        "Dilarang membawa rokok dan benda tajam ke area monumen"
      ],
      rituals: "Pradaksina (berjalan mengelilingi candi searah jarum jam) dengan hening."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi YIA Kulon Progo / Magelang",
      temperature: 27,
      condition: "Cerah",
      humidity: 74,
      windSpeedKmh: 12,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Sunrise Borobudur & Candirejo Village Heritage Andong Tour",
      organizer: "Komunitas Desa Budaya Candirejo",
      duration: "1 Hari Penuh",
      priceIdr: 650000,
      priceUsd: 42,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80",
    tags: ["Budaya", "Borobudur", "Candirejo", "Warisan Dunia", "Yogyakarta", "Candi"]
  },

  // ==========================================
  // ACEH — SERAMBI MEKKAH & REMPAH GAYO
  // ==========================================
  {
    id: "aceh-gayo-kopi",
    name: "Perkebunan Kopi Arabika Dataran Tinggi Gayo",
    subtitle: "Lumbung Pertanian Kopi Specialty Organik Terbesar Asia Tenggara",
    category: "pertanian",
    province: "Aceh",
    coordinates: [4.6294, 96.8454],
    subCategory: "Pertanian & Perkebunan Dataran Tinggi",
    agriculturalProducts: [
      "Kopi Arabika Gayo Specialty (Indikasi Geografis)",
      "Alpukat Madu Takengon",
      "Jeruk Keprok Gayo Asli",
      "Minyak Atsiri Nilam Gayo Lues"
    ],
    traditionalAttire: {
      name: "Busana Adat Gayo 'Aman Mayak' & Kain Upuh Ulen-Ulen",
      wastraType: "Kain Kerawang Gayo Bersulam Benang Warna Empat Elemen",
      headgear: "Ketopong Berhias Sulaman Kerawang",
      colors: ["#1e293b", "#dc2626", "#eab308", "#16a34a"],
      significance: "Empat warna kerawang (merah, kuning, hijau, hitam) melambangkan keberanian, keagungan adat, kesuburan alam, dan keteguhan iman."
    },
    culturalTraditions: [
      "Seni Tutur Didong Gayo Mengiringi Musim Panen Kopi",
      "Tradisi Munomong (Petik Merah Kopi Selektif)",
      "Pacuan Kuda Tradisional Tanpa Pelana Danau Laut Tawar"
    ],
    culturalEvents: [
      "Gayo Coffee Harvest Festival",
      "Festival Seni Didong Saman Takengon"
    ],
    description: "Hamparan kebun kopi organik di ketinggian 1.200 - 1.700 mdpl di perbukitan Takengon mengelilingi Danau Laut Tawar. Kopi Gayo merupakan komoditas ekspor pertanian nomor satu Indonesia yang diakui dunia atas karakter rasa floral dan kekentalan sempurna.",
    historicalSignificance: "Kawasan perkebunan kopi arabika dataran tinggi yang memegang sertifikasi Fair Trade dan Indikasi Geografis Uni Eropa.",
    etiquette: {
      dressCode: "Busana tertutup dan sopan sesuai syariat budaya Serambi Mekkah, sepatu bot kebun.",
      taboos: [
        "Dilarang memetik buah kopi hijau mentah",
        "Dilarang mencemari danau dan aliran air perkebunan kopi",
        "Menghormati waktu ibadah shalat saat berwisata di pedesaan Gayo"
      ],
      rituals: "Upacara syukuran panen kopi dengan sajian kopi seduh tubruk Gayo murni."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Rembele / Takengon Gayo",
      temperature: 21,
      condition: "Cerah Berawan",
      humidity: 80,
      windSpeedKmh: 9,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Gayo Organic Coffee Trail: From Farm to Cupping Table",
      organizer: "Koperasi Kopi Adat Gayo Bersatu",
      duration: "1 Hari Penuh",
      priceIdr: 500000,
      priceUsd: 33,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    tags: ["Pertanian", "Kopi Gayo", "Aceh", "Takengon", "Perkebunan", "Sumber Alam"]
  },
  {
    id: "aceh-sabang-weh",
    name: "Taman Laut Pulau Weh & Titik Nol Kilometer Sabang",
    subtitle: "Surga Bahari Terumbu Karang & Kekayaan Ikan Pelagis Samudera Hindia",
    category: "laut",
    province: "Aceh",
    coordinates: [5.8925, 95.3194],
    subCategory: "Laut / Ikan & Konservasi Bahari",
    agriculturalProducts: [
      "Ikan Tuna Sirip Kuning & Cakalang Samudera Hindia",
      "Ikan Kerapu Sunu & Lobster Air Laut",
      "Cengkih & Kelapa Hibrida Pesisir Sabang"
    ],
    traditionalAttire: {
      name: "Pakaian Adat Panglima Laot Pesisir Aceh",
      wastraType: "Kain Songket Aceh Motif Pintu Aceh & Bungong Jeumpa",
      headgear: "Kupiah Meukeutop Khas Pejuang Aceh",
      colors: ["#dc2626", "#eab308", "#16a34a", "#1e293b"],
      significance: "Kupiah Meukeutop melambangkan martabat kepemimpinan maritim dan penegakan hukum adat laut Panglima Laot."
    },
    culturalTraditions: [
      "Hukum Adat Panglima Laot Mengatur Konservasi Ikan dan Larangan Melaut",
      "Tradisi Kenduri Laot Syukuran Nelayan Sabang",
      "Aturan Sakral Hari Pantang Melaut (Setiap Hari Jumat)"
    ],
    culturalEvents: [
      "Sabang Marine Festival",
      "Kenduri Laot Raya Pesisir Aceh"
    ],
    description: "Titik paling barat Nusantara di mana Samudera Hindia bertemu Laut Andaman. Memiliki terumbu karang vulkanik bawah laut kelas dunia (Underwater Volcano), habitat ikan hiu karang, pari elang, dan lumbung perikanan pelagis tuna yang dilindungi hukum adat bahari Panglima Laot.",
    historicalSignificance: "Pelabuhan bebas maritim bersejarah sejak abad ke-19 dan benteng pertahanan perairan terluar gerbang barat Republik Indonesia.",
    etiquette: {
      dressCode: "Pakaian renang bersahaja, kenakan penutup tubuh saat kembali ke darat menuju pemukiman desa.",
      taboos: [
        "PANTANGAN KERAS: Dilarang melaut atau beraktivitas bahari pada Hari Jumat sebelum shalat Jumat selesai (Hukum Adat Panglima Laot)",
        "Dilarang mengambil karang atau menombak ikan di zona suaka inti Iboih"
      ],
      rituals: "Menghormati aturan adat Panglima Laot setempat."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Sabang / Pulau Weh",
      temperature: 29,
      condition: "Cerah",
      humidity: 76,
      windSpeedKmh: 15,
      waveHeightMeters: 1.2,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Pulau Weh Coral Reef Snorkeling & Zero Kilometer Expedition",
      organizer: "Lembaga Adat Panglima Laot Iboih",
      duration: "1 Hari Penuh",
      priceIdr: 600000,
      priceUsd: 39,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    tags: ["Laut / Ikan", "Sabang", "Pulau Weh", "Terumbu Karang", "Perikanan", "Bahari", "Aceh"]
  },

  // ==========================================
  // SUMATERA BARAT — RANAH MINANG & OMBILIN
  // ==========================================
  {
    id: "sumbar-ombilin",
    name: "Geosite Tambang Batubara Ombilin Sawahlunto",
    subtitle: "Warisan Dunia Geologi Bumi & Sumber Daya Alam Energi Tertua",
    category: "sumber-alam",
    province: "Sumatera Barat",
    coordinates: [-0.6789, 100.7811],
    subCategory: "Sumber Alam & Warisan Geologi Tambang",
    agriculturalProducts: [
      "Batubara Alami Kalori Tinggi Cekungan Ombilin",
      "Beras Solok Pandan Wangi Organik",
      "Kopi Robusta Sawahlunto & Kayu Manis Koerintji"
    ],
    traditionalAttire: {
      name: "Baju Panghulu Suku Piliang & Deta Saluak Minangkabau",
      wastraType: "Kain Songket Silungkang Bertabur Benang Emas",
      headgear: "Saluak Batimbo Emas Minang",
      colors: ["#1e293b", "#b45309", "#dc2626"],
      significance: "Saluak melambangkan kerutan pemikiran arif nan bijaksana pemimpin Minangkabau dalam menjaga pusaka tanah ulayat."
    },
    culturalTraditions: [
      "Kearifan Menjaga Tanah Ulayat Adat Minangkabau",
      "Kesenian Talempong Batu Purba Sawahlunto",
      "Sejarah Kereta Uap 'Mak Itam' Jalur Batubara Ombilin"
    ],
    culturalEvents: [
      "Sawahlunto International Music Festival (SIMFes)",
      "Pekan Budaya Tambang Ombilin UNESCO"
    ],
    description: "Kawasan tambang batubara tertua di Asia Tenggara yang ditetapkan UNESCO sebagai warisan dunia. Memperlihatkan keajaiban geologi pembentukan batubara jutaan tahun lalu di lembah perbukitan Bukit Barisan lengkap dengan terowongan tambang bawah tanah Lubang Mbah Soero.",
    historicalSignificance: "Warisan Dunia UNESCO 2019 'Ombilin Coal Mining Heritage of Sawahlunto' sebagai tonggak revolusi industri dan geologi Nusantara.",
    etiquette: {
      dressCode: "Sepatu tertutup nyaman untuk mengeksplorasi situs terowongan lubang tambang batubara, helm pengaman disediakan.",
      taboos: [
        "Dilarang membawa korek api atau merokok di dalam lubang terowongan tambang",
        "Dilarang mencoret dinding terowongan bersejarah"
      ],
      rituals: "Membaca doa keselamatan sebelum memasuki lorong bawah tanah."
    },
    bmkgStation: {
      name: "Stasiun Geofisika Padang Panjang / Sawahlunto",
      temperature: 26,
      condition: "Cerah Berawan",
      humidity: 78,
      windSpeedKmh: 10,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Ombilin UNESCO Underground Mine & Songket Silungkang Tour",
      organizer: "Sawahlunto Heritage Guide Society",
      duration: "1 Hari Penuh",
      priceIdr: 450000,
      priceUsd: 29,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    tags: ["Sumber Alam", "Ombilin", "Sawahlunto", "Geologi", "Sumatera Barat", "UNESCO"]
  },
  {
    id: "sumbar-pariangan",
    name: "Desa Adat Nagari Pariangan & Lembah Harau",
    subtitle: "Desa Tertua Minangkabau dengan Lanskap Pertanian Sawah Bertingkat",
    category: "budaya",
    province: "Sumatera Barat",
    coordinates: [-0.4358, 100.4892],
    subCategory: "Budaya Adat & Pertanian Tradisional",
    agriculturalProducts: [
      "Padi Cisokan & Beras Merah Lereng Marapi",
      "Kayu Manis Alami (Cinnamomum burmannii)",
      "Kopi Daun Kawa Kawa Khas Minang"
    ],
    traditionalAttire: {
      name: "Baju Kurung Basiba & Tikuluak Tanduk Minangkabau",
      wastraType: "Songket Tenun Pandai Sikek Benang Perak & Emas",
      headgear: "Tikuluak Tanduk Kerbau Rumah Gadang",
      colors: ["#dc2626", "#eab308", "#1e293b"],
      significance: "Baju Kurung Basiba mencerminkan kesantunan dan kehormatan Bundo Kanduang sebagai tiang utama adat matrilineal Minangkabau."
    },
    culturalTraditions: [
      "Sistem Kekerabatan Matrilineal Terbesar di Dunia",
      "Tradisi Pacu Jawi (Balapan Sapi di Sawah Berlumpur)",
      "Musyawarah Adat di Balairung Sari Tabek Nan Indah"
    ],
    culturalEvents: [
      "Alek Nagari Pacu Jawi Pariangan",
      "Festival Pesona Minangkabau"
    ],
    description: "Desa berhawa sejuk di lereng Gunung Marapi yang dinobatkan sebagai salah satu desa terindah di dunia. Rumah bagi arsitektur vernacular Rumah Gadang beratap gonjong tanduk kerbau yang diapit lanskap sawah berundak-undak subur dan tebing granit purba Lembah Harau.",
    historicalSignificance: "Nagari tertua tempat asal-usul nenek moyang orang Minangkabau turun dari puncak Gunung Marapi menurut tambo Minang.",
    etiquette: {
      dressCode: "Pakaian sopan bernuansa santun Melayu-Minang, lepas alas kaki saat masuk ke Rumah Gadang pusaka.",
      taboos: [
        "Dilarang duduk tidak sopan saat berada di anjungan Rumah Gadang",
        "Dilarang berkata kasar atau merusak tatanan pematang sawah adat"
      ],
      rituals: "Menikmati seduhan Kawa Daun di cangkir tempurung kelapa tradisional."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Minangkabau / Padang",
      temperature: 24,
      condition: "Cerah Berawan",
      humidity: 82,
      windSpeedKmh: 8,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Nagari Pariangan Ancestral Heritage & Harau Valley Trek",
      organizer: "Lembaga Kerapatan Adat Alam Minangkabau (LKAAM)",
      duration: "1 Hari Penuh",
      priceIdr: 520000,
      priceUsd: 34,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tags: ["Budaya", "Pertanian", "Minangkabau", "Nagari Pariangan", "Lembah Harau", "Sumatera Barat"]
  },

  // ==========================================
  // KEPULAUAN RIAU — LAUT ATOL & IKAN KARANG
  // ==========================================
  {
    id: "kepri-anambas",
    name: "Kepulauan Anambas & Kawasan Konservasi Laut",
    subtitle: "Gugusan Atol Terluar & Lumbung Perikanan Ikan Kerapu dan Napoleon",
    category: "laut",
    province: "Kepulauan Riau",
    coordinates: [3.2167, 106.2500],
    subCategory: "Laut / Ikan & Ekosistem Atol Karang",
    agriculturalProducts: [
      "Ikan Napoleon (Cheilinus undulatus) Budidaya Terkendali",
      "Ikan Kerapu Bebek & Tuna Sirip Kuning Natuna",
      "Cumi-cumi Kering & Teripang Laut Dalam",
      "Kelapa Pulau Terluar"
    ],
    traditionalAttire: {
      name: "Baju Kurung Teluk Belanga Melayu Bahari",
      wastraType: "Kain Songket Melayu Riau Corak Awan Larat",
      headgear: "Tanjak Dendang Patah Melayu Riau",
      colors: ["#0284c7", "#f59e0b", "#ffffff"],
      significance: "Tanjak Melayu melambangkan kedaulatan laut kepulauan dan kearifan menjaga pantang larang perairan samudera."
    },
    culturalTraditions: [
      "Tradisi Belat Nelayan Tradisional (Perangkap Ikan Ramah Lingkungan)",
      "Upacara Menepuk Tepung Tawar Kapal Nelayan",
      "Pesta Rakyat Padang Melang Pesisir Terluar"
    ],
    culturalEvents: [
      "Festival Padang Melang Anambas",
      "Parade Layar Kepulauan Riau"
    ],
    description: "Gugusan pulau tropis terluar di Laut Natuna yang dinobatkan sebagai kepulauan tropis terindah di Asia. Memiliki laguna biru atol karang alami, surga ikan napoleon, penyu sisik, dan lumbung perikanan tangkap berkelanjutan Nusantara.",
    historicalSignificance: "Kawasan Konservasi Taman Wisata Perairan (TWP) Kepulauan Anambas yang menjadi pilar kedaulatan maritim Indonesia di perbatasan utara.",
    etiquette: {
      dressCode: "Pakaian bahari ringan, tabir surya aman bagi terumbu karang (reef-safe sunscreen).",
      taboos: [
        "Dilarang menangkap atau membeli ikan karang di bawah ukuran konservasi",
        "Dilarang membuang jangkar kapal di atas gugusan terumbu karang hidup",
        "Dilarang mengambil pasir putih atau biota laut sebagai cenderamata"
      ],
      rituals: "Syukuran doa laut selamat bersama nelayan Tarempa."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Tarempa / Kepulauan Anambas",
      temperature: 29,
      condition: "Cerah",
      humidity: 78,
      windSpeedKmh: 18,
      waveHeightMeters: 1.4,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Anambas Atoll Lagoon & Sustainable Marine Fishery Tour",
      organizer: "Himpunan Nelayan Konservasi Anambas",
      duration: "1 Hari Penuh",
      priceIdr: 850000,
      priceUsd: 55,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    tags: ["Laut / Ikan", "Kepulauan Riau", "Anambas", "Perikanan", "Terumbu Karang", "Bahari"]
  },

  // ==========================================
  // KALIMANTAN TENGAH — RIMBA ORANGUTAN
  // ==========================================
  {
    id: "kalteng-tanjung-puting",
    name: "Taman Nasional Tanjung Puting",
    subtitle: "Ibukota Konservasi Orangutan Liar Terbesar di Dunia & Rimba Rawa Gambut",
    category: "flora-fauna",
    province: "Kalimantan Tengah",
    coordinates: [-2.8944, 111.9583],
    subCategory: "Flora & Fauna Hutan Hujan Tropis",
    agriculturalProducts: [
      "Madu Rimba Alami Rawa Gambut",
      "Buah Durian Rimba (Durio kutejensis)",
      "Anyaman Rotan Suku Dayak Ngaju"
    ],
    traditionalAttire: {
      name: "Baju Pawang Rimba Suku Dayak Tomun",
      wastraType: "Rompi Kulit Kayu Nyamu Berlukis Motif Belanga",
      headgear: "Ikat Kepala Bulu Burung Enggang Gading",
      colors: ["#78350f", "#b45309", "#047857"],
      significance: "Bulu burung enggang melambangkan kesetiaan, kedamaian, dan perlindungan sakral terhadap rimba belantara Kalimantan."
    },
    culturalTraditions: [
      "Navigasi Perahu Klotok Tradisional di Sungai Sekonyer",
      "Kearifan Dayak 'Tana' Ulen' Melindungi Hutan Suci",
      "Upacara Adat Tiwah Penghormatan Arwah Leluhur Dayak"
    ],
    culturalEvents: [
      "Tanjung Puting Eco-Tourism Festival",
      "Pekan Budaya Dayak Kotawaringin Barat"
    ],
    description: "Kawasan biosfer dunia seluas 415.040 hektar yang menjadi rumah suaka populasi Orangutan Kalimantan (Pongo pygmaeus) liar terbesar di bumi. Pengunjung menjelajahi rimba menaiki perahu kayu klotok menyusuri Sungai Sekonyer yang airnya hitam berkaca cermin karena tannin gambut alami.",
    historicalSignificance: "Pusat penelitian primata liar tertua di dunia yang dipelopori oleh Dr. Birute Galdikas di Camp Leakey sejak tahun 1971.",
    etiquette: {
      dressCode: "Pakaian trekking tertutup warna gelap/tanah, lotion anti-nyamuk, dilarang memakai parfum menyengat.",
      taboos: [
        "Dilarang mendekati orangutan dalam jarak kurang dari 5 meter",
        "DILARANG KERAS memberi makanan atau minuman manusia kepada satwa liar",
        "Dilarang bersuara keras atau menggunakan lampu blitz kamera di feeding station"
      ],
      rituals: "Lapor pos ranger Camp Leakey dan ikuti arahan naturalist guide resmi."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Iskandar / Pangkalan Bun",
      temperature: 28,
      condition: "Hujan Ringan",
      humidity: 88,
      windSpeedKmh: 9,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Klotok River Boat Expedition & Camp Leakey Orangutan Trail",
      organizer: "Tanjung Puting Eco-Ranger Cooperative",
      duration: "1 Hari Penuh",
      priceIdr: 950000,
      priceUsd: 62,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80",
    tags: ["Flora Fauna", "Tanjung Puting", "Orangutan", "Satwa Endemik", "Kalimantan", "Rimba"]
  },

  // ==========================================
  // NUSA TENGGARA TIMUR — KOMODO & KELIMUTU
  // ==========================================
  {
    id: "ntt-komodo",
    name: "Taman Nasional Komodo & Manta Point",
    subtitle: "Situs Warisan Dunia UNESCO Habitat Purba Kadal Raksasa & Suaka Ikan Pari Manta",
    category: "flora-fauna",
    province: "Nusa Tenggara Timur",
    coordinates: [-8.5433, 119.4894],
    subCategory: "Flora & Fauna Satwa Purba serta Bahari",
    agriculturalProducts: [
      "Kopi Arabika Flores Bajawa Organik",
      "Ikan Cakalang Asap & Kerapu Merah Labuan Bajo",
      "Madu Hutan Flores & Minyak Kelapa Murni"
    ],
    traditionalAttire: {
      name: "Busana Adat Manggarai & Songke Flores",
      wastraType: "Kain Tenun Songke Flores Motif Mata Manuk",
      headgear: "Destar Sapu Manggarai Keemasan",
      colors: ["#1e293b", "#dc2626", "#f59e0b"],
      significance: "Motif Mata Manuk melambangkan kepekaan mata batin manusia dalam membaca tanda-tanda alam semesta."
    },
    culturalTraditions: [
      "Mitos 'Ora' Suku Komodo (Kepercayaan Bahwa Manusia dan Komodo Adalah Saudara Kembar)",
      "Tarian Perang Caci Tradisional Manggarai",
      "Tradisi Melaut Perahu Pinisi & Phinisi Bajo"
    ],
    culturalEvents: [
      "Festival Komodo Labuan Bajo",
      "Parade Budaya Caci Manggarai Barat"
    ],
    description: "Situs Warisan Dunia UNESCO yang menjadi satu-satunya habitat alami kadal terbesar di muka bumi, Komodo (Varanus komodoensis). Kawasan ini juga memiliki kekayaan laut menakjubkan di Manta Point tempat berkumpulnya kawanan pari manta raksasa serta pantai berpasir merah muda (Pink Beach).",
    historicalSignificance: "Ditetapkan sebagai Situs Warisan Dunia UNESCO pada 1991 dan New 7 Wonders of Nature atas keunikan evolusi biologis satwa purba.",
    etiquette: {
      dressCode: "Sepatu trekking kokoh, pakaian outdoor berlengan, topi lebar penahan panas savana.",
      taboos: [
        "Wajib selalu berada di belakang ranger (ranger bersenjatakan tongkat cabang)",
        "Wanita yang sedang menstruasi wajib melapor kepada ranger untuk pengawalan khusus",
        "Dilarang membuat gerakan tiba-tiba atau berlari saat berada di dekat komodo"
      ],
      rituals: "Ritual permisi kepada 'Ora' saudara tua pulau sebelum trekking savana."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Komodo / Labuan Bajo",
      temperature: 31,
      condition: "Cerah",
      humidity: 70,
      windSpeedKmh: 17,
      waveHeightMeters: 1.1,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Komodo Dragon Ranger Trek & Manta Point Snorkeling",
      organizer: "Koperasi Pemandu Alam TN Komodo",
      duration: "1 Hari Penuh",
      priceIdr: 900000,
      priceUsd: 59,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
    tags: ["Flora Fauna", "Laut / Ikan", "Komodo", "Manta Point", "Labuan Bajo", "NTT", "UNESCO"]
  },
  {
    id: "ntt-kelimutu",
    name: "Danau Vulkanik Triwarna Kelimutu",
    subtitle: "Fenomena Geologi Alami Kawah Tiga Warna & Sumber Mineral Bumi Flores",
    category: "sumber-alam",
    province: "Nusa Tenggara Timur",
    coordinates: [-8.7667, 121.8167],
    subCategory: "Sumber Alam & Geologi Vulkanik",
    agriculturalProducts: [
      "Belerang & Garam Mineral Vulkanik Alami",
      "Kopi Arabika Kelimutu Flores (Woloan)",
      "Ubi Ungu & Jagung Titi Tradisional Ende"
    ],
    traditionalAttire: {
      name: "Pakaian Adat Mosalaki Suku Lio",
      wastraType: "Kain Tenun Ikat Lio Motif Semba",
      headgear: "Luka Semba & Rambu Adat Ende",
      colors: ["#78350f", "#dc2626", "#eab308"],
      significance: "Kain tenun Semba hanya boleh dikenakan tetua adat Mosalaki sebagai lambang tanggung jawab menjaga kesucian danau arwah leluhur."
    },
    culturalTraditions: [
      "Upacara Adat Pati Ka Du'a Bapu Ata Mata (Memberi Makan Arwah Danau Kelimutu)",
      "Kepercayaan Triwarna Sebagai Tempat Tinggal Arwah Berdasarkan Amal Hidup",
      "Tarian Gawi Massal Bersama Warga Suku Lio"
    ],
    culturalEvents: [
      "Festival Danau Kelimutu Ende",
      "Pekan Seni Tenun Ikat Flores"
    ],
    description: "Keajaiban geologi alam di puncak Gunung Kelimutu berupa tiga kawah danau yang memiliki warna air berbeda-beda (merah, biru kehijauan, dan hitam pekat) yang dapat berubah warna secara periodik akibat perubahan gas dan mineral bumi. Tempat suci bersemayamnya arwah leluhur masyarakat Lio.",
    historicalSignificance: "Fenomena geologi kawah gas vulkanik termal terunik di dunia yang diabadikan dalam sejarah sains geosains global dan mata uang nasional.",
    etiquette: {
      dressCode: "Jaket tebal hangat suhu pegunungan 14-18°C, sepatu trekking anti-licin.",
      taboos: [
        "Dilarang memanjat pagar pembatas tebing kawah danau",
        "Dilarang melempar batu atau benda apapun ke dalam air danau",
        "Wajib bersikap hening dan hormat di puncak Tugu Pemandangan Inspirasi"
      ],
      rituals: "Upacara persembahan sesaji sirih pinang oleh tetua adat Mosalaki."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Frans Seda / Ende Kelimutu",
      temperature: 18,
      condition: "Kabut",
      humidity: 90,
      windSpeedKmh: 11,
      waveHeightMeters: 0.0,
      safetyStatus: "WASPADA"
    },
    tripPackage: {
      title: "Sunrise Over the Three-Colored Crater Lakes of Kelimutu",
      organizer: "Komunitas Adat Mosalaki Kelimutu",
      duration: "1 Hari Penuh",
      priceIdr: 450000,
      priceUsd: 29,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tags: ["Sumber Alam", "Kelimutu", "Danau Tiga Warna", "Flores", "Geologi", "Mineral", "NTT"]
  },

  // ==========================================
  // PAPUA — RAJA AMPAT & TANAMAN OBAT BALIEM
  // ==========================================
  {
    id: "papua-raja-ampat",
    name: "Kepulauan Raja Ampat (Misool & Piaynemo)",
    subtitle: "Jantung Segitiga Karang Dunia dengan 1.500+ Spesies Ikan Laut & Biota Karang",
    category: "laut",
    province: "Papua",
    coordinates: [-0.2333, 130.5167],
    subCategory: "Laut / Ikan & Konservasi Terumbu Karang Dunia",
    agriculturalProducts: [
      "Ikan Pelagis Cakalang & Kerapu Karang Berkelanjutan",
      "Ikan Kakap Merah Samudera Pasifik",
      "Mutiara Laut Selatan Asli Misool",
      "Minyak Kelapa Dara (VCO) Raja Ampat"
    ],
    traditionalAttire: {
      name: "Busana Bahari Suku Maya & Suku Matbat Raja Ampat",
      wastraType: "Kain Tenun Kulit Kayu Bersulam Motif Karang Laut",
      headgear: "Mahkota Cendrawasih Imitasi & Manik Kerang Laut",
      colors: ["#0284c7", "#f59e0b", "#ffffff"],
      significance: "Kerang laut dan ornamen bahari melambangkan ikatan darah tak terpisahkan antara masyarakat adat dan laut pusaka."
    },
    culturalTraditions: [
      "Tradisi Sasi Laut (Kearifan Larangan Menangkap Ikan Selama Periode Tertentu)",
      "Upacara Buka Sasi Bersama Tetua Adat Raja Ampat",
      "Nyanyian Suling Tambur Sambutan Bahari"
    ],
    culturalEvents: [
      "Festival Bahari Raja Ampat",
      "Upacara Adat Buka Sasi Misool"
    ],
    description: "Pusat keanekaragaman hayati laut terkaya di planet bumi yang menaungi 75% seluruh spesies karang dunia dan lebih dari 1.500 spesies ikan tropis, pari manta oseanik, serta hiu karang berjalan (Walking Shark). Bentang gugusan karst zamrud Piaynemo dan Wayag merupakan ikon bahari kebanggaan Nusantara.",
    historicalSignificance: "Ditetapkan sebagai UNESCO Global Geopark Raja Ampat dan episentrum Coral Triangle Initiative dunia.",
    etiquette: {
      dressCode: "Pakaian snorkeling/diving standar, wajib menggunakan reef-safe sunscreen, dilarang memakai sarung tangan saat menyelam.",
      taboos: [
        "Dilarang menyentuh, berdiri di atas, atau menginjak terumbu karang hidup",
        "Dilarang mengejar, memegang pari manta, atau menggunakan lampu kilat",
        "Dilarang melanggar wilayah laut yang sedang dalam masa 'Sasi Adat'"
      ],
      rituals: "Membayar Tarif Layanan Pemeliharaan Lingkungan (TLPL) konservasi Raja Ampat."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Sorong / Raja Ampat",
      temperature: 29,
      condition: "Cerah Berawan",
      humidity: 78,
      windSpeedKmh: 14,
      waveHeightMeters: 0.9,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Raja Ampat Coral Triangle Diving & Piaynemo Karst Expedition",
      organizer: "Asosiasi Usaha Wisata Selam Raja Ampat",
      duration: "1 Hari Penuh",
      priceIdr: 1200000,
      priceUsd: 78,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80",
    tags: ["Laut / Ikan", "Raja Ampat", "Papua", "Terumbu Karang", "Ikan Karang", "Bahari Dunia"]
  },
  {
    id: "papua-baliem-buahmerah",
    name: "Lembah Baliem & Suaka Herbal Buah Merah",
    subtitle: "Pusat Tanaman Obat Tradisional Endemik Papua & Kearifan Lembah Suku Dani",
    category: "herbal",
    province: "Papua",
    coordinates: [-4.0833, 138.9500],
    subCategory: "Herbal & Tanaman Obat Endemik Tradisional",
    agriculturalProducts: [
      "Ekstrak Herbal Buah Merah (Pandanus conoideus)",
      "Sarang Semut Papua (Myrmecodia pendans)",
      "Ubi Jalar Hipere Organik Suku Dani",
      "Kopi Arabika Wamena Dataran Tinggi"
    ],
    traditionalAttire: {
      name: "Busana Tradisional Holim & Sali Suku Dani",
      wastraType: "Rajutan Noken Kulit Kayu Anggrek Rimba Papua (UNESCO)",
      headgear: "Mahkota Bulu Kasuari & Taring Babi Wamena",
      colors: ["#78350f", "#ffffff", "#dc2626"],
      significance: "Noken melambangkan kesuburan, kehidupan rahim ibu bumi, dan wadah hasil bumi herbal tanaman obat pegunungan."
    },
    culturalTraditions: [
      "Tradisi Bakar Batu (Barapen) Syukuran Panen Buah Merah dan Hasil Bumi",
      "Pengobatan Tradisional Menggunakan Minyak Buah Merah dan Sarang Semut",
      "Arsitektur Tradisional Honai Beratap Jerami Ramah Iklim"
    ],
    culturalEvents: [
      "Festival Budaya Lembah Baliem (FBLB) Wamena",
      "Pesta Barapen Raya Dataran Tinggi Papua"
    ],
    description: "Lembah megah di ketinggian 1.600 mdpl yang dikelilingi puncak Pegunungan Jayawijaya bersalju abadi. Pusat habitat asli tanaman obat endemik Buah Merah (Pandanus conoideus) kaya antioksidan dan Sarang Semut yang menjadi andalan pengobatan tradisional suku Dani, Yali, dan Lani.",
    historicalSignificance: "Kawasan pertanian dataran tinggi tertua di Pasifik yang telah mempraktikkan teknik drainase tanah sejak 7.000 tahun lalu.",
    etiquette: {
      dressCode: "Jaket tebal hangat (suhu malam 10-15°C), sepatu trekking tanah pegunungan.",
      taboos: [
        "Dilarang mengambil foto masyarakat adat tanpa meminta izin terlebih dahulu",
        "Wajib menghormati tata krama memasuki kawasan Honai adat suku Dani",
        "Dilarang merusak kebun Buah Merah dan tanaman ubi hipere"
      ],
      rituals: "Ikut serta dalam tradisi menyantap ubi hasil olahan upacara Bakar Batu."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Wamena / Jayawijaya",
      temperature: 19,
      condition: "Hujan Ringan",
      humidity: 86,
      windSpeedKmh: 7,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Baliem Valley Herbal Plant Discovery & Dani Village Experience",
      organizer: "Lembaga Masyarakat Adat Wamena Jayawijaya",
      duration: "1 Hari Penuh",
      priceIdr: 750000,
      priceUsd: 49,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    tags: ["Herbal", "Buah Merah", "Tanaman Obat", "Lembah Baliem", "Papua", "Suku Dani", "Pertanian"]
  },

  // ==========================================
  // MALUKU — KEPULAUAN REMPAH PALA BANDA
  // ==========================================
  {
    id: "maluku-banda-neira",
    name: "Kepulauan Banda Neira & Benteng Belgica",
    subtitle: "Kepulauan Rempah Pala Bersejarah & Surga Perikanan Laut Banda",
    category: "pertanian",
    province: "Maluku",
    coordinates: [-4.5244, 129.9042],
    subCategory: "Pertanian & Perkebunan Rempah Sejarah",
    agriculturalProducts: [
      "Biji Pala & Bunga Pala Fuli Asli Banda (Myristica fragrans)",
      "Minyak Atsiri Cengkih Maluku",
      "Ikan Cakalang Asap Banda & Tuna Sirip Kuning",
      "Selai Buah Pala & Halwa Pala Tradisional"
    ],
    traditionalAttire: {
      name: "Baju Cele Maluku & Kain Sarung Tenun Ikat Banda",
      wastraType: "Kain Sarung Tenun Gedogan Corak Rempah Maluku",
      headgear: "Lenso Putih & Konde Bulan Sabit",
      colors: ["#dc2626", "#ffffff", "#b45309"],
      significance: "Kain merah Baju Cele melambangkan semangat heroisme bahari dan kejayaan tanah rempah Maluku."
    },
    culturalTraditions: [
      "Tradisi Buka Kampung & Cuci Pariwara Laut",
      "Lomba Dayang Belang Perahu Perang Tradisional Banda",
      "Teknik Memetik Pala Tradisional dengan Bambu 'Gait-Gait'"
    ],
    culturalEvents: [
      "Festival Pesta Rakyat Banda",
      "Banda Heritage Trail & Spice Walk"
    ],
    description: "Gugusan kepulauan legendaris yang pernah menjadi satu-satunya tempat di muka bumi penghasil buah pala dan fuli yang memicu lahirnya jalur rempah dunia. Menampilkan perkebunan pala tertua di dunia yang dinaungi pohon kenari raksasa ratusan tahun, benteng pertahanan VOC Benteng Belgica, serta laut dalam Banda Neira yang kaya akan ikan tuna dan karang sehat.",
    historicalSignificance: "Pusat Jalur Rempah Maritim Dunia (The Spice Islands) yang menjadi perebutan bangsa-bangsa dunia sejak abad ke-16.",
    etiquette: {
      dressCode: "Pakaian sopan santun kepulauan, gunakan sepatu nyaman saat menyusuri kebun pala dan benteng bersejarah.",
      taboos: [
        "Dilarang mematahkan dahan pohon pala kenari tua bersejarah",
        "Dilarang mencemari perairan dermaga pulau dengan sampah plastik",
        "Wajib menghormati tetua adat saat berkunjung ke Desa Lonthoir"
      ],
      rituals: "Mencicipi teh seduh daging buah pala hangat saat tiba di perkebunan."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Banda / Maluku Tengah",
      temperature: 28,
      condition: "Cerah",
      humidity: 77,
      windSpeedKmh: 13,
      waveHeightMeters: 1.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Banda Neira Historic Spice Trail & Marine Snorkeling",
      organizer: "Yayasan Warisan Budaya Banda Neira",
      duration: "1 Hari Penuh",
      priceIdr: 700000,
      priceUsd: 46,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    tags: ["Pertanian", "Laut / Ikan", "Sumber Alam", "Banda Neira", "Pala", "Maluku", "Rempah"]
  }
];
