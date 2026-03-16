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

  const ordersDTO = orders.map((o: any) => ({
    id: o._id.toString(),
    _id: o._id.toString(),
    orderNumber: o.orderNumber,
    customer: o.shippingAddress?.fullName || 'N/A',
    paymentMethod: o.paymentMethod || 'COD',
    items: (o.items || []).map((item: any) => ({
      productId: item.productId?.toString() ?? null,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image ?? null,
      type: item.type || 'Product'
    })),
    totalAmount: o.totalAmount,
    status: o.status,
    createdAt: o.createdAt?.toISOString() ?? null,
  }));

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <OrdersList orders={ordersDTO} />
      </div>
    </div>
  );
}
