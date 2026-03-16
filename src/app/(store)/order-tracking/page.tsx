import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { OrderTrackingClient } from './OrderTrackingParts/OrderTrackingClient';

export const metadata: Metadata = {
  title: 'عُدّة (عدة) | تتبع طلبك | Track Your Order | Odda',
  description: 'تتبع حالة طلبك من عُدّة (عدة) في أي وقت. أدخل رقم الطلب للحصول على تحديثات مباشرة.',
};

const getCachedOrder = unstable_cache(
  async (idOrNumber: string) => {
    if (!idOrNumber) return null;
    await connectDB();
    
    const order = await Order.findOne({
      $or: [
        { _id: idOrNumber.match(/^[0-9a-fA-F]{24}$/) ? idOrNumber : undefined },
        { orderNumber: idOrNumber }
      ].filter(Boolean)
    })
    .populate('items.productId')
    .lean();

    if (!order) return null;
    return {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      status: order.status,
      items: (order.items || []).map((item) => {
        const product = item.productId as unknown as { name?: string; slug?: string; images?: Array<{ url: string }> } | null;
        return {
          productId: product ? {
            name: product.name,
            slug: product.slug,
            image: (product.images?.[0]?.url || '')
          } : null,
          name: product?.name || 'Product',
          price: item.price,
          quantity: item.quantity
        };
      }),
      totalAmount: order.totalAmount,
      createdAt: order.createdAt?.toISOString() ?? null,
      shippingAddress: {
        fullName: order.shippingAddress.fullName,
        city: order.shippingAddress.city
      }
    };
  },
  ['order-tracking-details'],
  { revalidate: 60, tags: ['orders'] }
);

interface PageProps {
  searchParams: Promise<{ order?: string }>;
}

async function TrackingContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialOrderId = params.order || '';
  
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const language = locale as 'en' | 'ar';
  const dict = language === 'en' ? en : ar;
  
  const initialOrder = initialOrderId ? await getCachedOrder(initialOrderId) : null;

  return (
    <OrderTrackingClient 
      initialOrder={initialOrder} 
      initialOrderId={initialOrderId} 
      dict={dict} 
      language={language} 
    />
  );
}

export default function OrderTrackingPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="size-8 animate-spin text-(--primary)" />
       </div>
    }>
      <TrackingContent searchParams={searchParams} />
    </Suspense>
  );
}
