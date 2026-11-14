export interface DetectedGeoAudio {
  regionId:
    | "nusantara"
    | "lampung"
    | "bulukumba"
    | "sulawesi"
    | "jawa-barat"
    | "jawa"
    | "banyuwangi"
    | "aceh"
    | "padang"
    | "riau"
    | "sumatera"
    | "kalimantan"
    | "papua"
    | "bali";
  regionName: string;
  trackId: string;
  nextTrackId?: string | null;
  badgeText: string;
  isOverview: boolean;
  destinationCount?: number;
}

/**
 * Detects the geographic region based on map center coordinates and zoom level,
 * resolving the culturally appropriate soundtrack and contextual data indicators.
 *
 * Rules:
 * - Zoom < 7: Target awal buka seluruh Nusantara -> lagu Nusantara ("Rising of Nusantara")
 * - Aceh: Lagu kebanggaan Aceh ("Bungong Jeumpa (Orchestral Cover)")
 * - Padang / Sumbar: Lagu Minangkabau ("Spirit of Sumatra - Mystical Saluang Flute Journey")
 * - Riau / Melayu: Lagu Melayu Riau ("Selayang Pandang (Orchestral Cover)")
 * - Lampung / Sumsel: Lagu bernuansa Sriwijaya ("Vibes Of Sriwijaya")
 * - Banyuwangi: Lagu khas Osing ("Kidung Mantra Suku Osing")
 * - Jawa Barat: Lagu Pajajaran ("Kacapi Suling Klasik Degung Pajajaran") lalu lanjut ke Pencak Silat ("Kendang Pencak Energik")
 * - Jawa: Gending Jawa ("Symphony of Gamelan Majestic Javanese Orchestral Music")
 * - Sulawesi / Bulukumba: Lagu Sulawesi ("Spirit of Sulawesi" / "Instrumen Tari Makassar")
 * - Bali: Gamelan Barong & Kecak ("Spirit of Bali Barong" ➔ "Spirit of Bali Kecak")
 * - Kalimantan: Lagu Borneo ("Spirit of Borneo - Legend of Nabau")
 * - Papua: Lagu Papua ("Spirit of Papua - The Last Paradise")
 * - Fallback: Lagu Nusantara ("Rising of Nusantara")
 */
export function detectRegionFromCoordinates(
  coords: [number, number],
  zoom: number
): DetectedGeoAudio {
  const [lat, lng] = coords;

  // 1. National Overview (Zoom < 7): Target awal buka karena lihat seluruh Indonesia
  if (zoom < 7) {
    return {
      regionId: "nusantara",
      regionName: "Seluruh Nusantara",
      trackId: "rising-of-nusantara",
      badgeText: "Seluruh Nusantara • Musik Gamelan Modern",
      isOverview: true,
      destinationCount: 18,
    };
  }

  // 2. Aceh (Serambi Mekkah): Lat 1.8 to 6.2, Lng 94.8 to 98.4
  // Lagu Aceh Bungong Jeumpa
  if (lat >= 1.8 && lat <= 6.2 && lng >= 94.8 && lng <= 98.4) {
    return {
      regionId: "aceh",
      regionName: "Aceh (Serambi Mekkah)",
      trackId: "bungong-jeumpa-aceh",
      nextTrackId: "spirit-of-sumatra-flower",
      badgeText: "Aceh • Bungong Jeumpa Orchestral",
      isOverview: false,
    };
  }

  // 3. Padang & Sumatera Barat (Minangkabau): Lat -3.5 to 0.3, Lng 98.5 to 101.3
  // Saluang & Talempong Minang Padang
  if (lat >= -3.5 && lat <= 0.3 && lng >= 98.5 && lng <= 101.3) {
    return {
      regionId: "padang",
      regionName: "Padang & Minangkabau (Sumbar)",
      trackId: "spirit-of-sumatra-flower",
      nextTrackId: "selayang-pandang-riau",
      badgeText: "Padang & Minang • Saluang Flute Journey",
      isOverview: false,
    };
  }

  // 4. Riau & Kepulauan Riau (Bumi Melayu): Lat -1.2 to 2.8, Lng 100.0 to 105.5
  // Lagu Melayu Riau Selayang Pandang
  if (lat >= -1.2 && lat <= 2.8 && lng >= 100.0 && lng <= 105.5) {
    return {
      regionId: "riau",
      regionName: "Riau (Bumi Melayu)",
      trackId: "selayang-pandang-riau",
      nextTrackId: "bungong-jeumpa-aceh",
      badgeText: "Riau • Selayang Pandang Melayu",
      isOverview: false,
    };
  }

  // 5. Lampung & Sumatera Selatan: Lat -6.1 to -2.0, Lng 102.5 to 106.3
  // "jika sedang buka lampung maka lagu di jalankan yang berhubungan dengan sriwijaya"
  if (lat >= -6.1 && lat <= -2.0 && lng >= 102.5 && lng <= 106.3) {
    return {
      regionId: "lampung",
      regionName: "Lampung & Sriwijaya",
      trackId: "vibes-of-sriwijaya",
      nextTrackId: "spirit-of-sumatra-flower",
      badgeText: "Sriwijaya • Vibes Of Sriwijaya",
      isOverview: false,
      destinationCount: 10,
    };
  }

  // 6. Sumatera Umum (Sumut / Jambi / Bengkulu fallback)
  if (lat >= -6.1 && lat <= 6.2 && lng >= 94.8 && lng <= 106.5) {
    return {
      regionId: "sumatera",
      regionName: "Sumatera",
      trackId: "spirit-of-sumatra-flower",
      nextTrackId: "vibes-of-sriwijaya",
      badgeText: "Sumatera • Spirit of Sumatra",
      isOverview: false,
    };
  }

  // 7. Banyuwangi (Suku Osing): Lat -8.85 to -7.7, Lng 113.85 to 114.65
  // "di banyuwangi juga sudah ada lagu osing"
  if (lat >= -8.85 && lat <= -7.7 && lng >= 113.85 && lng <= 114.65) {
    return {
      regionId: "banyuwangi",
      regionName: "Banyuwangi (Suku Osing)",
      trackId: "kidung-mantra-osing",
      nextTrackId: "gending-jawa-symphony",
      badgeText: "Banyuwangi • Kidung Mantra Suku Osing",
      isOverview: false,
    };
  }

  // 8. Jawa Barat (Sunda / Pajajaran): Lat -7.9 to -5.8, Lng 105.8 to 108.85
  // "ketika di jawa barat lagu pajajaran lalu di lanjut ke pencaksilat"
  if (lat >= -7.9 && lat <= -5.8 && lng >= 105.8 && lng <= 108.85) {
    return {
      regionId: "jawa-barat",
      regionName: "Jawa Barat (Pajajaran & Pencak Silat)",
      trackId: "kacapi-suling-pajajaran",
      nextTrackId: "kendang-pencak-silat",
      badgeText: "Jawa Barat • Suling Pajajaran ➔ Pencak Silat",
      isOverview: false,
    };
  }

  // 9. Jawa (Jawa Tengah, DI Yogyakarta, Jawa Timur): Lat -8.8 to -5.8, Lng 108.85 to 114.6
  // "di jawa ada gending gunakan itu"
  if (lat >= -8.8 && lat <= -5.8 && lng > 108.85 && lng <= 114.6) {
    return {
      regionId: "jawa",
      regionName: "Tanah Jawa (Gending Jawa)",
      trackId: "gending-jawa-symphony",
      nextTrackId: "tanah-leluhur",
      badgeText: "Jawa • Symphony of Gamelan (Gending)",
      isOverview: false,
    };
  }

  // 10. Bulukumba: Lat -5.85 to -5.1, Lng 119.8 to 120.75
  // "ketika di sulawesi atau bulukumba lagu sulawesi"
  if (lat >= -5.85 && lat <= -5.1 && lng >= 119.8 && lng <= 120.75) {
    return {
      regionId: "bulukumba",
      regionName: "Bulukumba (Sulawesi Selatan)",
      trackId: "instrumen-tari-makassar",
      nextTrackId: "spirit-of-sulawesi-celebes",
      badgeText: "Bulukumba • Instrumen Tari Makassar",
      isOverview: false,
      destinationCount: 8,
    };
  }

  // 11. Sulawesi (General): Lat -6.5 to 2.5, Lng 118.5 to 125.5
  // "ketika di sulawesi atau bulukumba lagu sulawesi"
  if (lat >= -6.5 && lat <= 2.5 && lng >= 118.5 && lng <= 125.5) {
    return {
      regionId: "sulawesi",
      regionName: "Sulawesi",
      trackId: "spirit-of-sulawesi-celebes",
      nextTrackId: "instrumen-tari-makassar",
      badgeText: "Sulawesi • Spirit of Sulawesi",
      isOverview: false,
      destinationCount: 8,
    };
  }

  // 12. Bali & Nusa Tenggara: Lat -9.5 to -8.0, Lng 114.4 to 125.0
  if (lat >= -9.5 && lat <= -8.0 && lng >= 114.4 && lng <= 125.0) {
    return {
      regionId: "bali",
      regionName: "Bali & Kepulauan Nusa Tenggara",
      trackId: "spirit-of-bali-barong",
      nextTrackId: "spirit-of-bali-kecak",
      badgeText: "Bali • Spirit of Bali & Kecak",
      isOverview: false,
    };
  }

  // 13. Kalimantan: Lat -4.5 to 4.5, Lng 108.8 to 119.2
  // "ketika di kalimantan lagu borneo"
  if (lat >= -4.5 && lat <= 4.5 && lng >= 108.8 && lng <= 119.2) {
    return {
      regionId: "kalimantan",
      regionName: "Kalimantan (Borneo)",
      trackId: "spirit-of-borneo-nabau",
      nextTrackId: "borneo-wooden-pulse",
      badgeText: "Kalimantan • Spirit of Borneo",
      isOverview: false,
    };
  }

  // 14. Papua: Lat -9.2 to 0.5, Lng 130.0 to 141.2
  // "ketika di papua lagu papua"
  if (lat >= -9.2 && lat <= 0.5 && lng >= 130.0 && lng <= 141.2) {
    return {
      regionId: "papua",
      regionName: "Papua",
      trackId: "spirit-of-papua-paradise",
      badgeText: "Papua • Spirit of Papua",
      isOverview: false,
    };
  }

  // 15. Fallback / Unidentified / Samudera
  // "kalau tidak teridentifikasi lagu nusantara"
  return {
    regionId: "nusantara",
    regionName: "Nusantara",
    trackId: "rising-of-nusantara",
    badgeText: "Nusantara • Rising of Nusantara",
    isOverview: true,
  };
}
