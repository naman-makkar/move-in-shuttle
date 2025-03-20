// src/lib/dbConnect.js
import mongoose from 'mongoose';

let isConnected = false; // global variable to track connection status

export async function dbConnect() {
  if (isConnected) {
    return;
  }
  
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
