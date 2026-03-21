'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCartUIStore } from '@/store/useCartUIStore';
import { Badge } from '@/components/ui/badge';

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
        <Badge variant="default" className="absolute -top-1 -inset-e-1 size-5 p-0 flex items-center justify-center rounded-full leading-none border-2 border-white shadow-sm ring-4 ring-navy/5 transition-none">
          {cartItemCount}
        </Badge>
      )}
    </button>
  );
}
