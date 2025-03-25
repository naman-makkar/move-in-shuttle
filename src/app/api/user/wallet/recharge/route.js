// src/app/api/user/wallet/recharge/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/user';
import Transaction from '@/models/transaction';

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, amount, description } = await request.json(); // amount to add
    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Add the amount to user's wallet
    user.walletBalance += amount;
    await user.save();

    // Record a transaction as a credit
    await Transaction.create({
      userId: user.userId,
      amount: amount,
      type: 'credit',
      description: description || 'Wallet recharge'
    });

    return NextResponse.json({ success: true, walletBalance: user.walletBalance }, { status: 200 });
  } catch (error) {
    console.error("Recharge error:", error);
    return NextResponse.json({ error: 'Wallet recharge failed' }, { status: 500 });
  }
}
