import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Shuttle from '@/models/shuttle';

export async function GET(request, { params }) {
  const { shuttleId } = params;
  try {
    await dbConnect();
    const shuttle = await Shuttle.findOne({ shuttleId }).lean();
    if (!shuttle) return NextResponse.json({ error: 'Shuttle not found' }, { status: 404 });
    return NextResponse.json(shuttle, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shuttle' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { shuttleId } = params;
  try {
    await dbConnect();
    const { shuttleName, seats, departureTime, arrivalTime, stops, kmTravel, shift, isActive } = await request.json();
    const updatedShuttle = await Shuttle.findOneAndUpdate(
      { shuttleId },
      {
        shuttleName,
        seats,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        stops: stops.map(stop => ({
          stopId: stop.stopId,
          arrivalTime: new Date(stop.arrivalTime)
        })),
        kmTravel,
        shift,
        isActive,
      },
      { new: true }
    );
    if (!updatedShuttle) return NextResponse.json({ error: 'Shuttle not found' }, { status: 404 });
    return NextResponse.json({ success: true, shuttle: updatedShuttle }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update shuttle' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { shuttleId } = params;
  try {
    await dbConnect();
    const deletedShuttle = await Shuttle.findOneAndDelete({ shuttleId });
    if (!deletedShuttle) return NextResponse.json({ error: 'Shuttle not found' }, { status: 404 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete shuttle' }, { status: 500 });
  }
}
