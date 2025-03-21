// src/app/api/admin/stops/[stopId]/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Stop from '@/models/stop';

export async function GET(request, { params }) {
  const { stopId } = params;
  try {
    await dbConnect();
    const stop = await Stop.findOne({ stopId }).lean();
    if (!stop) return NextResponse.json({ error: "Stop not found" }, { status: 404 });
    return NextResponse.json(stop, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stop" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { stopId } = params;
  try {
    await dbConnect();
    const { stopName, latitude, longitude, isActive } = await request.json();
    const updatedStop = await Stop.findOneAndUpdate(
      { stopId },
      { stopName, location: { latitude, longitude }, isActive },
      { new: true }
    );
    if (!updatedStop) return NextResponse.json({ error: "Stop not found" }, { status: 404 });
    return NextResponse.json({ success: true, stop: updatedStop }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update stop" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { stopId } = params;
  try {
    await dbConnect();
    const deletedStop = await Stop.findOneAndDelete({ stopId });
    if (!deletedStop) return NextResponse.json({ error: "Stop not found" }, { status: 404 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete stop" }, { status: 500 });
  }
}
