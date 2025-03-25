// Update Users with Gender Field
const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' }); // Path to root .env

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-atlas-connection-string';

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout
};

console.log('Connecting to MongoDB...');
console.log(`Using connection string: ${MONGODB_URI.split('@')[0]}...`); // Log partial connection string for privacy

// Connect to MongoDB
mongoose.connect(MONGODB_URI, options)
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
    
    // Get all users without gender field
    const users = await User.find({ gender: { $exists: false } });
    console.log(`Found ${users.length} users without gender field`);
    
    // Update all users with a default gender
    const result = await User.updateMany(
      { gender: { $exists: false } },
      { $set: { gender: 'prefer-not-to-say' } }
    );
    
    console.log(`Updated ${result.modifiedCount} users with default gender`);
    
    // Optional: Update specific users with specific genders for testing
    // This is helpful for testing the women-only shuttle feature
    const testUsers = [
      { email: 'e22cseu0831@bennett.edu.in', gender: 'female' },
      // Add more specific users if needed
    ];
    
    for (const userData of testUsers) {
      const user = await User.findOne({ email: userData.email });
      if (user) {
        user.gender = userData.gender;
        await user.save();
        console.log(`Updated user ${userData.email} with gender: ${userData.gender}`);
      } else {
        console.log(`User ${userData.email} not found`);
      }
    }
    
    console.log('\nUpdate complete!');
  } catch (error) {
    console.error('Error updating user genders:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the update function
updateUsers(); 