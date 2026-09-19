// app/api/place-photo/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function serveFallbackImage() {
    try {
        const backupPath = path.join(process.cwd(), "public", "backupPic.png");
        const backupBuffer = fs.readFileSync(backupPath);
        return new NextResponse(backupBuffer, {
            status: 200,
            headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
        });
    } catch {
        return new NextResponse(null, { status: 404 });
    }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const searchParams = request.nextUrl.searchParams;
    let photoReference = searchParams.get("photoreference");
    const placeId = searchParams.get("placeId");
    const maxWidth = searchParams.get("maxwidth") ?? "400";

    const apiKey =
        process.env.GOOGLE_MAPS_API_KEY ||
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

    if (!apiKey) return serveFallbackImage();

    // If a placeId is supplied, fetch the current active photo reference
    if (placeId && !photoReference) {
        try {
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${apiKey}`;
            const detailsRes = await fetch(detailsUrl);
            const detailsData = await detailsRes.json();
            photoReference = detailsData.result?.photos?.[0]?.photo_reference;
        } catch {
            return serveFallbackImage();
        }
    }

    if (!photoReference) return serveFallbackImage();

    const googleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;

    try {
        const res = await fetch(googleUrl, { redirect: "follow" });
        if (!res.ok) return serveFallbackImage();

        const imageBuffer = await res.arrayBuffer();
        const contentType = res.headers.get("content-type") ?? "image/jpeg";

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
            },
        });
    } catch {
        return serveFallbackImage();
    }
}