export type MapBaseStyle =
  | "osm"       // Jalan / Standar OSM
  | "satelit"   // Mode Satelit (Esri World Imagery)
  | "gunung"    // Gunung / Topo Relief (Esri World Topo / Shaded Relief)
  | "kontur"    // Kontur & Elevasi (OpenTopoMap Isoline)
  | "malam"     // Mode Malam (CartoDB Dark Matter)
  | "bahari";   // Mode Bahari / Maritim (Carto Voyager / OpenSeaMap)

export interface MapLayerOptions {
  contourOverlay: boolean;   // Garis kontur isoline overlay
  labelsOverlay: boolean;    // Label tempat & jalan overlay
  seaMarksOverlay: boolean;  // Tanda maritim & navigasi bahari overlay
  culturalRadar: boolean;    // Radar denyut event budaya
}

export interface MapStyleDefinition {
  id: MapBaseStyle;
  name: string;
  shortName: string;
  description: string;
  badge: string;
  iconName: "navigation" | "satellite" | "mountain" | "spline" | "moon" | "waves";
  gradient: string;
}

export const MAP_STYLES: MapStyleDefinition[] = [
  {
    id: "osm",
    name: "Jalan / Standar OSM",
    shortName: "Jalan",
    description: "Peta jalan raya, rute transportasi & pemukiman OpenStreetMap",
    badge: "OSM Live",
    iconName: "navigation",
    gradient: "from-amber-600 via-orange-600 to-amber-800",
  },
  {
    id: "satelit",
    name: "Mode Satelit",
    shortName: "Satelit",
    description: "Citra satelit resolusi tinggi permukaan bumi, pesisir & pulau",
    badge: "Esri HD",
    iconName: "satellite",
    gradient: "from-blue-600 via-emerald-600 to-slate-900",
  },
  {
    id: "gunung",
    name: "Gunung & Relief",
    shortName: "Gunung",
    description: "Topografi pegunungan, bayangan bukit & geomorfologi bumi",
    badge: "3D Relief",
    iconName: "mountain",
    gradient: "from-amber-700 via-stone-600 to-emerald-900",
  },
  {
    id: "kontur",
    name: "Kontur & Topografi",
    shortName: "Kontur",
    description: "Garis elevasi isoline & kontur ketinggian lereng pegunungan",
    badge: "Isoline SRTM",
    iconName: "spline",
    gradient: "from-teal-600 via-emerald-700 to-amber-700",
  },
  {
    id: "malam",
    name: "Mode Malam",
    shortName: "Malam",
    description: "Peta petualangan gelap kontras tinggi (CartoDB Dark Matter)",
    badge: "Dark Matter",
    iconName: "moon",
    gradient: "from-slate-900 via-purple-950 to-indigo-950",
  },
  {
    id: "bahari",
    name: "Bahari & Pesisir",
    shortName: "Bahari",
    description: "Fokus kelautan, perairan pulau, terumbu karang & teluk pesisir",
    badge: "Nautical",
    iconName: "waves",
    gradient: "from-cyan-700 via-blue-700 to-teal-900",
  },
];
