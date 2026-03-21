'use client';

import { Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import { RatingSummary } from '@/components/shared/RatingSummary';
import { RatingBreakdown } from '@/components/shared/RatingBreakdown';
import type { Product, Review } from '@/types/store';
import { formatPrice } from '@/lib/utils';

interface ProductDetailsProps {
  product: Product;
  averageRating: number;
  numReviews: number;
  reviews: Review[];
  language: 'en' | 'ar';
}

export function ProductDetails({ 
  product, 
  averageRating, 
  numReviews, 
  reviews,
  language 
}: ProductDetailsProps) {
  const isRtl = language === 'ar';

  const productName = isRtl && product.nameAr ? product.nameAr : product.name;
  const productDescription = isRtl && product.descriptionAr ? product.descriptionAr : product.description;

  return (
    <div className="flex flex-col space-y-6">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.badge && (
          <span 
            className="inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white rounded-sm shadow-sm"
            style={{ 
              backgroundColor: product.badge.color || '#0073E6',
              color: product.badge.textColor || '#FFFFFF'
            }}
          >
            {isRtl && product.badge.nameAr ? product.badge.nameAr : product.badge.name}
          </span>
        )}
      </div>

      {/* Header Info */}
      <div className="text-start">
        <h1 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight leading-tight mb-2">
          {productName}
        </h1>
        
        <RatingSummary 
          rating={averageRating} 
          numReviews={numReviews} 
          className="p-0 bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-(--primary)"
        />
      </div>

      <div className="flex items-baseline gap-3 pt-2">
        <span className="text-3xl font-black text-(--primary)">
          {formatPrice(product.price, language)}
        </span>
      </div>

      {/* Trust Badges Bar */}
      <div className="flex flex-wrap gap-4 py-4 border-y border-slate-100">
        {product.stock > 0 ? (
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Truck className="size-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {isRtl ? 'توصيل سريع خلال 24 ساعة' : 'Fast Delivery in 24h'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm bg-red-50 text-red-600 border border-red-100">
            <AlertCircle className="size-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {isRtl ? 'نفذت الكمية' : 'Out of Stock'}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm bg-slate-50 text-slate-500 border border-slate-100">
          <ShieldCheck className="size-3.5" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            {isRtl ? 'دعم فني متميز' : 'Premium Support'}
          </span>
        </div>
      </div>

      {/* Description Preview */}
      <p className="text-slate-600 leading-relaxed text-sm text-start">
        {productDescription}
      </p>

      {/* Hidden detail breakdown for SEO/Reference */}
      <RatingBreakdown 
        reviews={reviews}
        totalReviews={numReviews}
        className="mt-2 opacity-0 h-0 overflow-hidden" 
      />
    </div>
  );
}

