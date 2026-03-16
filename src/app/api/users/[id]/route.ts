import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export const PATCH = auth(async (req, { params }) => {
  if (req.auth?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, role, isBlocked, password } = body;

    // Security check: Prevent self-sabotage
    if (req.auth.user.id === id) {
      if (isBlocked === true || (role && role !== 'admin')) {
        return NextResponse.json(
          { message: 'You cannot block or demote your own admin account' },
          { status: 400 }
        );
      }
    }

    await connectDB();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isBlocked === 'boolean') user.isBlocked = isBlocked;
    
    if (password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked
      }
    });
  } catch (error: unknown) {
    console.error('User update error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
});

export const DELETE = auth(async (req, { params }) => {
  if (req.auth?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Security check: Prevent self-deletion
    if (req.auth.user.id === id) {
      return NextResponse.json(
        { message: 'You cannot delete your own admin account' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    console.error('User deletion error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
});
