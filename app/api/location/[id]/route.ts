import { NextRequest, NextResponse } from "next/server";
import Location from "@/models/Location";
import connectMongoDB from "@/config/mongodb";

export async function GET(req: NextRequest) {
  await connectMongoDB();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop()?.trim();
  if (!id) return NextResponse.json({ msg: "ID not provided" }, { status: 400 });

  const location = await Location.findById(id);
  if (!location) return NextResponse.json({ msg: "Location not found" }, { status: 404 });

  return NextResponse.json(location, { status: 200 });
}

export async function PUT(req: NextRequest) {
  await connectMongoDB();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop()?.trim();
  if (!id) return NextResponse.json({ msg: "ID not provided" }, { status: 400 });

  const data = await req.json();
  const location = await Location.findById(id);
  if (!location) return NextResponse.json({ msg: "Location not found" }, { status: 404 });

  if (data.review) {
    location.reviews = [...(location.reviews || []), data.review];
    location.rating =
      location.reviews.length > 0
        ? parseFloat(
          (location.reviews.reduce((sum, r) => sum + r.rating, 0) / location.reviews.length).toFixed(2)
        )
        : 0;
    await location.save();
    return NextResponse.json({ msg: "Review added", location }, { status: 200 });
  }

  Object.assign(location, data);
  await location.save();
  return NextResponse.json({ msg: "Location updated", location }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  await connectMongoDB();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop()?.trim();
  if (!id) return NextResponse.json({ msg: "ID not provided" }, { status: 400 });

  const deletedLocation = await Location.findByIdAndDelete(id);
  if (!deletedLocation) return NextResponse.json({ msg: "Location not found" }, { status: 404 });

  return NextResponse.json({ msg: "Location deleted" }, { status: 200 });
}
