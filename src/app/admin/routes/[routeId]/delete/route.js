// src/app/admin/routes/[routeId]/delete/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Route from '@/models/route';

export async function DELETE(request, { params }) {
  const { routeId } = params;
  try {
    await dbConnect();
    const deleted = await Route.findOneAndDelete({ routeId });
    if (!deleted) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
  }
}
