'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

interface BundleGalleryProps {
  images: string[];
  bundleName: string;
  stock: number;
}

export function BundleGallery({ images, bundleName, stock }: BundleGalleryProps) {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const isRtl = language === 'ar';

  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main Image View */}
      <div className="bg-white p-4 border border-slate-200 rounded-(--radius) relative overflow-hidden group">
        <div className="w-full aspect-square relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image 
                src={activeImage || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop'} 
                alt={bundleName}
                fill
                priority
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>

          {/* Sold Out Overlay */}
          {stock <= 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-20 flex items-center justify-center">
              <span className="bg-foreground text-background text-xs font-black px-8 py-3 rounded-(--radius) uppercase tracking-[0.3em] shadow-2xl">
                {isRtl ? 'نفذت الكمية' : 'Sold Out'}
              </span>
            </div>
          )}

          {/* Bundle Badge */}
          <div className="absolute top-6 inset-e-6 z-10 flex justify-end">
            <div className="bg-(--primary) text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl shadow-(--primary)/30 flex items-center gap-2">
              <ShoppingBag className="size-4" />
              {dict.home.bundleAndSave}
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails Selection Grid */}
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={bcn(
                "aspect-square bg-white p-2 border rounded-(--radius) cursor-pointer transition-all relative overflow-hidden outline-none",
                activeImage === img 
                  ? "border-(--primary) shadow-md ring-2 ring-(--primary)/10" 
                  : "border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300"
              )}
              aria-label={`View bundle image ${i + 1}`}
            >
              <Image 
                src={img} 
                fill 
                className="object-cover rounded-sm px-2 py-2" 
                alt={`${bundleName} thumbnail ${i + 1}`} 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
