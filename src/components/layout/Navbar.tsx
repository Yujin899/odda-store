import Link from 'next/link';
import Image from 'next/image';
import { Gift } from 'lucide-react';
import { cookies } from 'next/headers';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

// Import extracted Client Components
import { LanguageSwitcher } from './LanguageSwitcher';
import { NavbarSearchTrigger } from './NavbarSearchTrigger';
import { NavbarCartTrigger } from './NavbarCartTrigger';
import { NavbarUserDropdown } from './NavbarUserDropdown';
import { NavbarCategoryDropdown } from './NavbarCategoryDropdown';
import { NavbarMobileMenuTrigger } from './NavbarMobileMenuTrigger';

async function getCategories() {
  await connectDB();
  const categories = await Category.find().lean();
  return (categories as unknown as Array<{ _id: { toString(): string }, name: string, nameAr?: string, slug: string, description?: string, descriptionAr?: string, image?: string }>).map((cat) => ({
    id: cat._id.toString(),
    name: cat.name,
    nameAr: cat.nameAr,
    slug: cat.slug,
    description: cat.description || undefined,
    descriptionAr: cat.descriptionAr || undefined,
    image: cat.image || undefined,
  }));
}

export async function Navbar() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const language = locale as 'en' | 'ar';
  const dict = language === 'en' ? en : ar;
  
  const categories = await getCategories();

  return (
    <header className="relative md:sticky md:top-0 z-40 border-b border-navy/10 px-6 lg:px-12 py-4 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Main Content Area: Logo + Desktop Nav */}
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-12">
            {/* Mobile Menu Trigger - Hidden on mobile, only on desktop if needed, but usually redundant if bottom nav is present */}
            <div className="hidden md:block">
              <NavbarMobileMenuTrigger />
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Odda Logo" 
                width={100} 
                height={36} 
                priority
                unoptimized
                className="object-contain w-[80px] sm:w-[100px]" 
              />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">{dict.common.home}</Link>
              
              <NavbarCategoryDropdown categories={categories} dict={dict} language={language} />

              <Link href="/profile" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">{dict.common.profile || 'Profile'}</Link>
              <Link href="/order-tracking" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">{dict.common.trackOrder}</Link>
              <Link href="/bundles" className="text-sm font-bold text-emerald-600 hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                <Gift className="size-3.5" />
                {dict.common.offersAndBundles}
              </Link>
              <Link href="/about" className="text-sm font-semibold text-navy hover:text-(--primary) transition-colors">{dict.common.about}</Link>
            </nav>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-6">
          <NavbarSearchTrigger dict={dict} />

          <div className="hidden lg:block border-l border-navy/10 h-6 mx-2" />
          <LanguageSwitcher />
          <div className="hidden lg:block border-r border-navy/10 h-6 mx-2" />

          {/* User Area */}
          <NavbarUserDropdown dict={dict} />

          {/* Cart Area - Hidden on mobile, handled by Bottom Nav */}
          <div className="hidden md:flex">
            <NavbarCartTrigger />
          </div>
        </div>
      </div>
    </header>
  );
}
