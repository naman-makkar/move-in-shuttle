import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/user';

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, gender } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }
    
    // Find the user
    const user = await User.findOne({ userId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Update gender if provided
    if (gender && ['male', 'female', 'other', 'prefer-not-to-say'].includes(gender)) {
      user.gender = gender;
    }
    
    // Save the updated user
    await user.save();
    
    // Return updated profile data
    return NextResponse.json({
      userId: user.userId,
      email: user.email,
      role: user.role,
      gender: user.gender,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
} 