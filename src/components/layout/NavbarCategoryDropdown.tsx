'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

import { Category, Dictionary } from '@/types/store';

export function NavbarCategoryDropdown({ categories, dict, language }: { categories: Category[], dict: Dictionary, language: 'en' | 'ar' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors border-none p-0 h-auto hover:bg-transparent"
      >
        {dict.common.categories} <ChevronDown className={`size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full inset-s-0 mt-2 w-48 bg-white border border-slate-100 rounded-[var(--radius)] shadow-xl p-2 z-50"
          >
            <Link 
              href="/products" 
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-slate-50 rounded-[var(--radius)]"
            >
              {dict.common.allProducts}
            </Link>
            {categories.map((cat, idx) => (
              <Link 
                key={cat.id || idx}
                href={`/products?category=${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-slate-50 rounded-[var(--radius)]"
              >
                {language === 'ar' && cat.nameAr ? cat.nameAr : cat.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
