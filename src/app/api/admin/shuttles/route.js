import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Shuttle from '@/models/shuttle';

export async function GET() {
  try {
    await dbConnect();
    const shuttles = await Shuttle.find({}).lean();
    return NextResponse.json(shuttles, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shuttles' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { shuttleName, seats, departureTime, arrivalTime, stops, kmTravel, shift } = await request.json();
    // stops is expected to be an array of objects: { stopId, arrivalTime }
    const newShuttle = await Shuttle.create({
      shuttleName,
      seats,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      stops: stops.map(stop => ({
        stopId: stop.stopId,
        arrivalTime: new Date(stop.arrivalTime)
      })),
      kmTravel,
      shift
    });
    return NextResponse.json({ success: true, shuttle: newShuttle }, { status: 201 });
  } catch (error) {
    console.error("Error creating shuttle", error);
    return NextResponse.json({ error: 'Failed to create shuttle' }, { status: 500 });
  }
}
