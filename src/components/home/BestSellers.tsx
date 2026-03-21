'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { Product } from '@/types/store';
import { Carousel } from '@/components/shared/Carousel';
import { ProductCard } from '@/components/products/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BestSellers({ products }: { products: Product[] }) {
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;

  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 px-6 overflow-hidden w-full text-start">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wider text-(--navy)">{dict.home.bestSellers}</h2>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="best-sellers-prev size-8 md:size-10 lg:size-11 rounded-(--radius) bg-navy text-white hover:bg-primary hover:text-white transition-all border-none [&.swiper-button-lock]:hidden"
              aria-label="Previous products"
            >
              <ChevronLeft className="size-4 md:size-5 stroke-[2.5px] rtl:rotate-180" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="best-sellers-next size-8 md:size-10 lg:size-11 rounded-(--radius) bg-navy text-white hover:bg-primary hover:text-white transition-all border-none [&.swiper-button-lock]:hidden"
              aria-label="Next products"
            >
              <ChevronRight className="size-4 md:size-5 stroke-[2.5px] rtl:rotate-180" />
            </Button>
          </div>
        </div>
        
        <Carousel
          items={products}
          renderItem={(product) => <ProductCard product={product} locale={language} />}
          slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4}}
          spaceBetween={24}
          showNavigation={true}
          externalNavigation={true}
          navigationClass="best-sellers"
          locale={language}
        />
      </div>
    </section>
  );
}
