// src/app/api/user/wallet/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/user';

export async function GET(request) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get('userId');
		if (!userId) {
			return NextResponse.json({ error: 'userId required' }, { status: 400 });
		}
		const user = await User.findOne({ userId }).lean();
		if (!user)
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		return NextResponse.json(
			{ walletBalance: user.walletBalance },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch wallet' },
			{ status: 500 }
		);
	}
}
