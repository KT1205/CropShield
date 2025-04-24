import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.json({ isLoggedIn: false });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!);
    return NextResponse.json({ isLoggedIn: true, user: decoded });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false });
  }
}

  