'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { X, User as UserIcon, Package as PackageIcon, ShieldCheck, Search, Info, ChevronRight, Gift, House } from 'lucide-react';
import { useMobileMenuStore } from '@/store/useMobileMenuStore';
import { useSession } from 'next-auth/react';
import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/store';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface NavLink {
  name: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
}

export function MobileMenu() {
  const { isOpen, close } = useMobileMenuStore();
  const { data: session } = useSession();
  const { language } = useLanguageStore();
  const pathname = usePathname();
  const dict = language === 'en' ? en : ar;
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [showCategories, setShowCategories] = React.useState(false);

  React.useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const navLinks: NavLink[] = [
    { name: dict.common.home, href: '/', icon: House }
  ];

  if (session?.user) {
    navLinks.push({ 
      name: dict.common.profile || 'Profile', 
      href: '/profile', 
      icon: UserIcon 
    });
    navLinks.push({ 
      name: dict.common.myOrders, 
      href: '/orders', 
      icon: PackageIcon 
    });
    if (session.user.role === 'admin') {
      navLinks.push({ 
        name: dict.common.dashboard, 
        href: '/dashboard', 
        icon: ShieldCheck 
      });
    }
  } else {
    navLinks.push({ name: dict.common.login, href: '/login', icon: UserIcon });
  }

  navLinks.push({ name: dict.common.trackOrder, href: '/order-tracking', icon: Search });
  navLinks.push({ 
    name: dict.common.offersAndBundles, 
    href: '/bundles', 
    icon: Gift,
    highlight: true 
  });
  navLinks.push({ name: dict.common.about, href: '/about', icon: Info });

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: language === 'ar' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: language === 'ar' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, duration: 0.25 }}
            className="fixed top-0 inset-s-0 bottom-0 w-[80%] max-w-sm bg-background z-101 lg:hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-navy/10">
              <Link href="/" onClick={close} className="flex items-center gap-2">
                <Image src="/logo.png" alt="Odda Logo" width={80} height={28} className="object-contain" />
              </Link>
              <Button 
                variant="ghost"
                size="icon"
                onClick={close}
                className="p-2 rounded-(--radius) text-navy hover:bg-navy/5 transition-colors border-none"
              >
                <X className="size-6 stroke-[2.5px]" />
              </Button>
            </div>

              <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={close}
                      className={`flex items-center justify-between p-4 rounded-(--radius) text-base font-black uppercase tracking-tight transition-all group ${
                        isActive 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : link.highlight 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'text-foreground hover:bg-slate-50 hover:text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {link.icon && (
                          <link.icon className={`size-5 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'
                          }`} />
                        )}
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight className={`size-5 transition-all ${
                        isActive 
                          ? 'text-white/50 translate-x-1' 
                          : 'opacity-30 rtl:-scale-x-100 group-hover:opacity-100 group-hover:translate-x-1'
                      }`} />
                    </Link>
                  );
                })}

                {/* Categories Accordion Style */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className={`w-full flex items-center justify-between p-4 rounded-(--radius) text-base font-black uppercase tracking-tight transition-all hover:bg-slate-50 hover:text-primary ${
                      showCategories ? 'text-primary bg-slate-50' : 'text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <PackageIcon className={`size-5 transition-colors ${showCategories ? 'text-primary' : 'text-slate-400'}`} />
                      <span>{dict.common.categories}</span>
                    </div>
                    <ChevronDown className={`size-5 transition-transform duration-300 ${showCategories ? 'rotate-180 text-primary' : 'opacity-30'}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showCategories && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1 mx-4 border-s-2 border-slate-100"
                      >
                        <Link
                          href="/products"
                          onClick={close}
                          className="flex items-center justify-between p-3 ps-6 rounded-(--radius) text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary hover:bg-slate-50 transition-all font-mono"
                        >
                          {dict.common.allProducts}
                        </Link>
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            onClick={close}
                            className="flex items-center justify-between p-3 ps-6 rounded-(--radius) text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary hover:bg-slate-50 transition-all font-mono"
                          >
                            {language === 'ar' && cat.nameAr ? cat.nameAr : cat.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>

            <div className="p-6 border-t border-navy/10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">
                {dict.common.premiumDentalTools || (language === 'ar' ? 'أدوات أسنان متميزة' : 'Premium Dental Tools')}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
