import { NextRequest, NextResponse } from "next/server";

const TILE_SOURCES: Record<string, string> = {
  osm: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  topo: "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
  "carto-dark": "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ z: string; x: string; y: string }> }
) {
  const { z, x, y } = await context.params;
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src") || "osm";

  // Validate coordinates
  const zoom = parseInt(z, 10);
  const tileX = parseInt(x, 10);
  const tileY = parseInt(y, 10);

  if (isNaN(zoom) || isNaN(tileX) || isNaN(tileY) || zoom < 0 || zoom > 19) {
    return new NextResponse("Invalid tile coordinates", { status: 400 });
  }

  const template = TILE_SOURCES[src] || TILE_SOURCES.osm;
  const tileUrl = template
    .replace("{z}", zoom.toString())
    .replace("{x}", tileX.toString())
    .replace("{y}", tileY.toString());

  try {
    const response = await fetch(tileUrl, {
      headers: {
        "User-Agent":
          "nusa-antara-adventure-portal/1.0 (contact@nusaantara.id; +https://nusaantara.id)",
        Accept: "image/png,image/*;q=0.8",
      },
      next: {
        revalidate: 86400 * 7, // 7 days server-side cache
      },
    });

    if (!response.ok) {
      return new NextResponse(`Tile error: ${response.statusText}`, {
        status: response.status,
      });
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control":
          "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
        "X-Tile-Source": src,
        "X-Service-Name": "Nusa-Antara-TileProxy",
      },
    });
  } catch (error) {
    console.error(`Failed to proxy ${src} tile:`, error);
    return new NextResponse("Failed to fetch tile", { status: 502 });
  }
}
