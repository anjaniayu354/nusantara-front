export interface DetectedGeoAudio {
  regionId:
    | "nusantara"
    | "lampung"
    | "bulukumba"
    | "sulawesi"
    | "jawa-barat"
    | "jawa"
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
 * - Lampung: Lagu berhubungan dengan Sriwijaya ("Vibes Of Sriwijaya")
 * - Sulawesi / Bulukumba: Lagu Sulawesi ("Spirit of Sulawesi" / "Instrumen Tari Makassar")
 * - Jawa Barat: Lagu Pajajaran ("Kacapi Suling Klasik Degung Pajajaran") lalu lanjut ke Pencak Silat ("Kendang Pencak Energik")
 * - Jawa: Lagu-lagu Jawa ("Tanah Leluhur - Musik Gamelan Modern Paling Epic")
 * - Kalimantan: Lagu Borneo ("Spirit of Borneo - Legend of Nabau")
 * - Papua: Lagu Papua ("Spirit of Papua - The Last Paradise")
 * - Tidak teridentifikasi: Lagu Nusantara
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

  // 2. Lampung: Lat -6.1 to -3.6, Lng 103.4 to 106.1
  // "jika sedang buka lampung maka lagu di jalankan yang berhubungan dengan sriwijaya"
  if (lat >= -6.1 && lat <= -3.6 && lng >= 103.4 && lng <= 106.1) {
    return {
      regionId: "lampung",
      regionName: "Lampung (Sriwijaya)",
      trackId: "vibes-of-sriwijaya",
      badgeText: "Lampung • Vibes Of Sriwijaya",
      isOverview: false,
      destinationCount: 10,
    };
  }

  // 3. Bulukumba: Lat -5.85 to -5.1, Lng 119.8 to 120.75
  // "ketika di sulawesi atau bulukumba lagu sulawesi"
  if (lat >= -5.85 && lat <= -5.1 && lng >= 119.8 && lng <= 120.75) {
    return {
      regionId: "bulukumba",
      regionName: "Bulukumba (Sulawesi Selatan)",
      trackId: "spirit-of-sulawesi-celebes",
      badgeText: "Bulukumba • Spirit of Sulawesi",
      isOverview: false,
      destinationCount: 8,
    };
  }

  // 4. Sulawesi (General): Lat -6.5 to 2.5, Lng 118.5 to 125.5
  // "ketika di sulawesi atau bulukumba lagu sulawesi"
  if (lat >= -6.5 && lat <= 2.5 && lng >= 118.5 && lng <= 125.5) {
    return {
      regionId: "sulawesi",
      regionName: "Sulawesi",
      trackId: "spirit-of-sulawesi-celebes",
      badgeText: "Sulawesi • Spirit of Sulawesi",
      isOverview: false,
      destinationCount: 8,
    };
  }

  // 5. Jawa Barat (Sunda / Pajajaran): Lat -7.9 to -5.8, Lng 105.8 to 108.85
  // "ketika di jawa barat lagu papajaran lalu di lanjut ke pencaksilat"
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

  // 6. Jawa (Jawa Tengah, DI Yogyakarta, Jawa Timur): Lat -8.8 to -5.8, Lng 108.85 to 114.6
  // "ketika ada di jawa lagu2 jawa di list lagu"
  if (lat >= -8.8 && lat <= -5.8 && lng > 108.85 && lng <= 114.6) {
    return {
      regionId: "jawa",
      regionName: "Tanah Jawa",
      trackId: "tanah-leluhur",
      badgeText: "Jawa • Gamelan Tanah Leluhur",
      isOverview: false,
    };
  }

  // 7. Kalimantan: Lat -4.5 to 4.5, Lng 108.8 to 119.2
  // "ketika di kalimantan lagu borneo"
  if (lat >= -4.5 && lat <= 4.5 && lng >= 108.8 && lng <= 119.2) {
    return {
      regionId: "kalimantan",
      regionName: "Kalimantan (Borneo)",
      trackId: "spirit-of-borneo-nabau",
      badgeText: "Kalimantan • Spirit of Borneo",
      isOverview: false,
    };
  }

  // 8. Papua: Lat -9.2 to 0.5, Lng 130.0 to 141.2
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

  // 9. Bali & Nusa Tenggara: Lat -9.5 to -8.0, Lng 114.4 to 125.0
  if (lat >= -9.5 && lat <= -8.0 && lng >= 114.4 && lng <= 125.0) {
    return {
      regionId: "bali",
      regionName: "Bali & Kepulauan Nusa Tenggara",
      trackId: "spirit-of-bali-barong",
      badgeText: "Bali • Spirit of Bali",
      isOverview: false,
    };
  }

  // 10. Fallback / Unidentified / Samudera
  // "kalau tidak teridentifikasi lagu nusantara"
  return {
    regionId: "nusantara",
    regionName: "Nusantara",
    trackId: "rising-of-nusantara",
    badgeText: "Nusantara • Rising of Nusantara",
    isOverview: true,
  };
}
