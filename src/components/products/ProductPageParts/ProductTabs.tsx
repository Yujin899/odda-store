'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ReviewSection } from '@/components/shared/ReviewSection';
import { Check } from 'lucide-react';
import { getDictionary } from '@/dictionaries';

interface ProductTabsProps {
  product: any;
  reviews: any[];
  language: 'en' | 'ar';
  onReviewAdded: () => void;
}

export function ProductTabs({ product, reviews, language, onReviewAdded }: ProductTabsProps) {
  const isRtl = language === 'ar';

  const productDescription = isRtl && product.descriptionAr ? product.descriptionAr : product.description;
  const productFeatures = isRtl && product.featuresAr ? product.featuresAr : (product.features || []);

  return (
    <div className="w-full mt-12 pt-12 border-t border-slate-100">
      <Tabs defaultValue="description" className="w-full" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between mb-8 overflow-x-auto whitespace-nowrap scrollbar-hidden pb-1">
          <TabsList className="bg-transparent h-auto p-0 gap-8 border-none">
            <TabsTrigger 
              value="description" 
              className="bg-transparent border-none p-0 h-auto font-black uppercase tracking-widest text-[11px] data-[state=active]:text-(--primary) data-[state=active]:shadow-none relative after:absolute after:bottom-[-12px] after:inset-s-0 after:w-0 data-[state=active]:after:w-full after:h-[2px] after:bg-(--primary) after:transition-all"
            >
              {isRtl ? 'الوصف' : 'Description'}
            </TabsTrigger>
            
            {productFeatures.length > 0 && (
              <TabsTrigger 
                value="specifications" 
                className="bg-transparent border-none p-0 h-auto font-black uppercase tracking-widest text-[11px] data-[state=active]:text-(--primary) data-[state=active]:shadow-none relative after:absolute after:bottom-[-12px] after:inset-s-0 after:w-0 data-[state=active]:after:w-full after:h-[2px] after:bg-(--primary) after:transition-all"
              >
                {isRtl ? 'المواصفات' : 'Specifications'}
              </TabsTrigger>
            )}
            
            <TabsTrigger 
              value="reviews" 
              className="bg-transparent border-none p-0 h-auto font-black uppercase tracking-widest text-[11px] data-[state=active]:text-(--primary) data-[state=active]:shadow-none relative after:absolute after:bottom-[-12px] after:inset-s-0 after:w-0 data-[state=active]:after:w-full after:h-[2px] after:bg-(--primary) after:transition-all"
            >
              {isRtl ? 'التقييمات' : 'Reviews'} ({reviews.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="description" className="mt-4 focus-visible:outline-none">
          <div className="prose prose-slate max-w-none prose-sm leading-relaxed text-slate-600 text-start">
            <p className="whitespace-pre-line">{productDescription}</p>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-4 focus-visible:outline-none">
          <div className="max-w-2xl px-1">
            <div className="grid grid-cols-1 gap-4">
              {productFeatures.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-sm">
                  <div className="size-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0">
                    <Check className="size-4 text-(--primary)" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 text-start">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4 focus-visible:outline-none">
          <div className="pt-4">
            <ReviewSection 
              targetId={String(product._id)}
              targetSlug={product.slug}
              targetType="Product"
              apiEndpoint={`/api/products/${product.slug}/reviews`}
              reviews={reviews || []}
              onReviewAdded={onReviewAdded}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

