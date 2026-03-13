'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight,
  Check, 
  Minus, 
  Plus, 
  Truck, 
  ShieldCheck, 
  ShoppingCart,
  ShoppingBag
} from 'lucide-react';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { IBundle } from '@/models/Bundle';

export function BundlePageClient({ bundle }: { bundle: IBundle }) {
  const { openCart } = useCartUIStore();
  const { addItem } = useCartStore();
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(bundle.images?.[0]);
  
  const handleAddToCart = () => {
    addItem({
      id: String(bundle._id),
      slug: bundle.slug,
      name: bundle.name,
      nameAr: bundle.nameAr,
      price: bundle.price,
      image: bundle.images?.[0],
      type: 'bundle'
    }, quantity);
    
    openCart();
  };

  const name = (language === 'ar' && bundle.nameAr) ? bundle.nameAr : bundle.name;
  const items = (language === 'ar' && bundle.bundleItemsAr && bundle.bundleItemsAr.length > 0) 
    ? bundle.bundleItemsAr 
    : bundle.bundleItems;

  return (
    <div className="bg-background text-foreground font-sans min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hidden">
          <Link href="/" className="hover:text-(--primary) transition-colors">{dict.common.home}</Link>
          <ChevronRight className="size-4 rtl:-scale-x-100" />
          <Link href="/" className="hover:text-(--primary) transition-colors">
            {language === 'ar' ? 'العروض' : 'Bundles'}
          </Link>
          <ChevronRight className="size-4 rtl:-scale-x-100" />
          <span className="text-foreground font-medium">{name}</span>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="sticky top-28 space-y-4">
              <div className="bg-white p-4 border border-slate-200 rounded-(--radius)">
                <div className="w-full aspect-square relative overflow-hidden">
                  <Image 
                    className="object-cover transition-transform duration-1000" 
                    src={activeImage || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop'} 
                    alt={name}
                    fill
                    priority
                  />
                  {bundle.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-20 flex items-center justify-center">
                      <span className="bg-foreground text-background text-xs font-black px-8 py-3 rounded-(--radius) uppercase tracking-[0.3em] shadow-2xl">
                        {language === 'ar' ? 'نفذت الكمية' : 'Sold Out'}
                      </span>
                    </div>
                  )}
                  {/* Bundle Badge */}
                  <div className="absolute top-6 right-6 z-10">
                    <div className="bg-(--primary) text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl shadow-(--primary)/30 flex items-center gap-2">
                      <ShoppingBag className="size-4" />
                      {dict.home.bundleAndSave}
                    </div>
                  </div>
                </div>
              </div>
              
              {bundle.images && bundle.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {bundle.images.map((img: string, i: number) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveImage(img)}
                      className={`aspect-square relative bg-white p-2 border rounded-(--radius) cursor-pointer transition-all ${activeImage === img ? 'border-(--primary) shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'}`}
                    >
                      <Image src={img} fill className="object-cover rounded-sm p-2" alt="view" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side: Details */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-4">
               <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded-(--radius) bg-(--navy) shadow-sm">
                {language === 'ar' ? 'مجموعة متميزة' : 'Premium Bundle'}
              </span>
            </div>
            
            <h1 className="text-4xl font-extrabold text-foreground mb-4 uppercase tracking-tight">{name}</h1>
            

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-(--primary)">{bundle.price.toLocaleString()} {dict.common.egp}</span>
                {bundle.compareAtPrice && (
                  <span className="text-xl text-slate-400 line-through font-bold">{bundle.compareAtPrice.toLocaleString()} {dict.common.egp}</span>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                {bundle.stock <= 0 ? (
                  <span className="text-destructive font-bold text-sm bg-destructive/5 px-3 py-1.5 rounded-full flex items-center gap-2">
                    {language === 'ar' ? 'نفذت الكمية' : 'Sold Out'}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Truck className="size-3 mr-2" />
                    {language === 'ar' ? 'توصيل سريع مجاني' : 'Free Express Delivery'}
                  </span>
                )}
              </div>
            </div>

            {/* What's Included */}
            {items && items.length > 0 && (
              <div className="mb-10 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  {language === 'ar' ? 'ماذا يوجد في هذا الطقم؟' : 'What\'s included in this kit?'}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {items.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-(--radius) shadow-sm hover:border-(--primary)/30 transition-colors">
                      <div className="bg-(--primary)/10 p-1 rounded-full">
                        <Check className="size-3 text-(--primary) stroke-[3px]" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div dir="ltr" className="bg-white p-4 border border-slate-200 rounded-(--radius) flex items-center justify-between sm:justify-start w-full sm:w-auto shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-slate-50 transition-colors rounded-lg cursor-pointer outline-none border-none bg-transparent"
                >
                  <Minus className="size-4" />
                </button>
                <span className="px-6 font-black min-w-12 text-center text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-slate-50 transition-colors rounded-lg cursor-pointer outline-none border-none bg-transparent"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              
              <button 
                disabled={bundle.stock <= 0}
                onClick={handleAddToCart} 
                className={`flex-1 w-full font-black py-5 text-lg shadow-2xl transition-all transform active:scale-95 rounded-(--radius) uppercase tracking-widest outline-none border-none flex items-center justify-center gap-3 ${
                  bundle.stock <= 0 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-(--primary) hover:bg-(--navy) text-white shadow-(--primary)/30 cursor-pointer'
                }`}
              >
                <ShoppingCart className="size-6" />
                {dict.common.addToCart}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-(--radius) bg-white border border-slate-100 shadow-sm">
                <ShieldCheck className="text-(--primary) size-6" />
                <span className="text-[10px] font-black uppercase tracking-wider leading-tight">
                  {language === 'ar' ? 'توفير مضمون 100%' : '100% Guaranteed Savings'}
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-(--radius) bg-white border border-slate-100 shadow-sm">
                <ShoppingBag className="text-(--primary) size-6" />
                <span className="text-[10px] font-black uppercase tracking-wider leading-tight">
                  {language === 'ar' ? 'أدوات سريرية معتمدة' : 'Clinical Grade Instruments'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
