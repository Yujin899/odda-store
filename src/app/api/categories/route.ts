import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import { auth } from '@/auth';
import { revalidateTag, unstable_cache } from 'next/cache';

const getCachedCategories = unstable_cache(
  async () => {
    await connectDB();
    return await Category.find({})
      .select('_id name nameAr slug description descriptionAr image')
      .sort({ name: 1 })
      .lean();
  },
  ['categories-list'],
  { tags: ['categories-list'], revalidate: 3600 }
);

export async function GET() {
  try {
    const categories = await getCachedCategories();
    const sanitizedCategories = categories.map((c: any) => ({
      id: c._id.toString(),
      name: c.name,
      nameAr: c.nameAr,
      slug: c.slug,
      description: c.description ?? null,
      descriptionAr: c.descriptionAr ?? null,
      image: c.image ?? null,
    }));
    return NextResponse.json({ categories: sanitizedCategories });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
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
    
    (revalidateTag as any)('categories-list', 'page');
    
    const sanitizedCategory = {
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug
    };

    return NextResponse.json(sanitizedCategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
