import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const StopArrivalSchema = new mongoose.Schema({
  stopId: { type: String, required: true },
  arrivalTime: { type: Date, required: true }
}, { _id: false });

const ShuttleSchema = new mongoose.Schema({
  shuttleId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  shuttleName: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  // Array of objects: each with stopId and arrivalTime at that stop
  stops: {
    type: [StopArrivalSchema],
    default: [],
  },
  kmTravel: {
    type: Number,
    required: true,
  },
  shift: {
    type: String,
    enum: ['morning', 'evening'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Shuttle || mongoose.model("Shuttle", ShuttleSchema);
