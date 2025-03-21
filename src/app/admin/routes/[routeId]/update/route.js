
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Route from '@/models/route';

export async function PUT(request, { params }) {
  const { routeId } = params;
  try {
    const { routeName, stops, isActive } = await request.json();
    await dbConnect();

    let stopsArray = [];
    if (stops && stops.trim() !== "") {
      stopsArray = stops.split(",").map((s) => s.trim());
    }

    const updated = await Route.findOneAndUpdate(
      { routeId },
      {
        routeName,
        stops: stopsArray,
        isActive
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, route: updated }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
  }
}
