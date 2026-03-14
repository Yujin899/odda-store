'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ReviewSection } from '@/components/shared/ReviewSection';
import { getDictionary } from '@/dictionaries';

interface BundleTabsProps {
  bundle: any;
  reviews: any[];
  language: 'en' | 'ar';
  onReviewAdded: () => void;
}

export function BundleTabs({ bundle, reviews, language, onReviewAdded }: BundleTabsProps) {
  const dict = getDictionary(language);
  const isRtl = language === 'ar';

  return (
    <div className="w-full mt-12 pt-12 border-t border-slate-100">
      <Tabs defaultValue="reviews" className="w-full" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between mb-8 overflow-x-auto whitespace-nowrap scrollbar-hidden pb-1">
          <TabsList className="bg-transparent h-auto p-0 gap-8 border-none">
            <TabsTrigger 
              value="reviews" 
              className="bg-transparent border-none p-0 h-auto font-black uppercase tracking-widest text-[11px] data-[state=active]:text-(--primary) data-[state=active]:shadow-none relative after:absolute after:bottom-[-12px] after:inset-s-0 after:w-0 data-[state=active]:after:w-full after:h-[2px] after:bg-(--primary) after:transition-all"
            >
              {isRtl ? 'التقييمات' : 'Reviews'} ({reviews.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="reviews" className="mt-4 focus-visible:outline-none">
          <div className="pt-4">
            <ReviewSection 
              targetId={String(bundle._id)}
              targetSlug={bundle.slug}
              targetType="Bundle"
              apiEndpoint={`/api/bundles/${bundle.slug}/reviews`}
              reviews={reviews || []}
              onReviewAdded={onReviewAdded}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
