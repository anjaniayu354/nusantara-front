import { get, set } from "idb-keyval";

const CACHE_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days TTL according to OSM rules

interface CachedTile {
  blob: Blob;
  timestamp: number;
}

/**
 * Retrieves a tile blob from IndexedDB cache or fetches from the tile API proxy,
 * saving to IndexedDB for offline and fast re-render capabilities.
 */
export async function getCachedTileUrl(z: number, x: number, y: number): Promise<string> {
  const cacheKey = `osm_tile_${z}_${x}_${y}`;

  try {
    const cached = await get<CachedTile>(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return URL.createObjectURL(cached.blob);
    }
  } catch (err) {
    console.warn("IndexedDB read failed, falling back to network fetch:", err);
  }

  // Fetch through our Next.js API proxy with custom User-Agent and caching headers
  const tileUrl = `/api/tiles/${z}/${x}/${y}`;
  try {
    const res = await fetch(tileUrl);
    if (!res.ok) {
      // Fallback directly to OSM if proxy unavailable
      return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    }
    const blob = await res.blob();

    // Persist asynchronously in IndexedDB
    set(cacheKey, { blob, timestamp: Date.now() }).catch((err) => {
      console.warn("IndexedDB write failed:", err);
    });

    return URL.createObjectURL(blob);
  } catch {
    // Direct network fallback
    return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  }
}
