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
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      default: "prefer-not-to-say",
    }
  },
  {
    timestamps: true,
  }
);

// Helper function to randomly select a gender
function getRandomGender() {
  const genders = ["male", "female", "other", "prefer-not-to-say"];
  const randomIndex = Math.floor(Math.random() * genders.length);
  return genders[randomIndex];
}

// Pre-save hook to set userId = email (normalized) and assign random gender for new users
UserSchema.pre("save", function (next) {
  this.userId = this.email.trim().toLowerCase();
  
  // If this is a new user (isNew is true), assign a random gender
  if (this.isNew) {
    this.gender = getRandomGender();
  }
  
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
