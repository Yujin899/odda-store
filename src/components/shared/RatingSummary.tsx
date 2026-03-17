'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface RatingSummaryProps {
  rating: number;
  numReviews: number;
  className?: string;
  variant?: 'default' | 'compact';
}

export function RatingSummary({ 
  rating, 
  numReviews, 
  className = "", 
  variant = 'default' 
}: RatingSummaryProps) {
  const { language } = useLanguageStore();
  const averageRating = rating || 0;
  
  const isCompact = variant === 'compact';
  const starSize = isCompact ? "size-3" : "size-[18px]";

  return (
    <div className={bcn(
      "flex items-center",
      isCompact ? "gap-1.5" : "gap-3",
      className
    )}>
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((s) => {
          const isFull = s <= Math.floor(averageRating);
          const isHalf = !isFull && s <= Math.ceil(averageRating) && (averageRating % 1 >= 0.25 && averageRating % 1 <= 0.75);
          const isAlmostFull = !isFull && !isHalf && s <= Math.ceil(averageRating) && averageRating % 1 > 0.75;
          
          return (
            <div key={s} className="relative">
              <Star className={bcn(starSize, "text-slate-200 fill-current stroke-none")} />
              <div 
                className="absolute inset-0 overflow-hidden text-yellow-400"
                style={{ 
                  width: isFull || isAlmostFull ? '100%' : isHalf ? '50%' : '0%' 
                }}
              >
                <Star className={bcn(starSize, "fill-current stroke-none")} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <span className={bcn(
          "font-bold",
          isCompact ? "text-[10px] text-slate-500" : "text-sm text-foreground"
        )}>
          {averageRating?.toFixed(1) || '0.0'}
        </span>
        <span className={bcn(
          isCompact ? "text-[10px] text-slate-400" : "text-sm font-medium text-slate-500"
        )}>
          ({numReviews || 0}{!isCompact && (language === 'ar' ? ' تقييم' : ' reviews')})
        </span>
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
