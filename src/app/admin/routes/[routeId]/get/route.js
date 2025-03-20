// src/app/admin/routes/[routeId]/get/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Route from '@/models/route';

export async function GET(request, { params }) {
  const { routeId } = params; // dynamic param
  try {
    await dbConnect();
    const route = await Route.findOne({ routeId }).lean();
    if (!route) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }
    return NextResponse.json(route, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch route' }, { status: 500 });
  }
}
