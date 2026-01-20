import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
let isConnected = false; // simple flag

export default async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
}
