// src/models/Stop.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const StopSchema = new mongoose.Schema({
  stopId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  stopName: {
    type: String,
    required: true,
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Stop || mongoose.model("Stop", StopSchema);
