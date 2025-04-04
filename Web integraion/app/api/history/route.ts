import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Prediction from "@/models/Prediction";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await dbConnect(); // Connect to MongoDB

    // 🔥 Extract JWT token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 🔥 Decode JWT to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    // 🔥 Fetch user-specific predictions from MongoDB
    const userPredictions = await Prediction.find({ userId: decoded.id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: userPredictions });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
