'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminFloatingButton() {
  const { data: session } = useSession();

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Link 
          href="/dashboard"
          className="flex items-center justify-center size-14 rounded-full bg-[var(--navy)] text-white shadow-xl hover:bg-[var(--primary)] transition-colors group relative"
        >
          <LayoutDashboard className="size-6 stroke-[2px]" />
          
          {/* Tooltip */}
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[var(--navy)] text-white text-xs font-bold uppercase tracking-widest rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Admin Dashboard
          </span>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
