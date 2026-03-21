'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { Button } from '@/components/ui/button';

export function EmptyCart() {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const isRtl = language === 'ar';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-(--primary)/5 rounded-full scale-150 blur-2xl animate-pulse"></div>
        <ShoppingBag className="size-20 text-muted-foreground/20 relative z-10 stroke-[1.25px]" />
      </div>
      
      <div className="space-y-4 max-w-sm mx-auto">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
          {dict.checkoutPage.emptyCart}
        </h2>
        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
          {dict.checkoutPage.addTools}
        </p>
      </div>

      <Button 
        asChild
        className="mt-12 px-12 py-8 bg-(--navy) text-white font-black rounded-sm uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-(--primary) hover:-translate-y-1 transition-all duration-300 group border-none"
      >
        <Link href="/products">
          <span className="flex items-center gap-2">
            {isRtl ? 'تصفح الكتالوج' : 'Browse Catalog'}
            <span className={bcn("transition-transform duration-300 group-hover:translate-x-1", isRtl ? "rotate-180" : "")}>
              →
            </span>
          </span>
        </Link>
      </Button>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
