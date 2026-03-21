'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { 
  Menu, 
  LogOut, 
  User as UserIcon, 
  ShoppingBag, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings 
} from 'lucide-react';
import { MobileBottomNav } from '@/components/shared/MobileBottomNav';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import Link from 'next/link';
import NextImage from 'next/image';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

interface DashboardLayoutProps {
  children: React.ReactNode;
  session: Session;
}

export default function DashboardLayout({ children, session }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  return (
    <div className="min-h-screen bg-slate-50 flex transition-all duration-300" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar - Handles both Desktop and Mobile Drawer */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        excludeHrefs={['/dashboard', '/dashboard/orders', '/dashboard/products']}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ms-60 transition-all duration-300">
        {/* Topbar - Hidden on Mobile */}
        <header className="h-16 bg-white border-b border-slate-200 hidden md:flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ms-2 text-slate-500 hover:text-(--navy) hover:bg-slate-50 rounded-sm transition-colors outline-none cursor-pointer border-none bg-transparent"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {dict.dashboard.topbarTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">

            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                  <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden ring-2 ring-white shadow-sm">
                    {session.user?.image ? (
                        <NextImage 
                          src={session.user.image} 
                          alt={session.user.name || ''} 
                          width={32} 
                          height={32} 
                          className="size-full object-cover" 
                        />
                    ) : (
                        <UserIcon className="size-4 text-slate-400" />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 shadow-2xl border-slate-200 bg-white" align="end">
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[11px] font-black uppercase tracking-tight leading-none text-(--navy)">{session.user?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate leading-none">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem className="p-3 cursor-pointer focus:bg-slate-50 group" asChild>
                  <Link href="/" className="flex items-center gap-3">
                    <ShoppingBag className="size-4 text-slate-400 group-hover:text-(--primary) transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{dict.dashboard.backToStore}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem 
                  className="p-3 cursor-pointer focus:bg-red-50 text-red-600 focus:text-red-700 group"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="size-4 text-red-400 group-hover:text-red-600 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{dict.dashboard.signOut}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-get-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Mobile Navigation */}
        <MobileBottomNav 
          items={[
            { 
              label: 'Overview', 
              labelAr: dict.dashboard.sidebar.overview, 
              icon: LayoutDashboard, 
              href: '/dashboard', 
              isActive: pathname === '/dashboard' 
            },
            { 
              label: 'Orders', 
              labelAr: dict.dashboard.sidebar.orders, 
              icon: ShoppingCart, 
              href: '/dashboard/orders', 
              isActive: pathname.startsWith('/dashboard/orders') 
            },
            { 
              label: 'Products', 
              labelAr: dict.dashboard.sidebar.products, 
              icon: Package, 
              href: '/dashboard/products', 
              isActive: pathname.startsWith('/dashboard/products') 
            },
            { 
              label: 'Customers', 
              labelAr: dict.dashboard.sidebar.customers, 
              icon: Users, 
              href: '/dashboard/customers', 
              isActive: pathname.startsWith('/dashboard/customers') 
            },
            { 
              label: 'Settings', 
              labelAr: dict.dashboard.sidebar.settings, 
              icon: Settings, 
              href: '/dashboard/settings', 
              isActive: pathname.startsWith('/dashboard/settings') 
            },
            { 
              label: 'More', 
              labelAr: dict.profile.more, 
              icon: Menu, 
              onClick: () => setIsSidebarOpen(true) 
            },
          ]} 
          isAr={language === 'ar'} 
        />
      </div>
    </div>
  );
}
