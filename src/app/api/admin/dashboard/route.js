// src/app/api/admin/dashboard/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Route from '@/models/route';
import Stop from '@/models/stop';
import User from '@/models/user';
import Transaction from '@/models/transaction';

export async function GET() {
  try {
    await dbConnect();
    const routes = await Route.find({}).lean();
    const stops = await Stop.find({}).lean();
    const users = await User.find({}).lean();
    const transactions = await Transaction.find({}).lean();

    return NextResponse.json({ routes, stops, users, transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
