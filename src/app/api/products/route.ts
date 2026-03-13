import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { auth } from '@/auth';
import Category from '@/models/Category';
import Badge from '@/models/Badge';
import { revalidatePath } from 'next/cache';

// export const dynamic = 'force-dynamic'; // Remove to allow Data Cache
export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Register models for population and registration
    const _c = Category;
    const _b = Badge;

    const { searchParams } = new URL(req.url);
    
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    const query: Record<string, any> = {};
    if (categoryId) query.categoryId = categoryId;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (featured === 'true') query.featured = true;

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate({ path: 'categoryId', strictPopulate: false })
        .populate({ path: 'badgeId', strictPopulate: false })
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export const POST = auth(async (req) => {
  if (req.auth?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const productData = await req.json();

    const { images, categoryId, badgeId, stock } = productData;

    // Validate images
    if (!images || images.length === 0) {
      return NextResponse.json({ message: 'At least one image is required' }, { status: 400 });
    }
    const primaryCount = images.filter((img: any) => img.isPrimary).length;
    if (primaryCount !== 1) {
      return NextResponse.json({ message: 'Exactly one image must be primary' }, { status: 400 });
    }

    // Validate category
    if (!categoryId) {
      return NextResponse.json({ message: 'Category is required' }, { status: 400 });
    }

    const product = await Product.create({
      ...productData,
      categoryId,
      badgeId: badgeId || undefined,
      stock: stock || 0,
      images,
    });

    revalidatePath('/api/products');
    revalidatePath('/api/products/[slug]', 'page');

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error('Product creation error:', err);
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
  }
}) as any;
