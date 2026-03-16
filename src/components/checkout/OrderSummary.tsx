import React from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { Dictionary } from '@/types/store';
import { formatPrice } from '@/lib/utils';

interface OrderSummaryProps {
  dict: Dictionary;
  language: string;
  totalAmount: number;
  shippingFee: number;
  grandTotal: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  dict,
  language,
  totalAmount,
  shippingFee,
  grandTotal,
}) => {
  const { items } = useCartStore();

  return (
    <div className="bg-white border border-slate-100 rounded-(--radius) shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-50 bg-slate-50/50">
        <h2 className="text-xs font-black uppercase tracking-[0.2em]">{dict.checkoutPage.orderSummary}</h2>
      </div>
      <div className="divide-y divide-slate-50">
        {items.map((item) => (
          <div key={item.id} className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 bg-muted rounded-sm overflow-hidden shrink-0 border border-slate-100 relative">
              <Image src={item.image} fill className="object-cover" alt={language === 'ar' && item.nameAr ? item.nameAr : item.name} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-black uppercase tracking-tight">{language === 'ar' && item.nameAr ? item.nameAr : item.name}</h4>
              <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">{(dict.trackingPage as any).qty}: {item.quantity}</p>
            </div>
            <p className="text-xs font-black text-end">{formatPrice(item.price * item.quantity, language as 'en' | 'ar')}</p>
          </div>
        ))}
      </div>
      <div className="p-6 bg-slate-50/50 space-y-3">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>{dict.checkoutPage.subtotal}</span>
          <span>{formatPrice(totalAmount, language as 'en' | 'ar')}</span>
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>{dict.checkoutPage.shipping}</span>
          {shippingFee === 0 ? (
            <span className="text-emerald-600">{dict.checkoutPage.free}</span>
          ) : (
            <span>{formatPrice(shippingFee, language as 'en' | 'ar')}</span>
          )}
        </div>
        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
          <span className="text-xs font-black uppercase tracking-widest">{(dict.trackingPage as any).total}</span>
          <span className="text-xl md:text-2xl font-black">{formatPrice(grandTotal, language as 'en' | 'ar')}</span>
        </div>
      </div>
    </div>
  );
};
