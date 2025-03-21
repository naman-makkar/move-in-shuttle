// src/models/User.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {  // Hashed password
    type: String,
    required: true,
  },
  walletBalance: {
    type: Number,
    default: 100,  // Default wallet balance for testing
  },
  role: {
    type: String,
    default: 'student',
  }
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
