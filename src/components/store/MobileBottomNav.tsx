'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Menu, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useSearchUIStore } from '@/store/useSearchUIStore';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { useMobileMenuStore } from '@/store/useMobileMenuStore';
import { Button } from '@/components/ui/button';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { openCart } = useCartUIStore();
  const { openSearch } = useSearchUIStore();
  const { items } = useCartStore();
  const { language } = useLanguageStore();
  
  const dict = language === 'en' ? en : ar;
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const { open: openMobileMenu } = useMobileMenuStore();

  const navItems = [
    {
      label: dict.common.home,
      icon: Home,
      href: '/',
      type: 'link'
    },
    {
      label: dict.common.products || 'Products',
      icon: Package,
      href: '/products',
      type: 'link'
    },
    {
      label: dict.common.cart || 'Cart',
      icon: ShoppingBag,
      onClick: openCart,
      type: 'button',
      badge: cartItemCount
    },
    {
      label: dict.common.search,
      icon: Search,
      onClick: openSearch,
      type: 'button'
    },
    {
      label: dict.profile.more,
      icon: Menu,
      onClick: openMobileMenu,
      type: 'button'
    }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 flex md:hidden items-center justify-around bg-white/90 backdrop-blur-md border-t border-slate-200 px-1 pb-[env(safe-area-inset-bottom)] pt-2 h-[calc(72px+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      {navItems.map((item, index) => {
        const isActive = item.type === 'link' && pathname === item.href;
        const Icon = item.icon;

        const content = (
          <div className="flex flex-col items-center justify-center gap-1 w-full relative scale-95 sm:scale-100">
            {isActive && (
              <motion.div 
                layoutId="activeTabTop"
                className="absolute -top-2 w-8 h-1 bg-(--primary) rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <div className={`p-1.5 rounded-xl transition-colors ${
              isActive ? "bg-(--primary)/10" : "bg-transparent"
            }`}>
              <Icon 
                className={`size-5 transition-colors duration-200 ${
                  isActive ? 'text-(--primary) stroke-[2.5px]' : 'text-slate-400 stroke-[2px]'
                }`} 
              />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -inset-e-1 bg-(--primary) text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none flex items-center justify-center min-w-[16px] h-4 border-2 border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors duration-200 text-center px-1 truncate w-full ${
              isActive ? 'text-(--primary)' : 'text-slate-400 font-bold'
            }`}>
              {item.label}
            </span>
          </div>
        );

        if (item.type === 'link') {
          return (
            <Link key={index} href={item.href!} className="flex-1 py-1 outline-none">
              {content}
            </Link>
          );
        }

        return (
          <Button 
            variant="ghost"
            key={index} 
            onClick={item.onClick}
            className="flex-1 py-1 px-0 h-auto border-none bg-transparent cursor-pointer hover:bg-transparent"
          >
            {content}
          </Button>
        );
      })}
    </nav>
  );
}
