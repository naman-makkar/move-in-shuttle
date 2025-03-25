// MongoDB shell script to update stop coordinates
// Run with: mongosh --file update-stops-mongodb.js

// Switch to your database (update name if different)
db = db.getSiblingDB('shuttle');

// Bulk update all the stops
const updates = [
  {
    updateOne: {
      filter: { stopId: "parichowk" },
      update: { $set: { "location.latitude": 28.4750, "location.longitude": 77.5250 } }
    }
  },
  {
    updateOne: {
      filter: { stopId: "depot" },
      update: { $set: { "location.latitude": 28.4800, "location.longitude": 77.5300 } }
    }
  },
  {
    updateOne: {
      filter: { stopId: "bennettuniversity" },
      update: { $set: { "location.latitude": 28.4850, "location.longitude": 77.5350 } }
    }
  },
  {
    updateOne: {
      filter: { stopId: "delta1" },
      update: { $set: { "location.latitude": 28.4900, "location.longitude": 77.5400 } }
    }
  },
  {
    updateOne: {
      filter: { stopId: "e280420f-1f96-414b-8064-f06f69a90187" }, // alpha
      update: { $set: { "location.latitude": 28.4950, "location.longitude": 77.5450 } }
    }
  },
  {
    updateOne: {
      filter: { stopId: "knowledgepark" },
      update: { $set: { "location.latitude": 28.5000, "location.longitude": 77.5500 } }
    }
  },
  {
    updateOne: {
      filter: { stopId: "pari" },
      update: { $set: { "location.latitude": 28.5050, "location.longitude": 77.5550 } }
    }
  }
];

// Execute the bulk update
const result = db.stops.bulkWrite(updates);

// Print the results
print("Matched documents: " + result.matchedCount);
print("Modified documents: " + result.modifiedCount);

// Verify the updates
db.stops.find({}, { stopId: 1, stopName: 1, location: 1 }).pretty(); 