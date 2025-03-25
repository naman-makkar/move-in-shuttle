// src/app/api/bookings/my/[userId]/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Booking from '@/models/booking';
import { redis } from '@/lib/redis';

export async function GET(_request, { params }) {
  try {
    await dbConnect();
    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Check Redis for cached bookings
    const cacheKey = `bookings:${userId}`;
    const cachedBookings = await redis.get(cacheKey);

    if (cachedBookings) {
      try {
        // Ensure proper parsing of cached data
        const parsedBookings = JSON.parse(cachedBookings);
        return NextResponse.json(parsedBookings, { status: 200 });
      } catch (parseError) {
        console.error('Error parsing cached bookings:', parseError);
        // If parsing fails, fetch fresh data
        await redis.del(cacheKey); // Clear invalid cache
      }
    }

    // Fetch fresh data from database
    const bookings = await Booking.find({ userId }).lean();

    // Ensure the data is serializable before caching
    const serializedBookings = JSON.stringify(bookings);

    // Verify the data can be parsed before caching
    JSON.parse(serializedBookings);

    // Cache the verified serializable result - expire after 1 hour
    await redis.set(cacheKey, serializedBookings, { ex: 3600 });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
