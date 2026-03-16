import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Badge from '@/models/Badge';
import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';
import type { BadgeDoc } from '@/types/models';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    await connectDB();
    const badges = await Badge.find({}).sort({ name: 1 }).lean<BadgeDoc[]>();
    return NextResponse.json({ badges });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { name, nameAr, color, textColor } = body;

    if (!name || !color || !textColor) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existing = await Badge.findOne({ name });
    if (existing) {
      return NextResponse.json({ message: 'Badge name already exists' }, { status: 409 });
    }

    const badge = await Badge.create({ name, nameAr, color, textColor });
    
    revalidateTag('products-list', 'page'); // Badges affect product display
    
    const sanitizedBadge = {
      _id: badge._id.toString(),
      name: badge.name,
      color: badge.color
    };

    return NextResponse.json(sanitizedBadge, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
