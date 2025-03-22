//src/app/api/bookings/confirm/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Booking from '@/models/booking';
import User from '@/models/user';
import Transaction from '@/models/transaction';

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, shuttleId, fromStop, toStop, fare } = await request.json();
    
    // Check wallet balance
    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.walletBalance < fare) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
    }
    
    // Create booking record
    const booking = await Booking.create({
      userId,
      shuttleId,
      fromStop,
      toStop,
      fare,
      bookingStatus: "confirmed"
    });
    
    // Deduct fare immediately (or modify policy if needed)
    user.walletBalance -= fare;
    await user.save();
    
    await Transaction.create({
      userId: user.userId,
      amount: -fare,
      type: "debit",
      description: "Booking fare deduction upon confirmation"
    });
    
    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Booking confirmation failed" }, { status: 500 });
  }
}
