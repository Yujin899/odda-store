import { Suspense } from 'react';
import { connectDB } from '@/lib/mongodb';
import { Bundle } from '@/models/Bundle';
import { BundlesTable } from '@/components/dashboard/BundlesTable';
import { AdminBundlesHeaderClient } from '@/components/dashboard/AdminBundlesHeaderClient';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

async function BundlesListContent({ 
  searchParams 
}: { 
  searchParams: Awaited<Props['searchParams']> 
}) {
  await connectDB();
  
  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  
  const query: Record<string, unknown> = {};
  if (searchParams.search) {
    query.name = { $regex: searchParams.search, $options: 'i' };
  }

  const [bundles, total] = await Promise.all([
    Bundle.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Bundle.countDocuments(query),
  ]);

  return (
    <BundlesTable 
      bundles={JSON.parse(JSON.stringify(bundles))} 
      total={total}
      page={page}
      limit={limit}
    />
  );
}

export default async function AdminBundlesPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  
  return (
    <div className="space-y-6">
      <AdminBundlesHeaderClient />

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <BundlesListContent searchParams={resolvedParams} />
      </Suspense>
    </div>
  );
}
