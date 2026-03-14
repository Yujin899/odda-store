import Link from 'next/link';
import { 
  ShieldCheck, 
  Stethoscope, 
  Truck, 
  Lock
} from 'lucide-react';
import { Hero } from '@/components/home/Hero';
import { BestSellers } from '@/components/home/BestSellers';
import HomeBundles from '@/components/home/HomeBundles';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import Category from '@/models/Category';
import Badge from '@/models/Badge';
import { StoreSettings } from '@/models/StoreSettings';
import { cookies } from 'next/headers';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every minute

async function getFeaturedProducts() {
  await connectDB();
  // Register models for population
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  Category;
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  Badge;
  
  const products = await Product.find({ featured: true })
    .populate({ path: 'categoryId', strictPopulate: false })
    .populate({ path: 'badgeId', strictPopulate: false })
    .limit(8)
    .lean();
    
  return JSON.parse(JSON.stringify(products));
}

async function getCategories() {
  await connectDB();
  const categories = await Category.find().limit(4).lean();
  return JSON.parse(JSON.stringify(categories));
}

async function getSettings() {
  await connectDB();
  const settings = await StoreSettings.findOne().lean();
  return JSON.parse(JSON.stringify(settings));
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Clinical Bundles': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop',
  'Diagnostics': 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=2070&auto=format&fit=crop',
  'Surgery': 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop',
  'Kits': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop',
  'Default': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop'
};

export default async function Home() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = locale === 'en' ? en : ar;

  const [featuredProducts, categories, settings] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getSettings()
  ]);

  // JSON-LD Structured Data for Storefront Authority
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: locale === 'ar' ? 'عُدّة (عدة) - متجر طلاب طب الأسنان' : 'Odda - Dental Student Store',
    description: locale === 'ar' 
      ? 'متجر عُدّة (عدة) هو الخيار الأول لطلاب طب الأسنان في مصر لتوفير جميع الأدوات والمستلزمات.' 
      : 'Odda Store is the premier destination for dental students in Egypt for all clinical and preclinical supplies.',
    url: 'https://www.odda-store.com',
    logo: 'https://www.odda-store.com/logo.png',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.odda-store.com/products?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero hero={settings?.hero} locale={locale} />

      {/* Trust/Authority Banner */}
      <section className="border-b border-navy/10 py-6 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <ShieldCheck className="size-5 text-(--navy)/60 stroke-[2px]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]/70">{dict.home.trustedBy}</span>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Stethoscope className="size-5 text-(--navy)/60 stroke-[2px]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]/70">{dict.home.clinicalGrade}</span>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Truck className="size-5 text-(--navy)/60 stroke-[2px]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]/70">{dict.home.campusDelivery}</span>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Lock className="size-5 text-(--navy)/60 stroke-[2px]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]/70">{dict.home.securePayments}</span>
          </div>
        </div>
      </section>

      {/* 4. Shop By Category */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black mb-12 uppercase tracking-tight text-[var(--navy)]">{dict.home.shopByCategory}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {categories.slice(0, 4).map((cat: { _id: string; name: string; nameAr?: string; image?: string }) => {
            const catName = (locale === 'ar' && cat.nameAr) ? cat.nameAr : cat.name;
            return (
            <Link 
              key={cat._id}
              href={`/products?categoryId=${cat._id}`} 
              className="group relative aspect-square w-full h-full overflow-hidden cursor-pointer rounded-sm"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('${cat.image || CATEGORY_FALLBACK_IMAGES[cat.name] || CATEGORY_FALLBACK_IMAGES['Default']}')` 
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-bold uppercase tracking-tighter">{catName}</span>
              </div>
            </Link>
          )})}
          {categories.length === 0 && (
            <div className="col-span-full py-10 text-center text-muted-foreground uppercase text-xs font-bold tracking-widest">
              {dict.home.noCategories}
            </div>
          )}
        </div>
      </section>

      <BestSellers products={featuredProducts} />

      <HomeBundles />
    </>
  );
}
