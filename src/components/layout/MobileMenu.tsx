'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { useMobileMenuStore } from '@/store/useMobileMenuStore';
import { useSession, signOut } from 'next-auth/react';

export function MobileMenu() {
  const { isOpen, close } = useMobileMenuStore();
  const { data: session } = useSession();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Track Order', href: '/order-tracking' },
  ];

  if (!session) {
    navLinks.push({ name: 'Login', href: '/login' });
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, duration: 0.25 }}
            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-background z-[101] md:hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-navy/10">
              <Link href="/" onClick={close} className="flex items-center gap-2">
                <Image src="/logo.png" alt="Odda Logo" width={80} height={28} className="object-contain" />
              </Link>
              <button 
                onClick={close}
                className="p-2 rounded-[var(--radius)] text-navy hover:bg-navy/5 transition-colors border-none outline-none cursor-pointer bg-transparent"
              >
                <X className="size-6 stroke-[2.5px]" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={close}
                  className="flex items-center justify-between p-4 rounded-(--radius) text-lg font-black uppercase tracking-tight text-foreground hover:bg-slate-50 hover:text-(--primary) transition-all"
                >
                  {link.name}
                  <ChevronRight className="size-5 opacity-30" />
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-navy/10 space-y-4">
              {session && (
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-3 px-2 mb-2">
                    {session.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || 'User'} 
                        width={32} 
                        height={32} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className="bg-(--primary)/10 text-(--primary) size-8 rounded-full flex items-center justify-center font-bold text-sm uppercase">
                        {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold truncate text-foreground">{session.user?.name || 'User'}</p>
                       <p className="text-[10px] text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/orders"
                    onClick={close}
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-sm bg-slate-50 text-foreground text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      close();
                      signOut({ callbackUrl: '/' });
                    }}
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-sm bg-red-50 text-red-600 border-none outline-none cursor-pointer text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">
                Odda | Premium Dental Tools
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
