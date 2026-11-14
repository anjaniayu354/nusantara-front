import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// In-memory cache for BMKG requests
const cache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 60 * 1000 * 5; // 5 minutes

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;

  // Check cache
  const cached = cache.get(type);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "X-Cache": "HIT",
      },
    });
  }

  // Local fallback reader
  const readLocalFallback = (filename: string) => {
    try {
      const localPath = path.join(process.cwd(), "src", "data", "bmkg_data", filename);
      if (fs.existsSync(localPath)) {
        const text = fs.readFileSync(localPath, "utf-8");
        return JSON.parse(text);
      }
      // Try parent BMKG folder
      const parentPath = path.resolve(process.cwd(), "..", "BMKG", filename.replace(".json", ".txt"));
      if (fs.existsSync(parentPath)) {
        const text = fs.readFileSync(parentPath, "utf-8");
        return JSON.parse(text);
      }
    } catch (e) {
      console.error(`Error reading fallback for ${filename}:`, e);
    }
    return null;
  };

  try {
    let resultData: any = null;

    switch (type) {
      case "kilat": {
        try {
          const upstream = await fetch(
            "https://signature.bmkg.go.id/dwt/asset/boot/api_dwt2.php?type=kilat",
            {
              headers: { "User-Agent": "Nusa-Antara-Portal/1.0" },
              signal: AbortSignal.timeout(3500),
            }
          );
          if (upstream.ok) {
            const json = await upstream.json();
            if (json && (json.geojson || Array.isArray(json))) {
              resultData = json;
            }
          }
        } catch {
          // Fallback to local
        }
        if (!resultData) {
          resultData = readLocalFallback("kilat.json");
        }
        break;
      }

      case "radar": {
        try {
          const upstream = await fetch(
            "https://signature.bmkg.go.id/dwt/asset/boot/api_dwt2.php?type=radar",
            {
              headers: { "User-Agent": "Nusa-Antara-Portal/1.0" },
              signal: AbortSignal.timeout(3500),
            }
          );
          if (upstream.ok) {
            const json = await upstream.json();
            if (json && json.url) {
              resultData = json;
            }
          }
        } catch {
          // Fallback to local
        }
        if (!resultData) {
          resultData = readLocalFallback("radar.json");
        }
        break;
      }

      case "pwx-darat": {
        try {
          const upstream = await fetch(
            "https://signature.bmkg.go.id/dwt/asset/boot/api_dwt2.php?type=pwxDarat",
            {
              headers: { "User-Agent": "Nusa-Antara-Portal/1.0" },
              signal: AbortSignal.timeout(3500),
            }
          );
          if (upstream.ok) {
            const json = await upstream.json();
            if (Array.isArray(json) || (json && Array.isArray(json.data))) {
              resultData = json;
            }
          }
        } catch {
          // Fallback to local
        }
        if (!resultData) {
          resultData = readLocalFallback("titik_pengamatan.json");
        }
        break;
      }

      case "pwx-kereta": {
        try {
          const upstream = await fetch(
            "https://signature.bmkg.go.id/dwt/asset/boot/api_dwt2.php?type=pwxKereta",
            {
              headers: { "User-Agent": "Nusa-Antara-Portal/1.0" },
              signal: AbortSignal.timeout(3500),
            }
          );
          if (upstream.ok) {
            const json = await upstream.json();
            if (Array.isArray(json) || (json && Array.isArray(json.data))) {
              resultData = json;
            }
          }
        } catch {
          // Fallback to local
        }
        if (!resultData) {
          resultData = readLocalFallback("kereta.json");
        }
        break;
      }

      case "satelit": {
        try {
          const upstream = await fetch(
            "https://signature.bmkg.go.id/dwt/asset/boot/api_dwt2.php?type=satelit",
            {
              headers: { "User-Agent": "Nusa-Antara-Portal/1.0" },
              signal: AbortSignal.timeout(3500),
            }
          );
          if (upstream.ok) {
            const json = await upstream.json();
            if (json && json.file) {
              resultData = json;
            }
          }
        } catch {
          // Fallback
        }
        if (!resultData) {
          // Standard BMKG Himawari Satellite IR image bounds for Indonesia
          resultData = {
            file: "https://satelit.bmkg.go.id/IMAGE/ANIMASI/HIMA_IR_INDONESIA.gif",
            imageBounds: [
              [-15.0, 90.0],
              [10.0, 145.0],
            ],
            time: new Date().toISOString(),
          };
        }
        break;
      }

      case "banners": {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFjNWFkZWUxYzY5MzM0NjY2N2EzZWM0MWRlMjBmZWZhNDcxOTNjYzcyZDgwMGRiN2ZmZmFlMWVhYjcxZGYyYjQiLCJpYXQiOjE3MDE1ODMzNzl9.D1VNpMoTUVFOUuQW0y2vSjttZwj0sKBX33KyrkaRMcQ";
        try {
          const res = await fetch(
            `https://cuaca.bmkg.go.id/api/v1/public/banners?api_token=${token}`,
            {
              headers: { "User-Agent": "Nusa-Antara-Portal/1.0" },
              signal: AbortSignal.timeout(3500),
            }
          );
          if (res.ok) {
            resultData = await res.json();
          }
        } catch {
          resultData = { status: 200, data: [] };
        }
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown BMKG endpoint type" }, { status: 404 });
    }

    if (!resultData) {
      return NextResponse.json({ error: "Failed to load BMKG data" }, { status: 502 });
    }

    // Save to cache
    cache.set(type, { timestamp: Date.now(), data: resultData });

    return NextResponse.json(resultData, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "X-Cache": "MISS",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: err?.message },
      { status: 500 }
    );
  }
}
