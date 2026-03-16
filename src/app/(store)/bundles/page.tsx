import { connectDB } from '@/lib/mongodb';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'عروض المجموعات الطلابية | عُدّة (عدة)',
  description: 'وفر أكثر مع مجموعات عُدّة المتكاملة. Save more with Odda bundled kits for dental students.',
};
import { Bundle, IBundle } from '@/models/Bundle';
import { cookies } from 'next/headers';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { BundleCard } from '@/components/bundles/BundleCard';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';

import { unstable_cache } from 'next/cache';
import type { BundleDoc } from '@/types/models';

async function getAllBundles() {
  return unstable_cache(
    async () => {
      await connectDB();
      const bundles = await Bundle.find({ 
        $or: [
          { stock: { $gt: 0 } },
          { stock: { $exists: false } }
        ] 
      })
        .sort({ createdAt: -1 })
        .lean<BundleDoc[]>();
        
      // Strict DTO Mapping
      return bundles.map((b) => ({
        _id: b._id.toString(), // Keep _id for component keys
        name: b.name,
        nameAr: b.nameAr,
        slug: b.slug,
        price: b.price,
        compareAtPrice: b.compareAtPrice,
        images: b.images,
        stock: b.stock,
        featured: b.featured,
        bundleItems: b.bundleItems || [],
        bundleItemsAr: b.bundleItemsAr || [],
        averageRating: b.averageRating || 0,
        numReviews: b.numReviews || 0
      }));
    },
    ['bundles-list'],
    { revalidate: 3600, tags: ['bundles-list'] }
  )();
}

export default async function BundlesPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = locale === 'en' ? en : ar;
  const bundles = await getAllBundles();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Hero Header */}
      <section className="relative py-24 bg-(--navy) overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 inset-e-0 w-1/2 h-full bg-linear-to-l from-(--primary)/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-s-0 w-1/2 h-full bg-linear-to-r from-(--primary)/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--primary) opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-(--primary)"></span>
            </span>
            {locale === 'ar' ? 'عروض لفترة محدودة' : 'Limited Time Offers'}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6">
            {dict.bundlesPage.title}
          </h1>
          
          <p className="text-lg text-white/60 max-w-2xl font-medium leading-relaxed mb-10">
            {dict.bundlesPage.subtitle}
          </p>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/products"
              className="px-8 py-4 rounded-(--radius) bg-white text-(--navy) font-black uppercase text-xs tracking-widest hover:bg-(--primary) hover:text-white transition-all duration-300"
            >
              {dict.common.allProducts}
            </Link>
          </div>
        </div>
      </section>

      {/* Bundles Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          {bundles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bundles.map((bundle) => (
                <BundleCard 
                  key={bundle._id}
                  bundle={bundle as unknown as IBundle} 
                  locale={locale} 
                  dict={dict} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-slate-50 p-8 rounded-full mb-8">
                <ShoppingBag className="size-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-(--navy) mb-4">
                {dict.bundlesPage.noBundles}
              </h3>
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-(--primary) hover:underline"
              >
                {locale === 'ar' ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
                {locale === 'ar' ? 'تصفح الأدوات الفردية' : 'Browse individual tools'}
                {locale === 'ar' && <ArrowRight className="size-4" />}
                {locale === 'en' && <ArrowRight className="size-4" />}
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
