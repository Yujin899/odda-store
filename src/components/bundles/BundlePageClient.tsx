'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useRecentlyViewedStore } from '@/store/useRecentlyViewedStore';

// Modular Page Parts
import { BundleBreadcrumbs } from './BundlePageParts/BundleBreadcrumbs';
import { BundleGallery } from './BundlePageParts/BundleGallery';
import { BundleDetails } from './BundlePageParts/BundleDetails';
import { BundleActions } from './BundlePageParts/BundleActions';
import { BundleTabs } from './BundlePageParts/BundleTabs';

interface BundleData {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  bundleItems: string[];
  bundleItemsAr?: string[];
  averageRating: number;
  numReviews: number;
}

interface ReviewData {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface BundlePageClientProps {
  bundle: BundleData;
  initialReviews?: ReviewData[];
}

export function BundlePageClient({ 
  bundle,
  initialReviews = []
}: BundlePageClientProps) {
  const { language } = useLanguageStore();
  const { addViewedItem: addRecentlyViewed } = useRecentlyViewedStore();

  // 1. State Hub
  const [reviews, setReviews] = useState<ReviewData[]>(initialReviews);
  const [averageRating, setAverageRating] = useState(bundle.averageRating || 0);
  const [numReviews, setNumReviews] = useState(bundle.numReviews || 0);
  const [isReviewsLoading, _setIsReviewsLoading] = useState(false);

  // 2. Ratings Logic (Recalculate or Fetch)
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/bundles/${bundle.slug}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        if (data.numReviews !== undefined) {
          setAverageRating(data.averageRating);
          setNumReviews(data.numReviews);
        }
      }
    } catch (error) {
      console.error('Failed to update ratings:', error);
    }
  }, [bundle.slug]);

  // 3. Analytics Persistence
  useEffect(() => {
    if (bundle) {
      addRecentlyViewed({
        id: String(bundle._id),
        slug: bundle.slug,
        name: bundle.name,
        nameAr: bundle.nameAr || '',
        price: bundle.price,
        image: bundle.images?.[0] || '',
      });
    }
  }, [bundle, addRecentlyViewed]);

  // 4. Localized Name Memo
  const bundleName = useMemo(() => {
    return (language === 'ar' && bundle.nameAr) ? bundle.nameAr : bundle.name;
  }, [language, bundle]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Step 1: Navigation */}
        <BundleBreadcrumbs bundleName={bundleName} />

        {/* Step 2: Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Gallery (Sticky on desktop) */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <BundleGallery 
                images={bundle.images}
                bundleName={bundleName}
                stock={bundle.stock}
              />
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <BundleDetails 
              bundle={bundle}
              averageRating={averageRating}
              numReviews={numReviews}
              reviews={reviews}
              language={language as 'en' | 'ar'}
            />

            <BundleActions 
              bundle={bundle}
              stock={bundle.stock}
            />
          </div>
        </div>

        {/* Step 3: Deep Dive */}
        <BundleTabs 
          bundle={bundle}
          reviews={reviews}
          language={language as 'en' | 'ar'}
          onReviewAdded={fetchReviews}
        />
      </main>
    </div>
  );
}
