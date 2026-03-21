'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCartUIStore } from '@/store/useCartUIStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function NavbarCartTrigger() {
  const { openCart } = useCartUIStore();
  const { items } = useCartStore();
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Button 
      variant="ghost"
      onClick={() => openCart()} 
      className="relative p-2 rounded-[var(--radius)] text-foreground hover:bg-primary/5 transition-colors flex items-center justify-center border-none size-10"
    >
      <ShoppingBag className="size-5 stroke-[2.5px]" />
      {cartItemCount > 0 && (
        <Badge variant="default" className="absolute -top-1 -inset-e-1 size-5 p-0 flex items-center justify-center rounded-full leading-none border-2 border-white shadow-sm ring-4 ring-primary/5 transition-none">
          {cartItemCount}
        </Badge>
      )}
    </Button>
  );
}
