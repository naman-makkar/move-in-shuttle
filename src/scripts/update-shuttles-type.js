// Update Shuttles with ShuttleType Field and Create Women-Only Shuttles
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
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

// Define the Stop Schema for Shuttles
const StopArrivalSchema = new mongoose.Schema({
  stopId: { type: String, required: true },
  arrivalTime: { type: Date, required: true }
}, { _id: false });

// Define the Shuttle Schema
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
  },
  shuttleType: {
    type: String,
    enum: ['general', 'women-only'],
    default: 'general',
  }
}, {
  timestamps: true,
});

const Shuttle = mongoose.models.Shuttle || mongoose.model("Shuttle", ShuttleSchema);

async function updateShuttles() {
  try {
    console.log('Starting shuttle type updates...');
    
    // 1. Update all existing shuttles to have shuttleType = 'general'
    const result = await Shuttle.updateMany(
      { shuttleType: { $exists: false } },
      { $set: { shuttleType: 'general' } }
    );
    
    console.log(`Updated ${result.modifiedCount} shuttles with shuttleType = 'general'`);
    
    // 2. Create women-only shuttles (add duplicates of some existing shuttles but with women-only type)
    // First, get some existing shuttles to duplicate
    const existingShuttles = await Shuttle.find({}).limit(2);
    console.log(`Found ${existingShuttles.length} existing shuttles to duplicate`);
    
    if (existingShuttles.length === 0) {
      console.log('No existing shuttles found. Creating only example shuttles.');
    } else {
      // Create women-only shuttles for each existing shuttle
      for (const shuttle of existingShuttles) {
        // Create a copy with modifications
        const womenOnlyShuttleData = {
          shuttleId: uuidv4(), // Generate a new shuttleId
          shuttleName: `${shuttle.shuttleName} (Women Only)`,
          seats: shuttle.seats,
          departureTime: shuttle.departureTime,
          arrivalTime: shuttle.arrivalTime,
          stops: shuttle.stops,
          kmTravel: shuttle.kmTravel,
          shift: shuttle.shift,
          isActive: shuttle.isActive,
          shuttleType: 'women-only'
        };
        
        // Add the women-only shuttle
        const womenOnlyShuttle = new Shuttle(womenOnlyShuttleData);
        await womenOnlyShuttle.save();
        console.log(`Created women-only shuttle with ID: ${womenOnlyShuttle._id}`);
      }
    }
    
    // 3. Insert the example shuttle from the comment (as general)
    console.log('Creating example general shuttle...');
    const exampleShuttle = new Shuttle({
      "shuttleName": "shuttle2",
      "seats": 30,
      "departureTime": new Date("2025-03-27T01:30:00.000Z"),
      "arrivalTime": new Date("2025-03-27T03:20:00.000Z"),
      "stops": [
        {
          "stopId": "parichowk",
          "arrivalTime": new Date("2025-03-23T01:30:00.000Z")
        },
        {
          "stopId": "depot",
          "arrivalTime": new Date("2025-03-23T02:10:00.000Z")
        },
        {
          "stopId": "bennettuniversity",
          "arrivalTime": new Date("2025-03-23T03:20:00.000Z")
        }
      ],
      "kmTravel": 35,
      "shift": "morning",
      "isActive": true,
      "shuttleId": uuidv4(),
      "shuttleType": "general"
    });
    
    await exampleShuttle.save();
    console.log("Inserted example shuttle");
    
    // Also create a women-only version of this shuttle
    console.log('Creating women-only example shuttle...');
    const womenOnlyExampleShuttle = new Shuttle({
      "shuttleName": "shuttle2 (Women Only)",
      "seats": 30,
      "departureTime": new Date("2025-03-27T02:30:00.000Z"),
      "arrivalTime": new Date("2025-03-27T04:20:00.000Z"),
      "stops": [
        {
          "stopId": "parichowk",
          "arrivalTime": new Date("2025-03-23T02:30:00.000Z")
        },
        {
          "stopId": "depot",
          "arrivalTime": new Date("2025-03-23T03:10:00.000Z")
        },
        {
          "stopId": "bennettuniversity",
          "arrivalTime": new Date("2025-03-23T04:20:00.000Z")
        }
      ],
      "kmTravel": 35,
      "shift": "morning",
      "isActive": true,
      "shuttleId": uuidv4(),
      "shuttleType": "women-only"
    });
    
    await womenOnlyExampleShuttle.save();
    console.log("Inserted women-only example shuttle");
    
    console.log('\nUpdate complete!');
  } catch (error) {
    console.error('Error updating shuttles:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the update function
updateShuttles(); 