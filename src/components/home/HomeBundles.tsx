import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Bundle, IBundle } from '@/models/Bundle';
import { cookies } from 'next/headers';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { BundleCard } from '@/components/bundles/BundleCard';

async function getBundles() {
  await connectDB();
  const bundles = await Bundle.find({ 
    $or: [
      { stock: { $gt: 0 } },
      { stock: { $exists: false } }
    ] 
  })
    .limit(3)
    .sort({ createdAt: -1 })
    .lean();
    
  return bundles.map((b: any) => ({
    id: b._id.toString(),
    _id: b._id.toString(), // Support components still using _id
    name: b.name,
    nameAr: b.nameAr ?? null,
    slug: b.slug,
    description: b.description ?? null,
    descriptionAr: b.descriptionAr ?? null,
    price: b.price,
    originalPrice: b.compareAtPrice ?? null,
    images: (b.images ?? []).map((url: string) => url),
    stock: b.stock ?? 0,
    featured: b.featured ?? false,
    bundleItems: b.bundleItems || [],
    bundleItemsAr: b.bundleItemsAr || [],
    averageRating: b.averageRating || 0,
    numReviews: b.numReviews || 0,
    createdAt: b.createdAt?.toISOString() ?? null,
  }));
}

export default async function HomeBundles() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = locale === 'en' ? en : ar;
  const bundles = await getBundles();

  if (bundles.length === 0) return null;

  return (
    <section className="bg-white py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-2">
            <span className="text-(--primary) text-[10px] font-black uppercase tracking-[0.3em] block">
              {locale === 'ar' ? 'مجموعات حصرية' : 'Exclusive Collections'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-(--navy)">
              {dict.home.starterKits}
            </h2>
          </div>
          <Link 
            href="/bundles"
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-(--navy) hover:text-(--primary) transition-colors"
          >
            {locale === 'ar' ? 'تصفح كل العروض' : 'View All Bundles'}
            <ArrowRight className={`size-4 transition-transform group-hover:translate-x-1 ${locale === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bundles.map((bundle: IBundle, index: number) => (
            <BundleCard 
              key={bundle._id?.toString() || index}
              bundle={bundle} 
              locale={locale} 
              dict={dict} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
