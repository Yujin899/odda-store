import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Bundle } from '@/models/Bundle';
import { auth } from '@/auth';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import { revalidateTag } from 'next/cache';
import type { BundleDoc } from '@/types/models';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    
    const bundle = await Bundle.findOne({
      $or: [{ slug: slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : undefined }].filter(Boolean),
    }).lean<BundleDoc>();

    if (!bundle) {
      return NextResponse.json({ message: 'Bundle not found' }, { status: 404 });
    }

    const sanitizedBundle = {
      id: bundle._id.toString(),
      name: bundle.name,
      nameAr: bundle.nameAr,
      slug: bundle.slug,
      description: bundle.description,
      descriptionAr: bundle.descriptionAr,
      price: bundle.price,
      originalPrice: bundle.compareAtPrice ?? null,
      images: bundle.images,
      stock: bundle.stock,
      featured: bundle.featured,
      bundleItems: bundle.bundleItems,
      bundleItemsAr: bundle.bundleItemsAr,
      createdAt: bundle.createdAt,
    };

    return NextResponse.json(sanitizedBundle);
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

    const updatedBundle = await Bundle.findByIdAndUpdate(bundle._id, updates, { new: true }).lean<BundleDoc>();
    if (!updatedBundle) {
      return NextResponse.json({ message: 'Failed to update bundle' }, { status: 500 });
    }

    revalidateTag('bundles-list', 'page');
    revalidateTag('products-list', 'page');

    const sanitizedBundle = {
      id: updatedBundle._id.toString(),
      name: updatedBundle.name,
      nameAr: updatedBundle.nameAr,
      slug: updatedBundle.slug,
      description: updatedBundle.description,
      descriptionAr: updatedBundle.descriptionAr,
      price: updatedBundle.price,
      originalPrice: updatedBundle.compareAtPrice ?? null,
      images: updatedBundle.images,
      stock: updatedBundle.stock,
      featured: updatedBundle.featured,
      bundleItems: updatedBundle.bundleItems,
      bundleItemsAr: updatedBundle.bundleItemsAr,
      createdAt: updatedBundle.createdAt,
    };

    return NextResponse.json(sanitizedBundle);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
});

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
    
    revalidateTag('bundles-list', 'page');

    return NextResponse.json({ message: 'Deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
});
