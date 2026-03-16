import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { auth } from '@/auth';

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    
    const users = await User.find({})
      .select('name email role createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error: unknown) {
    console.error('Users fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
