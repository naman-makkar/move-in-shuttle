//src/app/api/bookings/cancel/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Booking from "@/models/booking";
import Shuttle from "@/models/shuttle";
import User from "@/models/user";
import Transaction from "@/models/transaction";
import { redis } from "@/lib/redis";

export async function POST(request) {
  try {
    await dbConnect();
    const { bookingId, userId } = await request.json();

    // Find the booking
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    if (booking.bookingStatus !== "confirmed") {
      return NextResponse.json({ error: "Only confirmed bookings can be cancelled" }, { status: 400 });
    }
    
    // Fetch the corresponding shuttle to get departure time
    const shuttle = await Shuttle.findOne({ shuttleId: booking.shuttleId }).lean();
    if (!shuttle) {
      return NextResponse.json({ error: "Associated shuttle not found" }, { status: 404 });
    }
    
    // Check if cancellation is allowed (cancellation must be at least 2 hours before departure)
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    if (new Date(shuttle.departureTime) <= twoHoursFromNow) {
      return NextResponse.json({ error: "Cancellation not allowed within 2 hours of departure" }, { status: 400 });
    }
    
    // Determine cancellation frequency for the user in the last 30 days
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentCancellations = await Booking.countDocuments({
      userId,
      bookingStatus: "cancelled",
      updatedAt: { $gte: thirtyDaysAgo }
    });
    
    // Calculate penalty if necessary (if more than 3 cancellations in last 30 days)
    let penalty = 0;
    const fare = booking.fare;
    if (recentCancellations > 3) {
      penalty = fare * 0.2; // 20% penalty
    }
    
    // Determine refund amount: full fare minus penalty (if any)
    const refundAmount = fare - penalty;
    
    // Update the booking status to "cancelled" and record the penalty
    booking.bookingStatus = "cancelled";
    booking.cancellationPenalty = penalty;
    await booking.save();
    
    // Update user's wallet: refund the amount (add refund to wallet)
    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    user.walletBalance += refundAmount;
    await user.save();
    
    // Record refund transaction (credit)
    await Transaction.create({
      userId: user.userId,
      amount: refundAmount,
      type: "credit",
      description: "Booking cancellation refund"
    });
    
    // If a penalty applies, record a penalty transaction (debit) to indicate the penalty imposed
    if (penalty > 0) {
      await Transaction.create({
        userId: user.userId,
        amount: -penalty,
        type: "debit",
        description: "Cancellation penalty due to frequent cancellations"
      });
    }

    // Invalidate the Redis cache for this user's bookings
    const cacheKey = `bookings:${userId}`;
    await redis.del(cacheKey);
    
    return NextResponse.json({
      success: true,
      bookingId: booking.bookingId,
      refundAmount,
      penalty,
      newWalletBalance: user.walletBalance
    }, { status: 200 });
    
  } catch (error) {
    console.error("Cancellation error:", error);
    return NextResponse.json({ error: "Cancellation failed" }, { status: 500 });
  }
}
