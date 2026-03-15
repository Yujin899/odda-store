import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, 
  Instagram, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Truck
} from 'lucide-react';
import React from 'react';
import { cookies } from 'next/headers';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import { StoreSettings } from '@/models/StoreSettings';

async function getFooterData() {
  await connectDB();
  const [categories, settings] = await Promise.all([
    Category.find().limit(5).lean(),
    StoreSettings.findOne().lean()
  ]);
  return {
    categories: categories.map((cat: any) => ({
      id: cat._id.toString(),
      name: cat.name,
      nameAr: cat.nameAr,
      slug: cat.slug,
    })),
    settings: settings ? {
      id: settings._id.toString(),
      socialLinks: settings.socialLinks,
      whatsappNumber: settings.whatsappNumber,
      storeDescription: settings.storeDescription,
      storeDescriptionAr: settings.storeDescriptionAr,
    } : null
  };
}

export async function Footer() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const language = locale as 'en' | 'ar';
  const dict = language === 'en' ? en : ar;

  const { categories, settings } = await getFooterData();

  const fbLink = settings?.socialLinks?.facebook || "#";
  const igLink = settings?.socialLinks?.instagram || "#";
  const waNumber = settings?.whatsappNumber || "";
  const description = (language === 'ar' && settings?.storeDescriptionAr) 
    ? settings.storeDescriptionAr 
    : (settings?.storeDescription || dict.footer.defaultDescription);

  return (
    <footer className="w-full bg-navy pt-20 pb-10 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative h-10 w-32 filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity">
                <Image 
                  src="/logo.png" 
                  alt="Odda Logo" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 128px"
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed font-light max-w-sm">
              {description}
            </p>
            <div className="flex items-center gap-4">
              <Link href={fbLink} className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-(--primary) hover:border-(--primary) transition-all duration-300">
                <Facebook size={16} />
              </Link>
              <Link href={igLink} className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-(--primary) hover:border-(--primary) transition-all duration-300">
                <Instagram size={16} />
              </Link>
              {waNumber && (
                <Link href={`https://wa.me/${waNumber.replace(/\+/g, '').replace(/ /g, '')}`} target="_blank" className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-(--primary) hover:border-(--primary) transition-all duration-300">
                  <MessageCircle size={16} />
                </Link>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-(--primary)">{dict.common.quickLinks}</h4>
            <ul className="space-y-4">
              {[
                { label: dict.common.home, href: '/' },
                { label: dict.common.allProducts, href: '/products' },
                { label: dict.common.about, href: '/about' },
                { label: dict.common.trackOrder, href: '/order-tracking' }
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="group text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className={`size-3 opacity-0 ${language === 'ar' ? 'translate-x-2' : '-translate-x-2'} group-hover:opacity-100 group-hover:translate-x-0 transition-all text-(--primary) ${language === 'ar' ? 'rotate-180' : ''}`} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-(--primary)">{dict.common.categories}</h4>
            <ul className="space-y-4">
              {categories.length > 0 ? categories.map((cat: any) => (
                <li key={cat.id}>
                  <Link 
                    href={`/products?category=${cat.slug}`} 
                    className="group text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className={`size-3 opacity-0 ${language === 'ar' ? 'translate-x-2' : '-translate-x-2'} group-hover:opacity-100 group-hover:translate-x-0 transition-all text-(--primary) ${language === 'ar' ? 'rotate-180' : ''}`} />
                    {language === 'ar' && cat.nameAr ? cat.nameAr : cat.name}
                  </Link>
                </li>
              )) : (
                <li className="text-sm text-white/20 italic">{dict.footer.loadingCategories}</li>
              )}
            </ul>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.2em]">
              © 2026 Odda Store. {dict.common.allRightsReserved}.
            </p>
            <div className="flex items-center gap-4 opacity-30">
              <span className="text-[9px] uppercase font-bold tracking-[0.3em]">{dict.footer.builtForExcellence}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-6">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 rounded-sm border border-white/10 group hover:border-(--primary)/50 transition-colors">
              <ShieldCheck size={14} className="text-(--primary)" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{dict.footer.fullySecured}</span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 rounded-sm border border-white/10 group hover:border-(--primary)/50 transition-colors">
              <CreditCard size={14} className="text-(--primary)" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{dict.footer.instaPayReady}</span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-(--primary)/10 border border-(--primary)/20 rounded-sm">
              <Truck size={14} className="text-(--primary)" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white">{dict.footer.campusExpress}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
