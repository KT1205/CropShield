import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Prediction from "@/models/Prediction";
import jwt from "jsonwebtoken";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode JWT to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Upload image to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "CropShield" },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          }
        }
      );
      const stream = uploadStream;
      stream.write(buffer);
      stream.end();
    });

    // Send image to Flask API
    const form = new FormData();
    form.append("file", file);

    const response = await fetch(`${process.env.API_ENDPOINT}/predict`, {
      method: "POST",
      body: form,
    });

    const data = await response.json();

    // Save prediction to MongoDB
    const prediction = await Prediction.create({
      userId: decoded.id,
      cropName: data.prediction.class_name,
      result: data.prediction.class_name,
      imageUrl: imageUrl, // Use Cloudinary URL
    });

    return NextResponse.json({
      success: true,
      class: data.prediction.class_name,
      confidence: data.prediction.confidence,
      predictionId: prediction._id,
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
