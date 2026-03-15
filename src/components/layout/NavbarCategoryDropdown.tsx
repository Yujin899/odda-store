'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NavbarCategoryDropdown({ categories, dict, language }: { categories: any[], dict: any, language: 'en' | 'ar' }) {
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
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-semibold text-navy hover:text-(--primary) transition-colors border-none outline-none cursor-pointer bg-transparent"
      >
        {dict.common.categories} <ChevronDown className={`size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full inset-s-0 mt-2 w-48 bg-white border border-slate-100 rounded-sm shadow-xl p-2 z-50"
          >
            <Link 
              href="/products" 
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy hover:bg-slate-50 rounded-sm"
            >
              {dict.common.allProducts}
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat._id}
                href={`/products?category=${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy hover:bg-slate-50 rounded-sm"
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
