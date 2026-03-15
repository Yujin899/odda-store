import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { auth } from '@/auth';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import Category from '@/models/Category';
import Badge from '@/models/Badge';
import { revalidateTag } from 'next/cache';
import { IProductDocument } from '@/models/Product';

// export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    
    // Register models for population
    void Category;
    void Badge;

    const { slug } = await params;
    
    // Find by Slug (priority) or ID (backward compat)
    const product = await Product.findOne({
      $or: [{ slug: slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : undefined }].filter(Boolean),
    })
    .populate({ path: 'categoryId', strictPopulate: false })
    .populate({ path: 'badgeId', strictPopulate: false })
    .lean();

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const badge = product.badgeId as unknown as { name?: string; nameAr?: string; color?: string; textColor?: string } | null;
    const category = product.categoryId as unknown as { _id: { toString(): string } } | null;

    const sanitizedProduct = {
      id: product._id.toString(),
      name: product.name,
      nameAr: product.nameAr,
      slug: product.slug,
      description: product.description,
      descriptionAr: product.descriptionAr,
      price: product.price,
      originalPrice: product.compareAtPrice ?? null,
      images: product.images,
      categoryId: category?._id?.toString() ?? product.categoryId?.toString() ?? null,
      badge: badge ? {
        name: badge.name || badge.nameAr,
        nameAr: badge.nameAr,
        color: badge.color,
        textColor: badge.textColor
      } : null,
      stock: product.stock,
      featured: product.featured,
      aiSummary: product.aiSummary ?? null,
      aiSummaryAr: product.aiSummaryAr ?? null,
      createdAt: product.createdAt,
    };

    return NextResponse.json(sanitizedProduct);
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
    void Category;
    void Badge;
    
    const product = await Product.findOne({
      $or: [{ _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : undefined }, { slug: slug }].filter(Boolean),
    }) as IProductDocument | null;
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const updates = await req.json();

    // Validate images if provided
    if (updates.images) {
      if (updates.images.length === 0) {
        return NextResponse.json({ message: 'At least one image is required' }, { status: 400 });
      }
      const primaryCount = updates.images.filter((img: { isPrimary: boolean }) => img.isPrimary).length;
      if (primaryCount !== 1) {
        return NextResponse.json({ message: 'Exactly one image must be primary' }, { status: 400 });
      }
    }

    // IMAGE CLEANUP LOGIC: Delete images that were removed in this update
    if (updates.images) {
      const oldImageUrls = product.images.map((img) => img.url);
      const newImageUrls = (updates.images as { url: string }[]).map((img) => img.url);
      
      const removedImages = oldImageUrls.filter((url: string) => !newImageUrls.includes(url));
      
      for (const url of removedImages) {
        await deleteCloudinaryImage(url);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(product._id, updates, { new: true })
      .populate({ path: 'categoryId', strictPopulate: false })
      .populate({ path: 'badgeId', strictPopulate: false }) as IProductDocument | null;

    if (!updatedProduct) throw new Error('Failed to update product');

    revalidateTag('products-list', 'page');
    
    const badge = updatedProduct.badgeId as unknown as { name?: string; nameAr?: string; color?: string; textColor?: string } | null;

    const sanitizedProduct = {
      id: updatedProduct._id.toString(),
      name: updatedProduct.name,
      nameAr: updatedProduct.nameAr,
      slug: updatedProduct.slug,
      description: updatedProduct.description,
      descriptionAr: updatedProduct.descriptionAr,
      price: updatedProduct.price,
      originalPrice: updatedProduct.compareAtPrice ?? null,
      images: updatedProduct.images,
      categoryId: updatedProduct.categoryId?.toString() ?? null,
      badge: badge ? {
        name: badge.name,
        nameAr: badge.nameAr,
        color: badge.color,
        textColor: badge.textColor
      } : null,
      stock: updatedProduct.stock,
      featured: updatedProduct.featured,
      aiSummary: updatedProduct.aiSummary ?? null,
      aiSummaryAr: updatedProduct.aiSummaryAr ?? null,
      createdAt: updatedProduct.createdAt,
    };

    return NextResponse.json(sanitizedProduct);
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
    
    const product = await Product.findOne({
      $or: [{ _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : undefined }, { slug: slug }].filter(Boolean),
    }) as IProductDocument | null;
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    // Cleanup Cloudinary
    for (const img of product.images) {
      await deleteCloudinaryImage(img.url);
    }

    await Product.findByIdAndDelete(product._id);
    
    revalidateTag('products-list', 'page');

    return NextResponse.json({ message: 'Deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
});
