'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, X, SearchX, FileSearch } from 'lucide-react';
import Image from 'next/image';
import { useSearchUIStore } from '@/store/useSearchUIStore';
import { useRecentlyViewedStore, RecentItem } from '@/store/useRecentlyViewedStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary-utils';
import { Product, RelatedProduct } from '@/types/store';

export function SearchModal() {
  const { isOpen, closeSearch } = useSearchUIStore();
  const { items: recentlyViewed, addViewedItem } = useRecentlyViewedStore();
  const router = useRouter();
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;
  const [searchValue, setSearchValue] = useState('');
   const [searchResults, setSearchResults] = useState<Product[]>([]);
   const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getDisplayImage = (product: Product | RelatedProduct | RecentItem) => {
    if ('images' in product && product.images && Array.isArray(product.images) && product.images.length > 0) {
      const primary = (product.images as any[]).find((img: any) => img.isPrimary) || product.images[0];
      return typeof primary === 'string' ? primary : (primary?.url || '/placeholder.png');
    }
    return product.image || '/placeholder.png';
  };

  // Debounced search
  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchValue)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.products || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleClose = () => {
    setSearchValue('');
    setSearchResults([]);
    closeSearch();
  };

  const handleSearchNavigation = (query: string) => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProductClick = (product: Product | RelatedProduct | RecentItem) => {
    const displayImage = getDisplayImage(product);
    addViewedItem({
      id: String((product as any)._id || (product as any).id),
      slug: (product as any).slug || '',
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: optimizeCloudinaryUrl(displayImage, { width: 200 }),
    });
    router.push(`/product/${(product as any).slug || (product as any)._id || (product as any).id}`);
    closeSearch();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div 
          key="search-modal-container"
          className="fixed inset-0 z-50 flex items-start justify-center px-2 sm:px-4 pt-4 sm:pt-16"
        >
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSearch}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Panel — slide in from right, constrained height */}
          <motion.div
            key="search-panel"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-2xl bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-8rem)] mb-4 sm:mb-8"
          >
            {/* Search Input Area */}
            <div className="relative flex items-center px-4 sm:px-6 py-4 border-b border-border shrink-0 pe-14">
              <button 
                onClick={() => handleSearchNavigation(searchValue)}
                className="p-1 hover:bg-muted rounded-md transition-colors me-3 outline-none border-none bg-transparent cursor-pointer text-muted-foreground"
              >
                <Search className="size-5 stroke-[2.5px]" />
              </button>
              <input
                ref={inputRef}
                type="text"
                placeholder={dict.common.search}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchNavigation(searchValue);
                }}
                className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/50 h-8"
              />
              <button 
                onClick={handleClose}
                className="absolute inset-e-3 sm:inset-e-6 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors outline-none border-none cursor-pointer text-muted-foreground flex items-center justify-center h-9 w-9 bg-transparent"
              >
                <X className="size-5 stroke-[2.5px]" />
              </button>
            </div>

            {/* Scrollable content area — scrollbar hidden */}
            <div className="overflow-y-auto flex-1 p-6 scrollbar-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* Recently Viewed Section */}
              {!searchValue && recentlyViewed.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      {language === 'ar' ? 'شوهد مؤخراً' : 'Recently viewed'}
                    </h3>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2 snap-x scrollbar-hidden">
                    {recentlyViewed.map((product) => (
                      <div 
                        key={`recent-${product.id}`}
                        onClick={() => handleProductClick(product)}
                        className="shrink-0 w-40 group cursor-pointer snap-start"
                      >
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4 border border-border/40 relative">
                          <Image 
                            src={getDisplayImage(product)} 
                            alt={(language === 'ar' && product.nameAr) ? product.nameAr : product.name} 
                            fill
                            className="object-cover group-hover:scale-110 transition-all duration-700" 
                          />
                        </div>
                        <h4 className="text-[11px] font-bold uppercase tracking-tight text-foreground truncate mb-1 group-hover:text-(--primary) transition-colors">
                          {(language === 'ar' && product.nameAr) ? product.nameAr : product.name}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-foreground">{product.price.toLocaleString()} {dict.common.egp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {searchValue && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      {language === 'ar' ? 'نتائج البحث عن' : 'Results for'} &quot;{searchValue}&quot;
                    </h3>
                    {isLoading && (
                      <div className="flex items-center gap-2">
                        <div className="size-3 border-2 border-(--primary)/20 border-t-(--primary) rounded-full animate-spin" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-(--primary)">
                          {language === 'ar' ? 'جاري البحث...' : 'Searching...'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.map((product) => (
                      <div 
                        key={`prod-${product._id || product.id}`}
                        onClick={() => handleProductClick(product)}
                        className="flex gap-4 p-3 hover:bg-muted/50 rounded-lg group cursor-pointer transition-colors border border-transparent hover:border-border"
                      >
                        <div className="size-16 bg-muted rounded-sm overflow-hidden shrink-0 relative">
                          <Image 
                            src={getDisplayImage(product)} 
                            alt={product.name} 
                            fill
                            className="object-cover group-hover:scale-110 transition-all duration-500" 
                          />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <h4 className="text-xs font-bold uppercase tracking-tight text-foreground truncate group-hover:text-(--primary) transition-colors">
                            {(language === 'ar' && product.nameAr) ? product.nameAr : product.name}
                          </h4>
                          <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
                            {language === 'ar' ? 
                              (product.categoryNameAr || (typeof product.categoryId === 'object' ? product.categoryId?.nameAr : null)) : 
                              (product.categoryName || (typeof product.categoryId === 'object' ? product.categoryId?.name : null))}
                          </p>
                          <span className="text-xs font-black text-foreground mt-1">{Number(product.price).toLocaleString()} {dict.common.egp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {!isLoading && searchResults.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <SearchX className="size-12 text-muted-foreground/30 mb-4 stroke-[1.5px]" />
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        {language === 'ar' ? `لم يتم العثور على نتائج لـ "${searchValue}"` : `No instruments found for "${searchValue}"`}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-2 font-light">
                        {language === 'ar' ? 'حاول البحث عن شيء آخر' : 'Try searching for something else'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!searchValue && recentlyViewed.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FileSearch className="size-16 text-muted-foreground/10 mb-6 stroke-[1px]" />
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {language === 'ar' ? 'ابدأ الكتابة للبحث' : 'Start typing to search'}
                  </p>
                  <p className="text-xs text-muted-foreground/50 mt-3 font-medium uppercase tracking-[0.2em]">
                    {language === 'ar' ? 'كتالوج عدة للأدوات الطبية المتميزة' : 'Odda Premium Clinical Catalog'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Footer tip */}
            <div className="hidden sm:flex bg-muted/30 px-6 py-4 border-t border-border items-center justify-between shrink-0">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Try &quot;Stethoscope&quot; or &quot;Scalpel&quot;</p>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Press</span>
                <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[9px] font-bold text-muted-foreground shadow-sm">ESC</kbd>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">to close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
