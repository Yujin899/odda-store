'use client';

import React from 'react';
import { usePathname } from "next/navigation";
import { House, Package, ShoppingBag, Search, Menu } from "lucide-react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchModal } from "@/components/search/SearchModal";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { MobileBottomNav, type NavItem } from "@/components/shared/MobileBottomNav";
import { useCartUIStore } from "@/store/useCartUIStore";
import { useSearchUIStore } from "@/store/useSearchUIStore";
import { useCartStore } from "@/store/useCartStore";
import { useMobileMenuStore } from "@/store/useMobileMenuStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";

interface StoreLayoutClientProps {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}

export function StoreLayoutClient({ children, navbar, footer }: StoreLayoutClientProps) {
  const pathname = usePathname();
  const { openCart } = useCartUIStore();
  const { openSearch } = useSearchUIStore();
  const { open: openMobileMenu } = useMobileMenuStore();
  const { items } = useCartStore();
  const { language } = useLanguageStore();
  
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const isAr = language === 'ar';

  const storeNavItems: NavItem[] = [
    { label: 'Home', labelAr: 'الرئيسية', icon: House, href: '/', isActive: pathname === '/' },
    { label: 'Products', labelAr: 'المنتجات', icon: Package, href: '/products', isActive: pathname.startsWith('/products') },
    { label: 'Cart', labelAr: 'السلة', icon: ShoppingBag, onClick: openCart, badge: cartCount },
    { label: 'Search', labelAr: 'بحث', icon: Search, onClick: openSearch },
    { label: 'More', labelAr: 'المزيد', icon: Menu, onClick: openMobileMenu },
  ];

  return (
    <div className="relative flex flex-col min-h-screen">
      <AnnouncementBar />
      {navbar}
      <div className="flex-1 flex flex-col pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0">
        <main className="flex-1">
          {children}
        </main>
        {footer}
      </div>
      <CartDrawer />
      <SearchModal />
      <MobileMenu />
      <MobileBottomNav items={storeNavItems} isAr={isAr} />
    </div>
  );
}
