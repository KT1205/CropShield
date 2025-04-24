import { NextRequest, NextResponse } from "next/server"; 
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { usernameOrEmail, password } = await req.json();

  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  

  const res = NextResponse.json(
    {
      success: true,
      message: "Login successful! Welcome back.",
      token,
      username: user.username  // Added username in the response
    },
    { status: 200 }
  );

  res.headers.set(
    "Set-Cookie",
    [
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
      `username=${user.username}; Path=/; Secure; SameSite=Strict; Max-Age=604800` // Added username cookie
    ].join(", ")
  );

  return res;
}

