'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface RatingSummaryProps {
  rating: number;
  numReviews: number;
  className?: string;
}

export function RatingSummary({ rating, numReviews, className = "" }: RatingSummaryProps) {
  const { language } = useLanguageStore();
  const averageRating = rating || 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((s) => {
          const isFull = s <= Math.floor(averageRating);
          const isHalf = !isFull && s <= Math.ceil(averageRating) && (averageRating % 1 >= 0.25 && averageRating % 1 <= 0.75);
          const isAlmostFull = !isFull && !isHalf && s <= Math.ceil(averageRating) && averageRating % 1 > 0.75;
          
          return (
            <div key={s} className="relative">
              <Star className="size-[18px] text-slate-200 fill-current stroke-none" />
              <div 
                className="absolute inset-0 overflow-hidden text-yellow-400"
                style={{ 
                  width: isFull || isAlmostFull ? '100%' : isHalf ? '50%' : '0%' 
                }}
              >
                <Star className="size-[18px] fill-current stroke-none" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-foreground">
          {averageRating?.toFixed(1) || '0.0'}
        </span>
        <span className="text-sm font-medium text-slate-500">
          ({numReviews || 0} {language === 'ar' ? 'تقييم' : 'reviews'})
        </span>
      </div>
    </div>
  );
}
