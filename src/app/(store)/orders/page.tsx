import { auth } from '@/auth';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { redirect } from 'next/navigation';
import { OrdersList } from '@/components/store/OrdersList';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?redirect=/orders');
  }

  await connectDB();

  const orders = await Order.find({
    $or: [
      { userId: session.user.id },
      { 'shippingAddress.email': session.user.email }
    ]
  }).sort({ createdAt: -1 }).lean();

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <OrdersList orders={JSON.parse(JSON.stringify(orders))} />
      </div>
    </div>
  );
}
