'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartUIStore } from '@/store/useCartUIStore';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const PRODUCT_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDjfv7G5fB1b67d_rspMIn-69RhN059Gi6WjIYTn7TxI_cPAgk7y49cizr4mOg_wlViFz3Fc3t1GVgzKtowHTzxVojxJTZILrh1lBPj8PSV5h63CQkQROBxjZGANA5JTGuk2Laxz3Tnnq6Qk-qYlEUfCEd9moCAl9ZpJQ5nju7EcePK80g8Cc0H0kfhghejA9Kvbdi-5p3fX0OG_83R4mFtsjjWr--vpXbrbumS1GLz77Y0gCwEAoLjhm-M7i0NQiLaiWpgA9YhpQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAm3Q254URwI5REW26h4-Gh1Vott1ZgaLdOTW51ATeiemjt1ZLxDgFtUAMMjprTahK_5r3db5tuV46EHqOCgzMAqGFzcrsG_PBQOCqYaB53FIvnLzryVEyDPqAdOlwuQjrCufGF2iq-MrNNxwaXjnvVecl3SLO5tD3GJwWyI-Awn2FdLatD1t9UQ22HssgvwhqGAQUQTKIvKxE7Nc4LHiB_3DY2JzYPz79Xth45ASf47ndEzr3rkq0N6piuQqNQG9Oh44AgvUjjOg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDLK_9FkjlJgeKq2ltXMM1PO-nQpEVr1AzR65Mj89L2QhJkZ5B5YEMeqWRuVFFzjuL-u_os48E-K0DQvMK7Np8ks5IzTWgRhgq6F7cvCxKZeh5N6iHkF4qlGxckSO8lKxPU8SG1pi6Ar7-jTwHZVVuYZ7ZAL6j50TfXA5kGZWDl5wgxNgn9u9UYzWHPqmgiwzMFBGIc33qBkI7e-s3IqS4KYPIWjc7PQx6cgUwz6CA15r2d_3kc5ZSACAUieLYR8v7eSObCLX4PGQ'
];

const RELATED_PRODUCTS = [
  { name: 'Precision Scalpel', price: '1,890', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKVd8MH2HFNM5Jiq53iKbYwSos9ZqxTB3BCnn02hWGsiq2hdnRumXCtQ08Ki7X5iFc-YXTw-nZirWI5GMKKbDHb47vSOSlESml0D8VAOfHOtg-glW3GAKvB3BCL2f7ZMEPzJA3Rc_xgR3sA_hGAS8LgwttyViSz69yVoe5d13bLWpuYSSFkobUAZp-9gTtRnr5XXenJGKVRg_iYFj4Jw-ynbfiEnibVrPulixV7m39BVAx0W17rMLsADC1DgsmF5yeoaq9dA0BMg' },
  { name: 'Digital Monitor', price: '6,750', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBtXqfiIuOASxsjtC1c9Qq3SafTDjPa23wCVCIAmkl_5vY36KQ8vgzgjVQ-6s8oS1KmMHRWHXbYyyZcWwtcizRVGF0d4V3tr-Q60r581ToMbKg-IeSRn830OJAEjIG4OeLmuGqzqKMRwCctWyUyid8S67AGOuBRu4DQdMNn1pvJtGKZqbAkQWSh8cSGO2HPLWYWVITCd_uObN53_WHFR189T2SWkjSTTnK9Ua_fprfsCDH6i_t1qhQGmg5n9zKtt497TW1scnHKw' },
  { name: 'Emergency Kit', price: '12,400', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtkcaYxxo7jsdRTcQ1xFU8dLnpoVIYD_uLN1FpAVWlcZPQ5jz11S2fQUTNvsk417wDiprrtdDiWkKRuCk-OVZmDN78ZVDywCin2BistP5UELelrIqtHaC6tgoDCLoMYy-7Nna2B7P66bul-gZzd2MkHkza071bNBWIjAZLBHHNBDPHlI4oSM4uTzlm-R6vZV1TRouqK56mDT8grw9g7T563CV5ceiskZhQJHQDcvD17Sdjqq9vuPyJwoBUn60BqzB_81Paew6sWg' },
  { name: 'ENT Set Pro', price: '8,150', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1yzKL1O75DFGPLS0q7tt-3-RMQt9Hz2x-kQhTjTqeY91GY0wC7WL0bGRQCi_-u7l6izsTU9wPIsdQ37B9R9c1fL17E4m8YqTIw2gLjmFGsu6IChuUPgZeGg12o4S91WFrPInEnMkn4z5BsmRHDmyuwfwkRPmbQ-EIVqEHxMQSCpqUoN7b6MPlSjYL8Rq2j_BNKO5PdZ_wNOOEYuMfCd-zZfkZ5L395dSQRTb9UnILy_RXjg5qg51rLVfwY4h4Y6027PXYMBYDFg' }
];

export default function ProductDetailsPage() {
  const { openCart } = useCartUIStore();
  const [activeImage, setActiveImage] = useState(PRODUCT_IMAGES[0]);

  return (
    <div className="bg-background text-foreground font-display min-h-screen">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
          <Link href="/" className="hover:text-(--primary) transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[10px] sm:text-xs font-normal">chevron_right</span>
          <Link href="/products" className="hover:text-(--primary) transition-colors">Diagnostics</Link>
          <span className="material-symbols-outlined text-[10px] sm:text-xs font-normal">chevron_right</span>
          <span className="text-foreground font-medium">Classic Stethoscope III</span>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Side: Product Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-background p-4 border border-border rounded-sm">
              <div className="w-full aspect-4/3 bg-center bg-no-repeat bg-cover transition-all duration-700" style={{ backgroundImage: `url('${activeImage}')` }}></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {PRODUCT_IMAGES.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`bg-background p-2 sm:p-4 border rounded-sm transition-all cursor-pointer ${activeImage === img ? 'border-(--primary) opacity-100 scale-102 shadow-sm' : 'border-border opacity-70 hover:opacity-100'}`}
                >
                  <div className="w-full aspect-square bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url('${img}')` }}></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Side: Product Details */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-[#E11D48] text-background rounded-(--radius) shadow-lg">
                🔥 Hot Now
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-2 uppercase tracking-tight">Classic Stethoscope III</h1>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-lg! font-normal">star</span>
                ))}
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">(1,248 reviews)</span>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-black text-foreground">4,250 EGP</span>
                <span className="text-lg sm:text-xl text-muted-foreground line-through font-light opacity-60">4,900 EGP</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-lg font-normal">verified</span>
                <span>In Stock — Ships in 24h</span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8 font-light text-base lg:text-lg">
              Engineered for clinical excellence. The Classic Stethoscope III features high acoustic sensitivity for performing general physical assessments. It features dual tunable diaphragms and an updated design that is easier to clean and maintain.
            </p>
            
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                <div className="bg-background border border-border rounded-sm flex items-center overflow-hidden h-14 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
                  <button className="px-5 hover:bg-muted transition-colors flex items-center justify-center outline-none border-none cursor-pointer h-full">
                    <span className="material-symbols-outlined text-sm font-normal">remove</span>
                  </button>
                  <span className="px-6 font-bold text-foreground min-w-14 text-center border-x border-border h-full flex items-center justify-center">1</span>
                  <button className="px-5 hover:bg-muted transition-colors flex items-center justify-center outline-none border-none cursor-pointer h-full">
                    <span className="material-symbols-outlined text-sm font-normal">add</span>
                  </button>
                </div>
                <button 
                  onClick={openCart} 
                  className="flex-1 w-full bg-foreground hover:bg-foreground/90 text-background font-bold h-14 text-sm uppercase tracking-widest shadow-xl transition-all transform active:scale-95 rounded-sm outline-none border-none cursor-pointer flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined text-xl">shopping_cart</span>
                  Add to Cart
                </button>
              </div>
            </div>
            
            {/* Accordion Section */}
            <div className="space-y-0 divide-y divide-border border-y border-border">
              <details className="group py-5 cursor-pointer">
                <summary className="flex w-full items-center justify-between text-left font-bold uppercase tracking-wider h-6 list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-sm">Specifications</span>
                  <span className="material-symbols-outlined font-normal text-muted-foreground group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="mt-6 text-sm text-muted-foreground space-y-3 font-light">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="font-semibold text-foreground uppercase text-[10px] tracking-widest">Acoustic Performance</span>
                    <span>Level 9/10 Precision</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="font-semibold text-foreground uppercase text-[10px] tracking-widest">Diaphragm Material</span>
                    <span>Epoxy/Fiberglass</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="font-semibold text-foreground uppercase text-[10px] tracking-widest">Weight</span>
                    <span>150 Grams</span>
                  </div>
                </div>
              </details>
              <details className="group py-5 cursor-pointer">
                <summary className="flex w-full items-center justify-between text-left font-bold uppercase tracking-wider h-6 list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-sm">Shipping &amp; Returns</span>
                  <span className="material-symbols-outlined font-normal text-muted-foreground group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="mt-6 text-sm text-muted-foreground font-light">
                  Free standard shipping on all orders over 5,000 EGP. 14-day hassle-free returns for clinical products.
                </div>
              </details>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-sm bg-muted/30 border border-border">
                <span className="material-symbols-outlined text-(--primary) font-normal">verified_user</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Clinical Grade Certified</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-sm bg-muted/30 border border-border">
                <span className="material-symbols-outlined text-(--primary) font-normal">history_edu</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Acoustics Warranty</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <section className="mt-16 lg:mt-32">
          <div className="flex items-center justify-between mb-12 border-b border-border pb-6">
            <h2 className="text-xl lg:text-3xl font-black uppercase tracking-tight">Complete Your Kit</h2>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex gap-2">
                <button className="related-prev w-9 h-9 border border-navy/20 flex items-center justify-center hover:bg-navy hover:text-background transition-colors rounded-(--radius) text-navy bg-transparent outline-none cursor-pointer">
                  <span className="material-symbols-outlined font-normal text-lg">chevron_left</span>
                </button>
                <button className="related-next w-9 h-9 border border-navy/20 flex items-center justify-center hover:bg-navy hover:text-background transition-colors rounded-(--radius) text-navy bg-transparent outline-none cursor-pointer">
                  <span className="material-symbols-outlined font-normal text-lg">chevron_right</span>
                </button>
              </div>
              <Link href="/products" className="text-[10px] font-bold uppercase tracking-widest hover:text-(--primary) transition-colors flex items-center gap-2">
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
          
          <Swiper
            modules={[Navigation, FreeMode]}
            navigation={{
              prevEl: '.related-prev',
              nextEl: '.related-next',
            }}
            grabCursor={true}
            freeMode={true}
            slidesPerView={1.2}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 2.2, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 30 },
            }}
            className="w-full"
          >
            {RELATED_PRODUCTS.map((p, i) => (
              <SwiperSlide key={i}>
                <div className="group cursor-pointer h-full">
                  <div className="aspect-square mb-6 bg-muted overflow-hidden rounded-sm relative">
                    <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" style={{ backgroundImage: `url('${p.img}')` }}></div>
                  </div>
                  <h3 className="font-black text-xs sm:text-sm mb-1 text-foreground uppercase tracking-tight group-hover:text-(--primary) transition-colors truncate">{p.name}</h3>
                  <p className="text-foreground font-black text-sm sm:text-base">{p.price} EGP</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </main>
    </div>
  );
}
