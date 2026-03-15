'use client';

import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { Button } from '@/components/ui/button';

interface BundleActionsProps {
  bundle: any;
  stock: number;
}

export function BundleActions({ bundle, stock }: BundleActionsProps) {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const isRtl = language === 'ar';

  const { addItem } = useCartStore();
  const { openCart } = useCartUIStore();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (stock <= 0) return;
    
    setIsAdding(true);
    
    // Simulate premium delay
    setTimeout(() => {
      addItem({
        id: String(bundle._id),
        slug: bundle.slug,
        name: bundle.name,
        nameAr: bundle.nameAr,
        price: bundle.price,
        image: bundle.images?.[0] || '',
        type: 'bundle',
      }, quantity);
      
      setIsAdding(false);
      openCart();
    }, 400);
  };

  const isOutOfStock = stock <= 0;

  return (
    <div className="flex flex-col gap-6 pt-6 border-t border-slate-100">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Quantity Picker */}
        <div dir="ltr" className={bcn(
            "bg-white h-16 border border-slate-200 rounded-sm flex items-center shadow-sm overflow-hidden w-full",
            isOutOfStock ? "opacity-30 cursor-not-allowed" : ""
          )}>
          <button 
            type="button"
            disabled={isOutOfStock || quantity <= 1}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-6 h-full hover:bg-slate-50 transition-colors text-slate-500 disabled:text-slate-200"
          >
            <Minus className="size-4" />
          </button>
          <span className="px-6 font-black min-w-[60px] text-center text-lg text-(--navy)">
            {quantity}
          </span>
          <button 
            type="button"
            disabled={isOutOfStock}
            onClick={() => setQuantity(quantity + 1)}
            className="px-6 h-full hover:bg-slate-50 transition-colors text-slate-500 disabled:text-slate-200"
          >
            <Plus className="size-4" />
          </button>
        </div>

        {/* Primary Action Button */}
        <Button 
          disabled={isOutOfStock || isAdding}
          onClick={handleAddToCart}
          className={bcn(
            "flex-1 w-full h-16 rounded-sm font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden",
            isOutOfStock 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
              : "bg-(--primary) hover:bg-(--navy) text-white shadow-(--primary)/30"
          )}
        >
          {isAdding ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ShoppingCart className="size-5" />
          )}
          <span>
            {isOutOfStock 
              ? (isRtl ? 'نفذت من المخزن' : 'OUT OF STOCK') 
              : dict.common.addToCart}
          </span>
        </Button>
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
