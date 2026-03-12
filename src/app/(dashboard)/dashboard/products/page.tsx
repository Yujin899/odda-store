import { Suspense } from 'react';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { ProductsTable } from '@/components/dashboard/ProductsTable';
import { AddProductButton } from '@/components/dashboard/AddProductButton';
import { Skeleton } from '@/components/ui/skeleton';
import Category from '@/models/Category';
import Badge from '@/models/Badge';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
  }>;
}

async function ProductsList({ searchParams }: { searchParams: Awaited<Props['searchParams']> }) {
  await connectDB();
  
  // Ensure models are registered (especially Badge)
  // @ts-ignore - just ensuring they are loaded
  const _c = Category;
  // @ts-ignore
  const _b = Badge;

  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  
  const query: Record<string, any> = {};
  if (searchParams.search) {
    query.name = { $regex: searchParams.search, $options: 'i' };
  }
  if (searchParams.categoryId && searchParams.categoryId !== 'all') {
    query.categoryId = searchParams.categoryId;
  }

  const [products, total, categories] = await Promise.all([
    Product.find(query)
      .populate({ path: 'categoryId', strictPopulate: false })
      .populate({ path: 'badgeId', strictPopulate: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
    Category.find({}, '_id name').sort({ name: 1 }).lean()
  ]);

  return (
    <ProductsTable 
      products={JSON.parse(JSON.stringify(products))} 
      total={total}
      page={page}
      limit={limit}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your store inventory and product details.
          </p>
        </div>
        <AddProductButton />
      </div>

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <ProductsList searchParams={resolvedParams} />
      </Suspense>
    </div>
  );
}
