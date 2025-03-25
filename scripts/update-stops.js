// Script to update stop coordinates in MongoDB
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

// Define the Stop Schema
const StopSchema = new mongoose.Schema({
  stopId: { type: String, unique: true },
  stopName: { type: String, required: true, unique: true },
  location: { latitude: Number, longitude: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Stop = mongoose.model('Stop', StopSchema);

// Coordinates data to update
const stopsData = [
  {
    stopId: "parichowk",
    location: { latitude: 28.4750, longitude: 77.5250 }
  },
  {
    stopId: "depot",
    location: { latitude: 28.4800, longitude: 77.5300 }
  },
  {
    stopId: "bennettuniversity",
    location: { latitude: 28.4850, longitude: 77.5350 }
  },
  {
    stopId: "delta1",
    location: { latitude: 28.4900, longitude: 77.5400 }
  },
  {
    stopId: "e280420f-1f96-414b-8064-f06f69a90187", // alpha
    location: { latitude: 28.4950, longitude: 77.5450 }
  },
  {
    stopId: "knowledgepark",
    location: { latitude: 28.5000, longitude: 77.5500 }
  },
  {
    stopId: "pari",
    location: { latitude: 28.5050, longitude: 77.5550 }
  }
];

async function updateStopCoordinates() {
  try {
    console.log('Starting coordinate updates...');
    
    // Process each stop update
    const updatePromises = stopsData.map(async (stopData) => {
      const result = await Stop.updateOne(
        { stopId: stopData.stopId },
        { $set: { location: stopData.location } }
      );
      
      return {
        stopId: stopData.stopId,
        updated: result.modifiedCount > 0,
        matched: result.matchedCount > 0
      };
    });
    
    const results = await Promise.all(updatePromises);
    
    // Display results
    console.log('\nUpdate Results:');
    results.forEach(result => {
      console.log(`${result.stopId}: ${result.updated ? 'Updated' : (result.matched ? 'No change needed' : 'Not found')}`);
    });
    
    console.log('\nUpdate complete!');
  } catch (error) {
    console.error('Error updating coordinates:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the update function
updateStopCoordinates(); 