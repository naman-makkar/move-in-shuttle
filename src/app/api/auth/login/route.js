// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/user';
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // Return user details including role and walletBalance
    return NextResponse.json(
      { success: true, user: { email: user.email, walletBalance: user.walletBalance, role: user.role } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
