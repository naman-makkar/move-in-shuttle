import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  userId: { type: String, required: true },
  shuttleId: { type: String, required: true },
  fromStop: { type: String, required: true },
  toStop: { type: String, required: true },
  fare: { type: Number, required: true },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  bookingTime: { type: Date, default: Date.now },
  cancellationPenalty: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
