import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Bundle } from '@/models/Bundle';
import { auth } from '@/auth';
import { revalidateTag, unstable_cache } from 'next/cache';
import type { BundleDoc } from '@/types/models';
import { NextRequest } from 'next/server';

const getCachedBundles = unstable_cache(
  async (query: Record<string, string | number | boolean | object> = {}) => {
    await connectDB();
    return await Bundle.find(query).sort({ createdAt: -1 }).lean<BundleDoc[]>();
  },
  ['bundles-list'],
  { tags: ['bundles-list'], revalidate: 60 }
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    
    const query: Record<string, string | number | boolean | object> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameAr: { $regex: search, $options: 'i' } },
      ];
    }

    const bundles = await getCachedBundles(query);
    const sanitizedBundles = bundles.map((b) => ({
      id: b._id.toString(),
      name: b.name,
      nameAr: b.nameAr,
      slug: b.slug,
      description: b.description,
      descriptionAr: b.descriptionAr,
      price: b.price,
      originalPrice: b.compareAtPrice ?? null,
      images: b.images,
      stock: b.stock,
      featured: b.featured,
      bundleItems: b.bundleItems,
      bundleItemsAr: b.bundleItemsAr,
      averageRating: b.averageRating || 0,
      reviewCount: b.numReviews || 0,
      createdAt: b.createdAt,
    }));
    return NextResponse.json(sanitizedBundles);
  } catch (error: unknown) {
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

    revalidateTag('bundles-list', 'page');
    revalidateTag('products-list', 'page'); // Bundles often contain products

    const sanitizedBundle = {
      _id: bundle._id.toString(),
      name: bundle.name,
      slug: bundle.slug
    };

    return NextResponse.json(sanitizedBundle, { status: 201 });
  } catch (err: unknown) {
    console.error('Bundle creation error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
});
