// src/app/api/admin/users/[userId]/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/user';
import Transaction from '@/models/transaction';

export async function PUT(request, { params }) {
  const { userId } = params;
  try {
    await dbConnect();
    const { walletBalance, role } = await request.json();

    // Find the user
    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate the difference for transaction
    const diff = walletBalance - user.walletBalance;

    // Update user's wallet and role
    user.walletBalance = walletBalance;
    user.role = role;
    await user.save();

    // Record a transaction if there's a change
    if (diff !== 0) {
      await Transaction.create({
        userId: user.userId,
        amount: diff,
        type: diff > 0 ? 'credit' : 'debit',
        description: 'Admin wallet update'
      });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
