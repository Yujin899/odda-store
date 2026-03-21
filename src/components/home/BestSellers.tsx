'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { Product } from '@/types/store';
import { Carousel } from '@/components/shared/Carousel';
import { ProductCard } from '@/components/products/ProductCard';

export function BestSellers({ products }: { products: Product[] }) {
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;

  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 px-6 overflow-hidden w-full text-start">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-black uppercase tracking-wider text-(--navy)">{dict.home.bestSellers}</h2>
        </div>
        
        <Carousel
          items={products}
          renderItem={(product) => <ProductCard product={product} locale={language} />}
          slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4}}
          spaceBetween={24}
          showNavigation={true}
          navigationClass="best-sellers"
          locale={language}
        />
      </div>
    </section>
  );
}
