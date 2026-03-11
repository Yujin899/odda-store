'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSearchUIStore } from '@/store/useSearchUIStore';
import Image from 'next/image';

const PRODUCTS = [
  {
    id: 1,
    name: 'Classic Stethoscope III',
    price: 4250,
    originalPrice: 4900,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjfv7G5fB1b67d_rspMIn-69RhN059Gi6WjIYTn7TxI_cPAgk7y49cizr4mOg_wlViFz3Fc3t1GVgzKtowHTzxVojxJTZILrh1lBPj8PSV5h63CQkQROBxjZGANA5JTGuk2Laxz3Tnnq6Qk-qYlEUfCEd9moCAl9ZpJQ5nju7EcePK80g8Cc0H0kfhghejA9Kvbdi-5p3fX0OG_83R4mFtsjjWr--vpXbrbumS1GLz77Y0gCwEAoLjhm-M7i0NQiLaiWpgA9YhpQ',
  },
  {
    id: 2,
    name: 'Precision Scalpel Set',
    price: 1890,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKVd8MH2HFNM5Jiq53iKbYwSos9ZqxTB3BCnn02hWGsiq2hdnRumXCtQ08Ki7X5iFc-YXTw-nZirWI5GMKKbDHb47vSOSlESml0D8VAOfHOtg-glW3GAKvB3BCL2f7ZMEPzJA3Rc_xgR3sA_hGAS8LgwttyViSz69yVoe5d13bLWpuYSSFkobUAZp-9gTtRnr5XXenJGKVRg_iYFj4Jw-ynbfiEnibVrPulixV7m39BVAx0W17rMLsADC1DgsmF5yeoaq9dA0BMg',
  },
  {
    id: 3,
    name: 'Digital Monitor Pro',
    price: 6750,
    originalPrice: 7900,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBtXqfiIuOASxsjtC1c9Qq3SafTDjPa23wCVCIAmkl_5vY36KQ8vgzgjVQ-6s8oS1KmMHRWHXbYyyZcWwtcizRVGF0d4V3tr-Q60r581ToMbKg-IeSRn830OJAEjIG4OeLmuGqzqKMRwCctWyUyid8S67AGOuBRu4DQdMNn1pvJtGKZqbAkQWSh8cSGO2HPLWYWVITCd_uObN53_WHFR189T2SWkjSTTnK9Ua_fprfsCDH6i_t1qhQGmg5n9zKtt497TW1scnHKw',
  },
  {
    id: 4,
    name: 'Emergency Kit Platinum',
    price: 12400,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtkcaYxxo7jsdRTcQ1xFU8dLnpoVIYD_uLN1FpAVWlcZPQ5jz11S2fQUTNvsk417wDiprrtdDiWkKRuCk-OVZmDN78ZVDywCin2BistP5UELelrIqtHaC6tgoDCLoMYy-7Nna2B7P66bul-gZzd2MkHkza071bNBWIjAZLBHHNBDPHlI4oSM4uTzlm-R6vZV1TRouqK56mDT8grw9g7T563CV5ceiskZhQJHQDcvD17Sdjqq9vuPyJwoBUn60BqzB_81Paew6sWg'
  },
];

export function SearchModal() {
  const { isOpen, closeSearch } = useSearchUIStore();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setSearchValue('');
    closeSearch();
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

  const handleProductClick = (id: number) => {
    router.push(`/product/${id}`);
    closeSearch();
  };

  const filteredProducts = searchValue 
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(searchValue.toLowerCase()))
    : PRODUCTS;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div 
          key="search-modal-container"
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16"
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
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-2xl bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-8rem)] mb-8"
          >
            {/* Search Input Area */}
            <div className="flex items-center px-3 sm:px-6 py-4 border-b border-border shrink-0">
              <span className="material-symbols-outlined text-muted-foreground mr-4">search</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search instruments..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/50 h-8"
              />
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-muted rounded-full transition-colors ml-3 outline-none border-none cursor-pointer text-muted-foreground flex items-center justify-center h-9 w-9 shrink-0 bg-transparent"
              >
                <span className="material-symbols-outlined font-normal text-xl">close</span>
              </button>
            </div>

            {/* Scrollable content area — scrollbar hidden */}
            <div className="overflow-y-auto flex-1 p-6 scrollbar-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* Recently Viewed Section */}
              {!searchValue && (
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Recently viewed</h3>
                    <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-(--primary) transition-colors border-none bg-transparent cursor-pointer">Clear</button>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2 snap-x">
                    {PRODUCTS.slice(0, 4).map((product) => (
                      <div 
                        key={`recent-${product.id}`}
                        onClick={() => handleProductClick(product.id)}
                        className="shrink-0 w-40 group cursor-pointer snap-start"
                      >
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4 border border-border/40 relative">
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                          />
                        </div>
                        <h4 className="text-[11px] font-bold uppercase tracking-tight text-foreground truncate mb-1 group-hover:text-(--primary) transition-colors">{product.name}</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-foreground">{product.price.toLocaleString()} EGP</span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-muted-foreground line-through opacity-60 font-light">{product.originalPrice.toLocaleString()} EGP</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
                  {searchValue ? `Results for &quot;${searchValue}&quot;` : 'Recommended Products'}
                </h3>
                <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2 snap-x">
                  {filteredProducts.map((product) => (
                    <div 
                      key={`prod-${product.id}`}
                      onClick={() => handleProductClick(product.id)}
                      className="shrink-0 w-40 group cursor-pointer snap-start"
                    >
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4 border border-border/40 relative">
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                        />
                      </div>
                      <h4 className="text-[11px] font-bold uppercase tracking-tight text-foreground truncate mb-1 group-hover:text-(--primary) transition-colors">{product.name}</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-foreground">{product.price.toLocaleString()} EGP</span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-muted-foreground line-through opacity-60 font-light">{product.originalPrice.toLocaleString()} EGP</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {searchValue && filteredProducts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <span className="material-symbols-outlined text-4xl text-muted-foreground/30 mb-4 font-normal">search_off</span>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">No instruments found</p>
                    <p className="text-xs text-muted-foreground/60 mt-2 font-light">Try searching for something else</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer tip */}
            {!searchValue && (
              <div className="hidden sm:flex bg-muted/30 px-6 py-4 border-t border-border items-center justify-between shrink-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Try &quot;Stethoscope&quot; or &quot;Scalpel&quot;</p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Press</span>
                  <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[9px] font-bold text-muted-foreground shadow-sm">ESC</kbd>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">to close</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
