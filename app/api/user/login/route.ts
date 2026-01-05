
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import connectMongoDB from "@/config/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await connectMongoDB();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { msg: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { msg: "Invalid email or password" },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { msg: "Invalid email or password" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      msg: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    },
    { status: 200 }
  );
}
