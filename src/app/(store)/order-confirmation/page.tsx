'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  CreditCard, 
  ChevronRight, 
  ShoppingBag, 
  Info, 
  Loader2 
} from 'lucide-react';
import { OrderTracker } from '@/components/store/OrderTracker';
import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const idOrNumber = searchParams.get('id') || searchParams.get('order');
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;
  
  const [order, setOrder] = useState<any>(null); // Keeping any for now to handle complex populated mongo doc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/track/${idOrNumber}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch order tracking info:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (idOrNumber) {
      fetchOrder();
    } else {
      setLoading(false);
      setError(true);
    }
  }, [idOrNumber]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-(--primary) stroke-[2.5px]" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{dict.confirmationPage.identifying}</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center border border-slate-100">
              <ShoppingBag className="size-8 stroke-[1.5px]" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-black uppercase tracking-tighter italic text-(--navy)">{dict.confirmationPage.notFoundTitle}</h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed px-8">
              {dict.confirmationPage.notFoundDesc}
            </p>
          </div>
          <Link href="/products" className="block w-full h-16 bg-foreground text-background flex items-center justify-center font-black text-[10px] uppercase tracking-[0.3em] rounded-(--radius) shadow-2xl hover:-translate-y-1 transition-all">
            {dict.confirmationPage.browseCatalog}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20 space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 p-8 rounded-(--radius) shadow-xl relative overflow-hidden text-center space-y-6"
        >
          <div className="absolute top-0 inset-s-0 w-full h-1.5 bg-(--primary)"></div>
          
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-md border border-emerald-100">
              <CheckCircle2 className="size-8 stroke-[2px]" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-(--navy)">{dict.confirmationPage.thankYou}</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
              {dict.confirmationPage.emailSent}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">{dict.confirmationPage.orderNum}{order.orderNumber}</p>
              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
              <p className="text-[10px] font-black text-(--primary) uppercase tracking-[0.3em]">
                {dict.confirmationPage.placed} {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tracker Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-(--radius) shadow-xl overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Package className="size-4 text-(--primary)" />
              {dict.confirmationPage.orderStatus}
            </h2>
          </div>
          <div className="p-4 md:p-8">
            <OrderTracker status={order.status} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Summary */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-slate-100 rounded-(--radius) shadow-xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-50">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShoppingBag className="size-4 text-(--primary)" />
                  {dict.confirmationPage.itemsOrdered}
                </h2>
              </div>
              <div className="divide-y divide-slate-50">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto flex-1">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-(--radius) overflow-hidden shrink-0 border border-slate-100 relative shadow-sm transition-transform group-hover:scale-105">
                        <Image 
                          src={item.productId?.images?.[0]?.url || '/placeholder.png'} 
                          fill 
                          className="object-cover" 
                          alt={item.productId?.name || 'Product'} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black uppercase tracking-tight truncate group-hover:text-(--primary) transition-colors">
                          {(language === 'ar' && item.productId?.nameAr) ? item.productId.nameAr : (item.productId?.name || 'Legacy Product')}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1.5 flex items-center gap-2">
                          {dict.trackingPage.qty}: {item.quantity}
                          <span className="text-slate-200">|</span>
                          {item.price.toLocaleString()} {dict.common.egp}
                        </p>
                      </div>
                    </div>
                    <div className="text-center sm:text-end self-end sm:self-auto shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 mt-2 sm:mt-0">
                      <p className="text-sm font-black text-(--navy)">
                        {(item.price * item.quantity).toLocaleString()} <span className="text-[9px] uppercase tracking-widest text-muted-foreground ms-1">{dict.common.egp}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-slate-50/50 border-t border-slate-50 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{dict.checkoutPage.subtotal}</span>
                  <span>{order.totalAmount.toLocaleString()} {dict.common.egp}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{dict.checkoutPage.shipping}</span>
                  <span className="text-emerald-600">{dict.checkoutPage.free}</span>
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase tracking-[0.3em]">{dict.trackingPage.total}</span>
                  <div className="text-end">
                    <span className="text-3xl font-black text-(--primary) tracking-tighter">
                      {order.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest ms-2 text-muted-foreground">{dict.common.egp}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Delivery & Payment Details */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-100 rounded-(--radius) shadow-xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-50">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <MapPin className="size-4 text-(--primary)" />
                  {dict.confirmationPage.shippingTo}
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{dict.confirmationPage.recipient}</p>
                  <p className="text-xs font-black uppercase tracking-tight text-(--navy)">{order.shippingAddress.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{dict.checkoutPage.address}</p>
                  <p className="text-xs font-bold leading-relaxed text-slate-700">
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, Egypt
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{dict.checkoutPage.phone}</p>
                  <p className="text-xs font-black tracking-tight text-(--navy)">{order.shippingAddress.phone}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-slate-100 rounded-(--radius) shadow-xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-50">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <CreditCard className="size-4 text-(--primary)" />
                  {dict.confirmationPage.paymentDetails}
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{dict.trackingPage.method}</p>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-700 border border-slate-200">
                    {order.paymentMethod === 'InstaPay' ? dict.checkoutPage.instapay : dict.checkoutPage.cod}
                  </span>
                </div>
                
                {order.paymentMethod === 'InstaPay' && (
                  <div className="bg-blue-50 border border-blue-100 rounded-(--radius) p-4 space-y-2">
                    <div className="flex items-center gap-2 font-black text-[9px] uppercase tracking-widest text-blue-700">
                      <Info className="size-3" />
                      {dict.confirmationPage.verificationNote}
                    </div>
                    <p className="text-[8px] font-bold text-blue-600/80 uppercase tracking-[0.1em] leading-relaxed">
                      {dict.confirmationPage.verificationDesc}
                    </p>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-100 flex items-center justify-center grayscale opacity-30">
                  <Image src="/logo.png" width={100} height={30} className="h-8 w-auto object-contain" alt="Odda logo" />
                </div>
              </div>
            </motion.div>

            <Link href="/products" className="group w-full h-16 bg-foreground text-background flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] rounded-(--radius) shadow-2xl hover:bg-(--primary) transition-all active:scale-95">
              {dict.confirmationPage.continueShopping}
              <ChevronRight className="size-4 transition-transform stroke-[2px] rtl:-scale-x-100 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-(--primary) stroke-[2.5px]" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Loading Tracking Page...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
