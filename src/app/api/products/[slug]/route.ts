import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product, IProduct } from '@/models/Product';
import { auth } from '@/auth';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import Category from '@/models/Category';
import Badge from '@/models/Badge';
import { revalidatePath } from 'next/cache';

// export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    
    // Register models for population
    Category;
    Badge;

    const { slug } = await params;
    
    // Find by Slug (priority) or ID (backward compat)
    const product = await Product.findOne({
      $or: [{ slug: slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : undefined }].filter(Boolean),
    })
    .populate({ path: 'categoryId', strictPopulate: false })
    .populate({ path: 'badgeId', strictPopulate: false });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
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

    // Register models for population
    Category;
    Badge;
    
    const product = await Product.findOne({
      $or: [{ _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : undefined }, { slug: slug }].filter(Boolean),
    }) as any;
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const updates = await req.json();

    // Validate images if provided
    if (updates.images) {
      if (updates.images.length === 0) {
        return NextResponse.json({ message: 'At least one image is required' }, { status: 400 });
      }
      const primaryCount = updates.images.filter((img: any) => img.isPrimary).length;
      if (primaryCount !== 1) {
        return NextResponse.json({ message: 'Exactly one image must be primary' }, { status: 400 });
      }
    }

    // IMAGE CLEANUP LOGIC: Delete images that were removed in this update
    if (updates.images) {
      const oldImageUrls = product.images.map((img: any) => img.url);
      const newImageUrls = updates.images.map((img: any) => img.url);
      
      const removedImages = oldImageUrls.filter((url: string) => !newImageUrls.includes(url));
      
      for (const url of removedImages) {
        await deleteCloudinaryImage(url);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(product._id, updates, { new: true })
      .populate({ path: 'categoryId', strictPopulate: false })
      .populate({ path: 'badgeId', strictPopulate: false }) as any;

    revalidatePath('/api/products');
    revalidatePath(`/api/products/${updatedProduct.slug}`);
    revalidatePath(`/product/${updatedProduct.slug}`);

    return NextResponse.json(updatedProduct);
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
    
    const product = await Product.findOne({
      $or: [{ _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : undefined }, { slug: slug }].filter(Boolean),
    }) as any;
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    // Cleanup Cloudinary
    for (const img of product.images) {
      await deleteCloudinaryImage(img.url);
    }

    await Product.findByIdAndDelete(product._id);
    
    revalidatePath('/api/products');
    revalidatePath(`/api/products/${product.slug}`);
    revalidatePath(`/product/${product.slug}`);

    return NextResponse.json({ message: 'Deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}) as any;
