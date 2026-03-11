'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useSearchUIStore } from '@/store/useSearchUIStore';

export function Navbar() {
  const { openCart } = useCartUIStore();
  const { openSearch } = useSearchUIStore();

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 px-6 lg:px-12 py-4 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Odda Logo" width={100} height={36} className="object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">Home</Link>
            <Link href="/products" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">Shop</Link>
            <Link href="/products" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">Collections</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          {/* Mobile: icon-only search trigger */}
          <button
            onClick={openSearch}
            className="flex sm:hidden items-center justify-center p-2 rounded-[var(--radius)] text-navy hover:bg-navy/5 transition-colors border-none outline-none cursor-pointer bg-transparent"
            aria-label="Open search"
          >
            <span className="material-symbols-outlined text-2xl font-normal">search</span>
          </button>

          {/* Desktop: full search bar */}
          <div 
            onClick={openSearch}
            className="hidden sm:flex items-center border border-navy/20 px-3 py-1.5 rounded-sm bg-background cursor-pointer hover:border-navy/40 transition-all"
          >
            <span className="material-symbols-outlined text-navy/50 text-xl font-normal">search</span>
            <span className="text-sm w-40 bg-transparent text-navy/50 ml-2">Search instruments...</span>
          </div>
          <button onClick={openCart} className="relative p-2 rounded-sm text-navy hover:bg-navy/5 transition-colors flex items-center justify-center border-none outline-none cursor-pointer bg-transparent">
            <span className="material-symbols-outlined text-2xl font-normal">shopping_bag</span>
            <span className="absolute top-1 right-1 bg-(--primary) text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none flex items-center justify-center">3</span>
          </button>
        </div>
      </div>
    </header>
  );
}
