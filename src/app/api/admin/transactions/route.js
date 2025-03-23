// src/app/api/admin/transactions/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Transaction from '@/models/transaction';

export async function GET() {
	try {
		await dbConnect();
		const transactions = await Transaction.find({}).lean();
		return NextResponse.json(transactions, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch transactions' },
			{ status: 500 }
		);
	}
}
