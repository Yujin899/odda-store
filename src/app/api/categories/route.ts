import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export const revalidate = 60; // Cache for 1 minute

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({})
      .select('_id name slug image')
      .sort({ name: 1 });
    return NextResponse.json({ categories });
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
    const { name, slug, description, image } = body;

    if (!name) {
      return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    const existing = await Category.findOne({ slug: finalSlug });
    if (existing) {
      return NextResponse.json({ message: 'Category slug already exists' }, { status: 409 });
    }

    const category = await Category.create({ name, slug: finalSlug, description, image });
    
    revalidatePath('/api/categories');
    revalidatePath('/');
    
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
