// src/models/Stop.js
import mongoose from "mongoose";

if (mongoose.models.Stop) {
  delete mongoose.models.Stop;
}


const StopSchema = new mongoose.Schema(
  {
    stopId: {
      type: String,
      unique: true,
    },
    stopName: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      latitude: Number,
      longitude: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook that always sets stopId to a normalized version of stopName.
StopSchema.pre("save", function (next) {
  // Normalize stopName: trim and convert to lowercase.
  this.stopId = this.stopName.trim().toLowerCase();
  next();
});

export default mongoose.models.Stop || mongoose.model("Stop", StopSchema);
