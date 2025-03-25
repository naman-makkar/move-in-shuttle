// Update Users with Gender Field
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shuttle';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define the User Schema
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
      type: String,
      required: true,
    },
    walletBalance: {
      type: Number,
      default: 100,
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function updateUsers() {
  try {
    console.log('Starting user gender updates...');
    
    // Get all users without gender 