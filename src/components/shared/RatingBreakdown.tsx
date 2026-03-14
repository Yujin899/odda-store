'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  rating: number;
}

interface RatingBreakdownProps {
  reviews: Review[];
  totalReviews: number;
  className?: string;
}

export function RatingBreakdown({ reviews, totalReviews, className = "" }: RatingBreakdownProps) {
  if (totalReviews === 0) return null;

  return (
    <div className={`space-y-1.5 max-w-xs ${className}`}>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => Math.round(r.rating) === star).length || 0;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-3 group">
            <div className="flex items-center gap-1 min-w-8">
              <span className="text-[10px] font-bold text-slate-500">{star}</span>
              <Star className="size-2.5 fill-yellow-400 stroke-none" />
            </div>
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 transition-all duration-500" 
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 min-w-8 text-end">
              {Math.round(percentage)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
