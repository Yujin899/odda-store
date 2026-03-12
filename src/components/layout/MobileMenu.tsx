'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { useMobileMenuStore } from '@/store/useMobileMenuStore';

export function MobileMenu() {
  const { isOpen, close } = useMobileMenuStore();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Login', href: '/login' },
  ];

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
            <div className="p-8 border-t border-navy/10">
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
