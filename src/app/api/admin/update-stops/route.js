import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Stop from '@/models/stop';

export async function POST(request) {
  try {
    await connectDB();
    
    // The data from your JSON file
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
    
    // Process each stop update
    const results = await Promise.all(
      stopsData.map(async (stopData) => {
        const result = await Stop.updateOne(
          { stopId: stopData.stopId },
          { $set: { location: stopData.location } }
        );
        
        return {
          stopId: stopData.stopId,
          updated: result.modifiedCount > 0,
          matched: result.matchedCount > 0
        };
      })
    );
    
    // Get all updated stops to verify
    const updatedStops = await Stop.find({}, 'stopId stopName location');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Stops coordinates updated',
      results,
      updatedStops
    });
  } catch (error) {
    console.error('Error updating stop coordinates:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message
    }, { status: 500 });
  }
}

// Only allow this route in development environment
export function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ 
      error: 'This endpoint is only available in development mode'
    }, { status: 403 });
  }
  
  return NextResponse.json({ 
    message: 'Send a POST request to update stop coordinates'
  });
} 