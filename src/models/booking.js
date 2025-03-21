// src/models/Booking.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  routeId: {
    type: String,
    required: true,
  },
  pointsDeducted: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
