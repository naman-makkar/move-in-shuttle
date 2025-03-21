// src/app/api/bookings/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/user';
import Transaction from '@/models/transaction';
import Booking from '@/models/booking';

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, routeId, fare } = await request.json(); // fare: points to be deducted
    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (user.walletBalance < fare) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
    }
    // Deduct fare from wallet
    user.walletBalance -= fare;
    await user.save();

    // Record transaction for booking deduction
    await Transaction.create({
      userId: user.userId,
      amount: -fare,
      type: 'debit',
      description: 'Booking deduction'
    });

    // Create a booking record
    const booking = await Booking.create({
      userId: user.userId,
      routeId,
      pointsDeducted: fare
    });

    return NextResponse.json({ success: true, booking, walletBalance: user.walletBalance }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}
