import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Badge from '@/models/Badge';
import { Product } from '@/models/Product';
import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const badge = await Badge.findByIdAndUpdate(id, body, { new: true });

    if (!badge) {
      return NextResponse.json({ message: 'Badge not found' }, { status: 404 });
    }

    revalidateTag('products-list', 'page');

    const sanitizedBadge = {
      _id: badge._id.toString(),
      name: badge.name,
      color: badge.color
    };

    return NextResponse.json(sanitizedBadge);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Check if any products use this badge
    const productCount = await Product.countDocuments({ badgeId: id });
    if (productCount > 0) {
      return NextResponse.json(
        { message: `Cannot delete - used by ${productCount} products` },
        { status: 400 }
      );
    }

    const badge = await Badge.findByIdAndDelete(id);
    if (!badge) {
      return NextResponse.json({ message: 'Badge not found' }, { status: 404 });
    }

    revalidateTag('products-list', 'page');

    return NextResponse.json({ message: 'Badge deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
