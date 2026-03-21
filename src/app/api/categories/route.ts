import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import { auth } from '@/auth';
import { revalidateTag, revalidatePath } from 'next/cache';
import type { CategoryDoc } from '@/types/models';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({})
      .select('_id name nameAr slug description descriptionAr image')
      .sort({ name: 1 })
      .lean<CategoryDoc[]>();

    const sanitizedCategories = categories.map((c) => ({
      id: c._id.toString(),
      _id: c._id.toString(),
      name: c.name,
      nameAr: c.nameAr,
      slug: c.slug,
      description: c.description || undefined,
      descriptionAr: c.descriptionAr || undefined,
      image: c.image || undefined,
    }));
    return NextResponse.json({ categories: sanitizedCategories });
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
    const { name, nameAr, slug, description, descriptionAr, image } = body;

    if (!name) {
      return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    const existing = await Category.findOne({ slug: finalSlug });
    if (existing) {
      return NextResponse.json({ message: 'Category slug already exists' }, { status: 409 });
    }

    const category = await Category.create({ 
      name, 
      nameAr, 
      slug: finalSlug, 
      description, 
      descriptionAr, 
      image 
    });
    
    revalidateTag('categories-list', 'page');
    revalidatePath('/dashboard/categories');
    revalidatePath('/api/categories');
    
    const sanitizedCategory = {
      id: category._id.toString(),
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug
    };

    return NextResponse.json(sanitizedCategory, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
