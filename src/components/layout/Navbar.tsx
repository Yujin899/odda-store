'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User as UserIcon, LogOut, Package, ChevronDown } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useSearchUIStore } from '@/store/useSearchUIStore';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { LanguageSwitcher } from './LanguageSwitcher';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';

export function Navbar() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string; nameAr?: string }[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  
  const { openCart } = useCartUIStore();
  const { openSearch } = useSearchUIStore();
  const { items } = useCartStore();
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(err => console.error('Navbar categories error:', err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenSearch = () => {
    openSearch();
  };

  const handleOpenCart = () => {
    openCart();
  };

  return (
    <header className="relative md:sticky md:top-0 z-40 border-b border-navy/10 px-6 lg:px-12 py-4 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Main Content Area: Logo + Desktop Nav */}
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Odda Logo" 
                width={100} 
                height={36} 
                priority
                className="object-contain w-[80px] sm:w-[100px]" 
              />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">{dict.common.home}</Link>
              
              <div className="relative" ref={categoryRef}>
                <button 
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-1 text-sm font-semibold text-navy hover:text-(--primary) transition-colors border-none outline-none cursor-pointer bg-transparent"
                >
                  {dict.common.categories} <ChevronDown className={`size-3 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full start-0 mt-2 w-48 bg-white border border-slate-100 rounded-sm shadow-xl p-2 z-50"
                    >
                      <Link 
                        href="/products" 
                        onClick={() => setIsCategoryOpen(false)}
                        className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy hover:bg-slate-50 rounded-sm"
                      >
                        {dict.common.allProducts}
                      </Link>
                      {categories.map((cat) => (
                        <Link 
                          key={cat._id}
                          href={`/products?categoryId=${cat._id}`}
                          onClick={() => setIsCategoryOpen(false)}
                          className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy hover:bg-slate-50 rounded-sm"
                        >
                          {language === 'ar' && cat.nameAr ? cat.nameAr : cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/profile" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">{dict.common.profile || 'Profile'}</Link>
              {session?.user?.role === 'admin' && (
                <Link href="/dashboard" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">{dict.common.dashboard}</Link>
              )}
              <Link href="/order-tracking" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">{dict.common.trackOrder}</Link>
              <Link href="/about" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">{dict.common.about}</Link>

            </nav>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-6">
          {/* Mobile: icon-only search trigger */}
          <button
            onClick={handleOpenSearch}
            className="sm:hidden hidden items-center justify-center p-2 rounded-(--radius) text-navy hover:bg-navy/5 transition-colors border-none outline-none cursor-pointer bg-transparent"
            aria-label="Open search"
          >
            <Search className="size-5 stroke-[2.5px]" />
          </button>

          {/* Desktop: full search bar */}
          <div 
            onClick={handleOpenSearch}
            className="hidden sm:flex items-center border border-navy/20 px-3 py-1.5 rounded-sm bg-background cursor-pointer hover:border-navy/40 transition-all"
          >
            <Search className="size-4 text-navy/50 stroke-[2.5px]" />
            <span className="text-sm w-40 bg-transparent text-navy/50 ms-2">{dict.common.search}</span>
          </div>

          <div className="hidden lg:block border-l border-navy/10 h-6 mx-2" />
          <LanguageSwitcher />
          <div className="hidden lg:block border-r border-navy/10 h-6 mx-2" />

          {/* User Area */}
          {session ? (
            <div className="relative hidden md:flex" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex p-[0.35rem] rounded-full hover:bg-navy/5 transition-colors items-center justify-center border border-navy/10 bg-white"
                aria-label="Account Settings"
              >
                {session.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || 'User'} 
                    width={28} 
                    height={28} 
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-(--primary)/10 text-(--primary) size-7 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                  </div>
                )}
              </button>

              <AnimatePresence mode="wait">
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-(--radius) shadow-lg overflow-hidden py-1 z-50"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {session.user?.name || dict.profile.userPlaceholder}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        href="/profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-semibold"
                      >
                        <UserIcon className="size-4" />
                        {dict.common.profile || 'Profile'}
                      </Link>
                      <Link 
                        href="/orders" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Package className="size-4" />
                        {dict.common.myOrders}
                      </Link>
                    </div>

                    <div className="border-t border-border py-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full text-left transition-colors"
                      >
                        <LogOut className="size-4" />
                        {dict.common.logout}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              href="/login"
              className="hidden md:flex p-2 rounded-sm text-navy hover:bg-navy/5 transition-colors items-center justify-center font-semibold text-sm"
            >
              {dict.common.login}
            </Link>
          )}

          <button onClick={handleOpenCart} className="relative p-2 rounded-sm text-navy hover:bg-navy/5 transition-colors hidden md:flex items-center justify-center border-none outline-none cursor-pointer bg-transparent">
            <ShoppingBag className="size-5 stroke-[2.5px]" />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 bg-(--primary) text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
