import mongoose from "mongoose";

const PredictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  cropName: { type: String, required: true },
  result: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Prediction || mongoose.model("Prediction", PredictionSchema);
