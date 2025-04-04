import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return NextResponse.json({ error: "Username already exists" }, { status: 400 });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, email, password: hashedPassword });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

  const res = NextResponse.json(
    {
      success: true,
      message: "Signup successful! Welcome to CropShield.",
      token,
      username, // Include the username in the response
    },
    { status: 201 }
  );

  res.headers.append("Set-Cookie", `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`);
  res.headers.append("Set-Cookie", `username=${username}; Path=/; Secure; SameSite=Strict; Max-Age=604800`);

  return res;
}
