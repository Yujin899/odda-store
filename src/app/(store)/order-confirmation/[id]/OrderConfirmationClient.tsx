'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { OrderHeader } from '../OrderConfirmationParts/OrderHeader';
import { DeliveryTimeline } from '../OrderConfirmationParts/DeliveryTimeline';
import { CommunityCTA } from '../OrderConfirmationParts/CommunityCTA';
import { useLanguageStore } from '@/store/useLanguageStore';
import Image from 'next/image';

export function OrderConfirmationClient({ order }: { order: any }) {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20 space-y-8">
      <OrderHeader 
        orderNumber={order.orderNumber} 
        createdAt={order.createdAt} 
      />

      <DeliveryTimeline status={order.status} />

      <CommunityCTA />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Simplified Order Summary */}
        <div className="lg:col-span-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-slate-100 rounded-(--radius) shadow-xl overflow-hidden"
            >
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShoppingBag className="size-4 text-primary" />
                        {isAr ? 'ملخص العناصر' : 'ITEMS SUMMARY'}
                    </h2>
                </div>
                <div className="divide-y divide-slate-50">
                    {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="p-6 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 shrink-0 relative">
                                    <Image 
                                        src={item.productId?.images?.[0]?.url || '/placeholder.png'} 
                                        fill 
                                        sizes="48px"
                                        className="object-cover" 
                                        alt={item.productId?.name || 'Product'} 
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-tight text-navy">
                                        {isAr ? (item.productId?.nameAr || item.name) : (item.productId?.name || item.name)}
                                    </p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">
                                        {isAr ? 'الكمية' : 'Qty'}: {item.quantity}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs font-black text-navy">
                                {(item.price * item.quantity).toLocaleString()} <span className="text-[8px] text-muted-foreground ms-1">{isAr ? 'ج.م' : 'EGP'}</span>
                            </p>
                        </div>
                    ))}
                </div>
                <div className="p-8 bg-slate-50/50 border-t border-slate-50 text-end">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">{isAr ? 'المجموع الإجمالي' : 'GRAND TOTAL'}</p>
                    <p className="text-4xl font-black text-primary tracking-tighter italic">
                        {order.totalAmount.toLocaleString()}
                        <span className="text-xs font-black uppercase tracking-widest ms-2 text-muted-foreground">{isAr ? 'ج.م' : 'EGP'}</span>
                    </p>
                </div>
            </motion.div>
        </div>
      </div>

      <Link 
        href="/products" 
        className="group w-full h-16 bg-foreground text-background flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] rounded-(--radius) shadow-2xl hover:bg-primary transition-all active:scale-95"
      >
        {isAr ? 'العودة للتسوق' : 'CONTINUE SHOPPING'}
        <ChevronRight className="size-4 transition-transform stroke-[2px] rtl:-scale-x-100 group-hover:translate-s-1" />
      </Link>
    </div>
  );
}
