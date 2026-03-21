'use client';

import React from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import type { RelatedProduct } from '@/types/store';
import { Carousel } from '@/components/shared/Carousel';

interface RelatedProductsProps {
  products: RelatedProduct[];
  language: 'en' | 'ar';
}

export function RelatedProducts({ products, language }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  const isRtl = language === 'ar';

  return (
    <section className="mt-16 md:mt-32 pt-8 md:pt-16 border-t border-slate-100 overflow-hidden w-full">
      <div className="flex items-end justify-between mb-8 sm:mb-16">
        <div className="text-start">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground">
            {isRtl ? 'أكمل مجموعتك' : 'Complete Your Kit'}
          </h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 px-1">
            {isRtl ? 'أدوات غالباً ما يتم شراؤها مع هذا المنتج' : 'Instruments often purchased with this tool'}
          </p>
        </div>
      </div>
      
      <Carousel
        items={products}
        renderItem={(p) => <ProductCard product={p} locale={language} />}
        slidesPerView={{ mobile: 1.2, tablet: 2.2, desktop: 4 }}
        spaceBetween={24}
        showNavigation={true}
        navigationClass="related-products"
        locale={language}
        autoplay={{ delay: 5000 }}
      />
    </section>
  );
}


