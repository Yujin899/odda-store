'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCartUIStore } from '@/store/useCartUIStore';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { Dictionary } from '@/types/store';

interface AddToCartButtonProps {
  product: {
    _id: string;
    slug: string;
    name: string;
    nameAr?: string;
    price: number;
    image: string;
    stock: number;
  };
  dict: Dictionary;
  variant?: 'card' | 'pdp';
  className?: string;
  type?: 'product' | 'bundle';
}

export function AddToCartButton({ 
  product, 
  dict, 
  variant = 'card', 
  className = '', 
  type = 'product' 
}: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const { openCart } = useCartUIStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (product.stock <= 0) return;

    addItem({
      id: String(product._id),
      slug: product.slug,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.image,
      type: type as 'product' | 'bundle'
    });
    
    openCart();
  };

  const inStock = product.stock > 0;

  if (variant === 'card') {
    return (
      <Button 
        disabled={!inStock}
        variant={inStock ? 'default' : 'secondary'}
        onClick={handleAddToCart}
        className={cn(
          "w-full py-2 sm:py-3 h-9 sm:h-12 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all border-none flex items-center justify-center gap-1.5 sm:gap-2",
          className
        )}
      >
        <ShoppingCart className="size-4 stroke-[2px]" />
        {inStock ? dict.common.addToCart : (dict.common.soldOut || 'Sold Out')}
      </Button>
    );
  }

  // PDP variant if needed later
  return (
    <Button 
      disabled={!inStock}
      variant={inStock ? 'default' : 'secondary'}
      onClick={handleAddToCart}
      className={cn(
        "w-full font-bold py-5 text-lg transition-all transform active:scale-95 uppercase tracking-widest border-none flex items-center justify-center gap-3",
        className
      )}
    >
      <ShoppingCart className="size-5" />
      {dict.common.addToCart}
    </Button>
  );
}
