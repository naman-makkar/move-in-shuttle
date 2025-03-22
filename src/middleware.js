import { NextResponse } from 'next/server';

export async function middleware(req) {
	// For now, allow all access without authentication
	return NextResponse.next();
}

// Define which routes to apply the middleware to
export const config = {
	matcher: ['/admin/:path*']
};
