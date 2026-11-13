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
  | "pantai"; // Alias kompatibilitas

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
    tags: ["Wisata Hutan", "TNBBS", "Rafflesia", "Repong Damar", "Lampung"]
  },

  // ==========================================
  // DESTINASI NUSANTARA LAINNYA (JAWA, BALI, SUMUT, PAPUA, DLL)
  // ==========================================
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
      windSpeedKmh: 15,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Living Bamboo Village & Hutan Adat Tour",
      organizer: "Koperasi Desa Adat Penglipuran",
      duration: "Setengah Hari",
      priceIdr: 350000,
      priceUsd: 23,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    tags: ["Desa Adat", "Bambu", "Tri Hita Karana", "Bali"]
  },
  {
    id: "bromo",
    name: "Kaldera Bromo & Desa Tengger Ngadisari",
    subtitle: "Kawah Suci Suku Tengger",
    category: "gunung",
    province: "Jawa Timur",
    coordinates: [-7.9425, 112.9530],
    description: "Lautan pasir vulkanik seluas 10 km persegi di dalam Kaldera Tengger, rumah bagi masyarakat adat Tengger keturunan Kerajaan Majapahit yang menyucikan kawah Bromo.",
    historicalSignificance: "Pusat ritual Yadnya Kasada persembahan hasil bumi untuk leluhur Roro Anteng dan Joko Seger.",
    etiquette: {
      dressCode: "Pakaian hangat berlapis, sarung batik khas Tengger penahan angin belerang.",
      taboos: [
        "Dilarang kencing atau meludah ke arah kawah Bromo yang disucikan",
        "Dilarang berkata sombong atau menantang alam di lautan pasir",
        "Dilarang membawa kendaraan bermotor masuk ke area altar Kasada"
      ],
      rituals: "Melempar sesaji hasil panen (ongkek) ke dalam kawah pada malam bulan purnama Kasada."
    },
    bmkgStation: {
      name: "Stasiun Geofisika Malang / Bromo",
      temperature: 14,
      condition: "Cerah Berawan",
      humidity: 65,
      windSpeedKmh: 18,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Midnight Milky Way & Kawah Bromo Adat Tengger",
      organizer: "Paguyuban Jeep Ksatria Tengger",
      duration: "12 Jam",
      priceIdr: 550000,
      priceUsd: 36,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
    tags: ["Gunung Api", "Tengger", "Kasada", "Kaldera"]
  },
  {
    id: "toraja",
    name: "Kete Kesu & Tebing Kubur Londa",
    subtitle: "Peradaban Leluhur Megalitikum Tana Toraja",
    category: "budaya",
    province: "Sulawesi Selatan",
    coordinates: [-3.0458, 119.8973],
    description: "Perkampungan tradisional Tongkonan berumur lebih dari 400 tahun dengan lumbung padi (Alang) dan tebing kubur batu gantung tempat peletakan peti mati jenazah bangsawan.",
    historicalSignificance: "Pusat upacara kematian Rambu Solo' yang merefleksikan kosmologi Aluk Todolo.",
    etiquette: {
      dressCode: "Pakaian berwarna hitam atau gelap sopan, tidak mencolok atau berpakaian pesta terbuka.",
      taboos: [
        "Dilarang memegang atau memindahkan tengkorak/tulang di gua Londa",
        "Dilarang menyentuh patung Tau-Tau leluhur tanpa izin tetua adat",
        "Dilarang melangkah di atas kain kafan prosesi jenazah"
      ],
      rituals: "Penyembelihan kerbau belang (Tedong Bonga) dan tari Ma'badong untuk mengantar arwah ke Puya."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Pongtiku / Tana Toraja",
      temperature: 22,
      condition: "Berawan",
      humidity: 78,
      windSpeedKmh: 8,
      waveHeightMeters: 0.0,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Toraja Heritage Trail & Tongkonan Architecture Tour",
      organizer: "Lembaga Pemandu Adat Kete Kesu",
      duration: "2 Hari 1 Malam",
      priceIdr: 750000,
      priceUsd: 49,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    tags: ["Megalitikum", "Tongkonan", "Rambu Solo", "Toraja"]
  },
  {
    id: "rajaampat",
    name: "Kepulauan Wayag & Desa Wisata Arborek",
    subtitle: "Pusat Keanekaragaman Hayati Laut Segitiga Karang Dunia",
    category: "laut",
    province: "Papua Barat Daya",
    coordinates: [-0.4616, 130.6865],
    description: "Gugusan pulau karang karst megah di atas laut biru toska, desa wisata perajin noken pandan laut, dan suaka pari manta.",
    historicalSignificance: "Sistem konservasi laut adat Sasi Laut masyarakat adat Raja Ampat melarang penangkapan ikan di musim bertelur.",
    etiquette: {
      dressCode: "Pakaian sopan saat melintas pemukiman desa Arborek, pakaian renang khusus snorkeling di laut.",
      taboos: [
        "Dilarang menyentuh atau mengejar pari manta dan penyu",
        "Dilarang menggunakan tabir surya beracun karang (wajib reef-safe sunscreen)",
        "Dilarang memancing di zona larang-ambil (No-Take Zone) Sasi Adat"
      ],
      rituals: "Upacara Buka Sasi Adat bersama tetua adat Raja Ampat."
    },
    bmkgStation: {
      name: "Stasiun Meteorologi Maritim Sorong / Raja Ampat",
      temperature: 30,
      condition: "Cerah",
      humidity: 72,
      windSpeedKmh: 10,
      waveHeightMeters: 0.6,
      safetyStatus: "AMAN"
    },
    tripPackage: {
      title: "Wayag Karst Climb & Arborek Sasi Laut Experience",
      organizer: "BUMDes Ekowisata Arborek",
      duration: "3 Hari 2 Malam",
      priceIdr: 3200000,
      priceUsd: 210,
      includesGuide: true,
      conservationFeePercent: 2.5
    },
    imageUrl: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80",
    tags: ["Karst", "Sasi Laut", "Manta Ray", "Papua"]
  }
];
