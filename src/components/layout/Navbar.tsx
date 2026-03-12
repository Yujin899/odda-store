'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Menu, User, LogOut, Package, ChevronDown } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useSearchUIStore } from '@/store/useSearchUIStore';
import { useMobileMenuStore } from '@/store/useMobileMenuStore';
import { useCartStore } from '@/store/useCartStore';

export function Navbar() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  
  const { openCart } = useCartUIStore();
  const { openSearch } = useSearchUIStore();
  const { open: openMobileMenu } = useMobileMenuStore();
  const { items } = useCartStore();
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
    <header className="sticky top-0 z-40 border-b border-navy/10 px-6 lg:px-12 py-4 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Left Side: Hamburger (Mobile) / Logo + Nav (Desktop) */}
        <div className="flex-1 flex items-center">
          <button
            onClick={openMobileMenu}
            className="flex md:hidden items-center justify-center p-2 rounded-(--radius) text-navy hover:bg-navy/5 transition-colors border-none outline-none cursor-pointer bg-transparent"
            aria-label="Open menu"
          >
            <Menu className="size-6 stroke-[2.5px]" />
          </button>

          <div className="hidden md:flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Odda Logo" width={100} height={36} className="object-contain" />
            </Link>
            <nav className="flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">Home</Link>
              
              <div className="relative" ref={categoryRef}>
                <button 
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-1 text-sm font-semibold text-navy hover:text-(--primary) transition-colors border-none outline-none cursor-pointer bg-transparent"
                >
                  Products <ChevronDown className={`size-3 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-sm shadow-xl p-2 z-50"
                    >
                      <Link 
                        href="/products" 
                        onClick={() => setIsCategoryOpen(false)}
                        className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy hover:bg-slate-50 rounded-sm"
                      >
                        All Categories
                      </Link>
                      {categories.map((cat) => (
                        <Link 
                          key={cat._id}
                          href={`/products?categoryId=${cat._id}`}
                          onClick={() => setIsCategoryOpen(false)}
                          className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy hover:bg-slate-50 rounded-sm"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/about" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">About</Link>
            </nav>
          </div>
        </div>

        {/* Center: Mobile Logo */}
        <div className="flex md:hidden flex-1 justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Odda Logo" width={90} height={32} className="object-contain" />
          </Link>
        </div>

        {/* Right Side: Actions */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-6">
          {/* Mobile: icon-only search trigger */}
          <button
            onClick={handleOpenSearch}
            className="flex sm:hidden items-center justify-center p-2 rounded-(--radius) text-navy hover:bg-navy/5 transition-colors border-none outline-none cursor-pointer bg-transparent"
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
            <span className="text-sm w-40 bg-transparent text-navy/50 ml-2">Search instruments...</span>
          </div>

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
                        {session.user?.name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        href="/orders" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Package className="size-4" />
                        My Orders
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
                        Sign Out
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
              Sign In
            </Link>
          )}

          <button onClick={handleOpenCart} className="relative p-2 rounded-sm text-navy hover:bg-navy/5 transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent">
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
