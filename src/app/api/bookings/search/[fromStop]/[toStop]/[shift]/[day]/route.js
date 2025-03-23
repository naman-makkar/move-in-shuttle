import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Shuttle from '@/models/shuttle';

export async function GET(_request, { params }) {
  try {
    await dbConnect();
    const { fromStop, toStop, shift, day } = params;
    if (!fromStop || !toStop || !shift) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const now = new Date();
    const shuttles = await Shuttle.find({
      shift,
      departureTime: { $gt: now },
      isActive: true
    }).lean();

    const availableShuttles = shuttles
      .filter((shuttle) => {
        const stops = shuttle.stops;
        const fromIndex = stops.findIndex((s) => s.stopId === fromStop);
        const toIndex = stops.findIndex((s) => s.stopId === toStop);
        return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
      })
      .map((shuttle) => {
        const stops = shuttle.stops;
        const fromIndex = stops.findIndex((s) => s.stopId === fromStop);
        const toIndex = stops.findIndex((s) => s.stopId === toStop);
        // Simple fare calculation
        const fare = (toIndex - fromIndex) * 10;
        return {
          shuttleId: shuttle.shuttleId,
          shuttleName: shuttle.shuttleName,
          seats: shuttle.seats,
          departureTime: shuttle.departureTime,
          arrivalTime: shuttle.arrivalTime,
          fare
        };
      });

    return NextResponse.json(availableShuttles, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to search available shuttles" },
      { status: 500 }
    );
  }
}
