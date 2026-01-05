
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import connectMongoDB from "@/config/mongodb";
import bcrypt from "bcryptjs";

export async function GET() {
  await connectMongoDB();

  const users = await User.find({}, { password: 0 });
  return NextResponse.json({ users }, { status: 200 });
}

export async function POST(req: NextRequest) {
  await connectMongoDB();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { msg: "Email and password are required" },
      { status: 400 }
    );
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { msg: "User already exists" },
      { status: 409 }
    );
  }

  // 🔐 hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  return NextResponse.json(
    {
      msg: "User created",
      user: {
        _id: newUser._id,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    },
    { status: 201 }
  );
}
