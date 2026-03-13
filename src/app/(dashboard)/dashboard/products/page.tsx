import { Suspense } from 'react';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { ProductsTable } from '@/components/dashboard/ProductsTable';
import { AddProductButton } from '@/components/dashboard/AddProductButton';
import { Skeleton } from '@/components/ui/skeleton';
import Category from '@/models/Category';
import Badge from '@/models/Badge';
import { getDictionary } from '@/dictionaries';
import { Language } from '@/dictionaries';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
    lang?: string;
  }>;
}

// Extracting to a better named component
async function ProductsListContent({ 
  searchParams, 
  language 
}: { 
  searchParams: Awaited<Props['searchParams']>,
  language: Language
}) {
  await connectDB();
  
  // Register models for population by touching them
  if (mongoose.models && mongoose.models.Category) Category.modelName;
  if (mongoose.models && mongoose.models.Badge) Badge.modelName;
  
  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  
  const query: Record<string, unknown> = {};
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
    Category.find({}, '_id name nameAr').sort({ name: 1 }).lean()
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
  // Note: Language will be handled by client store in the components, 
  // but for the title/desc we need it here. We can use a default or detect from params if needed.
  // Actually, since the layout is client-side and handles the language toggle, 
  // we'll use a Client Component wrapper for the header if we want it to react instantly, 
  // or just accept it might stay in one language until refresh.
  // Given the layout structure, let's use a client wrapper for the header or just pass dict.
  
  // For now, let's assume 'ar' if we can detect it, else 'en'.
  // We'll rely on the client components to handle the reactive parts.
  
  return (
    <div className="space-y-6">
      <AdminProductsHeader />

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <ProductsListContent searchParams={resolvedParams} language="en" />
      </Suspense>
    </div>
  );
}

function AdminProductsHeader() {
  // We need this to be reactive, so let's make it a client component or move logic
  return <AdminProductsHeaderClient />;
}

import { AdminProductsHeaderClient } from '@/components/dashboard/AdminProductsHeaderClient';
