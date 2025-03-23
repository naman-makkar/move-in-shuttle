import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Booking from '@/models/booking';

export async function GET(_request, { params }) {
  try {
    await dbConnect();
    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    const bookings = await Booking.find({ userId }).lean();
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
