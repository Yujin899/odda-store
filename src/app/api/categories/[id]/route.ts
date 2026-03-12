import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import { Product } from '@/models/Product';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
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

    revalidatePath('/api/categories');
    revalidatePath('/');

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Category update error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
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

    revalidatePath('/api/categories');
    revalidatePath('/');

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Category deletion error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}) as any;
