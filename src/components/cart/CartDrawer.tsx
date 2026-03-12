'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBasket, X, Truck, Trash2, Minus, Plus, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useCartStore } from '@/store/useCartStore';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function CartDrawer() {
  const router = useRouter();
  const { isOpen, closeCart } = useCartUIStore();
  const { items, totalAmount, updateQuantity, removeItem } = useCartStore();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/settings').then(res => res.json()).then(setSettings).catch(() => {});
    }
  }, [isOpen]);

  const currentShippingFee = settings?.shippingFee || 0;
  const grandTotal = totalAmount + currentShippingFee;

  const handleCheckout = () => {
    router.push('/checkout');
    closeCart();
  };

  const handleContinueShopping = () => {
    router.push('/products');
    closeCart();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent 
        showCloseButton={false} 
        className="p-0 border-none w-full max-w-md bg-background flex flex-col shadow-none"
      >
        <SheetTitle className="sr-only">Your Cart</SheetTitle>
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBasket className="size-5 text-(--primary) stroke-[2.5px]" />
            <h2 className="text-xl font-bold tracking-tight text-foreground uppercase">Your Cart</h2>
            <span className="bg-(--primary) text-white text-[10px] font-bold h-5 min-w-5 px-1 flex items-center justify-center rounded-full">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-muted rounded-full transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent">
            <X className="size-5 text-muted-foreground stroke-[2.5px]" />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {items.length > 0 ? (
            <>
              {/* Free Delivery Banner */}
              <div className="px-4 sm:px-6 py-3 flex items-center gap-3 border-b border-(--primary)/10 shrink-0">
                <Truck className="size-4 text-(--primary) stroke-[2.5px]" />
                <p className="text-[10px] sm:text-xs font-bold text-(--primary) uppercase tracking-widest text-center w-full">Free campus delivery applied</p>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 scrollbar-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  {items.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      key={item.id} 
                      className="flex gap-3 sm:gap-4 p-1 hover:bg-slate-50/50 rounded-sm cursor-pointer transition-colors group"
                      onClick={(e) => {
                        // Don't navigate if clicking on controls
                        if ((e.target as HTMLElement).closest('button')) return;
                        router.push(`/product/${item.slug}`);
                        closeCart();
                      }}
                    >
                      <div className="size-20 sm:size-24 bg-muted shrink-0 overflow-hidden border border-slate-100 rounded-[var(--radius)] relative">
                        <Image 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                          src={item.image}
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-foreground leading-tight uppercase tracking-tight text-[11px] sm:text-sm truncate sm:whitespace-normal">{item.name}</h3>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-(--danger) transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent shrink-0"
                            >
                              <Trash2 className="size-4 stroke-[2.5px]" />
                            </button>
                          </div>
                          <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold truncate">Professional Grade Tools</p>
                        </div>
                        <div className="flex justify-between items-end gap-2 mt-2">
                          <div className="flex items-center border border-slate-200 h-7 sm:h-8 px-1 rounded-[var(--radius)]">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:text-(--primary) transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent"
                            >
                              <Minus className="size-3 sm:size-4 stroke-[3px]" />
                            </button>
                            <span className="px-2 sm:px-3 text-[10px] sm:text-xs font-bold text-foreground">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:text-(--primary) transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent"
                            >
                              <Plus className="size-3 sm:size-4 stroke-[3px]" />
                            </button>
                          </div>
                          <p className="font-black text-foreground text-xs sm:text-sm whitespace-nowrap">{(item.price * item.quantity).toLocaleString()} EGP</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Drawer Footer */}
              <div className="border-t border-slate-100 p-4 sm:p-6 space-y-4 bg-background shrink-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{totalAmount.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Delivery</span>
                    {currentShippingFee === 0 ? (
                      <span className="text-(--primary)">FREE</span>
                    ) : (
                      <span>{currentShippingFee.toLocaleString()} EGP</span>
                    )}
                  </div>
                  <div className="flex justify-between text-lg sm:text-xl font-black text-foreground pt-3 sm:pt-4 border-t border-slate-100">
                    <span>Total</span>
                    <span>{grandTotal.toLocaleString()} EGP</span>
                  </div>
                </div>
                <div className="pt-2 flex flex-col">
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-(--primary) hover:bg-foreground hover:text-background text-white font-bold py-4 sm:py-5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] rounded-[var(--radius)] border-none outline-none cursor-pointer uppercase tracking-widest text-[10px] sm:text-xs shadow-xl"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="size-4 stroke-[2.5px]" />
                  </button>
                  <p className="text-center text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mt-4 sm:mt-6 font-bold">Secure Clinical Checkout System</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingCart className="size-16 text-muted-foreground/20 stroke-[1.5px] mb-4" />
              <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">Your cart is empty</h3>
              <p className="text-xs text-muted-foreground mt-2 max-w-[200px] font-medium uppercase tracking-widest leading-loose">Items you add to your cart will appear here.</p>
              <button 
                onClick={handleContinueShopping}
                className="mt-8 px-8 py-4 bg-muted hover:bg-foreground hover:text-white transition-all rounded-[var(--radius)] border-none outline-none cursor-pointer text-[10px] font-bold uppercase tracking-widest"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
