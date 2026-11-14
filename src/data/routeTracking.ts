export interface RouteWaypoint {
  lat: number;
  lng: number;
  name: string;
}

export interface RouteWeatherDetail {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: string;
  iconUrl?: string;
  locationName?: string;
}

export interface RouteWeatherStep {
  index: number;
  instruction: string;
  streetName: string;
  distanceKm: number;
  durationMinutes: number;
  lat: number;
  lng: number;
  bearing: number;
  type: string;
  modifier: string;
  weather?: RouteWeatherDetail;
}

export interface RouteTrackingResult {
  id: string;
  start: RouteWaypoint;
  destination: RouteWaypoint;
  totalDistanceKm: number;
  totalDurationMinutes: number;
  summary: string;
  geometry: {
    type: string;
    coordinates: [number, number][]; // [lng, lat] GeoJSON format
  };
  steps: RouteWeatherStep[];
  safetyIndex: "AMAN" | "WASPADA" | "TUNDA";
  safetyReason: string;
  avgTemperature: number;
  dominantCondition: string;
  createdAt: string;
}

export interface SavedTravelRoute {
  id: string;
  userId: string;
  title: string;
  startName: string;
  destName: string;
  distanceKm: number;
  durationMinutes: number;
  date: string;
  routeData: RouteTrackingResult;
}

const STORAGE_PREFIX = "nusa_saved_routes_";

export function getSavedRoutes(userId: string): SavedTravelRoute[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load saved routes:", e);
    return [];
  }
}

export function saveRoute(
  userId: string,
  route: RouteTrackingResult,
  customTitle?: string
): SavedTravelRoute {
  const current = getSavedRoutes(userId);
  const title =
    customTitle?.trim() || `${route.start.name} ke ${route.destination.name}`;

  const newSaved: SavedTravelRoute = {
    id: `route_${Date.now()}`,
    userId,
    title,
    startName: route.start.name,
    destName: route.destination.name,
    distanceKm: route.totalDistanceKm,
    durationMinutes: route.totalDurationMinutes,
    date: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    routeData: route,
  };

  const updated = [newSaved, ...current.filter((r) => r.id !== newSaved.id)];
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save route:", e);
  }
  return newSaved;
}

export function deleteSavedRoute(userId: string, routeId: string): void {
  const current = getSavedRoutes(userId);
  const updated = current.filter((r) => r.id !== routeId);
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to delete route:", e);
  }
}
