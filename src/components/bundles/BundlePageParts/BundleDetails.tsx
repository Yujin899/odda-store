'use client';

import { Truck, ShieldCheck, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { RatingSummary } from '@/components/shared/RatingSummary';
import { RatingBreakdown } from '@/components/shared/RatingBreakdown';
import { getDictionary } from '@/dictionaries';

interface BundleDetailsProps {
  bundle: any;
  averageRating: number;
  numReviews: number;
  reviews: any[];
  language: 'en' | 'ar';
}

export function BundleDetails({ 
  bundle, 
  averageRating, 
  numReviews, 
  reviews,
  language 
}: BundleDetailsProps) {
  const dict = getDictionary(language);
  const isRtl = language === 'ar';

  const name = isRtl && bundle.nameAr ? bundle.nameAr : bundle.name;
  const items = (isRtl && bundle.bundleItemsAr && bundle.bundleItemsAr.length > 0) 
    ? bundle.bundleItemsAr 
    : bundle.bundleItems;

  return (
    <div className="flex flex-col space-y-6">
      {/* Badges */}
      <div className="flex flex-wrap gap-2 text-start">
        <span className="inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground rounded-[calc(var(--radius)*0.6)] bg-primary">
          {isRtl ? 'مجموعة متميزة' : 'Premium Bundle'}
        </span>
      </div>

      <div className="flex flex-col text-start">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground uppercase tracking-tight leading-tight mb-2">
          {name}
        </h1>
        
        <RatingSummary 
          rating={averageRating} 
          numReviews={numReviews} 
          className="p-0 bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-primary"
        />
      </div>

      {/* Pricing & Savings */}
      <div className="flex items-baseline gap-3 pt-2">
        <span className="text-4xl font-black text-primary">
          {bundle.price.toLocaleString()} {dict.common.egp}
        </span>
        {bundle.originalPrice && bundle.originalPrice > bundle.price && (
          <span className="text-sm text-slate-400 line-through font-medium">
            {bundle.originalPrice.toLocaleString()} {dict.common.egp}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-4 py-4 border-y border-slate-100">
        {bundle.stock > 0 && (
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[calc(var(--radius)*0.6)] bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Truck className="size-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {dict.home.campusDelivery}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[calc(var(--radius)*0.6)] bg-indigo-50 text-indigo-600 border border-indigo-100">
          <ShieldCheck className="size-3.5" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            {dict.home.securePayments}
          </span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[calc(var(--radius)*0.6)] bg-slate-50 text-slate-500 border border-slate-100">
          <ShoppingBag className="size-3.5" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            {dict.footer.builtForExcellence}
          </span>
        </div>
      </div>

      {/* What's Included */}
      {items && items.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 text-start">
            {isRtl ? 'ماذا يوجد في هذا الطقم؟' : "What's included in this kit?"}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {items.map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-(--radius) hover:border-primary/30 transition-colors">
                <div className="bg-primary/10 p-1.5 rounded-full shrink-0">
                  <CheckCircle2 className="size-4 text-primary stroke-[2.5px]" />
                </div>
                <span className="text-sm font-bold text-slate-700 text-start">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Breakdown (Hidden by default, used for search context or modal) */}
      <RatingBreakdown 
        reviews={reviews}
        totalReviews={numReviews}
        className="mt-2 opacity-0 h-0 overflow-hidden" 
      />
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
