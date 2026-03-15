'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';

// Swiper styles are usually imported in the main layout or parent component
// but including them in a client component index is safe if using Turbopack
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface RelatedProductsProps {
  products: any[];
  language: 'en' | 'ar';
}

export function RelatedProducts({ products, language }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  const isRtl = language === 'ar';

  return (
    <section className="mt-32 pt-16 border-t border-slate-100">
      <div className="flex items-end justify-between mb-16">
        <div className="text-start">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground">
            {isRtl ? 'أكمل مجموعتك' : 'Complete Your Kit'}
          </h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 px-1">
            {isRtl ? 'أدوات غالباً ما يتم شراؤها مع هذا المنتج' : 'Instruments often purchased with this tool'}
          </p>
        </div>
        
        {/* Customized Navigation Buttons */}
        <div className="hidden sm:flex gap-3">
          <button className="related-prev w-12 h-12 border border-slate-200 flex items-center justify-center hover:bg-(--navy) hover:text-white hover:border-(--navy) transition-all rounded-full text-(--navy) bg-white shadow-sm outline-none cursor-pointer">
            <ChevronLeft className="size-5 stroke-[2.5px] rtl:rotate-180" />
          </button>
          <button className="related-next w-12 h-12 border border-slate-200 flex items-center justify-center hover:bg-(--navy) hover:text-white hover:border-(--navy) transition-all rounded-full text-(--navy) bg-white shadow-sm outline-none cursor-pointer">
            <ChevronRight className="size-5 stroke-[2.5px] rtl:rotate-180" />
          </button>
        </div>
      </div>
      
      <div className="relative group">
        <Swiper
          modules={[Navigation, FreeMode, Autoplay]}
          navigation={{
            prevEl: '.related-prev',
            nextEl: '.related-next',
          }}
          dir={isRtl ? 'rtl' : 'ltr'}
          grabCursor={true}
          freeMode={true}
          slidesPerView={1.2}
          spaceBetween={24}
          autoplay={{
            delay: 5000,
            disableOnInteraction: true,
          }}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 32 },
            1280: { slidesPerView: 4, spaceBetween: 32 },
          }}
          className="w-full !overflow-visible"
        >
          {products.map((p) => (
            <SwiperSlide key={p._id} className="h-auto">
              <ProductCard product={p} locale={language} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
