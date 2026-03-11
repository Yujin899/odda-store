'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartUIStore } from '@/store/useCartUIStore';

const PRODUCTS = [
  {
    id: 1,
    name: 'Classic Stethoscope III',
    category: 'Diagnostic Tools',
    price: 4250,
    originalPrice: 4900,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjfv7G5fB1b67d_rspMIn-69RhN059Gi6WjIYTn7TxI_cPAgk7y49cizr4mOg_wlViFz3Fc3t1GVgzKtowHTzxVojxJTZILrh1lBPj8PSV5h63CQkQROBxjZGANA5JTGuk2Laxz3Tnnq6Qk-qYlEUfCEd9moCAl9ZpJQ5nju7EcePK80g8Cc0H0kfhghejA9Kvbdi-5p3fX0OG_83R4mFtsjjWr--vpXbrbumS1GLz77Y0gCwEAoLjhm-M7i0NQiLaiWpgA9YhpQ',
    badge: 'New'
  },
  {
    id: 2,
    name: 'Precision Scalpel Set',
    category: 'Surgical Tools',
    price: 1890,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKVd8MH2HFNM5Jiq53iKbYwSos9ZqxTB3BCnn02hWGsiq2hdnRumXCtQ08Ki7X5iFc-YXTw-nZirWI5GMKKbDHb47vSOSlESml0D8VAOfHOtg-glW3GAKvB3BCL2f7ZMEPzJA3Rc_xgR3sA_hGAS8LgwttyViSz69yVoe5d13bLWpuYSSFkobUAZp-9gTtRnr5XXenJGKVRg_iYFj4Jw-ynbfiEnibVrPulixV7m39BVAx0W17rMLsADC1DgsmF5yeoaq9dA0BMg',
    badge: '🔥 Hot Now'
  },
  {
    id: 3,
    name: 'Digital Monitor Pro',
    category: 'Diagnostic Tools',
    price: 6750,
    originalPrice: 7900,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBtXqfiIuOASxsjtC1c9Qq3SafTDjPa23wCVCIAmkl_5vY36KQ8vgzgjVQ-6s8oS1KmMHRWHXbYyyZcWwtcizRVGF0d4V3tr-Q60r581ToMbKg-IeSRn830OJAEjIG4OeLmuGqzqKMRwCctWyUyid8S67AGOuBRu4DQdMNn1pvJtGKZqbAkQWSh8cSGO2HPLWYWVITCd_uObN53_WHFR189T2SWkjSTTnK9Ua_fprfsCDH6i_t1qhQGmg5n9zKtt497TW1scnHKw',
    badge: 'Sale -15%'
  },
  {
    id: 4,
    name: 'Emergency Kit Platinum',
    category: 'Medical Kits',
    price: 12400,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtkcaYxxo7jsdRTcQ1xFU8dLnpoVIYD_uLN1FpAVWlcZPQ5jz11S2fQUTNvsk417wDiprrtdDiWkKRuCk-OVZmDN78ZVDywCin2BistP5UELelrIqtHaC6tgoDCLoMYy-7Nna2B7P66bul-gZzd2MkHkza071bNBWIjAZLBHHNBDPHlI4oSM4uTzlm-R6vZV1TRouqK56mDT8grw9g7T563CV5ceiskZhQJHQDcvD17Sdjqq9vuPyJwoBUn60BqzB_81Paew6sWg'
  },
  {
    id: 5,
    name: 'ENT Diagnostic Set',
    category: 'Diagnostics',
    price: 8150,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1yzKL1O75DFGPLS0q7tt-3-RMQt9Hz2x-kQhTjTqeY91GY0wC7WL0bGRQCi_-u7l6izsTU9wPIsdQ37B9R9c1fL17E4m8YqTIw2gLjmFGsu6IChuUPgZeGg12o4S91WFrPInEnMkn4z5BsmRHDmyuwfwkRPmbQ-EIVqEHxMQSCpqUoN7b6MPlSjYL8Rq2j_BNKO5PdZ_wNOOEYuMfCd-zZfkZ5L395dSQRTb9UnILy_RXjg5qg51rLVfwY4h4Y6027PXYMBYDFg'
  },
  {
    id: 6,
    name: 'Titanium Forceps Set',
    category: 'Surgery',
    price: 3200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO9AnlrHZ-Gtr6_PwUVH69nP3hTipfpT05I0SsEt0Rvm1hOjkqpGNYO9V_yMAxvHTofWiWdZE6LbRSQSR4UABbafqNmTUyv9YdC0UAa8Yb2iPEmanI46MSuVT3T6cITJy3dqnuce75nNFCq-8i4CRYNMzemXvsg9cgKUscIBycruKpPsb6PkJfOisdYH0eeEbZs-TOn1EV-bz_3dlT4aYHPlfq3j4JD2y5UVEw3nvMCyRk1x9S0gzR5hxS1k7MM_O5fNTnEi4Iww'
  },
  {
    id: 7,
    name: 'Portable O2 Conc.',
    category: 'Specialized',
    price: 14900,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9c_Gq9U0cgl7QOUuDQAPOKRRSaoVGFSvwuEiEZ22WmlxpGhyId2x0bobfOgcyvGXWO21WbGoOBVdrgGvuJlMEpd4o5IM3Sp0fdUptUvIoueTSlNo5AB62BBskSvdMKSfdZ45PR73kqx8I1CpcY7P0RtMqyujgmCCDU00_OJUOkynxLNnsRvkm4nvdwgIe1pz5tTUHpZGG0rX4iN4_5IdBwiynR_9IkcWsAtAAub0UzpruWxwkRm0AycgVyrg7BQuuyAkwB-ja1g'
  },
  {
    id: 8,
    name: 'Instrument Tray XL',
    category: 'Accessories',
    price: 950,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfuig3VhxU5XorBOfWK8tdkVO-0nlFWYR4Z9y3v3D0CrRxeQdchYoE-cG11iIfsyVq_f1wFVKRdDv16IGVu9fE5c6W9WkHSQRpXmB2CQBAj_-eOrP9vKagkkvqrjBwhIuoT43dgS-moM4o6mF7EUh1kRW7r8yRFeIsok6qMfg-ilwV_xa-UkTqrzcCmA0-A7B7gC5NbV1Ncnaq4FOc5DfSUdvRLRmFSP3siXKAMKt5IzIw7KUguoXLQ2LSBzEXoi_hQTbExlILTQ'
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const { openCart } = useCartUIStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCart();
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[var(--background)]">
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 py-12">
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-4">
            <Link href="/" className="hover:text-(--primary) transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs font-normal">chevron_right</span>
            <span className="text-[var(--foreground)] font-medium">All Instruments</span>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">All Instruments</h1>
          <p className="mt-2 text-[var(--muted-foreground)] max-w-2xl font-light">High-precision clinical tools and diagnostic sets engineered for excellence in modern healthcare environments.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-28 space-y-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-[var(--primary)]/10 border border-primary/20 text-[var(--primary)] cursor-pointer transition-all rounded-sm">
                    <span className="material-symbols-outlined font-normal">stethoscope</span>
                    <span className="text-sm font-semibold">Diagnostics</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 hover:bg-[var(--muted)] border border-transparent cursor-pointer transition-all rounded-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                    <span className="material-symbols-outlined font-normal">ecg_heart</span>
                    <span className="text-sm font-medium">Surgery</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 hover:bg-[var(--muted)] border border-transparent cursor-pointer transition-all rounded-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                    <span className="material-symbols-outlined font-normal">medical_services</span>
                    <span className="text-sm font-medium">Kits</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-6">Price Range (EGP)</h3>
                <div className="px-2">
                  <div className="relative h-1.5 w-full bg-[var(--border)] rounded-full">
                    <div className="absolute left-1/4 right-1/4 h-full bg-[var(--primary)] rounded-full"></div>
                    <div className="absolute left-1/4 -top-2 w-5 h-5 bg-[var(--background)] border-2 border-primary rounded-full shadow-sm cursor-pointer"></div>
                    <div className="absolute right-1/4 -top-2 w-5 h-5 bg-[var(--background)] border-2 border-primary rounded-full shadow-sm cursor-pointer"></div>
                  </div>
                  <div className="flex justify-between mt-4 text-xs font-bold text-[var(--muted-foreground)]">
                    <span>500 EGP</span>
                    <span>15,000 EGP</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-3 bg-[var(--primary)] text-[var(--background)] font-bold hover:bg-[var(--primary)]/90 transition-all shadow-lg shadow-[var(--primary)]/20 flex items-center justify-center gap-2 rounded-sm border-none outline-none cursor-pointer">
                <span>Apply Filters</span>
                <span className="material-symbols-outlined text-sm font-normal">filter_alt</span>
              </button>
            </div>
          </aside>
          
          {/* Product Grid */}
          <section className="flex-1">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
              {PRODUCTS.map((product) => (
                <div 
                  key={product.id}
                  className="group bg-background border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-sm cursor-pointer flex flex-col h-full" 
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <div className="aspect-square relative overflow-hidden bg-muted rounded-none rounded-t-sm">
                    <img loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-sm grayscale group-hover:grayscale-0" alt={product.name} src={product.image}/>
                    {product.badge && (
                      <span className={`absolute top-3 left-3 text-background text-[10px] font-bold px-2.5 py-1 rounded-(--radius) uppercase tracking-widest z-10 shadow-lg ${product.badge.includes('Hot') ? 'bg-[#E11D48]' : product.badge.includes('Sale') ? 'bg-[var(--danger)]' : 'bg-(--primary)'}`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors uppercase tracking-tight text-lg mb-1 truncate">{product.name}</h4>
                    <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-4 font-light">{product.category}</p>
                    <div className="mt-auto">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-lg font-black text-[var(--foreground)]">{product.price.toLocaleString()} EGP</span>
                        {product.originalPrice && (
                          <span className="text-sm text-[var(--muted-foreground)] line-through opacity-70 font-light">{product.originalPrice.toLocaleString()} EGP</span>
                        )}
                      </div>
                      <button 
                        onClick={handleAddToCart}
                        className="w-full py-3 bg-[var(--muted)] hover:bg-[var(--primary)] hover:text-[var(--background)] transition-all rounded-sm flex items-center justify-center gap-2 border-none outline-none cursor-pointer text-xs font-bold uppercase tracking-widest"
                      >
                        <span className="material-symbols-outlined text-sm font-normal">add_shopping_cart</span>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-1">
                <button className="w-10 h-10 flex items-center justify-center border border-[var(--border)] hover:bg-[var(--muted)] transition-colors rounded-sm text-[var(--muted-foreground)] bg-transparent outline-none cursor-pointer">
                  <span className="material-symbols-outlined font-normal">chevron_left</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-[var(--primary)] text-[var(--background)] font-bold rounded-sm border-none outline-none cursor-pointer">1</button>
                <button className="w-10 h-10 flex items-center justify-center border border-transparent hover:border-border hover:bg-muted transition-colors font-medium rounded-sm text-muted-foreground bg-transparent outline-none cursor-pointer">2</button>
                <button className="w-10 h-10 flex items-center justify-center border border-transparent hover:border-border hover:bg-muted transition-colors font-medium rounded-sm text-muted-foreground bg-transparent outline-none cursor-pointer">3</button>
                <span className="mx-2 text-[var(--muted-foreground)]">...</span>
                <button className="w-10 h-10 flex items-center justify-center border border-transparent hover:border-border hover:bg-muted transition-colors font-medium rounded-sm text-muted-foreground bg-transparent outline-none cursor-pointer">12</button>
                <button className="w-10 h-10 flex items-center justify-center border border-border hover:bg-muted transition-colors rounded-sm text-muted-foreground bg-transparent outline-none cursor-pointer">
                  <span className="material-symbols-outlined font-normal">chevron_right</span>
                </button>
              </nav>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
