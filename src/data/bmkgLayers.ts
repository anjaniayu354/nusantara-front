export interface BmkgLayerOptions {
  radar: boolean;       // Radar Cuaca BMKG (Sidarma Mosaic)
  kilat: boolean;       // Sambaran Kilat Real-time (GeoJSON)
  pwxDarat: boolean;    // Titik Pengamatan Cuaca Darat
  pwxKereta: boolean;   // Cuaca Jalur Kereta Api
  satelit: boolean;     // Citra Satelit Cuaca
  angin: boolean;       // Kecepatan & Arah Angin (Inawis Maritim)
  ais: boolean;         // Kerapatan Kapal Bahari (AIS)
}

export interface BmkgLayerDefinition {
  id: keyof BmkgLayerOptions;
  name: string;
  badge: string;
  category: "atmosfer" | "maritim" | "transportasi";
  description: string;
  iconName: "zap" | "radio" | "mapPin" | "train" | "satellite" | "wind" | "ship";
  colorHex: string;
}

export const BMKG_LAYERS: BmkgLayerDefinition[] = [
  {
    id: "kilat",
    name: "Sambaran Kilat",
    badge: "Real-time",
    category: "atmosfer",
    description: "Deteksi sambaran kilat & aktivitas petir atmosfer langsung dari BMKG",
    iconName: "zap",
    colorHex: "#eab308",
  },
  {
    id: "radar",
    name: "Radar Hujan & Awan",
    badge: "Sidarma WMS",
    category: "atmosfer",
    description: "Citra pantulan radar cuaca resolusi tinggi untuk memantau intensitas hujan",
    iconName: "radio",
    colorHex: "#0ea5e9",
  },
  {
    id: "pwxDarat",
    name: "Stasiun Cuaca Darat",
    badge: "PWX Darat",
    category: "atmosfer",
    description: "Titik stasiun BMKG darat lengkap: suhu, kelembapan, awan & angin kota/kabupaten",
    iconName: "mapPin",
    colorHex: "#22c55e",
  },
  {
    id: "pwxKereta",
    name: "Cuaca Jalur Kereta",
    badge: "PWX Rel",
    category: "transportasi",
    description: "Pemantauan cuaca dan keselamatan sepanjang koridor jalur rel kereta api",
    iconName: "train",
    colorHex: "#6366f1",
  },
  {
    id: "satelit",
    name: "Citra Satelit Cuaca",
    badge: "Himawari IR",
    category: "atmosfer",
    description: "Overlay citra satelit cuaca inframerah sebaran awan kepulauan Nusantara",
    iconName: "satellite",
    colorHex: "#a855f7",
  },
  {
    id: "angin",
    name: "Arah & Kecepatan Angin",
    badge: "Inawis WMS",
    category: "maritim",
    description: "Prakiraan vektor arah dan kecepatan angin permukaan perairan maritim BMKG",
    iconName: "wind",
    colorHex: "#38bdf8",
  },
  {
    id: "ais",
    name: "Kerapatan Kapal (AIS)",
    badge: "AIS Bahari",
    category: "maritim",
    description: "Peta kerapatan lalu lintas kapal dan keselamatan pelayaran Nusantara",
    iconName: "ship",
    colorHex: "#14b8a6",
  },
];

export const DEFAULT_BMKG_LAYERS: BmkgLayerOptions = {
  radar: false,
  kilat: true,
  pwxDarat: false,
  pwxKereta: false,
  satelit: false,
  angin: false,
  ais: false,
};
