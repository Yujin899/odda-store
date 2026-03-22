import { Suspense } from 'react';
import Link from 'next/link';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { OrderConfirmationClient } from './OrderConfirmationParts/OrderConfirmationClient';

export const metadata: Metadata = {
  title: 'عُدّة (عدة) | تأكيد الطلب | Order Confirmation | Odda',
  description: 'تم تأكيد طلبك بنجاح. شكراً لثقتك في عُدّة (عدة) - المتجر المتخصص في أدوات الأسنان.',
};

const getCachedOrder = unstable_cache(
  async (idOrNumber: string) => {
    if (!idOrNumber) return null;
    await connectDB();
    
    // Try both ID and order number
    const order = await Order.findOne({
      $or: [
        { _id: idOrNumber.match(/^[0-9a-fA-F]{24}$/) ? idOrNumber : undefined },
        { orderNumber: idOrNumber }
      ].filter(Boolean)
    })
    .populate('items.productId')
    .lean();

    if (!order) return null;
    return JSON.parse(JSON.stringify(order));
  },
  ['order-details'],
  { revalidate: 60, tags: ['orders'] }
);

interface PageProps {
  searchParams: Promise<{ id?: string; order?: string }>;
}

async function OrderConfirmationContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const idOrNumber = params.id || params.order;
  
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const language = locale as 'en' | 'ar';
  const dict = language === 'en' ? en : ar;
  
  const order = await getCachedOrder(idOrNumber || '');

  if (!order) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center border border-slate-100">
              <ShoppingBag className="size-8 stroke-[1.5px]" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-black uppercase tracking-tighter italic text-navy">{dict.confirmationPage.notFoundTitle}</h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed px-8">
              {dict.confirmationPage.notFoundDesc}
            </p>
          </div>
          <Link href="/products" className="flex w-full h-16 bg-foreground text-background items-center justify-center font-black text-[10px] uppercase tracking-[0.3em] rounded-(--radius) shadow-2xl hover:-translate-y-1 transition-all">
            {dict.confirmationPage.browseCatalog}
          </Link>
        </div>
      </div>
    );
  }

  return <OrderConfirmationClient order={order} dict={dict} language={language} />;
}

export default function OrderConfirmationPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-(--primary) stroke-[2.5px]" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Loading Confirmation...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent searchParams={searchParams} />
    </Suspense>
  );
}
