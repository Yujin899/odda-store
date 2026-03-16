'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCartUIStore } from '@/store/useCartUIStore';

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
      <button 
        disabled={!inStock}
        onClick={handleAddToCart}
        className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm outline-none border-none flex items-center justify-center gap-2 ${
          !inStock 
            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
            : 'bg-(--primary) hover:bg-navy text-white cursor-pointer'
        } ${className}`}
      >
        <ShoppingCart className="size-4 stroke-[2px]" />
        {inStock ? dict.common.addToCart : (dict.common.soldOut || 'Sold Out')}
      </button>
    );
  }

  // PDP variant if needed later
  return (
    <button 
      disabled={!inStock}
      onClick={handleAddToCart}
      className={`w-full font-bold py-5 text-lg shadow-lg transition-all transform active:scale-95 rounded-(--radius) uppercase tracking-widest outline-none border-none flex items-center justify-center gap-3 ${
        !inStock 
          ? 'bg-muted text-muted-foreground cursor-not-allowed shadow-none' 
          : 'bg-(--primary) hover:bg-(--primary)/90 text-white shadow-(--primary)/20 cursor-pointer'
      } ${className}`}
    >
      <ShoppingCart className="size-5" />
      {dict.common.addToCart}
    </button>
  );
}
