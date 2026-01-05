import { NextRequest, NextResponse } from "next/server";
import Location from "../../../models/Location";
import connectMongoDB from "@/config/mongodb";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await connectMongoDB();
  const locations = await Location.find();
  const normalized = locations.map(loc => ({
    ...loc.toObject(),
    rating: loc.rating != null ? parseFloat(loc.rating.toFixed(2)) : null
  }));
  return NextResponse.json({ locations: normalized }, { status: 200 });
}

export async function POST(req: NextRequest) {
  await connectMongoDB();
  const session = await getServerSession(authConfig);
  if (!session?.user) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const existing = await Location.findById(data._id);

  if (existing) {
    const newReviews = data.reviews || [];
    const mergedReviews = [
      ...(existing.reviews ?? []),
      ...newReviews.filter(
        (r: any) =>
          !(existing.reviews ?? []).some(
            (er: any) => er.author_name === r.author_name && er.text === r.text
          )
      ),
    ];
    existing.reviews = mergedReviews;
    existing.rating = data.rating != null ? parseFloat(data.rating.toFixed(2)) : existing.rating;
    await existing.save();
    return NextResponse.json(
      { msg: "Location already exists, reviews updated", location: existing },
      { status: 200 }
    );
  }

  const newLocation = new Location({
    _id: data._id,
    name: data.name,
    address: data.address,
    hours: data.hours || [],
    type: data.type || [],
    vibes: data.vibes || [],
    description: data.review || data.description || "",
    image: data.image || "",
    rating: data.rating != null ? parseFloat(data.rating.toFixed(2)) : 0,
    location: data.location || null,
    reviews: data.reviews || [],
  });

  await newLocation.save();
  return NextResponse.json({ msg: "Location created", location: newLocation }, { status: 201 });
}
