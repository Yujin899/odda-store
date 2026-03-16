'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCartUIStore } from '@/store/useCartUIStore';

export function NavbarCartTrigger() {
  const { openCart } = useCartUIStore();
  const { items } = useCartStore();
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <button 
      onClick={() => openCart()} 
      className="relative p-2 rounded-sm text-navy hover:bg-navy/5 transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent"
    >
      <ShoppingBag className="size-5 stroke-[2.5px]" />
      {cartItemCount > 0 && (
        <span className="absolute top-1 inset-e-1 bg-(--primary) text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none flex items-center justify-center">
          {cartItemCount}
        </span>
      )}
    </button>
  );
}
