'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRecentlyViewedStore } from '@/store/useRecentlyViewedStore';
import type { 
  Product as ProductType, 
  Review as ReviewType, 
  RelatedProduct 
} from '@/types/store';

// Modular Page Parts
import { ProductBreadcrumbs } from './ProductPageParts/ProductBreadcrumbs';
import { ProductGallery } from './ProductPageParts/ProductGallery';
import { ProductDetails } from './ProductPageParts/ProductDetails';
import { ProductActions } from './ProductPageParts/ProductActions';
import { ProductTabs } from './ProductPageParts/ProductTabs';
import { RelatedProducts } from './ProductPageParts/RelatedProducts';



interface ProductPageClientProps {
  product: ProductType;
  initialReviews?: ReviewType[];
  relatedProducts?: RelatedProduct[];
  locale: string;
}

export function ProductPageClient({ 
  product, 
  initialReviews = [],
  relatedProducts = [],
  locale 
}: ProductPageClientProps) {
  const { addViewedItem } = useRecentlyViewedStore();
  const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);

  const language = locale as 'en' | 'ar';

  // 1. Analytics & Ratings Calculation
  useEffect(() => {
    addViewedItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      nameAr: product.nameAr || '',
      price: product.price,
      image: product.images?.[0]?.url || '',
    });
  }, [product, addViewedItem]);

  const { averageRating, numReviews } = useMemo(() => {
    if (reviews.length === 0) return { averageRating: 0, numReviews: 0 };
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return { averageRating: sum / reviews.length, numReviews: reviews.length };
  }, [reviews]);

  // 2. Refresh Reviews callback
  const refreshReviews = async () => {
    try {
      const res = await fetch(`/api/products/${product.slug}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to refresh reviews:', err);
    }
  };

  return (
    <div className="bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <ProductBreadcrumbs 
          productName={language === 'ar' ? product.nameAr || product.name : product.name} 
          categoryName={product.category?.name || 'Category'} 
          categoryNameAr={product.category?.nameAr}
          categorySlug={product.category?.slug}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery - 7 cols */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <ProductGallery images={product.images} productName={product.name} stock={product.stock} />
            </div>
          </div>

          {/* Details & Actions - 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <ProductDetails 
              product={product} 
              averageRating={averageRating} 
              numReviews={numReviews} 
              reviews={reviews}
              language={language} 
            />
            <ProductActions product={product} stock={product.stock} />
          </div>
        </div>

        {/* Depth Content */}
        <ProductTabs 
          product={product} 
          reviews={reviews} 
          language={language} 
          onReviewAdded={refreshReviews} 
        />
        
        {/* Related Assets */}
        <RelatedProducts products={relatedProducts} language={language} />
      </main>
    </div>
  );
}
