'use client';

import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddToCartSectionProps {
  productId: string;
  productName: string;
  productNameAr?: string;
  price: number;
  image: string;
  slug: string;
  type: 'product' | 'bundle';
  stock: number;
  dict: {
    addToCart: string;
  };
  className?: string;
}

export function AddToCartSection({
  productId,
  productName,
  productNameAr,
  price,
  image,
  slug,
  type,
  stock,
  dict,
  className = ''
}: AddToCartSectionProps) {
  const { language } = useLanguageStore();
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
        id: productId,
        slug: slug,
        name: productName,
        nameAr: productNameAr,
        price: price,
        image: image,
        type: type,
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
          <div dir="ltr" className={cn(
            "bg-white h-14 border border-slate-200 rounded-[var(--radius)] flex items-center overflow-hidden",
            isOutOfStock ? "opacity-30 cursor-not-allowed" : ""
          )}>
            <Button 
              type="button"
              variant="ghost"
              size="icon"
              disabled={isOutOfStock || quantity <= 1}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 h-full hover:bg-slate-50 transition-colors text-slate-500 disabled:text-slate-200 border-none rounded-[var(--radius)]"
            >
              <Minus className="size-4" />
            </Button>
            <span className="flex-1 min-w-[50px] text-center font-black text-sm text-foreground">
              {quantity}
            </span>
            <Button 
              type="button"
              variant="ghost"
              size="icon"
              disabled={isOutOfStock}
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 h-full hover:bg-slate-50 transition-colors text-slate-500 disabled:text-slate-200 border-none rounded-[var(--radius)]"
            >
              <Plus className="size-4" />
            </Button>
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
        variant={isOutOfStock ? "secondary" : "default"}
        className={cn(
          "w-full h-16 rounded-[var(--radius)] font-black uppercase tracking-[0.3em] text-[11px] transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden",
          isOutOfStock && "opacity-50 cursor-not-allowed shadow-none",
          className
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
            : dict.addToCart}
        </span>
      </Button>
    </div>
  );
}


