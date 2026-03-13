'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  ArrowLeft,
  Tags,
  Grid,
  Settings,
  Gift,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  excludeHrefs?: string[];
}

export function Sidebar({ isOpen, onClose, excludeHrefs = [] }: SidebarProps) {
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  const getSidebarContent = (customExcludes: string[] = []) => {
    const navItems = [
      { label: dict.dashboard.sidebar.overview, href: '/dashboard', icon: LayoutDashboard },
      { label: dict.dashboard.sidebar.products, href: '/dashboard/products', icon: Package },
      { label: dict.dashboard.sidebar.bundles, href: '/dashboard/bundles', icon: Gift },
      { label: dict.dashboard.sidebar.categories, href: '/dashboard/categories', icon: Grid },
      { label: dict.dashboard.sidebar.badges, href: '/dashboard/badges', icon: Tags },
      { label: dict.dashboard.sidebar.orders, href: '/dashboard/orders', icon: ShoppingCart },
      { label: dict.dashboard.sidebar.customers, href: '/dashboard/customers', icon: Users },
      { label: dict.dashboard.sidebar.settings, href: '/dashboard/settings', icon: Settings },
    ].filter(item => !customExcludes.includes(item.href));

    return (
      <div className={`h-full flex flex-col bg-(--navy) text-background ${language === 'ar' ? 'border-l' : 'border-r'} border-white/10 shadow-2xl`}>
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <Link href="/" className="flex items-center gap-2 outline-none group" onClick={onClose}>
            <Image
              src="/logo.png"
              alt="Odda Logo"
              width={100}
              height={36}
              className="object-contain filter brightness-0 invert"
              priority
            />
          </Link>
          <button 
            onClick={onClose}
            className={`${language === 'ar' ? '-ml-2' : '-mr-2'} md:hidden p-2 text-white/60 hover:text-white transition-colors outline-none cursor-pointer bg-transparent border-none`}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-sm transition-all outline-none group ${
                  isActive 
                    ? 'bg-(--primary) text-white shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title={item.label}
              >
                <Icon className={`size-5 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Action */}
        <div className="p-3 border-t border-white/10 shrink-0">
          <Link 
            href="/"
            className="flex items-center gap-3 px-3 py-3 rounded-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors outline-none"
            title="Back to Store"
          >
            <ArrowLeft className={`size-5 shrink-0 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{dict.dashboard.sidebar.storefront}</span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar - Shows All Links */}
      <aside className={`fixed inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-20 w-60 hidden md:flex flex-col`}>
        {getSidebarContent([])}
      </aside>

      {/* Mobile Drawer - Filters redundant links */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 md:hidden"
            />
            <motion.aside
              initial={{ x: language === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: language === 'ar' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-70 w-72 md:hidden`}
            >
              {getSidebarContent(excludeHrefs)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
