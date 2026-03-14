import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Bundle } from '@/models/Bundle';
import { auth } from '@/auth';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import { revalidateTag } from 'next/cache';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    
    const bundle = await Bundle.findOne({
      $or: [{ slug: slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : undefined }].filter(Boolean),
    });

    if (!bundle) {
      return NextResponse.json({ message: 'Bundle not found' }, { status: 404 });
    }

    return NextResponse.json(bundle);
  } catch (error) {
    console.error('Bundle fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export const PUT = auth(async (req, { params }) => {
  if (req.auth?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    await connectDB();

    const bundle = await Bundle.findOne({
      $or: [{ _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : undefined }, { slug: slug }].filter(Boolean),
    });
    if (!bundle) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const updates = await req.json();

    // Image cleanup if images are replaced
    if (updates.images) {
      const removedImages = bundle.images.filter((url: string) => !updates.images.includes(url));
      for (const url of removedImages) {
        await deleteCloudinaryImage(url);
      }
    }

    const updatedBundle = await Bundle.findByIdAndUpdate(bundle._id, updates, { new: true });

    (revalidateTag as any)('bundles-list', 'page');
    (revalidateTag as any)('products-list', 'page');

    const sanitizedBundle = {
      _id: updatedBundle?._id.toString(),
      name: updatedBundle?.name,
      slug: updatedBundle?.slug
    };

    return NextResponse.json(sanitizedBundle);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}) as any;

export const DELETE = auth(async (req, { params }) => {
  if (req.auth?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    await connectDB();
    
    const bundle = await Bundle.findOne({
      $or: [{ _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : undefined }, { slug: slug }].filter(Boolean),
    });
    if (!bundle) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    // Cleanup images
    for (const url of bundle.images) {
      await deleteCloudinaryImage(url);
    }

    await Bundle.findByIdAndDelete(bundle._id);
    
    (revalidateTag as any)('bundles-list', 'page');

    return NextResponse.json({ message: 'Deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}) as any;
