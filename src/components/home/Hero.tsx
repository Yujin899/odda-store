'use client';

import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';

export function Hero() {
  const [hero, setHero] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguageStore();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.hero) {
          setHero(data.hero);
        }
      })
      .catch(err => console.error('Hero fetch error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="relative h-[80vh] w-full bg-slate-50 animate-pulse flex items-center justify-center">
        <Loader2 className="size-10 text-(--primary) animate-spin" />
      </section>
    );
  }

  // Fallback defaults if no data exists
  const heroData = {
    image: hero?.image || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop",
    heading: (language === 'ar' && hero?.headingAr) ? hero.headingAr : (hero?.heading || "Precision Clinical Instruments"),
    buttonText: (language === 'ar' && hero?.buttonTextAr) ? hero.buttonTextAr : (hero?.buttonText || "Shop Collection"),
    buttonLink: hero?.buttonLink || "/products"
  };

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={heroData.image} 
          alt="Odda Hero" 
          fill 
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-brightness-[0.85]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          {heroData.heading}
        </h1>

        <div className="animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <Link href={heroData.buttonLink}>
            <button className="px-10 py-4 mt-4 border-2 border-white text-white bg-transparent hover:bg-white hover:text-navy transition-all duration-300 ease-in-out font-black uppercase tracking-[0.2em] text-[10px] rounded-sm flex items-center gap-2 group cursor-pointer outline-none shadow-2xl">
              {heroData.buttonText}
              <ArrowRight className="size-4 rtl:-scale-x-100 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
