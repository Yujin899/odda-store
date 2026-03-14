'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { IBundle } from '@/models/Bundle';

interface BundleCardProps {
  bundle: IBundle;
  locale: string;
  dict: any;
}

export function BundleCard({ bundle, locale, dict }: BundleCardProps) {
  const name = (locale === 'ar' && bundle.nameAr) ? bundle.nameAr : bundle.name;
  const items = (locale === 'ar' && bundle.bundleItemsAr && bundle.bundleItemsAr.length > 0) 
    ? bundle.bundleItemsAr 
    : bundle.bundleItems;

  return (
    <div 
      className="group relative bg-white border border-slate-200/60 rounded-(--radius) overflow-hidden flex flex-col hover:shadow-[0_20px_50px_rgba(0,115,230,0.12)] transition-all duration-700 hover:-translate-y-2"
    >
      {/* Image Section with bottom vignette */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <Image 
          src={bundle.images[0] || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop'} 
          alt={name}
          fill
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />
        
        {/* Bottom Vignette for depth */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-60 pointer-events-none" />

        {/* Premium Bundle Badge - Glassmorphism */}
        <div className="absolute top-5 right-5 z-10">
          <div className="backdrop-blur-md bg-white/20 border border-white/30 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-2xl flex items-center gap-2.5">
            <div className="relative">
              <ShoppingBag className="size-3 relative z-10" />
              <div className="absolute inset-0 bg-white blur-sm opacity-50 scale-150 animate-pulse" />
            </div>
            {dict.home.bundleAndSave}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 grow flex flex-col relative bg-gradient-to-b from-white to-slate-50/30">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        
        <div className="mb-6">
          <h3 className="text-xl font-bold text-(--navy) mb-2 line-clamp-2 tracking-tight leading-snug group-hover:text-(--primary) transition-colors duration-300">
            {name}
          </h3>
          <div className="w-12 h-1 bg-(--primary) rounded-full transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100" />
        </div>

        {/* Bundle Items List */}
        <div className="space-y-4 mb-10 grow">
          {items?.slice(0, 4).map((item: string, idx: number) => (
            <div key={idx} className={`flex items-start gap-3.5 ${locale === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <div className="mt-1 flex items-center justify-center bg-white shadow-sm border border-slate-100 p-1 rounded-full group-hover:bg-(--primary) group-hover:border-(--primary) transition-all duration-300">
                <CheckCircle2 className="size-2.5 text-(--primary) group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs text-slate-500 font-semibold leading-relaxed tracking-wide group-hover:text-slate-700 transition-colors">{item}</span>
            </div>
          ))}
        </div>

        {/* Price & Footer */}
        <div className={`pt-8 border-t border-slate-200/60 flex items-center justify-between ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="flex flex-col gap-0.5">
            {bundle.compareAtPrice && (
              <span className="text-xs text-slate-300 line-through font-bold tracking-tighter">
                {bundle.compareAtPrice} {dict.common.egp}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-(--navy) group-hover:text-(--primary) transition-colors duration-300">
                {bundle.price}
              </span>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{dict.common.egp}</span>
            </div>
          </div>

          <Link 
            href={`/bundle/${bundle.slug}`}
            className="relative overflow-hidden group/btn inline-flex items-center justify-center px-6 py-4 rounded-(--radius) bg-(--navy) text-white hover:bg-(--primary) transition-all duration-500 shadow-xl shadow-slate-200 hover:shadow-(--primary)/30"
          >
            <span className="relative z-10 flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">{locale === 'ar' ? 'عرض التفاصيل' : 'Details'}</span>
               <ArrowRight className={`size-4 transition-transform group-hover/btn:translate-x-1.5 ${locale === 'ar' ? 'rotate-180 group-hover/btn:-translate-x-1.5' : ''}`} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
