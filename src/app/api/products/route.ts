import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { auth } from '@/auth';
import Category from '@/models/Category';
import Badge from '@/models/Badge';
import { revalidateTag, unstable_cache } from 'next/cache';

// Cached fetcher for products
const getCachedProducts = unstable_cache(
  async (query: Record<string, unknown>, sortOption: any, skip: number, limit: number) => {
    await connectDB();
    // Register models
    void Category;
    void Badge;
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate({ path: 'categoryId', strictPopulate: false })
        .populate({ path: 'badgeId', strictPopulate: false })
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);
    return { products, total };
  },
  ['products-list'],
  { tags: ['products-list'], revalidate: 60 }
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    const query: Record<string, any> = {};
    
    if (category) {
      await connectDB();
      const cat = await Category.findOne({ slug: category }).lean();
      if (cat) query.categoryId = cat._id;
    }
    
    if (search) query.name = { $regex: search, $options: 'i' };
    if (featured === 'true') query.featured = true;

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    // Use cached fetcher
    const { products, total } = await getCachedProducts(query, sortOption, skip, limit);

    const sanitizedProducts = (products as any[]).map((p) => ({
      id: p._id.toString(),
      name: p.name,
      nameAr: p.nameAr,
      slug: p.slug,
      description: p.description,
      descriptionAr: p.descriptionAr,
      price: p.price,
      originalPrice: p.compareAtPrice ?? null,
      images: p.images.map((img: any) => ({ url: img.url, isPrimary: img.isPrimary })),
      categoryId: p.categoryId?.toString() ?? null,
      badge: p.badgeId ? {
        name: p.badgeId.name,
        nameAr: p.badgeId.nameAr,
        color: p.badgeId.color,
        textColor: p.badgeId.textColor
      } : null,
      stock: p.stock,
      featured: p.featured,
      aiSummary: p.aiSummary ?? null,
      aiSummaryAr: p.aiSummaryAr ?? null,
      createdAt: p.createdAt,
    }));

    return NextResponse.json({
      products: sanitizedProducts,
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

    (revalidateTag as any)('products-list', 'page');
    
    const sanitizedProduct = {
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      price: product.price
    };

    return NextResponse.json(sanitizedProduct, { status: 201 });
  } catch (err: any) {
    console.error('Product creation error:', err);
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
  }
}) as any;
