// src/app/admin/routes/new/create/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Route from '@/models/route';

export async function POST(request) {
  try {
    const { routeName, stops } = await request.json(); // stops is now an array of stop IDs
    await dbConnect();

    await Route.create({
      routeName,
      stops, // store the array of stop IDs
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create route' }, { status: 500 });
  }
}
