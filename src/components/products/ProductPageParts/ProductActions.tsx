'use client';

import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { Button } from '@/components/ui/button';

interface ProductActionsProps {
  product: any;
  stock: number;
}

export function ProductActions({ product, stock }: ProductActionsProps) {
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
    
    // Simulate a brief delay for premium feel
    setTimeout(() => {
      addItem({
        id: String(product._id),
        slug: product.slug,
        name: product.name,
        nameAr: product.nameAr,
        price: product.price,
        image: product.images?.[0]?.url || product.image || '',
      }, quantity);
      
      setIsAdding(false);
      openCart();
    }, 400);
  };

  const isOutOfStock = stock <= 0;

  return (
    <div className="flex flex-col gap-6 pt-6 border-t border-slate-100">
      <div className="flex items-center gap-6">
        {/* Quantity Picker */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1 text-start">
            {isRtl ? 'الكمية' : 'Quantity'}
          </span>
          <div dir="ltr" className={bcn(
            "bg-white h-14 border border-slate-200 rounded-sm flex items-center shadow-sm overflow-hidden",
            isOutOfStock ? "opacity-30 cursor-not-allowed" : ""
          )}>
            <button 
              type="button"
              disabled={isOutOfStock || quantity <= 1}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 h-full hover:bg-slate-50 transition-colors text-slate-500 disabled:text-slate-200"
            >
              <Minus className="size-4" />
            </button>
            <span className="flex-1 min-w-[50px] text-center font-black text-sm text-(--navy)">
              {quantity}
            </span>
            <button 
              type="button"
              disabled={isOutOfStock}
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 h-full hover:bg-slate-50 transition-colors text-slate-500 disabled:text-slate-200"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        {/* Info Label (Stock status or other) */}
        {!isOutOfStock && stock < 10 && (
          <div className="flex-1 text-start">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
              {isRtl ? `بقي فقط ${stock} قطع!` : `Only ${stock} left!`}
            </p>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <Button 
        disabled={isOutOfStock || isAdding}
        onClick={handleAddToCart}
        className={bcn(
          "w-full h-16 rounded-sm font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden",
          isOutOfStock 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
            : "bg-(--navy) hover:bg-(--primary) text-white shadow-(--primary)/20"
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
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
