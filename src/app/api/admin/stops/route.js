// src/app/api/admin/stops/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Stop from '@/models/stop';

export async function GET() {
	try {
		await dbConnect();
		const stops = await Stop.find({}).lean();
		return NextResponse.json(stops, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch stops' },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		await dbConnect();
		const { stopName, latitude, longitude } = await request.json();
		const newStop = await Stop.create({
			stopName,
			location: { latitude, longitude }
		});
		return NextResponse.json({ success: true, stop: newStop }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to create stop' },
			{ status: 500 }
		);
	}
}
