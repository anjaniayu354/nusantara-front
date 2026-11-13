import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ z: string; x: string; y: string }> }
) {
  const { z, x, y } = await context.params;

  // Validate coordinates
  const zoom = parseInt(z, 10);
  const tileX = parseInt(x, 10);
  const tileY = parseInt(y, 10);

  if (isNaN(zoom) || isNaN(tileX) || isNaN(tileY) || zoom < 0 || zoom > 19) {
    return new NextResponse("Invalid tile coordinates", { status: 400 });
  }

  // OpenStreetMap Tile URL
  const osmUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;

  try {
    const response = await fetch(osmUrl, {
      headers: {
        // Strict OSM Compliance: Custom descriptive User-Agent
        "User-Agent": "nusa-antara-adventure-portal/1.0 (contact@nusaantara.id; +https://nusaantara.id)",
        Accept: "image/png,image/*;q=0.8",
      },
      next: {
        revalidate: 86400 * 7, // 7 days server-side cache
      },
    });

    if (!response.ok) {
      return new NextResponse(`OSM tile error: ${response.statusText}`, {
        status: response.status,
      });
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        // Multi-tier client and CDN cache headers
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
        "X-OSM-Attribution": "© OpenStreetMap contributors",
        "X-Service-Name": "Nusa-Antara-TileProxy",
      },
    });
  } catch (error) {
    console.error("Failed to proxy OSM tile:", error);
    return new NextResponse("Failed to fetch tile", { status: 502 });
  }
}
