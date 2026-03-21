'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Button } from '@/components/ui/button';

interface ProductGalleryProps {
  images: { url: string; isPrimary?: boolean }[];
  productName: string;
  stock: number;
}

export function ProductGallery({ images, productName, stock }: ProductGalleryProps) {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  // Find primary image for default state
  const primaryImage = images.find(img => img.isPrimary)?.url || images[0]?.url || '';
  const [activeImage, setActiveImage] = useState(primaryImage);

  return (
    <div className="space-y-4">
      {/* Main Image View */}
      <div className="bg-white p-4 border border-slate-200 rounded-[var(--radius)] relative overflow-hidden group">
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
                src={activeImage} 
                alt={productName}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>

          {/* Sold Out Overlay */}
          {stock <= 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-20 flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-black px-8 py-3 rounded-[calc(var(--radius)*0.6)] uppercase tracking-[0.3em] shadow-xl">
                {isRtl ? 'نفذت الكمية' : 'Sold Out'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails Selection Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {images.map((img, i) => (
          <Button
            key={i}
            variant="ghost"
            size="icon"
            onClick={() => setActiveImage(img.url)}
            className={bcn(
              "aspect-square size-auto bg-white p-2 border rounded-[var(--radius)] transition-all relative overflow-hidden",
              activeImage === img.url 
                ? "border-primary ring-2 ring-primary/10" 
                : "border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300"
            )}
            aria-label={`View image ${i + 1}`}
          >
            <Image 
              src={img.url} 
              fill 
              sizes="100px"
              className="object-cover rounded-[var(--radius)] px-1 py-1" 
              alt={`${productName} thumbnail ${i + 1}`} 
            />
          </Button>
        ))}
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
