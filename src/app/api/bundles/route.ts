import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Bundle } from '@/models/Bundle';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const bundles = await Bundle.find({}).sort({ createdAt: -1 });

    return NextResponse.json(bundles);
  } catch (error) {
    console.error('Bundles fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export const POST = auth(async (req) => {
  if (req.auth?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const bundleData = await req.json();

    const { images, name, slug } = bundleData;

    if (!name || !slug) {
      return NextResponse.json({ message: 'Name and slug are required' }, { status: 400 });
    }

    if (!images || images.length === 0) {
      return NextResponse.json({ message: 'At least one image is required' }, { status: 400 });
    }

    const bundle = await Bundle.create(bundleData);

    revalidatePath('/api/bundles');
    revalidatePath('/'); // Revalidate home page for HomeBundles component

    return NextResponse.json(bundle, { status: 201 });
  } catch (err: any) {
    console.error('Bundle creation error:', err);
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
  }
}) as any;
