import { Suspense } from 'react';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { OrdersManager } from '@/components/dashboard/OrdersManager';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

async function OrdersList() {
  await connectDB();
  
  // Register User model for population
  const _u = User;

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track all customer orders and payments.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <OrdersList />
      </Suspense>
    </div>
  );
}
