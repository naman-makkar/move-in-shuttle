// src/models/User.js

import mongoose from "mongoose";

// If a cached User model already exists, remove it.
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      // Hashed password
      type: String,
      required: true,
    },
    walletBalance: {
      type: Number,
      default: 100, // Default wallet balance for testing
    },
    role: {
      type: String,
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to set userId = email (normalized)
UserSchema.pre("save", function (next) {
  this.userId = this.email.trim().toLowerCase();
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
