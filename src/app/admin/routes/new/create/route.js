// src/app/admin/routes/new/create/route.js (Route Handler in Next.js 13)
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Route from '@/models/route';

export async function POST(request) {
  try {
    const { routeName, stops } = await request.json();
    await dbConnect();

    let stopsArray = [];
    if (stops && stops.trim() !== "") {
      stopsArray = stops.split(",").map((s) => s.trim());
    }

    await Route.create({
      routeName,
      stops: stopsArray
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create route' }, { status: 500 });
  }
}
