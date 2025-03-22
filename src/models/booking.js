// src/models/Booking.js

import mongoose from "mongoose";

// If a cached Booking model already exists, remove it.
if (mongoose.models.Booking) {
  delete mongoose.models.Booking;
}

// For example, if you want a custom bookingId format:
function generateBookingId() {
  return "BK" + Math.floor(10000 + Math.random() * 90000).toString(); 
}

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      default: generateBookingId,
      unique: true,
    },
    userId: { type: String, required: true },
    shuttleId: { type: String, required: true },
    fromStop: { type: String, required: true },
    toStop: { type: String, required: true },
    fare: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    bookingTime: { type: Date, default: Date.now },
    cancellationPenalty: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
