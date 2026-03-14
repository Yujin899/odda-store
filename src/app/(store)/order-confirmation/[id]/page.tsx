import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { auth } from '@/auth';
import { OrderConfirmationClient } from './OrderConfirmationClient';

export const metadata: Metadata = {
  title: 'Order Confirmation | Odda | Dental Student Gear',
  description: 'Thank you for your order from Odda Dental Store.',
  robots: 'noindex, nofollow', // Critical: Don't index confirmation pages
};

async function getOrder(id: string) {
  const session = await auth();
  await connectDB();
  
  // Fetch by ID or internal orderNumber
  const order = await Order.findOne({ 
    $or: [{ _id: id }, { orderNumber: id }] 
  }).populate('items.productId');

  if (!order) return null;

  // Zero-Trust: If order has a userId, ensure it matches current session
  // If no userId, it was a Guest checkout, allow viewing via unique ID
  if (order.userId && order.userId.toString() !== session?.user?.id) {
    return null;
  }

  // Sanitize to DTO
  return JSON.parse(JSON.stringify(order));
}

export default async function OrderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <OrderConfirmationClient order={order} />
    </div>
  );
}
