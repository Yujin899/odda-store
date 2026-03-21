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
import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function CartDrawer() {
  const router = useRouter();
  const { isOpen, closeCart } = useCartUIStore();
  const { items, totalAmount, updateQuantity, removeItem } = useCartStore();
  const [settings, setSettings] = useState<{ shippingFee: number } | null>(null);
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;

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
        <SheetTitle className="sr-only">{dict.common.cart}</SheetTitle>
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBasket className="size-5 text-(--primary) stroke-[2.5px]" />
            <h2 className="text-xl font-bold tracking-tight text-foreground uppercase">{dict.common.cart}</h2>
            <Badge variant="default" className="text-[10px] h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full transition-none bg-primary text-primary-foreground">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={closeCart} 
            className="rounded-full size-10"
          >
            <X className="size-5 text-muted-foreground stroke-[2.5px]" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {items.length > 0 ? (
            <>
              {/* Free Delivery Banner */}
              <div className="px-4 sm:px-6 py-3 flex items-center gap-3 border-b border-primary/10 shrink-0">
                <Truck className="size-4 text-primary stroke-[2.5px]" />
                <p className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest text-center w-full">
                  {dict.cart.freeDeliveryApplied}
                </p>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 scrollbar-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  {items.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: language === 'ar' ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
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
                          alt={(language === 'ar' && item.nameAr) ? item.nameAr : item.name} 
                          fill 
                          sizes="100px"
                          className="object-cover" 
                          src={item.image}
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-foreground leading-tight uppercase tracking-tight text-[11px] sm:text-sm truncate sm:whitespace-normal">
                              {(language === 'ar' && item.nameAr) ? item.nameAr : item.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="size-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="size-4 stroke-[2.5px]" />
                            </Button>
                          </div>
                          <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold truncate">{dict.cart.premiumMaterials}</p>
                        </div>
                        <div className="flex justify-between items-end gap-2 mt-2">
                          <div className="flex items-center border border-slate-200 h-8 rounded-[var(--radius)] overflow-hidden bg-white">
                            <Button 
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="size-8 rounded-[var(--radius)] hover:text-primary hover:bg-slate-50"
                            >
                              <Minus className="size-3 sm:size-4 stroke-[3px]" />
                            </Button>
                            <span className="px-3 text-[10px] sm:text-xs font-black text-foreground min-w-[30px] text-center">{item.quantity}</span>
                            <Button 
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="size-8 rounded-[var(--radius)] hover:text-primary hover:bg-slate-50"
                            >
                              <Plus className="size-3 sm:size-4 stroke-[3px]" />
                            </Button>
                          </div>
                          <p className="font-black text-foreground text-xs sm:text-sm whitespace-nowrap">{formatPrice(item.price * item.quantity, language as 'en' | 'ar')}</p>
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
                    <span>{dict.common.subtotal}</span>
                    <span>{formatPrice(totalAmount, language as 'en' | 'ar')}</span>
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>{dict.common.shipping}</span>
                    {currentShippingFee === 0 ? (
                      <span className="text-primary">{dict.common.free}</span>
                    ) : (
                      <span>{formatPrice(currentShippingFee, language as 'en' | 'ar')}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-lg sm:text-xl font-black text-foreground pt-3 sm:pt-4 border-t border-slate-100">
                    <span>{dict.common.total}</span>
                    <span>{formatPrice(grandTotal, language as 'en' | 'ar')}</span>
                  </div>
                </div>
                <div className="pt-2 flex flex-col">
                  <Button 
                    onClick={handleCheckout}
                    size="lg"
                    className="w-full flex items-center justify-center gap-2 uppercase tracking-widest text-[11px] font-black shadow-xl shrink-0"
                  >
                    <span>{dict.common.proceedToCheckout}</span>
                    <ArrowRight className="size-4 stroke-[2.5px] rtl:-scale-x-100" />
                  </Button>
                  <p className="text-center text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mt-4 sm:mt-6 font-bold">{dict.cart.secureCheckout}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingCart className="size-16 text-muted-foreground/20 stroke-[1.5px] mb-4" />
              <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">{dict.cart.emptyTitle}</h3>
              <p className="text-xs text-muted-foreground mt-2 max-w-[200px] font-medium uppercase tracking-widest leading-loose">
                {dict.cart.emptyMessage}
              </p>
              <Button 
                variant="outline"
                onClick={handleContinueShopping}
                className="mt-8 px-10 h-12 rounded-sm font-black uppercase tracking-widest text-[10px]"
              >
                {dict.cart.continueShopping}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
