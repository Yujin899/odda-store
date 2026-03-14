'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  targetId: string;
  targetSlug: string;
  targetType: 'Product' | 'Bundle';
  apiEndpoint: string;
  reviews: Review[];
  isLoading?: boolean;
  onReviewAdded: () => void;
}

export function ReviewSection({ 
  targetId: _targetId,
  targetSlug: _targetSlug,
  targetType, 
  apiEndpoint,
  reviews,
  isLoading = false,
  onReviewAdded
}: ReviewSectionProps) {
  const { data: session } = useSession();
  const { language } = useLanguageStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
      });
      
      const data = await res.json();
      if (res.ok) {
        // Reset form
        setComment('');
        setRating(5);
        // Notify parent to refresh reviews
        onReviewAdded();
      } else {
        alert(data.message || (language === 'ar' ? 'فشل إرسال التقييم' : 'Failed to post review'));
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert(language === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-2 pb-6 space-y-6" data-target-id={_targetId} data-target-slug={_targetSlug}>
      {/* Review Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-(--radius) border border-slate-100 space-y-4">
          <h4 className={`text-sm font-bold uppercase tracking-widest text-slate-500 text-start ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'ar' ? 'قولنا رأيك' : 'Write a Review'}
          </h4>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="focus:outline-none transition-transform active:scale-90 bg-transparent border-none cursor-pointer p-0"
              >
                <Star 
                  className={`size-5 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} 
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={language === 'ar' ? (targetType === 'Bundle' ? 'اكتب رأيك في هذا العرض...' : 'اكتب رأيك في هذا المنتج...') : `Share your thoughts about this ${targetType.toLowerCase()}...`}
            className={`w-full p-3 text-sm border border-slate-200 rounded-(--radius) bg-white focus:outline-none focus:border-(--primary) min-h-[80px] text-start ${language === 'ar' ? 'font-cairo' : ''}`}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-(--primary) text-white py-2 rounded-(--radius) font-bold text-xs uppercase tracking-widest hover:bg-(--primary)/90 disabled:opacity-50 border-none cursor-pointer"
          >
            {isSubmitting ? (language === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (language === 'ar' ? 'إرسال التقييم' : 'Post Review')}
          </button>
        </form>
      ) : (
        <div className="p-4 bg-slate-50 rounded-(--radius) border border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 font-cairo">
            {language === 'ar' ? 'لازم تسجل دخول عشان تسيب تقييم' : 'Sign in to write a review'}
          </p>
          <Link 
            href="/login" 
            className="text-(--primary) text-xs font-black uppercase tracking-widest hover:underline font-cairo"
          >
            {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {isLoading ? (
           <div className="py-8 flex justify-center">
             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-(--primary)"></div>
           </div>
        ) : reviews.length > 0 ? (
          reviews.map((rev, i: number) => (
            <div key={`${rev._id}-${i}`} className="pb-4 border-b border-slate-100 last:border-0 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm tracking-tight">{rev.userName}</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest">
                  {new Date(rev.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                </span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`size-3 ${s <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} 
                  />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic text-start md:whitespace-pre-wrap">&quot;{rev.comment}&quot;</p>
            </div>
          ))
        ) : (
          <p className={`text-xs text-slate-400 text-center uppercase font-bold tracking-widest py-8 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'ar' ? 'محدش لسة ساب تقييم' : 'No reviews yet'}
          </p>
        )}
      </div>
    </div>
  );
}
