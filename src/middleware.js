import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// This secret should match NEXTAUTH_SECRET in your .env
const secret = process.env.NEXTAUTH_SECRET;
console.log("Middleware secret:", secret);

export async function middleware(req) {
  // Parse token from the request
  const token = await getToken({ req, secret });
  console.log("Token in middleware:", token);
  
  // e.g. if the user is not logged in and tries to access an admin page
  if (!token) {
    // If not logged in, redirect to login
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If the user tries to access /admin but is not an admin
  if (req.nextUrl.pathname.startsWith("/admin") && token.role !== "admin") {
    // redirect or show an error
    return NextResponse.redirect(new URL("/?error=unauthorized", req.url));
  }

  // If everything is fine, continue
  return NextResponse.next();
}

// Define which routes to apply the middleware to
export const config = {
  matcher: ["/admin/:path*"],
};
