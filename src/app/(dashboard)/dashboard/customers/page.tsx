import { Suspense } from 'react';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { CustomersManager } from '@/components/dashboard/CustomersManager';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

async function CustomersList() {
  await connectDB();
  
  const users = await User.find({})
    .select('name email role image createdAt')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <CustomersManager users={JSON.parse(JSON.stringify(users))} />
  );
}

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <CustomersList />
      </Suspense>
    </div>
  );
}
