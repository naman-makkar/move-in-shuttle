// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    // Validate that email ends with @university.edu
    if (!email.endsWith('@bennett.edu.in')) {
      return NextResponse.json({ error: 'Please use a valid university email' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with default wallet balance
    const newUser = await User.create({
      email,
      password: hashedPassword,
      walletBalance: 100
    });

    return NextResponse.json({ success: true, user: { email: newUser.email, walletBalance: newUser.walletBalance } }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
