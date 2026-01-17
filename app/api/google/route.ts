import { NextResponse } from "next/server";

const ALL_VIBES = ["quiet", "social", "cozy", "productive", "latenight"];

function getRandomVibes() {
  return [ALL_VIBES[Math.floor(Math.random() * ALL_VIBES.length)]];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "No address provided" }, { status: 400 });
  }

  const key = process.env.GOOGLE_API_KEY;

  try {
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${key}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results.length) {
      console.log(geoData);
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    const allowedTypes = ["cafe", "library"];
    let rawResults: any[] = [];

    for (const t of allowedTypes) {
      const nearbyRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${t}&keyword=study&key=${key}`
      );
      const nearbyData = await nearbyRes.json();
      rawResults = rawResults.concat(nearbyData.results);
    }

    const uniqueMap = new Map();
    for (const p of rawResults) uniqueMap.set(p.place_id, p);
    const uniquePlaces = Array.from(uniqueMap.values());

    const detailedResults = [];

    for (const place of uniquePlaces) {
      const fields = [
        "name",
        "formatted_address",
        "website",
        "formatted_phone_number",
        "opening_hours",
        "photos",
        "types",
        "url",
        "reviews"
      ].join(",");

      const detailsRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=${fields}&key=${key}`
      );

      const detailsData = await detailsRes.json();

      detailedResults.push({
        base: place,
        details: detailsData.result || {},
      });
    }

    const nearbySpots = detailedResults.map(({ base, details }) => {
      const rawTypes: string[] = details.types ?? base.types ?? [];
      const filteredTypes = rawTypes.filter(
        (t) => t !== "establishment" && t !== "point_of_interest"
      );

      const allGoogleReviews = details.reviews ?? [];
      const randomCount = Math.min(Math.floor(Math.random() * 5) + 1, allGoogleReviews.length);
      const googleReviews = allGoogleReviews.slice(0, randomCount);

      const ratings = googleReviews.map((r: any) => r.rating);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
          : null;

      return {
        name: details.name ?? base.name,
        address: details.formatted_address ?? base.vicinity,
        rating: averageRating,
        phone: details.formatted_phone_number ?? null,
        website: details.website ?? null,
        google_url: details.url ?? null,
        hours: details.opening_hours?.weekday_text ?? null,
        open_now:
          details.opening_hours?.open_now ??
          base.opening_hours?.open_now ??
          null,
        vibes: getRandomVibes(),
        type: filteredTypes,
        image:
          (details.photos?.[0] &&
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${details.photos[0].photo_reference}&key=${key}`) ||
          null,
        reviews: googleReviews.map((r: any) => ({
          author_name: r.author_name,
          rating: r.rating,
          text: r.text,
          relative_time_description: r.relative_time_description,
          profile_photo_url: r.profile_photo_url ?? null,
        })),
        createdAt: new Date(),
        place_id: base.place_id,
        location: {
          lat: base.geometry.location.lat,
          lng: base.geometry.location.lng,
        },
      };
    });

    return NextResponse.json(
      {
        userLocation: { lat, lng },
        count: nearbySpots.length,
        nearbySpots,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: "Google API Error" }, { status: 500 });
  }
}
