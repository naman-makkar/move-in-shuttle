import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    // Fetch all transactions for this user
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
