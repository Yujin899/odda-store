import Link from 'next/link';
import { 
  ShieldCheck, 
  Stethoscope, 
  Truck, 
  Lock
} from 'lucide-react';
import { Hero } from '@/components/home/Hero';
import { BestSellers } from '@/components/home/BestSellers';
import { Testimonials } from '@/components/home/Testimonials';

async function getFeaturedProducts() {
  const res = await fetch(`${process.env.AUTH_URL || 'http://localhost:3000'}/api/products?featured=true&limit=8`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.products || [];
}

async function getCategories() {
  const res = await fetch(`${process.env.AUTH_URL || 'http://localhost:3000'}/api/categories`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.categories || [];
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Student Bundles': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop',
  'Diagnostics': 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=2070&auto=format&fit=crop',
  'Surgery': 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop',
  'Kits': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop',
  'Default': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop'
};

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ]);

  return (
    <>
      <Hero />

      {/* Trust/Authority Banner */}
      <section className="border-b border-navy/10 py-6 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <ShieldCheck className="size-5 text-(--navy)/60 stroke-[2px]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]/70">Trusted by Dental Students</span>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Stethoscope className="size-5 text-(--navy)/60 stroke-[2px]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]/70">Clinical Grade Quality</span>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Truck className="size-5 text-(--navy)/60 stroke-[2px]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]/70">Campus Delivery</span>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Lock className="size-5 text-(--navy)/60 stroke-[2px]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]/70">Secure Payments</span>
          </div>
        </div>
      </section>

      {/* 4. Shop By Category */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black mb-12 uppercase tracking-tight text-[var(--navy)]">Shop By Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {categories.slice(0, 4).map((cat: any) => (
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
                <span className="text-white text-xl font-bold uppercase tracking-tighter">{cat.name}</span>
              </div>
            </Link>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full py-10 text-center text-muted-foreground uppercase text-xs font-bold tracking-widest">
              No categories found
            </div>
          )}
        </div>
      </section>

      <BestSellers products={featuredProducts} />

      <Testimonials />
    </>
  );
}
