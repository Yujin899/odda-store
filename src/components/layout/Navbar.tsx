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
import { auth } from '@/auth';

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
  const session = await auth();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <header className="relative md:sticky md:top-0 z-40 px-6 lg:px-12 py-4 bg-background shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Segment: Logo (Mobile/Desktop) / Menu (Medium) */}
        <div className="flex-1 flex items-center lg:flex-none shrink-0">
          {/* Menu Trigger - Visible ONLY on Medium screens */}
          <div className="hidden md:block lg:hidden">
            <NavbarMobileMenuTrigger />
          </div>

          {/* Logo - Visible on Mobile (< md) and Desktop (lg+) */}
          <div className="md:hidden lg:block shrink-0">
            <Link href="/" className="shrink-0 flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Odda Logo" 
                width={160} 
                height={50} 
                priority
                unoptimized
                className="object-contain w-[90px] h-[40px] min-w-[90px] min-h-[40px] lg:w-[160px] lg:h-[50px] transition-all duration-300" 
              />
            </Link>
          </div>
        </div>

        {/* Center Segment: Logo (Medium) / Nav Links (Desktop) */}
        <div className="flex-2 flex items-center justify-center">
          {/* Logo - Visible ONLY on Medium screens (md to lg) */}
          <div className="hidden md:block lg:hidden">
            <Link href="/" className="shrink-0 flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Odda Logo" 
                width={140} 
                height={44} 
                priority
                unoptimized
                className="object-contain w-[90px] h-[40px] min-w-[90px] min-h-[40px] transition-all duration-300" 
              />
            </Link>
          </div>

          {/* Desktop Nav Links (lg+) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0">
            <Link href="/" className="text-sm font-semibold text-navy hover:text-primary transition-colors whitespace-nowrap">{dict.common.home}</Link>
            
            <NavbarCategoryDropdown categories={categories} dict={dict} language={language} />

            <Link href="/profile" className="text-sm font-semibold text-navy hover:text-primary transition-colors whitespace-nowrap">{dict.common.profile || 'Profile'}</Link>
            <Link href="/order-tracking" className="text-sm font-semibold text-navy hover:text-primary transition-colors whitespace-nowrap">{dict.common.trackOrder}</Link>
            <Link href="/bundles" className="text-sm font-bold text-emerald-600 hover:text-emerald-500 transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <Gift className="size-3.5" />
              {dict.common.offersAndBundles}
            </Link>
            {isAdmin && (
              <Link href="/dashboard" className="text-sm font-semibold text-navy hover:text-primary transition-colors whitespace-nowrap">
                {dict.common.dashboard || 'Dashboard'}
              </Link>
            )}
            <Link href="/about" className="text-sm font-semibold text-navy hover:text-primary transition-colors whitespace-nowrap">{dict.common.about}</Link>
          </nav>
        </div>

        {/* Right Segment: Actions */}
        <div className="flex-1 flex items-center justify-end gap-1 sm:gap-2 shrink-0">
          <NavbarSearchTrigger />
          <LanguageSwitcher />

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
