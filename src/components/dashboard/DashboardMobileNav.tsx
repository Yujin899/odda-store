'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, Menu, PackagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/store/useLanguageStore';

interface DashboardMobileNavProps {
  onMoreClick?: () => void;
}

export function DashboardMobileNav({ onMoreClick }: DashboardMobileNavProps) {
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  const navItems = [
    {
      label: isAr ? 'نظرة عامة' : 'Overview',
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      label: isAr ? 'الطلبات' : 'Orders',
      icon: ShoppingCart,
      href: '/dashboard/orders',
    },
    {
      label: isAr ? 'المنتجات' : 'Products',
      icon: Package,
      href: '/dashboard/products',
    },
    {
      label: isAr ? 'العروض' : 'Bundles',
      icon: PackagePlus,
      href: '/dashboard/bundles',
    },
  ];

  return (
    <nav className="fixed bottom-0 start-0 end-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 flex md:hidden justify-around items-center h-16 pb-[env(safe-area-inset-bottom)] px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative",
              isActive ? "text-(--primary)" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-colors",
              isActive ? "bg-(--primary)/10" : "bg-transparent"
            )}>
              <Icon className="size-5 transition-transform active:scale-90" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {item.label}
            </span>
            {isActive && (
              <div className="absolute top-0 w-8 h-1 bg-(--primary) rounded-b-full" />
            )}
          </Link>
        );
      })}

      {/* More Button */}
      <button
        onClick={onMoreClick}
        className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer outline-none"
      >
        <div className="p-1.5 rounded-xl transition-colors bg-transparent">
          <Menu className="size-5 transition-transform active:scale-90" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-tighter">
          {isAr ? 'المزيد' : 'More'}
        </span>
      </button>
    </nav>
  );
}
