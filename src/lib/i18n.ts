// ========================================================
// i18n — Internationalization Utility & Dictionaries
// Default Language: "EN" (English)
// Supported Languages: "EN" | "ID"
// ========================================================

export type Language = "EN" | "ID";

const STORAGE_KEY = "nusantara_lang";
const LANG_CHANGE_EVENT = "nusantara-lang-change";

/**
 * Get active language from localStorage, defaults to "EN"
 */
export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "EN";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ID" || saved === "EN") {
      return saved;
    }
    // Default is English
    return "EN";
  } catch {
    return "EN";
  }
}

/**
 * Persist language selection and dispatch custom event
 */
export function setStoredLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute("lang", lang.toLowerCase());
    window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: lang }));
  } catch (err) {
    console.error("Failed to save language:", err);
  }
}

/**
 * Subscribe to language changes across components
 */
export function subscribeLanguage(callback: (lang: Language) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (event: Event) => {
    const custom = event as CustomEvent<Language>;
    if (custom.detail) {
      callback(custom.detail);
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      if (event.newValue === "ID" || event.newValue === "EN") {
        callback(event.newValue as Language);
      }
    }
  };

  window.addEventListener(LANG_CHANGE_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(LANG_CHANGE_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

// ========================================================
// UI TRANSLATION DICTIONARY
// ========================================================

export const DICTIONARY = {
  EN: {
    topBar: {
      location: "South Sulawesi & Lampung, Indonesia",
      bmkgSulawesi: "BMKG Telemetry: Paotere Station / Bulukumba — Safe Maritime Weather (29°C)",
      bmkgLampung: "BMKG Telemetry: Panjang Station / Lampung — Safe Maritime Weather (30°C)",
      bmkgAll: "BMKG Telemetry: Safe Maritime Weather Monitored",
    },
    nav: {
      brandSub: "Cultural Heritage & Geospatial Exploration",
      home: "Home",
      destinations: "Cultural Destinations",
      eventRadar: "Event Radar",
      barHalaAi: "Bar Hala AI",
      highlights: "Highlights",
      testimonials: "Traveler Reviews",
      contact: "Contact",
      adventureMap: "Adventure Map",
      mapShort: "Map",
      selectProvince: "Select Province",
      allProvinces: "All Provinces",
      allProvincesSub: "35 Heritage Destinations & 13 Cultural Events",
      sulawesi: "South Sulawesi",
      sulawesiSub: "Bulukumba, Pinisi Shipyards & Kajang Customs (8 Destinations)",
      lampung: "Lampung (Sumatra)",
      lampungSub: "Way Kambas, Anak Krakatau & Kiluan (10 Destinations)",
      targetProvince: "Target Province",
      filterPortal: "Filter Portal Content",
      guestUser: "Guest Explorer",
      notLoggedIn: "Not signed in",
      activeSession: "Active Adventurer Session",
      guestMode: "Guest Mode",
      interactiveMap: "Interactive Adventure Map",
      consultAi: "Consult Bar Hala AI",
      logout: "Log Out",
      login: "Sign In",
    },
    subNav: {
      allDestinations: "All Destinations",
      bulukumba: "Bulukumba (S. Sulawesi)",
      lampung: "Lampung (Sumatra)",
      marine: "Marine & Fisheries",
      indigenous: "Indigenous Villages & Heritage",
      forests: "National Parks & Flora Fauna",
      highlights: "Key Highlights",
      eventRadar: "Cultural Event Radar",
      askAi: "Ask Bar Hala AI",
      travelerVoices: "Traveler Voices",
      contactInfo: "Contact & Info",
    },
    hero: {
      tagline: "Time To Explore",
      title1: "Travel Beyond Limits,",
      title2: "Create Memories",
      titleCreate: "Create",
      titleHighlight: "Memories",
      descAll:
        "Discover the wonders of 35 curated destinations across Indonesia. Explore living culture, natural resources, agriculture, herbal medicine, marine & fisheries, and flora & fauna sanctuaries with verified BMKG science.",
      descSulawesi:
        "Discover the wonders of 8 curated cultural destinations in South Sulawesi. Immerse in Panrita Lopi maritime shipbuilding, UNESCO Pinisi heritage, and the noble simplicity of Ammatoa Kajang.",
      descLampung:
        "Discover the wonders of 10 curated cultural destinations in Lampung. Experience the splendor of gold-threaded Tapis weaving, Way Kambas elephant sanctuary, and the historic caldera of Anak Krakatau.",
      exploreBtn: "Explore Destinations",
      askAiBtn: "Ask Bar Hala AI",
    },
    searchBox: {
      regionLabel: "Select Region",
      regionAll: "All Archipelago Regions (Indonesia)",
      regionSulawesi: "South Sulawesi",
      regionLampung: "Lampung",
      categoryLabel: "Thematic Category",
      categoryAll: "All Categories",
      categorySea: "Marine & Coastal",
      categoryCulture: "Indigenous Villages & Traditions",
      categoryForest: "Forest & Conservation",
      categoryMountain: "Volcanic & Mountains",
      categoryAgro: "Agrotourism & Plantations",
      seasonLabel: "Season & Schedule",
      seasonAll: "Anytime (Flexible)",
      seasonFestival: "Festival Season (Nov-Dec)",
      seasonMaritime: "Pinisi Sailing Season (Clear)",
      seasonHarvest: "Harvest Season (Coffee & Spice)",
      travelersLabel: "Travelers",
      traveler1: "1 Person (Solo Explorer)",
      traveler2: "2 People (Couple / Friends)",
      traveler4: "Family (4-5 People)",
      traveler10: "Expedition Group (10+)",
      searchBtn: "Find Destinations",
    },
    valueProps: {
      prop1Title: "Verified Heritage Data",
      prop1Desc: "Customary traditions, textiles, and historical records validated directly by local indigenous elders.",
      prop2Title: "24/7 Bar Hala AI",
      prop2Desc: "Intelligent companion ready to guide dress codes, cultural taboos, and ancestral philosophy.",
      prop3Title: "Curated Destinations",
      prop3Desc: "35 curated destinations across Indonesia with profound cultural, natural, and agricultural heritage.",
      prop4Title: "BMKG Maritime Science",
      prop4Desc: "Real-time maritime weather, temperature, wind, and wave height telemetry for safe voyages.",
    },
    destinations: {
      badgeSulawesi: "SOUTH SULAWESI",
      badgeLampung: "LAMPUNG",
      badgeAll: "ALL INDONESIA",
      available: "Available",
      titleSulawesi: "South Sulawesi Cultural Destinations",
      titleLampung: "Lampung Cultural Destinations",
      titleAll: "Featured Destinations Across Indonesia",
      descSulawesi:
        "Breathtaking destinations showcasing Pinisi maritime heritage, handwoven textiles, and Ammatoa customary wisdom in Bulukumba, South Sulawesi.",
      descLampung:
        "Breathtaking destinations showcasing Sumatran elephant conservation, gold Tapis textiles, and Sunda Strait coastal beauty in Lampung.",
      descAll:
        "Most captivating destinations showcasing living heritage, natural resources, agriculture, herbal medicine, marine & fisheries, and flora & fauna across Indonesia.",
      viewAllOnMap: "View All on Adventure Map",
      emptyFilter: "No destinations match the active filter",
      resetFilter: "Reset Filter",
      sulselPill: "S. Sulawesi",
      lampungPill: "Lampung",
      estPackage: "Estimated Package",
      mapBtn: "Map",
      durationPrefix: "",
      bmkgPrefix: "BMKG",
    },
    specialOffer: {
      badgeSulawesi: "Special Edition: South Sulawesi",
      badgeLampung: "Special Edition: Lampung",
      badgeAll: "Special Cultural Edition",
      headingSulawesi: "Pinisi & Kajang Expedition!",
      headingLampung: "Krakatau & Way Kambas Journey!",
      headingAll: "Adventure Awaits!",
      descSulawesi:
        "Get an exclusive curated cultural package for sailing Pinisi schooners in Tana Beru, Tanjung Bira flour sand, and Ammatoa Kajang living traditions.",
      descLampung:
        "Get an exclusive curated cultural package exploring the caldera of Anak Krakatau, dolphins of Kiluan Bay, and Way Kambas elephant sanctuary.",
      descAll:
        "Get an exclusive curated cultural package for the Bira Pinisi schooner routes and historic Anak Krakatau caldera expeditions.",
      exploreRoute: "Explore Route",
    },
    whyChooseUs: {
      badge: "CORE VALUES",
      title: "Why Choose Nusa Antara?",
      desc: "The first geospatial cultural exploration platform combining ancestral local wisdom with artificial intelligence and scientific telemetry.",
      feature1Title: "Expert Cultural Guides",
      feature1Desc: "Directly guided by indigenous elders and master Panrita Lopi shipbuilders with generational knowledge.",
      feature2Title: "Integrated Trip Planner",
      feature2Desc: "Save favorite destinations, estimate costs, and schedule itineraries effortlessly in the Trip Plan drawer.",
      feature3Title: "Authentic Experiences",
      feature3Desc: "Engage in traditional gold Tapis embroidery, maritime sea-blessing rituals, and hand-carving wooden boats.",
      feature4Title: "Trusted by Travelers",
      feature4Desc: "Embraced by thousands of explorers, researchers, and cultural enthusiasts across the Indonesian archipelago.",
    },
    reviews: {
      badge: "TESTIMONIALS",
      title: "What Our Travelers Say",
      desc: "Authentic stories from adventurers who immersed in cultural wonders and pristine nature with Nusa Antara.",
      openMap: "Open Adventure Map",
      verified: "Verified Review",
    },
    radarEvent: {
      badge: "CULTURAL AGENDA",
      scheduled: "Scheduled Events",
      title: "Annual Cultural Radar & Festivals",
      descSulawesi: "Featuring maritime Pinisi festivals and Ammatoa rituals in Bulukumba and surrounding regions.",
      descLampung: "Featuring Sekura mask festivals, Krakatau carnivals, and elephant festivals in Lampung.",
      descAll: "Curated annual cultural festival agenda across South Sulawesi & Lampung.",
      openRadarMap: "Open Radar on Map",
      locationOnMap: "Location on Map →",
      daysLeft: "days left",
      empty: "No events found for this region.",
    },
    newsletter: {
      title: "Subscribe to Nusantara Cultural Dispatch",
      desc: "Receive cultural festival alerts, hidden exploration routes, and BMKG weather forecasts straight to your inbox.",
      placeholder: "Enter your email address...",
      subscribeBtn: "Subscribe",
      success: "✓ Thank you! You have subscribed to the Nusa Antara Cultural Dispatch.",
    },
    footer: {
      brandDesc:
        "Trusted cultural exploration companion preserving Nusantara's ancestral heritage through geospatial mapping and artificial intelligence.",
      quickLinks: "Quick Links",
      portalHome: "Portal Home",
      adventureMap: "Adventure Map",
      curatedDest: "Curated Destinations",
      culturalRadar: "Cultural Event Radar",
      aiAssistant: "Bar Hala AI Assistant",
      loginAuth: "Sign In / Authentication",
      favDest: "Favorite Destinations",
      travelerGuide: "Traveler Guides",
      guideEtiquette: "Customary Dress & Etiquette",
      guideTaboos: "Local Customary Taboos",
      guideBmkg: "BMKG Maritime Telemetry",
      guideWastra: "Tapis & Wastra Philosophy",
      guideFaq: "Exploration FAQ",
      supportPartners: "Support & Partnerships",
      supportHours: "Monday - Sunday: 08:00 - 20:00 WITA",
      sciencePartners: "Science Data Partners:",
      copyright: "© 2026 Nusa Antara. All Rights Reserved.",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      customaryCode: "Customary Guidelines",
    },
    aiModal: {
      title: "Bar Hala AI",
      sub: "Intelligent Customary & Geospatial Guide",
      promptKajang: "Kajang Customs & Etiquette",
      promptTapis: "Meaning of Tapis Weaving",
      promptPinisi: "Pinisi Shipbuilding Process",
      placeholder: "Ask about customs, textiles, or routes...",
      greeting:
        "Greetings! I am Bar Hala AI, your cultural companion for Nusa Antara. How can I assist you with customary etiquette, textile philosophies, or destination recommendations in Bulukumba & Lampung?",
    },
  },
  ID: {
    topBar: {
      location: "Sulawesi Selatan & Lampung, Indonesia",
      bmkgSulawesi: "BMKG Telemetry: Stasiun Paotere / Bulukumba — Cuaca Aman (29°C)",
      bmkgLampung: "BMKG Telemetry: Stasiun Panjang / Lampung — Cuaca Aman (30°C)",
      bmkgAll: "BMKG Telemetry: Cuaca Aman Terpantau",
    },
    nav: {
      brandSub: "Pusaka Kebudayaan & Wisata Geospasial",
      home: "Beranda",
      destinations: "Destinasi Budaya",
      eventRadar: "Radar Event",
      barHalaAi: "Bar Hala AI",
      highlights: "Keunggulan",
      testimonials: "Suara Penjelajah",
      contact: "Kontak",
      adventureMap: "Peta Petualangan",
      mapShort: "Peta",
      selectProvince: "Pilih Provinsi",
      allProvinces: "Semua Provinsi",
      allProvincesSub: "35 Destinasi Pusaka & 13 Event Budaya",
      sulawesi: "Sulawesi Selatan",
      sulawesiSub: "Bulukumba, Tana Beru Pinisi & Adat Kajang (8 Destinasi)",
      lampung: "Lampung (Sumatera)",
      lampungSub: "Way Kambas, Anak Krakatau & Kiluan (10 Destinasi)",
      targetProvince: "Tujuan Provinsi",
      filterPortal: "Filter Konten Portal",
      guestUser: "Tamu Penjelajah",
      notLoggedIn: "Belum masuk akun",
      activeSession: "Sesi Petualang Aktif",
      guestMode: "Mode Tamu",
      interactiveMap: "Peta Petualangan Interaktif",
      consultAi: "Konsultasi Bar Hala AI",
      logout: "Keluar / Logout",
      login: "Masuk ke Akun",
    },
    subNav: {
      allDestinations: "Semua Destinasi",
      bulukumba: "Bulukumba (Sulsel)",
      lampung: "Lampung (Sumatera)",
      marine: "Laut & Perikanan",
      indigenous: "Desa Adat & Warisan",
      forests: "Taman Nasional & Flora Fauna",
      highlights: "Keunggulan Layanan",
      eventRadar: "Radar Event Festival",
      askAi: "Tanya Bar Hala AI",
      travelerVoices: "Suara Penjelajah",
      contactInfo: "Kontak & Info",
    },
    hero: {
      tagline: "Time To Explore",
      title1: "Jelajahi Melampaui Batas,",
      title2: "Ciptakan Kenangan",
      titleCreate: "Ciptakan",
      titleHighlight: "Kenangan",
      descAll:
        "Temukan keajaiban 35 destinasi terkurasi di seluruh kepulauan Indonesia. Selami tradisi adat, sumber daya alam, pertanian, tanaman obat herbal, kekayaan laut & perikanan, serta suaka flora dan fauna dengan panduan sains cuaca BMKG.",
      descSulawesi:
        "Temukan keajaiban 8 destinasi budaya terkurasi di Sulawesi Selatan. Selami tradisi maritim Panrita Lopi, mahakarya perahu Pinisi UNESCO, dan kesederhanaan adat Ammatoa Kajang.",
      descLampung:
        "Temukan keajaiban 10 destinasi budaya terkurasi di Lampung. Selami kemegahan kain Tapis bertabur emas, suaka gajah Way Kambas, dan kaldera bersejarah Anak Krakatau.",
      exploreBtn: "Eksplor Destinasi",
      askAiBtn: "Tanya Bar Hala AI",
    },
    searchBox: {
      regionLabel: "Pilih Wilayah",
      regionAll: "Semua Wilayah Nusantara (Indonesia)",
      regionSulawesi: "Sulawesi Selatan",
      regionLampung: "Lampung",
      categoryLabel: "Kategori Tematik",
      categoryAll: "Semua Kategori",
      categorySea: "Laut / Ikan & Bahari",
      categoryCulture: "Desa Adat & Tradisi",
      categoryForest: "Flora & Fauna Rimba",
      categoryMountain: "Sumber Alam & Geologi",
      categoryAgro: "Pertanian & Perkebunan",
      seasonLabel: "Musim & Jadwal",
      seasonAll: "Kapan Saja (Fleksibel)",
      seasonFestival: "Musim Festival Adat (Nov-Des)",
      seasonMaritime: "Musim Berlayar Pinisi (Cerah)",
      seasonHarvest: "Musim Panen Kopi & Rempah",
      travelersLabel: "Penjelajah",
      traveler1: "1 Orang (Solo Explorer)",
      traveler2: "2 Orang (Pasangan / Sahabat)",
      traveler4: "Keluarga (4-5 Orang)",
      traveler10: "Rombongan Ekspedisi (10+)",
      searchBtn: "Cari Destinasi",
    },
    valueProps: {
      prop1Title: "Data Terverifikasi",
      prop1Desc: "Informasi adat, wastra, dan sejarah divalidasi langsung oleh pemangku adat lokal.",
      prop2Title: "24/7 Bar Hala AI",
      prop2Desc: "Asisten cerdas siaga memandu etika berpakaian, pantangan tabu, dan filosofi kebudayaan.",
      prop3Title: "Destinasi Terkurasi",
      prop3Desc: "35 destinasi terkurasi di seluruh kepulauan Indonesia dengan nilai pusaka alam, pertanian & budaya tinggi.",
      prop4Title: "Sains BMKG Maritim",
      prop4Desc: "Pemantauan cuaca maritim, suhu, angin, dan tinggi gelombang real-time untuk keamanan.",
    },
    destinations: {
      badgeSulawesi: "SULAWESI SELATAN",
      badgeLampung: "LAMPUNG",
      badgeAll: "SELURUH INDONESIA",
      available: "Tersedia",
      titleSulawesi: "Destinasi Budaya Sulawesi Selatan",
      titleLampung: "Destinasi Budaya Lampung",
      titleAll: "Destinasi Unggulan Nusantara",
      descSulawesi:
        "Rekomendasi destinasi memesona dengan kekayaan maritim Pinisi, wastra tenun, dan kearifan adat Ammatoa di Bulukumba, Sulawesi Selatan.",
      descLampung:
        "Rekomendasi destinasi memesona dengan konservasi gajah Sumatera, kemegahan kain Tapis emas, dan pesona bahari Selat Sunda di Lampung.",
      descAll:
        "Rekomendasi destinasi paling memesona dengan kekayaan sumber alam, pertanian, tanaman obat herbal, laut & perikanan, serta flora & fauna di seluruh Indonesia.",
      viewAllOnMap: "Lihat Semua di Peta Petualangan",
      emptyFilter: "Tidak ada destinasi yang cocok dengan filter aktif",
      resetFilter: "Reset Filter",
      sulselPill: "Sulsel",
      lampungPill: "Lampung",
      estPackage: "Estimasi Paket",
      mapBtn: "Peta",
      durationPrefix: "",
      bmkgPrefix: "BMKG",
    },
    specialOffer: {
      badgeSulawesi: "Edisi Khusus Sulawesi Selatan",
      badgeLampung: "Edisi Khusus Lampung",
      badgeAll: "Edisi Khusus Budaya",
      headingSulawesi: "Ekspedisi Pinisi & Kajang!",
      headingLampung: "Jelajah Krakatau & Way Kambas!",
      headingAll: "Petualangan Menanti!",
      descSulawesi:
        "Dapatkan paket kurasi budaya eksklusif untuk pelayaran perahu Pinisi di Tana Beru, pasir tepung Tanjung Bira, dan kearifan adat Ammatoa Kajang.",
      descLampung:
        "Dapatkan paket kurasi budaya eksklusif penjelajahan kaldera Anak Krakatau, lumba-lumba Teluk Kiluan, dan suaka gajah Way Kambas.",
      descAll:
        "Dapatkan paket kurasi budaya eksklusif untuk rute pelayaran kapal Pinisi Bira dan penjelajahan kaldera Anak Krakatau.",
      exploreRoute: "Jelajahi Rute",
    },
    whyChooseUs: {
      badge: "NILAI KEUNGGULAN",
      title: "Mengapa Memilih Nusa Antara?",
      desc: "Platform penjelajahan budaya geospasial pertama yang memadukan kearifan lokal leluhur dengan kecerdasan buatan dan telemetri sains.",
      feature1Title: "Pemandu Budaya Ahli",
      feature1Desc: "Didampingi pemangku adat dan pembuat kapal Panrita Lopi berpengalaman secara langsung.",
      feature2Title: "Rencana Rute Terpadu",
      feature2Desc: "Simpan destinasi favorit dan buat estimasi biaya serta jadwal perjalanan di Trip Plan.",
      feature3Title: "Pengalaman Otentik",
      feature3Desc: "Terlibat dalam proses menenun Tapis emas, ritual tolak bala laut, dan pembuatan perahu.",
      feature4Title: "Dipercaya Penjelajah",
      feature4Desc: "Telah dinikmati ribuan pelancong dan peneliti kebudayaan dari seluruh penjuru Nusantara.",
    },
    reviews: {
      badge: "TESTIMONI",
      title: "Apa Kata Para Penjelajah?",
      desc: "Cerita nyata dari penjelajah yang telah menyelami keajaiban adat dan keindahan alam bersama Nusa Antara.",
      openMap: "Buka Peta Petualangan",
      verified: "Ulasan Terverifikasi",
    },
    radarEvent: {
      badge: "AGENDA KEBUDAYAAN",
      scheduled: "Event Terjadwal",
      title: "Radar Event & Festival Tahunan",
      descSulawesi: "Menampilkan festival maritim Pinisi dan ritual adat Ammatoa di Bulukumba & sekitarnya.",
      descLampung: "Menampilkan pesta Sekura, karnaval Krakatau, dan festival gajah di Lampung.",
      descAll: "Agenda festival kebudayaan terkurasi di Sulawesi Selatan & Lampung.",
      openRadarMap: "Buka Radar di Peta",
      locationOnMap: "Lokasi di Peta →",
      daysLeft: "Hari lagi",
      empty: "Tidak ada event yang ditemukan untuk wilayah ini.",
    },
    newsletter: {
      title: "Berlangganan Warta Budaya Nusantara",
      desc: "Dapatkan info radar festival adat, rute penjelajahan tersembunyi, dan panduan cuaca BMKG langsung di email Anda.",
      placeholder: "Masukkan alamat email Anda...",
      subscribeBtn: "Langganan",
      success: "✓ Terima kasih! Anda telah terdaftar dalam buletin Warta Budaya Nusa Antara.",
    },
    footer: {
      brandDesc:
        "Mitra penjelajahan budaya terpercaya untuk merawat warisan kearifan lokal Nusantara melalui integrasi geospasial dan kecerdasan buatan.",
      quickLinks: "Tautan Cepat",
      portalHome: "Beranda Portal",
      adventureMap: "Peta Petualangan",
      curatedDest: "Destinasi Terkurasi",
      culturalRadar: "Radar Event Budaya",
      aiAssistant: "Asisten Bar Hala AI",
      loginAuth: "Masuk / Autentikasi",
      favDest: "Destinasi Favorit",
      travelerGuide: "Panduan Penjelajah",
      guideEtiquette: "Etika & Busana Adat",
      guideTaboos: "Pantangan Tabu Lokal",
      guideBmkg: "Telemetri Maritim BMKG",
      guideWastra: "Filosofi Wastra & Tapis",
      guideFaq: "FAQ Penjelajahan",
      supportPartners: "Layanan & Kemitraan",
      supportHours: "Senin - Minggu: 08.00 - 20.00 WITA",
      sciencePartners: "Mitra Data Sains:",
      copyright: "© 2026 Nusa Antara. Seluruh Hak Cipta Dilindungi.",
      terms: "Syarat & Ketentuan",
      privacy: "Kebijakan Privasi",
      customaryCode: "Pedoman Etika Adat",
    },
    aiModal: {
      title: "Bar Hala AI",
      sub: "Asisten Cerdas Adat & Wisata Geospasial",
      promptKajang: "Etika Adat Kajang",
      promptTapis: "Makna Wastra Tapis",
      promptPinisi: "Pembuatan Pinisi",
      placeholder: "Tanyakan etika, wastra, atau rute...",
      greeting:
        "Sampurasun! Saya Bar Hala AI, panduan kebudayaan Nusa Antara. Ada yang ingin Anda tanyakan seputar etika adat, filosofi wastra, atau rekomendasi destinasi di Bulukumba & Lampung?",
    },
  },
};

export interface LocalizedDest {
  name: string;
  subtitle: string;
  description: string;
  duration: string;
}

export const DESTINATION_TRANSLATIONS_EN: Record<string, LocalizedDest> = {
  "bulukumba-bira": {
    name: "Tanjung Bira Beach & Bonto Bahari Cliffs",
    subtitle: "Flour-Sand Marine Tourism & Gateway of Panrita Lopi Mariners",
    description:
      "Beach with white sand as soft as flour meeting three-tone ocean gradients (turquoise, light blue, and sapphire). Located at the southernmost peninsula of South Sulawesi, Bira is the legendary maritime gate where Konjo and Bugis mariners test Pinisi ships.",
    duration: "3 Days / 2 Nights",
  },
  "bulukumba-tana-beru": {
    name: "Tana Beru Traditional Pinisi Shipyard",
    subtitle: "Living Maritime World Heritage — Master Panrita Lopi Shipbuilders",
    description:
      "The world's largest open-air wooden shipyard where legendary Bugis-Konjo Pinisi schooners are built completely by hand using ironwood (ulin) and ancient oral wisdom without written blueprints.",
    duration: "2 Days / 1 Night",
  },
  "bulukumba-ammatoa-kajang": {
    name: "Ammatoa Kajang Indigenous Forest Area",
    subtitle: "Living Pasang Ri Kajang Tradition & Sacred Forest Conservation",
    description:
      "Sacred ancestral village living by the Kamase-mase philosophy of modesty. All residents and visitors wear solid black attire, walk barefoot, and forbid modern electronics to live in profound harmony with mother nature.",
    duration: "3 Days / 2 Nights",
  },
  "bulukumba-appalarang": {
    name: "Apparalang Coral Cliffs & Navigational Coast",
    subtitle: "Dramatic Coral Terraces & Hidden Maritime Caves",
    description:
      "Towering limestone cliffs rising directly from emerald waters, historic lookout points for ancient navigators.",
    duration: "1 Day",
  },
  "bulukumba-donggia": {
    name: "Donggia Kahayya Pine Hill Peak",
    subtitle: "Highland Arabica Coffee Plantations & Mountain Vistas",
    description:
      "Scenic highland peak surrounded by fragrant Arabica coffee plantations and cool morning mountain mist.",
    duration: "2 Days / 1 Night",
  },
  "bulukumba-bakung-bonto-bahari": {
    name: "Bakung Beach & Pinisi Dockyard",
    subtitle: "Traditional Boat Launching & Coastal Villages",
    description:
      "A picturesque coastal village known for authentic boat-launching ceremonies and vibrant marine life.",
    duration: "1 Day",
  },
  "bulukumba-liukang-loe": {
    name: "Liukang Loe Island Coral Sanctuary",
    subtitle: "Island Snorkeling & Sea Turtle Conservation",
    description:
      "Pristine offshore island offering crystal-clear snorkeling reefs, marine biodiversity, and sea turtle conservation.",
    duration: "1 Day",
  },
  "bulukumba-pantai-marumasa": {
    name: "Marumasa Beach & Limestone Cliffs",
    subtitle: "Scenic Coastal Caves & Panoramic Vistas",
    description:
      "Dramatic limestone coast with private white sand alcoves and natural marine caves.",
    duration: "1 Day",
  },
  "lampung-kiluan": {
    name: "Kiluan Dolphin Bay & Sunda Strait",
    subtitle: "Wild Dolphin Migrations & Marine Wildlife Paradise",
    description:
      "Serene coastal haven renowned for sunrise dolphin safaris where hundreds of spinner and bottlenose dolphins leap freely in the open waters of the Sunda Strait.",
    duration: "2 Days / 1 Night",
  },
  "lampung-way-kambas": {
    name: "Way Kambas National Park",
    subtitle: "Sumatran Elephant Sanctuary & Lowland Rainforest Conservation",
    description:
      "World-famous national park and sanctuary dedicated to the conservation of endangered Sumatran elephants, Sumatran rhinos, and tapirs in vast coastal savanna and lowland rainforest ecosystems.",
    duration: "3 Days / 2 Nights",
  },
  "lampung-krakatau": {
    name: "Anak Krakatau Active Volcano Caldera",
    subtitle: "Historic Volcanic Caldera & Marine Geology Expedition",
    description:
      "Legendary active volcano born from the 1883 Krakatoa eruption, rising dramatically from the Sunda Strait surrounded by black volcanic sand and thriving coral reefs.",
    duration: "2 Days / 1 Night",
  },
  "lampung-pahawang": {
    name: "Pahawang Island Coral Gardens",
    subtitle: "Clownfish Anemones & Marine Ecosystem",
    description:
      "Idyllic tropical island world renowned for vibrant underwater clownfish anemone gardens and shallow white-sand bridges.",
    duration: "2 Days / 1 Night",
  },
  "lampung-gigi-hiu": {
    name: "Gigi Hiu Pegadungan Coastal Rocks",
    subtitle: "Towering Shark-Tooth Rock Formations & Indian Ocean Surf",
    description:
      "Otherworldly coastal seascape featuring jagged, shark-tooth rock needles rising more than 10 meters against roaring oceanic waves.",
    duration: "1 Day",
  },
  "lampung-tapis-sukaraja": {
    name: "Negeri Katon & Sukaraja Tapis Weaving Center",
    subtitle: "Gold-Threaded Tapis Wastra & Customary Pepadun Embroidery",
    description:
      "The heartland of authentic Lampung Tapis weaving where artisans spend months hand-embroidering pure gold threads into sacred ceremonial heirloom textiles.",
    duration: "1 Day",
  },
  "lampung-danau-ranau": {
    name: "Lake Ranau & Mount Seminung Foot",
    subtitle: "Highland Volcanic Lake & Robusta Coffee Agro-Reserve",
    description:
      "The second largest volcanic lake in Sumatra, framed by the majestic Mount Seminung and historic coffee farms.",
    duration: "2 Days / 1 Night",
  },
  "lampung-batu-tegi": {
    name: "Batu Tegi Forest Hydro-Reserve",
    subtitle: "Catchment Lake & Lowland Wildlife Sanctuary",
    description:
      "Serene engineering marvel surrounded by dense tropical foliage, a haven for native birds and primates.",
    duration: "1 Day",
  },
  "lampung-teluk-semangka": {
    name: "Semangka Bay Coastal Headland",
    subtitle: "Deep Blue Bay & Traditional Coastal Fishing Culture",
    description:
      "Vast horseshoe bay with deep sapphire waters, maritime history, and authentic coastal fishing communities.",
    duration: "1 Day",
  },
  "lampung-curup-tujuh": {
    name: "Curup Tujuh Rainforest Waterfalls",
    subtitle: "Seven-Tier Cascade & Jungle Trekking",
    description:
      "Majestic seven-tier rainforest waterfall hidden within protected tropical nature reserves.",
    duration: "1 Day",
  },
};

export const EVENT_TRANSLATIONS_EN: Record<
  string,
  { name: string; description: string; dateRange: string }
> = {
  "evt-pinisi-2026": {
    name: "Bulukumba Pinisi Festival 2026",
    description:
      "Annual maritime parade celebrating the craft of master Panrita Lopi boatbuilders and the launching of Pinisi schooners into Bira waters.",
    dateRange: "20 - 24 September 2026",
  },
  "evt-sekura-2026": {
    name: "Lampung West Sekura Mask Festival 2026",
    description:
      "Ancient post-Ramadan thanksgiving carnival featuring traditional wooden masks, martial arts, and ancestral customary pageants.",
    dateRange: "14 - 18 April 2026",
  },
  "evt-krakatau-2026": {
    name: "Krakatau Cultural Carnival 2026",
    description:
      "Sunda Strait volcanic voyage celebration with Tapis royal fashion parades and coastal maritime races.",
    dateRange: "10 - 14 July 2026",
  },
  "evt-kajang-2026": {
    name: "Andingingi Ammatoa Customary Cleansing Ritual",
    description:
      "Solemn annual sacred rite inside Ammatoa indigenous forest to cleanse the land and preserve nature harmony.",
    dateRange: "05 - 08 November 2026",
  },
  "evt-waykambas-2026": {
    name: "Way Kambas Wildlife & Eco-Festival 2026",
    description:
      "Elephant conservation jamboree, environmental stewardship workshops, and Lampung art performances.",
    dateRange: "22 - 25 August 2026",
  },
};
