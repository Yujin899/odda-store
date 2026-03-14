'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User as UserIcon, LogOut, Package } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export function NavbarUserDropdown({ dict }: { dict: any }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session) {
    return (
      <Link 
        href="/login"
        className="hidden md:flex p-2 rounded-sm text-navy hover:bg-navy/5 transition-colors items-center justify-center font-semibold text-sm"
      >
        {dict.common.login}
      </Link>
    );
  }

  return (
    <div className="relative hidden md:flex" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex p-[0.35rem] rounded-full hover:bg-navy/5 transition-colors items-center justify-center border border-navy/10 bg-white"
        aria-label="Account Settings"
      >
        {session.user?.image ? (
          <Image 
            src={session.user.image} 
            alt={session.user.name || 'User'} 
            width={28} 
            height={28} 
            className="rounded-full"
          />
        ) : (
          <div className="bg-(--primary)/10 text-(--primary) size-7 rounded-full flex items-center justify-center font-bold text-xs uppercase">
            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
          </div>
        )}
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-(--radius) shadow-lg overflow-hidden py-1 z-50"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground truncate">
                {session.user?.name || dict.profile.userPlaceholder}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session.user?.email}
              </p>
            </div>
            
            <div className="py-1">
              <Link 
                href="/profile" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-semibold"
              >
                <UserIcon className="size-4" />
                {dict.common.profile || 'Profile'}
              </Link>
              <Link 
                href="/orders" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Package className="size-4" />
                {dict.common.myOrders}
              </Link>
            </div>

            <div className="border-t border-border py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full text-left transition-colors"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <LogOut className="size-4" />
                {dict.common.logout}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
