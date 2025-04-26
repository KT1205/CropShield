import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Prediction from "@/models/Prediction";
import jwt from "jsonwebtoken";

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

    // Convert file to Blob for sending to Flask
    const form = new FormData();
    form.append("file", file);

    // Send to Flask API
    const response = await fetch("https://cropshield-460s.onrender.com/predict", {
      method: "POST",
      body: form,
    });

    const data = await response.json();

    // Save prediction to MongoDB
    const prediction = await Prediction.create({
      userId: decoded.id,
      cropName: data.prediction.class_name,  // mapping correctly to your schema
      result: data.prediction.class_name,    // same here
      imageUrl: URL.createObjectURL(file),
    });
    
    // Return response
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
