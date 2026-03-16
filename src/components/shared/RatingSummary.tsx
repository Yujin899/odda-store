import { Star } from 'lucide-react';

interface RatingSummaryProps {
  averageRating?: number;
  reviewCount?: number;
  rating?: number; // compat
  numReviews?: number; // compat
  className?: string; // compat
}

/**
 * Reusable star rating display.
 * Returns null if no reviews.
 * Used in ProductCard and BundleCard.
 */
export function RatingSummary({ 
  averageRating, 
  reviewCount, 
  rating: propRating, 
  numReviews, 
  className 
}: RatingSummaryProps) {
  const finalRating = averageRating ?? propRating;
  const finalCount = reviewCount ?? numReviews;

  // Don't render if no ratings yet
  if (!finalRating || !finalCount || finalCount === 0) return null;

  const ratingValue = Math.min(5, Math.max(0, finalRating));
  const fullStars = Math.floor(ratingValue);
  const hasHalf = ratingValue % 1 >= 0.5;

  return (
    <div className={`flex items-center gap-1.5 mt-1 mb-2 ${className || ''}`}>
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="relative">
            {/* Background star */}
            <Star className="size-3 fill-slate-200 stroke-none" aria-hidden />
            {/* Filled star */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                width: i < fullStars ? '100%' : i === fullStars && hasHalf ? '50%' : '0%'
              }}
            >
              <Star className="size-3 fill-yellow-400 stroke-none" aria-hidden />
            </div>
          </div>
        ))}
      </div>
      {/* Score + count */}
      <span className="text-[10px] font-bold text-slate-500">
        {ratingValue.toFixed(1)}
      </span>
      <span className="text-[10px] text-slate-400">
        ({finalCount})
      </span>
    </div>
  );
}
