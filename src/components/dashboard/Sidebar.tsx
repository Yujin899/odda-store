'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  ArrowLeft,
  Tags,
  Grid,
  Bell,
  Settings
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'Categories', href: '/dashboard/categories', icon: Grid },
  { label: 'Badges', href: '/dashboard/badges', icon: Tags },
  { label: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-16 md:w-60 bg-(--navy) text-background flex flex-col transition-all duration-300 border-r border-(--navy)/10 shadow-2xl">
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-white/10 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 outline-none">
          <div className="size-8 bg-(--primary) rounded-sm flex items-center justify-center font-black text-white shrink-0">
            O
          </div>
          <span className="font-black text-lg tracking-tighter uppercase hidden md:block mt-0.5">Odda</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-sm transition-colors outline-none ${
                isActive 
                  ? 'bg-(--primary) text-white shadow-lg' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              title={item.label}
            >
              <Icon className="size-5 shrink-0" />
              <span className="text-sm font-bold uppercase tracking-widest hidden md:block">
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
          <ArrowLeft className="size-5 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
