import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Transaction from '@/models/transaction';

export async function GET(_request, { params }) {
  try {
    await dbConnect();
    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
