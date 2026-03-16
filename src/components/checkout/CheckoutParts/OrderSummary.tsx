'use client';

import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Dictionary } from '@/types/store';

interface OrderSummaryProps {
  dict: Dictionary;
  shippingFee: number;
}

export function OrderSummary({ dict, shippingFee }: OrderSummaryProps) {
  const { language } = useLanguageStore();
  const { items, totalAmount } = useCartStore();
  const isRtl = language === 'ar';

  const grandTotal = totalAmount + shippingFee;

  return (
    <div className="bg-slate-50/50 p-6 sm:p-8 rounded-sm border border-slate-200 lg:sticky lg:top-24 h-fit animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className={bcn(
        "text-sm font-black uppercase tracking-widest text-foreground pb-6 border-b border-slate-200 mb-6",
        isRtl ? "text-end" : "text-start"
      )}>
        {dict.common.orderSummary}
      </h2>

      {/* Items List */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto pe-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent mb-8">
        {items.map((item) => (
          <div key={item.id} className={bcn("flex items-center gap-4", isRtl ? "flex-row-reverse" : "flex-row")}>
            <div className="size-14 bg-white rounded-sm border border-slate-100 shrink-0 relative overflow-hidden">
               <Image 
                 src={item.image} 
                 alt={isRtl && item.nameAr ? item.nameAr : item.name} 
                 fill 
                 sizes="60px"
                 className="object-cover"
               />
            </div>
            <div className={bcn("flex-1 min-w-0", isRtl ? "text-end" : "text-start")}>
              <h3 className="text-[10px] font-black uppercase tracking-tight text-foreground truncate">
                {isRtl && item.nameAr ? item.nameAr : item.name}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {item.quantity} × {item.price.toLocaleString()} {dict.common.egp}
              </p>
            </div>
            <div className="text-[10px] font-black text-(--navy)">
              {(item.quantity * item.price).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Totals Section */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div className={bcn("flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500", isRtl ? "flex-row-reverse" : "flex-row")}>
          <span>{dict.common.subtotal}</span>
          <span>{totalAmount.toLocaleString()} {dict.common.egp}</span>
        </div>
        <div className={bcn("flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500", isRtl ? "flex-row-reverse" : "flex-row")}>
          <span>{dict.common.shipping}</span>
          <span className={shippingFee === 0 ? "text-green-600" : ""}>
            {shippingFee === 0 ? dict.common.free : `${shippingFee.toLocaleString()} ${dict.common.egp}`}
          </span>
        </div>
        <div className={bcn("flex items-center justify-between text-base font-black uppercase tracking-tighter text-(--navy) pt-4 border-t border-slate-200", isRtl ? "flex-row-reverse" : "flex-row")}>
          <span>{dict.common.total}</span>
          <span className="text-xl">
             {grandTotal.toLocaleString()} {dict.common.egp}
          </span>
        </div>
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
