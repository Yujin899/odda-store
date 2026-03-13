import { Suspense } from 'react';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { OrdersManager } from '@/components/dashboard/OrdersManager';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminOrdersHeaderClient } from '@/components/dashboard/AdminOrdersHeaderClient';

export const dynamic = 'force-dynamic';

async function OrdersListContent() {
  await connectDB();
  
  const orders = await Order.find({})
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <OrdersManager orders={JSON.parse(JSON.stringify(orders))} />
  );
}

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <AdminOrdersHeaderClient />

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <OrdersListContent />
      </Suspense>
    </div>
  );
}
