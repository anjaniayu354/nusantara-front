import { NextRequest, NextResponse } from "next/server";

const coordCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lon = searchParams.get("lon");
  const lat = searchParams.get("lat");

  if (!lon || !lat) {
    return NextResponse.json({ error: "lon and lat are required" }, { status: 400 });
  }

  // Snap to 2 decimal places (~1.1 km resolution) for efficient caching
  const snapLon = Number(lon).toFixed(2);
  const snapLat = Number(lat).toFixed(2);
  const key = `${snapLon}:${snapLat}`;

  const cached = coordCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: { "X-Cache": "HIT" },
    });
  }

  try {
    const url = `https://weather.bmkg.go.id/api/presentwx/coord?lon=${lon}&lat=${lat}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Nusa-Antara-RouteWeather/1.0",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      throw new Error(`BMKG responded with status ${res.status}`);
    }

    const data = await res.json();
    coordCache.set(key, { timestamp: Date.now(), data });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
        "X-Cache": "MISS",
      },
    });
  } catch (error: any) {
    // Generate fallback weather observation for the coordinate
    const fallbackData = {
      status: 200,
      data: {
        lokasi: {
          lon: Number(lon),
          lat: Number(lat),
          kotkab: "Wilayah Nusantara",
          provinsi: "Indonesia",
        },
        cuaca: {
          weather: 3,
          weather_desc: "Cerah Berawan",
          t: 28,
          hu: 75,
          ws: 3.5,
          wd: "SE",
          wd_to: "NW",
          wd_deg: 135,
          vs_text: "> 10 km",
        },
      },
      fallback: true,
    };

    return NextResponse.json(fallbackData, {
      headers: { "X-Fallback": "TRUE" },
    });
  }
}
