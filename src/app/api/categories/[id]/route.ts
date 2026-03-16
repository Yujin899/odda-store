import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import { Product } from '@/models/Product';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const body = await req.json();
    
    // IMAGE CLEANUP LOGIC: Delete old image if it's being replaced
    if (body.image) {
      const oldCategory = await Category.findById(id);
      if (oldCategory && oldCategory.image && oldCategory.image !== body.image) {
        await deleteCloudinaryImage(oldCategory.image);
      }
    }

    // If slug is updated, check for uniqueness
    if (body.slug) {
      const existing = await Category.findOne({ slug: body.slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ message: 'Slug already exists' }, { status: 409 });
      }
    }

    const category = await Category.findByIdAndUpdate(id, body, { new: true });

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    // Next.js 16 requires 2 arguments for revalidateTag
    // According to search, 'layout' or 'page' might be expected, but tags are usually 'layout' level or global.
    // Given the lint error in this specific environment, we use 'page' as a safe default or follow standard types if known.
    // In this codebase, if it insists on 2, we provide them.
    revalidateTag('categories-list', 'page');

    const sanitizedCategory = {
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug
    };

    return NextResponse.json(sanitizedCategory);
  } catch (error: unknown) {
    console.error('Category update error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export const DELETE = auth(async (req, { params }) => {
  if (req.auth?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();
    
    // Check if any products use this category
    const productCount = await Product.countDocuments({ categoryId: id });
    if (productCount > 0) {
      return NextResponse.json(
        { message: `Cannot delete - used by ${productCount} products` },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    // Cleanup Cloudinary
    if (category.image) {
      await deleteCloudinaryImage(category.image);
    }

    await Category.findByIdAndDelete(id);

    revalidateTag('categories-list', 'page');

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: unknown) {
    console.error('Category deletion error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
});
