import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/user';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }
    
    const user = await User.findOne({ userId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // If gender doesn't exist, set a default and save
    if (!user.gender) {
      user.gender = 'prefer-not-to-say';
      
      // Special case for demo - set the specific user as female for testing
      if (user.email === 'e22cseu0831@bennett.edu.in') {
        user.gender = 'female';
      }
      
      await user.save();
    }
    
    // Return relevant user profile data
    return NextResponse.json({
      userId: user.userId,
      email: user.email,
      role: user.role,
      gender: user.gender || 'prefer-not-to-say',
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
} 